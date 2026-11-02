import React from 'react';
import { readScaledFormula } from '../../../../services/authoredAbility';
import { ATTRIBUTES } from '../../../../services/classEffect';

/** Formula eligibility only. The whole saved ability still goes through admission. */
export default function FormulaExecutionHelp({ formula }) {
  const result = readScaledFormula(formula, Object.fromEntries(ATTRIBUTES.map(name => [name, 10])));
  return <details className="formula-help">
    <summary>Prism formula execution: {result.supported ? 'supported syntax' : 'manual for now'}</summary>
    <p>Use dice plus caster scores: <code>1d8 + intelligence * 2</code>. Full names: {ATTRIBUTES.join(', ')}.
      A score is not its modifier: use <code>intelligence_modifier</code> explicitly. <code>intelligence/4</code> rounds down.</p>
    <p>Integer scaling accepts ×1–10 (type <code>*</code>); parentheses may surround that term. At most 50 die faces in 8 groups.
      The owner reviews effective scores and retains the faces; the GM confirms the final amount. Other mechanics still need whole-ability admission.</p>
    {!result.supported && <p>{result.reason} Your formula is preserved. Unsupported mechanics remain available for manual play while execution support grows.</p>}
  </details>;
}
