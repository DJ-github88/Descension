import React from 'react';
import { ATTRIBUTES } from '../../../../services/classEffect';
import { readFormula } from '../../../../services/classEffect';

/** Formula eligibility only. The whole saved ability still goes through admission. */
export default function FormulaExecutionHelp({ formula, onUseMissingHealth }) {
  const stats = Object.fromEntries(ATTRIBUTES.map(name => [name, 10]));
  const result = readFormula(formula, stats, { integerScaling: true, missingHealth: { current: 0, max: 0 }, allowZeroDice: true });
  return <details className="formula-help">
    <summary>Prism formula execution: {result.supported ? 'supported syntax' : 'manual for now'}</summary>
    <p>Use dice plus caster scores: <code>1d8 + intelligence * 2</code>. Full names: {ATTRIBUTES.join(', ')}.
      A score is not its modifier: use <code>intelligence_modifier</code> explicitly. <code>intelligence/4</code> rounds down.</p>
    <p>Integer scaling accepts ×1–10 (type <code>*</code>); parentheses may surround that term. At most 50 die faces in 8 groups.
      The owner reviews effective scores and retains the faces; the GM confirms the final amount. Other mechanics still need whole-ability admission.</p>
    <p>For a caster's wounds, use <code>1d8 + caster_missing_health/4</code>. Missing health is max(0, max base HP − current base HP);
      temporary HP is excluded and division rounds down. Requires a primary owner caster and one distinct creature target;
       changed caster state requires approval again. Zero-dice examples: <code>intelligence</code>, <code>intelligence/4</code>, <code>caster_missing_health/4</code>, <code>7</code>.
       These calculate a proposal without rolling; owner approval and GM confirmation are still required. AP/mana only, no area, rider, class payment or catalogue authorization.</p>
    {onUseMissingHealth && <button type="button" onClick={() => onUseMissingHealth('1d8 + caster_missing_health/4')}>Use caster missing-health formula</button>}
    {!result.supported && <p>{result.reason} Your formula is preserved. Unsupported mechanics remain available for manual play while execution support grows.</p>}
  </details>;
}
