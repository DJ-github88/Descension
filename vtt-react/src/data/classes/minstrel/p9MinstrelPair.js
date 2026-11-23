import { MINSTREL_DATA } from '../minstrelData';

const P9_MINSTREL_PAIR_IDS = Object.freeze(['minstrel_opening_chord', 'minstrel_resolving_strike']);

const stable = value => {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().filter(k => value[k] !== undefined).map(k => `${JSON.stringify(k)}:${stable(value[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
};

const SHIPPED_PAIR = Object.freeze(
  Object.fromEntries(
    P9_MINSTREL_PAIR_IDS.map(id => [id, MINSTREL_DATA.spells.find(s => s.id === id)]).filter(([, s]) => Boolean(s))
  )
);

/**
 * Presentation-only check for the two reviewed P9 Minstrel pair abilities
 * (Opening Chord -> Resolving Strike). Never grants execution to arbitrary
 * Wizard-authored records or modified copies.
 */
export function getP9MinstrelPairSpec(record) {
  if (!record || typeof record !== 'object') return null;
  const source = record.authoredDraft && typeof record.authoredDraft === 'object' ? record.authoredDraft : record;
  const id = record.id || source.id;
  if (!P9_MINSTREL_PAIR_IDS.includes(id)) return null;
  const shipped = SHIPPED_PAIR[id];
  if (!shipped) return null;

  // Verify the record has not been altered from the reviewed P9 definition.
  const same = (a, b) => stable(a) === stable(b);
  if (
    source.name !== shipped.name ||
    source.spellType !== shipped.spellType ||
    source.typeConfig?.castTimeType !== shipped.typeConfig?.castTimeType ||
    source.targetingConfig?.targetingType !== shipped.targetingConfig?.targetingType ||
    source.targetingConfig?.rangeDistance !== shipped.targetingConfig?.rangeDistance ||
    (source.targetingConfig?.maxTargets !== undefined && source.targetingConfig?.maxTargets !== 1) ||
    !same(source.effectTypes, shipped.effectTypes) ||
    !same(source.damageConfig, shipped.damageConfig) ||
    (source.resolution !== undefined && source.resolution !== shipped.resolution) ||
    source.resourceCost?.actionPoints !== shipped.resourceCost?.actionPoints ||
    !same(source.resourceCost?.resourceValues, shipped.resourceCost?.resourceValues) ||
    !same(source.musicalCombo, shipped.musicalCombo) ||
    (source.cooldownConfig !== undefined && !same(source.cooldownConfig, shipped.cooldownConfig)) ||
    (source.durationConfig?.durationType !== undefined && source.durationConfig.durationType !== 'instant')
  ) {
    return null;
  }

  const generates = Array.isArray(shipped.musicalCombo?.generates) ? shipped.musicalCombo.generates : [];
  const requires = Array.isArray(shipped.musicalCombo?.requires) ? shipped.musicalCombo.requires : [];
  const formatList = list => list.map(entry => `${entry.note}×${entry.count}`).join(', ');

  return {
    id,
    name: shipped.name,
    kind: 'damage',
    formula: shipped.damageConfig.formula,
    damageTypes: [...(shipped.damageConfig.damageTypes || ['storm'])],
    ap: shipped.resourceCost.actionPoints,
    mana: shipped.resourceCost.resourceValues.mana,
    rangeFeet: shipped.targetingConfig.rangeDistance,
    generates,
    requires,
    classPriceLabel: generates.length
      ? `+${generates.reduce((sum, e) => sum + e.count, 0)} Musical Notes (${formatList(generates)})`
      : `${requires.reduce((sum, e) => sum + e.count, 0)} Musical Notes (${formatList(requires)})`,
    shortNoteSummary: generates.length
      ? `+${formatList(generates)}`
      : `${formatList(requires)}`
  };
}
