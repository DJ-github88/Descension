/** SpellActionBar consumable (slot -> "Drink / Consume") in a shared room: the item is removed and the sheet healed only after the room
 * took the stat condition. Real: SpellActionBar, conditionStore.addCondition, actorConsequenceService, characterStore and the other
 * stores. Fixture (disclosed): fake socket from support/sharedRoomFixture (recorded production refusal shape); inventory store is a
 * recording stub; chat is a recording stub. The owner is bound with selectOwnerAttachment (the production selection call). */
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import SpellActionBar from '../SpellActionBar';
import useCharacterStore from '../../../store/characterStore';
import useConditionStore from '../../../store/conditionStore';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useCreatureStore from '../../../store/creatureStore';
import useGameStore from '../../../store/gameStore';
import useAuthStore from '../../../store/authStore';
import usePartyStore from '../../../store/partyStore';
import useMapStore from '../../../store/mapStore';
import { registerStore } from '../../../store/storeRegistry';
import { selectOwnerAttachment } from '../../../services/actorConsequenceService';
import { resetUnresolvedForTests } from '../../../services/consumableCondition';
import { createRoom, REFUSAL } from '../../../services/__tests__/support/sharedRoomFixture';

const mockInventory = { items: [], removeItem: jest.fn() };
const mockChat = { notifications: { combat: [] }, addNotification: jest.fn(), addCombatNotification: jest.fn() };
jest.mock('../../../store/inventoryStore', () => { const h = sel => (sel ? sel(mockInventory) : mockInventory); h.getState = () => mockInventory; h.subscribe = () => () => {}; return { __esModule: true, default: h }; });
jest.mock('../../../store/chatStore', () => { const h = sel => (sel ? sel(mockChat) : mockChat); h.getState = () => mockChat; return { __esModule: true, default: h }; });
jest.mock('../../../store/diceStore', () => { const hook = () => ({}); hook.getState = () => ({ rollDiceDirectly: jest.fn() }); return { __esModule: true, default: hook }; });
jest.mock('../../../hooks/useCharacterSpells', () => ({ useCharacterSpells: () => ({ allSpells: [], consumables: [], counts: { all: 0, consumable: 0 } }) }));
jest.mock('../../spellcrafting-wizard/components/common/UnifiedSpellCard', () => ({ __esModule: true, default: () => null }));

const room = createRoom();
const POTION = (stats, extra = {}) => ({ id: 'inv-1', originalItemId: 'potion', name: 'Potion of Insight', type: 'consumable', quantity: 2, iconId: 'p', combatStats: stats, ...extra });
const notices = () => mockChat.addCombatNotification.mock.calls.map(c => c[0].content);
const flush = async () => { for (let i = 0; i < 8; i++) await act(async () => { await new Promise(r => setTimeout(r, 0)); }); };
const health = () => useCharacterStore.getState().health.current;

beforeAll(async () => {
  if (!global.crypto?.randomUUID) Object.defineProperty(global, 'crypto', { value: require('crypto').webcrypto, configurable: true });
  for (const store of [useCharacterStore, useConditionStore, useCharacterTokenStore, useCreatureStore, useGameStore, useAuthStore, usePartyStore, useMapStore]) await store.persist?.rehydrate?.();
});
beforeEach(() => {
  localStorage.clear();
  for (const [name, store] of [['characterStore', useCharacterStore], ['conditionStore', useConditionStore], ['characterTokenStore', useCharacterTokenStore], ['creatureStore', useCreatureStore],
    ['gameStore', useGameStore], ['authStore', useAuthStore], ['partyStore', usePartyStore], ['mapStore', useMapStore]]) registerStore(name, store);
  registerStore('chatStore', require('../../../store/chatStore').default);
  resetUnresolvedForTests(); room.reset();
  mockInventory.removeItem.mockClear(); mockChat.addCombatNotification.mockClear();
  mockInventory.items = [POTION({ intelligence: 2, healthRestore: { value: 5 } })];
  useAuthStore.setState({ user: { uid: 'u2' } });
  useCharacterStore.setState({ id: 'c2', currentCharacterId: 'c2', name: 'Ilse', class: 'Arcanoneer', health: { current: 20, max: 40 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 }, tempHealth: 0, tempMana: 0, tempActionPoints: 0 });
  useConditionStore.setState({ activeBuffs: [], activeDebuffs: [] });
  useCreatureStore.setState({ creatureTokens: [], tokens: [] });
  useCharacterTokenStore.setState({ characterTokens: [room.pcToken()] });
  usePartyStore.setState({ partyMembers: [{ id: 'player-1', userId: 'u2', character: { id: 'c2' } }] });
  useGameStore.setState({ isInMultiplayer: true, multiplayerRoom: { id: 'r' }, currentPlayer: { id: 'player-1', name: 'Ilse' }, multiplayerSocket: room.socket(), actorConsequenceStatus: null });
});

const mount = ({ bind = true } = {}) => {
  if (bind) selectOwnerAttachment(room.ref);   // the production owner-selection call: 'player' now resolves to the owner's token
  render(<SpellActionBar characterId="c2" allSpells={[]} />);
  act(() => window.dispatchEvent(new CustomEvent('spell-action-bar-assign-item', { detail: { item: { ...mockInventory.items[0] }, autoFindSlot: true } })));
  fireEvent.click(screen.getByAltText('Potion of Insight'));
};
const drink = async () => { fireEvent.click(screen.getByRole('button', { name: /Drink \/ Consume/ })); await flush(); };

test('a room refusal keeps the item, skips the healing and tells the player why', async () => {
  mount(); await drink();
  expect(room.commands()).toHaveLength(1);
  expect(room.commands()[0].payload.actors[0].conditions[0].record).toMatchObject({ name: 'Potion of Insight', source: 'consumable', effects: { intelligence: 2 } });
  expect(mockInventory.removeItem).not.toHaveBeenCalled();
  expect(health()).toBe(20);
  expect(useConditionStore.getState().activeBuffs).toHaveLength(0);
  expect(notices()).toHaveLength(1);
  expect(notices()[0]).toMatch(/Potion of Insight was not used and is still in your pack/);
  expect(notices()[0]).toContain(REFUSAL.error);
});

test('a confirmed room effect uses the item once and heals once', async () => {
  mockInventory.items = [POTION({ armor: 2, healthRestore: { value: 5 } })];
  room.respond = (event, payload) => (event === 'actor_snapshot' ? room.snapshot() : room.accepted(payload));
  mount(); await drink();
  expect(mockInventory.removeItem).toHaveBeenCalledTimes(1);
  expect(mockInventory.removeItem).toHaveBeenCalledWith('inv-1', 1,
    expect.objectContaining({ characterId: 'c2', commandId: expect.any(String) }));
  expect(health()).toBe(25);
  expect(notices().filter(n => /was not used/.test(n))).toHaveLength(0);
});

test('two clicks on Drink while the room is answering send one command and use one item', async () => {
  mockInventory.items = [POTION({ armor: 2 })];
  const acks = [];
  useGameStore.setState({ multiplayerSocket: { connected: true, id: 's', emit: (event, payload, ack) => { room.emitted.push({ event, payload });
    if (event === 'actor_snapshot') ack(room.snapshot()); else acks.push(() => ack(room.accepted(payload))); } } });
  mount();
  const button = screen.getByRole('button', { name: /Drink \/ Consume/ });
  await act(async () => { fireEvent.click(button); fireEvent.click(button); });
  await flush();
  expect(room.commands()).toHaveLength(1);
  await act(async () => { acks.forEach(fn => fn()); }); await flush();
  expect(mockInventory.removeItem).toHaveBeenCalledTimes(1);
});

test('an owner that is not bound to a room token is told, and nothing is used', async () => {
  mount({ bind: false }); await drink();
  expect(room.commands()).toHaveLength(0);
  expect(mockInventory.removeItem).not.toHaveBeenCalled();
  expect(health()).toBe(20);
  expect(notices()[0]).toMatch(/Potion of Insight was not used/);
});

test('outcome_unknown keeps the item; the next Drink replays the same command id and completes the use once', async () => {
  mockInventory.items = [POTION({ armor: 2, healthRestore: { value: 5 } })];
  let mode = 'unknown';
  room.respond = (event, payload) => (event === 'actor_snapshot' ? room.snapshot() : mode === 'unknown' ? { success: false, code: 'outcome_unknown', error: 'x' } : room.accepted(payload));
  mount(); await drink();
  expect(mockInventory.removeItem).not.toHaveBeenCalled();
  const first = room.commands()[0].payload.commandId;
  mode = 'accepted';
  fireEvent.click(screen.getByAltText('Potion of Insight')); await drink();
  expect(room.commands().map(c => c.payload.commandId)).toEqual([first, first]);
  expect(mockInventory.removeItem).toHaveBeenCalledTimes(1);
  expect(health()).toBe(25);
});

test('offline double-click on Drink still uses one item and heals once', async () => {
  useGameStore.setState({ isInMultiplayer: false, multiplayerRoom: null, multiplayerSocket: null });
  mockInventory.items = [POTION({ armor: 2, healthRestore: { value: 5 } })];
  mount({ bind: false });
  const button = screen.getByRole('button', { name: /Drink \/ Consume/ });
  await act(async () => { fireEvent.click(button); fireEvent.click(button); });
  await flush();
  expect(mockInventory.removeItem).toHaveBeenCalledTimes(1);
  expect(health()).toBe(25);
});

test('offline keeps the single local pass: item used, healed, buff added, no room traffic', async () => {
  useGameStore.setState({ isInMultiplayer: false, multiplayerRoom: null, multiplayerSocket: null });
  mount({ bind: false }); await drink();
  expect(room.actorEvents()).toHaveLength(0);
  expect(mockInventory.removeItem).toHaveBeenCalledTimes(1);
  expect(health()).toBe(25);
  expect(useConditionStore.getState().activeBuffs.map(b => b.name)).toEqual(['Potion of Insight']);
});

test('switching the active character before the answer does not mutate the new character and preserves the accepted command for reconciliation', async () => {
  mockInventory.items = [POTION({ armor: 2, healthRestore: { value: 5 } })];
  const acks = [];
  useGameStore.setState({ multiplayerSocket: { connected: true, id: 's', emit: (event, payload, ack) => {
    room.emitted.push({ event, payload });
    if (event === 'actor_snapshot') ack(room.snapshot()); else acks.push(() => ack(room.accepted(payload)));
  } } });
  mount();
  const button = screen.getByRole('button', { name: /Drink \/ Consume/ });
  await act(async () => { fireEvent.click(button); });
  await flush();
  expect(room.commands()).toHaveLength(1);

  // Switch to c3 before the room confirmation release
  useCharacterStore.setState({ id: 'c3', currentCharacterId: 'c3', name: 'Other', health: { current: 10, max: 50 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 } });
  await act(async () => { acks.forEach(fn => fn()); });
  await flush();

  // c3 HP, maxima, and inventory remain completely unchanged
  expect(useCharacterStore.getState().health).toEqual({ current: 10, max: 50 });
  expect(useCharacterStore.getState().mana).toEqual({ current: 10, max: 30 });
  expect(useCharacterStore.getState().actionPoints).toEqual({ current: 2, max: 5 });
  expect(mockInventory.removeItem).not.toHaveBeenCalled();
  expect(notices().some(n => /refused|did not accept|was not used/.test(n))).toBe(false);
});

test('mixed healing + condition submits finalResources and conditions in one command and room projection does not overwrite HP', async () => {
  mockInventory.items = [POTION({ healthRegen: { value: 2 }, healthRestore: { value: 5 } })];
  room.respond = (event, payload) => {
    if (event === 'actor_snapshot') return room.snapshot();
    const op = payload.actors[0];
    const accepted = room.accepted(payload);
    if (op.finalResources?.hp) {
      accepted.receipt.actors[0].finalResources.hp = { current: op.finalResources.hp.current, max: 40, temp: op.finalResources.hp.temp ?? 0 };
      accepted.actorSnapshot.maps.m.characterTokens.pc2.character.health.current = op.finalResources.hp.current;
    }
    return accepted;
  };
  mount(); await drink();
  expect(room.commands()).toHaveLength(1);
  const op = room.commands()[0].payload.actors[0];
  expect(op.finalResources?.hp).toEqual({ current: 25, temp: 0 });
  expect(op.conditions[0].record).toMatchObject({ name: 'Potion of Insight', source: 'consumable', effects: { healthRegen: 2 } });
  expect(mockInventory.removeItem).toHaveBeenCalledTimes(1);
  expect(health()).toBe(25);
  expect(useCharacterTokenStore.getState().characterTokens[0].character.health.current).toBe(25);
});
