# Comprehensive Spell Data Audit & Fix Plan

## 🎯 Scope

You're right - we need to fix ALL spells across the entire codebase, not just the zealot path spells. This document outlines:
1. All spell data files that need auditing
2. Complete spell schema with ALL available properties
3. Common issues to fix
4. Systematic approach to fixing everything

---

## 📁 Spell Data Files to Audit

### Primary Spell Data Files
1. **`src/data/enhancedPathData.js`** - ✅ PARTIALLY FIXED (zealot path done)
2. **`src/data/additionalSpells.js`** - ⚠️ NEEDS FIXING (12+ issues found)
3. **`src/data/customSpellLibraryData.js`** - ⚠️ NEEDS FIXING (10+ issues found)
4. **`src/data/enhancedSpellLibrary.js`** - ⚠️ NEEDS REVIEW
5. **`src/data/enhancedBackgroundData.js`** - ⚠️ NEEDS REVIEW
6. **`src/data/classSpellTemplates.js`** - ⚠️ NEEDS REVIEW
7. **`src/data/generalSpellsData.js`** - ⚠️ NEEDS REVIEW
8. **`src/data/additionalEnhancedSpells.js`** - ⚠️ NEEDS REVIEW
9. **`src/data/advancedSpells.js`** - ⚠️ NEEDS REVIEW

---

## 📋 Complete Spell Schema

Here's the FULL spell structure with ALL available properties:

```javascript
{
  // ===== BASIC INFORMATION =====
  id: 'unique_spell_id',
  name: 'Spell Name',
  description: 'Detailed description of what the spell does and how it works',
  level: 1,                    // Spell level (1-9)
  school: 'evocation',         // Magic school (optional)
  spellType: 'ACTION',         // ACTION, REACTION, BONUS_ACTION, STATE, ZONE, TRAP
  source: 'class',             // 'class', 'background', 'monster', 'item'
  
  // ===== VISUAL & THEMATIC =====
  icon: 'spell_fire_fireball', // Icon identifier
  visualTheme: 'fire',         // Visual theme for effects
  tags: ['fire', 'damage', 'aoe'],
  
  // ===== EFFECT TYPES =====
  effectTypes: ['damage', 'debuff'],  // damage, healing, buff, debuff, control, utility, summoning, etc.
  damageTypes: ['fire'],              // REQUIRED for damage spells: fire, cold, lightning, radiant, necrotic, poison, acid, psychic, force, physical, slashing, piercing, bludgeoning, nature, void
  
  // ===== TARGETING CONFIGURATION =====
  targetingConfig: {
    targetingType: 'single',   // single, area, aoe, self, cone, line, chain
    range: 60,                 // Range in feet
    rangeType: 'ranged',       // ranged, melee, touch, self
    validTargets: ['enemy'],   // enemy, ally, self, any, object
    
    // For AOE spells
    aoeType: 'sphere',         // sphere, cone, line, cube, cylinder
    aoeShape: 'circle',        // circle, square, cone, line
    aoeSize: 20,               // Radius/size in feet
    aoeParameters: {
      radius: 20,
      width: 10,
      length: 30
    },
    
    // For chain spells
    maxTargets: 3,
    chainRange: 15,
    
    // Line of sight
    requiresLoS: true,
    
    // Targeting restrictions
    maxTargets: 1,
    excludeSelf: false
  },
  
  // ===== RESOURCE COSTS =====
  resourceCost: {
    mana: { baseAmount: 25, scalingAmount: 5 },
    health: { baseAmount: 0 },
    stamina: { baseAmount: 0 },
    focus: { baseAmount: 0 },
    actionPoints: 3
  },
  
  // ===== REAGENTS/COMPONENTS =====
  components: {
    verbal: true,
    somatic: true,
    material: true,
    materials: 'A pinch of sulfur and bat guano',
    consumed: false,
    cost: 50  // Gold cost if consumed
  },
  
  reagents: [
    {
      name: 'Sulfur',
      quantity: 1,
      consumed: true
    }
  ],
  
  // ===== CASTING & TIMING =====
  castingTime: {
    type: 'instant',           // instant, action, bonus_action, reaction, channeled, ritual
    value: 0,                  // Time value
    unit: 'seconds'            // seconds, minutes, hours
  },
  
  castTime: '1 action',        // Legacy format
  castTimeType: 'instant',
  castTimeValue: 0,
  
  // ===== DURATION =====
  durationConfig: {
    durationType: 'instant',   // instant, duration, concentration, permanent, until_dispelled
    durationValue: 0,
    durationUnit: 'rounds',    // rounds, minutes, hours, days
    concentration: false,
    dispellable: true
  },
  
  // ===== COOLDOWN =====
  cooldownConfig: {
    type: 'turn_based',        // turn_based, time_based, combat, rest, charges
    value: 3,
    unit: 'rounds',            // rounds, seconds, minutes
    charges: 1,
    recovery: 1,               // Charges recovered per rest
    restType: 'short'          // short, long
  },
  
  cooldownCategory: 'medium',  // short, medium, long
  cooldownValue: 20,
  cooldownUnit: 'seconds',
  
  // ===== DAMAGE CONFIGURATION =====
  damageConfig: {
    damageType: 'direct',      // direct, dot, splash
    elementType: 'fire',       // REQUIRED: matches damageTypes
    formula: '3d6 + 4',        // Dice formula
    scaling: 'intelligence',   // Stat that scales damage
    
    // DOT (Damage Over Time)
    hasDotEffect: true,
    dotFormula: '1d4',
    dotDuration: 3,
    dotTickType: 'round',      // round, second
    dotTickFrequency: 'start', // start, end
    
    // Saving Throw
    savingThrow: {
      enabled: true,
      attribute: 'dexterity',  // strength, dexterity, constitution, intelligence, spirit, charisma
      difficulty: 15,          // DC
      onSuccess: 'half_damage',
      onFailure: 'full_damage'
    },
    
    // Critical Hits
    criticalConfig: {
      enabled: true,
      critType: 'dice',        // dice, multiplier
      critMultiplier: 2,
      critDiceOnly: false,
      extraDice: '1d6',
      critEffects: ['burning']
    }
  },
  
  // ===== HEALING CONFIGURATION =====
  healingConfig: {
    healingType: 'direct',     // direct, hot (heal over time), area
    formula: '3d8 + spirit',
    scaling: 'spirit',
    
    // HOT (Heal Over Time)
    hasHotEffect: true,
    hotFormula: '1d8',
    hotDuration: 5,
    hotTickType: 'round',
    
    // Overheal
    allowOverheal: false,
    overhealAsShield: true,
    
    // Restrictions
    maxTargets: 4,
    excludeDead: true
  },
  
  // ===== BUFF CONFIGURATION =====
  buffConfig: {
    duration: 10,
    durationValue: 10,
    durationType: 'rounds',
    durationUnit: 'rounds',
    restType: 'short',
    canBeDispelled: true,
    concentrationRequired: false,
    stackingRule: 'replace',   // replace, stack, refresh
    maxStacks: 1,
    
    // Stat Modifiers - MUST USE 'name' PROPERTY
    statModifiers: [
      {
        name: 'strength',      // ✅ REQUIRED: strength, agility, constitution, intelligence, spirit, charisma
        stat: 'strength',      // Legacy support
        value: 2,
        magnitude: 2,          // ✅ REQUIRED
        magnitudeType: 'flat', // ✅ REQUIRED: flat, percentage
        isPercentage: false
      }
    ],
    
    // Status Effects - MUST BE OBJECTS WITH DESCRIPTIONS
    statusEffects: [
      {
        id: 'blessed',         // ✅ REQUIRED
        name: 'Blessed',       // ✅ REQUIRED
        description: 'Blessed with divine power, granting enhanced combat prowess' // ✅ REQUIRED
      }
    ],
    
    // Progressive buffs
    isProgressive: false,
    progressiveStages: [
      {
        threshold: 5,
        effects: { /* ... */ }
      }
    ],
    
    // Detailed buff effects
    buffs: [
      {
        name: 'Divine Blessing',
        description: 'Enhanced by divine power',
        duration: 10,
        effects: {
          attackBonus: 2,
          damageBonus: 5,
          resistances: ['necrotic'],
          immunities: ['fear']
        }
      }
    ]
  },
  
  // ===== DEBUFF CONFIGURATION =====
  debuffConfig: {
    duration: 5,
    durationValue: 5,
    durationType: 'rounds',
    durationUnit: 'rounds',
    canBeDispelled: true,
    stackingRule: 'stack',
    maxStacks: 3,
    
    // Stat Penalties - MUST USE 'name' or 'stat' PROPERTY
    statPenalties: [
      {
        name: 'agility',       // ✅ REQUIRED
        stat: 'agility',
        value: -2,
        amount: -2,
        magnitude: -2,
        magnitudeType: 'flat'
      }
    ],
    
    // Status Effects - MUST BE OBJECTS
    statusEffects: [
      {
        id: 'slowed',
        name: 'Slowed',
        description: 'Movement speed reduced by crystalline ice'
      }
    ],
    
    // Saving Throw
    savingThrowType: 'constitution',
    difficultyClass: 15,
    saveOutcome: 'negates',    // negates, half_duration, partial
    
    // Detailed debuff effects
    debuffs: [
      {
        name: 'Frost Slow',
        description: 'Slowed by ice',
        duration: 5,
        effects: {
          movementReduction: 50,
          attackPenalty: -2,
          conditions: ['slowed']
        }
      }
    ]
  },
  
  // ===== TRIGGER CONFIGURATION =====
  triggerConfig: {
    triggerType: 'on_hit',     // See triggerTypes.js for all options
    triggerChance: 30,         // Percentage chance
    triggerCondition: 'target_below_50_hp',
    cooldown: 10,              // Trigger cooldown
    maxProcs: 3,               // Max procs per duration
    procDuration: 60           // Duration window for max procs
  },
  
  // ===== PROC CONFIGURATION =====
  procConfig: {
    procChance: 20,
    procEffect: 'additional_damage',
    procValue: '1d6',
    procCooldown: 5
  },
  
  // ===== CONTROL EFFECTS =====
  controlConfig: {
    controlType: 'stun',       // stun, root, silence, fear, charm, sleep, polymorph
    duration: 3,
    savingThrow: 'spirit',
    difficulty: 14,
    breakOnDamage: true
  },
  
  // ===== SUMMONING =====
  summoningConfig: {
    summonType: 'creature',
    creatureId: 'fire_elemental',
    quantity: 1,
    duration: 60,
    controlType: 'full',       // full, limited, independent
    inheritStats: false
  },
  
  // ===== TRANSFORMATION =====
  transformConfig: {
    transformType: 'polymorph',
    targetForm: 'sheep',
    duration: 30,
    breakOnDamage: true,
    retainMentalStats: false
  },
  
  // ===== UTILITY =====
  utilityConfig: {
    utilityType: 'teleport',   // teleport, invisibility, detection, dispel, etc.
    range: 500,
    duration: 0,
    effects: {
      /* utility-specific effects */
    }
  },
  
  // ===== ZONE/TRAP EFFECTS =====
  zoneConfig: {
    zoneType: 'persistent',
    shape: 'circle',
    radius: 20,
    duration: 60,
    tickRate: 6,               // Seconds between ticks
    effects: {
      /* zone effects */
    }
  },
  
  trapConfig: {
    triggerType: 'proximity',
    triggerRadius: 5,
    duration: 300,
    stealthDC: 15,
    disarmDC: 18
  },
  
  // ===== CHANNELING =====
  channelingConfig: {
    channelDuration: 10,
    tickRate: 1,
    interruptible: true,
    movementAllowed: false,
    effectPerTick: {
      /* effects */
    }
  },
  
  // ===== RESOLUTION MECHANICS =====
  resolution: 'DICE',          // DICE, CARD, COIN
  
  rollableTable: {
    /* for random effects */
  },
  
  cardConfig: {
    /* for card-based resolution */
  },
  
  coinConfig: {
    /* for coin flip resolution */
  },
  
  // ===== METADATA =====
  dateCreated: new Date().toISOString(),
  lastModified: new Date().toISOString(),
  categoryIds: [],
  
  // ===== FLAVOR & DESCRIPTION =====
  flavorText: 'Ancient words of power echo through the air...',
  castingDescription: 'You weave intricate gestures while chanting...',
  effectDescription: 'Flames erupt from your hands...',
  impactDescription: 'The target is engulfed in searing fire...'
}
```

---

## 🔍 Common Issues to Fix

### 1. Missing Damage Types
**Issue:** Spells with damage but no `damageTypes` array
**Fix:** Add `damageTypes: ['appropriate_type']`

### 2. Incomplete Stat Modifiers
**Issue:** Using `{ stat: 'strength', value: 2 }` without `name` and `magnitude`
**Fix:** 
```javascript
{
  name: 'strength',
  stat: 'strength',
  value: 2,
  magnitude: 2,
  magnitudeType: 'flat',
  isPercentage: false
}
```

### 3. String-Based Status Effects
**Issue:** `statusEffects: ['blessed', 'empowered']`
**Fix:**
```javascript
statusEffects: [
  {
    id: 'blessed',
    name: 'Blessed',
    description: 'Specific description of what this does'
  }
]
```

### 4. Generic Descriptions
**Issue:** Descriptions that don't match what the spell actually does
**Fix:** Rewrite to accurately describe mechanics, targeting, costs, and effects

### 5. Missing/Incorrect Targeting
**Issue:** Range doesn't match spell type, or missing targeting config
**Fix:** Add complete `targetingConfig` with proper range and targeting type

### 6. Missing Resource Costs
**Issue:** No `resourceCost` or incomplete costs
**Fix:** Add proper resource costs (mana, stamina, health, focus, AP)

### 7. Missing Components/Reagents
**Issue:** No component requirements specified
**Fix:** Add `components` and/or `reagents` if thematically appropriate

### 8. No Trigger Configuration
**Issue:** Spells that should have triggers (procs, reactions) but don't
**Fix:** Add `triggerConfig` for reactive spells

---

## 🚀 Systematic Fix Approach

### Phase 1: Audit (Find All Issues)
Run through each file and identify:
- [ ] Missing damage types
- [ ] Incomplete stat modifiers
- [ ] String-based status effects
- [ ] Generic/inaccurate descriptions
- [ ] Missing targeting configs
- [ ] Missing resource costs
- [ ] Missing components/reagents
- [ ] Missing triggers where appropriate

### Phase 2: Fix (Apply Corrections)
For each file:
1. Fix stat modifiers (add `name`, `magnitude`, `magnitudeType`)
2. Fix status effects (convert to objects with descriptions)
3. Add missing damage types
4. Update descriptions to match mechanics
5. Add/fix targeting configurations
6. Add/fix resource costs
7. Add components/reagents where appropriate
8. Add triggers where appropriate

### Phase 3: Validate
- [ ] Run spell validator
- [ ] Test in UI
- [ ] Verify spell cards display correctly
- [ ] Check rules section display

---

## 📊 Priority Order

1. **HIGH PRIORITY** - Fixes that affect display:
   - Stat modifiers (shows warnings)
   - Status effects (shows warnings)
   - Damage types (missing badges)

2. **MEDIUM PRIORITY** - Fixes that improve accuracy:
   - Descriptions
   - Targeting configs
   - Resource costs

3. **LOW PRIORITY** - Enhancements:
   - Components/reagents
   - Triggers
   - Advanced configurations

---

## ✅ Next Steps

Would you like me to:
1. **Create an automated fix script** that processes all files?
2. **Fix files one by one** with your review?
3. **Generate a detailed issue report** for each file first?
4. **Focus on specific spell types** (damage, healing, buffs, etc.)?

Let me know your preference and I'll proceed systematically!

