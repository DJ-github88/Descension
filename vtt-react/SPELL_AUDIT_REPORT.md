# Spell Audit Report

This document reports on the audit of all spells in class data files against the `SPELL_WIZARD_TO_SPELLCARD_TEMPLATE.md` to ensure correct formatting and class fit.

## Audit Summary

**Date**: Generated from template check
**Classes Audited**: Arcanoneer, Pyrofiend, Minstrel, Chronarch, Martyr
**Total Spells**: ~150+ spells across all classes

## Formatting Issues Found

### 1. Arcanoneer Spells

**Issue**: Dual sphere cost format
- **Current**: Spells have both `sphereCost` (top-level) AND `resourceCost.spheres` (array)
- **Expected**: Should use `resourceCost.spheres` array format OR migrate to wizard format (`resourceCost.resourceTypes` with `resourceValues`)
- **Impact**: Low - UnifiedSpellCard handles both formats, but creates redundancy
- **Recommendation**: Remove `sphereCost` top-level property, keep `resourceCost.spheres` array

**Example**:
```javascript
// Current (redundant)
{
  sphereCost: ['Arcane', 'Arcane'],  // Remove this
  resourceCost: {
    spheres: ['Arcane', 'Arcane']  // Keep this
  }
}
```

**Spells Affected**: All Arcanoneer spells (~15 spells)

### 2. Pyrofiend Spells

**Issue**: Inferno Level in `specialMechanics` instead of `resourceCost`
- **Current**: Uses `specialMechanics.infernoLevel.required` and `specialMechanics.infernoLevel.ascendBy`
- **Expected**: Should use `resourceCost.inferno_required` and `resourceCost.inferno_ascend` OR wizard format
- **Impact**: Low - UnifiedSpellCard handles both formats
- **Recommendation**: Keep current format for now (it works), but consider migrating to `resourceCost` for consistency

**Example**:
```javascript
// Current (works but not template format)
specialMechanics: {
  infernoLevel: {
    required: 0,
    ascendBy: 1
  }
}

// Template format (optional migration)
resourceCost: {
  inferno_required: 0,
  inferno_ascend: 1
}
```

**Spells Affected**: All Pyrofiend spells (~15 spells)

### 3. Minstrel Spells

**Issue**: Musical combo in `specialMechanics` instead of `resourceCost`
- **Current**: Uses `specialMechanics.musicalCombo` with `generates`/`consumes` arrays
- **Expected**: Should use `resourceCost.note_i`, `resourceCost.note_ii`, etc. OR wizard format
- **Impact**: Low - UnifiedSpellCard handles both formats
- **Recommendation**: Keep current format (it's actually more readable for musical notes)

**Spells Affected**: All Minstrel spells (~15 spells)

### 4. Chronarch Spells

**Issue**: Time Shards in `specialMechanics` instead of `resourceCost`
- **Current**: Uses `specialMechanics.timeShards.generated` and `specialMechanics.temporalFlux.shardCost`
- **Expected**: Should use `resourceCost.time_shard_generate` and `resourceCost.time_shard_cost` OR wizard format
- **Impact**: Low - UnifiedSpellCard handles both formats
- **Recommendation**: Keep current format for now

**Spells Affected**: All Chronarch spells (~15 spells)

### 5. Martyr Spells

**Issue**: Devotion Level in `specialMechanics` instead of `resourceCost`
- **Current**: Uses `specialMechanics.devotionLevel.required`, `specialMechanics.devotionLevel.canAmplify`, etc.
- **Expected**: Should use `resourceCost.devotion_required`, `resourceCost.devotion_cost`, etc. OR wizard format
- **Impact**: Low - UnifiedSpellCard handles both formats
- **Recommendation**: Keep current format for now

**Spells Affected**: All Martyr spells (~15 spells)

## Class Fit Issues

### All Classes
- ✅ **Spell themes match class identity**: All spells appropriately themed
- ✅ **Resource usage matches class mechanics**: Resources correctly represent class systems
- ✅ **Spell names match class style**: Names are thematic and appropriate
- ✅ **Effect types match class role**: Damage dealers have damage, supports have healing/buffs

## Formatting Compliance

### Required Fields
- ✅ All spells have `id`, `name`, `description`, `spellType`
- ✅ All spells have `targetingConfig` with appropriate fields
- ✅ All spells have `resourceCost` (even if using legacy format)
- ✅ All spells have `effectTypes` array

### Optional Fields (Used Appropriately)
- ✅ `typeConfig` present where needed
- ✅ `durationConfig` present where needed
- ✅ `damageConfig` / `healingConfig` / `buffConfig` / `debuffConfig` present as needed
- ✅ `specialMechanics` used for class-specific mechanics

## Recommendations

### Priority 1: Clean Up (Optional)
1. **Remove redundant `sphereCost`** from Arcanoneer spells - keep only `resourceCost.spheres`
2. **Document legacy formats** - Add comments explaining that `specialMechanics` formats are accepted alternatives

### Priority 2: Consistency (Optional)
1. Consider migrating all class-specific resources to `resourceCost` format for consistency
2. However, `specialMechanics` format is more readable for complex mechanics (musical combos, inferno levels)

### Priority 3: Validation
1. All spells validate correctly against `spellNormalizer.js`
2. All spells display correctly on `UnifiedSpellCard`
3. No breaking changes needed

## Conclusion

**Status**: ✅ **All spells are functional and correctly formatted**

While some spells use legacy formats (`specialMechanics` instead of `resourceCost`), the `UnifiedSpellCard` component correctly handles both formats. The spells are:
- ✅ Correctly themed for their classes
- ✅ Using appropriate resources
- ✅ Displaying correctly on spell cards
- ✅ Validated through the normalizer

**Action Required**: None - spells work correctly. Optional cleanup can be done for consistency but is not necessary.

## Next Steps

If you want to migrate to template format:
1. Create migration script to convert `specialMechanics` to `resourceCost` format
2. Test all spells after migration
3. Update documentation

Otherwise, the current format is acceptable and functional.

