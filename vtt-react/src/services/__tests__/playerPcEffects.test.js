import { buildApproval, planSpellCommand } from '../spellConsequence';
import { refOf } from '../actorConsequenceService';

const roomId = 'room', mapId = 'map';
const pc = (id, owner) => ({ kind: 'character', roomId, mapId, tokenId: id, instanceId: `instance-${id}`, ownerUid: owner, characterId: id });
const source = pc('caster', 'source-owner'), target = pc('target', 'target-owner');
const creature = { kind: 'creature', roomId, mapId, tokenId: 'foe', instanceId: 'instance-foe' };
const token = ref => ({ id: ref.tokenId, mapId, ownerUserId: ref.ownerUid,
  character: { id: ref.characterId, health: { current: 18, max: 20 }, tempHealth: 2, actionPoints: { current: 4 }, mana: { current: 10 } },
  state: { actorContract: { ...ref, version: 1, primary: true, revision: 2 }, conditions: [], currentHp: 18, tempHealth: 2, maxHp: 20 } });
const tokens = () => [source, target, creature].map(token);
const support = (amount = 2, direct = null) => ({ supported: true, kind: 'effect', definitionId: `authored:10000000-0000-4000-8000-000000000002:1:${'a'.repeat(64)}`, definitionHash: `authored-effect:v1/${'a'.repeat(64)}`,
  name: 'Witness', damageTypes: direct?.damageTypes || [], payment: { affordable: true, classPayment: null }, price: { ap: 1, mana: 2 }, reading: { reading: '1d6' },
  effectTerms: { direct, condition: { kind: 'attribute', attribute: 'agility', amount, label: amount > 0 ? 'Quickened' : 'Leaden' },
    timing: { expiryPolicy: 'gm-manual', durationText: 'Until removed', gmNote: 'GM rules' } } });
const roll = total => ({ reading: '1d6', mode: 'physical', dice: [{ sides: 6, faces: [total] }], constant: 0, total });
const approve = (s = support(), overrides = {}) => buildApproval({ support: s, tokens: tokens(), sourceRef: source, targetRef: target, roomId, mapId,
  actionEpoch: 'epoch', baseCommitSequence: 0, approvalId: '10000000-0000-4000-8000-000000000001', ...overrides });
const plan = (approval, overrides = {}) => planSpellCommand({ approval, contentHash: 'hash', tokens: tokens(), roomId, mapId, finalAmount: approval.roll?.total || 0,
  reason: '', adjudicated: true, resolution: { gmConfirmed: true, timing: approval.effectTerms.timing, timingNote: 'Range resolved', evidence: '' }, ...overrides });

test.each([2, -2])('ordinary PC approval binds the complete %s Agility rider and plans one exact payment/install', amount => {
  const a = approve(support(amount)); expect(a.target).toEqual(target); expect(a.roll).toBeNull();
  const p = plan(a); expect(p.entries[0].finalResources).toEqual({ ap: { current: 3, temp: 0 }, mana: { current: 8, temp: 0 } });
  expect(p.entries[1].ref).toEqual(target); expect(p.entries[1].conditions[0].record.effects).toEqual({ agility: amount });
  expect(p.entries[1].finalResources).toBeUndefined();
});
test('exact PC identity refuses replacement, owner change, secondary attachment, self and cross-map; creature route remains', () => {
  for (const changed of [{ ...target, instanceId: 'replacement' }, { ...target, ownerUid: 'other' }, { ...target, characterId: 'other' }, { ...target, mapId: 'other' }]) {
    expect(() => approve(support(), { targetRef: changed })).toThrow();
  }
  const secondary = tokens(); secondary[1].state.actorContract.primary = false;
  expect(() => approve(support(), { tokens: secondary })).toThrow(/primary/);
  expect(() => approve(support(), { targetRef: source })).toThrow(/distinct/);
  expect(plan(approve(support(-2), { targetRef: creature })).entries[1].ref).toEqual(creature);
  expect(refOf(token(target))).toEqual(target);
});
test('compatible direct PC bundles read character HP: capped healing and temp-first damage', () => {
  let a = approve(support(2, { kind: 'healing', formula: '1d6', damageTypes: [] }), { roll: roll(5) });
  expect(plan(a).entries[1].finalResources.hp).toEqual({ current: 20, temp: 2 });
  // Deliberately reaches the server's existing owner_reapproval_required + closure contract.
  expect(plan(a, { finalAmount: 4, reason: 'Changed proposal' }).extra.adjudication.finalAmount).toBe(4);
  a = approve(support(-2, { kind: 'damage', formula: '1d6', damageTypes: ['arcane'] }), { roll: roll(5) });
  expect(plan(a).entries[1].finalResources.hp).toEqual({ current: 15, temp: 0 });
  expect(() => plan(a, { finalAmount: 0, reason: 'No damage' })).toThrow(/bundle_zero_damage_unsupported/);
});
test('conflicting PC bundles refuse before approval; zero-damage entry gate stays closed', () => {
  expect(() => approve(support(2, { kind: 'damage', formula: '1d6' }), { roll: roll(3) })).toThrow(/Refused whole/);
  expect(() => approve(support(-2, { kind: 'healing', formula: '1d6' }), { roll: roll(3) })).toThrow(/Refused whole/);
  expect(() => approve(support(-2, { kind: 'damage', formula: '1d6' }), { roll: roll(0) })).toThrow(/bundle_zero_damage_unsupported/);
});
