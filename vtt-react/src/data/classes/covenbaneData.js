export const COVENBANE_DATA = {
  id: 'covenbane',
  name: 'Covenbane',
  icon: 'fas fa-crosshairs',
  color: '#8B4513',
  role: 'Anti-Magic Hunter',

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
      icon: 'ability_stealth',
      color: '#2F2F4F',
      talents: []
    },
    {
      id: 'spellbreaker',
      name: 'Spellbreaker - Anti-Magic Mastery',
      description: 'Specialists in disrupting and destroying magical effects and spellcasters.',
      icon: 'spell_holy_dispelmagic',
      color: '#4F2F2F',
      talents: []
    },
    {
      id: 'demonhunter',
      name: 'Demonhunter - Relentless Pursuit',
      description: 'Fanatical hunters who mark and relentlessly pursue evil creatures across any distance.',
      icon: 'ability_hunter_markedfordeath',
      color: '#4F4F2F',
      talents: []
    }
  ],

  // Covenbane Spells by Level - Complete spell list for the class
  exampleSpells: [
    // ===== LEVEL 1 SPELLS =====
    {
      id: 'cov_shadow_hunt',
      name: 'Shadow Hunt',
      description: 'Mark an evil magic user for relentless pursuit. You gain advantage on attacks against the marked target and can track them through walls.',
      level: 1,
      effectTypes: ['utility'],
      typeConfig: {
        school: 'shadow',
        icon: 'ability_hunter_markedfordeath',
        tags: ['tracking', 'marking', 'utility']
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60
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
      utilityConfig: {
        utilityType: 'information',
        selectedEffects: [{
          id: 'mark_target',
          name: 'Mark Target',
          description: 'Mark evil magic user for tracking',
      level: 1,
          distance: 60,
          duration: 10,
          durationUnit: 'minutes'
        }],
        power: 'minor'
      },
      tags: ['tracking', 'marking', 'utility']
    },

    {
      id: 'cov_hex_strike',
      name: 'Hex Strike',
      description: 'Imbue your weapon with anti-magic energy. Your next attack deals bonus necrotic damage and generates Hexbreaker charges.',
      level: 1,
      effectTypes: ['damage', 'utility'],
      typeConfig: {
        school: 'necrotic',
        icon: 'spell_shadow_curse',
        tags: ['damage', 'weapon', 'charge-generation']
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
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
      damageConfig: {
        formula: '1d6',
        elementType: 'necrotic',
        damageType: 'direct',
        canCrit: false,
        critMultiplier: 2,
        critDiceOnly: false
      },
      resolution: 'DICE',
      utilityConfig: {
        utilityType: 'enhancement',
        selectedEffects: [{
          id: 'weapon_enchantment',
          name: 'Weapon Enchantment',
          description: 'Imbue weapon with anti-magic energy',
      level: 1,
          duration: 1,
          durationUnit: 'attacks'
        }],
        power: 'minor'
      },
      tags: ['damage', 'weapon', 'charge-generation']
    },

    {
      id: 'cov_silver_blade',
      name: 'Silver Blade',
      description: 'Coat your weapon in blessed silver that bypasses magical defenses and resistances.',
      level: 1,
      effectTypes: ['utility'],
      typeConfig: {
        school: 'radiant',
        icon: 'spell_holy_righteousfury',
        tags: ['weapon', 'anti-magic', 'resistance-piercing']
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
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
      utilityConfig: {
        utilityType: 'enhancement',
        selectedEffects: [{
          id: 'silver_coating',
          name: 'Silver Coating',
          description: 'Coat weapon in blessed silver',
          duration: 1,
          durationUnit: 'minutes',
          concentration: true
        }],
        power: 'minor'
      },
      tags: ['weapon', 'anti-magic', 'resistance-piercing']
    },

    // ===== LEVEL 2 SPELLS =====
    {
      id: 'cov_dark_pursuit',
      name: 'Dark Pursuit',
      description: 'Surge forward with supernatural speed, gaining advantage on your next attack and increased movement.',
      level: 2,
      effectTypes: ['utility'],
      typeConfig: {
        school: 'shadow',
        icon: 'ability_rogue_sprint',
        tags: ['mobility', 'speed', 'utility']
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
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
        selectedEffects: [{
          id: 'speed_burst',
          name: 'Speed Burst',
          description: 'Supernatural burst of speed',
      level: 2,
          duration: 1,
          durationUnit: 'rounds'
        }],
        power: 'moderate'
      },
      tags: ['mobility', 'speed', 'utility']
    },

    {
      id: 'cov_hex_weakness',
      name: 'Hex of Weakness',
      description: 'Curse an evil magic user, reducing their magical power and making them vulnerable to your attacks.',
      level: 2,
      effectTypes: ['debuff'],
      typeConfig: {
        school: 'necrotic',
        icon: 'spell_shadow_curseofmannoroth',
        tags: ['debuff', 'curse', 'anti-magic']
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30
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
        debuffType: 'statReduction',
        effects: [{
          id: 'weakened_magic',
          name: 'Weakened Magic',
          description: 'Spell attack rolls reduced by 2 for 1 minute. The target\'s magical power is diminished, making their spells less accurate and easier to resist.',
          statModifier: {
            stat: 'spellAttack',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: true,
        savingThrowType: 'spirit',
        saveDC: 13,
        saveOutcome: 'negates'
      },
      tags: ['debuff', 'curse', 'anti-magic']
    },

    {
      id: 'cov_silver_bolt',
      name: 'Silver Bolt',
      description: 'Fire a bolt of blessed silver energy that pierces magical defenses and tracks evil magic users.',
      level: 2,
      effectTypes: ['damage'],
      typeConfig: {
        school: 'radiant',
        icon: 'spell_holy_holybolt',
        tags: ['damage', 'ranged', 'anti-magic']
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60
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
      resolution: 'DICE',
      tags: ['damage', 'ranged', 'anti-magic']
    },

    // ===== LEVEL 3 SPELLS =====
    {
      id: 'cov_curse_eater',
      name: 'Curse Eater',
      description: 'Consume and neutralize a curse or magical effect, converting it into Hexbreaker power.',
      level: 3,
      effectTypes: ['purification'],
      typeConfig: {
        school: 'necrotic',
        icon: 'spell_shadow_devouraura',
        tags: ['dispel', 'anti-magic', 'utility']
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        rangeDistance: 5
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 2 },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      purificationConfig: {
        purificationType: 'dispel',
        targetType: 'single',
        power: 'moderate'
      },
      tags: ['dispel', 'anti-magic', 'utility']
    },

    {
      id: 'cov_shadow_ambush',
      name: 'Shadow Ambush',
      description: 'Enter stealth even in combat and prepare a devastating ambush attack.',
      level: 3,
      effectTypes: ['utility'],
      typeConfig: {
        school: 'shadow',
        icon: 'ability_stealth',
        tags: ['stealth', 'utility', 'shadowbane']
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
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
        utilityType: 'enhancement',
        selectedEffects: [{
          id: 'combat_stealth',
          name: 'Combat Stealth',
          description: 'Enter stealth even in combat',
      level: 3,
          duration: 1,
          durationUnit: 'minutes'
        }],
        power: 'moderate'
      },
      tags: ['stealth', 'utility', 'shadowbane']
    },

    {
      id: 'cov_anti_magic_barrier',
      name: 'Anti-Magic Barrier',
      description: 'Create a protective barrier that disrupts spells cast against you and your allies.',
      level: 3,
      effectTypes: ['utility'],
      typeConfig: {
        school: 'necrotic',
        icon: 'spell_shadow_antimagic',
        tags: ['protection', 'anti-magic', 'spellbreaker']
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: { radius: 10 }
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 2 },
        actionPoints: 1,
        components: ['verbal']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      utilityConfig: {
        utilityType: 'enhancement',
        selectedEffects: [{
          id: 'spell_barrier',
          name: 'Spell Barrier',
          description: 'Protective barrier against spells',
          duration: 1,
          durationUnit: 'rounds'
        }],
        power: 'moderate'
      },
      tags: ['protection', 'anti-magic', 'spellbreaker']
    },

    // ===== LEVEL 4 SPELLS =====
    {
      id: 'cov_spirit_shackle',
      name: 'Spirit Shackle',
      description: 'Bind an enemy\'s spirit to the ground with dark tendrils, immobilizing them completely.',
      level: 4,
      effectTypes: ['control'],
      typeConfig: {
        school: 'shadow',
        icon: 'spell_shadow_blackplague',
        tags: ['crowd-control', 'root', 'control']
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 3 },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      controlConfig: {
        controlType: 'restraint',
        strength: 'strong',
        duration: 1,
        durationUnit: 'minutes',
        saveDC: 15,
        saveType: 'spirit',
        savingThrow: true,
        effects: [{
          id: 'spirit_bind',
          name: 'Spirit Bind',
          description: 'Dark tendrils immobilize the target',
          config: {
            restraintType: 'immobilize'
          }
        }]
      },
      tags: ['crowd-control', 'root', 'control']
    },

    {
      id: 'cov_hexbreaker_precision',
      name: 'Hexbreaker Precision',
      description: 'Focus your Hexbreaker charges into unparalleled accuracy and power against evil magic users.',
      level: 4,
      effectTypes: ['buff'],
      typeConfig: {
        school: 'necrotic',
        icon: 'ability_hunter_aimedshot',
        tags: ['buff', 'accuracy', 'anti-magic']
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 2 },
        actionPoints: 1,
        components: ['verbal']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'precision_focus',
          name: 'Precision Focus',
          description: 'Enhanced accuracy against evil magic users',
          statModifier: {
            stat: 'attack',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: true,
        canBeDispelled: false
      },
      tags: ['buff', 'accuracy', 'anti-magic']
    },

    {
      id: 'cov_silver_storm',
      name: 'Silver Storm',
      description: 'Unleash a barrage of blessed silver projectiles that seek out evil magic users.',
      level: 4,
      effectTypes: ['damage'],
      typeConfig: {
        school: 'radiant',
        icon: 'spell_holy_holynova',
        tags: ['damage', 'aoe', 'radiant']
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: { radius: 20 }
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 3 },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      damageConfig: {
        formula: '3d6',
        elementType: 'radiant',
        damageType: 'area',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false
      },
      resolution: 'DICE',
      savingThrow: {
        enabled: true,
        savingThrowType: 'agility',
        difficultyClass: 15,
        saveOutcome: 'halves'
      },
      resolution: 'SAVING_THROW',
      tags: ['damage', 'aoe', 'radiant']
    },

    // ===== LEVEL 5 SPELLS =====
    {
      id: 'cov_hexbreaker_execution',
      name: 'Hexbreaker Execution',
      description: 'Attempt to instantly execute a wounded evil magic user, ending their threat permanently.',
      level: 5,
      effectTypes: ['control'],
      typeConfig: {
        school: 'shadow',
        icon: 'ability_warrior_execute',
        tags: ['execute', 'control', 'melee']
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 4 },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      controlConfig: {
        controlType: 'incapacitation',
        strength: 'severe',
        duration: 0,
        durationUnit: 'instant',
        saveType: 'constitution',
        saveDC: 16,
        savingThrow: true,
        effects: [{
          id: 'instant_death',
          name: 'Instant Death',
          description: 'Attempt to instantly kill wounded evil magic users'
        }]
      },
      tags: ['execute', 'control', 'melee']
    },

    {
      id: 'cov_anti_magic_field',
      name: 'Anti-Magic Field',
      description: 'Create a zone where magic fails and evil creatures are weakened.',
      level: 5,
      effectTypes: ['utility'],
      typeConfig: {
        school: 'necrotic',
        icon: 'spell_shadow_antimagic',
        tags: ['aoe', 'anti-magic', 'suppression', 'spellbreaker']
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: { radius: 15 }
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 4 },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      utilityConfig: {
        utilityType: 'environment',
        selectedEffects: [{
          id: 'anti_magic_zone',
          name: 'Anti-Magic Zone',
          description: 'Zone where magic fails and evil creatures are weakened',
      level: 5,
          duration: 1,
          durationUnit: 'minutes',
          concentration: true
        }],
        power: 'major'
      },
      tags: ['aoe', 'anti-magic', 'suppression', 'spellbreaker']
    },

    {
      id: 'cov_hunters_net',
      name: 'Hunter\'s Net',
      description: 'Cast a net of silver chains that restrains multiple evil creatures and prevents spellcasting.',
      effectTypes: ['control'],
      typeConfig: {
        school: 'radiant',
        icon: 'spell_holy_righteousfury',
        tags: ['aoe', 'crowd-control', 'anti-magic', 'demonhunter']
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: { radius: 20 }
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 4 },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      controlConfig: {
        controlType: 'restraint',
        strength: 'strong',
        duration: 1,
        durationUnit: 'minutes',
        saveType: 'strength',
        saveDC: 16,
        savingThrow: true,
        effects: [{
          id: 'silver_net',
          name: 'Silver Net',
          description: 'Silver chains restrain evil creatures and prevent spellcasting'
        }]
      },
      tags: ['aoe', 'crowd-control', 'anti-magic', 'demonhunter']
    },

    // ===== LEVEL 6 SPELLS =====
    {
      id: 'cov_hexbreaker_fury',
      name: 'Hexbreaker Fury',
      description: 'Unleash all accumulated Hexbreaker charges in a cataclysmic burst of anti-magic energy.',
      level: 6,
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'necrotic',
        icon: 'spell_shadow_plaguecloud',
        tags: ['aoe', 'damage', 'stun', 'ultimate']
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: { radius: 25 }
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      damageConfig: {
        formula: '4d6',
        elementType: 'necrotic',
        damageType: 'area',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false
      },
      resolution: 'DICE',
      controlConfig: {
        controlType: 'incapacitation',
        strength: 'severe',
        duration: 1,
        durationUnit: 'rounds',
        saveType: 'constitution',
        saveDC: 17,
        savingThrow: true,
        effects: [{
          id: 'anti_magic_burst',
          name: 'Anti-Magic Burst',
          description: 'Stuns evil creatures with cataclysmic anti-magic energy'
        }]
      },
      resolution: 'SAVING_THROW',
      tags: ['aoe', 'damage', 'stun', 'ultimate']
    },

    {
      id: 'cov_shadow_eruption',
      name: 'Shadow Eruption',
      description: 'Cause shadows to erupt from the ground, damaging and disorienting evil magic users. Enemies within 15 feet take damage and must save or be blinded for 2 rounds.',
      level: 6,
      effectTypes: ['damage', 'debuff'],
      typeConfig: {
        school: 'shadow',
        icon: 'spell_shadow_shadesofdarkness',
        tags: ['aoe', 'damage', 'debuff', 'vision', 'shadowbane']
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: { radius: 15 }
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 5 },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      damageConfig: {
        formula: '4d8',
        elementType: 'necrotic',
        damageType: 'area',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false
      },
      resolution: 'SAVE',
      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'shadow_blindness',
          name: 'Shadow Blindness',
          description: 'Blinded for 2 rounds - cannot see, automatically fails sight-based checks, disadvantage on attack rolls',
          statusType: 'blinded',
          level: 'moderate'
        }],
        durationValue: 2,
        durationType: 'rounds',
        durationUnit: 'rounds',
        saveType: 'dexterity',
        saveDC: 17,
        saveOutcome: 'negates'
      },
      tags: ['aoe', 'damage', 'debuff', 'vision', 'shadowbane']
    },

    {
      id: 'cov_spell_nullification',
      name: 'Spell Nullification',
      description: 'Permanently prevent a spellcaster from casting a specific spell they know.',
      effectTypes: ['control'],
      typeConfig: {
        school: 'necrotic',
        icon: 'spell_shadow_sealofkings',
        tags: ['reaction', 'anti-magic', 'permanent', 'spellbreaker']
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 60
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 5 },
        actionPoints: 1,
        components: ['verbal']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      controlConfig: {
        controlType: 'restriction',
        strength: 'severe',
        duration: 24,
        durationUnit: 'hours',
        effects: [{
          id: 'spell_seal',
          name: 'Spell Seal',
          description: 'Permanently prevents casting of a specific spell'
        }]
      },
      tags: ['reaction', 'anti-magic', 'permanent', 'spellbreaker']
    },

    // ===== LEVEL 7 SPELLS =====
    {
      id: 'cov_hexbreaker_storm',
      name: 'Hexbreaker Storm',
      description: 'Summon a raging storm of anti-magic energy that tears through evil magic users. The storm creates a zone of pure anti-magic that disrupts spellcasting and weakens those who rely on magic. The energy burns with radiant fury, consuming magical power.',
      level: 7,
      effectTypes: ['damage', 'debuff'],
      typeConfig: {
        school: 'necrotic',
        icon: 'spell_shadow_shadowbolt',
        tags: ['aoe', 'damage-over-time', 'anti-magic', 'concentration']
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: { radius: 30 }
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      damageConfig: {
        formula: '3d8',
        elementType: 'radiant',
        damageType: 'area',
        hasDotEffect: true,
        dotConfig: {
          dotFormula: '3d8',
          duration: 1,
          tickFrequency: 'round',
          isProgressiveDot: false
        },
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false
      },
      resolution: 'NONE',
      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'anti_magic_weakening',
          name: 'Anti-Magic Weakening',
          description: 'Spells have disadvantage and mana cannot be regained for 1 minute (requires concentration) - damage output and spell effectiveness reduced',
          statusType: 'weakened',
          level: 'major'
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: true
      },
      tags: ['aoe', 'damage-over-time', 'anti-magic', 'concentration']
    },

    {
      id: 'cov_apex_predator',
      name: 'Apex Predator',
      description: 'Transform into a perfect hunter for 10 minutes, becoming invisible to evil creatures and gaining supernatural hunting abilities. Detect evil within 60ft, see in magical darkness, and gain +15ft movement speed.',
      level: 7,
      effectTypes: ['transformation'],
      typeConfig: {
        school: 'shadow',
        icon: 'ability_hunter_beastmastery',
        tags: ['transformation', 'stealth', 'buff', 'shadowbane']
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      transformationConfig: {
        transformationType: 'physical',
        targetType: 'self',
        duration: 10,
        durationUnit: 'minutes',
        power: 'major',
        newForm: 'Apex Predator',
        description: 'Become a perfect supernatural hunter for 10 minutes.',
        grantedAbilities: [
          { id: 'invisibility_evil', name: 'Invisible to Evil', description: 'Evil creatures cannot perceive you' },
          { id: 'supernatural_senses', name: 'Supernatural Senses', description: 'Detect evil within 60ft, see in magical darkness' },
          { id: 'enhanced_speed', name: 'Enhanced Speed', description: '+15ft movement speed' }
        ]
      },
      tags: ['transformation', 'stealth', 'buff', 'shadowbane']
    },

    {
      id: 'cov_final_hour',
      name: 'Final Hour',
      description: 'Enter a state of ultimate focus for 1 minute where every attack triggers Witch Hunter\'s Precision. Your senses sharpen, your movements become fluid, and your strikes find their mark with unerring precision against demonic foes.',
      effectTypes: ['buff'],
      typeConfig: {
        school: 'radiant',
        icon: 'ability_hunter_snipershot',
        tags: ['transformation', 'damage', 'mobility', 'demonhunter']
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [
          {
            id: 'ultimate_focus_attack',
            name: 'Perfect Precision',
            description: 'Gain +4 to attack rolls for 1 minute. Your focus is so intense that every strike is perfectly aimed, making it nearly impossible to miss your target.',
            statModifier: {
              stat: 'attack',
              magnitude: 4,
              magnitudeType: 'flat'
            }
          },
          {
            id: 'ultimate_focus_damage',
            name: 'Devastating Strikes',
            description: 'Your attacks strike with overwhelming force, tearing through demonic defenses and leaving devastating wounds. Every strike carries the weight of your ultimate focus, making each blow more devastating than the last.',
            statModifier: {
              stat: 'damage',
              magnitude: '2d6',
              magnitudeType: 'flat'
            }
          },
          {
            id: 'ultimate_focus_speed',
            name: 'Flowing Movement',
            description: 'Your movements become fluid and effortless, allowing you to reposition with deadly efficiency. You flow through combat like a shadow, your enhanced speed making you nearly untouchable.',
            statModifier: {
              stat: 'speed',
              magnitude: 15,
              magnitudeType: 'flat'
            }
          },
          {
            id: 'ultimate_focus_crit',
            name: 'Critical Mastery',
            description: 'Your enhanced focus allows you to find and exploit weak points with devastating precision. Your critical strikes become more frequent as you learn to read your enemies\' defenses and strike where they are most vulnerable.',
            statModifier: {
              stat: 'crit_range',
              magnitude: 1,
              magnitudeType: 'flat'
            }
          }
        ],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: false,
        canBeDispelled: false
      },
      tags: ['transformation', 'damage', 'mobility', 'demonhunter']
    },

    // ===== LEVEL 8 SPELLS =====
    {
      id: 'cov_judgment_day',
      name: 'Judgment Day',
      description: 'Call down divine judgment on all evil magic users within range, dealing massive radiant damage.',
      level: 8,
      effectTypes: ['damage', 'healing'],
      typeConfig: {
        school: 'radiant',
        icon: 'spell_holy_divineintervention',
        tags: ['aoe', 'damage', 'healing', 'radiant']
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: { radius: 40 }
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      damageConfig: {
        formula: '6d8',
        elementType: 'radiant',
        damageType: 'area',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false
      },
      resolution: 'DICE',
      healingConfig: {
        formula: '6d8',
        healingType: 'direct',
        hasHotEffect: false,
        hasShieldEffect: false
      },
      savingThrow: {
        enabled: true,
        savingThrowType: 'spirit',
        difficultyClass: 18,
        saveOutcome: 'halves'
      },
      resolution: 'SAVING_THROW',
      tags: ['aoe', 'damage', 'healing', 'radiant']
    },

    {
      id: 'cov_shadow_ascendant',
      name: 'Shadow Ascendant',
      description: 'Ascend into shadow form, becoming an entity of pure anti-magic power.',
      level: 8,
      effectTypes: ['transformation'],
      typeConfig: {
        school: 'shadow',
        icon: 'spell_shadow_shadesofdarkness',
        tags: ['transformation', 'mobility', 'damage', 'shadowbane']
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      transformationConfig: {
        transformationType: 'shadow',
        targetType: 'self',
        duration: 1,
        durationUnit: 'minutes',
        power: 'major',
        newForm: 'Shadow Ascendant',
        description: 'Become an entity of pure shadow and anti-magic.',
        grantedAbilities: [
          { id: 'shadow_entity', name: 'Shadow Entity', description: 'Physical damage reduced by 50%' },
          { id: 'shadow_teleport', name: 'Shadow Step', description: 'Teleport 30ft using action points' },
          { id: 'wall_phasing', name: 'Wall Phasing', description: 'Pass through non-magical barriers' }
        ]
      },
      tags: ['transformation', 'mobility', 'damage', 'shadowbane']
    },

    {
      id: 'cov_anti_magic_storm',
      name: 'Anti-Magic Storm',
      description: 'Create a massive storm that completely nullifies magic in a wide area.',
      level: 8,
      effectTypes: ['damage', 'utility'],
      typeConfig: {
        school: 'necrotic',
        tags: ['aoe', 'anti-magic', 'suppression', 'concentration', 'spellbreaker']
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: { radius: 40 }
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      damageConfig: {
        formula: '4d10',
        elementType: 'force',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false
      },
      resolution: 'DICE',
      utilityConfig: {
        utilityType: 'environment',
        selectedEffects: [{
          id: 'total_magic_nullification',
          name: 'Total Magic Nullification',
          description: 'All magic fails, effects are dispelled, mana cannot be used',
          duration: 1,
          durationUnit: 'minutes',
          concentration: true
        }],
        power: 'major'
      },
      resolution: 'AUTOMATIC',
      tags: ['aoe', 'anti-magic', 'suppression', 'concentration', 'spellbreaker']
    },

    // ===== LEVEL 9 SPELLS =====
    {
      id: 'cov_hexbreaker_apocalypse',
      name: 'Hexbreaker Apocalypse',
      description: 'Unleash apocalyptic levels of anti-magic energy that reshape reality itself.',
      level: 9,
      effectTypes: ['damage', 'debuff'],
      typeConfig: {
        school: 'necrotic',
        tags: ['aoe', 'damage', 'damage-over-time', 'anti-magic']
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: { radius: 50 }
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      damageConfig: {
        formula: '8d8',
        elementType: 'necrotic',
        damageType: 'area',
        hasDotEffect: true,
        dotConfig: {
          dotFormula: '4d8',
          duration: 1,
          tickFrequency: 'round',
          isProgressiveDot: false
        },
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false
      },
      resolution: 'DICE',
      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'apocalyptic_weakening',
          name: 'Apocalyptic Weakening',
          description: 'Evil creatures cannot cast spells, teleport, or regain mana - damage output and abilities severely reduced',
          statusType: 'weakened',
          level: 'extreme'
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        saveType: 'constitution',
        saveDC: 19,
        saveOutcome: 'negates'
      },
      savingThrow: {
        enabled: true,
        savingThrowType: 'constitution',
        difficultyClass: 19,
        saveOutcome: 'halves'
      },
      resolution: 'SAVING_THROW',
      tags: ['aoe', 'damage', 'damage-over-time', 'anti-magic']
    },

    {
      id: 'cov_void_hunter',
      name: 'Void Hunter',
      description: 'Step into the void between worlds, becoming a perfect hunter that can strike from anywhere.',
      level: 9,
      effectTypes: ['transformation'],
      typeConfig: {
        school: 'shadow',
        icon: 'spell_shadow_nethercloak',
        tags: ['transformation', 'mobility', 'damage', 'shadowbane']
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      transformationConfig: {
        transformationType: 'spectral',
        targetType: 'self',
        duration: 5,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Void Hunter',
        description: 'Exist partially in the void, striking from impossible angles.',
        grantedAbilities: [
          { id: 'void_existence', name: 'Void Existence', description: 'Immune to non-magical damage' },
          { id: 'teleport_strike', name: 'Teleport Strike', description: 'Teleport to any visible target as part of an attack' },
          { id: 'ignore_defenses', name: 'Ignore Defenses', description: 'Attacks ignore armor and magical shields' }
        ]
      },
      tags: ['transformation', 'mobility', 'damage', 'shadowbane']
    },

    {
      id: 'cov_divine_executioner',
      name: 'Divine Executioner',
      description: 'Become an instrument of divine justice, executing evil with righteous fury.',
      level: 9,
      effectTypes: ['transformation'],
      typeConfig: {
        school: 'radiant',
        icon: 'spell_holy_righteousfury',
        tags: ['transformation', 'damage', 'mobility', 'demonhunter']
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      transformationConfig: {
        transformationType: 'divine',
        targetType: 'self',
        duration: 5,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Divine Executioner',
        description: 'Become an instrument of divine justice.',
        grantedAbilities: [
          { id: 'divine_judge', name: 'Divine Judge', description: 'Instantly know the alignment of any creature' },
          { id: 'execution_strike', name: 'Execution Strike', description: 'Deal extra radiant damage to evil creatures', damageFormula: '4d10' },
          { id: 'evil_immunity', name: 'Evil Immunity', description: 'Immune to damage from evil-aligned creatures' }
        ]
      },
      tags: ['transformation', 'damage', 'mobility', 'demonhunter']
    },

    // ===== LEVEL 10 SPELLS =====
    {
      id: 'cov_hexbreaker_armageddon',
      name: 'Hexbreaker Armageddon',
      description: 'End the age of magic itself, unleashing total anti-magic annihilation.',
      level: 10,
      effectTypes: ['damage', 'utility'],
      typeConfig: {
        school: 'necrotic',
        tags: ['aoe', 'damage', 'permanent', 'anti-magic']
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'sphere',
        aoeParameters: { radius: 100 }
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 1,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'turn_based',
        value: 0
      },
      damageConfig: {
        formula: '10d10',
        elementType: 'necrotic',
        damageType: 'area',
        criticalConfig: {
          critType: 'effect',
          critEffects: ['magic_annihilation', 'reality_break']
        }
      },
      resolution: 'DICE',
      utilityConfig: {
        utilityType: 'environment',
        selectedEffects: [{
          id: 'permanent_magic_ending',
          name: 'Permanent Magic Ending',
          description: 'All magic permanently ends in the area, reality rejects magic forever'
        }],
        power: 'major'
      },
      savingThrow: {
        enabled: true,
        savingThrowType: 'charisma',
        difficultyClass: 20,
        saveOutcome: 'negates'
      },
      resolution: 'SAVING_THROW',
      tags: ['aoe', 'damage', 'permanent', 'anti-magic']
    },

    {
      id: 'cov_shadow_god',
      name: 'Shadow God',
      description: 'Become a master of shadows for 3 rounds, wielding ultimate power over darkness and anti-magic. Gain immunity to non-radiant damage, instant teleportation, and auto-crit against evil. When transformation ends, gain 2 levels of exhaustion.',
      level: 10,
      effectTypes: ['transformation'],
      typeConfig: {
        school: 'shadow',
        icon: 'spell_shadow_nethercloak',
        tags: ['transformation', 'ultimate', 'shadowbane']
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 8 },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest'
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
          { id: 'shadow_immunity', name: 'Shadow Immunity', description: 'Immune to all non-radiant damage' },
          { id: 'instant_teleport', name: 'Instant Teleport', description: 'Teleport anywhere within 120ft (no action points)' },
          { id: 'auto_crit_evil', name: 'Auto-Crit Evil', description: 'All attacks against evil creatures automatically crit' },
          { id: 'shadow_exhaustion', name: 'Shadow Exhaustion (On End)', description: 'Gain 2 levels of exhaustion when transformation ends' }
        ]
      },
      tags: ['transformation', 'ultimate', 'shadowbane']
    },

    {
      id: 'cov_divine_incarnation',
      name: 'Divine Incarnation',
      description: 'Channel the full power of divine justice for 3 rounds, becoming an avatar of righteous wrath. Evil creatures within 30ft take radiant damage per round, you are immune to all damage from evil creatures, and can instantly kill evil creatures below 50 HP once per round. When transformation ends, gain 2 levels of exhaustion.',
      level: 10,
      effectTypes: ['transformation'],
      typeConfig: {
        school: 'radiant',
        icon: 'spell_holy_divineintervention',
        tags: ['transformation', 'ultimate', 'demonhunter']
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },
      resourceCost: {
        resourceTypes: ['hexbreakerCharges'],
        resourceValues: { hexbreakerCharges: 8 },
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: {
        type: 'long_rest'
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
          { id: 'divine_aura', name: 'Divine Aura', description: 'Evil creatures within 30ft take radiant damage per round', damageFormula: '3d8' },
          { id: 'evil_immunity_full', name: 'Complete Evil Immunity', description: 'Immune to all damage and effects from evil creatures' },
          { id: 'execution_blow', name: 'Execution Blow', description: 'Once per round, instantly kill an evil creature below 50 HP' },
          { id: 'divine_exhaustion', name: 'Divine Exhaustion (On End)', description: 'Gain 2 levels of exhaustion when transformation ends' }
        ]
      },
      tags: ['transformation', 'ultimate', 'demonhunter']
    }
  ],

  // Spell Pools by Level
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
      'cov_shadow_eruption'
    ],
    7: [
      'cov_spell_nullification'
    ],
    8: [
      'cov_hexbreaker_storm',
      'cov_apex_predator',
      'cov_final_hour'
    ],
    9: [
      'cov_judgment_day',
      'cov_shadow_ascendant',
      'cov_anti_magic_storm'
    ],
    10: [
      'cov_hexbreaker_apocalypse',
      'cov_void_hunter',
      'cov_divine_executioner',
      'cov_hexbreaker_armageddon'
    ]
  }
};