import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { makePeriodicRecord, isPeriodicTick, periodicOf, periodicCombination, structuredBoundary, structuredOccurrences, expiryLabel, tickScheduleText, validManagedRecord } from '../sharedConditionProfile';
import { label, dueTicks, tickLabel, tickKey } from '../sharedEffectTiming';
import { describe as describeEffect, recordFor, conditionPlan, pcConsent, conditionLabel } from '../authoredEffect';
import { definitionFromWizard } from '../authoredAbility';
import AuthoredConditionFields, { newAuthoredEffect } from '../../components/spellcrafting-wizard/components/common/AuthoredConditionFields';

jest.mock('../effectProcessingService', () => ({ processOverTimeEffectsForTarget: jest.fn() }));

const id = n => `50000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const room = 'r', target = { kind: 'creature', roomId: room, mapId: 'm', tokenId: 't', instanceId: 'target' };
const source = { kind: 'creature', roomId: room, mapId: 'm', tokenId: 's', instanceId: 's' };
const pc = { kind: 'character', roomId: room, mapId: 'm', tokenId: 'pc', instanceId: 'pc', ownerUid: 'u', characterId: 'c' };
const def = `authored:${id(900)}:1:${'b'.repeat(64)}`;
const terms = (policy = 'target-start-count', occurrences = 3, tick = { kind: 'damage', formula: '1d6', damageTypes: ['blight'] }) => ({ direct: null,
  condition: { kind: 'periodic', tick, label: 'Gloomrot', tickRoll: 'each-tick' },
  timing: Object.assign({ expiryPolicy: policy, durationText: 'While it festers', authoredDuration: null, gmNote: 'n' }, occurrences ? { occurrences } : {}) });
const approval = (n, t = terms(), tgt = target) => ({ approvalId: id(n), source, target: tgt, roll: null, price: { ap: 1, mana: 2 },
  spell: { definitionId: def, definitionHash: `authored-effect:v1/${'c'.repeat(64)}`, name: 'Gloom', kind: 'effect', damageTypes: [] }, effectTerms: t });

test('periodic record: valid by exact reconstruction, structured on the existing timings, legacy ticker disabled, never "round"', () => {
  const rec = recordFor(approval(1));
  expect(isPeriodicTick(rec)).toBe(true); expect(validManagedRecord(rec, target)).toBe(true);
  expect([structuredBoundary(rec), structuredOccurrences(rec)]).toEqual(['start', 3]);
  expect(rec.hasOverTimeEffect).toBe(false);
  expect(periodicOf(rec)).toEqual({ kind: 'damage', formula: '1d6', damageType: 'blight', label: 'Gloomrot', ticks: 3, boundary: 'start' });
  expect(rec.effectSummary).not.toMatch(/round/i);
  expect(validManagedRecord({ ...rec, overTimeFormula: '9d6' }, target)).toBe(false);
  expect(validManagedRecord({ ...rec, hasOverTimeEffect: true }, target)).toBe(false);
  const one = recordFor(approval(2, terms('target-next-end', null, { kind: 'healing', formula: '2d4+1' })));
  expect(periodicOf(one)).toMatchObject({ kind: 'healing', ticks: 1, boundary: 'end', damageType: null });
  expect(tickScheduleText('authored-target-next-end')).toMatch(/one tick at the end of the target's next turn \(a turn already in progress is not counted\)/);
  expect(describeEffect(terms())).toMatch(/3 ticks, one at the start of each of the target's next 3 turns/);
  expect(conditionLabel(terms().condition)).toMatch(/rolled when each tick is resolved/);
  expect(() => makePeriodicRecord(pc, id(3), { sourceOccurrence: `authored-effect:${id(3)}`, timing: 'authored-target-next-start', sourceActor: source, authoredDuration: 'x', tick: { kind: 'healing', formula: '1d4' }, label: 'L', effectDefinition: def })).toThrow();
  expect(() => makePeriodicRecord(target, id(4), { sourceOccurrence: `authored-effect:${id(4)}`, timing: 'manual', sourceActor: source, authoredDuration: 'x', tick: { kind: 'healing', formula: '1d4' }, label: 'L', effectDefinition: def })).toThrow();
});

test('combination and consent: one periodic instance per creature; a second is refused whole; a PC target is refused', () => {
  const first = recordFor(approval(1));
  expect(conditionPlan(approval(1), []).ops).toHaveLength(1);
  expect(conditionPlan(approval(5), [first]).refused.code).toBe('periodic_combination_unresolved');
  expect(periodicCombination([first], recordFor(approval(6))).ok).toBe(false);
  expect(conditionPlan(approval(7, terms(), pc)).refused.code).toBe('periodic_target_unsupported');
  expect(pcConsent(terms(), 'creature').ok).toBe(false);
});

test('due-tick view: live vs retired clock, ordered, labelled without "round"', () => {
  const combat = { isActive: true, currentTurnIndex: 0, round: 1, turnOrder: [{ actorRef: source }, { actorRef: target }] };
  const positionKey = require('../sharedEffectTiming').positionKey(combat);
  const t = n => ({ tickId: String(n).repeat(64).slice(0, 64), combatId: id(10), sequence: n, occurrence: n, of: 3, final: n === 3, ref: target, recordId: id(1), recordHash: 'h', label: 'Gloomrot', tick: { kind: 'damage', formula: '1d6', damageType: 'blight' } });
  combat.effectLifecycle = { version: 1, id: id(10), sequence: 3, positionKey, schedules: {}, dueTicks: { b: t(3), a: t(1) } };
  expect(dueTicks(combat).map(x => [x.sequence, x.live])).toEqual([[1, true], [3, true]]);
  expect(tickLabel(dueTicks(combat)[1])).toMatch(/tick 3 of 3 — blight damage 1d6, due at authenticated boundary 3 \(last tick; the effect has ended\)/);
  expect(dueTicks(combat).map(tickLabel).join(' ')).not.toMatch(/round/i);
  combat.turnOrder = [...combat.turnOrder].reverse(); // roster change retires the clock
  expect(dueTicks(combat).every(x => x.live === false)).toBe(true);
  expect(tickKey({ combatId: 'c', ref: target, recordId: 'r', recordHash: 'h' }, 4)).not.toBe(tickKey({ combatId: 'c', ref: target, recordId: 'r', recordHash: 'h' }, 5));
  const rec = recordFor(approval(1));
  expect(expiryLabel(rec, { isActive: false })).toMatch(/no further ticks are recorded automatically/);
  expect(label(rec, { isActive: false })).toBe(null);
});

test('Wizard fields: choosing periodic sets explicit defaults; leaving it removes every periodic field; the manual policy is not offered', () => {
  let value = newAuthoredEffect();
  const { rerender } = render(<AuthoredConditionFields value={value} onChange={v => { value = v; }} />);
  fireEvent.change(screen.getByLabelText(/^Canonical effect/), { target: { value: 'periodic' } });
  expect(value).toMatchObject({ effect: 'periodic', periodicKind: 'damage', periodicFormula: '1d6', tickRoll: 'each-tick' });
  rerender(<AuthoredConditionFields value={value} onChange={v => { value = v; }} />);
  const ticks = screen.getByLabelText(/^Ticks/);
  expect([...ticks.querySelectorAll('option')].map(o => o.value)).not.toContain('gm-manual');
  fireEvent.change(screen.getByLabelText(/^Each tick/), { target: { value: 'healing' } });
  expect(value.periodicDamageType).toBeUndefined();
  rerender(<AuthoredConditionFields value={value} onChange={v => { value = v; }} />);
  fireEvent.change(screen.getByLabelText(/^Canonical effect/), { target: { value: 'stunned' } });
  expect(Object.keys(value).filter(k => /^periodic|^tickRoll$/.test(k))).toEqual([]);
  // Round-trip: a periodic Wizard draft maps to the admitted shape.
  const c = { ...newAuthoredEffect(), effect: 'periodic', periodicKind: 'damage', periodicFormula: '1d6', periodicDamageType: 'blight', tickRoll: 'each-tick', label: 'Gloomrot',
    expiryPolicy: 'target-start-count', occurrences: 3, durationText: 'While it festers', gmNote: 'GM note' };
  const d = { name: 'Gloom', description: 'x', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['control'], controlConfig: { authoredCondition: c },
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 1, mana: 2 } };
  const mapped = definitionFromWizard({ ...JSON.parse(JSON.stringify(d)), authoredDraft: d, authoredDefinitionId: id(99) }, { roomId: room, definitionVersion: 1, classId: 'arcanoneer' });
  expect(mapped.ok).toBe(true);
  expect(mapped.definition.effects.condition).toEqual({ kind: 'periodic', tick: { kind: 'damage', formula: '1d6', damageTypes: ['blight'] }, label: 'Gloomrot', tickRoll: 'each-tick' });
});
