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
      content: `Playing an Exorcist is about preparation, control, and risk management. Key considerations:

**Pre-Combat Preparation**:
- Perform binding rituals to capture demons (requires ingredients and conditions)
- Each demon type requires specific ritual components and skill checks
- Bound demons persist until dismissed, killed, or they escape
- Can have multiple demons bound simultaneously (spec-dependent)

**Dominance Die System**:
- Each bound demon has a Dominance Die (d6, d8, d10, or d12)
- Die size represents how submissive/controlled the demon is
- Dominance Die decreases by one size each time the demon:
  * Performs an action (attacks, uses ability, etc.)
  * Takes damage from an enemy
- When Dominance Die reaches 0, demon makes a saving throw or escapes

**Dominance Management**:
- Use Dominance Replenishment spells to restore control
- **Reassert Dominance**: Restore DD to maximum size
- **Chain of Command**: Increase DD by one size for 3 actions
- **Divine Bond**: Restore DD by 2 steps
- Balance demon usage with Dominance maintenance

**Demon Command Strategy**:
- Command demons to attack, defend, or use special abilities
- More powerful demons have lower starting Dominance Dice (harder to control)
- Weaker demons (d12 DD) are easier to maintain but less powerful
- Stronger demons (d6-d8 DD) are powerful but require constant attention

**Binding Ritual Examples**:
- **Imp** (d12 DD): Requires purified lava, ash, flame-touched gemstone; midnight ritual
- **Shadow Hound** (d10 DD): Requires nightshade essence, shadowy cloak, silver mirror; darkness ritual
- **Abyssal Brute** (d8 DD): Requires giant's blood, iron chains, deep earth stone; thunderstorm ritual
- **Banshee** (d8 DD): Requires locket, sorrowful tears, white rose; graveyard ritual
- **Wraith** (d10 DD): Requires ectoplasm, moonstone shard, spider silk veil; full moon ritual

**Losing Control**:
- When DD reaches 0, demon makes its specific saving throw
- Success: DD restored to d6 (demon remains bound but weakened)
- Failure: Demon escapes and may turn hostile
- Hostile demons can attack the Exorcist or flee

**Specialization Synergies**:
- **Demonologist**: Control multiple weaker demons, better multi-demon management
- **Demon Lord**: Control fewer but more powerful demons, enhanced single-demon power
- **Possessed**: Channel demon powers directly, internal struggle mechanics

**Team Dynamics**:
- Demons provide frontline presence for squishy allies
- Can control battlefield with multiple demon positions
- Synergizes with classes that benefit from multiple targets
- Warn allies when demons are close to escaping (friendly fire risk)`
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
    
    visualRepresentation: {
      title: 'Visual Representation',
      content: `The Dominance gauge appears as individual bars for each bound demon, showing:
- Demon name and type
- Current Dominance Die size (d12, d10, d8, d6)
- Visual indicator of control strength (green = stable, yellow = weakening, red = critical)
- Number of actions until next DD decrease
- Available demon abilities

When a demon's DD reaches d6 or lower, the bar pulses red as a warning. At 0, a saving throw prompt appears.`
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


