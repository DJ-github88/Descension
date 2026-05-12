/**
 * Exorcist Class Data
 * 
 * Complete class information for the Exorcist — a divine agent who walks
 * the razor's edge between holiness and heresy, binding demons through
 * sacred ritual and commanding them with divine authority.
 */

export const EXORCIST_DATA = {
  id: 'exorcist',
  name: 'Exorcist',
  icon: 'fas fa-cross',
  role: 'Summoner/Controller',
  damageTypes: ['radiant', 'force', 'necrotic'],

  overview: {
    title: 'The Exorcist',
    subtitle: 'Divine Authority Over Demonic Fury',
    
    quickOverview: {
      title: 'Quick Overview',
      content: `**What You Need to Know**: The Exorcist is a divine paradox — a holy agent who wields the very demons they should be destroying. Through sacred binding rituals, you capture demonic entities and command them in battle using the **Divine Dominance** system. Each bound demon has a Dominance Die (d12 → d10 → d8 → d6 → 0) that tracks your control. Every command weakens your grip. Let the die reach zero and your demon may break free and turn hostile.

**Core Mechanic**: Perform binding rituals → Command demons in battle → Dominance Die decreases with each action → Cast restoration spells to regain control → Risk demons escaping if control is lost

**Resource**: Divine Dominance (Dominance Dice: d12 down to d6 per bound demon, up to 4 demons simultaneously)

**Playstyle**: High-tension summoner balancing devastating demonic power against the ever-present risk of rebellion

**Best For**: Players who thrive on risk management, pet micromanagement, and the constant adrenaline of wielding weapons that could turn on them at any moment`
    },
    
    description: `The Exorcist is a living contradiction — a divine agent who does the unthinkable: binding demons not to destroy them, but to weaponize them. Where clerics banish and paladins smite, the Exorcist captures, commands, and unleashes demonic fury against the very darkness that spawned it. Through sacred binding rituals infused with holy authority, they maintain iron-willed dominance over creatures that would see them dead — and through the Divine Dominance system, they hold the leash on power that could snap at any moment.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Not all who fight darkness do so with pure light. Exorcists are divine agents who believe the most effective weapon against evil is evil itself — captured, restrained, and turned against its own kind. This philosophy makes them both revered and reviled: saviors to those they protect, and heretics to the holy orders who view demon-binding as corruption incarnate.

Their power flows from sacred binding rituals — ancient ceremonies that fuse divine authority with arcane containment. Each ritual demands specific components, precise celestial timing, and the Exorcist's unbreakable will. The demons they bind are not allies. They are prisoners in holy chains, testing their captor's resolve with every heartbeat, searching for the slightest crack in their divine armor.

Physically, Exorcists bear the marks of their calling: ritual scars from binding ceremonies, glowing sigils tattooed across their arms, and eyes that flicker between holy gold and demonic crimson. Bound demons manifest as shadowy presences — spectral chains linking captor to captive, visible reminders of the power and peril the Exorcist wields.

Common Exorcist archetypes include:
- **The Divine Warden**: Captures demons to prevent them from harming the innocent
- **The Forbidden Scholar**: Studies demonic binding despite religious prohibition
- **The Desperate Guardian**: Binds demons out of necessity, defending what cannot be defended otherwise
- **The Walking Heresy**: Embraces both holy and demonic power, caring for neither heaven's approval nor hell's opinion
- **The Penitent Inquisitor**: Atone for past sins by enslaving evil itself — and trust the demons to remind them of the debt

Every demon bound is a gamble. The power is immense. The cost of failure is catastrophic. The Exorcist stands on the edge of a blade, holy light in one hand and demonic fire in the other, daring both to consume them.`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `The Exorcist is a summoner/controller who dominates the battlefield through demonic proxies:

**Demon Binding**: Capture and command demons through sacred ritual
**Battlefield Control**: Position demons to control space, block chokepoints, and flank enemies
**Sustained Damage**: Demons provide consistent damage output across multiple targets
**Divine Dominance Management**: Juggle control over multiple entities — each one a ticking time bomb

**Strengths**:
- Fields multiple combatants simultaneously (Exorcist + bound demons)
- Diverse demon abilities provide tactical flexibility
- Strong action economy (demons have their own action pools)
- Excels at controlling multiple enemies at once
- Can adapt mid-fight by summoning different demons

**Weaknesses**:
- Extremely vulnerable when demons are dismissed or escape
- Demands constant Dominance Die attention — look away and lose control
- Binding rituals require pre-combat preparation and rare components
- Demons can turn hostile if control slips, creating a second front
- Fragile without demon protection — the chain goes both ways
- Mana-hungry: balancing combat spells vs. Dominance restoration is a constant tension

The Exorcist thrives when they prepare rituals before combat and maintain Divine Dominance throughout the battle. They suffer when caught unprepared or forced to split attention between too many demons.`
    },
    
    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing an Exorcist is about preparation, control, and risk management. You're not just a spellcaster — you're a demon wrangler armed with divine authority, constantly balancing the power of your bound servants against the risk of losing control. Every command you give, every hit your demon takes, tightens the leash one notch closer to snapping.

**Pre-Combat Preparation**:

Before battle even begins, the Exorcist's work has already started. You must perform binding rituals to capture demons, each requiring specific components and conditions:

- **Imp Binding** (d12 DD - Easiest): Gather purified lava from a volcanic region, ash from a burned holy text, and a flame-touched gemstone. Perform the ritual at midnight under a new moon. The imp will resist with fire and trickery, but its will is weak.

- **Shadow Hound Binding** (d10 DD - Moderate): Collect nightshade essence, a cloak woven from shadows, and a silver mirror that has never reflected sunlight. Perform the ritual in complete darkness. The hound will test your resolve with fear and illusions.

- **Wraith Binding** (d10 DD - Moderate): Acquire ectoplasm from a recent haunting, a moonstone shard blessed under a full moon, and a veil of spider silk. Perform the ritual during a full moon in a place where someone died. The wraith will attempt to possess you during the binding.

- **Abyssal Brute Binding** (d8 DD - Difficult): Obtain giant's blood (fresh, within 24 hours), iron chains forged in dragonfire, and a stone from the deepest earth. Perform the ritual during a thunderstorm. The brute will physically resist, requiring you to overpower its will through sheer force of personality.

- **Banshee Binding** (d8 DD - Difficult): Gather a locket containing hair from someone who died of grief, tears shed in genuine sorrow, and a white rose that bloomed in a graveyard. Perform the ritual in a place of great tragedy. The banshee's wail will test your sanity.

Each binding ritual requires a skill check (Arcana, Religion, or Persuasion depending on demon type) with DC ranging from 12 (Imp) to 18 (Greater Demons). Failure means the demon escapes, and you've wasted your components. Success means the demon is bound with its starting Dominance Die.

**If a bound demon dies in combat**, it is gone. You must perform the binding ritual again with fresh components and a new skill check. Protect your demons — their death is not just a tactical loss, it's a resource investment lost.

**Divine Dominance — The Core Mechanic**:

Every bound demon has a Dominance Die (DD) that represents how firmly your divine authority grips it. Think of it as a leash — the bigger the die, the longer the leash. But every action the demon takes, every hit it suffers, shortens that leash.

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

**Dominance Restoration — Your Three Lifelines**:

You have three spells to restore Dominance. Use them wisely — they cost mana you could be spending on combat spells.

1. **Divine Rebuke** (3 mana, 1 AP)
   - Restores one demon's DD by 1 step (e.g., d6 → d8)
   - Use when: Demon has dipped to d6 and you want cheap insurance
   - Example: Your Shadow Hound just hit d6 after a long fight. Divine Rebuke nudges it back to d8 for just 3 mana.

2. **Chain of Light** (5 mana, 1 AP)
   - Restores one demon's DD by 2 steps (e.g., d6 → d10)
   - Use when: Demon is critically low and you need meaningful recovery
   - Example: Your Abyssal Brute is at d6 after two brutal rounds. Chain of Light restores it to d10, buying you several more actions.

3. **Absolute Dominion** (7 mana, 1 AP)
   - Restores one demon's DD to its maximum size (full reset)
   - Use when: Demon is at 0 or d6 and you absolutely cannot risk losing it
   - Example: Your only demon is at 0 DD and about to escape. Absolute Dominion is your emergency brake — expensive but definitive.

**Demon Command Strategy**:

Commanding demons is an art. Weaker demons are easier to control but less impactful. Stronger demons hit like trucks but require constant Dominance investment.

**Demon Power vs. Control Trade-off**:
- **Imp** (d12 DD): Attacks for 1d6+2 damage, easy to maintain, can act 6+ times before needing restoration
- **Shadow Hound** (d10 DD): Attacks for 2d6+3 damage, moderate maintenance, acts 5 times before restoration
- **Abyssal Brute** (d8 DD): Attacks for 3d8+5 damage, high maintenance, acts 4 times before restoration
- **Banshee** (d8 DD): Wail attack (2d8 psychic + fear), high maintenance, powerful crowd control
- **Greater Demons** (d6 DD): Devastating attacks (4d10+), extreme maintenance, acts only 3 times before restoration

**Optimal Demon Usage Pattern**:
1. **Early Combat**: Command demons aggressively while DD is high (d12/d10)
2. **Mid Combat**: Monitor DD, use Chain of Light for meaningful recovery
3. **Critical Moment**: When DD hits d6, decide — restore now or push to 0 and risk the save?
4. **Emergency**: If demon reaches 0, immediately cast Absolute Dominion or accept potential escape

**Losing Control — The Consequences**:

When a demon's DD reaches 0, it makes a saving throw specific to its type:
- **Imp**: Charisma (Persuasion) DC 12 - "Please, master, I'll behave!"
- **Shadow Hound**: Agility (Stealth) DC 14 - Tries to slip away into shadows
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
- **Possessed**: Channel demon internally — Internal DD tracks your struggle for self-control

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

**Your Action**: Cast "Chain of Light" on Shadow Hound (5 mana, 1 AP)

*You channel divine light through the spectral chains. The hound yelps as golden energy pulses through the links, its eyes dimming from red back to yellow. The leash holds firm again.*

**Result**: Shadow Hound's DD restored d6 → d10 (+2 steps)

**Your Action**: Command Shadow Hound to attack Cult Leader (1 AP)
**Hound's Action**: Leaps at leader → Hit! → 2d6+3 = 12 damage
**Dominance Cost**: Hound DD decreases d10 → d8

**Your Action**: Cast "Eldritch Blast" at Cult Leader (5 mana, 2 AP)
**Result**: 2d10 = 16 damage → Cult Leader falls!

*The remaining cultists flee. You collapse to one knee, breathing heavily. Your Shadow Hound sits beside you, loyal once more. The Abyssal Brute is gone—you'll need to perform another binding ritual to reclaim it. But you survived.*

**The Lesson**: The Exorcist walks a razor's edge between divine authority and demonic rebellion. Every command is a gamble. Push too hard and they turn on you. Restore too often and you burn through mana. The key is knowing when to spend Dominance spells, when to let a demon go, and when to fight without them. You're not just managing resources — you're commanding living, hostile entities that want nothing more than to snap their chains and tear you apart. And the most terrifying part? You knew this when you signed up.`
    }
  },

  // Resource System
  resourceSystem: {
    title: 'Divine Dominance',
    subtitle: 'The Chain of Sacred Authority',

    description: `The Exorcist does not request power; they command it. Through sacred binding rituals, you leash demonic entities to your will. This relationship is tracked by the **Dominance Die**—a shifting resource that measures how tightly your divine authority holds the darkness. As your demons act or suffer damage, the chains weaken, and you must re-assert control or face a hostile rebellion.`,

    cards: [
      {
        title: 'Dominance Dice (DD)',
        stats: 'd12 down to d6',
        details: 'Each bound demon has its own die. It represents your current "grip." d12 is total submission; d6 is a hair-trigger rebellion.'
      },
      {
        title: 'Binding Rituals',
        stats: 'Pre-Combat Prep',
        details: 'Demons are not summoned; they are captured. You must perform rituals with specific components to bring them into your service.'
      },
      {
        title: 'The Rebellion Save',
        stats: 'Triggered at 0 DD',
        details: 'If a die reaches 0, the demon makes a save to break free. Failure means it turns on you or flees the battlefield.'
      }
    ],

    generationTable: {
      headers: ['Trigger', 'Dominance Change', 'Notes'],
      rows: [
        ['Successful Binding', '→ Starting Die', 'Set by demon tier (Imp=d12, Brute=d8)'],
        ['Standard Command', '-1 Step', 'Simple attacks or movement'],
        ['Demon Takes Damage', '-1 Step', 'Pain fuels their resistance'],
        ['Special Ability', '-2 Steps', 'High-power demonic maneuvers'],
        ['Divine Rebuke (Spell)', '+1 Step', 'Quick corrective discipline (3 mana)'],
        ['Chain of Light (Spell)', '+2 Steps', 'Reinforcing the sacred bonds (5 mana)'],
        ['Absolute Dominion', '→ Reset to Max', 'Total divine reset (7 mana)']
      ]
    },

    usage: {
      momentum: 'Command demons early and often while their DD is high. As they dip into d8 and d6, shift your focus to restoration or prepare to dismiss them.',
      flourish: '⚠️ Tactical Release: If a demon is at d6 and you lack mana for restoration, use your Action to "Dismiss" it safely. It is better to lose a servant than to gain a new enemy.'
    },

    overheatRules: {
      title: 'The Breaking Point',
      content: `When a demon's Dominance Die reaches 0, the divine chains shatter. The demon immediately makes a **Rebellion Save** (DC varies by demon type).

**The Result**:
- **Success**: The demon remains bound but stays at d6 DD. It is shaken but not free.
- **Failure**: The demon escapes. Roll 1d6:
  - **1-2**: Flees the battlefield.
  - **3-4**: Attacks you once, then flees.
  - **5-6**: Turns fully hostile—attacking you and your allies until destroyed.

**Risk Management**:
Never leave a demon at 0 DD at the end of your turn unless you are prepared to fight it next.`
    },

    strategicConsiderations: {
      title: 'Managing the Menagerie',
      content: `**The Tier Trade-off**: Imps start at d12 and are easy to keep in line. Abyssal Brutes start at d8 and will rebel after only 4 actions. Don't bind a Brute if you don't have the "Chain of Light" mana to back it up.

**Possessed Path**: If you choose the *Possessed* specialization, you *are* the demon. Your Internal DD tracks your struggle for self-control. Failure here means you lose control of your character for one turn as the demon drives.

**Synergy**: Pair with classes that can taunt enemies (like Titan) to prevent your demons from taking damage, preserving their Dominance Dice for longer.`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'The Leash Dice',
      content: `Tracking multiple dice sizes can be a nightmare on paper. Use these physical hacks:

**Required Materials**:
- **Set of Polyhedral Dice**: (d12, d10, d8, d6) for each demon.
- **Demon Reference Cards**: To hold the active die.
- **Red "Hostile" Tokens**.

**The Physical Hack (Friction Points)**:
- **The Leash Dice**: Place the actual die on the demon's card. When you command them, physically swap the die for the next size down (d12 → d10). This provides an immediate visual of which "leash" is the shortest.
- **The AP Coin**: Use a coin to track if you've already commanded a specific demon this turn. Flip it once they've acted.
- **Restoration Tokens**: Use golden glass beads to represent your restoration spells. Hand one to the DM when you "discipline" a demon.

**Pro Tip**: Voice-act the demon's growing resistance. As the die hits d6, have the demon start talking back or straining against its spectral chains. It makes the Rebellion Save feel earned.`
    }
  },

  // Specializations
  specializations: {
    title: 'Exorcist Specializations',
    subtitle: 'Three Paths of Divine Dominion',

    description: `Every Exorcist binds demons through divine authority — but how they wield that authority defines their path. Three specializations offer radically different relationships with the darkness they command.`,

    specs: [
      {
        id: 'demonologist',
        name: 'Demonologist',
        icon: 'Necrotic/Demonic Empowerment',
        color: '#8B0000',
        theme: 'Multiple Demon Control',

        description: `Demonologists are legion commanders — divine generals who split their willpower across multiple bound demons, sacrificing individual power for overwhelming numbers. Where others bind one demon, the Demonologist binds four, turning the battlefield into a zoo of chained horrors under their singular command.`,

        playstyle: 'Summoner swarm — multiple demons, overwhelming action economy, constant DD juggling',

        strengths: [
          'Can bind up to 4 demons simultaneously',
          'Reduced Dominance restoration spell costs (-2 mana)',
          'Swarm bonus damage when multiple demons attack the same target',
          'Excellent action economy with independent demon actions'
        ],

        weaknesses: [
          'Individual demons are weaker than other specs',
          'Cannot bind Tier 4 (Greater) demons',
          'Managing 4 Dominance Dice simultaneously is demanding',
          'Catastrophic if multiple demons escape in the same turn'
        ],

        passiveAbilities: [
          {
            name: 'Divine Authority',
            tier: 'Path Passive',
            description: 'When you successfully maintain Dominance over a demon for 5 consecutive rounds, gain +1 to that demon\'s escape save DC. The chains tighten with time.',
            sharedBy: 'All Exorcists'
          },
          {
            name: 'Legion Commander',
            tier: 'Specialization Passive',
            description: 'You can bind up to 4 demons simultaneously (instead of 2). All DD restoration spells cost -2 mana. When 2+ demons attack the same target, each deals +1d6 bonus damage.',
            uniqueTo: 'Demonologist'
          }
        ],

        recommendedFor: 'Players who enjoy RTS-style multi-unit management, overwhelming action economy, and the chaos of commanding a demonic squad'
      },

      {
        id: 'demon_lord',
        name: 'Demon Lord',
        icon: 'Utility/Resistance',
        color: '#4B0082',
        theme: 'Single Powerful Demon + Self Empowerment',

        description: `Demon Lords forge an unbreakable bond with a single demon — a partnership of mutual destruction. They channel demonic power into both their bound servant AND themselves, becoming something greater than either alone. Their singular focus means no backup plan: if the demon falls, the Exorcist stands alone.`,

        playstyle: 'One devastating demon + self buffs — high risk, highest single-target reward, master-servant symbiosis',

        strengths: [
          'Can bind Tier 4 Greater Demons (most powerful)',
          'Bound demon has +2 to all stats, DD degrades every 2 actions',
          'Demonic power bleeds into the Exorcist (armor, damage buffs)',
          'Demon deals +2d8 bonus damage when at d6 DD or lower (desperation fury)'
        ],

        weaknesses: [
          'Can only bind 1 demon at a time',
          'All eggs in one basket — no backup if the demon escapes or dies',
          'Greater Demons start at d6 DD (hardest to control)',
          'Highest mana investment of any spec'
        ],

        passiveAbilities: [
          {
            name: 'Divine Authority',
            tier: 'Path Passive',
            description: 'When you successfully maintain Dominance over a demon for 5 consecutive rounds, gain +1 to that demon\'s escape save DC. The chains tighten with time.',
            sharedBy: 'All Exorcists'
          },
          {
            name: 'Infernal Pact',
            tier: 'Specialization Passive',
            description: 'Your single bound demon gains +2 to all stats and its DD degrades every 2 actions instead of every action. You can bind Tier 4 Greater Demons. When your demon is at d6 DD or lower, it deals +2d8 damage on all attacks. Additionally, you gain +2 armor while your demon is bound.',
            uniqueTo: 'Demon Lord'
          }
        ],

        recommendedFor: 'Players who enjoy boss-pet dynamics, high-risk/high-reward gameplay, and the fantasy of dominating a single terrifying entity'
      },

      {
        id: 'possessed',
        name: 'Possessed',
        icon: 'Psychic/Mind Control',
        color: '#9400D3',
        theme: 'Internal Demon Channeling',

        description: `The Possessed don't bind demons into the world — they invite them in. By channeling demonic essence directly into their own flesh, they gain supernatural physical power at the cost of constant internal warfare. Their Dominance Die doesn't track a pet's obedience — it tracks who's driving the body.`,

        playstyle: 'Hybrid melee/caster — self-buffs, demonic transformations, internal DD tracking self-control',

        internalDominanceRules: `**Internal Dominance Die Rules**: The Possessed uses an Internal DD (starting at d10) instead of external demon DD. It degrades when you: use demonic abilities (1 step), take damage (1 step), or use powerful demon abilities (2 steps). When Internal DD reaches 0, the demon takes control for 1 turn — you attack the nearest creature (ally or enemy) with enhanced damage. After the demon's turn, Internal DD resets to d6. DD restoration spells (Divine Rebuke, Chain of Light, Absolute Dominion) work on your Internal DD instead of targeting external demons.`,

        strengths: [
          'Gain demonic physical enhancements (+2 Str, +2 Con, +10 speed)',
          'Melee attacks deal additional 1d8 necrotic damage',
          'No external demons to manage or position',
          'Powerful self-buffs and demon form transformations'
        ],

        weaknesses: [
          'Cannot summon external demons at all',
          'Internal DD failure = demon takes control of your body for 1 turn',
          'Self-harm risk: 3d6 psychic damage when Internal DD hits 0',
          'No tactical positioning advantage from summon placement'
        ],

        passiveAbilities: [
          {
            name: 'Divine Authority',
            tier: 'Path Passive',
            description: 'When you successfully maintain Dominance over a demon for 5 consecutive rounds, gain +1 to that demon\'s escape save DC. The chains tighten with time.',
            sharedBy: 'All Exorcists'
          },
          {
            name: 'Demonic Fusion',
            tier: 'Specialization Passive',
            description: 'You channel a demon internally instead of binding it externally. Gain +2 Strength, +2 Constitution, and +10 movement speed. Your melee attacks deal an additional 1d8 necrotic damage. Your Internal DD starts at d10 and degrades when you use demonic abilities or take damage. At 0 DD, the demon takes control for 1 turn (attack nearest creature), then resets to d6. You take 3d6 psychic damage on loss of control.',
            uniqueTo: 'Possessed'
          }
        ],

        recommendedFor: 'Players who enjoy hybrid melee/caster gameplay, self-buff management, and the constant drama of wrestling a demon inside their own skull'
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
      spellType: 'ACTION',
      icon: 'Fire/Flame Burst',
      school: 'Summoning',
      level: 2,

      typeConfig: {
        castTime: 10,
        castTimeType: 'MINUTES',
        ritual: true
      },

      targetingConfig: {
        targetingType: 'area',
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
        attribute: 'SPIRIT',
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
      spellType: 'ACTION',
      icon: 'Necrotic/Ghostly Menace',
      school: 'Summoning',
      level: 4,

      typeConfig: {
        castTime: 15,
        castTimeType: 'MINUTES',
        ritual: true
      },

      targetingConfig: {
        targetingType: 'area',
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
        attribute: 'AGILITY',
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
          savingThrow: 'Agility (Stealth) DC 14',
          abilities: ['Shadow Bite (3d6 necrotic)', 'Shadow Step (teleport 30 ft)', 'Pack Tactics (advantage when ally nearby)']
        }
      },

      flavorText: 'The shadows coalesce. The hound emerges. The hunt begins.'
    },

    {
      id: 'exo_bind_abyssal_brute',
      name: 'Bind Abyssal Brute',
      description: 'Bind an Abyssal Brute through raw strength and endurance. Requires giant\'s blood, iron chains, and deep earth stone. Must be cast during a thunderstorm in mountainous terrain.',
      spellType: 'ACTION',
      icon: 'Necrotic/Spectral Summoning',
      school: 'Summoning',
      level: 6,

      typeConfig: {
        castTime: 20,
        castTimeType: 'MINUTES',
        ritual: true
      },

      targetingConfig: {
        targetingType: 'area',
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
      spellType: 'ACTION',
      icon: 'Necrotic/Drain Soul',
      school: 'Summoning',
      level: 5,

      typeConfig: {
        castTime: 15,
        castTimeType: 'MINUTES',
        ritual: true
      },

      targetingConfig: {
        targetingType: 'area',
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
      spellType: 'ACTION',
      icon: 'Void/Consumed by Void',
      school: 'Summoning',
      level: 5,

      typeConfig: {
        castTime: 15,
        castTimeType: 'MINUTES',
        ritual: true
      },

      targetingConfig: {
        targetingType: 'area',
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
      id: 'exo_divine_rebuke',
      name: 'Divine Rebuke',
      description: 'Channel a pulse of divine authority into a bound demon, restoring its Dominance Die by 1 step.',
      spellType: 'ACTION',
      icon: 'Radiant/Radiant Bolt',
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
        validTargets: 'bound_demon_or_self'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 3,
        components: ['verbal'],
        verbalText: 'Recede!'
      },

      resolution: 'AUTOMATIC',

      effects: {
        dominance: {
          type: 'restore_steps',
          amount: '1 step',
          description: 'Restores target\'s Dominance Die by 1 step (e.g., d6 → d8, 0 → d6)'
        }
      },

      specialMechanics: {
        dominanceManagement: {
          enabled: true,
          effect: 'Restore DD by 1 step',
          example: 'd6 → d8, or 0 → d6. For Possessed: works on Internal DD.',
          note: 'Cheapest restoration. Your bread-and-butter maintenance spell.'
        }
      },

      flavorText: 'A crack of divine light. The demon flinches. The leash holds.'
    },

    {
      id: 'exo_chain_of_light',
      name: 'Chain of Light',
      description: 'Forge a chain of holy radiance between you and a bound demon, restoring its Dominance Die by 2 steps.',
      spellType: 'ACTION',
      icon: 'Radiant/Divine Halo',
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
        validTargets: 'bound_demon_or_self'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 5,
        components: ['verbal', 'somatic'],
        verbalText: 'Catena Lucis!',
        somaticText: 'Binding gesture with both hands'
      },

      resolution: 'AUTOMATIC',

      effects: {
        dominance: {
          type: 'restore_steps',
          amount: '2 steps',
          description: 'Restores Dominance Die by 2 steps (e.g., d6 → d10, 0 → d8)'
        }
      },

      specialMechanics: {
        dominanceManagement: {
          enabled: true,
          effect: 'Restore DD by 2 steps',
          example: 'd6 → d8 → d10. For Possessed: works on Internal DD.',
          note: 'The efficiency sweet spot — meaningful recovery without breaking the mana bank.'
        }
      },

      flavorText: 'Golden chains materialize from nothing. The demon screams. The light is absolute.'
    },

    {
      id: 'exo_absolute_dominion',
      name: 'Absolute Dominion',
      description: 'Unleash the full force of your divine authority, resetting a demon\'s Dominance Die to its maximum.',
      spellType: 'ACTION',
      icon: 'Force/Force Field',
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
        validTargets: 'bound_demon_or_self'
      },

      durationConfig: {
        durationType: 'instant'
      },

      resourceCost: {
        mana: 7,
        components: ['verbal', 'somatic'],
        verbalText: 'Imperium Absolutum!',
        somaticText: 'Commanding gesture with holy symbol raised'
      },

      resolution: 'AUTOMATIC',

      effects: {
        dominance: {
          type: 'restore_maximum',
          description: 'Resets target\'s Dominance Die to its maximum size (full reset)'
        }
      },

      specialMechanics: {
        dominanceManagement: {
          enabled: true,
          effect: 'Reset DD to maximum',
          example: 'Any → d12 (Imp), Any → d10 (Shadow Hound), etc. For Possessed: resets Internal DD to d10.',
          note: 'Your emergency brake. Expensive but absolute. Always keep 7 mana banked for this.'
        }
      },

      flavorText: 'Your voice splits the air like a thunderclap. The demon drops to its knees. There is no debate.'
    },

    // DEMON COMMAND SPELLS
    {
      id: 'exo_command_attack',
      name: 'Command: Attack',
      description: 'Command a bound demon to attack a target with enhanced ferocity.',
      spellType: 'ACTION',
      icon: 'Utility/Overlords Command',
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
      icon: 'Necrotic/Spectral Summoning',
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
      icon: 'Radiant/Divine Beam',
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
      level: 3,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'holy',
        icon: 'Radiant/Divine Blessing',
        tags: ['damage', 'holy', 'radiant', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 50,
        targetRestrictions: ['enemy']
      },

      damageConfig: {
        formula: '3d8 + spirit',
        elementType: 'radiant',
        damageTypes: ['direct'],
        attackType: 'spell_attack',
        conditionalDamage: {
          enabled: true,
          conditions: [
            {
              targetType: 'creature_type',
              creatureTypes: ['fiend', 'undead'],
              bonusFormula: '2d8',
              description: 'Deals extra damage to demons and undead'
            }
          ]
        },
          resolution: 'DICE',
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 15
        },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0
       },

      resolution: 'DICE',
      tags: ['damage', 'holy', 'radiant', 'universal']
    },

    {
      id: 'exo_empower_demon',
      name: 'Empower Demon',
      description: 'Channel energy into a bound demon, enhancing its combat abilities.',
      level: 3,
      spellType: 'ACTION',
      effectTypes: ['buff'],

      typeConfig: {
        school: 'shadow',
        icon: 'General/Increase Strength',
        tags: ['buff', 'demon enhancement', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['bound_demon']
      },

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'empower_demon',
          name: 'Empowered Demon',
          description: 'Gain +2 to attack rolls, +1d8 damage on all attacks, and +2 Armor for 3 rounds',
          statModifier: {
            stat: 'attack_rolls',
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

      damageConfig: {
        formula: '1d8',
        damageTypes: ['bonus'],
        appliesTo: 'all_attacks',
        description: 'Adds 1d8 bonus damage to all demon attacks',
          resolution: 'DICE',
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 12
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0
       },

      resolution: 'AUTOMATIC',
      tags: ['buff', 'demon enhancement', 'universal']
    },

    // POSSESSED SPEC SPELLS
    {
      id: 'exo_channel_demon_strength',
      name: 'Channel Demon Strength',
      description: 'Channel your internal demon\'s strength, gaining enhanced physical power.',
      level: 2,
      spellType: 'ACTION',
      effectTypes: ['buff'],

      typeConfig: {
        school: 'shadow',
        icon: 'Psychic/Mind Control',
        tags: ['buff', 'possession', 'self', 'possessed'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'channel_demon_strength',
          name: 'Demonic Strength',
          description: 'Gain +4 Strength and +2d6 necrotic damage on all melee attacks for 5 rounds',
          statModifier: {
            stat: 'strength',
            magnitude: 4,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      damageConfig: {
        formula: '2d6',
        elementType: 'necrotic',
        damageTypes: ['bonus'],
        appliesTo: 'melee_attacks',
        description: 'Adds 2d6 necrotic damage to all melee attacks',
          resolution: 'DICE',
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 10
        },
        actionPoints: 1,
        components: ['verbal']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0
       },

      resolution: 'AUTOMATIC',
      tags: ['buff', 'possession', 'self', 'possessed']
    },

    {
      id: 'exo_demonic_fury',
      name: 'Demonic Fury',
      description: 'Unleash your internal demon\'s rage, gaining attack speed and ferocity.',
      level: 4,
      spellType: 'ACTION',
      effectTypes: ['buff'],

      typeConfig: {
        school: 'shadow',
        icon: 'General/Fiery Rage',
        tags: ['buff', 'possession', 'self', 'possessed'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'demonic_fury',
          name: 'Demonic Fury',
          description: 'Gain +1 extra attack per turn, increased critical hit range (19-20), and +20 feet movement speed for 4 rounds',
          statModifier: {
            stat: 'extra_attacks',
            magnitude: 1,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 4,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 18
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 3
       },

      resolution: 'AUTOMATIC',
      tags: ['buff', 'possession', 'self', 'possessed']
    },

    {
      id: 'exo_purifying_light',
      name: 'Purifying Light',
      description: 'Emit a burst of purifying light that damages demons and undead while healing allies.',
      level: 5,
      spellType: 'ACTION',
      effectTypes: ['damage', 'healing'],

      typeConfig: {
        school: 'holy',
        icon: 'Healing/Prayer',
        tags: ['damage', 'healing', 'holy', 'aoe', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingMode: 'effect',
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self',
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['enemy', 'ally']
      },

      effectTargeting: {
        damage: {
          targetingType: 'area',
          rangeType: 'self',
          aoeShape: 'circle',
          aoeParameters: { radius: 20 },
          targetRestrictions: ['enemy']
        },
        healing: {
          targetingType: 'area',
          rangeType: 'self',
          aoeShape: 'circle',
          aoeParameters: { radius: 20 },
          targetRestrictions: ['ally']
        }
      },

      damageConfig: {
        formula: '5d6 + spirit',
        elementType: 'radiant',
        damageTypes: ['area'],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 15,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        conditionalDamage: {
          enabled: true,
          conditions: [
            {
              targetType: 'creature_type',
              creatureTypes: ['fiend', 'undead'],
              bonusFormula: '2d6',
              description: 'Deals extra damage to demons and undead'
            }
          ]
        },
          resolution: 'DICE',
      },

      healingConfig: {
        formula: '2d6 + spirit',
        healingType: 'aoe',
        targetRestrictions: ['ally'],
        description: 'Heals all allies in the area'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 25
        },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 3
       },

      resolution: 'DICE',
      tags: ['damage', 'healing', 'holy', 'aoe', 'universal']
    },

    // ADDITIONAL LEVEL 1 SPELLS
    {
      id: 'exo_holy_brand',
      name: 'Holy Brand',
      description: 'Brand an enemy with holy light, marking them and dealing bonus radiant damage on next attack.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['debuff', 'damage'],

      typeConfig: {
        school: 'holy',
        icon: 'Radiant/Divine Blessing',
        tags: ['debuff', 'holy', 'mark', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        requiresLineOfSight: true
      },

      damageConfig: {
        formula: '1d6',
        elementType: 'radiant',
        damageTypes: ['direct'],
          resolution: 'DICE',
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'holy_brand',
          name: 'Holy Brand',
          description: 'Marked with holy light - takes +1d6 radiant damage from next attack for 2 rounds',
          statusType: 'marked',
          dotFormula: '+1d6',
          dotDamageType: 'radiant',
          damagePerTurn: '+1d6',
          mechanicsText: '+1d6 radiant damage from next attack for 2 rounds'
        }],
        durationValue: 2,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveDC: 12,
        saveType: 'spirit',
        saveOutcome: 'negates'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 4
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0
       },

      resolution: 'DICE',
      tags: ['debuff', 'holy', 'mark', 'universal']
    },

    {
      id: 'exo_demon_sense',
      name: 'Demon Sense',
      description: 'Sense nearby demons and fiends, revealing their location for 3 rounds.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['utility'],

      typeConfig: {
        school: 'holy',
        icon: 'Radiant/Redemption',
        tags: ['utility', 'detection', 'demons', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      utilityConfig: {
        utilityType: 'detection',
        selectedEffects: [{
          id: 'demon_sense',
          name: 'Demon Sense',
          detectionType: 'creature_type',
          creatureType: 'fiend',
          range: 60
        }],
        duration: 3,
        durationUnit: 'rounds',
        concentration: false,
        power: 'weak'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 4
        },
        actionPoints: 1,
        components: ['verbal']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0
       },

      resolution: 'DICE',
      tags: ['utility', 'detection', 'demons', 'universal']
    },

    {
      id: 'exo_binding_circle',
      name: 'Binding Circle',
      description: 'Create a holy circle that prevents demons from entering or leaving for 3 rounds.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['control'],

      typeConfig: {
        school: 'holy',
        icon: 'Healing/Prayer',
        tags: ['control', 'zone', 'holy', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeShape: 'circle',
        aoeParameters: { radius: 10 }
      },

      controlConfig: {
        controlType: 'restriction',
        duration: 3,
        durationUnit: 'rounds',
        saveDC: 12,
        saveType: 'spirit',
        savingThrow: true,
        effects: [{
          id: 'binding_circle',
          name: 'Binding Circle',
          description: 'Holy circle prevents demons from crossing - movement blocked for fiends',
          config: {
            creatureType: 'fiend',
            blocksEntry: true,
            blocksExit: true,
            saveType: 'charisma',
            saveDC: 15,
            condition: 'restrained',
            duration: 5,
            durationUnit: 'rounds'
          }
        }]
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 5
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2
       },

      resolution: 'DICE',
      tags: ['control', 'zone', 'holy', 'universal']
    },

    // LEVEL 6 SPELLS
    {
      id: 'exo_bind_pit_fiend',
      name: 'Bind Pit Fiend',
      description: 'Bind a powerful Pit Fiend through hellfire and iron will. Starts at d6 DD — extremely hard to control.',
      level: 6,
      spellType: 'ACTION',
      effectTypes: ['summoning'],

      typeConfig: {
        school: 'shadow',
        icon: 'Utility/Summon Minion',
        tags: ['summoning', 'binding', 'demon', 'pit fiend', 'demonologist'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['ground']
      },

      summoningConfig: {
        summonType: 'permanent',
        creatureName: 'Pit Fiend',
        creatureType: 'fiend',
        quantity: 1,
        statsFormula: '8d10 + 40',
        attackFormula: '3d8 + 6',
        duration: 0,
        durationUnit: 'permanent',
        commandable: true,
        actionsPerTurn: 2,
        abilities: ['Fire Breath', 'Claw Attack', 'Intimidating Presence']
      },

      specialMechanics: {
        bindingRitual: {
          enabled: true,
          demonType: 'Pit Fiend',
          startingDD: 'd6',
          savingThrow: 'Constitution (Endurance) DC 18',
          abilities: ['Fire Breath (6d6 fire, AoE)', 'Claw Attack (3d8+6 slashing)', 'Intimidating Presence (enemies frightened)'],
          deathRule: 'If the Pit Fiend dies, you must perform this binding ritual again with fresh components.'
        }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 35
        },
        actionPoints: 2,
        components: ['verbal', 'somatic', 'material']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 10
       },

      resolution: 'DICE',
      tags: ['summoning', 'binding', 'demon', 'pit fiend', 'demonologist'],
      flavorText: 'The ground cracks. Hellfire erupts. The Pit Fiend rises — and for one terrible moment, it looks you in the eye.'
    },

    {
      id: 'exo_mass_dominance',
      name: 'Mass Dominance',
      description: 'Restore dominance over all controlled demons simultaneously, restoring 2 DD to each.',
      level: 6,
      spellType: 'ACTION',
      effectTypes: ['utility'],

      typeConfig: {
        school: 'holy',
        icon: 'Force/Force Field',
        tags: ['utility', 'demon control', 'dominance', 'demonologist'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      utilityConfig: {
        utilityType: 'resource_restoration',
        selectedEffects: [{
          id: 'mass_dominance',
          name: 'Mass Dominance',
          resourceType: 'dominance_die',
          amount: 2,
          targetType: 'all_demons'
        }],
        duration: 0,
        durationUnit: 'instant',
        concentration: false,
        power: 'major'
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 30
        },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 5
       },

      resolution: 'DICE',
      tags: ['utility', 'demon control', 'dominance', 'demonologist']
    },

    {
      id: 'exo_holy_wrath',
      name: 'Holy Wrath',
      description: 'Channel holy power to deal massive radiant damage to all demons in an area.',
      level: 6,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'holy',
        icon: 'Radiant/Divine Beam',
        tags: ['damage', 'holy', 'aoe', 'anti demon', 'universal'],
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
        formula: '6d10 + spirit',
        elementType: 'radiant',
        damageTypes: ['area'],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'spirit',
          difficultyClass: 16,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2.0,
          extraDice: '3d10',
          critEffects: ['radiant_burn']
        },
          resolution: 'DICE',
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 30
        },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 4
       },

      resolution: 'DICE',
      tags: ['damage', 'holy', 'aoe', 'anti demon', 'universal']
    },

    // LEVEL 7 SPELLS
    {
      id: 'exo_bind_balor',
      name: 'Bind Balor',
      description: 'Bind a legendary Balor — a demon of annihilation. Starts at d6 DD with DC 18 escape. If it breaks free, it attacks EVERYTHING.',
      level: 7,
      spellType: 'ACTION',
      effectTypes: ['summoning'],

      typeConfig: {
        school: 'shadow',
        icon: 'Utility/Summon Minion',
        tags: ['summoning', 'binding', 'demon', 'balor', 'demon lord'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['ground']
      },

      summoningConfig: {
        summonType: 'permanent',
        creatureName: 'Balor',
        creatureType: 'fiend',
        quantity: 1,
        statsFormula: '10d12 + 60',
        attackFormula: '4d10 + 8',
        duration: 0,
        durationUnit: 'permanent',
        commandable: true,
        actionsPerTurn: 3,
        abilities: ['Flame Whip', 'Death Throes', 'Flaming Sword', 'Teleport']
      },

      specialMechanics: {
        bindingRitual: {
          enabled: true,
          demonType: 'Balor',
          startingDD: 'd6',
          savingThrow: 'Constitution (Endurance) DC 18',
          abilities: ['Flame Whip (4d10+8 fire)', 'Death Throes (8d6 fire AoE on death)', 'Flaming Sword (5d10 slashing+fire)', 'Teleport (60ft)'],
          deathRule: 'If the Balor dies, it explodes (Death Throes: 8d6 fire to all within 30ft) and must be rebound from scratch.',
          escapeBehavior: 'On failed escape: always rolls hostile (5-6 on 1d6). A freed Balor does not flee.'
        }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 45
        },
        actionPoints: 3,
        components: ['verbal', 'somatic', 'material']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 15
       },

      resolution: 'DICE',
      tags: ['summoning', 'binding', 'demon', 'balor', 'demon lord'],
      flavorText: 'The Balor opens its eyes. For the first time in a thousand years, it knows fear — of you.'
    },

    {
      id: 'exo_infernal_empowerment',
      name: 'Infernal Empowerment',
      description: 'Empower all controlled demons with infernal energy, enhancing their damage and defense.',
      level: 7,
      spellType: 'ACTION',
      effectTypes: ['buff'],

      typeConfig: {
        school: 'shadow',
        icon: 'Necrotic/Demonic Empowerment',
        tags: ['buff', 'demon enhancement', 'mass', 'demonologist'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'infernal_empowerment',
          name: 'Infernal Empowerment',
          description: 'All controlled demons gain +4 to attack rolls, +3d8 damage, and +30 temporary HP for 5 rounds',
          statModifier: {
            stat: 'attack_rolls',
            magnitude: 4,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 35
        },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 6
       },

      resolution: 'DICE',
      tags: ['buff', 'demon enhancement', 'mass', 'demonologist']
    },

    {
      id: 'exo_possession_mastery',
      name: 'Possession Mastery',
      description: 'Master your internal demon, gaining ultimate control and enhanced power for 5 rounds.',
      level: 7,
      spellType: 'ACTION',
      effectTypes: ['buff'],

      typeConfig: {
        school: 'shadow',
        icon: 'Psychic/Mind Control',
        tags: ['buff', 'possession', 'transformation', 'possessed'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'possession_mastery',
          name: 'Possession Mastery',
          description: 'Gain +5 to all stats, +4d8 damage on all attacks, resistance to all damage, and enhanced demonic abilities for 5 rounds',
          statModifier: {
            stat: 'all_stats',
            magnitude: 5,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 40
        },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 8
       },

      resolution: 'DICE',
      tags: ['buff', 'possession', 'transformation', 'possessed']
    },

    // LEVEL 8 SPELLS
    {
      id: 'exo_infernal_legion',
      name: 'Infernal Legion',
      description: 'Summon 3 lesser demons, each bound with d10 Dominance Die. The swarm obeys — but each one chafes at the leash.',
      level: 8,
      spellType: 'ACTION',
      effectTypes: ['summoning'],

      typeConfig: {
        school: 'shadow',
        icon: 'Utility/Summon Minion',
        tags: ['summoning', 'mass', 'demons', 'demonologist'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 40,
        targetRestrictions: ['ground']
      },

      summoningConfig: {
        summonType: 'temporary',
        creatureName: 'Lesser Demon',
        creatureType: 'fiend',
        quantity: 3,
        statsFormula: '3d8 + 10',
        attackFormula: '1d8 + 2',
        duration: 5,
        durationUnit: 'rounds',
        commandable: true,
        actionsPerTurn: 1,
        abilities: ['Claw Attack', 'Swarm Tactics']
      },

      specialMechanics: {
        bindingRitual: {
          enabled: true,
          demonType: 'Lesser Demon',
          startingDD: 'd10',
          savingThrow: 'Charisma (Persuasion) DC 12',
          abilities: ['Claw Attack (1d8+2 slashing)', 'Swarm Tactics (+1d4 when 2+ demons attack same target)'],
          deathRule: 'Lesser demons despawn after 5 rounds. If killed, they are gone — no rebind needed.'
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

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 10
       },

      resolution: 'DICE',
      tags: ['summoning', 'mass', 'demons', 'demonologist']
    },

    {
      id: 'exo_divine_judgment',
      name: 'Divine Judgment',
      description: 'Call down divine judgment on all enemies, dealing massive holy damage to fiends and demons.',
      level: 8,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'holy',
        icon: 'Radiant/Divine Halo',
        tags: ['damage', 'holy', 'aoe', 'ultimate', 'universal'],
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
        formula: '8d12 + spirit',
        elementType: 'radiant',
        damageTypes: ['area'],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'spirit',
          difficultyClass: 18,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2.5,
          extraDice: '4d12',
          critEffects: ['divine_burn', 'stun']
        },
          resolution: 'DICE',
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 50
        },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 8
       },

      resolution: 'DICE',
      tags: ['damage', 'holy', 'aoe', 'ultimate', 'universal']
    },

    {
      id: 'exo_demonic_transformation',
      name: 'Demonic Transformation',
      description: 'Fully transform into a demon, gaining devastating power and abilities.',
      level: 8,
      spellType: 'ACTION',
      effectTypes: ['transformation'],

      typeConfig: {
        school: 'shadow',
        icon: 'Necrotic/Transform Demon',
        tags: ['transformation', 'demon', 'ultimate', 'possessed'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      transformationConfig: {
        transformationType: 'demonic',
        targetType: 'self',
        duration: 6,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Demon Form',
        description: 'Embrace the demon within, gaining terrible power at great risk.',
        grantedAbilities: [
          { id: 'demon_stats', name: 'Demonic Might', description: '+6 Strength, +4 Agility, +6 Constitution' },
          { id: 'claw_attack', name: 'Claw Attack', description: 'Natural weapon dealing 2d8+Str slashing damage' },
          { id: 'demonic_roar', name: 'Demonic Roar', description: 'Frighten enemies within 30ft (once per transformation)' },
          { id: 'flame_aura', name: 'Flame Aura', description: 'Deal 1d6 fire damage to attackers' },
          { id: 'demon_resistances', name: 'Resistances', description: 'Resist fire, necrotic, poison; Vulnerable to radiant' }
        ]
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 45
        },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 10
       },

      resolution: 'DICE',
      tags: ['transformation', 'demon', 'ultimate', 'possessed']
    },

    // LEVEL 9 SPELLS
    {
      id: 'exo_apocalyptic_summoning',
      name: 'Apocalyptic Summoning',
      description: 'Summon multiple powerful demons simultaneously to unleash apocalyptic destruction.',
      level: 9,
      spellType: 'ACTION',
      effectTypes: ['summoning'],

      typeConfig: {
        school: 'shadow',
        icon: 'Utility/Summon Minion',
        tags: ['summoning', 'mass', 'ultimate', 'demonologist'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 50,
        targetRestrictions: ['ground']
      },

      summoningConfig: {
        summonType: 'temporary',
        creatureName: 'Apocalypse Demon',
        creatureType: 'fiend',
        quantity: 3,
        statsFormula: '8d10 + 50',
        attackFormula: '4d8 + 6',
        duration: 6,
        durationUnit: 'rounds',
        commandable: true,
        actionsPerTurn: 2,
        abilities: ['Multi-Attack', 'Flame Breath', 'Teleport', 'Fear Aura']
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 55
        },
        actionPoints: 3,
        components: ['verbal', 'somatic', 'material']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 15
       },

      resolution: 'DICE',
      tags: ['summoning', 'mass', 'ultimate', 'demonologist']
    },

    {
      id: 'exo_holy_apocalypse',
      name: 'Holy Apocalypse',
      description: 'Unleash apocalyptic holy power that obliterates all demons in a massive area.',
      level: 9,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'holy',
        icon: 'Force/Force Field',
        tags: ['damage', 'holy', 'ultimate', 'mass', 'universal'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 40 },
        targetRestrictions: ['enemy']
      },

      damageConfig: {
        formula: '10d12 + spirit',
        elementType: 'radiant',
        damageTypes: ['area'],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'spirit',
          difficultyClass: 19,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 3.0,
          extraDice: '5d12',
          critEffects: ['divine_annihilation', 'banishment']
        },
          resolution: 'DICE',
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 60
        },
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 12
       },

      resolution: 'DICE',
      tags: ['damage', 'holy', 'ultimate', 'mass', 'universal']
    },

    {
      id: 'exo_perfect_dominance',
      name: 'Perfect Dominance',
      description: 'Achieve perfect dominance over all demons, maximizing their power and loyalty.',
      level: 9,
      spellType: 'ACTION',
      effectTypes: ['buff'],

      typeConfig: {
        school: 'holy',
        icon: 'Force/Force Field',
        tags: ['buff', 'dominance', 'demon enhancement', 'ultimate', 'demon lord'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'perfect_dominance',
          name: 'Perfect Dominance',
          description: 'All controlled demons gain maximum stats, +6 to all rolls, damage immunity to one element each, and cannot be turned or dismissed for 6 rounds',
          statModifier: {
            stat: 'all_stats',
            magnitude: 6,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 6,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 55
        },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 15
       },

      resolution: 'DICE',
      tags: ['buff', 'dominance', 'demon enhancement', 'ultimate', 'demon lord']
    },

    // LEVEL 10 SPELLS
    {
      id: 'exo_bind_demon_prince',
      name: 'Bind Demon Prince',
      description: 'Bind a Demon Prince — an entity of apocalyptic power. d6 DD, DC 20 escape. If it breaks free, it does not flee. Ever.',
      level: 10,
      spellType: 'ACTION',
      effectTypes: ['summoning'],

      typeConfig: {
        school: 'shadow',
        icon: 'Utility/Summon Minion',
        tags: ['summoning', 'ultimate', 'demon prince', 'demon lord'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 40,
        targetRestrictions: ['ground']
      },

      summoningConfig: {
        summonType: 'permanent',
        creatureName: 'Demon Prince',
        creatureType: 'fiend',
        quantity: 1,
        statsFormula: '15d12 + 100',
        attackFormula: '6d10 + 10',
        duration: 0,
        durationUnit: 'permanent',
        commandable: true,
        actionsPerTurn: 4,
        abilities: ['Apocalyptic Strike', 'Infernal Command', 'Reality Tear', 'Flame Storm', 'Teleport']
      },

      specialMechanics: {
        bindingRitual: {
          enabled: true,
          demonType: 'Demon Prince',
          startingDD: 'd6',
          savingThrow: 'Constitution (Endurance) DC 20',
          abilities: ['Apocalyptic Strike (6d10+10 mixed)', 'Infernal Command (buffs nearby demons)', 'Reality Tear (teleport + 4d12 force)', 'Flame Storm (8d6 fire AoE)', 'Teleport (120ft)'],
          deathRule: 'If the Demon Prince dies, reality shudders. You must obtain Prince-tier components and succeed a DC 20 binding check to rebind.',
          escapeBehavior: 'On failed escape: ALWAYS turns fully hostile. A freed Demon Prince does not flee. It conquers.'
        }
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 70
        },
        actionPoints: 3,
        components: ['verbal', 'somatic', 'material']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 30
       },

      resolution: 'DICE',
      tags: ['summoning', 'ultimate', 'demon prince', 'demon lord']
    },

    {
      id: 'exo_divine_annihilation',
      name: 'Divine Annihilation',
      description: 'Channel ultimate divine power to annihilate all demons and fiends in sight.',
      level: 10,
      spellType: 'ACTION',
      effectTypes: ['damage'],

      typeConfig: {
        school: 'holy',
        icon: 'Radiant/Divine Halo',
        tags: ['damage', 'holy', 'ultimate', 'annihilation', 'universal'],
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
        formula: '15d12 + spirit',
        elementType: 'radiant',
        damageTypes: ['area'],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'spirit',
          difficultyClass: 20,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 3.5,
          extraDice: '8d12',
          critEffects: ['divine_annihilation', 'banishment', 'stun']
        },
          resolution: 'DICE',
      },

      resourceCost: {
        resourceTypes: ['mana'],
        resourceValues: {
          mana: 80
        },
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 20
       },

      resolution: 'DICE',
      tags: ['damage', 'holy', 'ultimate', 'annihilation', 'universal']
    },

    {
      id: 'exo_demon_god_form',
      name: 'Demon God Form',
      description: 'Ascend to become a Demon God with ultimate power and abilities.',
      level: 10,
      spellType: 'ACTION',
      effectTypes: ['transformation'],

      typeConfig: {
        school: 'shadow',
        icon: 'Necrotic/Transform Demon',
        tags: ['transformation', 'ultimate', 'god form', 'possessed'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      transformationConfig: {
        transformationType: 'demonic',
        targetType: 'self',
        duration: 5,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Demon Lord',
        description: 'Fully embrace the demon, becoming a terrifying lord of the infernal.',
        grantedAbilities: [
          { id: 'lord_stats', name: 'Infernal Might', description: '+8 to all attributes' },
          { id: 'reality_warp', name: 'Reality Warp', description: 'Teleport up to 60ft using action points' },
          { id: 'infernal_command', name: 'Infernal Command', description: 'Command demons and undead within 60ft' },
          { id: 'terror_aura', name: 'Aura of Terror', description: 'Enemies within 30ft must save or be frightened' },
          { id: 'demon_immunities', name: 'Infernal Immunity', description: 'Immune to fire, necrotic, poison damage' },
          { id: 'demon_exhaustion', name: 'Corruption (On End)', description: 'Take 4d10 psychic damage and gain 2 exhaustion levels when transformation ends' }
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

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 30
       },

      resolution: 'DICE',
      tags: ['transformation', 'ultimate', 'god form', 'possessed']
    }
  ]
};


