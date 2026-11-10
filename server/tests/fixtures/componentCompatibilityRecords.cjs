/* Shared test data builder; used by Node production tests and the client planner contracts. */
const { randomUUID: uuid } = require('crypto');
const { EFFECT_CAPABILITY } = require('../../../vtt-react/src/services/authoredAbility');
const clone = value => JSON.parse(JSON.stringify(value));
function recordFor(f) {
  const self = f.route === 'owner-pc-to-self';
  const d = { name: `Contract ${f.id}`, description: 'Disposable compatibility fixture; no catalogue authorization.',
    spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' },
    effectTypes: [...(f.formula ? [f.kind] : []), ...(f.rider ? ['control'] : [])],
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: self ? 0 : 30, maxTargets: 1, targetRestrictions: [self ? 'self' : 'any'] },
    resourceCost: { actionPoints: 1, mana: 3 } };
  if (f.formula) { d[`${f.kind}Config`] = { [f.kind === 'damage' ? 'damageType' : 'healingType']: 'direct', formula: f.formula, resolution: 'DICE', ...(f.kind === 'damage' ? { elementType: 'arcane' } : {}) }; }
  if (f.rider) { d.controlConfig = { authoredCondition: { profile: EFFECT_CAPABILITY, effect: f.rider,
    ...(f.rider === 'movement' ? { movementFeet: -10, label: 'Contract slow' } : f.rider === 'periodic' ? { periodicKind: f.kind, periodicFormula: '1d4', periodicDamageType: 'arcane', tickRoll: 'each-tick', label: 'Contract tick' } : {}),
    expiryPolicy: f.rider === 'periodic' ? 'target-next-start' : 'target-next-end', durationText: 'Explicit target boundary', gmNote: 'GM confirms range and eligibility.',
    ...(f.save ? { save: { ability: 'constitution', dc: 12, outcome: f.save } } : {}) } }; }
  if (f.cooldown) { d.cooldownConfig = { cooldownType: 'authenticated_caster_start', cooldownValue: f.cooldown }; }
  return { ...clone(d), authoredDraft: clone(d), authoredDefinitionId: uuid() };
}
module.exports = { recordFor };
