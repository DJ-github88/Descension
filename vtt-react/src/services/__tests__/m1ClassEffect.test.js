/* M1 class-effect:v1 client planner, compiler, disclosure and narration. The shipped profile has no Class HQ
 * confirmation; tests that need an admitted profile mark it with an explicit TEST FIXTURE reference in memory. */
import { CLASS_DATA_MAP } from '../../data/classSpellGenerator';
import { supportSpell, buildApproval, planSpellCommand, recordRoll, spellReceipt, sha256Hex, readFormula } from '../spellConsequence';
import { canonical } from '../featherSlash';
import * as classEffect from '../classEffect';
import profiles from '../../data/classEffectProfiles.json';
import { capabilityOf } from '../acceptedResultFeed';
import { classOutcomeText } from '../spellConsequenceService';
import { isMovementModifier, movementBreakdown, makeMovementRecord } from '../sharedConditionProfile';

const HASH = 'ff1b91e10d21655d5dcbf16660b66a81330c8d1fc3f8570d9b62856b1d7e1649';
const ENTRY = profiles.profiles.find(e => e.recordHash === HASH);
const FIXTURE = { reference: 'TEST FIXTURE ONLY — not a Class HQ confirmation' };
const stats = { strength: 12, agility: 11, constitution: 13, intelligence: 12, spirit: 14, charisma: 9 };
const spheres = list => ({ type: 'elementalSpheres', spheres: list });
const room = 'room-m1', map = 'map-a';
const pcRef = { kind: 'character', roomId: room, mapId: map, tokenId: 'pc', instanceId: 'i-pc', ownerUid: 'owner', characterId: 'char' };
const foeRef = { kind: 'creature', roomId: room, mapId: map, tokenId: 'foe', instanceId: 'i-foe' };
const pcToken = () => ({ id: 'pc', mapId: map, ownerUserId: 'owner', character: { id: 'char', name: 'Ilse', health: { current: 20, max: 40 }, mana: { current: 10, max: 30 },
  actionPoints: { current: 2, max: 5 }, tempHealth: 0, tempMana: 3, tempActionPoints: 1 }, state: { actorContract: { version: 1, ...pcRef, revision: 4, primary: true }, conditions: [] } });
const foeToken = (conditions = []) => ({ id: 'foe', mapId: map, creatureId: 'grimmstalk', state: { currentHp: 30, tempHealth: 4, maxHp: 250, conditions, actorContract: { version: 1, ...foeRef, revision: 7 } } });
const character = { class: 'Arcanoneer', classResource: spheres(['rime', 'rime', 'ember']), stats };
const raw = () => CLASS_DATA_MAP.Arcanoneer.spells.find(s => s.id === 'arc_frost_touch');

afterEach(() => { ENTRY.review.classHq = null; });

describe('M1 class-effect:v1 client support', () => {
  test('the locked Rime-Iron Clasp record still has the pinned hash', () => {
    expect(sha256Hex(canonical(raw()))).toBe(HASH);
  });
  test('without a Class HQ confirmation the record stays manual, with the reason', () => {
    const support = supportSpell({ id: 'arc_frost_touch' }, character);
    expect(support.supported).toBe(false);
    expect(support.reason).toMatch(/Class HQ has not confirmed/);
  });
  test('admitted: P9 price, typed rime payment and effective-INT reading; branches and disclosure from the profile', () => {
    ENTRY.review.classHq = FIXTURE;
    const support = supportSpell({ id: 'arc_frost_touch' }, character);
    expect(support.supported).toBe(true);
    expect(support.kind).toBe('class-effect');
    expect(support.price).toEqual({ ap: 1, mana: 4 });
    expect(support.payment.classPayment).toEqual({ domain: 'elementalSpheres', before: spheres(['rime', 'rime', 'ember']), after: spheres(['ember']), price: { costs: ['rime', 'rime'], gains: [] } });
    expect(support.reading.constant).toBe(3);
    expect(support.branchLines.map(l => l.branch)).toEqual(['saved', 'failed']);
    expect(support.disclosure.notAutomated.join(' ')).toMatch(/\+1d4 bonus damage from the next physical attack/);
    expect(support.disclosure.status).toBe('Partially automated');
    expect(support.effectTerms.timing).toEqual(expect.objectContaining({ expiryPolicy: 'gm-manual', durationText: 'Movement speed reduced by 10 feet for 1 round' }));
  });
  test('the shared reader is byte-identical to the P9 reader for the pinned formula', () => {
    for (const intelligence of [0, 7, 12, 16, 33]) {
      const p9 = readFormula('1d8 + intelligence/4', { ...stats, intelligence }), shared = classEffect.readFormula('1d8 + intelligence/4', { intelligence });
      expect([shared.reading, shared.constant, shared.dice]).toEqual([p9.reading, p9.constant, p9.dice]);
    }
  });
  test('a copy with altered mechanics or an unaffordable bank is not executed', () => {
    ENTRY.review.classHq = FIXTURE;
    expect(supportSpell({ ...raw(), damageConfig: { ...raw().damageConfig, formula: '2d8' } }, character).supported).toBe(false);
    expect(supportSpell({ id: 'arc_frost_touch' }, { ...character, classResource: spheres(['ember']) }).payment.affordable).toBe(false);
  });
});

describe('M1 planner: one command per recorded branch', () => {
  const setup = (conditions = []) => {
    ENTRY.review.classHq = FIXTURE;
    const support = supportSpell({ id: 'arc_frost_touch' }, character);
    const roll = recordRoll('physical', support.reading, [[5]]);
    const approval = buildApproval({ support, tokens: [pcToken(), foeToken(conditions)], sourceRef: pcRef, targetRef: foeRef, roomId: room, mapId: map, actionEpoch: 'e', baseCommitSequence: 3, roll,
      approvalId: '00000000-0000-4000-8000-0000000000a1' });
    return { support, approval, tokens: [pcToken(), foeToken(conditions)] };
  };
  test('the approval binds price, payment, terms and disclosure', () => {
    const { approval } = setup();
    expect(approval.spell).toEqual({ definitionId: 'arc_frost_touch', definitionHash: `class-effect:v1/${HASH}`, name: 'Rime-Iron Clasp', kind: 'class-effect', damageTypes: ['rime'] });
    expect(approval.effectTerms).toEqual(ENTRY.terms);
    expect(approval.disclosure).toEqual(classEffect.disclosure(ENTRY));
    expect(approval.roll.total).toBe(8);
    expect(approval.rollAttributes).toEqual({ intelligence: 12 });
    expect(classEffect.rollMatches(ENTRY.terms.direct.formula, approval.roll, approval.rollAttributes)).toBe(true);
    expect(classEffect.rollMatches(ENTRY.terms.direct.formula, { ...approval.roll, constant: 4 }, approval.rollAttributes)).toBe(false);
  });
  test('saved: payment and HP only; failed: payment, HP and Frozen Limbs; an unbound branch is refused', () => {
    const { approval, tokens } = setup();
    const saved = planSpellCommand({ approval, contentHash: 'c'.repeat(64), tokens, roomId: room, mapId: map, finalAmount: 8, adjudicated: true, branch: 'saved' });
    expect(saved.entries[0]).toEqual({ ref: pcRef, expectedRevision: 4, finalResources: { ap: { current: 2, temp: 0 }, mana: { current: 9, temp: 0 } },
      classPayment: { mode: 'spell', domain: 'elementalSpheres', approvalHash: 'c'.repeat(64) } });
    expect(saved.entries[1]).toEqual({ ref: foeRef, expectedRevision: 7, finalResources: { hp: { current: 26, temp: 0 } } });
    expect(JSON.parse(saved.extra.adjudication.chosenResult)).toEqual(expect.objectContaining({ branch: 'saved', riderApplied: false, automation: 'partial' }));
    const failed = planSpellCommand({ approval, contentHash: 'c'.repeat(64), tokens, roomId: room, mapId: map, finalAmount: 8, adjudicated: true, branch: 'failed' });
    const record = failed.entries[1].conditions[0].record;
    expect(isMovementModifier(record)).toBe(true);
    expect(record.effectDefinition).toBe(`class:arcanoneer:arc_frost_touch:${HASH}`);
    expect(movementBreakdown(30, [record]).result).toBe(20);
    expect(() => planSpellCommand({ approval, contentHash: 'c'.repeat(64), tokens, roomId: room, mapId: map, finalAmount: 8, adjudicated: true, branch: 'applied' })).toThrow(/saved or failed/);
    expect(() => planSpellCommand({ approval, contentHash: 'c'.repeat(64), tokens, roomId: room, mapId: map, finalAmount: 6, adjudicated: true, branch: 'failed' })).toThrow(/Explain the adjustment/);
  });
  test('failed again from the same source refreshes (A11); a same-named different definition refuses before anything is sent', () => {
    const first = setup();
    const prior = planSpellCommand({ approval: first.approval, contentHash: 'c'.repeat(64), tokens: first.tokens, roomId: room, mapId: map, finalAmount: 8, adjudicated: true, branch: 'failed' }).entries[1].conditions[0].record;
    const again = setup([prior]);
    const refresh = planSpellCommand({ approval: { ...again.approval, approvalId: '00000000-0000-4000-8000-0000000000a2' }, contentHash: 'd'.repeat(64), tokens: again.tokens, roomId: room, mapId: map, finalAmount: 8, adjudicated: true, branch: 'failed' });
    expect(refresh.entries[1].conditions.map(op => op.op)).toEqual(['remove', 'add']);
    expect(JSON.parse(refresh.extra.adjudication.chosenResult).combination).toEqual({ outcome: 'refreshed', replacesInstanceId: first.approval.approvalId });
    const otherId = '00000000-0000-4000-8000-0000000000b1';
    const impostor = makeMovementRecord(foeRef, otherId, { sourceOccurrence: `authored-effect:${otherId}`, timing: 'manual', sourceActor: foeRef, authoredDuration: 'Until thawed',
      feet: -5, label: 'Frozen Limbs', effectDefinition: `authored:${otherId}:1:${'a'.repeat(64)}` });
    const blocked = setup([impostor]);
    expect(() => planSpellCommand({ approval: blocked.approval, contentHash: 'c'.repeat(64), tokens: blocked.tokens, roomId: room, mapId: map, finalAmount: 8, adjudicated: true, branch: 'failed' })).toThrow(/different effect named Frozen Limbs/);
  });
});

describe('M1 receipts and narration', () => {
  const receipt = branch => ({ success: true, status: 'accepted-live', receipt: { version: 1, roomId: room, commandId: 'cmd', submitterUid: 'gm', acceptedAt: 1, checkpointRevision: null,
    authorization: { kind: 'owner-approval-gm', proposalId: 'p1' }, source: pcRef, target: foeRef,
    actors: [{ ref: pcRef, finalResources: {}, conditions: [] }, { ref: foeRef, finalResources: {}, conditions: [] }],
    adjudication: { definitionId: 'arc_frost_touch', definitionVersionOrHash: `class-effect:v1/${HASH}`, finalAmount: 8, adjustmentReason: '',
      chosenResult: JSON.stringify({ capability: 'class-effect:v1', approvalId: 'p1', kind: 'class-effect', gmConfirmed: true, roll: { mode: 'physical', dice: [{ sides: 8, faces: [5] }], constant: 3, total: 8, reading: 'r' },
        direct: { kind: 'damage', formula: '1d8 + intelligence/4', damageTypes: ['rime'] }, branch, riderApplied: branch === 'failed', conditionInstanceId: branch === 'failed' ? 'p1' : null,
        rider: { kind: 'movement', feet: -10, label: 'Frozen Limbs' }, automation: 'partial', spellName: 'Rime-Iron Clasp' }) } } });
  test('accepted receipts parse; the outcome wording follows the recorded branch', () => {
    const failed = spellReceipt(receipt('failed')), saved = spellReceipt(receipt('saved'));
    expect(failed.recorded.kind).toBe('class-effect');
    expect(classOutcomeText(failed.recorded)).toMatch(/fails the save|failed the save/);
    expect(classOutcomeText(failed.recorded)).toMatch(/Frozen Limbs \(movement −10 ft\) applied/);
    expect(classOutcomeText(saved.recorded)).toMatch(/target saved \(GM recorded\): no new rider/);
  });
  test('observer narration names the branch and says the record is only partially automated', () => {
    expect(capabilityOf(receipt('failed').receipt)).toEqual(expect.objectContaining({ kind: 'class-effect', branch: 'failed', riderApplied: true, effect: 'Frozen Limbs (movement −10 ft)' }));
    expect(capabilityOf(receipt('saved').receipt).branch).toBe('saved');
  });
});
