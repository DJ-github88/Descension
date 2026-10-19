/** P12C-B1 pure helpers: advisory distance, hit-testing over visible tokens only, roll-draft binding. */
import { planarFeet, ringPoints, tokenAt, rangeText, draftContext, sameDraftContext, describeDraft, withDiscarded } from '../targetPick';

const ref = (kind, tokenId) => ({ kind, roomId: 'r', mapId: 'm', tokenId, instanceId: `${tokenId}-1` });
const entries = [{ ref: ref('creature', 'a'), position: { x: 100, y: 0 }, name: 'A' }, { ref: ref('creature', 'hidden'), position: { x: 0, y: 100 }, name: 'H' },
  { ref: ref('character', 'me'), position: { x: 0, y: 0 }, name: 'Me' }];

test('advisory planar centre distance and ring', () => {
  expect(planarFeet({ x: 0, y: 0 }, { x: 100, y: 0 }, 50, 5)).toBe(10);
  expect(planarFeet({ x: 0 }, { x: 1, y: 1 }, 50, 5)).toBeNull();
  expect(ringPoints({ x: 0, y: 0 }, 10, 4).map(p => Math.round(p.x))).toEqual([10, 0, -10, -0]);
  expect(rangeText(12, 10, 'card range 10 ft')).toMatch(/outside card range 10 ft \(advisory\): GM decides/);
  expect(rangeText(8, 10, 'card range 10 ft')).toMatch(/within/);
  expect(rangeText(null, 10, '')).toMatch(/GM adjudicates/);
});
test('hit-testing never returns a token the viewer cannot see; non-candidates carry a reason', () => {
  const visible = r => r.tokenId !== 'hidden';
  const opts = { visible, candidates: [ref('creature', 'a')], reasonFor: () => 'Not a creature.', hitRadius: 30 };
  expect(tokenAt(entries, { x: 0, y: 95 }, opts)).toBeNull();
  expect(tokenAt(entries, { x: 98, y: 3 }, opts)).toMatchObject({ candidate: true, reason: '' });
  expect(tokenAt(entries, { x: 2, y: 2 }, opts)).toMatchObject({ candidate: false, reason: 'Not a creature.' });
});
test('a draft is bound to its exact action context and never matches another weapon or spell', () => {
  const sword = draftContext('strike', { characterId: 'c', sourceRef: ref('character', 'me'), actionId: 'mh_standard_attack', slot: 'mainHand', itemId: 'sword', weaponType: 'sword', die: 8 });
  const axe = draftContext('strike', { characterId: 'c', sourceRef: ref('character', 'me'), actionId: 'mh_standard_attack', slot: 'mainHand', itemId: 'axe', weaponType: 'axe', die: 8 });
  expect(sameDraftContext(sword, { ...sword })).toBe(true);
  expect(sameDraftContext(sword, axe)).toBe(false);
  expect(sameDraftContext(draftContext('spell', { characterId: 'c', sourceRef: ref('character', 'me'), spellId: 'x' }), draftContext('spell', { characterId: 'c', sourceRef: ref('character', 'me'), spellId: 'y' }))).toBe(false);
  expect(describeDraft({ context: sword, label: 'Iron Sword', roll: { faces: [2] }, proficiencyRoll: { faces: [3] } })).toBe('Iron Sword (sword d8): [2] · proficiency [3]');
  const list = Array.from({ length: 7 }).reduce(acc => withDiscarded(acc, { context: sword }), []);
  expect(list).toHaveLength(5);
});
