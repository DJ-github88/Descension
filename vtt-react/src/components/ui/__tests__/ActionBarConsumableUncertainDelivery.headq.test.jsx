/** HEADQ verification delta (2026-11-09) — consumable uncertain delivery, client effect projection and
 * local item/healing bookkeeping against Flash's exact reconciled candidate.
 *
 * Real: ActionBar, InventoryWindow, inventoryStore, conditionStore.addCondition, actorConsequenceService,
 * characterStore and the other production stores. Fixture (clearly labelled fake-socket evidence): the
 * socket from support/sharedRoomFixture; 'actor_snapshot' returns one canonic
al projection holding the
 * owner's primary PC token and 'actor_consequence' is answered by this file (accepted shape copied from
 * the production handler resultFor/actor snapshot contract). The production-handler receipt/dedupe proof
 * lives in server/tests/consumableReceiptDeduplication.headq.production.test.js — not here.
 *
 * Claimed file: additive evidence for handoff/consumable-recovery-verification. No runtime source edit.
 */
import React from 'react';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionBar from '../ActionBar';
import InventoryWindow from '../../windows/InventoryWindow';
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
import { resetUnresolvedForTests, hasUnresolved, isHeld, preserveAcceptedForReconciliation } from '../../../services/consumableCondition';
import { selectOwnerAttachment } from '../../../services/actorConsequenceService';
import { createRoom, REFUSAL } from '../../../services/__test_support__/sharedRoomFixture';

let mockActionSlots = Array(12).fill(null);
jest.mock('../../../contexts/RoomContext', () => ({ useRoomContext: () => ({ currentRoomId: 'r' }) }));
jest.mock('../../../hooks/useActionBarPersistence', () => ({
  useActionBarPersistence: () => ({ actionSlots: mockActionSlots, updateSlot: jest.fn(), clearSlot: jest.fn(), updateActionSlots: jest.fn(), isLoading: false })
}));
jest.mock('../../spellcrafting-wizard/context/SpellLibraryContext', () => ({ useSpellLibrary: () => ({ spells: [] }) }));
jest.mock('../../spellcrafting-wizard/components/library/AuthoredAdmission', () => () => <div data-testid="admission" />);
jest.mock('../../../utils/assetManager', () => ({ getIconUrl: i => `icon:${i}`, getCustomIconUrl: i => `icon:${i}`, getAbilityIconUrl: i => `icon:${i}` }));
jest.mock('../HotkeyAssignmentPopup', () => function MockHotkey() { return null; });
jest.mock('../CooldownAdjustmentMenu', () => function MockCooldown() { return null; });
jest.mock('../ExperienceBar', () => function MockExpBar() { return null; });
jest.mock('../../../store/combatStore', () => {
  const s = { isInCombat: false, getCurrentCombatant: () => null, round: 1, currentTurnIndex: 0, turnOrder: [] };
  const h = sel => (sel ? sel(s) : s); h.getState = () => s; h.setState = () => {}; h.subscribe = () => () => {}; return { __esModule: true, default: h };
});

const room = createRoom();
let notices = [], emitted = [], pending = [], deferAck = true;
const hookOf = state => { const h = sel => (sel ? sel(state) : state); h.getState = () => state; h.setState = () => {}; h.subscribe = () => () => {}; return h; };
const socket = () => ({ connected: true, id: 'sock', emit: (event, payload, ack) => {
  emitted.push({ event, payload });
  if (typeof ack !== 'function') return;
  if (event === 'actor_snapshot') { ack(room.snapshot()); return; }
  if (event === 'actor_consequence') {
    if (deferAck) pending.push({ payload, ack });
    else ack(room.respond(event, payload));
  }
} });
const commands = () => emitted.filter(e => e.event === 'actor_consequence');
const flush = async (n = 10) => { for (let i = 0; i < n; i++) await act(async () => { await new Promise(r => setTimeout(r, 20)); }); };
const quantity = () => useInventoryStore.getState().items.find(i => i.id === 'inv-1')?.quantity ?? 0;
const health = () => useCharacterStore.getState().health;
const potion = stats => ({ id: 'inv-1', originalItemId: 'potion', name: 'Potion of Insight', type: 'consumable', quantity: 2, width: 1, height: 1, position: { row: 0, col: 0 }, iconId: 'p', combatStats: stats });
const clickActionSlot = async () => {
  await act(async () => { document.querySelector('.action-slot').dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0 })); });
  await flush();
};
const useFromInventory = async () => {
  fireEvent.contextMenu(document.querySelector('[draggable="true"]'));
  fireEvent.click(screen.getByText('Use'));
  await flush();
};
const release = async mode => {
  const acks = pending.splice(0);
  await act(async () => {
    for (const { payload, ack } of acks) {
      if (mode === 'accepted') ack(room.accepted(payload));
      else if (mode === 'refused') ack(REFUSAL);
      else ack({ success: false, code: 'outcome_unknown', error: 'lost ack', commandId: payload.commandId });
    }
  });
  await flush();
};

beforeAll(async () => {
  if (!global.crypto?.randomUUID) Object.defineProperty(global, 'crypto', { value: require('crypto').webcrypto, configurable: true });
  for (const store of [useCharacterStore, useConditionStore, useCharacterTokenStore, useCreatureStore, useGameStore, useAuthStore, usePartyStore, useMapStore, useInventoryStore]) await store.persist?.rehydrate?.();
});
beforeEach(() => {
  for (const [name, store] of [['characterStore', useCharacterStore], ['conditionStore', useConditionStore], ['characterTokenStore', useCharacterTokenStore], ['creatureStore', useCreatureStore],
    ['gameStore', useGameStore], ['authStore', useAuthStore], ['partyStore', usePartyStore], ['mapStore', useMapStore], ['inventoryStore', useInventoryStore]]) registerStore(name, store);
  notices = []; emitted = []; pending = []; deferAck = true;
  resetUnresolvedForTests(); room.reset();
  registerStore('chatStore', hookOf({ notifications: { combat: [] }, addNotification: (t, n) => notices.push(n.content), addCombatNotification: n => notices.push(n.content) }));
  useInventoryStore.setState({ items: [potion({ healthRegen: { value: 2 }, healthRestore: { value: 5 } })], consumableCommandCompletions: [] });
  useAuthStore.setState({ user: { uid: 'u2' } });
  useCharacterStore.setState({ id: 'c2', currentCharacterId: 'c2', name: 'Ilse', class: 'Arcanoneer', health: { current: 20, max: 40 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 }, tempHealth: 0, tempMana: 0, tempActionPoints: 0 });
  useConditionStore.setState({ activeBuffs: [], activeDebuffs: [] });
  useCreatureStore.setState({ creatureTokens: [], tokens: [] });
  useCharacterTokenStore.setState({ characterTokens: [room.pcToken()] });
  usePartyStore.setState({ partyMembers: [{ id: 'player-1', userId: 'u2', character: { id: 'c2' } }] });
  useGameStore.setState({ isInMultiplayer: true, multiplayerRoom: { id: 'r' }, currentPlayer: { id: 'player-1', name: 'Ilse' }, multiplayerSocket: socket(), actorConsequenceStatus: null });
  mockActionSlots = Array(12).fill(null); mockActionSlots[0] = { type: 'consumable', originalItemId: 'potion', name: 'Potion of Insight', icon: 'p' };
});
afterEach(cleanup);

describe('one pending request across two ordinary entry points (fake socket)', () => {
  test('ActionBar slot then Inventory Use while the room is answering: one command, one consumption', async () => {
    render(<ActionBar />); render(<InventoryWindow />);
    await clickActionSlot();
    expect(commands()).toHaveLength(1);
    await useFromInventory();                       // the shared in-flight key is still held by the ActionBar use
    expect(commands()).toHaveLength(1);             // no second command, no second local effect
    await release('accepted');
    expect(commands()).toHaveLength(1);
    expect(quantity()).toBe(1);
    expect(health().current).toBe(25);
  });
});

describe('accepted-but-unsynced is not a refusal (fake socket)', () => {
  test('snapshot_required + acceptedReceipt consumes and heals once', async () => {
    deferAck = false;
    room.respond = (event, payload) => (event === 'actor_snapshot' ? room.snapshot()
      : { success: false, code: 'snapshot_required', commandId: payload.commandId, acceptedReceipt: { commandId: payload.commandId }, status: 'accepted' });
    render(<ActionBar />); await clickActionSlot();
    expect(quantity()).toBe(1);
    expect(health().current).toBe(25);
    expect(notices.filter(n => /was not used/.test(n))).toHaveLength(0);
  });

  test('a real refusal consumes nothing and is shown verbatim', async () => {
    deferAck = false;
    room.respond = event => (event === 'actor_snapshot' ? room.snapshot() : REFUSAL);
    render(<ActionBar />); await clickActionSlot();
    expect(quantity()).toBe(2);
    expect(health().current).toBe(20);
    expect(notices[0]).toMatch(/Potion of Insight was not used/);
    expect(notices[0]).toContain(REFUSAL.error);
  });
});

describe('the pack changes while the room is answering (fake socket)', () => {
  test('item removed while waiting: no healing, no second use, explicit notice', async () => {
    render(<ActionBar />); await clickActionSlot();
    useInventoryStore.setState({ items: [] });
    await release('accepted');
    expect(health().current).toBe(20);
    expect(quantity()).toBe(0);
    expect(notices.some(n => /took effect in the room, but it is no longer in your pack/.test(n))).toBe(true);
  });

  test('quantity and position change while waiting: exactly one live decrement and one heal', async () => {
    render(<ActionBar />); await clickActionSlot();
    const item = useInventoryStore.getState().items[0];
    useInventoryStore.setState({ items: [{ ...item, quantity: 1, position: { row: 3, col: 4 } }] });
    await release('accepted');
    expect(quantity()).toBe(0);                     // the live quantity (1) is decremented once
    expect(health().current).toBe(25);              // the same use heals once
    expect(commands()).toHaveLength(1);
  });

  test('ActionBar applies its heal to the live sheet value (fixed)', async () => {
    // Invariant: the +5 applies to the sheet as it is at confirmation time.
    render(<ActionBar />); await clickActionSlot();
    useCharacterStore.setState({ health: { current: 30, max: 40 } });   // another local effect landed while waiting
    await release('accepted');
    expect(health().current).toBe(35);
    expect(quantity()).toBe(1);
  });

  test('Inventory Use applies its heal to the live sheet value (sibling contrast)', async () => {
    render(<InventoryWindow />); await useFromInventory();
    useCharacterStore.setState({ health: { current: 30, max: 40 } });
    await release('accepted');
    expect(health().current).toBe(35);              // the sibling reads getState() when the answer arrives
    expect(quantity()).toBe(1);
  });
});

describe('lifecycle during the wait (fake socket)', () => {
  test('ActionBar unmount before the answer: the already-sent use still completes once', async () => {
    const view = render(<ActionBar />); await clickActionSlot();
    view.unmount();
    await release('accepted');
    expect(quantity()).toBe(1);
    expect(health().current).toBe(25);
  });

  test('switching the active character before the answer does not mutate the new character and preserves the accepted command for reconciliation', async () => {
    // INVARIANT: a late confirmation must not mutate whichever character is
    // active when the room answers. The command was addressed to c2; this case switches to c3 while waiting.
    render(<ActionBar />); await clickActionSlot();
    useCharacterStore.setState({ id: 'c3', currentCharacterId: 'c3', name: 'Other', health: { current: 10, max: 50 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 } });
    await release('accepted');
    expect(useCharacterStore.getState().health).toEqual({ current: 10, max: 50 });
    expect(useCharacterStore.getState().mana).toEqual({ current: 10, max: 30 });
    expect(useCharacterStore.getState().actionPoints).toEqual({ current: 2, max: 5 });
    expect(quantity()).toBe(2);
    expect(hasUnresolved('potion')).toBe(true);
    expect(notices.some(n => n.includes('refused') || n.includes('did not accept'))).toBe(false);
  });

  test('Inventory Use before the answer does not mutate the new character and preserves the accepted command', async () => {
    // The sibling entry point reads useCharacterStore.getState() when the answer arrives;
    // it must not mutate the new character and preserves the accepted command.
    render(<InventoryWindow />); await useFromInventory();
    expect(commands()).toHaveLength(1);
    useCharacterStore.setState({ id: 'c3', currentCharacterId: 'c3', name: 'Other', health: { current: 10, max: 50 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 } });
    await release('accepted');
    expect(useCharacterStore.getState().health).toEqual({ current: 10, max: 50 });
    expect(useCharacterStore.getState().mana).toEqual({ current: 10, max: 30 });
    expect(useCharacterStore.getState().actionPoints).toEqual({ current: 2, max: 5 });
    expect(quantity()).toBe(2);
    expect(hasUnresolved('potion')).toBe(true);
    expect(notices.some(n => n.includes('refused') || n.includes('did not accept'))).toBe(false);
  });

  test('cancelling a pre-submit overheal after the item vanished releases the item key', async () => {
    // Invariant: the choice is opened before any command is sent; Cancel never consumes and always releases the
    // shared held key, even if the pack entry disappeared while the choice was open.
    useInventoryStore.setState({ items: [potion({ healthRegen: { value: 2 }, healthRestore: { value: 10 } })] });
    useCharacterStore.setState({ health: { current: 35, max: 40 } });
    render(<ActionBar />); await clickActionSlot();
    expect(commands()).toHaveLength(0);             // nothing was submitted before the choice
    expect(isHeld('potion')).toBe(true);            // the overheal choice is open and the key is held
    await act(async () => { useInventoryStore.setState({ items: [] }); });   // the pack entry vanishes while the choice is open
    await flush();
    await act(async () => { screen.getByRole('button', { name: /Cancel/ }).dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0 })); });
    await flush();
    expect(isHeld('potion')).toBe(false);
    expect(useGameStore.getState().isInMultiplayer).toBe(true);
    await act(async () => { useInventoryStore.setState({ items: [{ ...potion({ healthRegen: { value: 2 }, healthRestore: { value: 5 } }), id: 'inv-2' }] }); });
    await flush();
    await clickActionSlot();
    await release('accepted');
    expect(commands()).toHaveLength(1);             // a later pack instance is usable again
    expect(useInventoryStore.getState().items.find(i => i.id === 'inv-2').quantity).toBe(1);
    expect(notices.some(n => /healing choice is waiting/.test(n))).toBe(false);
  });

  test('cancelling a condition-less overheal releases the item key (no room command involved)', async () => {
    // Invariant: Cancel clears the held key for an item with no stat conditions too. The item stays in the
    // pack; only the healing choice is abandoned.
    useInventoryStore.setState({ items: [potion({ healthRestore: { value: 10 } })] });
    useCharacterStore.setState({ health: { current: 35, max: 40 } });
    render(<ActionBar />); await clickActionSlot();
    expect(commands()).toHaveLength(0);             // no condition: no room command, but the choice is still held
    expect(isHeld('potion')).toBe(true);
    await act(async () => { screen.getByRole('button', { name: /Cancel/ }).dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0 })); });
    await flush();
    expect(isHeld('potion')).toBe(false);
    await clickActionSlot();
    expect(isHeld('potion')).toBe(true);            // a later use opens a new choice instead of being blocked
    expect(quantity()).toBe(2);
    expect(notices.some(n => /healing choice is waiting/.test(n))).toBe(false);
  });
});

describe('the Cap / Temporary / Cancel choice is collected before submission (fake socket)', () => {
  const acceptReflecting = () => {
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
  };

  test('Cancel sends nothing and leaves the conditions, the sheet and the pack unchanged', async () => {
    useInventoryStore.setState({ items: [potion({ healthRegen: { value: 2 }, healthRestore: { value: 10 } })] });
    useCharacterStore.setState({ health: { current: 35, max: 40 } });
    deferAck = false;
    acceptReflecting();
    render(<ActionBar />); await clickActionSlot();
    expect(commands()).toHaveLength(0);             // no effects submitted before the choice
    expect(isHeld('potion')).toBe(true);
    expect(quantity()).toBe(2);
    expect(health().current).toBe(35);
    expect(useConditionStore.getState().activeBuffs).toHaveLength(0);
    expect(room.conditions).toHaveLength(0);
    await act(async () => { screen.getByRole('button', { name: 'Cancel' }).dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0 })); });
    await flush();
    expect(isHeld('potion')).toBe(false);
    expect(commands()).toHaveLength(0);
    expect(quantity()).toBe(2);
    expect(health().current).toBe(35);
    expect(useConditionStore.getState().activeBuffs).toHaveLength(0);
    expect(room.conditions).toHaveLength(0);
  });

  test('Cap at Max submits one atomic command and consumes once', async () => {
    useInventoryStore.setState({ items: [potion({ healthRegen: { value: 2 }, healthRestore: { value: 10 } })] });
    useCharacterStore.setState({ health: { current: 35, max: 40 } });
    deferAck = false;
    acceptReflecting();
    render(<ActionBar />); await clickActionSlot();
    expect(commands()).toHaveLength(0);
    await act(async () => { screen.getByRole('button', { name: /Cap at Max/ }).dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0 })); });
    await flush();
    expect(commands()).toHaveLength(1);
    const op = commands()[0].payload.actors[0];
    expect(op.finalResources?.hp).toEqual({ current: 40, temp: 0 });
    expect(op.conditions).toHaveLength(1);
    expect(quantity()).toBe(1);
    expect(health().current).toBe(40);
    expect(isHeld('potion')).toBe(false);
  });

  test('Add Temporary submits the approved overflow rule in the same command and consumes once', async () => {
    useInventoryStore.setState({ items: [potion({ healthRegen: { value: 2 }, healthRestore: { value: 20 } })] });
    useCharacterStore.setState({ health: { current: 30, max: 40 } });
    deferAck = false;
    acceptReflecting();
    render(<ActionBar />); await clickActionSlot();
    expect(commands()).toHaveLength(0);
    await act(async () => { screen.getByRole('button', { name: /Add Temporary/ }).dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0 })); });
    await flush();
    expect(commands()).toHaveLength(1);
    const op = commands()[0].payload.actors[0];
    expect(op.finalResources?.hp).toEqual({ current: 40, temp: 10 });
    expect(quantity()).toBe(1);
    expect(health().current).toBe(40);
    expect(useCharacterStore.getState().tempHealth).toBe(10);
  });

  test('authoritative inputs are revalidated at commit: changed HP drives the finalResources value', async () => {
    useInventoryStore.setState({ items: [potion({ healthRegen: { value: 2 }, healthRestore: { value: 10 } })] });
    useCharacterStore.setState({ health: { current: 35, max: 40 } });
    deferAck = false;
    acceptReflecting();
    render(<ActionBar />); await clickActionSlot();
    expect(commands()).toHaveLength(0);
    useCharacterStore.setState({ health: { current: 10, max: 40 } });   // authoritative change while the choice is open
    await act(async () => { screen.getByRole('button', { name: /Cap at Max/ }).dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0 })); });
    await flush();
    expect(commands()).toHaveLength(1);
    expect(commands()[0].payload.actors[0].finalResources?.hp).toEqual({ current: 20, temp: 0 });
    expect(quantity()).toBe(1);
    expect(health().current).toBe(20);
  });

  test('a failed pre-submit journal write refuses with no command, no effect and no deduction', async () => {
    useInventoryStore.setState({ items: [potion({ healthRegen: { value: 2 }, healthRestore: { value: 5 } })] });
    useCharacterStore.setState({ health: { current: 20, max: 40 } });
    deferAck = false;
    acceptReflecting();
    const original = Storage.prototype.setItem;
    const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function (key, value) {
      if (key === 'mythrill-vtt:unresolved-consumable-commands:v1') {
        const error = new Error('QuotaExceededError'); error.name = 'QuotaExceededError'; throw error;
      }
      return original.call(this, key, value);
    });
    try {
      render(<ActionBar />); await clickActionSlot();
      expect(commands()).toHaveLength(0);
      expect(quantity()).toBe(2);
      expect(health().current).toBe(20);
      expect(useConditionStore.getState().activeBuffs).toHaveLength(0);
      expect(isHeld('potion')).toBe(false);
      expect(notices.some(n => /could not store the recovery record|nothing was sent/i.test(n))).toBe(true);
    } finally {
      spy.mockRestore();
    }
  });

  test('a journal failure after submission keeps the uncertain command and blocks a fresh retry', async () => {
    useInventoryStore.setState({ items: [potion({ healthRegen: { value: 2 }, healthRestore: { value: 5 } })] });
    useCharacterStore.setState({ health: { current: 20, max: 40 } });
    deferAck = false;
    room.respond = (event, payload) => (event === 'actor_snapshot'
      ? room.snapshot()
      : { success: false, code: 'outcome_unknown', error: 'lost ack', commandId: payload.commandId });
    const original = Storage.prototype.setItem;
    let journalWrites = 0;
    const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function (key, value) {
      if (key === 'mythrill-vtt:unresolved-consumable-commands:v1') {
        journalWrites += 1;
        if (journalWrites > 1) {
          const error = new Error('QuotaExceededError'); error.name = 'QuotaExceededError'; throw error;
        }
      }
      return original.call(this, key, value);
    });
    try {
      render(<ActionBar />); await clickActionSlot();
      expect(commands()).toHaveLength(1);
      expect(quantity()).toBe(2);
      expect(health().current).toBe(20);
      expect(hasUnresolved('potion')).toBe(true);
      expect(notices.some(n => /could not save the recovery record/i.test(n))).toBe(true);
      expect(notices.some(n => /do not reload|may have recorded/i.test(n))).toBe(true);
      const firstCommand = commands()[0].payload.commandId;
      await clickActionSlot();                       // must replay the same command, never a fresh use
      expect(commands()).toHaveLength(2);
      expect(commands()[1].payload.commandId).toBe(firstCommand);
      expect(quantity()).toBe(2);
    } finally {
      spy.mockRestore();
    }
  });

  
  test('a second copy of the same potion does not settle the first copy accepted use', async () => {
    let first = true;
    room.respond = (event, payload) => {
      if (event === 'actor_snapshot') return room.snapshot();
      if (first) { first = false; return { success: false, code: 'outcome_unknown', error: 'lost ack', commandId: payload.commandId }; }
      return room.accepted(payload);
    };
    deferAck = false;
    render(<ActionBar />); await clickActionSlot();
    const firstCommand = commands()[0].payload.commandId;
    expect(quantity()).toBe(2);
    expect(hasUnresolved('potion', 'c2')).toBe(true);
    await act(async () => {
      useInventoryStore.setState({ items: [{ ...potion({ healthRegen: { value: 2 }, healthRestore: { value: 5 } }), id: 'inv-2' }] });
    });
    await flush();
    expect(isHeld('potion')).toBe(false);
    await clickActionSlot();
    expect(commands()).toHaveLength(2);
    expect(commands()[1].payload.commandId).not.toBe(firstCommand);
    expect(useInventoryStore.getState().items.find(i => i.id === 'inv-2').quantity).toBe(1);
    expect(health().current).toBe(25);
    // inv-1's accepted-but-unknown use is still owned by inv-1 and is not marked completed by inv-2.
    expect(hasUnresolved('potion', 'c2')).toBe(true);
  });

  test('a saved deduction marker stops a replay from deducting the same command twice', async () => {
    useInventoryStore.setState({ items: [potion({ healthRegen: { value: 2 }, healthRestore: { value: 5 } })] });
    useCharacterStore.setState({ health: { current: 20, max: 40 } });
    deferAck = false;
    acceptReflecting();
    const view = render(<ActionBar />);
    await clickActionSlot();
    expect(commands()).toHaveLength(1);
    expect(quantity()).toBe(1);
    const command = commands()[0].payload;
    // Simulate a crash after the deduction+marker save but before journal cleanup: the journal is still present.
    preserveAcceptedForReconciliation('potion', {
      commandId: command.commandId, command, itemId: 'inv-1', characterId: 'c2',
      outcome: { success: true, status: 'accepted', commandId: command.commandId }
    });
    view.unmount();
    resetUnresolvedForTests({ keepStorage: true });   // reload: memory gone, journal and inventory save retained
    render(<ActionBar />); await clickActionSlot();
    expect(quantity()).toBe(1);                      // no second deduction
    expect(hasUnresolved('potion')).toBe(false);
    expect(notices.some(n => /no second deduction was made/i.test(n))).toBe(true);
  });
});

describe('reload after server acceptance but before local removal (fake socket; recovery)', () => {
  test('after reload, the unresolved command identity is preserved and replayed — item is decremented once without a new command', async () => {
    // INVARIANT: one room-accepted consumable use corresponds to one item decrease, and after a reload
    // the accepted use is reconciled by replaying the original commandId, never re-sent as a fresh command.
    let firstReceipt = null;
    room.respond = (event, payload) => {
      if (event === 'actor_snapshot') return room.snapshot();
      if (!firstReceipt) {
        firstReceipt = room.accepted(payload);      // the room recorded it before the ACK was lost
        return { success: false, code: 'outcome_unknown', error: 'ACK/broadcast lost', commandId: payload.commandId };
      }
      if (payload.commandId === commands()[0].payload.commandId) {
        return { ...firstReceipt, replayed: true, actorSnapshot: room.snapshot() };
      }
      return room.accepted(payload);
    };
    deferAck = false;                               // the lost ACK is not deferred; the room answer is simply unknown
    const first = render(<ActionBar />);
    await clickActionSlot();
    const firstCommand = commands()[0].payload.commandId;
    expect(quantity()).toBe(2);                     // the client kept the item, as it must while unsure
    expect(room.conditions).toHaveLength(1);        // but the room already holds the effect

    first.unmount();
    resetUnresolvedForTests({ keepStorage: true }); // reload: in-memory registries are wiped, localStorage retains the command
    expect(hasUnresolved('potion')).toBe(true);
    useCharacterTokenStore.setState({ characterTokens: [room.pcToken()] });   // the reloaded room projection

    render(<ActionBar />);
    await clickActionSlot();
    expect(commands()).toHaveLength(2);
    expect(commands()[1].payload.commandId).toBe(firstCommand);               // exact same commandId replayed, never a new command
    expect(room.conditions).toHaveLength(1);        // no duplicate condition applied
    expect(quantity()).toBe(1);                     // item consumed once
    expect(health().current).toBe(25);              // healed once
  });

  test('after reload while the earlier use is still outcome_unknown, the retry is held and never turns into a fresh use', async () => {
    room.respond = (event, payload) => (event === 'actor_snapshot'
      ? room.snapshot()
      : { success: false, code: 'outcome_unknown', error: 'still unknown', commandId: payload.commandId });
    deferAck = false;
    const first = render(<ActionBar />);
    await clickActionSlot();
    const firstCommand = commands()[0].payload.commandId;
    expect(quantity()).toBe(2);

    first.unmount();
    resetUnresolvedForTests({ keepStorage: true }); // reload
    expect(hasUnresolved('potion')).toBe(true);
    useCharacterTokenStore.setState({ characterTokens: [room.pcToken()] });

    render(<ActionBar />);
    await clickActionSlot();
    expect(commands()).toHaveLength(2);
    expect(commands()[1].payload.commandId).toBe(firstCommand);               // replayed original commandId
    expect(quantity()).toBe(2);                     // still held, never consumed or turned into a new use
    expect(notices.some(n => /held to avoid applying it twice/.test(n))).toBe(true);
  });

  test('mixed healing + condition with active owner attachment sends finalResources and conditions in one command and persists healing', async () => {
    selectOwnerAttachment(room.ref);
    deferAck = false;
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
    render(<ActionBar />);
    await clickActionSlot();
    expect(commands()).toHaveLength(1);
    const op = commands()[0].payload.actors[0];
    expect(op.finalResources?.hp).toEqual({ current: 25, temp: 0 });
    expect(op.conditions).toHaveLength(1);
    expect(quantity()).toBe(1);
    expect(health().current).toBe(25);              // neither overwritten to 20 by room projection nor double-healed to 30
  });

  test('authoritative resource change during actor_snapshot refresh is planned from the fresh snapshot, never stale pre-click HP', async () => {
    selectOwnerAttachment(room.ref);
    deferAck = false;
    const originalSnapshot = room.snapshot;
    let damaged = false;
    room.snapshot = () => {
      const snap = originalSnapshot();
      if (damaged) return snap;
      damaged = true;
      // Intervening damage lowered authoritative HP from 20 to 12 at a later cut, right before command preparation
      room.commitSeq += 1;
      room.projection = { ...room.projection, cut: room.projection.cut + 1 };
      const next = originalSnapshot();
      next.maps.m.characterTokens.pc2.character.health.current = 12;
      return next;
    };
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
    render(<ActionBar />);
    await clickActionSlot();
    room.snapshot = originalSnapshot;
    expect(commands()).toHaveLength(1);
    const op = commands()[0].payload.actors[0];
    expect(op.finalResources?.hp).toEqual({ current: 17, temp: 0 }); // 12 + 5 = 17 (not stale 20 + 5 = 25)
    expect(quantity()).toBe(1);
    expect(health().current).toBe(17);
  });

  test('pre-submission crash window: command is persisted to localStorage before the socket receives actor_consequence', async () => {
    let persistedDuringEmit = false;
    room.respond = (event, payload) => {
      if (event === 'actor_snapshot') return room.snapshot();
      const raw = window.localStorage.getItem('mythrill-vtt:unresolved-consumable-commands:v1');
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed?.potion?.some(e => e.commandId === payload.commandId && e.itemId === 'inv-1')) {
        persistedDuringEmit = true;
      }
      return room.accepted(payload);
    };
    deferAck = false;
    render(<ActionBar />);
    await clickActionSlot();
    expect(persistedDuringEmit).toBe(true);
    expect(quantity()).toBe(1);
    // After inventory deduction and markUseCompleted, journal is cleaned up
    expect(hasUnresolved('potion')).toBe(false);
  });
});
