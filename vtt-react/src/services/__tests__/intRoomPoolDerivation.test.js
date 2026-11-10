/** Pool-derivation regression (standalone INT room pool repair). A shared ROOM attribute modifier must change the effective score
 * its approved consumers read (formula, basic strike) but must never change the sheet's STORED health/mana/AP pools when
 * the real sheet recalculation (updateEquipment / updateStat) runs. Personal (non-room) effects keep their existing
 * pool behaviour. No refill, clamp, migration or rewrite of saved values is asserted or introduced. */
import useCharacterStore from '../../store/characterStore';
import useConditionStore from '../../store/conditionStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useCreatureStore from '../../store/creatureStore';
import useGameStore from '../../store/gameStore';
import useAuthStore from '../../store/authStore';
import { registerStore } from '../../store/storeRegistry';
import { combatAttributes } from '../combatAttributes';
import { hydrateActorConditions, selectOwnerAttachment } from '../actorConsequenceService';
import * as profile from '../sharedConditionProfile';

const ID = '20000000-0000-4000-8000-000000000001';
const DEF = `authored:30000000-0000-4000-8000-000000000003:1:${'a'.repeat(64)}`;
const target = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc2', instanceId: 'i2', ownerUid: 'u2', characterId: 'c2' };
const source = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'i1', ownerUid: 'u1', characterId: 'c1' };
const make = (amount = 2, extra = {}) => profile.makeAttributeRecord(target, extra.id || ID, Object.assign({ sourceOccurrence: `authored-effect:${extra.id || ID}`, timing: 'manual',
  authoredDuration: 'While the charm holds', attribute: 'agility', amount, label: amount > 0 ? 'Quickened' : 'Leaden', sourceActor: source, effectDefinition: DEF }, extra));
const publicForm = record => { const { sourceActor, effectDefinition, ...rest } = record; return rest; }; // what a PC target's public view carries


const trace = [], all = [];
const snap = () => ({ health: { ...useCharacterStore.getState().health }, mana: { ...useCharacterStore.getState().mana }, actionPoints: { ...useCharacterStore.getState().actionPoints } });
const note = (label, attribute) => { const s = useCharacterStore.getState(); const row = { test: expect.getState().currentTestName.split(' â€º ').pop().slice(0, 40), label, attribute, effective: combatAttributes(s)[attribute], ...snap() }; trace.push(row); all.push(row); return row; };
const ref = target;
const character = { id: 'c2', currentCharacterId: 'c2', race: null, subrace: null, background: undefined, statsModel: 'base+earned@1',
  baseStats: { strength: 12, agility: 13, constitution: 12, intelligence: 14, spirit: 10, charisma: 12 },
  stats: { strength: 12, agility: 13, constitution: 12, intelligence: 14, spirit: 10, charisma: 12 }, levelUpHistory: {}, class: 'Arcanoneer', equipment: {} };
const pcToken = conditions => ({ id: 'pc2', ownerUserId: 'u2', character: { id: 'c2', health: { current: 20, max: 30 } }, state: { conditions, actorContract: { version: 1, ...ref, revision: 3, primary: true } } });
const sheet = () => useCharacterStore.getState();
const install = conditions => { useCharacterTokenStore.setState({ characterTokens: [pcToken(conditions)] }); expect(selectOwnerAttachment(ref).success).toBe(true); hydrateActorConditions(); };
const recalc = (item = null) => sheet().updateEquipment('ring1', item);
beforeAll(async() => {
  for (const store of [useCharacterStore, useConditionStore, useCharacterTokenStore, useCreatureStore, useGameStore, useAuthStore]) await store.persist?.rehydrate?.();
  await new Promise(r => setTimeout(r, 0));
});
beforeEach(() => {
  for (const [name, store] of [['characterStore', useCharacterStore], ['conditionStore', useConditionStore], ['characterTokenStore', useCharacterTokenStore], ['creatureStore', useCreatureStore], ['gameStore', useGameStore], ['authStore', useAuthStore]]) registerStore(name, store);
  useAuthStore.setState({ user: { uid: 'u2' } });
  useCharacterStore.setState({ ...character });
  useGameStore.setState({ isInMultiplayer: true, multiplayerRoom: { id: 'r' } });
  useConditionStore.setState({ activeBuffs: [], activeDebuffs: [] });
  useCreatureStore.setState({ creatureTokens: [], tokens: [] });
  trace.length = 0;
});
afterAll(() => { if (process.env.POOL_EVIDENCE) require('fs').writeFileSync(process.env.POOL_EVIDENCE, JSON.stringify(all, null, 2)); });

describe('room attribute modifiers never change stored pools through the real sheet recalculation', () => {
  test.each([['intelligence', 3, 'mana'], ['intelligence', -3, 'mana']])(
    '%s %i: apply â†’ equipment recalculation â†’ exact removal â†’ recalculation (effective score moves, stored pools do not)', (attribute, amount) => {
    install([]); recalc();
    const base = note('baseline after recalculation', attribute);
    install([publicForm(make(amount, { attribute }))]);
    const applied = note('modifier applied (hydrated)', attribute);
    expect(applied.effective).toBe(base.effective + amount);
    recalc(); recalc();
    const recalculated = note('after ordinary equipment recalculation', attribute);
    expect(recalculated.effective).toBe(base.effective + amount);             // approved consumers still read the changed score
    expect(recalculated.health).toEqual(base.health); expect(recalculated.mana).toEqual(base.mana); expect(recalculated.actionPoints).toEqual(base.actionPoints);
    sheet().updateStat(attribute, sheet().stats[attribute]);                  // the other real recalculation entry point
    expect(note('after updateStat recalculation', attribute)).toMatchObject({ health: base.health, mana: base.mana, actionPoints: base.actionPoints });
    install([]); recalc();
    const removed = note('after exact removal and recalculation', attribute);
    expect(removed.effective).toBe(base.effective); expect(removed.health).toEqual(base.health); expect(removed.mana).toEqual(base.mana);
    expect(sheet().stats[attribute]).toBe(character.stats[attribute]); expect(sheet().baseStats[attribute]).toBe(character.baseStats[attribute]);
  });
  test('reload/projection ordering: hydrating before or after the recalculation, and after a fresh character load, leaves the stored pools alone', () => {
    install([]); recalc(); const base = note('baseline', 'intelligence');
    // order 1: recalculation first, then the room record arrives (late projection), then another recalculation
    recalc(); install([publicForm(make(3, { attribute: 'intelligence' }))]); recalc();
    expect(note('record arrives after recalculation, then recalculation', 'intelligence')).toMatchObject({ effective: base.effective + 3, mana: base.mana, health: base.health });
    // order 2: fresh character load (store reset to saved values), record hydrated first, then recalculation
    useCharacterStore.setState({ ...character, health: { ...base.health }, mana: { ...base.mana }, actionPoints: { ...base.actionPoints } });
    install([publicForm(make(3, { attribute: 'intelligence' }))]); hydrateActorConditions(); recalc();
    expect(note('reload: hydrate first, then recalculation', 'intelligence')).toMatchObject({ effective: base.effective + 3, mana: base.mana, health: base.health });
    install([]); recalc();
    expect(note('removal after reload', 'intelligence')).toMatchObject({ effective: base.effective, mana: base.mana, health: base.health });
  });
  test('legitimate pool derivation is preserved: equipment and personal effects still move the stored pools, a room modifier on top adds nothing', () => {
    const ring = { id: 'ring', name: 'Ring', baseStats: { intelligence: { value: 1 } } };
    install([]); recalc(); const base = note('baseline', 'intelligence');
    recalc(ring); const withRing = note('equipment +1 INT', 'intelligence');
    expect(withRing.mana.max).toBe(base.mana.max + 5);                         // existing equipment â†’ pool derivation is unchanged
    install([publicForm(make(3, { attribute: 'intelligence' }))]); recalc(ring);
    expect(note('equipment + room modifier', 'intelligence')).toMatchObject({ effective: withRing.effective + 3, mana: withRing.mana });
    install([]); recalc();
    // a PERSONAL (non-room) buff keeps its existing pool effect
    useConditionStore.setState({ activeBuffs: [{ id: 'potion', name: 'Potion of Insight', targetId: 'player', effects: { intelligence: 2 } }], activeDebuffs: [] });
    recalc();
    expect(note('personal buff +2 INT', 'intelligence').mana.max).toBe(base.mana.max + 10);
    install([publicForm(make(3, { attribute: 'intelligence' }))]);
    useConditionStore.setState({ activeBuffs: [...useConditionStore.getState().activeBuffs.filter(r => r.id !== 'potion'), { id: 'potion', name: 'Potion of Insight', targetId: 'player', effects: { intelligence: 2 } }] }); recalc();
    expect(useConditionStore.getState().activeBuffs.filter(r => r.id === 'potion')).toHaveLength(1); // exactly one personal potion, so +2 is counted once
    expect(note('personal buff + room modifier', 'intelligence')).toMatchObject({ effective: base.effective + 2 + 3 });
    expect(trace.at(-1).mana.max).toBe(base.mana.max + 10);                    // only the personal buff reaches the pool
  });
});
