import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe as describeEffect, recordFor, resultFor } from '../authoredEffect';
import { definitionFromWizard, definitionSummary } from '../authoredAbility';
import AuthoredConditionFields from '../../components/spellcrafting-wizard/components/common/AuthoredConditionFields';

jest.mock('../effectProcessingService', () => ({ processOverTimeEffectsForTarget: jest.fn() }));

// M5 composition (client mirror): one immediate part (rolled at cast) + one periodic tick of the same kind.
const wizard = ({ now = 'damage', tick = 'damage', occurrences = 3 } = {}) => {
  const c = { profile: 'authored-effect:v1', effect: 'periodic', periodicKind: tick, periodicFormula: '1d4', ...(tick === 'damage' ? { periodicDamageType: 'blight' } : {}), tickRoll: 'each-tick', label: 'Cinder Brand',
    expiryPolicy: 'target-start-count', occurrences, durationText: 'While the cinders glow', gmNote: 'GM resolves range before confirming.' };
  const d = { name: 'Disposable Cinder Brand', description: 'client mirror', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: [now, 'control'], controlConfig: { authoredCondition: c },
    ...(now === 'damage' ? { damageConfig: { damageType: 'direct', elementType: 'ember', formula: '1d6+2', resolution: 'DICE' } } : { healingConfig: { healingType: 'direct', formula: '2d4', resolution: 'DICE' } }),
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 1, mana: 2 } };
  return { ...JSON.parse(JSON.stringify(d)), authoredDraft: d, authoredDefinitionId: '60000000-0000-4000-8000-000000000001' };
};
const opts = { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' };

test('a same-kind immediate + periodic Wizard bundle compiles whole; the immediate roll stays out of the installed tick terms', () => {
  const r = definitionFromWizard(wizard(), opts); expect(r.ok).toBe(true);
  expect(r.definition.effects.direct).toEqual({ kind: 'damage', formula: '1d6+2', damageTypes: ['ember'] });
  expect(definitionSummary(r.definition)).toMatch(/^immediate ember damage 1d6\+2 \(rolled at cast\) \+ Cinder Brand \(blight damage 1d4 per tick, rolled when each tick is resolved\)/);
  expect(definitionSummary(r.definition)).not.toMatch(/round/i);
  const target = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 't', instanceId: 't' }, source = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'pc', ownerUid: 'u', characterId: 'c' };
  const approval = { approvalId: '60000000-0000-4000-8000-000000000002', source, target, roll: { mode: 'physical', dice: [{ sides: 6, faces: [5] }], constant: 2, reading: '1d6+2', total: 7 },
    spell: { definitionId: `authored:60000000-0000-4000-8000-000000000900:1:${'a'.repeat(64)}`, definitionHash: `authored-effect:v1/${'a'.repeat(64)}`, name: 'Cinder', kind: 'effect', damageTypes: ['ember'] },
    effectTerms: { direct: r.definition.effects.direct, condition: r.definition.effects.condition, timing: r.definition.timing } };
  const rec = recordFor(approval); expect(rec.overTimeFormula).toBe('1d4'); expect(JSON.stringify(rec)).not.toContain('1d6+2');
  expect(resultFor(approval, { gmConfirmed: true }).roll.total).toBe(7);
  expect(describeEffect(approval.effectTerms)).toMatch(/^immediate ember damage/);
});

test('mixed kinds stay manual with a visible reason; healing + healing compiles', () => {
  for (const mixed of [wizard({ now: 'damage', tick: 'healing' }), wizard({ now: 'healing', tick: 'damage' })]) {
    const r = definitionFromWizard(mixed, opts); expect(r.ok).toBe(false); expect(r.reason).toMatch(/both damage or both healing/);
  }
  expect(definitionFromWizard(wizard({ now: 'healing', tick: 'healing' }), opts).ok).toBe(true);
});

test('Wizard copy explains the optional same-kind immediate part and the once-only price', () => {
  render(<AuthoredConditionFields value={wizard().controlConfig.authoredCondition} onChange={() => {}} />);
  expect(screen.getByText(/You may add Damage \(for damage ticks\) or Healing \(for healing ticks\)/)).toBeTruthy();
  expect(screen.getByText(/rolled once, at cast; it never decides the ticks/)).toBeTruthy();
});
