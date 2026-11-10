/** InventoryWindow consumable (context menu "Use") in a shared room: the item is used and the sheet healed only after the room took the
 * stat condition. Real: InventoryWindow, inventoryStore, conditionStore.addCondition, actorConsequenceService, characterStore and the other
 * stores. Fixture (disclosed): fake socket from support/sharedRoomFixture (recorded production refusal shape); chat is a recording stub. */
import React from 'react';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import InventoryWindow from '../InventoryWindow';
import useInventoryStore from '../../../store/inventoryStore';
import useCharacterStore from '../../../store/characterStore';
import useConditionStore from '../../../store/conditionStore';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useCreatureStore from '../../../store/creatureStore';
import useGameStore from '../../../store/gameStore';
import useAuthStore from '../../../store/authStore';
import usePartyStore from '../../../store/partyStore';
import useMapStore from '../../../store/mapStore';
import { registerStore } from '../../../store/storeRegistry';
import { resetUnresolvedForTests, isHeld } from '../../../services/consumableCondition';
import { createRoom, REFUSAL } from '../../../services/__test_support__/sharedRoomFixture';

jest.mock('../../spellcrafting-wizard/components/library/AuthoredAdmission', () => () => <div data-testid="admission" />);

const room = createRoom();
let notices;
const POTION = stats => ({ id: 'inv-1', originalItemId: 'potion', name: 'Potion of Insight', type: 'consumable', quantity: 2, width: 1, height: 1, position: { row: 0, col: 0 }, combatStats: stats });
const flush = async (n = 8) => { for (let i = 0; i < n; i++) await act(async () => { await new Promise(r => setTimeout(r, 30)); }); };
const quantity = () => useInventoryStore.getState().items.find(i => i.id === 'inv-1')?.quantity ?? 0;
const health = () => useCharacterStore.getState().health.current;
const use = async () => {           // the shared context menu runs its item handler after an 80 ms press animation
  fireEvent.contextMenu(document.querySelector('[draggable="true"]'));
  fireEvent.click(screen.getByText('Use'));
  await flush();
};

beforeAll(async () => {
  if (!global.crypto?.randomUUID) Object.defineProperty(global, 'crypto', { value: require('crypto').webcrypto, configurable: true });
  for (const store of [useCharacterStore, useConditionStore, useCharacterTokenStore, useCreatureStore, useGameStore, useAuthStore, usePartyStore, useMapStore]) await store.persist?.rehydrate?.();
});
beforeEach(() => {
  for (const [name, store] of [['characterStore', useCharacterStore], ['conditionStore', useConditionStore], ['characterTokenStore', useCharacterTokenStore], ['creatureStore', useCreatureStore],
    ['gameStore', useGameStore], ['authStore', useAuthStore], ['partyStore', usePartyStore], ['mapStore', useMapStore]]) registerStore(name, store);
  notices = [];
  const chat = { notifications: { combat: [] }, addNotification: (t, n) => notices.push(n.content), addCombatNotification: n => notices.push(n.content) };
  const hook = sel => (sel ? sel(chat) : chat); hook.getState = () => chat; hook.setState = () => {}; hook.subscribe = () => () => {};
  registerStore('chatStore', hook);
  resetUnresolvedForTests(); room.reset();
  useInventoryStore.setState({ items: [POTION({ intelligence: { value: 2 }, healthRestore: { value: 5 } })] });
  useAuthStore.setState({ user: { uid: 'u2' } });
  useCharacterStore.setState({ id: 'c2', currentCharacterId: 'c2', name: 'Ilse', class: 'Arcanoneer', health: { current: 20, max: 40 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 }, tempHealth: 0, tempMana: 0, tempActionPoints: 0 });
  useConditionStore.setState({ activeBuffs: [], activeDebuffs: [] });
  useCreatureStore.setState({ creatureTokens: [], tokens: [] });
  useCharacterTokenStore.setState({ characterTokens: [room.pcToken()] });
  usePartyStore.setState({ partyMembers: [{ id: 'player-1', userId: 'u2', character: { id: 'c2' } }] });
  useGameStore.setState({ isInMultiplayer: true, multiplayerRoom: { id: 'r' }, currentPlayer: { id: 'player-1', name: 'Ilse' }, multiplayerSocket: room.socket(), actorConsequenceStatus: null });
});
afterEach(cleanup);

test('a room refusal keeps the item, skips the healing and tells the player why', async () => {
  render(<InventoryWindow />); await use();
  expect(room.commands()).toHaveLength(1);
  expect(room.commands()[0].payload.actors[0].conditions[0].record).toMatchObject({ name: 'Potion of Insight', source: 'consumable', effects: { intelligence: 2 } });
  expect(quantity()).toBe(2);
  expect(health()).toBe(20);
  expect(useConditionStore.getState().activeBuffs).toHaveLength(0);
  expect(notices).toHaveLength(1);
  expect(notices[0]).toMatch(/Potion of Insight was not used and is still in your pack/);
  expect(notices[0]).toContain(REFUSAL.error);
});

test('a mixed buff+debuff item is one command; refusal leaves the item and healing untouched', async () => {
  useInventoryStore.setState({ items: [POTION({ constitution: { value: 2 }, agility: { value: -2 }, healthRestore: { value: 5 } })] });
  render(<InventoryWindow />); await use();
  expect(room.commands()).toHaveLength(1);
  expect(room.commands()[0].payload.actors[0].conditions).toHaveLength(2);
  expect(quantity()).toBe(2);
  expect(health()).toBe(20);
  expect(notices).toHaveLength(1);
  expect(notices[0]).toContain(REFUSAL.error);
});

test('cancelling a condition-less overheal releases the held key and keeps the item', async () => {
  useInventoryStore.setState({ items: [POTION({ healthRestore: { value: 10 } })] });
  useCharacterStore.setState({ health: { current: 35, max: 40 } });
  render(<InventoryWindow />); await use();
  expect(isHeld('potion')).toBe(true);
  expect(quantity()).toBe(2);
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Cancel' })); }); await flush();
  expect(isHeld('potion')).toBe(false);
  expect(quantity()).toBe(2);
});

test('a confirmed room effect uses the item once and heals once', async () => {
  useInventoryStore.setState({ items: [POTION({ healthRegen: { value: 2 }, healthRestore: { value: 5 } })] });
  room.respond = (event, payload) => (event === 'actor_snapshot' ? room.snapshot() : room.accepted(payload));
  render(<InventoryWindow />); await use();
  expect(quantity()).toBe(1);
  expect(health()).toBe(25);
  expect(notices.filter(n => /was not used/.test(n))).toHaveLength(0);
});

test('a second Use while the room is answering sends one command and uses one item', async () => {
  useInventoryStore.setState({ items: [POTION({ healthRegen: { value: 2 } })] });
  const acks = [];
  useGameStore.setState({ multiplayerSocket: { connected: true, id: 's', emit: (event, payload, ack) => { room.emitted.push({ event, payload });
    if (event === 'actor_snapshot') ack(room.snapshot()); else acks.push(() => ack(room.accepted(payload))); } } });
  render(<InventoryWindow />);
  await use(); await use();
  expect(room.commands()).toHaveLength(1);
  await act(async () => { acks.forEach(fn => fn()); }); await flush();
  expect(quantity()).toBe(1);
});

test('an owner that does not resolve to a room token is told, and nothing is used', async () => {
  usePartyStore.setState({ partyMembers: [] });
  render(<InventoryWindow />); await use();
  expect(room.commands()).toHaveLength(0);
  expect(quantity()).toBe(2);
  expect(health()).toBe(20);
  expect(notices[0]).toMatch(/Potion of Insight was not used/);
});

test('outcome_unknown keeps the item; the next Use replays the same command id and completes the use once', async () => {
  useInventoryStore.setState({ items: [POTION({ healthRegen: { value: 2 }, healthRestore: { value: 5 } })] });
  let mode = 'unknown';
  room.respond = (event, payload) => (event === 'actor_snapshot' ? room.snapshot() : mode === 'unknown' ? { success: false, code: 'outcome_unknown', error: 'x' } : room.accepted(payload));
  render(<InventoryWindow />); await use();
  expect(quantity()).toBe(2);
  const first = room.commands()[0].payload.commandId;
  mode = 'accepted'; await use();
  expect(room.commands().map(c => c.payload.commandId)).toEqual([first, first]);
  expect(quantity()).toBe(1);
  expect(health()).toBe(25);
});

test('offline keeps the single local pass: item used, healed, buff added, no room traffic', async () => {
  useGameStore.setState({ isInMultiplayer: false, multiplayerRoom: null, multiplayerSocket: null });
  render(<InventoryWindow />); await use();
  expect(room.actorEvents()).toHaveLength(0);
  expect(quantity()).toBe(1);
  expect(health()).toBe(25);
  expect(useConditionStore.getState().activeBuffs.map(b => b.name)).toEqual(['Potion of Insight']);
});
