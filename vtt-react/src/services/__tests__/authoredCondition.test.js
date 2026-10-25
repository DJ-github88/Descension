import { definitionFromWizard } from '../authoredAbility';
import { itemAbilitySupport, snapshotAbility, editItemAbility } from '../itemAuthoredAbility';
import { planSpellCommand, spellReceipt } from '../spellConsequence';
import { recordFor, resultFor, CAPABILITY } from '../authoredCondition';
import { isStunned, holdsStunned, expiryLabel } from '../sharedConditionProfile';
import { capabilityOf } from '../acceptedResultFeed';
const uuid = '10000000-0000-4000-8000-000000000001';
const source = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 's', instanceId: 'source' }, target = { ...source, tokenId: 't', instanceId: 'target' };
const timing = { expiryPolicy: 'gm-manual', durationText: 'An authored boundary', authoredDuration: { durationType: 'ambiguous', value: 'several beats' }, gmNote: 'GM resolves eligibility and saves.' };
function saved(name = 'Still Bell') {
  const d = { name, description: '', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['control'],
    controlConfig: { authoredCondition: { profile: CAPABILITY, conditionKey: 'stunned', expiryPolicy: 'gm-manual', durationText: timing.durationText, gmNote: timing.gmNote } }, durationConfig: timing.authoredDuration,
    resourceCost: { actionPoints: 0, mana: 0 }, targetingConfig: { targetingType: 'single', maxTargets: 1, rangeDistance: 30, rangeType: 'ranged', targetRestrictions: ['any'] } };
  return { ...JSON.parse(JSON.stringify(d)), authoredDefinitionId: uuid, authoredDraft: d };
}
const approval = { approvalId: uuid, source, target, spell: { definitionId: 'authored:exact', definitionHash: `${CAPABILITY}/${'a'.repeat(64)}`, name: 'Still Bell', kind: 'condition', damageTypes: [] },
  price: { ap: 0, mana: 0 }, roll: null, classPayment: null, resolution: { gmConfirmed: true, timing, timingNote: 'GM rules the boundary; removes manually', evidence: 'Manual save failed' } };
test('whole Wizard profile is explicit, preserves ambiguous duration and works for two names', () => {
  for (const name of ['Still Bell', 'Quiet Anchor']) {
    const r = saved(name), before = JSON.stringify(r), d = definitionFromWizard(r, { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });
    expect(d.ok).toBe(true); expect(d.definition.effect).toEqual({ kind: 'condition', conditionKey: 'stunned' }); expect(d.definition.timing).toEqual(timing); expect(JSON.stringify(r)).toBe(before);
    expect(itemAbilitySupport(snapshotAbility(r)).ok).toBe(true);
  }
  const nameOnly = saved(); delete nameOnly.authoredDraft.controlConfig.authoredCondition.profile; expect(definitionFromWizard(nameOnly, {}).ok).toBe(false);
});
test('shared compact editing keeps the complete condition record and prices without introducing damage', () => {
  const association = snapshotAbility(saved()), next = editItemAbility(association, { name: 'Quiet Anchor', description: '', kind: 'condition', ap: 1, mana: 3, range: 30, restriction: 'enemy', authoredCondition: association.record.controlConfig.authoredCondition });
  expect(itemAbilitySupport(next).ok).toBe(true); expect(next.record.authoredDraft.durationConfig).toEqual(timing.authoredDuration); expect(next.record.damageConfig).toBeUndefined(); expect(next.record.authoredDraft.resourceCost.actionPoints).toBe(1);
});
test('planner needs no die, preserves success evidence, uses canonical C2 and generates no HP operation', () => {
  const tokens = [source, target].map(ref => ({ id: ref.tokenId, mapId: 'm', state: { actorContract: { ...ref, version: 1, revision: 1 }, currentActionPoints: 4, tempActionPoints: 1, currentMana: 10, tempMana: 0, conditions: [] } }));
  const p = planSpellCommand({ approval, contentHash: 'hash', tokens, roomId: 'r', mapId: 'm', adjudicated: true });
  expect(p.entries[0].finalResources).toEqual({ ap: { current: 4, temp: 1 } }); expect(p.entries[1].finalResources).toBeUndefined();
  const c = p.entries[1].conditions[0].record; expect(isStunned(c)).toBe(true); expect(c).toEqual(recordFor(approval)); expect(expiryLabel(c)).toMatch(/authored boundary.*GM removes/);
  expect(holdsStunned({ state: { actorContract: target, conditions: [c] } })).toBe(true);
  expect(JSON.parse(p.extra.adjudication.chosenResult)).toEqual(resultFor(approval));
  expect(() => planSpellCommand({ approval, tokens, roomId: 'r', mapId: 'm', adjudicated: false })).toThrow(/GM/);
  const receipt = { version: 1, authorization: { kind: 'gm-creature-ability', proposalId: uuid }, ...p.extra, actors: p.entries };
  expect(spellReceipt({ success: true, receipt }).recorded.kind).toBe('condition'); expect(capabilityOf(receipt).kind).toBe('condition');
});
