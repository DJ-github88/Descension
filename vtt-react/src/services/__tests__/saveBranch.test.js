/* Shared GM-recorded save outcomes — client planner, approval terms, narration and Wizard authoring control. */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { definitionFromWizard, EFFECT_CAPABILITY } from '../authoredAbility';
import { planSpellCommand, spellReceipt, buildApproval } from '../spellConsequence';
import { termsFor, resultFor, recordFor, branchLines, describe as describeEffect, pcConsent } from '../authoredEffect';
import { replaceAuthoredRegistry, authoredSupport } from '../authoredAbilityRegistry';
import { capabilityOf } from '../acceptedResultFeed';
import * as saveBranch from '../saveBranch';
import * as classEffect from '../classEffect';
import { isMovementModifier } from '../sharedConditionProfile';
import AuthoredConditionFields from '../../components/spellcrafting-wizard/components/common/AuthoredConditionFields';
import { explainExecution } from '../../components/spellcrafting-wizard/utils/executionCompatibility';

const uuid = n => `20000000-0000-4000-8000-00000000000${n}`;
const pc = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'p', instanceId: 'pc', ownerUid: 'u', characterId: 'c' };
const foe = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 't', instanceId: 'target' };
const SAVE = { ability: 'constitution', dc: 12, outcome: 'negates' };
function wizard({ save = SAVE, effect = 'movement' } = {}) {
  const d = { name: 'Frost Grip', description: '', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['control', 'damage'],
    controlConfig: { authoredCondition: { profile: EFFECT_CAPABILITY, effect, ...(effect === 'movement' ? { movementFeet: -10, label: 'Frozen Limbs' } : {}), expiryPolicy: 'gm-manual', durationText: 'for 1 round', gmNote: 'GM records the save.', ...(save ? { save } : {}) } },
    damageConfig: { damageType: 'direct', elementType: 'rime', formula: '1d8+3', resolution: 'DICE' },
    resourceCost: { actionPoints: 1, mana: 4 }, targetingConfig: { targetingType: 'single', maxTargets: 1, rangeDistance: 5, rangeType: 'touch', targetRestrictions: ['enemy'] } };
  return { ...JSON.parse(JSON.stringify(d)), authoredDefinitionId: uuid(1), authoredDraft: d };
}
const tokens = () => [
  { id: 'p', mapId: 'm', ownerUserId: 'u', character: { id: 'c', actionPoints: { current: 4 }, mana: { current: 10 }, tempMana: 2 }, state: { actorContract: { ...pc, version: 1, revision: 1, primary: true } } },
  { id: 't', mapId: 'm', state: { actorContract: { ...foe, version: 1, revision: 3 }, currentHp: 30, tempHealth: 4, maxHp: 40, conditions: [] } }];
function admitted(record = wizard()) {
  const d = definitionFromWizard(record, { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' }).definition;
  replaceAuthoredRegistry('r', [{ definitionRef: { roomId: 'r', definitionId: uuid(1), definitionVersion: 1, definitionHash: 'c'.repeat(64) }, canonicalDefinition: d,
    descriptor: { capabilityId: EFFECT_CAPABILITY, price: { ap: 1, mana: 4 }, effects: d.effects, timing: d.timing } }]);
  return { d, support: authoredSupport(`authored:${uuid(1)}:1:${'c'.repeat(64)}`, 'r', 'Arcanoneer') };
}
const roll = { mode: 'physical', dice: [{ sides: 8, faces: [5] }], constant: 3, total: 8, reading: '1d8+3' };

test('the owner approves both outcomes: the save is part of the exact terms and both branches are listed; a PC target is refused', () => {
  const { d, support } = admitted();
  expect(support).toMatchObject({ supported: true, kind: 'effect' });
  expect(support.effectTerms.save).toEqual({ scope: 'condition', ability: 'constitution', dc: 12, outcome: 'negates' });
  expect(branchLines(support.effectTerms)).toEqual([
    { branch: 'saved', text: 'Target saves (Constitution DC 12, GM records): rime damage 1d8+3; no Frozen Limbs' },
    { branch: 'failed', text: 'Target fails (Constitution DC 12, GM records): rime damage 1d8+3 + Frozen Limbs (movement −10 ft)' }]);
  expect(describeEffect(support.effectTerms)).toMatch(/unless the target saves \(Constitution DC 12, negates Frozen Limbs only; GM records\)/);
  expect(saveBranch.manualText(support.effectTerms.save)).toMatch(/does not roll, calculate or validate the save/);
  expect(pcConsent(support.effectTerms, 'character')).toMatchObject({ ok: false, code: 'pc_target_save_unsupported' });
  const approval = buildApproval({ support, tokens: tokens(), sourceRef: pc, targetRef: foe, roomId: 'r', mapId: 'm', actionEpoch: 'e', baseCommitSequence: 0, approvalId: uuid(2), roll });
  expect(approval.effectTerms).toEqual(termsFor(d));
});

test('GM planner: saved → payment and HP only; failed → payment, HP and the rider; an unrecorded branch refuses', () => {
  const { d, support } = admitted();
  const approval = buildApproval({ support, tokens: tokens(), sourceRef: pc, targetRef: foe, roomId: 'r', mapId: 'm', actionEpoch: 'e', baseCommitSequence: 0, approvalId: uuid(2), roll });
  const resolution = { gmConfirmed: true, timing: d.timing, timingNote: 'touch confirmed', evidence: 'private' };
  const plan = branch => planSpellCommand({ approval, contentHash: 'h', tokens: tokens(), roomId: 'r', mapId: 'm', finalAmount: 8, reason: '', adjudicated: true, resolution, branch });
  for (const branch of [undefined, 'applied', 'half']) expect(() => plan(branch)).toThrow(/saved or failed/);
  const saved = plan('saved');
  expect(saved.entries[1]).toEqual({ ref: foe, expectedRevision: 3, finalResources: { hp: { current: 26, temp: 0 } } });
  expect(JSON.parse(saved.extra.adjudication.chosenResult)).toEqual(resultFor(approval, resolution, null, 'saved'));
  expect(JSON.parse(saved.extra.adjudication.chosenResult)).toMatchObject({ branch: 'saved', conditionApplied: false, conditionInstanceId: null });
  const failed = plan('failed');
  expect(failed.entries[1].conditions).toEqual([{ op: 'add', recordId: uuid(2), record: recordFor(approval) }]); expect(isMovementModifier(recordFor(approval))).toBe(true);
  expect(failed.entries[1].finalResources).toEqual({ hp: { current: 26, temp: 0 } });
  expect(JSON.parse(failed.extra.adjudication.chosenResult)).toMatchObject({ branch: 'failed', conditionApplied: true, conditionInstanceId: uuid(2) });
  // Narration from the accepted receipt only.
  const receipt = r => ({ version: 1, authorization: { kind: 'owner-approval-gm', proposalId: uuid(2) }, ...r.extra, actors: r.entries });
  expect(spellReceipt({ success: true, receipt: receipt(saved) }).recorded.branch).toBe('saved');
  expect(capabilityOf(receipt(saved))).toMatchObject({ kind: 'effect', branch: 'saved', conditionApplied: false, saveText: 'Constitution DC 12, GM recorded' });
  expect(capabilityOf(receipt(failed))).toMatchObject({ kind: 'effect', branch: 'failed', conditionApplied: true });
});

test('no-save bundles keep their A10 terms, result and planner shape; M1 branches resolve through the shared module unchanged', () => {
  const { d, support } = admitted(wizard({ save: null }));
  expect(Object.keys(support.effectTerms)).toEqual(['direct', 'condition', 'timing']);
  expect(branchLines(support.effectTerms)).toEqual([]);
  const approval = buildApproval({ support, tokens: tokens(), sourceRef: pc, targetRef: foe, roomId: 'r', mapId: 'm', actionEpoch: 'e', baseCommitSequence: 0, approvalId: uuid(2), roll });
  const resolution = { gmConfirmed: true, timing: d.timing, timingNote: 'ok', evidence: '' };
  const plan = planSpellCommand({ approval, contentHash: 'h', tokens: tokens(), roomId: 'r', mapId: 'm', finalAmount: 8, reason: '', adjudicated: true, resolution });
  const chosen = JSON.parse(plan.extra.adjudication.chosenResult);
  for (const k of ['branch', 'save', 'conditionApplied']) expect(Object.prototype.hasOwnProperty.call(chosen, k)).toBe(false);
  expect(plan.entries[1].conditions).toHaveLength(1);
  const m1 = { save: { ability: 'constitution', dc: 12, outcome: 'negates', scope: 'debuffConfig' } };
  expect(classEffect.branches(m1)).toEqual(['saved', 'failed']);
  expect([classEffect.riderApplies(m1, 'saved'), classEffect.riderApplies(m1, 'failed'), classEffect.riderApplies({ save: null }, 'applied')]).toEqual([false, true, true]);
});

test('Wizard control: the save is optional, defaults to negates, keeps the chosen expiry (manual or turn-boundary) and is dropped for a periodic effect', () => {
  let value = wizard({ save: null }).controlConfig.authoredCondition;
  const onChange = next => { value = next; };
  const { rerender } = render(<AuthoredConditionFields value={value} onChange={onChange} />);
  value = { ...value, expiryPolicy: 'target-end-count', occurrences: 3 };
  rerender(<AuthoredConditionFields value={value} onChange={onChange} />);
  fireEvent.click(screen.getByLabelText(/The target may save to negate this effect/));
  expect(value.save).toEqual({ ability: 'constitution', dc: 12, outcome: 'negates' });
  // Timed save branch: ticking the save never rewrites the authored expiry or its count.
  expect([value.expiryPolicy, value.occurrences]).toEqual(['target-end-count', 3]);
  rerender(<AuthoredConditionFields value={value} onChange={onChange} />);
  expect(screen.getByText(/both outcomes need active authenticated turn tracking/)).toBeTruthy();
  fireEvent.change(screen.getByLabelText(/^Expiry/), { target: { value: 'target-next-end' } });
  expect(value.save).toEqual({ ability: 'constitution', dc: 12, outcome: 'negates' });
  expect([value.expiryPolicy, value.occurrences]).toEqual(['target-next-end', undefined]);
  rerender(<AuthoredConditionFields value={value} onChange={onChange} />);
  fireEvent.change(screen.getByLabelText(/^Expiry/), { target: { value: 'gm-manual' } });
  expect(value.save).toEqual({ ability: 'constitution', dc: 12, outcome: 'negates' }); expect(value.expiryPolicy).toBe('gm-manual');
  rerender(<AuthoredConditionFields value={value} onChange={onChange} />);
  expect(screen.getByText(/With manual expiry the GM removes the instance/)).toBeTruthy();
  fireEvent.change(screen.getByLabelText(/Saving ability/), { target: { value: 'agility' } });
  expect(value.save.ability).toBe('agility');
  rerender(<AuthoredConditionFields value={value} onChange={onChange} />);
  expect(screen.getByText(/the VTT does not roll, calculate or check it/)).toBeTruthy();
  fireEvent.change(screen.getByLabelText(/Canonical effect/), { target: { value: 'periodic' } });
  expect(value.save).toBeUndefined();
});

test('timed save branch: a structured (next or counted) target-turn expiry compiles with the save; the planner installs the timed rider only on "failed"', () => {
  const timed = (policy, occurrences) => { const r = wizard(); for (const c of [r.controlConfig.authoredCondition, r.authoredDraft.controlConfig.authoredCondition]) Object.assign(c, { expiryPolicy: policy }, occurrences ? { occurrences } : {}); return r; };
  for (const [policy, n] of [['target-next-start'], ['target-next-end'], ['target-start-count', 2], ['target-end-count', 3]]) {
    const m = definitionFromWizard(timed(policy, n), { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });
    expect(m.ok).toBe(true);
    expect(m.definition.timing.expiryPolicy).toBe(policy); expect(m.definition.timing.occurrences).toBe(n);
    expect(m.definition.effects.save).toEqual({ scope: 'condition', ...SAVE });
  }
  // Invalid timing is still refused with the save selected (the outcome never bypasses definition validation).
  for (const [policy, n] of [['target-start-count', 1], ['target-end-count', 11], ['target-next-end', 2], ['one-round']]) expect(definitionFromWizard(timed(policy, n), { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' }).ok).toBe(false);
  const { d, support } = admitted(timed('target-end-count', 2));
  expect(describeEffect(support.effectTerms)).toMatch(/expires at the end of the target's 2nd upcoming turn/);
  const approval = buildApproval({ support, tokens: tokens(), sourceRef: pc, targetRef: foe, roomId: 'r', mapId: 'm', actionEpoch: 'e', baseCommitSequence: 0, approvalId: uuid(2), roll });
  expect(approval.effectTerms.timing).toEqual(d.timing);
  const resolution = { gmConfirmed: true, timing: d.timing, timingNote: 'touch confirmed', evidence: 'private' };
  const plan = branch => planSpellCommand({ approval, contentHash: 'h', tokens: tokens(), roomId: 'r', mapId: 'm', finalAmount: 8, reason: '', adjudicated: true, resolution, branch });
  expect(plan('saved').entries[1].conditions).toBeUndefined();
  const record = plan('failed').entries[1].conditions[0].record;
  expect([record.clockBoundary, record.clockOccurrences]).toEqual(['authored-target-end-count', 2]);
});

test('compatibility text for a timed save: without authenticated turn tracking the cast is refused and nothing is spent (no fall-back to GM removal)', () => {
  const r = wizard();
  for (const c of [r.controlConfig.authoredCondition, r.authoredDraft.controlConfig.authoredCondition]) c.expiryPolicy = 'target-next-end';
  const text = explainExecution(r, { roomId: 'r', classId: 'arcanoneer', shared: true, gm: false }).manual.join(' ');
  expect(text).toMatch(/Ending the effect: .*without it the GM's confirmation of the cast is refused and nothing is spent \(it never falls back to GM removal\)/);
  expect(text).not.toMatch(/otherwise the GM removes it/);
  expect(text).toMatch(/Rolling the save/);
});
