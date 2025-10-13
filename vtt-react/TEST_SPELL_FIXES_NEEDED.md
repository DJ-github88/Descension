# Test Spell Fixes Needed

## Critical Issues Found

### 1. Missing V/S/M Components ❌
**Issue:** None of the 32 test spells have verbal, somatic, or material component flags.

**Fix Required:**
```javascript
resourceCost: {
  components: ['verbal', 'somatic', 'material'],  // Array of component types
  materialComponents: 'A tiny ball of bat guano and sulfur',  // Description for material
  verbalText: 'Ignis Maximus!',  // Optional custom verbal text
  somaticText: 'Complex hand gestures',  // Optional custom somatic text
  // ... other resource costs
}
```

**Examples Needed:**
- Spells with V, S, M (most damage spells)
- Spells with V, S only (utility spells)
- Spells with S only (subtle spells)
- Spells with M only (ritual spells)

---

### 2. Missing Trigger Configuration ❌
**Issue:** REACTION and TRAP spells lack proper `triggerConfig`.

**Fix Required:**
```javascript
triggerConfig: {
  global: {
    logicType: 'OR',
    compoundTriggers: [
      {
        id: 'on_damage_taken',
        name: 'When you take damage',
        parameters: {
          damageThreshold: 10,
          damageTypes: ['any'],
          triggerChance: 100
        }
      }
    ]
  },
  triggerRole: {
    mode: 'REACTIVE',
    activationDelay: 0,
    requiresLOS: true
  }
}
```

**Spells Needing Fixes:**
- TEST: Counterspell (REACTION)
- TEST: Explosive Rune (TRAP)

---

### 3. Incomplete Stat References ❌
**Issue:** "Dominate Mind" says "-4 stat" instead of specific stat.

**Current:**
```javascript
description: 'Reduces target stat by -4 stat'
```

**Fix:**
```javascript
debuffConfig: {
  debuffType: 'stat_reduction',
  statReductions: {
    charisma: -4,
    wisdom: -2
  },
  duration: 10,
  durationType: 'rounds'
}
```

---

### 4. Capitalization Issues ❌
**Issue:** Condition names are lowercase ("charmed", "haste").

**Current:**
```javascript
conditions: ['charmed', 'haste']
```

**Fix:**
```javascript
conditions: ['Charmed', 'Haste']
```

---

### 5. Confusing Component Text ❌
**Issue:** "instant damage - roll dice (???) then draw 5 cards"

**Current:**
```javascript
description: 'instant damage - roll dice (???) then draw 5 cards because it is a card based spell'
```

**Fix:**
```javascript
description: 'Draw 5 cards from a mystical deck. Deal damage equal to the total card value plus bonuses for face cards.'
```

---

### 6. Summoning Lacks Creature Tags ❌
**Issue:** Summoning spells don't specify what creature to summon.

**Current:**
```javascript
summoningConfig: {
  summonType: 'creature',
  duration: 60
}
```

**Fix:**
```javascript
summoningConfig: {
  summonType: 'creature',
  creatureType: 'elemental',
  creatureName: 'Fire Elemental',
  creatureLevel: 5,
  creatureStats: {
    health: 50,
    armor: 10,
    damage: '2d6+3'
  },
  duration: 60,
  durationType: 'seconds',
  maxSummons: 1,
  controlType: 'full'
}
```

---

### 7. Resource Variety ❌
**Issue:** All spells use mana. Need to showcase other resource types.

**Resources to Use:**
- Mana (primary caster resource)
- Health (blood magic, sacrifice)
- Stamina (physical exertion)
- Focus (concentration, precision)
- Class Resources:
  - combo_points (rogue)
  - soul_shards (warlock)
  - holy_power (paladin)
  - arcane_charges (mage)
  - chi (monk)
  - runes (death knight)

**Example:**
```javascript
resourceCost: {
  mana: 30,
  health: 15,
  stamina: 10,
  classResource: {
    type: 'soul_shards',
    cost: 3
  },
  actionPoints: 2
}
```

---

### 8. Spacing Issues ❌
**Issue:** Extra space before "30 ft" and " self".

**Current:**
```javascript
rangeDistance:  30  // Extra spaces
targetingType: ' self'  // Leading space
```

**Fix:**
```javascript
rangeDistance: 30
targetingType: 'self'
```

---

### 9. Area Effect Issues ❌
**Issue:** "Area Effect - any" is too vague.

**Current:**
```javascript
targetingConfig: {
  targetingType: 'area',
  areaShape: 'any'
}
```

**Fix:**
```javascript
targetingConfig: {
  targetingType: 'area',
  areaShape: 'sphere',  // or 'cone', 'line', 'cube', 'cylinder'
  areaSize: 20
}
```

---

### 10. Progressive Might Issues ❌
**Issue:** Has " self" with space, duplicate self tag, "haste" lowercase.

**Current:**
```javascript
targetingType: ' self',
conditions: ['haste', 'self']
```

**Fix:**
```javascript
targetingType: 'self',
conditions: ['Haste']
```

---

### 11. Resurrection Incomplete ❌
**Issue:** Missing effect details in restoration spell.

**Current:**
```javascript
restorationConfig: {
  restorationType: 'resurrection'
}
```

**Fix:**
```javascript
restorationConfig: {
  restorationType: 'resurrection',
  targetState: 'dead',
  restoredHealth: '50%',
  restoredMana: '25%',
  removesConditions: ['Dead', 'Dying', 'Unconscious'],
  castingTime: 10,
  castingTimeUnit: 'seconds',
  requiresBody: true,
  timeLimit: 600,
  timeLimitUnit: 'seconds',
  materialCost: 500,
  materialComponents: 'Diamond worth 500gp (consumed)'
}
```

---

### 12. Targeting Variety ❌
**Issue:** Not enough experimentation with targeting restrictions.

**Need to Add:**
- Target restrictions (allies only, enemies only, self only)
- Target conditions (below 50% health, has buff, etc.)
- Target type restrictions (humanoid, beast, undead, etc.)
- Line of sight requirements
- Friendly fire settings

**Example:**
```javascript
targetingConfig: {
  targetingType: 'smart',
  smartTargeting: {
    priority: 'lowest_health',
    condition: 'below_50_percent',
    targetType: 'ally',
    excludeSelf: false
  },
  rangeDistance: 40,
  lineOfSightRequired: false,
  friendlyFire: false
}
```

---

## Systematic Fix Plan

### Phase 1: Add Components to All Spells
- Resolution tests (3 spells) - V, S, M with thematic materials
- Effect type tests (10 spells) - Varied component combinations
- Spell type tests (6 spells) - Components matching spell type
- Targeting tests (7 spells) - Standard components
- Advanced mechanics (7 spells) - Complex component requirements

### Phase 2: Fix Trigger Configurations
- Counterspell - Add "when enemy casts spell" trigger
- Explosive Rune - Add "when enemy enters area" trigger

### Phase 3: Fix Stat References and Capitalization
- Dominate Mind - Specify Charisma reduction
- All conditions - Capitalize (Charmed, Haste, Stunned, etc.)

### Phase 4: Fix Resource Costs
- Distribute across mana, health, stamina, focus, class resources
- Ensure variety in resource combinations

### Phase 5: Fix Summoning Configuration
- Add creature specifications
- Add creature stats
- Add control type

### Phase 6: Fix Spacing and Formatting
- Remove all extra spaces
- Fix area shape specifications
- Clean up descriptions

### Phase 7: Complete Missing Configurations
- Resurrection - Full restoration config
- Progressive Might - Fix targeting and conditions
- All spells - Ensure complete configurations

---

## Priority Order

1. **CRITICAL:** Add components to all spells (most visible issue)
2. **CRITICAL:** Fix trigger configs for REACTION/TRAP spells
3. **HIGH:** Fix stat references and capitalization
4. **HIGH:** Add summoning creature specifications
5. **MEDIUM:** Diversify resource costs
6. **MEDIUM:** Fix spacing and area shapes
7. **LOW:** Add advanced targeting restrictions

---

**Status:** Ready to implement fixes
**Next Step:** Systematically update testSpells.js with all corrections

