import { CAPABILITY, DEFINITION_HASH, RULING, UNAPPLIED, recordRiposteRoll, digitalRiposteRoll, ripostePlan, riposteReceipt } from '../riposteExecution';
import { buildFeed, actorKey } from '../acceptedResultFeed';
const source = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'p1', ownerUid: 'u', characterId: 'c' };
const target = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 'foe', instanceId: 'f1' };
const weapon = { slot: 'mainHand', itemId: 'sword', name: 'Sword', weaponType: 'sword', typeSource: 'item', die: 8, damageType: 'slicing', attribute: 'strength', score: 14, modifier: 2 };
const approval = { approvalId: 'a', opportunityId: 'o', roomId: 'r', source, target, weapon, roll: { mode: 'physical', faces: [3] } };
const tokens = [
  { id: 'pc', mapId: 'm', ownerUserId: 'u', position: { x: 25, y: 25 }, character: { id: 'c', name: 'PC', actionPoints: { current: 2 }, tempActionPoints: 1 }, state: { actorContract: { version: 1, revision: 0, primary: true, ...source } } },
  { id: 'foe', mapId: 'm', position: { x: 75, y: 25 }, state: { customName: 'Foe', currentHp: 20, tempHealth: 3, actorContract: { version: 1, revision: 0, ...target } } }
];
test('recording preserves modes/faces and uses existing digital continuation; no extra proficiency roll', () => {
  expect(recordRiposteRoll('physical', 8, [8, 3])).toEqual({ mode: 'physical', faces: [8, 3] });
  const rng = jest.fn().mockReturnValueOnce(0.99).mockReturnValueOnce(0.25);
  expect(digitalRiposteRoll(8, rng)).toEqual({ mode: 'digital', faces: [8, 3] });
  expect(rng).toHaveBeenCalledTimes(2);
  expect(() => recordRiposteRoll('physical', 8, [9])).toThrow();
});
test('GM final damage is not face+modifier/basic-strike formula; exactly1AP temp-first and HP only', () => {
  const plan = ripostePlan({ approval, contentHash: 'h', tokens, outcome: 'hit', amount: 7, confirmed: true, parentKeys: { attack: 'private', parry: 'private2' }, offerHash: 'private3' });
  expect(plan.entries[0].finalResources).toEqual({ ap: { current: 2, temp: 0 } });
  expect(plan.entries[1].finalResources).toEqual({ hp: { current: 16, temp: 0 } });
  expect(plan.extra.adjudication.definitionVersionOrHash).toBe(DEFINITION_HASH);
  expect(plan.extra.adjudication.adjustmentReason).toBe(RULING);
  expect(JSON.parse(plan.extra.adjudication.chosenResult).notApplied).toBe(UNAPPLIED);
  expect(plan.entries.every(e => e.conditions === undefined && e.classPayment === undefined)).toBe(true);
  expect(() => ripostePlan({ approval, contentHash: 'h', tokens, outcome: 'miss', amount: 1, confirmed: true })).toThrow(/miss/);
});
test('named accepted receipt drives HP/absorbed floats and1AP narration; paid miss has no HP float', () => {
  const receipt = { version: 1, roomId: 'r', commandId: 'cmd', source, target, authorization: { kind: 'owner-approval-gm' },
    adjudication: { definitionVersionOrHash: DEFINITION_HASH, finalAmount: 7, chosenResult: JSON.stringify({ capability: CAPABILITY, opportunityId: 'o', rollOutcome: 'hit' }) },
    actors: [{ ref: source, beforeRevision: 0, finalResources: { hp: { current: 30, temp: 0 }, ap: { current: 2, temp: 0 }, mana: { current: 0, temp: 0 } } },
      { ref: target, beforeRevision: 0, finalResources: { hp: { current: 16, temp: 0 }, ap: { current: 2, temp: 0 }, mana: { current: 0, temp: 0 } } }] };
  const before = { [actorKey(source)]: { revision: 0, name: 'PC', pools: { hp: { current: 30, temp: 0 }, ap: { current: 2, temp: 1 }, mana: { current: 0, temp: 0 } } },
    [actorKey(target)]: { revision: 0, name: 'Foe', pools: { hp: { current: 20, temp: 3 }, ap: { current: 2, temp: 0 }, mana: { current: 0, temp: 0 } } } };
  const viewer = { reportable: () => true, rendered: () => true };
  const feed = buildFeed({ result: { receipt }, before, viewer, live: true });
  expect(feed.narration.text).toMatch(/Riposte/); expect(feed.narration.arithmetic).toMatch(/AP −1/);
  expect(feed.floats[0].parts.map(p => p.text)).toEqual(['−4 HP', '3 absorbed']);
  receipt.adjudication.chosenResult = JSON.stringify({ capability: CAPABILITY, opportunityId: 'o', rollOutcome: 'miss' });
  receipt.adjudication.finalAmount = 0; receipt.actors[1].finalResources.hp = { current: 20, temp: 3 };
  expect(buildFeed({ result: { receipt }, before, viewer, live: true }).floats).toEqual([]);
  expect(riposteReceipt({ receipt }).chosen.rollOutcome).toBe('miss');
});
