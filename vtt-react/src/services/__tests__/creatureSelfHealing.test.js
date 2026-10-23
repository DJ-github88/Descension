import { creatureSelfHealing } from '../authoredAbility';
import { planSpellCommand, recordRoll, spellReceipt } from '../spellConsequence';
import { buildFeed, actorKey, projectionOf } from '../acceptedResultFeed';

const source = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 'self', instanceId: 'exact' };
const token = { id: 'self', mapId: 'm', name: 'Mender', state: { actorContract: { version: 1, ...source, revision: 3 }, currentHp: 8, maxHp: 10, tempHealth: 2, currentMana: 10, tempMana: 2, currentActionPoints: 4, tempActionPoints: 1 } };
const roll = recordRoll('physical', { reading: '1d8+1', dice: [{ sides: 8, count: 1 }], constant: 1 }, [[4]]);
const approval = { approvalId: 'attempt', source, target: source, spell: { definitionId: 'authored:exact:1:hash', definitionHash: 'authored-immediate:v1/hash', name: 'Mend', kind: 'healing', damageTypes: [] }, roll, price: { ap: 2, mana: 3 }, classPayment: null };
const plan = (a = approval) => planSpellCommand({ approval: a, tokens: [token], contentHash: 'hash', roomId: 'r', mapId: 'm', finalAmount: 5, adjudicated: true });
test('shared planner merges self AP/mana/HP in one entry with verified capped restoration metadata', () => {
  const p = plan(); expect(p.entries).toHaveLength(1); expect(p.entries[0]).toMatchObject({ ref: source, expectedRevision: 3, finalResources: { hp: { current: 10, temp: 2 }, ap: { current: 3, temp: 0 }, mana: { current: 9, temp: 0 } } });
  expect(JSON.parse(p.extra.adjudication.chosenResult)).toMatchObject({ actualHealing: 2, roll });
  expect(plan({ ...approval, price: { ap: 0, mana: 0 } }).entries[0].finalResources).toEqual({ hp: { current: 10, temp: 2 } });
});
test('self compatibility is explicit: self/any including range0; enemy/ally and incompatible per-effect targeting refuse', () => {
  for (const restriction of ['self', 'any']) expect(creatureSelfHealing({ effect: { kind: 'healing' }, targeting: { restriction, rangeFeet: 0 } })).toBe(true);
  for (const restriction of ['enemy', 'ally', undefined]) expect(creatureSelfHealing({ effect: { kind: 'healing' }, targeting: { restriction, rangeFeet: 0 } })).toBe(false);
  expect(creatureSelfHealing({ effect: { kind: 'damage' }, targeting: { restriction: 'self' } })).toBe(false);
  expect(creatureSelfHealing({ effect: { kind: 'healing' }, targeting: { restriction: 'self' } }, { authoredDraft: { healingConfig: { targetType: 'ally' } } })).toBe(false);
});
test('one receipt actor yields one actual-healing float and one narration; hidden/history/zero produce no float', () => {
  const p = plan(), actor = { ref: source, beforeRevision: 3, afterRevision: 4, finalResources: { hp: { current: 10, temp: 2 }, ap: { current: 3, temp: 0 }, mana: { current: 9, temp: 0 } } };
  const result = { success: true, receipt: { version: 1, roomId: 'r', commandId: 'command', source, target: source, actors: [actor], adjudication: p.extra.adjudication, authorization: { kind: 'gm-creature-ability', proposalId: approval.approvalId }, checkpointRevision: null } };
  const input = { result, before: { [actorKey(source)]: projectionOf(token, 'creature') }, viewer: { reportable: () => true, rendered: () => true }, live: true };
  const feed = buildFeed(input); expect(feed.floats).toHaveLength(1); expect(feed.floats[0].parts).toEqual([{ kind: 'heal', amount: 2, text: '+2 HP' }]); expect(feed.narration.text).toContain('casts Mend on Self');
  const view = spellReceipt(result); expect(view.source).toBe(view.target); expect(view.receipt.actors).toHaveLength(1);
  expect(buildFeed({ ...input, live: false }).floats).toEqual([]);
  expect(buildFeed({ ...input, viewer: { reportable: () => false, rendered: () => false } })).toEqual({ floats: [], narration: null });
  actor.finalResources.hp.current = 8; expect(buildFeed(input).floats).toEqual([]);
});
