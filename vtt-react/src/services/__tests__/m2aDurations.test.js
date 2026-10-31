import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { makeMovementRecord, makeStunnedRecord, movementCombination, validManagedRecord, structuredBoundary, structuredOccurrences, occurrenceText, ordinal,
  isMovementModifier, expiryLabel } from '../sharedConditionProfile';
import { occurrenceAt, remaining, progress, label, scheduleFor } from '../sharedEffectTiming';
import { policyText, describe as describeEffect, recordFor, resultFor, TIMINGS } from '../authoredEffect';
import { definitionFromWizard } from '../authoredAbility';
import { planSpellCommand } from '../spellConsequence';
import { capabilityOf, buildFeed } from '../acceptedResultFeed';
import AuthoredConditionFields, { newAuthoredEffect } from '../../components/spellcrafting-wizard/components/common/AuthoredConditionFields';

jest.mock('../effectProcessingService', () => ({ processOverTimeEffectsForTarget: jest.fn() }));
jest.mock('../../components/spellcrafting-wizard/core/mechanics/cooldownSystem', () => ({ processTurnBasedCooldowns: jest.fn() }));

const id = n => `30000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const room = 'r', target = { kind: 'creature', roomId: room, mapId: 'm', tokenId: 't', instanceId: 'target' };
const source = { kind: 'creature', roomId: room, mapId: 'm', tokenId: 's', instanceId: 's' };
const def = `authored:${id(900)}:1:${'b'.repeat(64)}`;
const counted = (n, timing, occurrences, extra = {}) => makeMovementRecord(target, id(n), Object.assign({ sourceActor: source, sourceOccurrence: `authored-effect:${id(n)}`, timing, occurrences,
  authoredDuration: 'Until the mud dries', feet: -10, label: 'Mired', effectDefinition: def }, extra));
const hash = c => c.repeat(64);
const approval = (n, policy, occurrences) => ({ approvalId: id(n), source, target, roll: null, price: { ap: 1, mana: 0 },
  spell: { definitionId: def, definitionHash: `authored-effect:v1/${hash('c')}`, name: 'Bog spell', kind: 'effect', damageTypes: [] },
  effectTerms: { direct: null, condition: { kind: 'movement', feet: -10, label: 'Mired' }, timing: Object.assign({ expiryPolicy: policy, durationText: 'Until the mud dries', authoredDuration: null, gmNote: 'n' }, occurrences ? { occurrences } : {}) },
  resolution: { gmConfirmed: true, timing: {}, timingNote: 'GM ruling', evidence: '' } });

test('record: counted timings carry an explicit whole count 2…10, validate by exact reconstruction and never say "round"', () => {
  for (const [timing, boundary, word] of [['authored-target-start-count', 'start', 'start'], ['authored-target-end-count', 'end', 'end']]) {
    for (const n of [2, 3, 10]) {
      const record = counted(1, timing, n);
      expect(record.clockBoundary).toBe(timing); expect(record.clockOccurrences).toBe(n);
      expect(structuredBoundary(record)).toBe(boundary); expect(structuredOccurrences(record)).toBe(n);
      expect(isMovementModifier(record)).toBe(true); expect(validManagedRecord(record, target)).toBe(true);
      expect(record.effectSummary).toContain(`${word} of the target's ${ordinal(n)} upcoming turn`); expect(JSON.stringify(record)).not.toMatch(/round/i);
      expect(validManagedRecord({ ...record, clockOccurrences: n + 1 }, target)).toBe(false); // an edited count is not a managed record
      expect(validManagedRecord({ ...record, clockOccurrences: undefined }, target)).toBe(false);
    }
  }
  for (const bad of [undefined, 1, 0, 11, 2.5, '3', NaN, null]) expect(() => counted(2, 'authored-target-start-count', bad)).toThrow(/counted boundary/);
  for (const timing of ['manual', 'authored-target-next-start', 'authored-target-next-end']) expect(() => counted(3, timing, 2)).toThrow(/counted boundary/);
  expect(() => makeStunnedRecord(target, id(4), { sourceActor: source, sourceOccurrence: `authored-effect:${id(4)}`, timing: 'authored-target-end-count', occurrences: 2, authoredDuration: 'x' })).not.toThrow();
  expect(() => makeStunnedRecord(target, id(5), { sourceActor: source, sourceOccurrence: `authored-condition:${id(5)}`, timing: 'authored-target-end-count', occurrences: 2, authoredDuration: 'x' })).toThrow();
  const next = counted(6, 'authored-target-next-end', undefined); expect(next.clockOccurrences).toBeUndefined(); expect(structuredOccurrences(next)).toBe(1);
  expect(structuredOccurrences(counted(7, 'manual', undefined))).toBeNull();
  expect(occurrenceText('start', 2)).toBe("start of the target's 2nd upcoming turn (its next turn counts as the 1st)");
  expect(occurrenceText('end', 3)).toBe("end of the target's 3rd upcoming turn (its next turn counts as the 1st; a turn already in progress is not counted)");
  expect([11, 12, 13, 21, 22, 23].map(ordinal)).toEqual(['11th', '12th', '13th', '21st', '22nd', '23rd']);
});

test('A11 combination: the same occurrence count refreshes; a changed count is a different term set and is refused, not guessed', () => {
  const active = [counted(1, 'authored-target-end-count', 2)];
  expect(movementCombination(active, counted(2, 'authored-target-end-count', 2))).toMatchObject({ ok: true, outcome: 'refreshed', replaces: id(1) });
  expect(movementCombination(active, counted(3, 'authored-target-end-count', 3))).toMatchObject({ ok: false, code: 'modifier_combination_unresolved' });
  expect(movementCombination(active, counted(4, 'authored-target-next-end', undefined))).toMatchObject({ ok: false, code: 'modifier_combination_unresolved' });
});

test('schedule arithmetic: occurrences are a pure function of the clock sequence; remaining and progress follow it; next-turn schedules are unchanged', () => {
  const item = { dueSequence: 9, occurrences: 3, period: 3 }; // occurrences at 3, 6, 9
  expect([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => occurrenceAt(item, s))).toEqual([null, null, null, { occurrence: 1, of: 3, final: false }, null, null, { occurrence: 2, of: 3, final: false }, null, null,
    { occurrence: 3, of: 3, final: true }, null]);
  expect([0, 2, 3, 5, 6, 8, 9].map(s => remaining(item, s))).toEqual([3, 3, 2, 2, 1, 1, 0]);
  const skipped = { dueSequence: 12, occurrences: 3, period: 3 }; // applied in the target's own turn at 2: ends at 6, 9, 12; the end at 3 is never counted
  expect([0, 2, 3, 4, 5].map(s => remaining(skipped, s))).toEqual([3, 3, 3, 3, 3]); expect(occurrenceAt(skipped, 3)).toBeNull();
  expect(occurrenceAt({ dueSequence: 4 }, 4)).toEqual({ occurrence: 1, of: 1, final: true }); expect(occurrenceAt({ dueSequence: 4 }, 3)).toBeNull(); expect(remaining({ dueSequence: 4 }, 3)).toBe(1);
  expect(occurrenceAt({ dueSequence: 9, occurrences: 3 }, 9)).toBeNull(); // a counted schedule without a period is unusable, never guessed
  expect(occurrenceAt({ dueSequence: 9, occurrences: 3, period: 3 }, 12)).toBeNull();
});

test('timing label and progress for GM and viewers state the count, what is left, and the authenticated boundaries', () => {
  const record = counted(1, 'authored-target-end-count', 3);
  const combat = (sequence, ids = ['a', 'b']) => ({ isActive: true, currentTurnIndex: 0, round: 1, turnOrder: ids.map(t => ({ actorRef: { kind: 'creature', tokenId: t }, tokenId: t })),
    effectLifecycle: { version: 1, id: id(77), sequence, positionKey: require('../sharedEffectTiming').positionKey({ isActive: true, currentTurnIndex: 0, round: 1, turnOrder: ids.map(t => ({ actorRef: { kind: 'creature', tokenId: t } })) }),
      schedules: { [require('../sharedEffectTiming').instanceKey(record.target, record.recordId)]: { combatId: id(77), ref: record.target, recordId: record.recordId, recordKey: require('../sharedConditionProfile').canonical(record), dueSequence: 9, occurrences: 3, period: 3, boundary: 'end' } } } });
  expect(progress(record, combat(0))).toMatchObject({ total: 3, remaining: 3, counted: 0, nextSequence: 3, finalSequence: 9, boundary: 'end' });
  expect(progress(record, combat(4))).toMatchObject({ remaining: 2, counted: 1, nextSequence: 6, finalSequence: 9 });
  const text = label(record, combat(4));
  expect(text).toMatch(/end of the target's 3rd upcoming turn/); expect(text).toMatch(/2 of 3 target-turn ends still to come \(1 counted\)/); expect(text).toMatch(/next counted at authenticated boundary 6, expires at boundary 9/);
  expect(text).not.toMatch(/round/i); expect(expiryLabel(record, combat(4))).toBe(text);
  expect(scheduleFor(record, { ...combat(4), isActive: false })).toBeNull(); expect(progress(record, { ...combat(4), isActive: false })).toBeNull();
  expect(expiryLabel(record, { ...combat(4), isActive: false })).toMatch(/not tracked by the current turn clock; GM removes this exact instance/);
});

test('shared mapping: policy wording, definition summary, record and result all carry the count; nothing maps "round"', () => {
  expect(TIMINGS['target-start-count']).toBe('authored-target-start-count'); expect(TIMINGS['target-end-count']).toBe('authored-target-end-count');
  expect(policyText('target-end-count', 2)).toBe("expires at the end of the target's 2nd upcoming turn (its next turn counts as the 1st; a turn already in progress is not counted)");
  expect(policyText('target-next-end')).toBe("expires at the end of the target's next turn"); expect(policyText('gm-manual')).toBe('GM removes');
  const a = approval(7, 'target-start-count', 3);
  const rec = recordFor(a); expect(rec.clockOccurrences).toBe(3); expect(rec.clockBoundary).toBe('authored-target-start-count');
  expect(describeEffect(a.effectTerms)).toMatch(/3rd upcoming turn/);
  const result = resultFor(a, a.resolution); expect(result.occurrences).toBe(3); expect(result.expiryPolicy).toBe('target-start-count');
  const plain = resultFor(approval(8, 'target-next-end'), a.resolution); expect('occurrences' in plain).toBe(false);
});

test('planner: a counted approval produces the same record the server will derive, in one command', () => {
  const tokens = [{ id: 's', mapId: 'm', state: { actorContract: { ...source, version: 1, revision: 2 }, currentActionPoints: 4, tempActionPoints: 0, currentMana: 0, tempMana: 0, conditions: [] } },
    { id: 't', mapId: 'm', state: { actorContract: { ...target, version: 1, revision: 5 }, currentHp: 20, tempHealth: 0, maxHp: 30, conditions: [] } }];
  const a = approval(9, 'target-end-count', 2), plan = planSpellCommand({ approval: a, contentHash: 'h', tokens, roomId: room, mapId: 'm', adjudicated: true });
  expect(plan.entries[1].conditions).toEqual([{ op: 'add', recordId: id(9), record: recordFor(a) }]); expect(plan.entries[1].conditions[0].record.clockOccurrences).toBe(2);
  expect(JSON.parse(plan.extra.adjudication.chosenResult).occurrences).toBe(2);
});

test('narration and feed: the accepted line states the counted boundary explicitly', () => {
  const a = approval(7, 'target-end-count', 2), result = resultFor(a, a.resolution);
  const receipt = { version: 1, roomId: room, commandId: 'cmd', source, target, adjudication: { definitionVersionOrHash: a.spell.definitionHash, chosenResult: JSON.stringify(result) },
    actors: [{ ref: source, beforeRevision: 1, finalResources: { hp: { current: 30, temp: 0 }, ap: { current: 3, temp: 0 }, mana: { current: 0, temp: 0 } } },
      { ref: target, beforeRevision: 1, finalResources: { hp: { current: 20, temp: 0 }, ap: { current: 4, temp: 0 }, mana: { current: 0, temp: 0 } }, conditions: [recordFor(a)] }] };
  expect(capabilityOf(receipt)).toMatchObject({ kind: 'effect', expiry: expect.stringMatching(/end of the target's 2nd upcoming turn/) });
  const before = { [['creature', room, 'm', 's', 's'].join('|')]: { revision: 1, name: 'Ash Hound', pools: { hp: { current: 30, temp: 0 }, ap: { current: 4, temp: 0 }, mana: { current: 0, temp: 0 } } },
    [['creature', room, 'm', 't', 'target'].join('|')]: { revision: 1, name: 'Bog Troll', pools: { hp: { current: 20, temp: 0 }, ap: { current: 4, temp: 0 }, mana: { current: 0, temp: 0 } } } };
  const feed = buildFeed({ result: { receipt }, before, viewer: { reportable: () => true, rendered: () => true }, live: true });
  expect(feed.narration.text).toMatch(/end of the target's 2nd upcoming turn/); expect(feed.narration.text).not.toMatch(/round/i);
});

const wizard = (policy, occurrences) => { const d = { name: 'Disposable Bog Hold', description: 'x', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['control'],
  controlConfig: { authoredCondition: Object.assign({ profile: 'authored-effect:v1', effect: 'stunned', expiryPolicy: policy, durationText: 'Until the embers cool', gmNote: 'GM resolves' }, occurrences !== undefined ? { occurrences } : {}) },
  targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 1, mana: 0 } };
  return Object.assign(JSON.parse(JSON.stringify(d)), { authoredDraft: d, authoredDefinitionId: id(500) }); };
test('definition compiler: counted policies need 2…10; the existing policies carry none; the count joins the definition (so a change is a new version)', () => {
  const map = r => definitionFromWizard(r, { roomId: room, definitionVersion: 1, classId: 'arcanoneer' });
  const ok = map(wizard('target-end-count', 4)); expect(ok.ok).toBe(true); expect(ok.definition.timing.occurrences).toBe(4);
  expect(map(wizard('target-end-count', 5)).definition.timing).not.toEqual(ok.definition.timing);
  for (const bad of [undefined, 1, 11, 2.5, '3', null]) expect(map(wizard('target-start-count', bad)).ok).toBe(false);
  for (const p of ['gm-manual', 'target-next-start', 'target-next-end']) { expect(map(wizard(p, 2)).ok).toBe(false); expect('occurrences' in map(wizard(p)).definition.timing).toBe(false); }
});

test('Wizard fields: choosing a counted expiry asks for the count in explicit terms; switching back drops it', () => {
  const Harness = () => { const [value, setValue] = React.useState({ ...newAuthoredEffect(), durationText: 'x', gmNote: 'y' }); return <><AuthoredConditionFields value={value} onChange={setValue} /><output data-testid="state">{JSON.stringify(value)}</output></>; };
  render(<Harness />);
  const expiry = screen.getByLabelText('Expiry');
  expect(screen.queryByLabelText(/to count/)).toBeNull();
  fireEvent.change(expiry, { target: { value: 'target-end-count' } });
  const count = screen.getByLabelText(/Target-turn ends to count \(whole number, 2 to 10\)/); expect(count.value).toBe('2');
  expect(screen.getByText(/Expires automatically at the end of the target's 2nd upcoming turn/)).toBeTruthy();
  fireEvent.change(count, { target: { value: '3' } });
  expect(JSON.parse(screen.getByTestId('state').textContent)).toMatchObject({ expiryPolicy: 'target-end-count', occurrences: 3 });
  expect(screen.getByText(/3rd upcoming turn/)).toBeTruthy();
  fireEvent.change(expiry, { target: { value: 'target-start-count' } }); expect(screen.getByLabelText(/Target-turn starts to count/).value).toBe('3');
  fireEvent.change(expiry, { target: { value: 'target-next-end' } });
  expect(JSON.parse(screen.getByTestId('state').textContent).occurrences).toBeUndefined(); expect(screen.queryByLabelText(/to count/)).toBeNull();
});

// Found by the App witness: the client projection (roomCondition) dropped clockOccurrences, so counted records read as invalid in the browser.
test('the client condition projection keeps the occurrence count so a counted record stays valid', () => {
  const { roomCondition } = require('../actorConsequenceService');
  const record = counted(7, 'authored-target-end-count', 2);
  const projected = roomCondition(record, record.target);
  expect(projected.clockOccurrences).toBe(2); expect(projected.clockBoundary).toBe('authored-target-end-count');
});
