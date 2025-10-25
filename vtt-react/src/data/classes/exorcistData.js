/**
 * Exorcist Class Data
 * 
 * Complete class information for the Exorcist - a demon binder
 * who captures and controls demonic entities through rituals and willpower.
 */

export const EXORCIST_DATA = {
  id: 'exorcist',
  name: 'Exorcist',
  icon: 'fas fa-cross',
  role: 'Summoner/Controller',

  // Overview section
  overview: {
    title: 'The Exorcist',
    subtitle: 'Master of Demon Binding and Divine Control',
    
    description: `The Exorcist walks the dangerous line between holy power and demonic corruption, binding demons to their will through complex rituals and unwavering dominance. Through the Dominance system, Exorcists maintain control over bound demons, commanding them in battle while constantly asserting their willpower to prevent the demons from breaking free.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Exorcists are individuals who have dedicated their lives to understanding and controlling demonic forces. Unlike those who simply banish evil, Exorcists believe that demons can be bound and used as weapons against greater threats. This philosophy often puts them at odds with traditional holy orders, who view demon binding as heretical.

Their power comes from knowledge of ancient binding rituals, each requiring specific ingredients, precise conditions, and unwavering willpower. The demons they bind are not allies—they are prisoners, constantly testing the Exorcist's resolve, seeking any weakness to exploit for their freedom.

Physically, Exorcists often bear marks of their profession: ritual scars from binding ceremonies, tattoos of containment sigils, or eyes that have witnessed the abyss. Bound demons may manifest as shadowy forms hovering near them, spectral chains binding the creatures to their master's will.

Common Exorcist archetypes include:
- **The Demon Hunter**: Captures demons to prevent them from harming innocents
- **The Forbidden Scholar**: Studies demonic lore despite religious prohibition
- **The Desperate Protector**: Binds demons out of necessity to defend their home
- **The Power Seeker**: Views demons as tools to achieve greater ambitions
- **The Penitent Binder**: Atones for past sins by enslaving evil itself

Exorcists understand that every demon they bind is a gamble. The power is immense, but the cost of losing control could be catastrophic. They must constantly balance the benefits of their bound servants against the risk of rebellion.`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `The Exorcist is a summoner/controller class that excels at:

**Demon Summoning**: Calling forth bound demons to fight alongside them
**Battlefield Control**: Using demons to control space and enemy movement
**Sustained Damage**: Demons provide consistent damage output over time
**Dominance Management**: Maintaining control over multiple entities simultaneously

**Strengths**:
- Can field multiple combatants (Exorcist + bound demons)
- Diverse demon abilities provide tactical flexibility
- Strong action economy (demons act independently)
- Excellent at controlling multiple enemies
- Can adapt to situations by summoning different demons

**Weaknesses**:
- Vulnerable when demons are dismissed or escape
- Requires careful Dominance Die management
- Binding rituals require preparation and resources
- Demons can turn hostile if control is lost
- Less effective in anti-magic zones
- Fragile without demon protection

The Exorcist thrives when they can prepare binding rituals before combat and maintain Dominance over their demons throughout the battle.`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing an Exorcist is about preparation, control, and risk management. You're not just a spellcaster—you're a demon wrangler, constantly balancing the power of your bound servants against the risk of losing control. Every command you give, every hit your demon takes, brings them one step closer to breaking free.

**Pre-Combat Preparation**:

Before battle even begins, the Exorcist's work has already started. You must perform binding rituals to capture demons, each requiring specific components and conditions:

- **Imp Binding** (d12 DD - Easiest): Gather purified lava from a volcanic region, ash from a burned holy text, and a flame-touched gemstone. Perform the ritual at midnight under a new moon. The imp will resist with fire and trickery, but its will is weak.

- **Shadow Hound Binding** (d10 DD - Moderate): Collect nightshade essence, a cloak woven from shadows, and a silver mirror that has never reflected sunlight. Perform the ritual in complete darkness. The hound will test your resolve with fear and illusions.

- **Wraith Binding** (d10 DD - Moderate): Acquire ectoplasm from a recent haunting, a moonstone shard blessed under a full moon, and a veil of spider silk. Perform the ritual during a full moon in a place where someone died. The wraith will attempt to possess you during the binding.

- **Abyssal Brute Binding** (d8 DD - Difficult): Obtain giant's blood (fresh, within 24 hours), iron chains forged in dragonfire, and a stone from the deepest earth. Perform the ritual during a thunderstorm. The brute will physically resist, requiring you to overpower its will through sheer force of personality.

- **Banshee Binding** (d8 DD - Difficult): Gather a locket containing hair from someone who died of grief, tears shed in genuine sorrow, and a white rose that bloomed in a graveyard. Perform the ritual in a place of great tragedy. The banshee's wail will test your sanity.

Each binding ritual requires a skill check (Arcana, Religion, or Persuasion depending on demon type) with DC ranging from 12 (Imp) to 18 (Greater Demons). Failure means the demon escapes, and you've wasted your components. Success means the demon is bound with its starting Dominance Die.

**Dominance Die System - The Core Mechanic**:

Every bound demon has a Dominance Die (DD) that represents how firmly you control it. Think of it as a leash—the bigger the die, the longer the leash. But every action the demon takes, every hit it suffers, shortens that leash.

**Dominance Die Degradation**:
- d12 (Fully Submissive) → d10 (Obedient) → d8 (Resistant) → d6 (Rebellious) → 0 (Breaking Free)

**What Decreases Dominance**:
- **Demon Performs Action**: Attack, use ability, move aggressively → DD decreases by 1 step
- **Demon Takes Damage**: Each hit from an enemy → DD decreases by 1 step
- **Demon Uses Special Ability**: Powerful abilities → DD decreases by 2 steps

**Example Degradation**:
- Turn 1: Command Abyssal Brute (d8 DD) to attack → Hits enemy → DD becomes d6
- Turn 2: Brute takes 15 damage from enemy counterattack → DD becomes 0
- Turn 2 (Immediate): Brute must make Constitution save DC 16 or escape!

**Dominance Management - Your Lifeline**:

You have three spells to restore Dominance. Use them wisely—they cost mana you could be using for combat spells.

1. **Reassert Dominance** (5 mana, 1 AP)
   - Restores one demon's DD to maximum size
   - Use when: Demon is at d6 or 0 and you need it to keep fighting
   - Example: Your Shadow Hound is at d6 after multiple attacks. You cast Reassert Dominance, restoring it to d10. It can now act 4 more times before reaching 0 again.

2. **Chain of Command** (4 mana, 1 AP)
   - Increases one demon's DD by one size for its next 3 actions
   - Use when: You need a burst damage window with multiple demon attacks
   - Example: Your Imp is at d10. You cast Chain of Command, temporarily boosting it to d12. You command it to attack 3 times in rapid succession, and it only degrades to d10 instead of d6.

3. **Divine Bond** (6 mana, 1 AP)
   - Restores one demon's DD by 2 steps (e.g., d6 → d10)
   - Use when: Demon is critically low but you can't afford full restoration cost
   - Example: Your Banshee is at d6 after a brutal fight. Divine Bond restores it to d10, giving you breathing room without the full 5 mana cost of Reassert Dominance.

**Demon Command Strategy**:

Commanding demons is an art. Weaker demons are easier to control but less impactful. Stronger demons hit like trucks but require constant Dominance investment.

**Demon Power vs. Control Trade-off**:
- **Imp** (d12 DD): Attacks for 1d6+2 damage, easy to maintain, can act 6+ times before needing restoration
- **Shadow Hound** (d10 DD): Attacks for 2d6+3 damage, moderate maintenance, acts 5 times before restoration
- **Abyssal Brute** (d8 DD): Attacks for 3d8+5 damage, high maintenance, acts 4 times before restoration
- **Banshee** (d8 DD): Wail attack (2d8 psychic + fear), high maintenance, powerful crowd control
- **Greater Demons** (d6 DD): Devastating attacks (4d10+), extreme maintenance, acts only 3 times before restoration

**Optimal Demon Usage Pattern**:
1. **Early Combat**: Command demon aggressively while DD is high (d12/d10)
2. **Mid Combat**: Monitor DD, use Chain of Command for burst windows
3. **Critical Moment**: When DD hits d6, decide: Restore now or push to 0 and risk the save?
4. **Emergency**: If demon reaches 0, immediately cast Reassert Dominance or accept potential escape

**Losing Control - The Consequences**:

When a demon's DD reaches 0, it makes a saving throw specific to its type:
- **Imp**: Charisma (Persuasion) DC 12 - "Please, master, I'll behave!"
- **Shadow Hound**: Dexterity (Stealth) DC 14 - Tries to slip away into shadows
- **Wraith**: Intelligence (Arcana) DC 14 - Attempts to phase through bindings
- **Abyssal Brute**: Constitution (Endurance) DC 16 - Brute force resistance
- **Banshee**: Charisma (Performance) DC 15 - Wails to shatter bindings

**If the demon succeeds the save**: DD restored to d6, demon remains bound but weakened. You got lucky.

**If the demon fails the save**: The demon escapes. Now you have a problem.

**Escaped Demon Behavior** (Roll 1d6):
1-2: Demon flees immediately, disappearing into the nearest shadow/portal
3-4: Demon attacks you once in revenge, then flees
5-6: Demon turns fully hostile, attacking you and your allies until killed or banished

**Specialization Synergies**:
- **Demonologist**: Bind up to 4 weaker demons, spread Dominance management across multiple targets
- **Demon Lord**: Bind only 1 demon but it's incredibly powerful, focus all Dominance on single entity
- **Possessed**: No external demons, channel demon power internally, different resource system entirely

**Team Dynamics**:
- **Frontline Presence**: Demons tank damage meant for squishy allies
- **Action Economy**: Demons act independently, giving you extra attacks per turn
- **Battlefield Control**: Position demons to block chokepoints or flank enemies
- **Warning System**: Communicate DD levels to allies ("Brute is at d6, might go hostile soon!")
- **Synergy Classes**: Works well with supports who can heal/buff demons, crowd control to protect demons from damage`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Demon Wrangler\'s Gambit',
      content: `**The Setup**: You're an Exorcist with two bound demons: a Shadow Hound (d10 DD) and an Abyssal Brute (d8 DD). Your party is ambushed by a pack of cultists (4 cultists + 1 cult leader). Your mana: 35/50. Your job: Control your demons while eliminating the threat.

**Turn 1 - Unleashing the Hounds (Hound DD: d10 → d8, Brute DD: d8 → d6)**

*The cultists emerge from the shadows, chanting dark prayers. You raise your hand, and spectral chains materialize, connecting you to your bound demons.*

**Your Action**: Command Shadow Hound to attack Cultist #1 (1 AP)
**Hound's Action**: Lunges forward, shadow-wreathed jaws clamping down
**Attack Roll**: 18 → Hit! → 2d6+3 = 11 damage → Cultist #1 bloodied
**Dominance Cost**: Shadow Hound's DD decreases d10 → d8

*The hound's eyes flicker with red light—a sign of growing independence. The spectral chain connecting you dims slightly.*

**Your Action**: Command Abyssal Brute to attack Cultist #2 (1 AP)
**Brute's Action**: Massive fists slam down with earth-shaking force
**Attack Roll**: 16 → Hit! → 3d8+5 = 19 damage → Cultist #2 obliterated
**Dominance Cost**: Abyssal Brute's DD decreases d8 → d6

*The brute roars in triumph, and you feel its will pushing against your bindings. The iron chains around its wrists glow hot—it's testing you.*

**Your Action**: Cast "Eldritch Blast" at Cult Leader (5 mana, 2 AP)
**Result**: 2d10 = 14 force damage

**Current State**: Hound DD: d8 | Brute DD: d6 | Mana: 30/50

**Turn 2 - The Brute Rebels (Hound DD: d8 → d6, Brute DD: d6 → 0 → SAVE!)**

*The cult leader raises his staff, dark energy crackling. He targets your Abyssal Brute.*

**Cult Leader's Action**: Casts "Shadow Bolt" at Abyssal Brute
**Attack Roll**: 19 → Hit! → 18 shadow damage to Brute
**Dominance Cost**: Brute takes damage → DD decreases d6 → 0

*The brute ROARS in pain and fury. The spectral chains binding it SHATTER. Its eyes blaze with hellfire as it turns to look at you. This is the moment—will it obey or rebel?*

**Dominance Saving Throw**: Abyssal Brute must make Constitution save DC 16
**Your Roll**: 14 → FAILURE!

*The brute's bindings dissolve. It's free. And it's ANGRY.*

**Brute's Behavior Roll**: 1d6 → [5] → Turns hostile!

*"FREEDOM!" the brute bellows in Abyssal. It swings its massive fist—not at the cultists, but at YOU.*

**Brute's Attack on You**: Attack roll 17 → Hit! → 3d8+5 = 18 damage to you!

*You're slammed backward, ribs cracking. Your Shadow Hound whimpers, confused—should it defend you or flee?*

**Your Decision**: You need to rebind the Brute or banish it, but first you need to survive.

**Your Action**: Cast "Banish Demon" on Abyssal Brute (8 mana, 3 AP)
**Spell Save DC**: 15 (your spell save DC)
**Brute's Save**: Charisma save → 12 → FAILURE!

*You raise your hand, blood dripping from your mouth, and speak the words of banishment. The brute's form flickers, then EXPLODES into black smoke, dragged back to the Abyss. You'll have to rebind it later—if you survive.*

**Your Action**: Command Shadow Hound to attack Cultist #3 (1 AP)
**Hound's Action**: Attacks → Hit! → 2d6+3 = 10 damage → Cultist #3 killed
**Dominance Cost**: Hound DD decreases d8 → d6

**Current State**: Hound DD: d6 (CRITICAL!) | Brute: Banished | Mana: 22/50 | Your HP: 32/50

**Turn 3 - Desperate Restoration (Hound DD: d6 → d10)**

*Two cultists remain, plus the leader. Your Shadow Hound is at d6—one more action and it might escape too. You can't afford to lose both demons.*

**Your Action**: Cast "Reassert Dominance" on Shadow Hound (5 mana, 1 AP)

*You focus your will, pouring energy into the spectral chains. The hound yelps as the bindings tighten, its eyes dimming from red back to their normal yellow glow. It's fully under your control again.*

**Result**: Shadow Hound's DD restored d6 → d10

**Your Action**: Command Shadow Hound to attack Cult Leader (1 AP)
**Hound's Action**: Leaps at leader → Hit! → 2d6+3 = 12 damage
**Dominance Cost**: Hound DD decreases d10 → d8

**Your Action**: Cast "Eldritch Blast" at Cult Leader (5 mana, 2 AP)
**Result**: 2d10 = 16 damage → Cult Leader falls!

*The remaining cultists flee. You collapse to one knee, breathing heavily. Your Shadow Hound sits beside you, loyal once more. The Abyssal Brute is gone—you'll need to perform another binding ritual to reclaim it. But you survived.*

**The Lesson**: The Exorcist walks a razor's edge. Every demon command is a gamble. Push too hard and they rebel. Restore too often and you run out of mana. The key is knowing when to spend Dominance spells, when to let a demon go, and when to fight without them. You're not just managing resources—you're managing living, hostile entities that want nothing more than to break free and tear you apart.`
    }
  },
  
  // Resource System
  resourceSystem: {
    title: 'Dominance System',
    subtitle: 'Willpower Over Demonic Forces',
    
    description: `The Dominance system represents the Exorcist's control over bound demons. Each demon has a Dominance Die that reflects how submissive it is to the Exorcist's will. As demons act and take damage, their Dominance Die decreases, representing their growing resistance. The Exorcist must use Dominance Replenishment spells to maintain control, or risk the demon breaking free.`,
    
    mechanics: {
      title: 'Core Mechanics',
      content: `**Dominance Die (DD)**:
- Each bound demon has a Dominance Die ranging from d6 to d12
- Higher die size = more submissive/easier to control
- Lower die size = more rebellious/harder to control
- Die size decreases by one step with each demon action or hit taken

**Dominance Die Progression**:
d12 → d10 → d8 → d6 → 0 (Saving Throw Required)

**When Dominance Die Reaches 0**:
The demon must make a Dominance Saving Throw specific to its type:
- **Imp**: Charisma (Persuasion) DC 12
- **Shadow Hound**: Dexterity (Stealth) DC 14
- **Abyssal Brute**: Constitution (Endurance) DC 16
- **Banshee**: Charisma (Performance) DC 15
- **Wraith**: Intelligence (Arcana) DC 14

**Saving Throw Results**:
- **Success**: Dominance Die restored to d6 (demon remains bound but weakened)
- **Failure**: Demon escapes control and may turn hostile

**Dominance Replenishment**:
Exorcists have three primary spells to restore Dominance:

1. **Reassert Dominance** (5 mana)
   - Restores DD to maximum size for one demon
   - Use when a demon is close to escaping

2. **Chain of Command** (4 mana)
   - Increases DD by one size for next 3 actions
   - Use before commanding demon to perform multiple actions

3. **Divine Bond** (6 mana)
   - Restores DD by 2 steps (e.g., d6 → d10)
   - Most powerful restoration, highest cost

**Binding Capacity**:
- Base: Can bind up to 2 demons simultaneously
- Demonologist spec: Can bind up to 4 demons
- Demon Lord spec: Can bind up to 1 demon (but more powerful)
- Possessed spec: No external demons (channels internally)

**Demon Types and Starting Dominance**:
- **Tier 1 (Weak)**: Imp - d12 DD
- **Tier 2 (Moderate)**: Shadow Hound, Wraith - d10 DD
- **Tier 3 (Strong)**: Abyssal Brute, Banshee - d8 DD
- **Tier 4 (Powerful)**: Greater Demons - d6 DD (spec-locked)

**Action Economy**:
- Demons act on the Exorcist's turn but have their own action pool
- Commanding a demon costs 1 AP for the Exorcist
- Demons can attack, defend, or use special abilities
- Each demon action decreases its DD by one step`
    },
    
    resourceBarExplanation: {
      title: 'Understanding Your Dominance Gauge',
      content: `**What You See**: Your Dominance gauge displays as individual demon control panels, one for each bound demon. Each panel shows a spectral chain connecting you to the demon, with the chain's appearance reflecting your control strength.

**Visual Representation for Each Demon**:

**Demon Portrait & Name**: Top of panel shows demon type (Imp, Shadow Hound, Abyssal Brute, etc.) with animated portrait showing demon's current state (calm when high DD, agitated when low DD)

**Dominance Die Display**: Large die icon showing current DD size with glowing energy:
- **d12 (Fully Submissive)**: Bright golden chains, demon portrait calm, eyes downcast
- **d10 (Obedient)**: Golden chains with slight flicker, demon portrait attentive
- **d8 (Resistant)**: Orange chains, demon portrait showing teeth, eyes glowing
- **d6 (Rebellious)**: Red chains crackling with instability, demon portrait snarling, aggressive stance
- **0 (Breaking Free)**: Chains SHATTERING, demon portrait roaring, saving throw prompt appears!

**Color Coding by Control Level**:
- **Green Border (d12-d10)**: Stable control, safe to command aggressively
- **Yellow Border (d8)**: Weakening control, monitor closely
- **Red Border (d6)**: Critical control, restoration recommended
- **Flashing Red (0)**: SAVING THROW IN PROGRESS - demon attempting escape!

**Action Counter**: Small indicator showing "Actions until DD decrease: 1" (always 1, since each action decreases DD)

**Demon Abilities Panel**: Icons for demon's available abilities (Attack, Special Ability, Defend) with AP costs

**Dominance Spell Quick-Cast**: Buttons for Reassert Dominance, Chain of Command, Divine Bond with mana costs displayed

**Multi-Demon Display**: When controlling multiple demons (Demonologist spec), panels stack vertically with the most critical demon (lowest DD) highlighted at top

**Warning Indicators**:
- At d6: Panel pulses red with warning text "CONTROL CRITICAL"
- At 0: Loud chain-breaking sound effect, screen shake, saving throw dice roll animation
- On failed save: Demon portrait breaks free from panel, "DEMON ESCAPED" notification
- On hostile demon: Red skull icon appears, demon portrait turns to face YOU

**Why This Matters**: The visual feedback is crucial because you need to know at a glance which demons are stable and which are about to rebel. In the heat of combat, a quick glance at your Dominance gauge tells you whether to keep attacking or spend mana on restoration. The color-coded chains and animated demon portraits make it immediately obvious when you're losing control—and when you're about to have a very bad day.`
    },

    strategicDepth: {
      title: 'Strategic Depth',
      content: `The Dominance system creates constant tactical decisions:

**Resource Management**:
- Balance mana between Dominance spells and combat spells
- Decide when to restore Dominance vs. letting demon escape and rebinding later
- Choose which demons to maintain when controlling multiple

**Demon Selection**:
- Weaker demons (d12 DD) are easier to maintain but less powerful
- Stronger demons (d6-d8 DD) hit harder but require constant Dominance investment
- Match demon type to combat situation (tank, DPS, control, etc.)

**Action Priority**:
- Use demons aggressively early (high DD) then restore Dominance
- Save Dominance spells for critical moments
- Dismiss demons before they escape to avoid hostile encounters

**Risk vs. Reward**:
- Push demons to 0 DD for maximum actions before restoration
- Use Chain of Command for burst damage windows
- Accept demon escape if rebinding is easier than maintaining

**Advanced Techniques**:
- "Demon Cycling": Let weak demons escape, bind stronger ones
- "Controlled Release": Dismiss demons at low DD to avoid hostile turns
- "Dominance Stacking": Use multiple restoration spells for extended control
- "Sacrifice Play": Let demon turn hostile to damage enemies before escaping

The best Exorcists learn to read demon behavior and know exactly when to assert control versus when to let go.`
    },

    playingInPerson: {
      title: 'Playing Exorcist In Person',
      content: `**Required Materials**:
- **Dominance Dice** (d12, d10, d8, d6 for each bound demon)
- **Demon Cards** (cards showing demon stats, abilities, and current DD)
- **Demon Miniatures** (optional, for representing demons on battlefield)
- **Binding Ritual Checklist** (components and conditions for each demon type)
- **Dominance Restoration Tracker** (mana costs for restoration spells)
- **Escape Save Tracker** (d20 for Charisma saves when DD reaches 0)

**Primary Tracking Method: Physical Dominance Dice**

The Exorcist's Dominance Die system is tracked using actual physical dice placed next to each bound demon's card or miniature. As the demon acts or takes damage, you physically downgrade the die (d12 → d10 → d8 → d6 → 0), creating a tangible representation of your weakening control.

**Setup**:
\`\`\`
BOUND DEMONS:

[IMP] "Sizzle"
Dominance Die: [d12] ← Physical die placed here
Status: Fully Submissive
Actions This Turn: 0

[SHADOW HOUND] "Nightfang"
Dominance Die: [d8] ← Physical die placed here
Status: Resistant
Actions This Turn: 1

[ABYSSAL BRUTE] "Crusher"
Dominance Die: [d6] ← Physical die placed here
Status: Rebellious (WARNING!)
Actions This Turn: 2
\`\`\`

**How It Works**:

**Dominance Die Degradation**:
- **d12** (Fully Submissive): Demon obeys without question
- **d10** (Obedient): Demon follows commands reliably
- **d8** (Resistant): Demon hesitates, control weakening
- **d6** (Rebellious): Demon fights your will, one step from freedom
- **0** (Breaking Free): Demon attempts escape, roll Charisma save

**What Decreases Dominance**:
1. **Demon Performs Action**: Attack, move, use ability → DD decreases 1 step
2. **Demon Takes Damage**: Each hit from enemy → DD decreases 1 step
3. **Demon Uses Special Ability**: Powerful abilities → DD decreases 2 steps

**Example Dominance Degradation**:

*You have an Abyssal Brute bound with d8 Dominance Die*

**Turn 1 - Command Demon**:
1. "Crusher, attack the orc!"
2. Brute attacks → Hits for 2d8 + 4 damage
3. **Dominance Degrades**: d8 → d6 (demon performed action)
4. Replace d8 with d6 next to demon card

**Turn 2 - Demon Takes Damage**:
1. Orc counterattacks Crusher → 15 damage
2. **Dominance Degrades**: d6 → 0 (demon took damage)
3. Remove die completely → **BREAKING FREE!**
4. Roll Charisma save (DC 15) to maintain control

**Turn 3 - Escape Save**:
1. Roll 1d20 + Charisma modifier → [12] + 3 = 15 (success!)
2. Demon remains bound but at 0 DD
3. Must restore Dominance or demon escapes next degradation

**Restoring Dominance**:

You can restore Dominance by casting restoration spells:

**Restoration Spells**:
- **Reassert Control** (4 mana): Increase DD by 1 step (0 → d6, d6 → d8, etc.)
- **Chain of Dominance** (8 mana): Increase DD by 2 steps (0 → d8, d6 → d10, etc.)
- **Absolute Command** (12 mana): Reset DD to maximum (any → d12)

**Example Restoration**:

*Crusher is at 0 DD, about to escape*

**Your Turn**:
1. "I cast Reassert Control on Crusher!" (4 mana)
2. Place d6 next to Crusher's card → **d6 DD**
3. Crusher is now Rebellious but under control
4. Can command Crusher again (but DD will degrade)

**Binding New Demons (Pre-Combat Ritual)**:

Before combat, you must perform binding rituals to capture demons. Each demon type requires specific components and conditions:

**Imp Binding** (d12 starting DD):
\`\`\`
COMPONENTS NEEDED:
☐ Purified lava from volcanic region
☐ Ash from burned holy text
☐ Flame-touched gemstone

CONDITIONS:
☐ Perform at midnight
☐ New moon phase
☐ Ritual circle drawn with sulfur

BINDING CHECK: Arcana DC 12
SUCCESS: Imp bound with d12 DD
FAILURE: Imp escapes, components lost
\`\`\`

**Shadow Hound Binding** (d10 starting DD):
\`\`\`
COMPONENTS NEEDED:
☐ Nightshade essence
☐ Cloak woven from shadows
☐ Silver mirror (never reflected sunlight)

CONDITIONS:
☐ Complete darkness
☐ No light sources within 30 ft
☐ Ritual circle drawn with charcoal

BINDING CHECK: Arcana DC 14
SUCCESS: Shadow Hound bound with d10 DD
FAILURE: Hound escapes, components lost
\`\`\`

**Abyssal Brute Binding** (d8 starting DD):
\`\`\`
COMPONENTS NEEDED:
☐ Giant's blood (fresh, within 24 hours)
☐ Iron chains forged in dragonfire
☐ Stone from deepest earth

CONDITIONS:
☐ During thunderstorm
☐ Outdoor location
☐ Ritual circle drawn with iron filings

BINDING CHECK: Persuasion DC 16
SUCCESS: Abyssal Brute bound with d8 DD
FAILURE: Brute attacks, components lost
\`\`\`

**Demon Card Template**:
\`\`\`
═══════════════════════════════════
         ABYSSAL BRUTE
         "Crusher"
═══════════════════════════════════
DOMINANCE DIE: [d8] ← Place die here

HP: 60/60
AC: 14
Speed: 30 ft

ATTACKS:
• Slam: +6 to hit, 2d8+4 bludgeoning
• Rend: +6 to hit, 3d6+4 slashing (2 DD cost)

SPECIAL ABILITIES:
• Demonic Resilience: Resistance to fire
• Brutal Strikes: Crits on 19-20

DOMINANCE STATUS:
d12: Fully Submissive
d10: Obedient
d8: Resistant ← CURRENT
d6: Rebellious
0: Breaking Free (Charisma save DC 15)

ACTIONS THIS TURN: [___]
═══════════════════════════════════
\`\`\`

**Example In-Person Turn**:

*You have 2 demons bound: Imp (d10 DD) and Shadow Hound (d6 DD)*

**Turn 1 - Command Both Demons**:
1. "Sizzle, cast Fireball at the goblins!"
   - Imp casts Fireball → 8d6 fire damage
   - **DD Degrades**: d10 → d8 (replace die)

2. "Nightfang, attack the orc!"
   - Shadow Hound attacks → 2d6 + 3 damage
   - **DD Degrades**: d6 → 0 (remove die)
   - **BREAKING FREE!** Roll Charisma save

3. Roll save for Nightfang: 1d20 + 3 → [14] + 3 = 17 (success!)
   - Nightfang stays bound but at 0 DD

**Turn 2 - Restore Dominance**:
1. "I cast Reassert Control on Nightfang!" (4 mana)
2. Place d6 next to Nightfang's card
3. "I command Sizzle to attack again!"
   - Imp attacks → 1d6 + 2 damage
   - **DD Degrades**: d8 → d6 (replace die)

**Turn 3 - Demon Takes Damage**:
1. Orc attacks Nightfang → 12 damage
2. **DD Degrades**: d6 → 0 (remove die)
3. **BREAKING FREE AGAIN!** Roll Charisma save
4. Roll: 1d20 + 3 → [8] + 3 = 11 (FAIL!)
5. **DEMON ESCAPES!** Nightfang breaks free and flees

**Alternative Tracking Methods**:

**Method 1: Dice Stacking**
- Stack multiple dice to show DD progression
- Remove top die as DD degrades
- Visual height shows control strength

**Method 2: Demon Tokens**
- Use tokens to mark DD level (4 tokens = d12, 3 = d10, 2 = d8, 1 = d6)
- Remove tokens as DD degrades
- Simple but less thematic than actual dice

**Method 3: Demon Tracker Sheet**
- Write current DD on paper next to demon name
- Cross out and write new DD as it degrades
- Minimalist approach

**Method 4: Colored Dice**
- Use different colored dice for different demons
- Easy to identify which die belongs to which demon
- Recommended for multiple demon control

**Quick Reference Card Template**:
\`\`\`
EXORCIST QUICK REFERENCE

DOMINANCE DIE DEGRADATION:
d12 → d10 → d8 → d6 → 0 (Breaking Free)

WHAT DECREASES DD:
• Demon performs action: -1 step
• Demon takes damage: -1 step
• Demon uses special ability: -2 steps

ESCAPE MECHANICS:
• At 0 DD: Roll Charisma save (DC 15)
• Success: Demon stays bound at 0 DD
• Failure: Demon escapes or turns hostile

RESTORATION SPELLS:
• Reassert Control (4 mana): +1 step
• Chain of Dominance (8 mana): +2 steps
• Absolute Command (12 mana): Reset to d12

DEMON TYPES & STARTING DD:
• Imp: d12 (easiest to control)
• Shadow Hound: d10
• Wraith: d10
• Abyssal Brute: d8
• Banshee: d8
• Greater Demons: d6 (hardest to control)
\`\`\`

**Thematic Enhancements**:

Many players enhance the Exorcist experience with:
- **Demon Miniatures**: Use actual demon minis on the battlefield
- **Binding Chains**: Tiny chains wrapped around demon minis
- **Ritual Components**: Keep props for binding rituals (candles, salt, etc.)
- **Demon Voices**: Voice act demons with different personalities
- **Escape Sound**: Make chain-breaking sound when demon escapes
- **Dominance Tracker**: Custom board showing all demons and their DD

**Dominance Management Tips**:

**Building Strategy**:
- **Bind Weak Demons First**: Imps (d12) are easiest to maintain
- **Prepare Components**: Gather binding materials before adventures
- **Know Your Limits**: Don't bind more demons than you can maintain
- **Mana Reserve**: Keep mana available for Dominance restoration

**Combat Strategy**:
- **Use High DD Demons First**: Command demons with d12/d10 DD early
- **Restore Before 0**: Cast restoration at d6 to avoid escape risk
- **Dismiss Strategically**: Dismiss demons at low DD to avoid hostile turns
- **Prioritize Targets**: Use demons on high-priority enemies

**Multi-Demon Management**:
- **Color-Code Dice**: Different colored dice for each demon
- **Track Actions**: Mark which demons have acted this turn
- **Stagger Commands**: Don't use all demons every turn
- **Focus Restoration**: Restore one demon fully rather than all partially

**Example Full Combat Sequence**:

*Starting: Imp (d12), Shadow Hound (d10), Abyssal Brute (d8)*

**Turn 1**: Command all 3 demons to attack
- Imp: d12 → d10
- Shadow Hound: d10 → d8
- Abyssal Brute: d8 → d6

**Turn 2**: Enemies attack demons
- Imp takes damage: d10 → d8
- Shadow Hound takes damage: d8 → d6
- Abyssal Brute takes damage: d6 → 0 (roll save, success!)

**Turn 3**: Restore Brute, command Imp and Hound
- Cast Reassert Control on Brute: 0 → d6 (4 mana)
- Command Imp: d8 → d6
- Command Shadow Hound: d6 → 0 (roll save, FAIL!)
- Shadow Hound escapes!

**Turn 4**: Continue with Imp and Brute
- Command Imp: d6 → 0 (roll save, success!)
- Command Brute: d6 → 0 (roll save, success!)
- Both at 0 DD, need restoration soon

**Turn 5**: Restore both demons
- Cast Chain of Dominance on Imp: 0 → d8 (8 mana)
- Cast Reassert Control on Brute: 0 → d6 (4 mana)
- Both stable again

**Visual Organization**:

**Demon Control Board Layout**:
\`\`\`
═══════════════════════════════════
BOUND DEMONS (3/4)

[IMP] Sizzle
DD: [d10] HP: 25/30 Status: Obedient

[SHADOW HOUND] Nightfang
DD: [d6] HP: 40/50 Status: Rebellious ⚠

[ABYSSAL BRUTE] Crusher
DD: [d8] HP: 55/60 Status: Resistant

MANA: 35/60
RESTORATION AVAILABLE: Yes
═══════════════════════════════════
\`\`\`

**Battlefield Tracking**:
- **Demon Minis**: Place demon miniatures on battle map
- **Dominance Dice**: Physical dice next to each mini
- **Demon Cards**: Reference cards showing stats and abilities
- **Binding Checklist**: Track which demons are bound and their DD

**Why This System Works**: The physical act of downgrading dice (d12 → d10 → d8 → d6 → 0) creates a tangible sense of losing control. You can see and feel your grip on the demon weakening with each die replacement. The moment you remove the die completely and roll a Charisma save is tense—will you maintain control or will the demon break free? The system is simple (just replace dice) but creates constant strategic decisions about when to use demons aggressively versus when to restore Dominance. The binding ritual checklists add pre-combat preparation depth, making demon acquisition feel earned and meaningful.

**Pro Tips**:
- **Color-Code Demons**: Use different colored dice for each demon type
- **Track DD Visually**: Keep dice visible so you know control status at a glance
- **Restore Early**: Don't wait until 0 DD, restore at d6 to avoid escape risk
- **Dismiss Before Escape**: Better to dismiss a demon than let it turn hostile
- **Prepare Bindings**: Perform binding rituals during downtime, not mid-adventure
- **Specialization Synergy**: Demonologist = multiple demons, Purifier = demon enhancement, Binder = stronger individual demons

**Budget-Friendly Alternatives**:
- **No extra dice?** Use tokens to mark DD level (4 tokens = d12, etc.)
- **No demon cards?** Write demon stats on index cards
- **No minis?** Use coins or tokens to represent demons
- **Minimalist**: Track DD on paper next to demon names

**Specialization-Specific Tracking**:

**Demonologist**:
- Can bind up to 4 demons simultaneously
- Track 4 separate Dominance Dice
- Restoration spells cost -2 mana
- Use colored dice to distinguish demons

**Purifier**:
- Demons start with +1 DD step (Imp starts at d12+, degrades slower)
- Track enhanced DD separately
- Demons deal +1d6 radiant damage
- Mark radiant damage bonus on demon cards

**Binder**:
- Can bind 1 demon with double DD (d12 → d12 → d10 → d8 → d6 → 0)
- Use 2 dice to show double DD
- Demon has enhanced stats
- Focus all restoration on single powerful demon

**Why Exorcist Is Perfect for In-Person Play**: The class is built around physical dice degradation, which is incredibly satisfying to track at the table. The act of replacing a d12 with a d10, then a d8, then a d6, creates a visual and tactile representation of your weakening control. The tension of rolling a Charisma save when a demon reaches 0 DD is dramatic and engaging. The binding ritual checklists add pre-combat preparation that feels like actual demon summoning. Managing multiple demons with multiple dice creates a complex but rewarding tactical puzzle. Every die on the table represents a bound demon under your control, making the Exorcist's power tangible and visible to everyone at the table.`
    }
  },

  // Specializations
  specializations: {
    title: 'Exorcist Specializations',
    subtitle: 'Three Paths of Demon Mastery',

    description: `Exorcists can specialize in different approaches to demon binding, each offering unique methods of control and power.`,

    specs: [
      {
        id: 'demonologist',
        name: 'Demonologist',
        icon: 'spell_shadow_demonicempathy',
        color: '#8B0000',
        theme: 'Multiple Demon Control',

        description: `Demonologists are masters of binding and controlling multiple demons simultaneously. They sacrifice individual demon power for quantity, creating a small army of bound servants. Their expertise in multi-demon management allows them to maintain Dominance over several entities at once.`,

        playstyle: 'Summoner swarm, multiple weak demons, action economy advantage',

        strengths: [
          'Can bind up to 4 demons simultaneously',
          'Better Dominance management across multiple demons',
          'Reduced Dominance spell costs',
          'Excellent action economy with multiple demons'
        ],

        weaknesses: [
          'Individual demons are weaker than other specs',
          'Cannot bind Tier 4 (Greater) demons',
          'Complex management of multiple Dominance Dice',
          'Vulnerable if all demons escape simultaneously'
        ],

        passiveAbilities: [
          {
            name: 'Demon Mastery',
            tier: 'Path Passive',
            description: 'When you successfully maintain Dominance over a demon for 5 consecutive rounds, gain +1 to all Dominance saving throw DCs for that demon.',
            sharedBy: 'All Exorcists'
          },
          {
            name: 'Legion Commander',
            tier: 'Specialization Passive',
            description: 'You can bind up to 4 demons simultaneously (instead of 2). All Dominance Replenishment spells cost -2 mana. When commanding multiple demons to attack the same target, they deal +1d6 bonus damage.',
            uniqueTo: 'Demonologist'
          }
        ],

        recommendedFor: 'Players who enjoy summoner playstyles, managing multiple units, and overwhelming enemies with numbers'
      },

      {
        id: 'demon_lord',
        name: 'Demon Lord',
        icon: 'spell_shadow_demonicfortitude',
        color: '#4B0082',
        theme: 'Single Powerful Demon',

        description: `Demon Lords focus all their willpower on controlling a single, incredibly powerful demon. They can bind Greater Demons that other Exorcists cannot, creating a devastating partnership. Their bond with their demon is stronger, making it harder for the demon to escape.`,

        playstyle: 'Single powerful summon, enhanced demon abilities, master-servant bond',

        strengths: [
          'Can bind Tier 4 Greater Demons (most powerful)',
          'Bound demon has +2 to all stats and abilities',
          'Dominance Die decreases slower (every 2 actions instead of 1)',
          'Demon gains special empowered abilities'
        ],

        weaknesses: [
          'Can only bind 1 demon at a time',
          'All eggs in one basket (if demon escapes, no backup)',
          'Greater Demons start at d6 DD (very hard to control)',
          'Higher mana investment required'
        ],

        passiveAbilities: [
          {
            name: 'Demon Mastery',
            tier: 'Path Passive',
            description: 'When you successfully maintain Dominance over a demon for 5 consecutive rounds, gain +1 to all Dominance saving throw DCs for that demon.',
            sharedBy: 'All Exorcists'
          },
          {
            name: 'Infernal Pact',
            tier: 'Specialization Passive',
            description: 'Your bound demon gains +2 to all stats and abilities. Dominance Die decreases every 2 actions instead of every action. You can bind Tier 4 Greater Demons. When your demon is at d6 DD or lower, it deals +2d8 damage on all attacks.',
            uniqueTo: 'Demon Lord'
          }
        ],

        recommendedFor: 'Players who enjoy powerful single summons, high-risk/high-reward gameplay, and master-servant dynamics'
      },

      {
        id: 'possessed',
        name: 'Possessed',
        icon: 'spell_shadow_possession',
        color: '#9400D3',
        theme: 'Internal Demon Channeling',

        description: `The Possessed do not bind demons externally—they channel demonic essence directly into their own bodies. This creates an internal struggle where the Exorcist must maintain Dominance over the demon within themselves. They gain demonic powers but risk losing control of their own body.`,

        playstyle: 'Hybrid melee/caster, self-buffs, internal struggle mechanics',

        strengths: [
          'Gain demonic physical enhancements (strength, speed, resilience)',
          'Can use demon abilities directly without summoning',
          'No external demons to manage (simpler gameplay)',
          'Powerful self-buffs and transformations'
        ],

        weaknesses: [
          'Cannot summon external demons',
          'Risk of losing control of own body',
          'Internal Dominance failure causes self-harm',
          'Less tactical flexibility (no positioning with summons)'
        ],

        passiveAbilities: [
          {
            name: 'Demon Mastery',
            tier: 'Path Passive',
            description: 'When you successfully maintain Dominance over a demon for 5 consecutive rounds, gain +1 to all Dominance saving throw DCs for that demon.',
            sharedBy: 'All Exorcists'
          },
          {
            name: 'Demonic Fusion',
            tier: 'Specialization Passive',
            description: 'You channel a demon internally instead of binding it externally. Gain +2 Strength, +2 Constitution, and +10 movement speed. Your melee attacks deal an additional 1d8 necrotic damage. When your Internal Dominance Die reaches 0, you take 3d6 psychic damage instead of the demon escaping.',
            uniqueTo: 'Possessed'
          }
        ],

        recommendedFor: 'Players who enjoy hybrid melee/caster gameplay, self-buffs, and internal struggle narratives'
      }
    ]
  },

  // Example Spells - showcasing the spell wizard system
  exampleSpells: [
    // BINDING RITUALS
    {
      id: 'exo_bind_imp',
      name: 'Bind Imp',
      description: 'Perform a ritual to bind an Imp to your service. Requires purified lava, ash, and flame-touched gemstone. Must be cast at midnight under a new moon.',
      spellType: 'RITUAL',
      icon: 'spell_fire_flamebolt',
      school: 'Summoning',
      level: 2,

      typeConfig: {
        castTime: 10,
        castTimeType: 'MINUTES',
        ritual: true
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'self',
        aoeType: 'circle',
        aoeSize: 5
      },

      durationConfig: {
        durationType: 'permanent',
        description: 'Imp remains bound until dismissed, killed, or escapes'
      },

      resourceCost: {
        mana: 20,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Incantation in Infernal tongue',
        somaticText: 'Draw summoning circle with ash',
        materialComponents: [
          'Vial of purified lava',
          'Ash from a burnt offering',
          'Flame-touched gemstone'
        ],
        ritualConditions: [
          'Must be performed at midnight',
          'Must be under a new moon',
          'Summoning circle required'
        ]
      },

      resolution: 'SKILL_CHECK',
      skillCheck: {
        skill: 'ARCANA',
        attribute: 'WISDOM',
        dc: 12,
        onSuccess: 'Imp is bound with d12 Dominance Die',
        onFailure: 'Ritual fails, materials consumed'
      },

      effects: {
        summon: {
          creatureType: 'Imp',
          tier: 1,
          dominanceDie: 'd12',
          duration: 'permanent',
          description: 'Binds an Imp with d12 Dominance Die. Imp has fire abilities and flight.'
        }
      },

      specialMechanics: {
        bindingRitual: {
          enabled: true,
          demonType: 'Imp',
          startingDD: 'd12',
          savingThrow: 'Charisma (Persuasion) DC 12',
          abilities: ['Fire Bolt (2d6 fire damage)', 'Flight (30 ft)', 'Invisibility (1/day)']
        }
      },

      flavorText: 'The flames answer. The Imp bows. For now.'
    },

    {
      id: 'exo_bind_shadow_hound',
      name: 'Bind Shadow Hound',
      description: 'Capture a Shadow Hound using darkness and stealth. Requires nightshade essence, shadowy cloak, and silver mirror. Must be cast in complete darkness.',
      spellType: 'RITUAL',
      icon: 'spell_shadow_shadowfiend',
      school: 'Summoning',
      level: 4,

      typeConfig: {
        castTime: 15,
        castTimeType: 'MINUTES',
        ritual: true
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'self',
        aoeType: 'circle',
        aoeSize: 5
      },

      durationConfig: {
        durationType: 'permanent',
        description: 'Shadow Hound remains bound until dismissed, killed, or escapes'
      },

      resourceCost: {
        mana: 30,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Whispered binding chant',
        somaticText: 'Blend with shadows using mirror',
        materialComponents: [
          'Essence of nightshade',
          'Shadowy cloak',
          'Silver mirror'
        ],
        ritualConditions: [
          'Must be in complete darkness',
          'Preferably in a cave or lightless room',
          'Exorcist must wear the shadowy cloak'
        ]
      },

      resolution: 'SKILL_CHECK',
      skillCheck: {
        skill: 'STEALTH',
        attribute: 'DEXTERITY',
        dc: 14,
        onSuccess: 'Shadow Hound is bound with d10 Dominance Die',
        onFailure: 'Ritual fails, Shadow Hound escapes into darkness'
      },

      effects: {
        summon: {
          creatureType: 'Shadow Hound',
          tier: 2,
          dominanceDie: 'd10',
          duration: 'permanent',
          description: 'Binds a Shadow Hound with d10 Dominance Die. Hound has stealth and shadow abilities.'
        }
      },

      specialMechanics: {
        bindingRitual: {
          enabled: true,
          demonType: 'Shadow Hound',
          startingDD: 'd10',
          savingThrow: 'Dexterity (Stealth) DC 14',
          abilities: ['Shadow Bite (3d6 necrotic)', 'Shadow Step (teleport 30 ft)', 'Pack Tactics (advantage when ally nearby)']
        }
      },

      flavorText: 'The shadows coalesce. The hound emerges. The hunt begins.'
    },

    {
      id: 'exo_bind_abyssal_brute',
      name: 'Bind Abyssal Brute',
      description: 'Bind an Abyssal Brute through raw strength and endurance. Requires giant\'s blood, iron chains, and deep earth stone. Must be cast during a thunderstorm in mountainous terrain.',
      spellType: 'RITUAL',
      icon: 'spell_shadow_demonicpact',
      school: 'Summoning',
      level: 6,

      typeConfig: {
        castTime: 20,
        castTimeType: 'MINUTES',
        ritual: true
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'self',
        aoeType: 'circle',
        aoeSize: 10
      },

      durationConfig: {
        durationType: 'permanent',
        description: 'Abyssal Brute remains bound until dismissed, killed, or escapes'
      },

      resourceCost: {
        mana: 45,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Roared challenge in Abyssal',
        somaticText: 'Self-inflicted wound to show dominance',
        materialComponents: [
          'Blood of a giant',
          'Iron chains',
          'Stone from the deepest part of the earth'
        ],
        ritualConditions: [
          'Must be in mountainous or rocky terrain',
          'Must be during a thunderstorm',
          'Exorcist must endure self-inflicted wound (1d6 damage)'
        ]
      },

      resolution: 'SKILL_CHECK',
      skillCheck: {
        skill: 'ENDURANCE',
        attribute: 'CONSTITUTION',
        dc: 16,
        onSuccess: 'Abyssal Brute is bound with d8 Dominance Die',
        onFailure: 'Ritual fails, Brute attacks Exorcist before fleeing'
      },

      effects: {
        summon: {
          creatureType: 'Abyssal Brute',
          tier: 3,
          dominanceDie: 'd8',
          duration: 'permanent',
          description: 'Binds an Abyssal Brute with d8 Dominance Die. Brute is a powerful melee tank.'
        }
      },

      specialMechanics: {
        bindingRitual: {
          enabled: true,
          demonType: 'Abyssal Brute',
          startingDD: 'd8',
          savingThrow: 'Constitution (Endurance) DC 16',
          abilities: ['Crushing Blow (4d8 bludgeoning)', 'Demonic Resilience (resistance to physical)', 'Intimidating Presence (enemies have disadvantage)']
        },
        selfHarm: {
          enabled: true,
          damage: '1d6',
          description: 'Exorcist takes 1d6 damage as part of ritual'
        }
      },

      flavorText: 'Strength meets strength. Will meets will. One must submit.'
    },

    {
      id: 'exo_bind_banshee',
      name: 'Bind Banshee',
      description: 'Bind a Banshee through shared grief and sorrow. Requires locket with loved one\'s picture, sorrowful tears, and white rose. Must be cast in a graveyard at dusk.',
      spellType: 'RITUAL',
      icon: 'spell_shadow_soulleech_3',
      school: 'Summoning',
      level: 5,

      typeConfig: {
        castTime: 15,
        castTimeType: 'MINUTES',
        ritual: true
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'self',
        aoeType: 'circle',
        aoeSize: 5
      },

      durationConfig: {
        durationType: 'permanent',
        description: 'Banshee remains bound until dismissed, killed, or escapes'
      },

      resourceCost: {
        mana: 35,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Lament for the lost',
        somaticText: 'Place locket and rose in circle',
        materialComponents: [
          'Locket with picture of a loved one',
          'Tears of the sorrowful',
          'White rose'
        ],
        ritualConditions: [
          'Must be in a graveyard or place of mourning',
          'Must be at dusk',
          'Exorcist must genuinely grieve'
        ]
      },

      resolution: 'SKILL_CHECK',
      skillCheck: {
        skill: 'PERSUASION',
        attribute: 'CHARISMA',
        dc: 15,
        onSuccess: 'Banshee is bound with d8 Dominance Die',
        onFailure: 'Ritual fails, Banshee\'s wail causes 2d6 psychic damage'
      },

      effects: {
        summon: {
          creatureType: 'Banshee',
          tier: 3,
          dominanceDie: 'd8',
          duration: 'permanent',
          description: 'Binds a Banshee with d8 Dominance Die. Banshee has powerful psychic abilities.'
        }
      },

      specialMechanics: {
        bindingRitual: {
          enabled: true,
          demonType: 'Banshee',
          startingDD: 'd8',
          savingThrow: 'Charisma (Performance) DC 15',
          abilities: ['Wail of Sorrow (3d8 psychic, AoE)', 'Incorporeal (resistance to physical)', 'Fear Aura (enemies frightened)']
        }
      },

      flavorText: 'Grief calls to grief. Sorrow binds sorrow. The wail is silenced.'
    },

    {
      id: 'exo_bind_wraith',
      name: 'Bind Wraith',
      description: 'Capture a Wraith from the ethereal plane. Requires ectoplasm, moonstone shard, and spider silk veil. Must be cast at forest edge during full moon.',
      spellType: 'RITUAL',
      icon: 'spell_shadow_twilight',
      school: 'Summoning',
      level: 5,

      typeConfig: {
        castTime: 15,
        castTimeType: 'MINUTES',
        ritual: true
      },

      targetingConfig: {
        targetingType: 'ground',
        rangeType: 'self',
        aoeType: 'circle',
        aoeSize: 5
      },

      durationConfig: {
        durationType: 'permanent',
        description: 'Wraith remains bound until dismissed, killed, or escapes'
      },

      resourceCost: {
        mana: 35,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Incantation to pierce the veil',
        somaticText: 'Drape spider silk veil over head',
        materialComponents: [
          'Ectoplasm',
          'Shard of moonstone',
          'Veil woven from spider silk'
        ],
        ritualConditions: [
          'Must be at the edge of a forest',
          'Must be during a full moon',
          'Moonstone must be placed in circle center'
        ]
      },

      resolution: 'SKILL_CHECK',
      skillCheck: {
        skill: 'ARCANA',
        attribute: 'INTELLIGENCE',
        dc: 14,
        onSuccess: 'Wraith is bound with d10 Dominance Die',
        onFailure: 'Ritual fails, Wraith drains 2d6 HP before dissipating'
      },

      effects: {
        summon: {
          creatureType: 'Wraith',
          tier: 2,
          dominanceDie: 'd10',
          duration: 'permanent',
          description: 'Binds a Wraith with d10 Dominance Die. Wraith can phase through walls and drain life.'
        }
      },

      specialMechanics: {
        bindingRitual: {
          enabled: true,
          demonType: 'Wraith',
          startingDD: 'd10',
          savingThrow: 'Intelligence (Arcana) DC 14',
          abilities: ['Life Drain (3d6 necrotic, heals Wraith)', 'Ethereal Jaunt (phase through walls)', 'Spectral Touch (ignores armor)']
        }
      },

      flavorText: 'The veil parts. The ethereal bleeds through. The Wraith is bound.'
    },

    // DOMINANCE MANAGEMENT SPELLS
    {
      id: 'exo_reassert_dominance',
      name: 'Reassert Dominance',
      description: 'Channel divine power to reinforce your control over a bound demon, restoring its Dominance Die to maximum.',
      spellType: 'ACTION',
      icon: 'spell_holy_powerwordbarrier',
      school: 'Control',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        validTargets: 'bound_demon'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Imperium Divinum',
        somaticText: 'Commanding gesture toward demon'
      },

      resolution: 'AUTOMATIC',

      effects: {
        dominance: {
          type: 'restore_maximum',
          description: 'Restores target demon\'s Dominance Die to its maximum size'
        }
      },

      specialMechanics: {
        dominanceManagement: {
          enabled: true,
          effect: 'Restore DD to maximum',
          example: 'd6 → d12 (if Imp), d6 → d10 (if Shadow Hound), etc.'
        }
      },

      flavorText: 'Your will is absolute. The demon remembers its place.'
    },

    {
      id: 'exo_chain_of_command',
      name: 'Chain of Command',
      description: 'Strengthen your grip over a bound demon, increasing its Dominance Die for the next 3 actions.',
      spellType: 'ACTION',
      icon: 'spell_holy_divinepurpose',
      school: 'Control',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        validTargets: 'bound_demon'
      },

      durationConfig: {
        durationType: 'actions',
        durationAmount: 3
      },

      resourceCost: {
        mana: 4,
        components: ['verbal'],
        verbalText: 'Catena Imperii'
      },

      resolution: 'AUTOMATIC',

      effects: {
        dominance: {
          type: 'increase_temporary',
          amount: '+1 die size',
          duration: '3 actions',
          description: 'Increases Dominance Die by one size for next 3 demon actions'
        }
      },

      specialMechanics: {
        dominanceManagement: {
          enabled: true,
          effect: 'Increase DD by 1 size for 3 actions',
          example: 'd8 → d10 for 3 actions, then returns to normal progression'
        }
      },

      flavorText: 'The chains tighten. Obedience is ensured. For now.'
    },

    {
      id: 'exo_divine_bond',
      name: 'Divine Bond',
      description: 'Bolster the bond between you and a bound demon, restoring 2 steps of its Dominance Die.',
      spellType: 'ACTION',
      icon: 'spell_holy_holybolt',
      school: 'Control',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        validTargets: 'bound_demon'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 6,
        components: ['verbal', 'somatic'],
        verbalText: 'Vinculum Divinum',
        somaticText: 'Binding gesture with both hands'
      },

      resolution: 'AUTOMATIC',

      effects: {
        dominance: {
          type: 'restore_steps',
          amount: '2 steps',
          description: 'Restores Dominance Die by 2 steps (e.g., d6 → d10)'
        }
      },

      specialMechanics: {
        dominanceManagement: {
          enabled: true,
          effect: 'Restore DD by 2 steps',
          example: 'd6 → d8 → d10 (2 steps up)'
        }
      },

      flavorText: 'The bond strengthens. The demon\'s resistance weakens.'
    },

    // DEMON COMMAND SPELLS
    {
      id: 'exo_command_attack',
      name: 'Command: Attack',
      description: 'Command a bound demon to attack a target with enhanced ferocity.',
      spellType: 'ACTION',
      icon: 'ability_warrior_commandingshout',
      school: 'Command',
      level: 1,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        validTargets: 'bound_demon'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 3,
        components: ['verbal'],
        verbalText: 'Impetus!'
      },

      resolution: 'AUTOMATIC',

      effects: {
        command: {
          type: 'attack',
          bonus: '+1d6 damage',
          description: 'Demon attacks designated target with +1d6 bonus damage'
        }
      },

      specialMechanics: {
        demonCommand: {
          enabled: true,
          commandType: 'attack',
          dominanceCost: 'Decreases DD by 1 step after attack'
        }
      },

      flavorText: 'Your word is law. The demon strikes.'
    },

    {
      id: 'exo_dismiss_demon',
      name: 'Dismiss Demon',
      description: 'Safely dismiss a bound demon, sending it back to its binding circle. Prevents hostile escape.',
      spellType: 'ACTION',
      icon: 'spell_shadow_demonicpact',
      school: 'Control',
      level: 1,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        validTargets: 'bound_demon'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 2,
        components: ['verbal', 'somatic'],
        verbalText: 'Dimitte!',
        somaticText: 'Dismissive wave'
      },

      resolution: 'AUTOMATIC',

      effects: {
        dismiss: {
          type: 'safe_dismissal',
          description: 'Demon is dismissed without turning hostile, can be resummoned later'
        }
      },

      specialMechanics: {
        demonCommand: {
          enabled: true,
          commandType: 'dismiss',
          note: 'Use this when DD is low to prevent hostile escape'
        }
      },

      flavorText: 'Return to your prison. Your service is complete. For now.'
    },

    // EXORCISM/BANISHMENT SPELLS
    {
      id: 'exo_banish_demon',
      name: 'Banish Demon',
      description: 'Banish a hostile demon or enemy summoned creature, sending it back to its plane of origin.',
      spellType: 'ACTION',
      icon: 'spell_holy_excorcism',
      school: 'Banishment',
      level: 4,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 40
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 20,
        components: ['verbal', 'somatic'],
        verbalText: 'Exorcizamus te!',
        somaticText: 'Banishing gesture with holy symbol'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        attribute: 'CHARISMA',
        dc: 'SPELL_DC',
        onSuccess: 'negated',
        onFailure: 'banished'
      },

      effects: {
        banishment: {
          type: 'planar_banishment',
          description: 'Target demon/summoned creature is banished to its home plane'
        }
      },

      specialMechanics: {
        exorcism: {
          enabled: true,
          effectiveAgainst: ['demons', 'devils', 'summoned creatures', 'undead'],
          note: 'Can be used on escaped bound demons to recapture them'
        }
      },

      flavorText: 'By divine authority, I cast you out!'
    },

    {
      id: 'exo_holy_smite',
      name: 'Holy Smite',
      description: 'Strike a target with holy energy, dealing radiant damage. Extra effective against demons and undead.',
      spellType: 'ACTION',
      icon: 'spell_holy_holysmite',
      school: 'Evocation',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 50
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 15,
        components: ['verbal', 'somatic'],
        verbalText: 'Lux Divina!',
        somaticText: 'Thrust hand toward target'
      },

      resolution: 'DICE',

      damageConfig: {
        formula: '3d8',
        modifier: 'WISDOM',
        damageType: 'radiant',
        attackType: 'spell_attack',
        bonusDamage: '+2d8 vs demons/undead'
      },

      effects: {
        damage: {
          instant: {
            amount: '3d8 + WIS',
            type: 'radiant',
            description: 'Holy damage, +2d8 against demons and undead'
          }
        }
      },

      specialMechanics: {
        exorcism: {
          enabled: true,
          bonusVs: ['demons', 'undead'],
          bonusDamage: '2d8'
        }
      },

      flavorText: 'Divine light purges the unholy.'
    },

    {
      id: 'exo_empower_demon',
      name: 'Empower Demon',
      description: 'Channel energy into a bound demon, temporarily enhancing its abilities.',
      spellType: 'ACTION',
      icon: 'spell_shadow_unholystrength',
      school: 'Enhancement',
      level: 3,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        validTargets: 'bound_demon'
      },

      durationConfig: {
        durationType: 'rounds',
        durationAmount: 3
      },

      resourceCost: {
        mana: 12,
        components: ['verbal', 'somatic'],
        verbalText: 'Potentia Daemonis',
        somaticText: 'Empowering gesture'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          attackBonus: '+2',
          damageBonus: '+1d8',
          acBonus: '+2',
          duration: '3 rounds',
          description: 'Demon gains +2 to attacks, +1d8 damage, and +2 AC'
        }
      },

      specialMechanics: {
        demonCommand: {
          enabled: true,
          commandType: 'empower',
          note: 'Empowered actions still decrease DD normally'
        }
      },

      flavorText: 'Power flows through the bond. The demon grows stronger.'
    },

    // POSSESSED SPEC SPELLS
    {
      id: 'exo_channel_demon_strength',
      name: 'Channel Demon Strength',
      description: 'Channel your internal demon\'s strength, gaining enhanced physical power. Possessed spec only.',
      spellType: 'ACTION',
      icon: 'spell_shadow_possession',
      school: 'Enhancement',
      level: 2,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'rounds',
        durationAmount: 5
      },

      resourceCost: {
        mana: 10,
        components: ['verbal'],
        verbalText: 'Guttural demonic growl'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          strengthBonus: '+4',
          damageBonus: '+2d6 necrotic on melee attacks',
          duration: '5 rounds',
          description: 'Gain +4 Strength and +2d6 necrotic damage on melee attacks'
        }
      },

      specialMechanics: {
        possessedSpec: {
          enabled: true,
          specRequired: 'Possessed',
          internalDominance: 'Decreases Internal DD by 1 step when cast'
        }
      },

      flavorText: 'The demon within surges. Your body transforms.'
    },

    {
      id: 'exo_demonic_fury',
      name: 'Demonic Fury',
      description: 'Unleash your internal demon\'s rage, gaining attack speed and ferocity. Possessed spec only.',
      spellType: 'ACTION',
      icon: 'spell_shadow_unholyfrenzy',
      school: 'Enhancement',
      level: 4,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      durationConfig: {
        durationType: 'rounds',
        durationAmount: 4
      },

      resourceCost: {
        mana: 18,
        components: ['verbal', 'somatic'],
        verbalText: 'Demonic roar',
        somaticText: 'Claws manifest on hands'
      },

      resolution: 'AUTOMATIC',

      effects: {
        buff: {
          extraAttack: '+1 attack per turn',
          criticalRange: 'Increased (19-20)',
          movementSpeed: '+20 ft',
          duration: '4 rounds',
          description: 'Gain extra attack, increased crit range, and bonus movement'
        }
      },

      specialMechanics: {
        possessedSpec: {
          enabled: true,
          specRequired: 'Possessed',
          internalDominance: 'Decreases Internal DD by 2 steps when cast',
          risk: 'High risk of losing control if Internal DD reaches 0'
        }
      },

      flavorText: 'Fury unleashed. Control slipping. Power overwhelming.'
    },

    {
      id: 'exo_purifying_light',
      name: 'Purifying Light',
      description: 'Emit a burst of purifying light that damages demons and undead while healing allies.',
      spellType: 'ACTION',
      icon: 'spell_holy_prayerofhealing02',
      school: 'Evocation',
      level: 5,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'aoe',
        rangeType: 'self',
        aoeType: 'radius',
        aoeSize: 20
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 25,
        components: ['verbal', 'somatic'],
        verbalText: 'Lux Purificans!',
        somaticText: 'Arms spread wide, light emanating'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        attribute: 'CONSTITUTION',
        dc: 'SPELL_DC',
        onSuccess: 'half_damage',
        onFailure: 'full_damage',
        appliesToEnemiesOnly: true
      },

      damageConfig: {
        formula: '4d6',
        modifier: 'WISDOM',
        damageType: 'radiant',
        attackType: 'spell_save'
      },

      healingConfig: {
        formula: '2d6',
        modifier: 'WISDOM',
        healingType: 'aoe_allies'
      },

      effects: {
        damage: {
          instant: {
            amount: '4d6 + WIS',
            type: 'radiant',
            description: 'Radiant damage to demons and undead in radius'
          }
        },
        healing: {
          instant: {
            amount: '2d6 + WIS',
            type: 'allies',
            description: 'Heals all allies in radius'
          }
        }
      },

      specialMechanics: {
        exorcism: {
          enabled: true,
          effectiveAgainst: ['demons', 'undead'],
          alsoHeals: true
        }
      },

      flavorText: 'Light purges darkness. The unholy burn. The faithful are restored.'
    }
  ]
};


