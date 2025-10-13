# Class Spell Generator Fixes

## 🎯 Overview

Fixed the auto-generated class spells (81 total - 9 per class for 27 classes) to have proper formatting, better names, complete effect configurations, and correct damage types.

---

## 🐛 Issues Fixed

### 1. **Spell Naming Issues**
**Before:**
- "Fire Mastery Strike"
- "Fire Mastery Mastery" ❌ (weird repetitive name)
- "Fire Mastery Expertise" ❌ (weird name)

**After:**
- **Direct Damage:** "Fire Bolt" / "Fire Strike" / "Fire Blast"
- **AOE Damage:** "Fire Storm" / "Fire Nova" / "Fire Wave"
- **DOT Damage:** "Fire Curse" / "Fire Blight" / "Fire Affliction"
- **Channeled:** "Fire Beam" / "Fire Stream" / "Fire Torrent"
- **Control:** "Fire Bind" / "Fire Snare" / "Fire Root"
- **Movement:** "Fire Dash" / "Fire Leap" / "Fire Blink"

**Fix:** Created `generateSpellName()` function that uses archetype-based templates to generate thematic spell names.

---

### 2. **Tag Formatting Issues**
**Before:**
```javascript
tags: ['pyrofiend', 'fire_mastery']  // Underscore in tag ❌
```

**After:**
```javascript
tags: ['pyrofiend', 'fire mastery']  // Clean, readable tag ✅
```

**Fix:** Added `.replace(/_/g, ' ')` to remove underscores from specialization tags.

---

### 3. **Missing Effect Configurations**

#### Control Effects
**Before:**
```javascript
utility_control: {
  effectTypes: ['utility'],
  utilityConfig: {
    utilityType: 'control',
    effects: ['stun', 'root', 'silence']  // No actual configuration ❌
  }
}
```

**After:**
```javascript
utility_control: {
  effectTypes: ['control', 'debuff'],
  controlConfig: {
    controlType: 'root',
    duration: 3,
    durationType: 'rounds',
    effects: ['immobilized', 'cannot_move'],
    savingThrow: {
      enabled: true,
      attribute: 'strength',
      difficulty: 14,
      onSuccess: 'half_duration',
      onFailure: 'full_duration'
    }
  },
  durationConfig: {
    type: 'duration',
    value: 3,
    unit: 'rounds'
  }
}
```

#### Movement Effects
**Before:**
```javascript
utility_movement: {
  effectTypes: ['utility'],
  utilityConfig: {
    utilityType: 'movement',
    effects: ['teleport', 'dash', 'phase']  // No actual configuration ❌
  }
}
```

**After:**
```javascript
utility_movement: {
  effectTypes: ['utility', 'movement'],
  movementConfig: {
    movementType: 'teleport',
    distance: 30,
    requiresLoS: true,
    effects: ['instant_movement', 'no_opportunity_attacks']
  },
  durationConfig: {
    type: 'instant',
    value: 0,
    unit: 'seconds'
  }
}
```

---

### 4. **Missing Critical Hit Configurations**

**Before:**
```javascript
damageConfig: {
  damageType: 'direct',
  formula: '2d8 + intelligence',
  hasDotEffect: false
  // No critical config ❌
}
```

**After:**
```javascript
damageConfig: {
  damageType: 'direct',
  formula: '2d8 + 4',
  hasDotEffect: false,
  savingThrow: {
    enabled: false
  },
  criticalConfig: {
    enabled: true,
    critType: 'dice',
    critMultiplier: 2,
    critDiceOnly: false,
    extraDice: '1d6',
    explodingDice: false
  }
}
```

---

### 5. **Missing Saving Throws for AOE Spells**

**Before:**
```javascript
damage_aoe: {
  damageConfig: {
    formula: '1d10 + intelligence / 2'
    // No saving throw ❌
  }
}
```

**After:**
```javascript
damage_aoe: {
  damageConfig: {
    formula: '3d6 + 3',
    savingThrow: {
      enabled: true,
      attribute: 'agility',
      difficulty: 14,
      onSuccess: 'half_damage',
      onFailure: 'full_damage'
    },
    criticalConfig: {
      enabled: true,
      critType: 'dice',
      critMultiplier: 2,
      critDiceOnly: false,
      extraDice: '1d4'
    }
  }
}
```

---

### 6. **Incorrect Damage Types**

**Before:**
```javascript
corruption_stages: 'necrotic'  // Wrong damage type ❌
```

**After:**
```javascript
corruption_stages: 'shadow'  // Correct damage type ✅
```

**Fix:** Updated `getElementTypeForSpecialization()` to return 'shadow' for corruption-based specializations.

---

### 7. **Missing Duration Configurations**

**Before:**
```javascript
damage_direct: {
  damageConfig: { ... },
  cooldownConfig: { ... }
  // No durationConfig ❌
}
```

**After:**
```javascript
damage_direct: {
  damageConfig: { ... },
  cooldownConfig: { ... },
  durationConfig: {
    type: 'instant',
    value: 0,
    unit: 'seconds'
  }
}
```

---

### 8. **Incomplete DOT/HOT Configurations**

**Before:**
```javascript
damageConfig: {
  hasDotEffect: true,
  dotConfig: {
    duration: 12,
    tickFormula: '1d4 + 1',
    tickFrequency: 'start'
  }
}
```

**After:**
```javascript
damageConfig: {
  hasDotEffect: true,
  dotFormula: '1d4 + 2',
  dotDuration: 12,
  dotTickType: 'round',
  dotApplication: 'start',
  criticalConfig: {
    enabled: true,
    critType: 'dice',
    critMultiplier: 2,
    critDiceOnly: false
  }
}
```

---

### 9. **Incorrect Targeting Display**

**Before:**
```javascript
// "Fire Wave" spell showing as "ACTION - Touch" ❌
damage_aoe: {
  targetingConfig: {
    targetingType: 'aoe',
    aoeType: 'sphere',
    aoeSize: 15,
    range: 60
  }
}
// But spell card shows "Touch" instead of "60ft AOE (15ft sphere)"
```

**After:**
```javascript
// Spell card now correctly shows "60ft AOE (15ft sphere)" ✅
damage_aoe: {
  targetingConfig: {
    targetingType: 'aoe',
    aoeType: 'sphere',
    aoeSize: 15,
    range: 60,
    validTargets: ['enemy']
  }
}
```

**Fix:** Ensured all archetypes have proper `targetingConfig` with correct `targetingType`, `aoeType`, `aoeSize`, and `range`.

---

### 10. **Channeled Spells Showing as ACTION**

**Before:**
```javascript
// Channeled beam spell showing as "ACTION" ❌
spellType: 'ACTION'
```

**After:**
```javascript
// Now correctly shows "CHANNELED" ✅
damage_channeled: {
  spellType: 'CHANNELED',
  damageConfig: {
    damageType: 'channeled',
    channelDuration: 4,
    ticksPerRound: 2,
    tickFormula: '1d6 + 2',
    interruptible: true
  },
  targetingConfig: {
    targetingType: 'cone',
    aoeType: 'cone',
    aoeSize: 30,
    range: 30
  }
}
```

**Fix:** Added `damage_channeled` archetype with proper `spellType: 'CHANNELED'` and channeling configuration.

---

### 11. **Duplicate "Self" Tags in Header**

**Before:**
```javascript
tags: ['pyrofiend', 'self', 'self']  // Duplicate "self" ❌
```

**After:**
```javascript
tags: ['pyrofiend', 'fire mastery']  // No duplicates ✅
```

**Fix:** Added deduplication logic: `spell.tags = [...new Set(spell.tags.map(tag => tag.toLowerCase()))]`

---

### 12. **Lack of Spell Variety**

**Before:**
```javascript
// All 3 spells per specialization were:
// - damage_direct, damage_aoe, utility_control (boring, no variety) ❌
```

**After:**
```javascript
// Damage specializations: damage_direct, damage_aoe, damage_dot ✅
// Healing specializations: healing_direct, healing_hot, buff_ally ✅
// Utility specializations: buff_self, utility_control, utility_movement ✅
```

**Fix:** Updated spell generation to use varied archetypes including DOT, HOT, channeled, etc.

---

## 📊 Spell Name Templates

### Damage Spells
- **Direct:** Bolt, Strike, Blast, Shot, Lance
- **AOE:** Storm, Nova, Eruption, Wave, Barrage
- **DOT:** Curse, Blight, Plague, Corruption, Affliction
- **Channeled:** Beam, Stream, Torrent, Breath, Channel

### Healing Spells
- **Direct:** Mend, Restore, Heal, Cure, Renewal
- **AOE:** Radiance, Aura, Circle, Blessing, Sanctuary
- **HOT:** Regeneration, Rejuvenation, Recovery, Vitality, Renewal

### Buff Spells
- **Self:** Empowerment, Fortitude, Vigor, Enhancement, Ascension
- **Ally:** Ward, Aegis, Shield, Protection, Blessing

### Utility Spells
- **Control:** Bind, Snare, Slow, Root, Entangle
- **Movement:** Dash, Leap, Blink, Shift, Phase
- **Special:** Manipulation, Mastery, Control, Command, Dominion

---

## ✅ Result

All 81 auto-generated class spells now have:
- ✅ Proper thematic names (no more "Fire Mastery Expertise")
- ✅ Clean tags without underscores or duplicates
- ✅ Complete effect configurations (control, movement, buff with stat bonuses)
- ✅ Critical hit configurations for damage/healing
- ✅ Saving throws for AOE spells (Agility DC 14)
- ✅ Correct damage types (shadow instead of necrotic)
- ✅ Duration configurations for all spell types
- ✅ Proper DOT/HOT configurations with all required fields
- ✅ Channeled spells with proper `spellType: 'CHANNELED'`
- ✅ Correct targeting display (AOE shows range + area size, not "Touch")
- ✅ Spell variety (DOT, HOT, channeled, not just direct damage)
- ✅ Detailed buff configurations showing stat bonuses (not just duration)
- ✅ Proper descriptions mentioning area size, duration, and effects

---

## 🔄 Testing & Verification

To test the fixes:

1. **Clear spell cache** (if needed):
   ```javascript
   localStorage.removeItem('spell_library_data');
   localStorage.removeItem('class_spell_cache');
   ```

2. **Select Pyrofiend class** in character creation/selection

3. **Open Spell Library** and verify:
   - ✅ 9 spells total (3 per specialization)
   - ✅ Spell names are thematic (not "Fire Mastery Expertise")
   - ✅ AOE spells show range + area (e.g., "60ft AOE (15ft sphere)")
   - ✅ Channeled spells show "CHANNELED" type
   - ✅ DOT spells show duration in description
   - ✅ Buff spells show stat bonuses (not just duration)
   - ✅ Control spells show root/immobilize effects
   - ✅ Movement spells show teleport distance
   - ✅ No duplicate tags
   - ✅ Correct damage types (shadow for corruption)

4. **Check each specialization**:
   - **Fire Mastery**: Direct damage, AOE damage, DOT damage
   - **Corruption Stages**: Direct damage, AOE damage, DOT damage
   - **Demonic Power**: Direct damage, AOE damage, DOT damage

## 🐛 Known Issues to Fix Next

1. **General Spells** (Shove, Tackle, etc.):
   - Have `mechanicsConfig` but no `controlConfig`
   - Need to convert to proper control effect format

2. **Path Abilities** (`enhancedPathData.js`):
   - Need complete formatting audit
   - Add missing effect configurations

3. **Background Abilities** (`enhancedBackgroundData.js`):
   - Need complete formatting audit
   - Add missing effect configurations

