# Full-Featured Spell Examples

## 🎯 Overview

These examples show what spells SHOULD look like when using the full capabilities of the spell wizard. Use these as templates when fixing existing spells.

---

## Example 1: Damage Spell with Full Features

### Infernal Eruption
**Type:** Damage + Debuff
**Uses:** DOT, Saving Throw, Critical Config, Scaling, Components, Triggers

```javascript
{
  // ===== BASIC INFO =====
  id: 'infernal_eruption',
  name: 'Infernal Eruption',
  description: 'You channel the fury of the Nine Hells, causing the ground beneath your enemies to erupt in a column of hellfire. Creatures in the area must make a Dexterity saving throw or take massive fire damage and be set ablaze.',
  level: 3,
  icon: 'spell_fire_sealoffire',
  
  // ===== TYPE & TAGS =====
  spellType: 'ACTION',
  effectTypes: ['damage', 'debuff'],
  damageTypes: ['fire'],
  tags: ['fire', 'aoe', 'damage', 'dot', 'infernal'],
  visualTheme: 'fire',
  
  // ===== FLAVOR =====
  flavorText: 'The signature spell of the Crimson Warlocks, feared for its devastating power',
  castingDescription: 'You slam your staff into the ground while chanting in Infernal, causing cracks to spread across the earth',
  effectDescription: 'Hellfire erupts from the cracks in a towering column of flame',
  impactDescription: 'Enemies are engulfed in searing flames, their armor glowing red-hot',
  
  // ===== DAMAGE CONFIG =====
  damageConfig: {
    damageType: 'direct',
    elementType: 'fire',
    formula: '6d6 + intelligence',
    scaling: 'intelligence',
    
    // DOT Effect
    hasDotEffect: true,
    dotFormula: '2d4',
    dotDuration: 3,
    dotTickType: 'round',
    dotTickFrequency: 'start',
    
    // Saving Throw
    savingThrow: {
      enabled: true,
      attribute: 'dexterity',
      difficulty: 15,
      onSuccess: 'half_damage',
      onFailure: 'full_damage_and_dot'
    },
    
    // Critical Configuration
    criticalConfig: {
      enabled: true,
      critType: 'dice',
      critMultiplier: 2,
      critDiceOnly: false,
      extraDice: '2d6',
      explodingDice: true,
      explodingDiceType: 'reroll_add',
      critEffects: ['burning', 'fear']
    }
  },
  
  // ===== DEBUFF CONFIG =====
  debuffConfig: {
    duration: 3,
    durationValue: 3,
    durationType: 'rounds',
    durationUnit: 'rounds',
    canBeDispelled: true,
    stackingRule: 'refresh',
    
    statusEffects: [
      {
        id: 'burning',
        name: 'Burning',
        description: 'Wreathed in hellfire, taking fire damage each round and suffering disadvantage on attack rolls'
      },
      {
        id: 'scorched',
        name: 'Scorched',
        description: 'Armor is superheated, reducing AC by 2 and causing discomfort'
      }
    ],
    
    debuffs: [
      {
        name: 'Hellfire Burn',
        description: 'Continuous burning from hellfire',
        duration: 3,
        effects: {
          conditions: ['burning'],
          attackPenalty: -2,
          armorPenalty: -2
        }
      }
    ]
  },
  
  // ===== TARGETING =====
  targetingConfig: {
    targetingType: 'aoe',
    aoeType: 'cylinder',
    aoeShape: 'circle',
    aoeSize: 15,
    aoeParameters: {
      radius: 15,
      height: 30
    },
    range: 120,
    validTargets: ['enemy', 'ally', 'object'],
    requiresLoS: true,
    excludeSelf: true
  },
  
  // ===== RESOURCES =====
  resourceCost: {
    mana: { baseAmount: 45, scalingAmount: 10 },
    actionPoints: 4
  },
  
  components: {
    verbal: true,
    somatic: true,
    material: true,
    materials: 'A vial of sulfur and a drop of devil\'s blood',
    consumed: true,
    cost: 25
  },
  
  // ===== DURATION & COOLDOWN =====
  durationConfig: {
    durationType: 'instant',
    durationValue: 0
  },
  
  cooldownConfig: {
    type: 'turn_based',
    value: 4,
    unit: 'rounds'
  },
  
  // ===== METADATA =====
  dateCreated: new Date().toISOString(),
  lastModified: new Date().toISOString(),
  categoryIds: ['fire', 'damage', 'aoe']
}
```

---

## Example 2: Healing Spell with HOT and Overheal

### Radiant Restoration
**Type:** Healing + Buff
**Uses:** HOT, Overheal Shield, Scaling, Components

```javascript
{
  id: 'radiant_restoration',
  name: 'Radiant Restoration',
  description: 'You channel divine radiance to mend wounds and fortify your allies. The healing energy continues to work over time, and any excess healing forms a protective barrier.',
  level: 2,
  icon: 'spell_holy_flashheal',
  
  spellType: 'ACTION',
  effectTypes: ['healing', 'buff'],
  damageTypes: ['radiant'],
  tags: ['healing', 'hot', 'divine', 'protection'],
  visualTheme: 'holy',
  
  flavorText: 'The favored prayer of battlefield clerics',
  
  // ===== HEALING CONFIG =====
  healingConfig: {
    healingType: 'direct',
    formula: '4d8 + spirit',
    scaling: 'spirit',
    
    // HOT Effect
    hasHotEffect: true,
    hotFormula: '1d8 + spirit',
    hotDuration: 5,
    hotTickType: 'round',
    hotTickFrequency: 'start',
    
    // Overheal
    allowOverheal: true,
    overhealAsShield: true,
    overhealPercentage: 50,
    
    maxTargets: 3,
    excludeDead: true
  },
  
  // ===== BUFF CONFIG =====
  buffConfig: {
    duration: 5,
    durationValue: 5,
    durationType: 'rounds',
    durationUnit: 'rounds',
    
    statModifiers: [
      {
        name: 'constitution',
        stat: 'constitution',
        value: 2,
        magnitude: 2,
        magnitudeType: 'flat',
        isPercentage: false
      }
    ],
    
    statusEffects: [
      {
        id: 'radiant_blessing',
        name: 'Radiant Blessing',
        description: 'Blessed with divine radiance, granting increased vitality and resistance to necrotic damage'
      }
    ],
    
    buffs: [
      {
        name: 'Divine Fortification',
        description: 'Protected by radiant energy',
        duration: 5,
        effects: {
          resistances: ['necrotic'],
          healingBonus: 1.2,
          temporaryHitPoints: 'overheal'
        }
      }
    ]
  },
  
  targetingConfig: {
    targetingType: 'multi',
    maxTargets: 3,
    range: 60,
    validTargets: ['ally', 'self'],
    requiresLoS: true
  },
  
  resourceCost: {
    mana: { baseAmount: 35 },
    actionPoints: 3
  },
  
  components: {
    verbal: true,
    somatic: true,
    material: true,
    materials: 'A holy symbol blessed by a high priest',
    consumed: false
  },
  
  cooldownConfig: {
    type: 'turn_based',
    value: 3
  }
}
```

---

## Example 3: Control Spell with Saving Throw

### Petrifying Gaze
**Type:** Control + Debuff
**Uses:** Control effects, Progressive debuff, Saving throws

```javascript
{
  id: 'petrifying_gaze',
  name: 'Petrifying Gaze',
  description: 'Your eyes glow with eldritch power as you lock gazes with your target. They must resist or begin turning to stone, becoming progressively slower until fully petrified.',
  level: 4,
  icon: 'spell_shadow_soulleech_3',
  
  spellType: 'ACTION',
  effectTypes: ['control', 'debuff'],
  damageTypes: [],
  tags: ['control', 'petrification', 'progressive', 'eldritch'],
  visualTheme: 'shadow',
  
  // ===== CONTROL CONFIG =====
  controlConfig: {
    controlType: 'petrify',
    duration: 3,
    savingThrow: {
      enabled: true,
      attribute: 'constitution',
      difficulty: 16,
      repeatSave: true,
      saveInterval: 1,
      saveIntervalUnit: 'rounds'
    },
    breakOnDamage: false,
    diminishingReturns: true
  },
  
  // ===== DEBUFF CONFIG =====
  debuffConfig: {
    duration: 3,
    durationValue: 3,
    durationType: 'rounds',
    durationUnit: 'rounds',
    
    // Progressive Debuff
    isProgressive: true,
    progressiveStages: [
      {
        threshold: 1,
        name: 'Slowed',
        effects: {
          movementReduction: 50,
          attackPenalty: -2
        }
      },
      {
        threshold: 2,
        name: 'Restrained',
        effects: {
          movementReduction: 100,
          attackPenalty: -4,
          acPenalty: -2
        }
      },
      {
        threshold: 3,
        name: 'Petrified',
        effects: {
          incapacitated: true,
          resistances: ['all'],
          vulnerabilities: ['bludgeoning']
        }
      }
    ],
    
    statusEffects: [
      {
        id: 'petrifying',
        name: 'Petrifying',
        description: 'Slowly turning to stone, movement and actions becoming increasingly difficult'
      }
    ],
    
    savingThrowType: 'constitution',
    difficultyClass: 16,
    saveOutcome: 'negates'
  },
  
  targetingConfig: {
    targetingType: 'single',
    range: 60,
    validTargets: ['enemy'],
    requiresLoS: true,
    requiresEyeContact: true
  },
  
  resourceCost: {
    mana: { baseAmount: 50 },
    actionPoints: 4
  },
  
  cooldownConfig: {
    type: 'combat',
    value: 1
  }
}
```

---

## Example 4: Reaction Spell with Trigger

### Arcane Counterstrike
**Type:** Reaction (Damage)
**Uses:** Trigger system, Reaction spell type

```javascript
{
  id: 'arcane_counterstrike',
  name: 'Arcane Counterstrike',
  description: 'When you are hit by a spell, you can use your reaction to absorb some of the magical energy and redirect it back at the caster as a bolt of pure arcane force.',
  level: 2,
  icon: 'spell_arcane_arcane04',
  
  spellType: 'REACTION',
  effectTypes: ['damage'],
  damageTypes: ['force'],
  tags: ['reaction', 'counterspell', 'arcane', 'defensive'],
  visualTheme: 'arcane',
  
  // ===== TRIGGER CONFIG =====
  triggerConfig: {
    triggerType: 'on_spell_hit',
    triggerChance: 100,
    triggerCondition: 'hit_by_spell',
    cooldown: 0,
    maxProcs: 1,
    procDuration: 6
  },
  
  // ===== DAMAGE CONFIG =====
  damageConfig: {
    damageType: 'direct',
    elementType: 'force',
    formula: '2d10 + intelligence',
    scaling: 'intelligence',
    
    // Damage scales with incoming spell level
    scalingBonus: {
      type: 'spell_level',
      formula: '+1d10 per spell level above 1st'
    }
  },
  
  targetingConfig: {
    targetingType: 'single',
    range: 60,
    validTargets: ['attacker'],
    autoTarget: true
  },
  
  resourceCost: {
    mana: { baseAmount: 20 },
    actionPoints: 0,  // Reaction
    reaction: true
  },
  
  cooldownConfig: {
    type: 'turn_based',
    value: 2
  }
}
```

---

## Example 5: Wild Magic with Rollable Table

### Chaos Bolt
**Type:** Damage with Random Effects
**Uses:** Rollable table, Card mechanics, Variable outcomes

```javascript
{
  id: 'chaos_bolt',
  name: 'Chaos Bolt',
  description: 'You hurl a bolt of chaotic energy at a creature. The bolt\'s damage type and additional effects are determined by the whims of chaos itself.',
  level: 1,
  icon: 'spell_arcane_prismaticcloak',
  
  spellType: 'ACTION',
  effectTypes: ['damage'],
  damageTypes: ['force', 'fire', 'cold', 'lightning', 'acid', 'poison', 'psychic', 'thunder'],
  tags: ['chaos', 'wild_magic', 'variable', 'unpredictable'],
  visualTheme: 'arcane',
  
  resolution: 'DICE',
  
  // ===== DAMAGE CONFIG =====
  damageConfig: {
    damageType: 'direct',
    elementType: 'variable',  // Determined by rollable table
    formula: '2d8 + charisma',
    scaling: 'charisma'
  },
  
  // ===== ROLLABLE TABLE =====
  rollableTable: {
    enabled: true,
    name: 'Chaos Effects',
    description: 'Roll to determine the damage type and additional effect',
    resolutionType: 'DICE',
    resolutionConfig: {
      diceType: 'd8',
      rollCount: 2
    },
    entries: [
      {
        id: 'fire',
        range: { min: 1, max: 1 },
        customName: 'Chaotic Fire',
        effect: 'Fire damage. Target catches fire for 1d4 damage next round.',
        modifiesBaseSpell: true,
        effectModifications: {
          damageType: 'fire',
          additionalEffect: 'burning'
        }
      },
      {
        id: 'cold',
        range: { min: 2, max: 2 },
        customName: 'Chaotic Ice',
        effect: 'Cold damage. Target\'s speed reduced by 10 feet.',
        modifiesBaseSpell: true,
        effectModifications: {
          damageType: 'cold',
          additionalEffect: 'slowed'
        }
      },
      {
        id: 'lightning',
        range: { min: 3, max: 3 },
        customName: 'Chaotic Lightning',
        effect: 'Lightning damage. Chains to nearest enemy within 15 feet.',
        modifiesBaseSpell: true,
        effectModifications: {
          damageType: 'lightning',
          additionalEffect: 'chain'
        }
      },
      {
        id: 'acid',
        range: { min: 4, max: 4 },
        customName: 'Chaotic Acid',
        effect: 'Acid damage. Target\'s AC reduced by 1 for 1 round.',
        modifiesBaseSpell: true,
        effectModifications: {
          damageType: 'acid',
          additionalEffect: 'corroded'
        }
      },
      {
        id: 'poison',
        range: { min: 5, max: 5 },
        customName: 'Chaotic Poison',
        effect: 'Poison damage. Target is poisoned for 1 round.',
        modifiesBaseSpell: true,
        effectModifications: {
          damageType: 'poison',
          additionalEffect: 'poisoned'
        }
      },
      {
        id: 'psychic',
        range: { min: 6, max: 6 },
        customName: 'Chaotic Mind',
        effect: 'Psychic damage. Target is confused for 1 round.',
        modifiesBaseSpell: true,
        effectModifications: {
          damageType: 'psychic',
          additionalEffect: 'confused'
        }
      },
      {
        id: 'thunder',
        range: { min: 7, max: 7 },
        customName: 'Chaotic Thunder',
        effect: 'Thunder damage. Target is deafened for 1 round.',
        modifiesBaseSpell: true,
        effectModifications: {
          damageType: 'thunder',
          additionalEffect: 'deafened'
        }
      },
      {
        id: 'force',
        range: { min: 8, max: 8 },
        customName: 'Chaotic Force',
        effect: 'Force damage. Target is pushed 10 feet away.',
        modifiesBaseSpell: true,
        effectModifications: {
          damageType: 'force',
          additionalEffect: 'pushed'
        }
      }
    ]
  },
  
  targetingConfig: {
    targetingType: 'single',
    range: 120,
    validTargets: ['enemy']
  },
  
  resourceCost: {
    mana: { baseAmount: 15 },
    actionPoints: 2
  }
}
```

---

## 📋 Key Takeaways

These examples show:
1. ✅ Complete spell configurations
2. ✅ Use of advanced features
3. ✅ Proper data structures
4. ✅ Thematic and mechanical depth
5. ✅ Clear descriptions
6. ✅ Full wizard capability usage

Use these as templates when fixing existing spells!

