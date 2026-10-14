import { supportsFeatherSlash, recordedFaces, depleteTempFirst, creaturePayment, planFeatherSlash, rangeDiagnostic } from '../featherSlash';
import abilities from '../../../public/data/abilities.json';

const raw = abilities.grimmstalk.find(value => value.id === 'grimmstalk_feather_slash');
const placed = (id, kind = 'creature') => ({ id, creatureId: 'grimmstalk', mapId: 'canopy', ownerUserId: 'owner',
  character: { id: 'pc', health: { current: 30, max: 50 }, tempHealth: 4 },
  state: { actorContract: { version: 1, kind, roomId: 'room', mapId: 'canopy', tokenId: id, instanceId: `incarnation-${id}`, revision: 0,
    ...(kind === 'character' ? { ownerUid: 'owner', characterId: 'pc', primary: true } : {}) }, currentActionPoints: 2, tempActionPoints: 0, currentHp: 30, tempHealth: 4, currentMana: 0, tempMana: 0 } });
const ref = token => Object.fromEntries(Object.entries(token.state.actorContract).filter(([key]) => !['version', 'revision', 'primary'].includes(key)));
function setup() {
  const source = placed('A'), target = placed('B');
  return { raw, tokens: [source, target], sourceRef: ref(source), targetRef: ref(target), roomId: 'room', mapId: 'canopy', roll: recordedFaces('physical', [3, 5]), adjudicated: true, finalAmount: 10, reason: 'GM ruling' };
}
test('original capability is positive and fails closed on changed execution shapes', () => {
  expect(supportsFeatherSlash(raw)).toBe(true);
  for (const changed of [{ ...raw, spellType: 'PASSIVE' }, { ...raw, effectTypes: ['damage', 'control'] }, { ...raw, damageConfig: { ...raw.damageConfig, formula: 'Infinity' } }, { ...raw, resourceCost: { ...raw.resourceCost, mana: 1 } }, { ...raw, targetingConfig: { ...raw.targetingConfig, targetingType: 'area' } }, { ...raw, summonConfig: {} }]) expect(supportsFeatherSlash(changed)).toBe(false);
});
test('planner is pure, temp-first and exact two actor entries; PC HP uses its owning pool', () => {
  const input = setup(), before = JSON.stringify(input);
  const result = planFeatherSlash(input);
  expect(JSON.stringify(input)).toBe(before);
  expect(result.entries.map(actor => actor.finalResources)).toEqual([{ ap: { current: 1, temp: 0 } }, { hp: { current: 24, temp: 0 } }]);
  const pc = placed('PC', 'character'); input.tokens[1] = pc; input.targetRef = ref(pc);
  expect(planFeatherSlash(input).entries[1].finalResources.hp).toEqual({ current: 24, temp: 0 });
  pc.state.actorContract.primary = false;
  expect(() => planFeatherSlash(input)).toThrow(/primary/);
});
test('independent affordability guard refuses before a command for corrupt and insufficient pools', () => {
  for (const value of [0, '2', undefined, NaN, Infinity, -1]) {
    const input = setup(); input.tokens[0].state.currentActionPoints = value;
    expect(() => planFeatherSlash(input)).toThrow();
  }
  expect(creaturePayment({ state: { currentMana: 2, tempMana: 1 } }, { actionPoints: 0, mana: 2 })).toEqual({ mana: { current: 1, temp: 0 } });
  expect(() => creaturePayment({ state: { currentMana: 0, tempMana: 0 } }, { actionPoints: 0, mana: 1 })).toThrow(/Insufficient/);
  expect(depleteTempFirst(1, .5, 1, true)).toEqual({ current: .5, temp: 0 });
  expect(depleteTempFirst(3, 2, 99)).toEqual({ current: 0, temp: 0 });
});
test('faces and explicit final ruling remain finite, strict and bounded', () => {
  expect(recordedFaces('physical', [1, 1]).total).toBe(7); expect(recordedFaces('physical', [8, 8]).total).toBe(21);
  for (const value of [0, 9, 1.5, '', '3', null, NaN, Infinity]) expect(() => recordedFaces('physical', [value, 5])).toThrow();
  for (const finalAmount of [undefined, NaN, Infinity, -1, '10']) expect(() => planFeatherSlash({ ...setup(), finalAmount })).toThrow();
  expect(() => planFeatherSlash({ ...setup(), adjudicated: false })).toThrow(/explicitly/);
  expect(() => planFeatherSlash({ ...setup(), reason: '' })).toThrow(/Explain/);
  expect(planFeatherSlash({ ...setup(), finalAmount: 0 }).entries[1].finalResources.hp).toEqual({ current: 30, temp: 4 });
});
test('no identity fallback and missing geometry is diagnostic rather than automatic legality', () => {
  for (const targetRef of [null, { ...setup().targetRef, roomId: 'foreign' }, { ...setup().targetRef, mapId: 'default' }, { ...setup().targetRef, instanceId: 'retired' }, setup().sourceRef]) expect(() => planFeatherSlash({ ...setup(), targetRef })).toThrow();
  expect(rangeDiagnostic({}, {}, 50, 5)).toMatch(/GM adjudication required/);
  expect(rangeDiagnostic({ position: { x: 0, y: 0 } }, { position: { x: 50, y: 0 } }, 50, 5)).toMatch(/5.0 ft/);
});
