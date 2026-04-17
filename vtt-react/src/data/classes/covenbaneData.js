export const COVENBANE_DATA = {
  id: 'covenbane',
  name: 'Covenbane',
  icon: 'fas fa-crosshairs',
  color: '#8B4513',
  role: 'Anti-Magic Hunter',
  damageTypes: ['radiant', 'force', 'slashing'],

  // Overview section
  overview: {
    title: 'The Covenbane',
    subtitle: 'Anti-Magic Hunter and Evil Destroyer',

    description: `The Covenbane is a relentless hunter of evil magic, wielding powerful anti-magic abilities to track, weaken, and destroy spellcasters who wield dark forces. Through the Hexbreaker Charge mechanic, Covenbanes build power by confronting magical threats, unleashing devastating abilities that disrupt spells, banish demons, and bring divine judgment to those who abuse magic's power.`,

    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `Covenbanes are driven by an unyielding hatred of evil magic and those who wield it. They may be religious inquisitors, seasoned monster hunters, or survivors of magical atrocities who have dedicated their lives to eradicating magical threats. Their anti-magic abilities manifest as holy silver weapons, divine seals that disrupt spells, and the ability to sense evil magic from afar.

Their dedication often shows physically: blessed silver weapons that glow when evil magic is near, holy seals tattooed on their skin that flare when spells are cast nearby, or an aura of righteous fury when confronting spellcasters.

Common Covenbane archetypes include:
- **The Inquisitor**: Religious hunter of heretics and dark sorcerers
- **The Witch Hunter**: Seasoned veteran who has faced countless magical threats
- **The Demon Slayer**: Specializes in hunting fiends and otherworldly entities
- **The Silver Knight**: Noble warrior wielding blessed weapons against evil
- **The Seal Bearer**: Marked by divine authority to judge and destroy magical corruption

Covenbanes understand that magic itself is not evil, but that evil corrupts everything it touches. They are the scalpel that removes the cancer of dark magic from the world.`
    },

    combatRole: {
      title: 'Combat Role',
      content: `The Covenbane is a specialized anti-magic striker that excels at:

**Spell Disruption**: Breaking enemy spells, silencing casters, and dispelling magical effects
**Evil Hunter**: Tracking and relentlessly pursuing evil magic users
**Area Control**: Creating zones where magic fails and evil creatures are weakened
**Radiant Damage**: Channeling divine power against evil and demonic threats

**Strengths**:
- Can completely shut down enemy spellcasters
- Builds power by confronting magical threats
- Excellent at hunting and eliminating evil creatures
- Provides anti-magic protection for allies
- Strong single-target and area damage against magical enemies

**Weaknesses**:
- Less effective against non-magical threats
- Requires building Hexbreaker charges to use powerful abilities
- Can be vulnerable if focused by multiple enemies
- Limited utility against mundane combat encounters

The Covenbane shines in campaigns with significant magical threats, demonic encounters, and spellcaster antagonists. They are the perfect counter to evil sorcerers and fiendish invaders.`
    },

    playstyle: {
      title: 'Playstyle & Strategy',
      content: `Playing a Covenbane is about strategic anti-magic warfare and resource management. Key considerations:

**Building Hexbreaker Charges**:
- Deal damage to evil magic users and creatures (primary source)
- Use anti-magic abilities that generate charges
- Attack marked targets with Shadow Hunt for bonus charges
- Balance charge generation with staying alive

**Hexbreaker Charge Strategy**:
- **1-2 Charges**: Basic anti-magic utilities and damage enhancement
- **3-4 Charges**: Area effects and spell disruption abilities
- **5-6 Charges**: Ultimate abilities and massive anti-magic effects

**Specialization Synergies**:
- **Shadowbane**: Stealth and assassination focus, perfect for hunting casters
- **Spellbreaker**: Anti-magic disruption, excels at shutting down spells
- **Demonhunter**: Pursuit and divine judgment, specializes in demonic threats

**Team Dynamics**:
- Position to intercept enemy spellcasters
- Use area anti-magic effects to protect allies
- Coordinate with party to focus down magical threats
- Provide anti-magic support while others handle physical combat

**Anti-Magic Tactics**:
- Use Shadow Hunt to mark and track priority targets
- Dispel dangerous buffs before major encounters
- Create anti-magic zones during boss fights
- Save ultimate abilities for when enemies unleash powerful spells`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Witch Hunt',
      content: `**The Setup**: You're a Covenbane (Spellbreaker specialization) hunting a coven of dark witches in an ancient forest. Your party consists of you, a fighter, a rogue, and a wizard. The witches have summoned demonic minions and are preparing a major ritual spell. Starting Hexbreaker Charges: 0. Your goal: Build charges by confronting the witches, disrupt their ritual, and eliminate the magical threat.

**Starting State**: HP: 85/85 | Hexbreaker Charges: 0 | Spells Prepared: Shadow Hunt, Hex Strike, Anti-Magic Field

**Round 1 - Initial Confrontation**

*The witches cackle as they complete their ritual circle. Demonic energy swirls in the air.*

**Your Action**: Cast "Shadow Hunt" on the lead witch (1 charge generated)
**Effect**: Mark the witch for tracking and advantage on attacks

*You sense the evil magic emanating from the witch. A glowing silver mark appears on her forehead.*

**Hexbreaker Charges**: 0 → **1**

**Round 2 - Building Charges**

*The marked witch casts a fireball at your party. You see the spell forming.*

**Your Action**: Move toward the witch and attack with enhanced weapon (Hex Strike passive)
**Effect**: Deal weapon damage + necrotic damage, generate 1 charge

*Your blessed silver blade glows as you strike the witch, disrupting her spellcasting.*

**Hexbreaker Charges**: 1 → **2**

**Round 3 - Spell Disruption**

*The witches begin their major ritual. Dark energy crackles through the air.*

**Your Action**: Cast "Anti-Magic Field" (costs 4 charges)
**Effect**: Create 15ft radius zone where magic fails

*The ritual sputters and dies as your anti-magic field envelops the circle. The witches scream in frustration.*

**Hexbreaker Charges**: 2 → **-2** (net 0, spent 4, generated 2)

**Round 4 - Finishing the Hunt**

*With their ritual disrupted, the witches are vulnerable. The demonic minions attack.*

**Your Action**: Cast "Execute Hex" on the weakened lead witch (costs 3 charges)
**Effect**: Massive radiant damage, instant death on low HP targets

*The witch crumples as divine judgment strikes her down.*

**Hexbreaker Charges**: 0 → **3** (generated from killing evil magic user)

**Victory**: The coven is broken, the ritual stopped, and the demonic threat banished. Your anti-magic prowess has saved the day.

This example shows how Covenbanes build charges through confrontation, use them strategically to disrupt enemy plans, and finish with devastating anti-magic finishers.`
    }
  },

  // Resource System
  resourceSystem: {
    title: 'Hexbreaker Charges',
    subtitle: 'Anti-Magic Power Through Confrontation',

    description: `Hexbreaker Charges represent the Covenbane's accumulated anti-magic power, built by confronting and defeating evil magic users. Each charge is a fragment of disrupted magic, stored and ready to be unleashed in devastating anti-magic abilities.`,

    resourceBarExplanation: {
      title: 'Understanding Your Hexbreaker Charges',
      content: `**What You See**: The Hexbreaker Charge bar displays as a horizontal bar with up to 6 glowing silver charges, each representing stored anti-magic power. As you confront evil magic, the charges fill with radiant silver light.

**HEXBREAKER CHARGE DISPLAY** (Horizontal Bar):

**Charge Layout**:
- **6 Charges Maximum**: Each charge is a glowing silver orb
- **Current Charges**: Active charges glow brightly with silver light
- **Empty Charges**: Dark gray, waiting to be filled
- **Charge Counter**: Shows current charges (e.g., "3/6 charges")

**Charge Generation**:
- Deal weapon damage to evil magic users: **+1 charge per hit**
- Use anti-magic abilities: **+1 charge per use**
- Kill evil magic users: **+2 charges**
- Attack marked targets (Shadow Hunt): **+1 bonus charge**

**Charge Consumption**:
- Level 1 spells: 0-1 charges
- Level 2 spells: 1-2 charges
- Level 3 spells: 2-3 charges
- Level 4 spells: 3-4 charges
- Level 5 spells: 4-5 charges
- Level 6 spells: 5-6 charges

**Strategic Considerations**:
- Build charges by engaging evil magic users
- Save charges for powerful anti-magic effects
- Use low-charge spells to generate more charges
- Coordinate with party to focus magical threats`
    },

    chargeGeneration: {
      title: 'Building Hexbreaker Charges',
      content: `**Primary Sources**:
- **Weapon Attacks**: Deal damage to evil magic users (+1 per hit)
- **Anti-Magic Abilities**: Use Covenbane spells (+1 per use)
- **Marked Targets**: Attack targets marked by Shadow Hunt (+1 bonus)
- **Defeating Evil**: Kill evil magic users (+2 charges)

**Evil Magic Detection**:
Covenbanes can sense evil magic within 60 feet. Evil creatures and spellcasters glow with a subtle dark aura visible only to you.

**Charge Limits**:
- Maximum 6 charges
- Charges persist until spent or long rest
- Cannot generate charges from non-evil targets`
    },

    chargeUsage: {
      title: 'Spending Hexbreaker Charges',
      content: `**Spell Power Scaling**:
- **0 Charges**: Basic weapon enhancement and utility spells
- **1-2 Charges**: Enhanced anti-magic abilities and area effects
- **3-4 Charges**: Powerful disruption and crowd control
- **5-6 Charges**: Ultimate anti-magic devastation

**Charge Efficiency**:
- Use low-charge spells to generate more charges
- Save high charges for critical moments
- Some spells generate charges while consuming them
- Balance offense with charge generation

**Resource Management**:
- Build charges during encounters with multiple magical threats
- Use charges strategically against high-priority targets
- Coordinate with party to maximize magical threat elimination`
    },

    mechanics: {
      title: 'How It Works',
      content: `**Starting State**: All Covenbanes begin combat with 0 Hexbreaker Charges

**Building Charges**:
- **Weapon Attacks**: Deal damage to evil magic users (+1 charge per hit)
- **Spell Usage**: Cast Covenbane spells (+1 charge per use)
- **Marked Targets**: Attack targets marked by Shadow Hunt (+1 bonus charge)
- **Defeating Evil**: Kill evil magic users (+2 charges)

**Hexbreaker Charges**: Up to 6 charges maximum
**Charge Persistence**: Charges persist until spent or long rest
**Evil Detection**: Sense evil magic within 60 feet (dark aura visible only to you)

**Spell Enhancement**: Higher charge costs unlock more powerful effects
**Area Effects**: Many abilities create zones where magic fails
**Anti-Magic Focus**: All abilities target magical threats specifically

**Shadowbane Specialization**:
- Enhanced stealth and tracking abilities
- Bonus charges from marked targets
- Assassination-focused anti-magic strikes

**Spellbreaker Specialization**:
- Powerful anti-magic disruption
- Spell negation and counter-magic
- Magical effect cancellation

**Demonhunter Specialization**:
- Enhanced pursuit and divine judgment
- Bonus damage against demonic creatures
- Banishment and exorcism abilities`
    }
  },

  // Class Features
  features: [
    {
      id: 'witch_hunter_training',
      name: 'Witch Hunter Training',
      description: 'You gain proficiency with light armor, medium armor, shields, simple weapons, martial weapons, and alchemist\'s supplies.',
      level: 1
    },
    {
      id: 'hexbreaker_charges',
      name: 'Hexbreaker Charges',
      description: 'You build Hexbreaker charges by attacking evil magic users and using anti-magic abilities. Charges power your most devastating spells.',
      level: 1
    },
    {
      id: 'covenbane_magic',
      name: 'Covenbane Magic',
      description: 'You know the cantrips Light and Sacred Flame. At 2nd level you learn the spell Detect Magic.',
      level: 1
    }
  ],

  // Talent Trees
  talentTrees: [
    {
      id: 'shadowbane',
      name: 'Shadowbane - Stealth & Assassination',
      description: 'Masters of darkness and surprise, striking from the shadows to eliminate evil magic users.',
      icon: 'Utility/Hide',
      color: '#2F2F4F',
      talents: []
    },
    {
      id: 'spellbreaker',
      name: 'Spellbreaker - Anti-Magic Mastery',
      description: 'Specialists in disrupting and destroying magical effects and spellcasters.',
      icon: 'Arcane/Magical Cross Emblem 2',
      color: '#4F2F2F',
      talents: []
    },
    {
      id: 'demonhunter',
      name: 'Demonhunter - Relentless Pursuit',
      description: 'Fanatical hunters who mark and relentlessly pursue evil creatures across any distance.',
      icon: 'Piercing/Targeted Strike',
      color: '#4F4F2F',
      talents: []
    }
  ],

  // ═══════════════════════════════════════════════════════════════════
  // COVENBANE SPELLS BY LEVEL
  // ═════════════════════════════════════════════════════════════════
  exampleSpells: [

    // ===== LEVEL 1 SPELLS — Fundamentals (0 charges) =====

    {
      id: 'cov_shadow_hunt',
      name: 'Shadow Hunt',
      description: 'A spectral wolf\'s eye opens on your palm, then flies unerringly toward your prey and sinks into their flesh like a brand. From this moment, you can feel the marked creature\'s presence — a faint pull in your chest that grows warmer the closer you get. Your weapons hunger for the mark, each strike dealing an additional 1d4 radiant damage, and your instincts sharpen to supernatural precision against the branded target.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      school: 'shadow',
      icon: 'Piercing/Targeted Strike',
      typeConfig: {
        school: 'shadow',
        castTime: '1 bonus action',
        castTimeType: 'bonus',
        range: '60 feet',
        rangeType: 'ranged',
        tags: ['tracking', 'marking', 'utility']
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemies']
      },
      durationConfig: {
        durationType: 'minutes',
        durationValue: 10,
        durationUnit: 'minutes',
        requiresConcentration: true
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 0 },
        actionPoints: 1,
        components: ['verbal']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      buffConfig: {
        buffType: 'combatAdvantage',
        effects: [
          {
            id: 'hunter_mark',
            name: 'Hunter\'s Mark',
            description: 'Advantage on attack rolls against marked target. Sense direction and distance within 10 miles.',
            mechanicsText: '',
            statModifier: { stat: 'attack', magnitude: 'advantage', magnitudeType: 'special' }
          },
          {
            id: 'mark_radiant_bonus',
            name: 'Mark Weakness',
            description: '+1d4 radiant damage on weapon attacks against the marked target',
            mechanicsText: '1d4 radiant'
          }
        ],
        durationType: 'minutes',
        durationValue: 10,
        durationUnit: 'minutes',
        concentrationRequired: true,
        stackingRule: 'replace',
        maxStacks: 1
      },
      tags: ['tracking', 'marking', 'utility', 'shadowbane']
    },

    {
      id: 'cov_hex_strike',
      name: 'Hex Strike',
      description: 'Your weapon screams as black lightning crawls along the blade, drawn from the latent hex energy that clings to every evil spellcaster like rot on spoiled fruit. The air around your weapon crackles and hums with suppressed malice. Your next strike doesn\'t just cut flesh — it tears through the magical essence itself, dealing an additional 1d6 necrotic damage and devouring a fragment of the target\'s arcane power.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      school: 'necrotic',
      icon: 'Necrotic/Necrotic Skull',
      typeConfig: {
        school: 'necrotic',
        castTime: '1 bonus action',
        castTimeType: 'bonus',
        range: 'self',
        rangeType: 'self',
        tags: ['damage', 'weapon', 'charge-generation']
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      durationConfig: {
        durationType: 'rounds',
        durationValue: 1,
        durationUnit: 'rounds',
        requiresConcentration: false
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 0 },
        actionPoints: 1,
        components: ['somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      buffConfig: {
        buffType: 'damageIncrease',
        effects: [
          {
            id: 'weapon_hex_imbue',
            name: 'Hex-Imbued Weapon',
            description: 'Next melee attack deals +1d6 necrotic damage. Generates 1 Hexbreaker Charge on hit against evil magic users.',
            mechanicsText: '1d6 necrotic'
          }
        ],
        durationType: 'rounds',
        durationValue: 1,
        durationUnit: 'rounds',
        concentrationRequired: false,
        stackingRule: 'replace',
        maxStacks: 1
      },
      tags: ['damage', 'weapon', 'charge-generation']
    },

    {
      id: 'cov_silver_blade',
      name: 'Silver Blade',
      description: 'You draw a line of molten silver across your palm with your thumbnail and the metal flows upward, coating your weapon in a thin sheen of holy metal that glows with the soft warmth of a chapel candle. Where other weapons glance off magical wards and enchanted hides, yours bites deep — blessed silver recognizes no mortal enchantment as its master. Against the wicked, the blade burns with quiet fury.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      school: 'radiant',
      icon: 'Radiant/Radiant Beam',
      typeConfig: {
        school: 'radiant',
        castTime: '1 bonus action',
        castTimeType: 'bonus',
        range: 'self',
        rangeType: 'self',
        tags: ['weapon', 'anti-magic', 'resistance-piercing']
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      durationConfig: {
        durationType: 'minutes',
        durationValue: 1,
        durationUnit: 'minutes',
        requiresConcentration: true
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 0 },
        actionPoints: 1,
        components: ['verbal', 'material']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      buffConfig: {
        buffType: 'damageIncrease',
        effects: [
          {
            id: 'silver_coating',
            name: 'Blessed Silver Coating',
            description: 'Weapon attacks bypass magical resistance and immunity. +1d4 radiant damage against evil creatures.',
            mechanicsText: '1d4 radiant vs evil'
          }
        ],
        durationType: 'minutes',
        durationValue: 1,
        durationUnit: 'minutes',
        concentrationRequired: true,
        stackingRule: 'replace',
        maxStacks: 1
      },
      tags: ['weapon', 'anti-magic', 'resistance-piercing', 'demonhunter']
    },

    // ===== LEVEL 2 SPELLS — Basic Anti-Magic (1 charge) =====

    {
      id: 'cov_dark_pursuit',
      name: 'Dark Pursuit',
      description: 'The shadows beneath your feet come alive — not as allies, but as hungry things that propel you forward on a wave of darkness. You streak across the battlefield like a dark comet, leaving a trail of dissolving shadow in your wake. Opportunity attacks slide through your afterimage. When you emerge from the dash, your next strike carries the momentum of the void itself.',
      level: 2,
      spellType: 'ACTION',
      effectTypes: ['utility', 'buff'],
      school: 'shadow',
      icon: 'Utility/Speed Boot',
      typeConfig: {
        school: 'shadow',
        castTime: '1 action',
        castTimeType: 'action',
        range: 'self',
        rangeType: 'self',
        tags: ['mobility', 'speed', 'utility']
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      durationConfig: {
        durationType: 'rounds',
        durationValue: 1,
        durationUnit: 'rounds',
        requiresConcentration: false
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 1 },
        actionPoints: 1,
        components: ['somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      utilityConfig: {
        utilityType: 'movement',
        utilitySubtype: 'speed',
        selectedEffects: [
          {
            id: 'shadow_dash',
            name: 'Shadow Dash',
            description: 'Dash 30 feet without provoking opportunity attacks. Ignore difficult terrain until end of turn.',
            mechanicsText: '30 feet'
          }
        ],
        power: 'moderate'
      },
      buffConfig: {
        buffType: 'combatAdvantage',
        effects: [
          {
            id: 'pursuit_advantage',
            name: 'Relentless Strike',
            description: 'Advantage on next melee attack this turn',
            mechanicsText: ''
          }
        ],
        durationType: 'rounds',
        durationValue: 1,
        durationUnit: 'rounds',
        concentrationRequired: false,
        stackingRule: 'replace',
        maxStacks: 1
      },
      tags: ['mobility', 'speed', 'utility', 'shadowbane']
    },

    {
      id: 'cov_hex_weakness',
      name: 'Hex of Weakness',
      description: 'You trace a sigil of unraveling in the air — three jagged lines that pulse with sickly violet light before embedding themselves into the target\'s magical core like burrowing parasites. The hex gnaws at the victim\'s connection to the arcane from within: their spells lose accuracy, their magical defenses crumble, and radiant light burns them twice as fiercely. Against evil magic users, the sigil goes deeper still — every wound threatens to shatter their concentration entirely.',
      level: 2,
      spellType: 'ACTION',
      effectTypes: ['debuff'],
      school: 'necrotic',
      icon: 'Necrotic/Necrotic Decay 1',
      typeConfig: {
        school: 'necrotic',
        castTime: '1 action',
        castTimeType: 'action',
        range: '30 feet',
        rangeType: 'ranged',
        tags: ['debuff', 'curse', 'anti-magic']
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['enemies']
      },
      durationConfig: {
        durationType: 'minutes',
        durationValue: 1,
        durationUnit: 'minutes',
        requiresConcentration: true
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 1 },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      debuffConfig: {
        debuffType: 'statPenalty',
        effects: [
          {
            id: 'weakened_magic',
            name: 'Weakened Magic',
            description: 'Spell attack rolls reduced by 2, spell save DC reduced by 1',
            mechanicsText: '-2 Spell Attack, -1 Spell DC'
          },
          {
            id: 'radiant_vulnerability',
            name: 'Radiant Vulnerability',
            description: 'Vulnerable to radiant damage from all sources — radiant damage taken is doubled',
            mechanicsText: 'Radiant damage doubled'
          },
          {
            id: 'concentration_disruption',
            name: 'Concentration Disruption',
            description: 'Evil magic users must Con save when taking damage or lose concentration on maintained spells',
            mechanicsText: 'Con save on damage or lose concentration'
          }
        ],
        durationType: 'minutes',
        durationValue: 1,
        durationUnit: 'minutes',
        concentrationRequired: true,
        canBeDispelled: true,
        dispelDifficulty: 'hard',
        savingThrow: {
          ability: 'spirit',
          difficultyClass: 13,
          saveOutcome: 'negates'
        }
      },
      tags: ['debuff', 'curse', 'anti-magic', 'spellbreaker']
    },

    {
      id: 'cov_silver_bolt',
      name: 'Silver Bolt',
      description: 'A bolt of hardened light streaks from your outstretched hand, trailing silver sparks like a falling star aimed at the heart of darkness itself. The bolt bends reality to reach its target — curving around cover, slipping past guards, seeking the evil within like a compass needle finding north. Against the truly wicked, the light burns white-hot, searing flesh and spirit alike.',
      level: 2,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      school: 'radiant',
      icon: 'Radiant/Radiant Bolt',
      typeConfig: {
        school: 'radiant',
        castTime: '1 action',
        castTimeType: 'action',
        range: '60 feet',
        rangeType: 'ranged',
        tags: ['damage', 'ranged', 'anti-magic']
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemies']
      },
      durationConfig: {
        durationType: 'instant',
        durationValue: 0,
        durationUnit: 'instant',
        requiresConcentration: false
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 1 },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      damageConfig: {
        formula: '2d8',
        elementType: 'radiant',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false
      },
      resolution: 'DICE',
      tags: ['damage', 'ranged', 'anti-magic', 'demonhunter']
    },

    // ===== LEVEL 3 SPELLS — Mid-Tier Tools (1-2 charges) =====

    {
      id: 'cov_curse_eater',
      name: 'Curse Eater',
      description: 'You plunge your hand into the shimmering magical aura that clings to the afflicted and rip outward, tearing the curse free like a splinter from infected flesh. Dark energy writhes between your fingers before dissolving into harmless wisps. As the curse dies, its remnants flood into you — a rush of stolen vitality that knits your wounds and fills your Hexbreaker Charges with borrowed power. Against stronger enchantments, the target at least feels the grip loosen.',
      level: 3,
      spellType: 'ACTION',
      effectTypes: ['purification', 'healing'],
      school: 'necrotic',
      icon: 'Necrotic/Devour',
      typeConfig: {
        school: 'necrotic',
        castTime: '1 action',
        castTimeType: 'action',
        range: 'touch',
        rangeType: 'touch',
        tags: ['dispel', 'anti-magic', 'healing']
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        rangeDistance: 5,
        targetRestrictions: ['allies']
      },
      durationConfig: {
        durationType: 'instant',
        durationValue: 0,
        durationUnit: 'instant',
        requiresConcentration: false
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 1 },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'short_rest',
        value: 1
      },
      purificationConfig: {
        purificationType: 'remove_curse',
        targetEffects: ['curse', 'hex', 'magical_affliction'],
        strength: 'full',
        checkRequired: false,
        healAmount: '2d8'
      },
      healingConfig: {
        formula: '2d8',
        healingType: 'direct',
        hasHotEffect: false,
        hasShieldEffect: false
      },
      tags: ['dispel', 'anti-magic', 'healing', 'spellbreaker']
    },

    {
      id: 'cov_shadow_ambush',
      name: 'Shadow Ambush',
      description: 'The shadows stop being shadows and start being you. Your body dissolves into living darkness, your heartbeat becomes the silence between moments. When you strike from this void, the necrotic energy doesn\'t just wound — it announces your presence like a predator\'s cry, freezing the target with primal terror. For a few precious seconds after the ambush, the enemy knows exactly what is hunting them.',
      level: 3,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      school: 'shadow',
      icon: 'Utility/Hide',
      typeConfig: {
        school: 'shadow',
        castTime: '1 bonus action',
        castTimeType: 'bonus',
        range: 'self',
        rangeType: 'self',
        tags: ['stealth', 'utility', 'shadowbane']
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      durationConfig: {
        durationType: 'minutes',
        durationValue: 1,
        durationUnit: 'minutes',
        requiresConcentration: true
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 1 },
        actionPoints: 1,
        components: ['somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      buffConfig: {
        buffType: 'statusEffectBuff',
        effects: [
          {
            id: 'shadow_veil',
            name: 'Shadow Veil',
            description: 'Invisible to all creatures. Next melee attack deals +2d6 necrotic with advantage. Frightens evil magic users on hit.',
            mechanicsText: '2d6 necrotic'
          }
        ],
        statusEffects: [{ id: 'invisible', level: 1 }],
        durationType: 'minutes',
        durationValue: 1,
        durationUnit: 'minutes',
        concentrationRequired: true,
        stackingRule: 'replace',
        maxStacks: 1
      },
      tags: ['stealth', 'utility', 'shadowbane']
    },

    {
      id: 'cov_anti_magic_barrier',
      name: 'Anti-Magic Barrier',
      description: 'You slam your heel into the ground and a dome of fractured light erupts around you — not solid, but present, like heat shimmer made visible. Within this sphere, magic itself becomes uncertain: incantations falter on the tongue, gestures lose their meaning, and spells die stillborn in the caster\'s hands. Your allies stand in the eye of the storm, their saving throws bolstered by the barrier\'s protective resonance. It lasts only moments, but in those moments, you are untouchable.',
      level: 3,
      spellType: 'ACTION',
      effectTypes: ['buff', 'utility'],
      school: 'necrotic',
      icon: 'Arcane/Magical Cross Emblem 2',
      typeConfig: {
        school: 'necrotic',
        castTime: '1 action',
        castTimeType: 'action',
        range: 'self',
        rangeType: 'self',
        tags: ['protection', 'anti-magic', 'spellbreaker']
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: { radius: 10 },
        targetRestrictions: ['allies']
      },
      durationConfig: {
        durationType: 'rounds',
        durationValue: 3,
        durationUnit: 'rounds',
        requiresConcentration: false
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 2 },
        actionPoints: 1,
        components: ['verbal']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },
      utilityConfig: {
        utilityType: 'environment',
        selectedEffects: [
          {
            id: 'spell_disruption_zone',
            name: 'Spell Disruption Zone',
            description: 'Enemy spellcasters in zone must Con save DC 14 or spell fails. Allies gain +2 to saves vs magic.',
            mechanicsText: '10ft radius, 3 rounds'
          }
        ],
        power: 'moderate'
      },
      buffConfig: {
        buffType: 'damageMitigation',
        effects: [
          {
            id: 'magic_resistance_aura',
            name: 'Magic Resistance Aura',
            description: '+2 to all saving throws against spells and magical effects while inside the barrier',
            mechanicsText: '+2 save vs magic'
          }
        ],
        durationType: 'rounds',
        durationValue: 3,
        durationUnit: 'rounds',
        concentrationRequired: false,
        stackingRule: 'replace',
        maxStacks: 1
      },
      tags: ['protection', 'anti-magic', 'spellbreaker']
    },

    // ===== LEVEL 4 SPELLS — Strong Effects (2-3 charges) =====

    {
      id: 'cov_spirit_shackle',
      name: 'Spirit Shackle',
      description: 'You drive your fist through the target\'s shadow and anchor it to the earth with chains of compressed anti-magic. The shadow writhes and screams silently as the bonds take hold — the target\'s feet lock to the ground, their voice dies in their throat as the chains seal their lips against incantation. Every word of power they try to speak dissolves on their tongue. Only the strongest spirits can wrench themselves free.',
      level: 4,
      spellType: 'ACTION',
      effectTypes: ['control'],
      school: 'shadow',
      icon: 'Necrotic/Corruption',
      typeConfig: {
        school: 'shadow',
        castTime: '1 action',
        castTimeType: 'action',
        range: '30 feet',
        rangeType: 'ranged',
        tags: ['crowd-control', 'root', 'silence', 'control']
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['enemies']
      },
      durationConfig: {
        durationType: 'minutes',
        durationValue: 1,
        durationUnit: 'minutes',
        requiresConcentration: true
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 2 },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 1
      },
      controlConfig: {
        controlType: 'restrained',
        strength: 'strong',
        duration: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        savingThrow: {
          ability: 'spirit',
          difficultyClass: 15,
          saveOutcome: 'negates'
        },
        effects: [
          {
            id: 'spirit_bind',
            name: 'Spirit Bind',
            description: 'Restrained and silenced. Speed reduced to 0. Attacks against target have advantage. Spirit save at end of each turn to break free.',
            mechanicsText: 'Speed 0, no verbal spells'
          }
        ],
        concentrationRequired: true,
        canBeDispelled: true
      },
      tags: ['crowd-control', 'root', 'silence', 'control', 'shadowbane']
    },

    {
      id: 'cov_hexbreaker_precision',
      name: 'Hexbreaker Precision',
      description: 'Your eyes ignite with cold silver fire as you perceive the invisible architecture of magic itself — the shimmering threads of enchantment, the dark knots of cursework, the telltale glow of a spell about to be cast. In this heightened state, you see every gap in every defense, every weakness in every ward. Your blade knows exactly where to fall, and against those who wield evil magic, your critical strikes come with terrifying regularity.',
      level: 4,
      spellType: 'ACTION',
      effectTypes: ['buff'],
      school: 'necrotic',
      icon: 'Piercing/Focused Arrow Shot',
      typeConfig: {
        school: 'necrotic',
        castTime: '1 bonus action',
        castTimeType: 'bonus',
        range: 'self',
        rangeType: 'self',
        tags: ['buff', 'accuracy', 'anti-magic']
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      durationConfig: {
        durationType: 'minutes',
        durationValue: 1,
        durationUnit: 'minutes',
        requiresConcentration: true
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 2 },
        actionPoints: 1,
        components: ['verbal']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 1
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [
          {
            id: 'precision_focus',
            name: 'Hexbreaker Precision',
            description: '+3 to attack rolls, +1d6 radiant damage on weapon attacks. Expanded crit range vs evil magic users (19-20).',
            mechanicsText: '+3 Attack Rolls',
            statModifier: [
              { stat: 'attack', magnitude: 3, magnitudeType: 'flat' }
            ]
          },
          {
            id: 'precision_damage',
            name: 'Radiant Strikes',
            description: '+1d6 radiant damage on all weapon attacks',
            mechanicsText: '1d6 radiant'
          },
          {
            id: 'precision_crit',
            name: 'Weakness Sight',
            description: 'Critical hit range expanded by 1 against evil magic users',
            mechanicsText: ''
          }
        ],
        durationType: 'minutes',
        durationValue: 1,
        durationUnit: 'minutes',
        concentrationRequired: true,
        canBeDispelled: false,
        stackingRule: 'replace',
        maxStacks: 1
      },
      tags: ['buff', 'accuracy', 'anti-magic', 'demonhunter']
    },

    {
      id: 'cov_silver_storm',
      name: 'Silver Storm',
      description: 'You hurl your arm skyward and blessed silver shards erupt from thin air, spinning into a horizontal tornado of holy metal that fills the battlefield with the sound of a thousand crystal bells. The shards seek the wicked with grim precision, embedding themselves in flesh and marking the survivors with a silver glow that calls your blade homeward. The air smells of ozone and old churches.',
      level: 4,
      spellType: 'ACTION',
      effectTypes: ['damage', 'debuff'],
      school: 'radiant',
      icon: 'Radiant/Bright Explosion',
      typeConfig: {
        school: 'radiant',
        castTime: '1 action',
        castTimeType: 'action',
        range: '60 feet',
        rangeType: 'ranged',
        tags: ['damage', 'aoe', 'radiant']
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'sphere',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['enemies']
      },
      durationConfig: {
        durationType: 'rounds',
        durationValue: 1,
        durationUnit: 'rounds',
        requiresConcentration: false
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 3 },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 1
      },
      damageConfig: {
        formula: '4d6',
        elementType: 'radiant',
        damageType: 'area',
        canCrit: false
      },
      resolution: 'SAVING_THROW',
      savingThrow: {
        enabled: true,
        savingThrowType: 'agility',
        difficultyClass: 15,
        saveOutcome: 'halves'
      },
      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [
          {
            id: 'storm_mark',
            name: 'Silver Mark',
            description: 'Attacks against this creature have advantage until end of caster\'s next turn',
            mechanicsText: ''
          }
        ],
        durationType: 'rounds',
        durationValue: 1,
        durationUnit: 'rounds',
        canBeDispelled: true
      },
      tags: ['damage', 'aoe', 'radiant', 'demonhunter']
    },

    // ===== LEVEL 5 SPELLS — Powerful (3-4 charges) =====

    {
      id: 'cov_hexbreaker_execution',
      name: 'Hexbreaker Execution',
      description: 'Every Hexbreaker Charge you\'ve gathered converges into a single point on your blade — a pinprick of absolute light that hurts to look at. You swing not at the body, but at the thread of magic that keeps the target alive. If the blow lands, radiant and necrotic energy detonate simultaneously in a blinding flash. The weak are simply... erased, their connection to magic severed so completely that their body doesn\'t understand how to keep existing.',
      level: 5,
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      school: 'shadow',
      icon: 'Slashing/Execution',
      typeConfig: {
        school: 'shadow',
        castTime: '1 action',
        castTimeType: 'action',
        range: 'melee',
        rangeType: 'melee',
        tags: ['execute', 'control', 'melee']
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        targetRestrictions: ['enemies']
      },
      durationConfig: {
        durationType: 'instant',
        durationValue: 0,
        durationUnit: 'instant',
        requiresConcentration: false
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 3 },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },
      damageConfig: {
        formula: '6d10',
        elementType: 'radiant',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false
      },
      resolution: 'DICE',
      controlConfig: {
        controlType: 'incapacitated',
        strength: 'severe',
        duration: 0,
        durationType: 'instant',
        durationUnit: 'instant',
        savingThrow: {
          ability: 'constitution',
          difficultyClass: 16,
          saveOutcome: 'negates'
        },
        effects: [
          {
            id: 'divine_execution',
            name: 'Divine Execution',
            description: 'Instantly kill evil magic users at 25 HP or lower. On kill: gain 2 Hexbreaker Charges.',
            mechanicsText: 'DC 16 Con save or die'
          }
        ],
        canBeDispelled: false
      },
      tags: ['execute', 'control', 'melee', 'shadowbane']
    },

    {
      id: 'cov_anti_magic_field',
      name: 'Anti-Magic Field',
      description: 'You speak a single word that was old when the gods were young, and reality listens. A sphere of absolute silence descends around you — not quiet, but absence, as though magic itself has been forbidden to exist. Within the field, spells unravel mid-incantation, summoned creatures flicker and vanish like dying candles, and enchanted weapons become ordinary steel. The air tastes of nothing. You stand at the still center of a world without wonder.',
      level: 5,
      spellType: 'ACTION',
      effectTypes: ['utility'],
      school: 'necrotic',
      icon: 'Necrotic/Protective Aura',
      typeConfig: {
        school: 'necrotic',
        castTime: '1 action',
        castTimeType: 'action',
        range: 'self',
        rangeType: 'self',
        tags: ['aoe', 'anti-magic', 'suppression', 'spellbreaker']
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: { radius: 15 }
      },
      durationConfig: {
        durationType: 'minutes',
        durationValue: 1,
        durationUnit: 'minutes',
        requiresConcentration: true
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 4 },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      utilityConfig: {
        utilityType: 'environment',
        selectedEffects: [
          {
            id: 'anti_magic_zone',
            name: 'Anti-Magic Zone',
            description: '15ft sphere. No spells cast, summoned creatures vanish, magic items suppressed, concentration ends on entry. Moves with caster. Caster unaffected.',
            mechanicsText: '15ft radius, 1 minute, concentration'
          }
        ],
        power: 'major'
      },
      tags: ['aoe', 'anti-magic', 'suppression', 'spellbreaker']
    },

    {
      id: 'cov_hunters_net',
      name: 'Hunter\'s Net',
      description: 'A hurl a net of interlocking silver chains that explodes outward in mid-flight, expanding into a glittering cage of holy metal. The chains don\'t just restrain — they burn, each link radiating blessed heat that sears the flesh of the wicked. Those caught within find their voices stolen and their feet bound, able only to thrash against chains that tighten with every struggle. The chains hum with a deep, resonant tone like a cathedral organ.',
      level: 5,
      spellType: 'ACTION',
      effectTypes: ['control', 'damage'],
      school: 'radiant',
      icon: 'Necrotic/Crossed Bones',
      typeConfig: {
        school: 'radiant',
        castTime: '1 action',
        castTimeType: 'action',
        range: '30 feet',
        rangeType: 'ranged',
        tags: ['aoe', 'crowd-control', 'anti-magic', 'demonhunter']
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        aoeShape: 'sphere',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['enemies']
      },
      durationConfig: {
        durationType: 'minutes',
        durationValue: 1,
        durationUnit: 'minutes',
        requiresConcentration: true
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 3 },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },
      damageConfig: {
        formula: '2d6',
        elementType: 'radiant',
        damageType: 'area',
        canCrit: false
      },
      resolution: 'SAVING_THROW',
      savingThrow: {
        enabled: true,
        savingThrowType: 'strength',
        difficultyClass: 16,
        saveOutcome: 'negates'
      },
      controlConfig: {
        controlType: 'restrained',
        strength: 'strong',
        duration: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        savingThrow: {
          ability: 'strength',
          difficultyClass: 16,
          saveOutcome: 'negates'
        },
        effects: [
          {
            id: 'silver_net',
            name: 'Silver Chains',
            description: 'Restrained, silenced, speed reduced to 5ft. Takes 2d6 radiant damage at start of each turn. Str save at end of each turn to break free.',
            mechanicsText: '2d6 radiant/turn'
          }
        ],
        concentrationRequired: true,
        canBeDispelled: true
      },
      tags: ['aoe', 'crowd-control', 'anti-magic', 'demonhunter']
    },

    // ===== LEVEL 6 SPELLS — Devastating (4-5 charges) =====

    {
      id: 'cov_hexbreaker_fury',
      name: 'Hexbreaker Fury',
      description: 'You release every charge you\'ve gathered in a single catastrophic instant. Twin explosions of shadow and light spiral outward from your body — necrotic darkness that devours magical defenses, and radiant fury that sears the soul. The shockwave staggers even the strongest mages, leaving them dazed and reeling as the backlash of anti-magic energy overwhelms their senses. When the light fades, only the silence remains.',
      level: 6,
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      school: 'necrotic',
      icon: 'Poison/Poison Plague',
      typeConfig: {
        school: 'necrotic',
        castTime: '1 action',
        castTimeType: 'action',
        range: 'self',
        rangeType: 'self',
        tags: ['aoe', 'damage', 'stun', 'ultimate']
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: { radius: 25 },
        targetRestrictions: ['enemies']
      },
      durationConfig: {
        durationType: 'rounds',
        durationValue: 1,
        durationUnit: 'rounds',
        requiresConcentration: false
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 5 },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      damageConfig: {
        formula: '6d6',
        elementType: 'necrotic',
        damageType: 'area',
        canCrit: false
      },
      resolution: 'SAVING_THROW',
      savingThrow: {
        enabled: true,
        savingThrowType: 'constitution',
        difficultyClass: 17,
        saveOutcome: 'halves'
      },
      controlConfig: {
        controlType: 'stunned',
        strength: 'severe',
        duration: 1,
        durationType: 'rounds',
        durationUnit: 'rounds',
        savingThrow: {
          ability: 'constitution',
          difficultyClass: 17,
          saveOutcome: 'negates'
        },
        effects: [
          {
            id: 'anti_magic_burst',
            name: 'Anti-Magic Burst',
            description: 'Stunned for 1 round. Takes 6d6 necrotic + 6d6 radiant damage (half on successful save).',
            mechanicsText: '6d6 necrotic + 6d6 radiant'
          }
        ],
        canBeDispelled: true
      },
      tags: ['aoe', 'damage', 'stun', 'ultimate', 'spellbreaker']
    },

    {
      id: 'cov_shadow_eruption',
      name: 'Shadow Eruption',
      description: 'You slam both fists into the earth and the ground answers — shadows erupt upward like geysers of liquid night, reaching for every enemy within reach. The darkness clings to eyes and skin, blinding and disorienting as shadow tendrils pull at the victims\' feet. Those caught in the eruption stumble in random directions, their senses overwhelmed by a world that has suddenly gone utterly, impossibly dark.',
      level: 6,
      spellType: 'ACTION',
      effectTypes: ['damage', 'debuff'],
      school: 'shadow',
      icon: 'Void/Consumed by Void',
      typeConfig: {
        school: 'shadow',
        castTime: '1 action',
        castTimeType: 'action',
        range: 'self',
        rangeType: 'self',
        tags: ['aoe', 'damage', 'debuff', 'vision', 'shadowbane']
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'cone',
        aoeParameters: { radius: 15 },
        targetRestrictions: ['enemies']
      },
      durationConfig: {
        durationType: 'rounds',
        durationValue: 2,
        durationUnit: 'rounds',
        requiresConcentration: false
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 4 },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 2
      },
      damageConfig: {
        formula: '5d8',
        elementType: 'necrotic',
        damageType: 'area',
        canCrit: false
      },
      resolution: 'SAVING_THROW',
      savingThrow: {
        enabled: true,
        savingThrowType: 'agility',
        difficultyClass: 17,
        saveOutcome: 'halves'
      },
      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [
          {
            id: 'shadow_blindness',
            name: 'Shadow Blindness',
            description: 'Blinded for 2 rounds. Cannot see, automatically fails sight-based checks, disadvantage on attack rolls. Moves in a random direction at start of each turn.',
            mechanicsText: '',
            statusType: 'blinded',
            level: 'moderate'
          }
        ],
        durationType: 'rounds',
        durationValue: 2,
        durationUnit: 'rounds',
        canBeDispelled: true,
        savingThrow: {
          ability: 'agility',
          difficultyClass: 17,
          saveOutcome: 'negates'
        }
      },
      tags: ['aoe', 'damage', 'debuff', 'vision', 'shadowbane']
    },

    {
      id: 'cov_spell_nullification',
      name: 'Spell Nullification',
      description: 'You reach across the magical spectrum and find the spell — feel its shape in the target\'s mind like a key in a lock. With a twist of your will, you snap it shut. The sealed spell becomes a locked door in the caster\'s thoughts, a knot of unreachable knowledge that they can feel but never touch. The severance sends a spike of psychic agony through any evil magic user — the sensation of a limb they didn\'t know they had being amputated.',
      level: 6,
      spellType: 'ACTION',
      effectTypes: ['control', 'damage'],
      school: 'necrotic',
      icon: 'Radiant/Golden Ring',
      typeConfig: {
        school: 'necrotic',
        castTime: '1 action',
        castTimeType: 'action',
        range: '60 feet',
        rangeType: 'ranged',
        tags: ['reaction', 'anti-magic', 'seal', 'spellbreaker']
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: ['enemies']
      },
      durationConfig: {
        durationType: 'hours',
        durationValue: 1,
        durationUnit: 'hours',
        requiresConcentration: false
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 4 },
        actionPoints: 2,
        components: ['verbal']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      damageConfig: {
        formula: '3d8',
        elementType: 'psychic',
        damageType: 'direct',
        canCrit: false
      },
      resolution: 'SAVING_THROW',
      savingThrow: {
        enabled: true,
        savingThrowType: 'spirit',
        difficultyClass: 17,
        saveOutcome: 'negates'
      },
      controlConfig: {
        controlType: 'silenced',
        strength: 'severe',
        duration: 1,
        durationType: 'hours',
        durationUnit: 'hours',
        savingThrow: {
          ability: 'spirit',
          difficultyClass: 17,
          saveOutcome: 'negates'
        },
        effects: [
          {
            id: 'spell_seal',
            name: 'Spell Seal',
            description: 'One known spell becomes completely inaccessible for 1 hour. The sealed spell cannot be cast, prepared, or recalled. 3d8 psychic damage to evil magic users.',
            mechanicsText: 'DC 17 Spirit save'
          }
        ],
        canBeDispelled: true,
        dispelDifficulty: 'very_hard'
      },
      tags: ['anti-magic', 'seal', 'spellbreaker']
    },

    // ===== LEVEL 7 SPELLS — Near-Ultimate (5-6 charges) =====

    {
      id: 'cov_hexbreaker_storm',
      name: 'Hexbreaker Storm',
      description: 'The sky tears open and a storm descends — not of rain or wind, but of anti-magic fury that screams across the battlefield with the sound of shattering glass. Silver lightning arcs between enemies as the storm strips mana from the air itself. Those caught within find their most powerful spells reduced to parlor tricks, their magical reserves draining away like water through cracked stone.',
      level: 7,
      spellType: 'ACTION',
      effectTypes: ['damage', 'debuff'],
      school: 'radiant',
      icon: 'Void/Black Hole',
      typeConfig: {
        school: 'radiant',
        castTime: '1 action',
        castTimeType: 'action',
        range: '60 feet',
        rangeType: 'ranged',
        tags: ['aoe', 'damage-over-time', 'anti-magic', 'concentration']
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'sphere',
        aoeParameters: { radius: 30 },
        targetRestrictions: ['enemies']
      },
      durationConfig: {
        durationType: 'minutes',
        durationValue: 1,
        durationUnit: 'minutes',
        requiresConcentration: true
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 5 },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      damageConfig: {
        formula: '3d8',
        elementType: 'radiant',
        damageType: 'area',
        hasDotEffect: true,
        dotConfig: {
          dotFormula: '3d8',
          duration: 3,
          tickFrequency: 'round',
          isProgressiveDot: false
        },
        canCrit: false
      },
      resolution: 'DICE',
      debuffConfig: {
        debuffType: 'abilityDisable',
        effects: [
          {
            id: 'anti_magic_weakening',
            name: 'Anti-Magic Weakening',
            description: 'Spellcasting at disadvantage. Cannot regain mana or spell slots. 3d8 radiant damage per round.',
            mechanicsText: '3d8 radiant/round'
          }
        ],
        durationType: 'minutes',
        durationValue: 1,
        durationUnit: 'minutes',
        concentrationRequired: true,
        canBeDispelled: true,
        dispelDifficulty: 'very_hard'
      },
      tags: ['aoe', 'damage-over-time', 'anti-magic', 'concentration', 'spellbreaker']
    },

    {
      id: 'cov_apex_predator',
      name: 'Apex Predator',
      description: 'The transformation is not gentle. Your bones crack and lengthen, your skin darkens to the color of a starless sky, and your eyes become twin pools of liquid silver. You are no longer hunting — you ARE the hunt. Every shadow is a doorway, every patch of darkness a hiding place. Evil creatures look right through you as though you don\'t exist, but they feel you watching. They feel the weight of your gaze like a hand on their shoulder.',
      level: 7,
      spellType: 'ACTION',
      effectTypes: ['transformation'],
      school: 'shadow',
      icon: 'Void/Shadowy Potion',
      typeConfig: {
        school: 'shadow',
        castTime: '1 action',
        castTimeType: 'action',
        range: 'self',
        rangeType: 'self',
        tags: ['transformation', 'mobility', 'damage', 'shadowbane']
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      durationConfig: {
        durationType: 'rounds',
        durationValue: 5,
        durationUnit: 'rounds',
        requiresConcentration: false
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      transformationConfig: {
        transformationType: 'spectral',
        targetType: 'self',
        duration: 5,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Void Hunter',
        description: 'Exist partially in the void, striking from impossible angles for 5 rounds.',
        grantedAbilities: [
          { id: 'void_existence', name: 'Void Existence', description: 'Immune to all non-magical damage' },
          { id: 'teleport_strike', name: 'Teleport Strike', description: 'Teleport to any visible creature as part of a melee attack (no action cost)' },
          { id: 'ignore_defenses', name: 'Ignore Defenses', description: 'Attacks ignore AC bonuses from physical armor and magical shields' }
        ]
      },
      tags: ['transformation', 'mobility', 'damage', 'shadowbane']
    },

    {
      id: 'cov_final_hour',
      name: 'Final Hour',
      description: 'When death comes for you, it finds you waiting with a blade in your hand and fire in your eyes. Your wounds knit shut as righteous fury floods your veins — every injury you\'ve suffered transforms into fuel for one last, glorious crusade. Your weapon blazes with holy light that burns the very air, and every enemy within reach feels the weight of a dying hunter\'s final prayer: that none of them leave this place alive.',
      level: 7,
      spellType: 'ACTION',
      effectTypes: ['buff', 'damage'],
      school: 'radiant',
      icon: 'Radiant/Divine Beam',
      typeConfig: {
        school: 'radiant',
        castTime: '1 action',
        castTimeType: 'action',
        range: 'self',
        rangeType: 'self',
        tags: ['buff', 'damage', 'last-stand', 'demonhunter']
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['enemies']
      },
      durationConfig: {
        durationType: 'rounds',
        durationValue: 3,
        durationUnit: 'rounds',
        requiresConcentration: false
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      buffConfig: {
        buffType: 'statusEffectBuff',
        effects: [
          {
            id: 'dying_fury',
            name: 'Dying Fury',
            description: 'Regain 50% of max HP. Attacks deal +3d8 radiant damage. Immune to fear and charm. Cannot be reduced below 1 HP by damage.',
            mechanicsText: '+3d8 radiant'
          }
        ],
        statusEffects: [{ id: 'fear_immune', level: 1 }, { id: 'charm_immune', level: 1 }],
        durationType: 'rounds',
        durationValue: 3,
        durationUnit: 'rounds',
        concentrationRequired: false,
        stackingRule: 'replace',
        maxStacks: 1
      },
      damageConfig: {
        formula: '4d8',
        elementType: 'radiant',
        damageType: 'area',
        canCrit: false
      },
      resolution: 'DICE',
      tags: ['buff', 'damage', 'last-stand', 'demonhunter']
    },

    // ===== LEVEL 8 SPELLS — Ultimate-Tier (6 charges) =====

    {
      id: 'cov_judgment_day',
      name: 'Judgment Day',
      description: 'You raise your weapon to the sky and divine light pours down like molten gold, pooling on the ground before erupting upward in pillars of righteous fire. The light doesn\'t discriminate — it finds every creature with evil in its heart and burns them from the inside out. The screams are brief but terrible. When the pillars fade, the ground is scorched clean and the air smells of lightning and burnt offering. Evil remembers this day.',
      level: 8,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      school: 'radiant',
      icon: 'Radiant/Divine Blessing',
      typeConfig: {
        school: 'radiant',
        castTime: '1 action',
        castTimeType: 'action',
        range: '60 feet',
        rangeType: 'ranged',
        tags: ['aoe', 'damage', 'judgment', 'demonhunter']
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'sphere',
        aoeParameters: { radius: 40 },
        targetRestrictions: ['enemies']
      },
      durationConfig: {
        durationType: 'instant',
        durationValue: 0,
        durationUnit: 'instant',
        requiresConcentration: false
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      damageConfig: {
        formula: '10d10',
        elementType: 'radiant',
        damageType: 'area',
        canCrit: false,
        criticalConfig: {
          critType: 'effect',
          critEffects: ['holy_ignition', 'fear_aura']
        }
      },
      resolution: 'SAVING_THROW',
      savingThrow: {
        enabled: true,
        savingThrowType: 'charisma',
        difficultyClass: 19,
        saveOutcome: 'halves'
      },
      tags: ['aoe', 'damage', 'judgment', 'demonhunter']
    },

    {
      id: 'cov_shadow_ascendant',
      name: 'Shadow Ascendant',
      description: 'You step into your own shadow and come out something else. The darkness doesn\'t just cover you — it becomes you, a living cloak of liquid night that moves with predatory intelligence. Your attacks now come from every direction at once, shadows striking before your blade even moves. Enemies see you flicker between positions like a film skipping frames, never quite sure where you are until the cold steel is already between their ribs.',
      level: 8,
      spellType: 'ACTION',
      effectTypes: ['transformation'],
      school: 'shadow',
      icon: 'Void/Consumed by Void',
      typeConfig: {
        school: 'shadow',
        castTime: '1 action',
        castTimeType: 'action',
        range: 'self',
        rangeType: 'self',
        tags: ['transformation', 'stealth', 'damage', 'shadowbane']
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      durationConfig: {
        durationType: 'rounds',
        durationValue: 4,
        durationUnit: 'rounds',
        requiresConcentration: false
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      transformationConfig: {
        transformationType: 'shadow',
        targetType: 'self',
        duration: 4,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Shadow Ascendant',
        description: 'Ascend to pure shadow form for 4 rounds.',
        grantedAbilities: [
          { id: 'shadow_reach', name: 'Shadow Reach', description: 'Melee attack range extends to 30ft' },
          { id: 'shadow_echo', name: 'Shadow Echo', description: 'After each attack, make a second attack dealing 2d6 necrotic damage against a different target within 15ft', damageFormula: '2d6' },
          { id: 'shadow_step', name: 'Shadow Step', description: 'Swap positions with any creature within 60ft as a bonus action, becoming invisible until start of next turn' }
        ]
      },
      tags: ['transformation', 'stealth', 'damage', 'shadowbane']
    },

    {
      id: 'cov_anti_magic_storm',
      name: 'Anti-Magic Storm',
      description: 'The sky bruises purple and black as anti-magic lightning tears through the clouds — not natural lightning, but the death-throes of every spell caught in the storm\'s path. Bolts of pure negation crash down in a relentless barrage, each strike obliterating magical effects and shields on contact. The air itself becomes hostile to magic, shimmering with disruptive energy that makes incantations taste like ash on the tongue.',
      level: 8,
      spellType: 'ACTION',
      effectTypes: ['damage', 'debuff'],
      school: 'necrotic',
      icon: 'Void/Black Hole',
      typeConfig: {
        school: 'necrotic',
        castTime: '1 action',
        castTimeType: 'action',
        range: '60 feet',
        rangeType: 'ranged',
        tags: ['aoe', 'damage', 'dispel', 'spellbreaker']
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'sphere',
        aoeParameters: { radius: 35 },
        targetRestrictions: ['enemies']
      },
      durationConfig: {
        durationType: 'rounds',
        durationValue: 3,
        durationUnit: 'rounds',
        requiresConcentration: true
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      damageConfig: {
        formula: '6d8',
        elementType: 'necrotic',
        damageType: 'area',
        canCrit: false
      },
      resolution: 'DICE',
      debuffConfig: {
        debuffType: 'abilityDisable',
        effects: [
          {
            id: 'magic_suppression_field',
            name: 'Magic Suppression',
            description: 'All spells cast in area require 2 additional spell slots or fail. Magic items lose all enchantment bonuses. 6d8 necrotic damage per round.',
            mechanicsText: '6d8 necrotic/round'
          }
        ],
        durationType: 'rounds',
        durationValue: 3,
        durationUnit: 'rounds',
        concentrationRequired: true,
        canBeDispelled: true,
        dispelDifficulty: 'very_hard'
      },
      tags: ['aoe', 'damage', 'dispel', 'spellbreaker']
    },

    // ===== LEVEL 9 SPELLS — Near-Pinnacle (6 charges) =====

    {
      id: 'cov_hexbreaker_apocalypse',
      name: 'Hexbreaker Apocalypse',
      description: 'You don\'t fight magic anymore — you erase it. A sphere of absolute negation expands from your body, growing larger and larger as it consumes every spell, enchantment, and magical effect it touches. The ground turns to grey ash beneath it, and the sky above cracks like old porcelain. Creatures of magic shriek as their essence unravels — summoned beings dissolve into smoke, enchanted weapons rust to nothing, and wards shatter like glass. What remains when the light fades is simply... empty.',
      level: 9,
      spellType: 'ACTION',
      effectTypes: ['damage', 'utility'],
      school: 'necrotic',
      icon: 'Necrotic/Necrotic Death',
      typeConfig: {
        school: 'necrotic',
        castTime: '1 action',
        castTimeType: 'action',
        range: 'self',
        rangeType: 'self',
        tags: ['aoe', 'damage', 'permanent', 'spellbreaker']
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: { radius: 60 },
        targetRestrictions: ['enemies']
      },
      durationConfig: {
        durationType: 'instant',
        durationValue: 0,
        durationUnit: 'instant',
        requiresConcentration: false
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      damageConfig: {
        formula: '12d10',
        elementType: 'necrotic',
        damageType: 'area',
        canCrit: false,
        criticalConfig: {
          critType: 'effect',
          critEffects: ['magic_annihilation', 'silence_aura']
        }
      },
      resolution: 'SAVING_THROW',
      savingThrow: {
        enabled: true,
        savingThrowType: 'charisma',
        difficultyClass: 20,
        saveOutcome: 'halves'
      },
      utilityConfig: {
        utilityType: 'environment',
        selectedEffects: [
          {
            id: 'apocalypse_field',
            name: 'Apocalypse Field',
            description: '60ft sphere. All magical effects, enchantments, and summons destroyed. Magic items rendered inert for 1 hour. Spellcasters silenced for 1d4 rounds. The area counts as difficult terrain for 10 minutes.',
            mechanicsText: '60ft radius, all magic destroyed'
          }
        ],
        power: 'major'
      },
      tags: ['aoe', 'damage', 'permanent', 'spellbreaker']
    },

    {
      id: 'cov_void_hunter',
      name: 'Void Hunter',
      description: 'You stop existing in the material world and begin existing in the spaces between things — the gaps between heartbeats, the silence between words, the darkness behind closed eyes. In this state you are untouchable, moving through the world like a thought through a dream. Your strikes don\'t come from a direction — they come from nowhere, materializing inside the target\'s guard with surgical precision. The void has claimed you, and it does not share.',
      level: 9,
      spellType: 'ACTION',
      effectTypes: ['transformation'],
      school: 'shadow',
      icon: 'Psychic/Psionic Boom',
      typeConfig: {
        school: 'shadow',
        castTime: '1 action',
        castTimeType: 'action',
        range: 'self',
        rangeType: 'self',
        tags: ['transformation', 'stealth', 'assassination', 'shadowbane']
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      durationConfig: {
        durationType: 'rounds',
        durationValue: 3,
        durationUnit: 'rounds',
        requiresConcentration: false
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      transformationConfig: {
        transformationType: 'shadow',
        targetType: 'self',
        duration: 3,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Void Hunter',
        description: 'Phase into the void between worlds for 3 rounds.',
        grantedAbilities: [
          { id: 'void_phase', name: 'Void Phase', description: 'Intangible — immune to all damage and effects. Cannot be detected by any means.' },
          { id: 'void_strike', name: 'Void Strike', description: 'Melee attacks from the void deal 4d10 necrotic damage and bypass all armor and resistances', damageFormula: '4d10' },
          { id: 'void_teleport', name: 'Void Teleport', description: 'Teleport to any unoccupied space within 120ft as a free action' }
        ]
      },
      tags: ['transformation', 'stealth', 'assassination', 'shadowbane']
    },

    {
      id: 'cov_divine_executioner',
      name: 'Divine Executioner',
      description: 'Become an instrument of divine justice for 5 rounds. Your eyes burn with white fire and your weapon crackles with holy energy. You instantly know the true alignment of every creature you can see. Your weapon attacks deal an additional 4d10 radiant damage against evil creatures. You are completely immune to all damage and effects from evil-aligned creatures and sources.',
      level: 9,
      spellType: 'ACTION',
      effectTypes: ['transformation'],
      school: 'radiant',
      icon: 'Radiant/Radiant Warrior',
      typeConfig: {
        school: 'radiant',
        castTime: '1 action',
        castTimeType: 'action',
        range: 'self',
        rangeType: 'self',
        tags: ['transformation', 'damage', 'demonhunter']
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      durationConfig: {
        durationType: 'rounds',
        durationValue: 5,
        durationUnit: 'rounds',
        requiresConcentration: false
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      transformationConfig: {
        transformationType: 'divine',
        targetType: 'self',
        duration: 5,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Divine Executioner',
        description: 'Become an instrument of divine justice for 5 rounds.',
        grantedAbilities: [
          { id: 'divine_judge', name: 'Divine Judge', description: 'Instantly know the true alignment of every creature you can see' },
          { id: 'execution_strike', name: 'Execution Strike', description: 'Weapon attacks deal +4d10 radiant damage against evil creatures', damageFormula: '4d10' },
          { id: 'evil_immunity', name: 'Evil Immunity', description: 'Immune to all damage and effects from evil-aligned creatures and sources' }
        ]
      },
      tags: ['transformation', 'damage', 'demonhunter']
    },

    // ===== LEVEL 10 SPELLS — Ultimate (8 charges, beyond normal maximum) =====

    {
      id: 'cov_hexbreaker_armageddon',
      name: 'Hexbreaker Armageddon',
      description: 'You don\'t cast this spell — you surrender to it. The anti-magic energy you\'ve gathered your entire career erupts outward in a wave of absolute annihilation that rewrites reality. The ground cracks. The sky darkens. Every thread of magic in the area unravels simultaneously, and the damage is permanent — magic will never function here again. The world remembers what you did, and it is afraid.',
      level: 10,
      spellType: 'ACTION',
      effectTypes: ['damage', 'utility'],
      school: 'necrotic',
      icon: 'Necrotic/Ritual',
      typeConfig: {
        school: 'necrotic',
        castTime: '1 action',
        castTimeType: 'action',
        range: 'self',
        rangeType: 'self',
        tags: ['aoe', 'damage', 'permanent', 'anti-magic']
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: { radius: 100 }
      },
      durationConfig: {
        durationType: 'permanent',
        durationValue: 0,
        durationUnit: 'permanent',
        requiresConcentration: false
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 8 },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      damageConfig: {
        formula: '10d10',
        elementType: 'necrotic',
        damageType: 'area',
        canCrit: false,
        criticalConfig: {
          critType: 'effect',
          critEffects: ['magic_annihilation', 'reality_break']
        }
      },
      resolution: 'SAVING_THROW',
      savingThrow: {
        enabled: true,
        savingThrowType: 'charisma',
        difficultyClass: 20,
        saveOutcome: 'negates'
      },
      utilityConfig: {
        utilityType: 'environment',
        selectedEffects: [
          {
            id: 'permanent_magic_ending',
            name: 'Permanent Magic Death',
            description: '100ft sphere. All magic permanently destroyed. Spells fail, enchantments end, magic items become inert. Magic cannot function in this area ever again. Charisma save or permanently lose spellcasting ability.',
            mechanicsText: '100ft radius, permanent'
          }
        ],
        power: 'major'
      },
      tags: ['aoe', 'damage', 'permanent', 'anti-magic', 'spellbreaker']
    },

    {
      id: 'cov_shadow_god',
      name: 'Shadow God',
      description: 'You become something that should not exist — a god carved from shadow, wearing darkness like a second skin. In this form, only the purest light can touch you, and you move through the world like a thought through a sleeping mind, appearing and vanishing without effort or action. Every strike you land against evil is a killing blow — the shadows themselves ensure it. When you return to mortality, the cost is steep. Three rounds of divinity. A lifetime of exhaustion.',
      level: 10,
      spellType: 'ACTION',
      effectTypes: ['transformation'],
      school: 'shadow',
      icon: 'Utility/Summon Minion',
      typeConfig: {
        school: 'shadow',
        castTime: '1 action',
        castTimeType: 'action',
        range: 'self',
        rangeType: 'self',
        tags: ['transformation', 'ultimate', 'shadowbane']
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      durationConfig: {
        durationType: 'rounds',
        durationValue: 3,
        durationUnit: 'rounds',
        requiresConcentration: false
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 8 },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      transformationConfig: {
        transformationType: 'shadow',
        targetType: 'self',
        duration: 3,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Shadow God',
        description: 'Ascend to the pinnacle of shadow mastery for 3 rounds.',
        grantedAbilities: [
          { id: 'shadow_immunity', name: 'Shadow Immunity', description: 'Immune to all damage except radiant' },
          { id: 'instant_teleport', name: 'Instant Teleport', description: 'Teleport anywhere within 120ft as a free action (no action points)' },
          { id: 'auto_crit_evil', name: 'Auto-Crit Evil', description: 'All attacks against evil creatures automatically critical hit' },
          { id: 'shadow_exhaustion', name: 'Shadow Exhaustion', description: 'Gain 2 levels of exhaustion when transformation ends' }
        ]
      },
      tags: ['transformation', 'ultimate', 'shadowbane']
    },

    {
      id: 'cov_divine_incarnation',
      name: 'Divine Incarnation',
      description: 'Divine fire pours down from above and fills you until your skin glows like forged steel. You are no longer human — you are a verdict made flesh. Evil creatures within your presence burn simply for existing near you, their eyes wide with the understanding that judgment has arrived. Once per round, you may extend your hand and speak a single word: an evil creature before you simply ceases, as though it never existed at all. Three rounds of this power costs a heavy toll.',
      level: 10,
      spellType: 'ACTION',
      effectTypes: ['transformation'],
      school: 'radiant',
      icon: 'Radiant/Winged Angel',
      typeConfig: {
        school: 'radiant',
        castTime: '1 action',
        castTimeType: 'action',
        range: 'self',
        rangeType: 'self',
        tags: ['transformation', 'ultimate', 'demonhunter']
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      durationConfig: {
        durationType: 'rounds',
        durationValue: 3,
        durationUnit: 'rounds',
        requiresConcentration: false
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 8 },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest',
        value: 1
      },
      transformationConfig: {
        transformationType: 'divine',
        targetType: 'self',
        duration: 3,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Divine Incarnation',
        description: 'Become an avatar of divine justice for 3 rounds.',
        grantedAbilities: [
          { id: 'divine_aura', name: 'Divine Aura', description: 'Evil creatures within 30ft take 3d8 radiant damage per round and are frightened', damageFormula: '3d8' },
          { id: 'evil_immunity_full', name: 'Complete Evil Immunity', description: 'Immune to all damage and effects from evil creatures and sources' },
          { id: 'execution_blow', name: 'Execution Blow', description: 'Once per round, instantly kill any evil creature within 30ft that has 50 HP or fewer' },
          { id: 'divine_exhaustion', name: 'Divine Exhaustion', description: 'Gain 2 levels of exhaustion when transformation ends' }
        ]
      },
      tags: ['transformation', 'ultimate', 'demonhunter']
    }
  ],

  // ═════════════════════════════════════════════════════════════════
  // SPELL POOLS BY LEVEL
  // ═════════════════════════════════════════════════════════════════
  spellPools: {
    1: [
      'cov_shadow_hunt',
      'cov_hex_strike',
      'cov_silver_blade'
    ],
    2: [
      'cov_dark_pursuit',
      'cov_hex_weakness',
      'cov_silver_bolt'
    ],
    3: [
      'cov_curse_eater',
      'cov_shadow_ambush',
      'cov_anti_magic_barrier'
    ],
    4: [
      'cov_spirit_shackle',
      'cov_hexbreaker_precision',
      'cov_silver_storm'
    ],
    5: [
      'cov_hexbreaker_execution',
      'cov_anti_magic_field',
      'cov_hunters_net'
    ],
    6: [
      'cov_hexbreaker_fury',
      'cov_shadow_eruption',
      'cov_spell_nullification'
    ],
    7: [
      'cov_hexbreaker_storm',
      'cov_apex_predator',
      'cov_final_hour'
    ],
    8: [
      'cov_judgment_day',
      'cov_shadow_ascendant',
      'cov_anti_magic_storm'
    ],
    9: [
      'cov_hexbreaker_apocalypse',
      'cov_void_hunter',
      'cov_divine_executioner'
    ],
    10: [
      'cov_hexbreaker_armageddon',
      'cov_shadow_god',
      'cov_divine_incarnation'
    ]
  }
};
