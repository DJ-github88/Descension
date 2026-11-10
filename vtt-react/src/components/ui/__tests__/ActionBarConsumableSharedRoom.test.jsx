/** Consumable in a shared room: ordinary HUD click (mounted ActionBar) -> real conditionStore.addCondition -> real
 * actorConsequenceService routing -> room command. A room refusal must leave the pack, the sheet resources and the
 * condition store untouched and tell the player exactly that; a confirmed effect consumes the item once.
 *
 * Fixtures (disclosed): the socket is a fake. 'actor_snapshot' returns one minimal valid projection holding the owner's
 * primary PC token; 'actor_consequence' returns the recorded refusal shape of the production handler
 * (actorConsequenceHandlers.js respond({success:false, code, error}) for actorConsequences.js `attribute_change_gm_only`).
 * The registered-handler proof that the server refuses is the server fixture, not this file. The inventory store is a
 * recording stub; every other store is the production store. */
import React from 'react';
import { render, act, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionBar from '../ActionBar';
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
import { registerActorHandlers } from '../../../services/actorConsequenceService';

let mockActionSlots = Array(12).fill(null);
const mockInventory = { items: [], removeItem: jest.fn() };
jest.mock('../../../contexts/RoomContext', () => ({ useRoomContext: () => ({ currentRoomId: 'r' }) }));
jest.mock('../../../hooks/useActionBarPersistence', () => ({
  useActionBarPersistence: () => ({ actionSlots: mockActionSlots, updateSlot: jest.fn(), clearSlot: jest.fn(), updateActionSlots: jest.fn(), isLoading: false })
}));
jest.mock('../../../store/inventoryStore', () => { const h = sel => (sel ? sel(mockInventory) : mockInventory); h.getState = () => mockInventory; h.subscribe = () => () => {}; return { __esModule: true, default: h }; });
jest.mock('../../spellcrafting-wizard/context/SpellLibraryContext', () => ({ useSpellLibrary: () => ({ spells: [] }) }));
jest.mock('../../../utils/assetManager', () => ({ getIconUrl: i => `icon:${i}`, getCustomIconUrl: i => `icon:${i}`, getAbilityIconUrl: i => `icon:${i}` }));
jest.mock('../HotkeyAssignmentPopup', () => function MockHotkey() { return null; });
jest.mock('../CooldownAdjustmentMenu', () => function MockCooldown() { return null; });
jest.mock('../ExperienceBar', () => function MockExpBar() { return null; });
jest.mock('../../../store/combatStore', () => {
  const s = { isInCombat: false, getCurrentCombatant: () => null, round: 1, currentTurnIndex: 0, turnOrder: [] };
  const h = sel => (sel ? sel(s) : s); h.getState = () => s; h.setState = () => {}; h.subscribe = () => () => {}; return { __esModule: true, default: h };
});

const REFUSAL = { success: false, code: 'attribute_change_gm_only',
  error: 'Only the GM can record a manual change to this attribute; authored changes go through an approved action. Nothing was applied.' };
let ref = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc2', instanceId: 'i2', ownerUid: 'u2', characterId: 'c2' };
let roomRevision = 3, roomConditions = [], commitSeq = 5;  // what the fake room currently holds for the actor
const pcToken = () => ({ id: 'pc2', ownerUserId: 'u2', character: { id: 'c2', health: { current: 20, max: 40 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 }, tempHealth: 0, tempMana: 0, tempActionPoints: 0 },
  state: { conditions: roomConditions, actorContract: { version: 1, ...ref, revision: roomRevision, primary: true } } });
let cutBase = 0;  // the projection fence is module state (cuts only move forward): each test starts at a later cut
let projection = { version: 1, epoch: 'e1', cut: 1, roomId: 'r' };
const snapshot = () => ({ success: true, roomId: 'r', actionEpoch: 1, commitSequence: commitSeq, replayFloor: 0, actorProjection: projection,
  maps: { m: { id: 'm', actorProjection: projection, tokens: {}, creatures: {}, characterTokens: { pc2: pcToken() } } } });

const acceptedFor = payload => {
  const op = payload.actors[0];
  const conditions = [...roomConditions, ...op.conditions.map(value => ({ ...value.record }))];
  const before = roomRevision; roomRevision += 1; roomConditions = conditions; commitSeq += 1;
  projection = { ...projection, cut: projection.cut + 1 };
  const res = { hp: { current: 20, max: 40, temp: 0 }, mana: { current: 10, max: 30, temp: 0 }, ap: { current: 2, max: 5, temp: 0 } };
  return { success: true, status: 'accepted', delivery: 'live', receipt: { version: 1, roomId: 'r', admissionEpoch: 1, commitSequence: commitSeq,
      actors: [{ ref, beforeRevision: before, afterRevision: roomRevision, conditions, finalResources: res }] },
    actorSnapshot: { ...snapshot(), actorProjection: projection, maps: { m: { id: 'm', actorProjection: projection, tokens: {}, creatures: {}, characterTokens: { pc2: pcToken() } } } } };
};
const potion = (stats = { intelligence: { value: 2 } }, extra = {}) => ({ id: 'inv-1', originalItemId: 'potion', name: 'Potion of Insight', quantity: 2, iconId: 'p', combatStats: stats, ...extra });
const hookOf = state => { const h = sel => (sel ? sel(state) : state); h.getState = () => state; h.setState = () => {}; h.subscribe = () => () => {}; return h; };

let emitted, notices, respond;
const socket = () => ({ connected: true, id: 'sock', emit: (event, payload, ack) => { emitted.push({ event, payload }); if (typeof ack === 'function') ack(respond(event, payload)); } });
const actorEvents = () => emitted.filter(e => /^actor_/.test(e.event));  // other emits are the existing sheet resource syncs
const flush = async () => { for (let i = 0; i < 8; i++) await act(async () => { await new Promise(r => setTimeout(r, 0)); }); };
const click = async container => { await act(async () => { container.querySelectorAll('.action-slot')[0].dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0 })); }); await flush(); };
const health = () => useCharacterStore.getState().health.current;

beforeAll(async () => {
  if (!global.crypto?.randomUUID) Object.defineProperty(global, 'crypto', { value: require('crypto').webcrypto, configurable: true });
  for (const store of [useCharacterStore, useConditionStore, useCharacterTokenStore, useCreatureStore, useGameStore, useAuthStore, usePartyStore, useMapStore]) await store.persist?.rehydrate?.();
});
beforeEach(() => {
  for (const [name, store] of [['characterStore', useCharacterStore], ['conditionStore', useConditionStore], ['characterTokenStore', useCharacterTokenStore], ['creatureStore', useCreatureStore],
    ['gameStore', useGameStore], ['authStore', useAuthStore], ['partyStore', usePartyStore], ['mapStore', useMapStore]]) registerStore(name, store);
  roomRevision = 3; roomConditions = []; commitSeq = 5; cutBase += 10; ref = { ...ref, instanceId: `i${cutBase}` };  // a new actor instance per test: the fence rejects a revision going backwards
  projection = { version: 1, epoch: 'e1', cut: cutBase, roomId: 'r' };
  resetUnresolvedForTests();
  notices = [];
  registerStore('chatStore', hookOf({ notifications: { combat: [] }, addNotification: (type, n) => notices.push(n), addCombatNotification: n => notices.push(n) }));
  emitted = []; respond = (event) => (event === 'actor_snapshot' ? snapshot() : REFUSAL);
  mockInventory.removeItem.mockClear();
  mockInventory.items = [potion({ intelligence: { value: 2 }, healthRestore: { value: 5 } })];
  mockActionSlots = Array(12).fill(null); mockActionSlots[0] = { type: 'consumable', originalItemId: 'potion', name: 'Potion of Insight', icon: 'p' };
  useAuthStore.setState({ user: { uid: 'u2' } });
  useCharacterStore.setState({ id: 'c2', currentCharacterId: 'c2', name: 'Ilse', class: 'Arcanoneer', health: { current: 20, max: 40 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 }, tempHealth: 0, tempMana: 0, tempActionPoints: 0 });
  useConditionStore.setState({ activeBuffs: [], activeDebuffs: [] });
  useCreatureStore.setState({ creatureTokens: [], tokens: [] });
  useCharacterTokenStore.setState({ characterTokens: [pcToken()] });
  usePartyStore.setState({ partyMembers: [{ id: 'player-1', userId: 'u2', character: { id: 'c2' } }] });
  useGameStore.setState({ isInMultiplayer: true, multiplayerRoom: { id: 'r' }, currentPlayer: { id: 'player-1', name: 'Ilse' }, multiplayerSocket: socket(), actorConsequenceStatus: null });
});

describe('family-attribute consumable in a shared room (ordinary HUD click)', () => {
  test('the owner actor resolves and the room command carries the potion record', async () => {
    const { container } = render(<ActionBar />); await click(container);
    expect(actorEvents().map(e => e.event)).toEqual(['actor_snapshot', 'actor_consequence']);
    const op = actorEvents()[1].payload.actors[0];
    expect(op.ref).toMatchObject({ tokenId: 'pc2', characterId: 'c2', ownerUid: 'u2' });
    expect(op.conditions).toHaveLength(1);
    expect(op.conditions[0].record).toMatchObject({ name: 'Potion of Insight', source: 'consumable', type: 'buff', effects: { intelligence: 2 } });
  });

  test('a room refusal leaves the item, the healing and the condition store untouched, and says so', async () => {
    const { container } = render(<ActionBar />); await click(container);
    expect(useGameStore.getState().actorConsequenceStatus).toMatchObject({ success: false, code: 'attribute_change_gm_only' });
    expect(mockInventory.removeItem).not.toHaveBeenCalled();           // the potion is still in the pack
    expect(health()).toBe(20);                                         // no half-applied healing
    expect(useConditionStore.getState().activeBuffs).toHaveLength(0);
    expect(notices).toHaveLength(1);
    expect(notices[0].content).toMatch(/Potion of Insight was not used/);
    expect(notices[0].content).toMatch(/still in your pack/);
    expect(notices[0].content).toContain(REFUSAL.error);               // the room's own reason, verbatim
    expect(notices[0].content).not.toMatch(/success|applied successfully/i);
  });

  test('a mixed buff+debuff item is one room command; a refusal leaves the item and healing untouched', async () => {
    mockInventory.items = [potion({ constitution: { value: 2 }, agility: { value: -2 }, healthRestore: { value: 5 } })];
    const { container } = render(<ActionBar />); await click(container);
    const sent = actorEvents().filter(e => e.event === 'actor_consequence');
    expect(sent).toHaveLength(1);
    expect(sent[0].payload.actors[0].conditions).toHaveLength(2);
    expect(mockInventory.removeItem).not.toHaveBeenCalled();
    expect(health()).toBe(20);
    expect(notices).toHaveLength(1);
    expect(notices[0].content).toContain(REFUSAL.error);
  });

  test('a confirmed room effect consumes the item exactly once (stat outside the family)', async () => {
    mockInventory.items = [potion({ healthRegen: { value: 2 } })];
    respond = (event, payload) => (event === 'actor_snapshot' ? snapshot() : acceptedFor(payload));
    const { container } = render(<ActionBar />); await click(container);
    expect(actorEvents().map(e => e.event)).toContain('actor_consequence');
    expect(mockInventory.removeItem).toHaveBeenCalledTimes(1);
    expect(mockInventory.removeItem).toHaveBeenCalledWith('inv-1', 1,
      expect.objectContaining({ characterId: 'c2', commandId: expect.any(String) }));
    expect(notices).toHaveLength(0);
  });

  test('an owner that cannot be resolved to a room token is told, and nothing is consumed', async () => {
    usePartyStore.setState({ partyMembers: [] });
    const { container } = render(<ActionBar />); await click(container);
    expect(actorEvents().map(e => e.event)).not.toContain('actor_consequence');
    expect(mockInventory.removeItem).not.toHaveBeenCalled();
    expect(health()).toBe(20);
    expect(notices).toHaveLength(1);
    expect(notices[0].content).toMatch(/Potion of Insight was not used/);
  });

  test('a room that never confirms leaves the item in the pack and says the outcome is unknown', async () => {
    respond = event => (event === 'actor_snapshot' ? snapshot() : { success: false, code: 'outcome_unknown', error: 'outcome unknown' });
    const { container } = render(<ActionBar />); await click(container);
    expect(mockInventory.removeItem).not.toHaveBeenCalled();
    expect(notices[0].content).toMatch(/did not confirm/);
  });

  test('the shared held key is released when an overheal choice completes', async () => {
    mockInventory.items = [potion({ healthRegen: { value: 2 }, healthRestore: { value: 10 } })];
    useCharacterStore.setState({ health: { current: 35, max: 40 } });
    respond = (event, payload) => (event === 'actor_snapshot' ? snapshot() : acceptedFor(payload));
    const { container } = render(<ActionBar />); await click(container);
    expect(isHeld('potion')).toBe(true);
    expect(actorEvents().filter(e => e.event === 'actor_consequence')).toHaveLength(0);  // choice before submission
    await act(async () => { screen.getByRole('button', { name: /Cap/ }).dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0 })); });
    await flush();
    expect(mockInventory.removeItem).toHaveBeenCalledTimes(1);
    expect(isHeld('potion')).toBe(false);
    await click(container);
    expect(isHeld('potion')).toBe(true);                                                 // the next use opens its own choice
    expect(actorEvents().filter(e => e.event === 'actor_consequence')).toHaveLength(1);
    await act(async () => { screen.getByRole('button', { name: /Cap/ }).dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0 })); });
    await flush();
    expect(actorEvents().filter(e => e.event === 'actor_consequence')).toHaveLength(2);
  });

  test('cancelling a condition-less overheal releases the held key and keeps the item', async () => {
    mockInventory.items = [potion({ healthRestore: { value: 10 } })];
    useCharacterStore.setState({ health: { current: 35, max: 40 } });
    const { container } = render(<ActionBar />); await click(container);
    expect(isHeld('potion')).toBe(true);
    expect(mockInventory.removeItem).not.toHaveBeenCalled();
    await act(async () => { screen.getByRole('button', { name: 'Cancel' }).dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0 })); });
    await flush();
    expect(isHeld('potion')).toBe(false);
    expect(mockInventory.removeItem).not.toHaveBeenCalled();
    await click(container);
    expect(isHeld('potion')).toBe(true);   // a later use is not blocked by the cancelled one
  });

  test('offline mixed buff+debuff still applies both locally and consumes once', async () => {
    useGameStore.setState({ isInMultiplayer: false, multiplayerRoom: null, multiplayerSocket: null });
    mockInventory.items = [potion({ constitution: { value: 2 }, agility: { value: -2 }, healthRestore: { value: 5 } })];
    const { container } = render(<ActionBar />); await click(container);
    expect(actorEvents()).toHaveLength(0);
    expect(mockInventory.removeItem).toHaveBeenCalledTimes(1);
    expect(health()).toBe(25);
    expect(useConditionStore.getState().activeBuffs[0]?.effects).toEqual({ constitution: 2 });
    expect(useConditionStore.getState().activeDebuffs[0]?.effects).toEqual({ agility: 2 });
  });

  test('offline play is unchanged: the local buff is added, the healing applies, the item is consumed once, no room traffic', async () => {
    useGameStore.setState({ isInMultiplayer: false, multiplayerRoom: null, multiplayerSocket: null });
    const { container } = render(<ActionBar />); await click(container);
    expect(actorEvents()).toHaveLength(0);
    expect(useConditionStore.getState().activeBuffs.map(b => [b.name, b.effects])).toEqual([['Potion of Insight', { intelligence: 2 }]]);
    expect(health()).toBe(25);
    expect(mockInventory.removeItem).toHaveBeenCalledTimes(1);
    expect(notices).toHaveLength(0);
  });
});

describe('duplicate clicks and a late confirmation (shared room)', () => {
  test('a second click while the room is still answering sends and consumes nothing more', async () => {
    mockInventory.items = [potion({ healthRegen: { value: 2 } })];
    const acks = [];
    const sock = useGameStore.getState().multiplayerSocket;
    useGameStore.setState({ multiplayerSocket: { ...sock, emit: (event, payload, ack) => { emitted.push({ event, payload });
      if (event === 'actor_snapshot') ack(snapshot()); else acks.push(() => ack(acceptedFor(payload))); } } });
    const { container } = render(<ActionBar />);
    await act(async () => { const el = container.querySelectorAll('.action-slot')[0]; el.dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0 })); el.dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0 })); });
    await flush();
    expect(actorEvents().filter(e => e.event === 'actor_consequence')).toHaveLength(1);
    await act(async () => { acks.forEach(fn => fn()); }); await flush();
    expect(mockInventory.removeItem).toHaveBeenCalledTimes(1);
  });

  test('outcome_unknown keeps the item; the next click replays the SAME command id and, once confirmed, uses the item exactly once', async () => {
    mockInventory.items = [potion({ healthRegen: { value: 2 }, healthRestore: { value: 5 } })];
    let mode = 'unknown';
    respond = (event, payload) => (event === 'actor_snapshot' ? snapshot() : mode === 'unknown' ? { success: false, code: 'outcome_unknown', error: 'x' } : acceptedFor(payload));
    const { container } = render(<ActionBar />); await click(container);
    expect(mockInventory.removeItem).not.toHaveBeenCalled();
    const first = actorEvents().filter(e => e.event === 'actor_consequence');
    expect(first).toHaveLength(1);
    mode = 'accepted';                                   // the room did record it after all
    await click(container);
    const sent = actorEvents().filter(e => e.event === 'actor_consequence');
    expect(sent).toHaveLength(2);
    expect(sent[1].payload.commandId).toBe(first[0].payload.commandId);   // existing identity, not a new command
    expect(mockInventory.removeItem).toHaveBeenCalledTimes(1);
    expect(health()).toBe(25);
    await click(container);                              // a later, separate use is an ordinary new command
    expect(actorEvents().filter(e => e.event === 'actor_consequence')).toHaveLength(3);
  });

  test('a replay that is still unanswered holds the retry: nothing new is sent as a different command and the item stays', async () => {
    mockInventory.items = [potion({ healthRegen: { value: 2 } })];
    respond = event => (event === 'actor_snapshot' ? snapshot() : { success: false, code: 'outcome_unknown', error: 'x' });
    const { container } = render(<ActionBar />); await click(container); await click(container);
    const ids = actorEvents().filter(e => e.event === 'actor_consequence').map(e => e.payload.commandId);
    expect(new Set(ids).size).toBe(1);
    expect(mockInventory.removeItem).not.toHaveBeenCalled();
    expect(notices.some(n => /held to avoid applying it twice/.test(n.content))).toBe(true);
  });

  test('a late accepted broadcast settles the same command: the next click completes the use once without a new command', async () => {
    mockInventory.items = [potion({ healthRegen: { value: 2 }, healthRestore: { value: 5 } })];
    const listeners = {};
    let firstCommand = null;
    const sock = { connected: true, id: 'sock', on: (event, cb) => { listeners[event] = cb; }, off: () => {},
      emit: (event, payload, ack) => { emitted.push({ event, payload });
        if (event === 'actor_snapshot') ack(snapshot());
        else if (event === 'actor_consequence') { firstCommand = payload; ack({ success: false, code: 'outcome_unknown', error: 'x', commandId: payload.commandId }); } } };
    useGameStore.setState({ multiplayerSocket: sock });
    const cleanup = registerActorHandlers({ socket: sock });
    try {
      const { container } = render(<ActionBar />); await click(container);
      expect(mockInventory.removeItem).not.toHaveBeenCalled();
      const accepted = acceptedFor(firstCommand); accepted.receipt.commandId = firstCommand.commandId; accepted.receipt.submitterUid = 'u2';
      await act(async () => { listeners.actor_consequence_accepted(accepted); }); await flush();
      await click(container);
      expect(emitted.filter(e => e.event === 'actor_consequence')).toHaveLength(1);
      expect(mockInventory.removeItem).toHaveBeenCalledTimes(1);
      expect(health()).toBe(25);
    } finally { cleanup(); }
  });

  test('a replay the room refuses clears the hold; the item stays and the reason is shown', async () => {
    mockInventory.items = [potion({ healthRegen: { value: 2 } })];
    let mode = 'unknown';
    respond = event => (event === 'actor_snapshot' ? snapshot() : mode === 'unknown' ? { success: false, code: 'outcome_unknown', error: 'x' } : REFUSAL);
    const { container } = render(<ActionBar />); await click(container);
    mode = 'refused'; await click(container);
    expect(mockInventory.removeItem).not.toHaveBeenCalled();
    expect(notices[notices.length - 1].content).toContain(REFUSAL.error);
  });
});
