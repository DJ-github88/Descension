import { ATTRIBUTE_IDS, getEffectiveAttributes } from '../utils/attributeProfile';
import useConditionStore from '../store/conditionStore';

// Live characters use the same equipment/signed-effect path as the sheet.
// Plain saved records retain their explicit or legacy attribute interpretation.
export const combatAttributes = character => {
  if (typeof character.getTotalStatsWithEffects !== 'function') {
    const attributes = getEffectiveAttributes(character);
    ATTRIBUTE_IDS.forEach(id => { if (!Number.isFinite(character.stats?.[id])) delete attributes[id]; });
    return attributes;
  }
  const conditions = useConditionStore.getState();
  return character.getTotalStatsWithEffects(conditions.getActiveEffects('buff'), conditions.getActiveEffects('debuff'));
};
