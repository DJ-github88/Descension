import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SpellConsequenceHost from '../SpellConsequencePanel';
import {
  useSpellConsequenceStore,
  sendSpellApproval,
  checkSpellApproval,
  loadSpellDraft,
  discardSpellDraft,
  registerSpellConsequenceHandlers,
  consumeSpellReceipt
} from '../../../services/spellConsequenceService';
import { loadLatestSpell, unresolvedSpell } from '../../../services/spellConsequenceCustody';
import { notifyRoomRejoined, roomRejoinSubscriberCount } from '../../../services/roomRejoinBus';
import { requestActorEvent, refreshActorSnapshot, applyAcceptedConsequence } from '../../../services/actorConsequenceService';
import useGameStore from '../../../store/gameStore';
import useCharacterStore from '../../../store/characterStore';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useCreatureStore from '../../../store/creatureStore';

jest.mock('../../../store/authStore', () => ({
  __esModule: true,
  default: require('zustand').create(() => ({ user: { uid: 'owner-uid' } }))
}));
jest.mock('../../../store/gameStore', () => ({
  __esModule: true,
  default: require('zustand').create(() => ({
    isInMultiplayer: true,
    isGMMode: false,
    multiplayerRoom: { id: 'room-1' },
    multiplayerSocket: null,
    gridSize: 50,
    feetPerTile: 5
  }))
}));
jest.mock('../../../store/characterStore', () => ({
  __esModule: true,
  default: require('zustand').create(() => ({ currentCharacterId: 'char-1', class: 'Arcanoneer' }))
}));
jest.mock('../../../store/characterTokenStore', () => ({
  __esModule: true,
  default: require('zustand').create(() => ({ characterTokens: [] }))
}));
jest.mock('../../../store/creatureStore', () => ({
  __esModule: true,
  default: require('zustand').create(() => ({ creatureTokens: [], creatures: [] })),
  getCreatureSizeMapping: () => ({ width: 1, height: 1 })
}));
jest.mock('../../../store/combatStore', () => ({
  __esModule: true,
  default: require('zustand').create(() => ({}))
}));
jest.mock('../../../store/targetingStore', () => ({
  __esModule: true,
  default: require('zustand').create(() => ({ active: null, cancelTargetPickFor: jest.fn() }))
}));
jest.mock('../../../store/spellAoEStore', () => ({
  __esModule: true,
  default: require('zustand').create(() => ({ session: null }))
}));
jest.mock('../../../store/chatStore', () => ({
  __esModule: true,
  default: require('zustand').create(() => ({ notifications: { combat: [] }, addNotification: jest.fn() }))
}));

jest.mock('../../../store/storeRegistry', () => {
  const stores = {
    authStore: () => require('../../../store/authStore').default,
    gameStore: () => require('../../../store/gameStore').default,
    characterStore: () => require('../../../store/characterStore').default,
    characterTokenStore: () => require('../../../store/characterTokenStore').default,
    creatureStore: () => require('../../../store/creatureStore').default,
    combatStore: () => require('../../../store/combatStore').default,
    targetingStore: () => require('../../../store/targetingStore').default,
    spellAoEStore: () => require('../../../store/spellAoEStore').default,
    chatStore: () => require('../../../store/chatStore').default
  };
  return { getStore: name => stores[name]?.() };
});

jest.mock('../../../persistence/scopedConsumer', () => ({
  ...jest.requireActual('../../../persistence/scopedConsumer'),
  captureOwnerGuard: () => ({ ok: true, isCurrent: () => true }),
  resolveActiveScope: () => ({ scopeKind: 'user', scopeId: 'owner-uid' })
}));

let mockSupport;
jest.mock('../../../services/spellConsequence', () => ({
  ...jest.requireActual('../../../services/spellConsequence'),
  supportSpell: () => mockSupport
}));

jest.mock('../../../services/actorConsequenceService', () => ({
  refOf: t => t?.state?.actorContract ? {
    kind: t.state.actorContract.kind,
    roomId: t.state.actorContract.roomId,
    mapId: t.state.actorContract.mapId,
    tokenId: t.state.actorContract.tokenId,
    instanceId: t.state.actorContract.instanceId,
    ...(t.state.actorContract.ownerUid ? { ownerUid: t.state.actorContract.ownerUid } : {}),
    ...(t.state.actorContract.characterId ? { characterId: t.state.actorContract.characterId } : {})
  } : null,
  findActor: ref => {
    if (!ref) return null;
    const pcs = require('../../../store/characterTokenStore').default.getState().characterTokens;
    const npcs = require('../../../store/creatureStore').default.getState().creatureTokens;
    return [...pcs, ...npcs].find(t =>
      t?.state?.actorContract?.tokenId === ref.tokenId &&
      t?.state?.actorContract?.instanceId === ref.instanceId &&
      t?.state?.actorContract?.mapId === ref.mapId
    ) || null;
  },
  inSharedRoom: () => true,
  refreshActorSnapshot: jest.fn(async () => ({ success: true, roomId: 'room-1', actionEpoch: 'epoch-1', commitSequence: 1 })),
  prepareActorCommand: jest.fn(),
  submitPreparedActorCommand: jest.fn(),
  retryActorCommand: jest.fn(),
  requestActorEvent: jest.fn(),
  roomResourceProjection: () => {
    const pc = require('../../../store/characterTokenStore').default.getState().characterTokens[0];
    if (!pc?.state?.actorContract) return null;
    return {
      roomActorProjection: {
        ref: {
          kind: 'character',
          roomId: 'room-1',
          mapId: 'm1',
          tokenId: pc.state.actorContract.tokenId,
          instanceId: pc.state.actorContract.instanceId,
          ownerUid: 'owner-uid',
          characterId: 'char-1'
        }
      }
    };
  },
  applyAcceptedConsequence: jest.fn(() => true),
  selectOwnerAttachment: jest.fn()
}));

const pcToken = {
  id: 'pc-1',
  mapId: 'm1',
  ownerUserId: 'owner-uid',
  character: { id: 'char-1', name: 'Aeliana', stats: { intelligence: 14 }, actionPoints: { current: 4 }, mana: { current: 10 }, health: { current: 30, max: 40 } },
  state: {
    conditions: [],
    actorContract: { version: 1, kind: 'character', roomId: 'room-1', mapId: 'm1', tokenId: 'pc-1', instanceId: 'inst-pc-1', ownerUid: 'owner-uid', characterId: 'char-1', primary: true, revision: 0 }
  }
};

const targetToken = {
  id: 'branvig',
  mapId: 'm1',
  name: 'Branvig',
  state: {
    currentHp: 20, maxHp: 20, tempHealth: 0, conditions: [],
    actorContract: { version: 1, kind: 'creature', roomId: 'room-1', mapId: 'm1', tokenId: 'branvig', instanceId: 'inst-branvig', revision: 0 }
  }
};

const otherTargetToken = {
  id: 'boar',
  mapId: 'm1',
  name: 'Stone Boar',
  state: {
    currentHp: 25, maxHp: 25, tempHealth: 0, conditions: [],
    actorContract: { version: 1, kind: 'creature', roomId: 'room-1', mapId: 'm1', tokenId: 'boar', instanceId: 'inst-boar', revision: 0 }
  }
};

const roll = { mode: 'digital', dice: [{ sides: 6, faces: [4] }], constant: 2, total: 6, reading: '1d6 + 2' };
const targetRef = { kind: 'creature', roomId: 'room-1', mapId: 'm1', tokenId: 'branvig', instanceId: 'inst-branvig' };
const otherTargetRef = { kind: 'creature', roomId: 'room-1', mapId: 'm1', tokenId: 'boar', instanceId: 'inst-boar' };

let uuidCounter = 0;
function makeSocket() {
  const handlers = {};
  return {
    handlers,
    on: jest.fn((event, fn) => { handlers[event] = fn; }),
    off: jest.fn((event, fn) => { if (handlers[event] === fn) delete handlers[event]; })
  };
}

function makeSupport() {
  return {
    supported: true,
    kind: 'damage',
    name: 'Ember Bolt',
    definitionId: 'ember-bolt',
    definitionHash: 'p9-spell:v1/abc',
    price: { ap: 1, mana: 2 },
    payment: { affordable: true, classPayment: null },
    cooldown: { type: 'none', value: 0 },
    reading: { dice: [{ count: 1, sides: 6 }], constant: 2, reading: '1d6 + 2' },
    damageTypes: ['ember'],
    raw: { targetingConfig: { rangeDistance: 30, rangeType: 'ranged' } }
  };
}

beforeEach(() => {
  global.crypto = { randomUUID: () => `00000000-0000-4000-8000-${String(++uuidCounter).padStart(12, '0')}` };
  localStorage.clear();
  mockSupport = makeSupport();
  requestActorEvent.mockReset();
  requestActorEvent.mockImplementation(async event => {
    if (event === 'actor_spell_list') return { success: true, pending: [], targetProposals: [] };
    if (event === 'actor_authored_list') return { success: true, entries: [], revision: 0 };
    if (event === 'actor_trigger_list') return { success: true, offers: [], ledgerRevision: 0 };
    if (event === 'actor_passive_list') return { success: true, activations: [], revision: 0 };
    if (event === 'actor_placed_effect_list') return { success: true, placements: [], revision: 0 };
    return { success: false, code: 'awaiting_gm', contentHash: 'hash-1' };
  });
  refreshActorSnapshot.mockResolvedValue({ success: true, roomId: 'room-1', actionEpoch: 'epoch-1', commitSequence: 1 });
  applyAcceptedConsequence.mockReturnValue(true);
  useCharacterTokenStore.setState({ characterTokens: [pcToken] });
  useCreatureStore.setState({ creatureTokens: [targetToken, otherTargetToken], creatures: [] });
  useCharacterStore.setState({ currentCharacterId: 'char-1', class: 'Arcanoneer' });
  useGameStore.setState({ isInMultiplayer: true, isGMMode: false, multiplayerRoom: { id: 'room-1' }, multiplayerSocket: null });
  useSpellConsequenceStore.setState({ owner: null, ownerStatus: null, gmPending: {}, gmStatus: {}, targetProposals: [] });
});

test('actor_removed reconciles mounted OwnerPanel, OwnerChip, and GmPanel promptly, preserves roll draft, and emits no automatic recast/payment', async () => {
  const socket = makeSocket();
  useGameStore.setState({ multiplayerSocket: socket, isGMMode: true });
  const cleanup = registerSpellConsequenceHandlers({ socket });

  requestActorEvent.mockResolvedValue({ success: false, code: 'awaiting_gm', contentHash: 'hash-1' });
  useSpellConsequenceStore.setState({ owner: { spellId: 'ember-bolt', origin: {} } });

  render(<SpellConsequenceHost />);

  await act(async () => {
    await sendSpellApproval({ spellId: 'ember-bolt', targetRef, roll, origin: {} });
  });
  expect(useSpellConsequenceStore.getState().ownerStatus?.phase).toBe('awaiting');
  const approvalId = loadLatestSpell().approval.approvalId;

  // Simulate GM receiving pending notification too
  act(() => {
    socket.handlers.actor_spell_pending({ roomId: 'room-1', approval: loadLatestSpell().approval, contentHash: 'hash-1' });
  });

  expect(screen.getByRole('button', { name: 'Check this same approval' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Accept one consequence' })).toBeTruthy();

  requestActorEvent.mockClear();

  // Authoritative actor_removed closure arrives
  act(() => {
    socket.handlers.actor_spell_closed({ roomId: 'room-1', approvalId, contentHash: 'hash-1', code: 'actor_removed' });
  });

  // Owner UI reconciled promptly; Check this same approval removed; GM card removed
  expect(screen.getByText(/Closed before acceptance \(actor removed\) — no payment was recorded\./)).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Check this same approval' })).toBeNull();
  expect(screen.queryByRole('button', { name: 'Withdraw before acceptance' })).toBeNull();
  expect(screen.queryByRole('button', { name: 'Accept one consequence' })).toBeNull();

  // Retained roll is preserved as a draft for the same spell; approval is no longer unresolved
  expect(unresolvedSpell(loadLatestSpell())).toBe(false);
  expect(loadSpellDraft()?.roll).toEqual(roll);
  expect(loadSpellDraft()?.fromApproval).toBe(approvalId);

  // No automatic recast or payment
  expect(requestActorEvent).not.toHaveBeenCalled();

  // OwnerChip stays hidden after closing OwnerPanel
  act(() => { useSpellConsequenceStore.setState({ owner: null }); });
  expect(screen.queryByRole('button', { name: 'Open' })).toBeNull();

  cleanup();
});

test('combat_clock_changed reconciles owner and GM UI, preserves roll draft, and leaves unrelated pending approvals intact', async () => {
  const socket = makeSocket();
  useGameStore.setState({ multiplayerSocket: socket, isGMMode: true });
  const cleanup = registerSpellConsequenceHandlers({ socket });

  requestActorEvent.mockResolvedValue({ success: false, code: 'awaiting_gm', contentHash: 'hash-1' });
  useSpellConsequenceStore.setState({ owner: { spellId: 'ember-bolt', origin: {} } });

  render(<SpellConsequenceHost />);

  await act(async () => {
    await sendSpellApproval({ spellId: 'ember-bolt', targetRef, roll, origin: {} });
  });
  const approvalId = loadLatestSpell().approval.approvalId;

  const unrelatedApproval = {
    ...loadLatestSpell().approval,
    approvalId: 'unrelated-approval-id',
    target: otherTargetRef
  };
  act(() => {
    socket.handlers.actor_spell_pending({ roomId: 'room-1', approval: loadLatestSpell().approval, contentHash: 'hash-1' });
    socket.handlers.actor_spell_pending({ roomId: 'room-1', approval: unrelatedApproval, contentHash: 'hash-unrelated' });
  });

  expect(Object.keys(useSpellConsequenceStore.getState().gmPending)).toEqual([approvalId, 'unrelated-approval-id']);

  act(() => {
    socket.handlers.actor_spell_closed({ roomId: 'room-1', approvalId, contentHash: 'hash-1', code: 'combat_clock_changed' });
  });

  expect(screen.getByText(/Closed before acceptance \(combat clock changed\) — no payment was recorded\./)).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Check this same approval' })).toBeNull();
  expect(Object.keys(useSpellConsequenceStore.getState().gmPending)).toEqual(['unrelated-approval-id']);
  expect(document.querySelector('.p9-gm')?.textContent).toContain('Stone Boar');
  expect(loadSpellDraft()?.roll).toEqual(roll);

  cleanup();
});

test('duplicate and out-of-order notifications do not overwrite discarded drafts or resurrect closed approvals', async () => {
  const socket = makeSocket();
  useGameStore.setState({ multiplayerSocket: socket, isGMMode: true });
  const cleanup = registerSpellConsequenceHandlers({ socket });

  // Slow actor_spell_approve promise to test delayed pending ACK arriving AFTER actor_spell_closed
  let resolveApprove;
  requestActorEvent.mockImplementation(event => {
    if (event === 'actor_spell_approve') return new Promise(resolve => { resolveApprove = resolve; });
    if (event === 'actor_spell_list') return Promise.resolve({ success: true, pending: [], targetProposals: [] });
    if (event === 'actor_authored_list') return Promise.resolve({ success: true, entries: [], revision: 0 });
    if (event === 'actor_trigger_list') return Promise.resolve({ success: true, offers: [], ledgerRevision: 0 });
    return Promise.resolve({ success: false, code: 'awaiting_gm', contentHash: 'hash-1' });
  });

  useSpellConsequenceStore.setState({ owner: { spellId: 'ember-bolt', origin: {} } });
  const pendingPromise = sendSpellApproval({ spellId: 'ember-bolt', targetRef, roll, origin: {} });

  // Wait for refreshActorSnapshot inside sendSpellApproval to settle so requestActorEvent is invoked
  await act(async () => {
    for (let i = 0; i < 6 && !resolveApprove; i += 1) await Promise.resolve();
  });
  const approval = loadLatestSpell().approval;
  const approvalId = approval.approvalId;

  // Out-of-order: actor_spell_closed arrives BEFORE actor_spell_approve ACK and BEFORE actor_spell_pending
  act(() => {
    socket.handlers.actor_spell_closed({ roomId: 'room-1', approvalId, contentHash: 'hash-1', code: 'actor_removed' });
  });
  expect(loadLatestSpell().phase).toBe('closed');
  expect(loadSpellDraft()?.roll).toEqual(roll);

  // User discards the draft; duplicate actor_spell_closed must NOT restore it
  act(() => { discardSpellDraft(); });
  expect(loadSpellDraft()).toBeNull();
  act(() => {
    socket.handlers.actor_spell_closed({ roomId: 'room-1', approvalId, contentHash: 'hash-1', code: 'actor_removed' });
  });
  expect(loadSpellDraft()).toBeNull();

  // Delayed actor_spell_approve ACK ('awaiting_gm') arrives late: must NOT resurrect!
  await act(async () => {
    resolveApprove({ success: false, code: 'awaiting_gm', contentHash: 'hash-1' });
    await pendingPromise;
  });
  expect(loadLatestSpell().phase).toBe('closed');
  expect(useSpellConsequenceStore.getState().ownerStatus.phase).toBe('closed');

  // Delayed actor_spell_pending arrives late: must NOT resurrect gmPending!
  act(() => {
    socket.handlers.actor_spell_pending({ roomId: 'room-1', approval, contentHash: 'hash-1' });
  });
  expect(useSpellConsequenceStore.getState().gmPending[approvalId]).toBeUndefined();

  cleanup();
});

test('completed receipt is preserved against stray closure and delayed pending events', async () => {
  const socket = makeSocket();
  useGameStore.setState({ multiplayerSocket: socket, isGMMode: true });
  const cleanup = registerSpellConsequenceHandlers({ socket });

  requestActorEvent.mockResolvedValue({ success: false, code: 'awaiting_gm', contentHash: 'hash-1' });
  await act(async () => {
    await sendSpellApproval({ spellId: 'ember-bolt', targetRef, roll, origin: {} });
  });
  const approval = loadLatestSpell().approval;
  const approvalId = approval.approvalId;

  const receiptResult = {
    success: true,
    status: 'checkpoint-confirmed',
    receipt: {
      version: 1,
      roomId: 'room-1',
      commandId: 'cmd-1',
      submitterUid: 'gm-uid',
      acceptedAt: Date.now(),
      checkpointRevision: 1,
      source: approval.source,
      target: approval.target,
      authorization: { kind: 'owner-approval-gm', proposalId: approvalId },
      actors: [
        { ref: approval.source, finalResources: { ap: { current: 3, temp: 0 }, mana: { current: 8, temp: 0 } } },
        { ref: approval.target, finalResources: { hp: { current: 14, temp: 0 } } }
      ],
      adjudication: {
        definitionId: 'ember-bolt',
        definitionVersionOrHash: 'p9-spell:v1/abc',
        finalAmount: 6,
        adjustmentReason: '',
        chosenResult: JSON.stringify({
          capability: 'p9-spell:v1',
          approvalId,
          roll,
          kind: 'damage',
          damageTypes: ['ember'],
          spellName: 'Ember Bolt',
          sourceName: 'Aeliana',
          targetName: 'Branvig',
          gmConfirmed: true
        })
      }
    }
  };

  act(() => {
    useSpellConsequenceStore.setState({ gmStatus: { [approvalId]: { phase: 'accepted', checkpointRevision: 1, message: 'Accepted · checkpoint-confirmed' } } });
    consumeSpellReceipt(receiptResult);
  });
  expect(loadLatestSpell().phase).toBe('accepted');

  // Stray closure & delayed pending do not overwrite accepted state
  act(() => {
    socket.handlers.actor_spell_closed({ roomId: 'room-1', approvalId, contentHash: 'hash-1', code: 'actor_removed' });
    socket.handlers.actor_spell_pending({ roomId: 'room-1', approval, contentHash: 'hash-1' });
  });
  expect(loadLatestSpell().phase).toBe('accepted');
  expect(useSpellConsequenceStore.getState().ownerStatus.phase).toBe('accepted');
  expect(useSpellConsequenceStore.getState().gmStatus[approvalId].phase).toBe('accepted');
  expect(useSpellConsequenceStore.getState().gmPending[approvalId]).toBeUndefined();

  cleanup();
});

test('reconnect reconciles missed terminal closure via actor_spell_list without automatic recast or payment', async () => {
  const socket = makeSocket();
  useGameStore.setState({ multiplayerSocket: socket, isGMMode: false });
  const cleanup = registerSpellConsequenceHandlers({ socket });

  requestActorEvent.mockResolvedValueOnce({ success: false, code: 'awaiting_gm', contentHash: 'hash-1' });
  useSpellConsequenceStore.setState({ owner: { spellId: 'ember-bolt', origin: {} } });
  render(<SpellConsequenceHost />);

  await act(async () => {
    await sendSpellApproval({ spellId: 'ember-bolt', targetRef, roll, origin: {} });
  });
  const approvalId = loadLatestSpell().approval.approvalId;

  // Owner missed actor_spell_closed while disconnected; on reconnect actor_spell_list returns closedApproval
  requestActorEvent.mockClear();
  requestActorEvent.mockImplementation(async (event, payload) => {
    if (event === 'actor_spell_list') {
      expect(payload).toEqual({ roomId: 'room-1', approvalId });
      return {
        success: true,
        pending: [],
        targetProposals: [],
        closedApproval: { roomId: 'room-1', approvalId, contentHash: 'hash-1', code: 'actor_removed' }
      };
    }
    if (event === 'actor_authored_list') return { success: true, entries: [], revision: 0 };
    if (event === 'actor_trigger_list') return { success: true, obligations: [], listeners: [], revision: 0 };
    if (event === 'actor_placed_effect_list') return { success: true, placements: [], revision: 0 };
    throw new Error(`Unexpected automatic event: ${event}`);
  });

  await act(async () => {
    notifyRoomRejoined({ socket, roomId: 'room-1' });
    await Promise.resolve();
    await Promise.resolve();
  });

  expect(loadLatestSpell().phase).toBe('closed');
  expect(screen.getByText(/Closed before acceptance \(actor removed\) — no payment was recorded\./)).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Check this same approval' })).toBeNull();
  expect(loadSpellDraft()?.roll).toEqual(roll);
  expect(requestActorEvent.mock.calls.some(([e]) => ['actor_spell_approve', 'actor_consequence'].includes(e))).toBe(false);

  cleanup();
});

test('outcome_unknown retains exact-command recovery across reconnect when server has no closure record', async () => {
  const socket = makeSocket();
  useGameStore.setState({ multiplayerSocket: socket, isGMMode: false });
  const cleanup = registerSpellConsequenceHandlers({ socket });

  requestActorEvent.mockImplementation(async event => {
    if (event === 'actor_spell_approve') return { success: false, code: 'outcome_unknown' };
    if (event === 'actor_spell_list') return { success: true, pending: [], targetProposals: [] };
    if (event === 'actor_authored_list') return { success: true, entries: [], revision: 0 };
    if (event === 'actor_trigger_list') return { success: true, offers: [], ledgerRevision: 0 };
    if (event === 'actor_passive_list') return { success: true, activations: [], revision: 0 };
    if (event === 'actor_placed_effect_list') return { success: true, placements: [], revision: 0 };
    return { success: false, code: 'awaiting_gm', contentHash: 'hash-1' };
  });
  useSpellConsequenceStore.setState({ owner: { spellId: 'ember-bolt', origin: {} } });
  render(<SpellConsequenceHost />);

  await act(async () => {
    await sendSpellApproval({ spellId: 'ember-bolt', targetRef, roll, origin: {} });
  });
  const originalApproval = JSON.parse(JSON.stringify(loadLatestSpell().approval));
  expect(loadLatestSpell().phase).toBe('unknown');
  expect(screen.getByRole('button', { name: 'Check this same approval' })).toBeTruthy();

  // Reconnect returns empty pending and NO closedApproval -> must NOT infer closure!
  requestActorEvent.mockImplementation(async event => {
    if (event === 'actor_spell_list') return { success: true, pending: [], targetProposals: [] };
    if (event === 'actor_authored_list') return { success: true, entries: [], revision: 0 };
    if (event === 'actor_trigger_list') return { success: true, obligations: [], listeners: [], revision: 0 };
    if (event === 'actor_passive_list') return { success: true, activations: [], revision: 0 };
    if (event === 'actor_placed_effect_list') return { success: true, placements: [], revision: 0 };
    return { success: false, code: 'awaiting_gm', contentHash: 'hash-1' };
  });

  await act(async () => {
    notifyRoomRejoined({ socket, roomId: 'room-1' });
    await Promise.resolve();
    await Promise.resolve();
  });

  expect(loadLatestSpell().phase).toBe('unknown');
  expect(screen.getByRole('button', { name: 'Check this same approval' })).toBeTruthy();

  // Explicit Check this same approval replays the exact original approval bytes
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Check this same approval' }));
    await Promise.resolve();
  });
  expect(requestActorEvent).toHaveBeenLastCalledWith('actor_spell_approve', originalApproval);
  expect(loadLatestSpell().phase).toBe('awaiting');

  cleanup();
});

test('subscription teardown removes all socket and rejoin listeners and ignores stale callbacks', async () => {
  const socket = makeSocket();
  useGameStore.setState({ multiplayerSocket: socket });
  const before = roomRejoinSubscriberCount();
  const cleanup = registerSpellConsequenceHandlers({ socket });
  expect(roomRejoinSubscriberCount()).toBe(before + 1);

  const closedListener = socket.handlers.actor_spell_closed;
  cleanup();

  expect(roomRejoinSubscriberCount()).toBe(before);
  expect(socket.off).toHaveBeenCalledTimes(6);

  useSpellConsequenceStore.setState({ gmPending: { a1: { approval: { approvalId: 'a1' } } } });
  closedListener({ roomId: 'room-1', approvalId: 'a1', code: 'actor_removed' });
  expect(useSpellConsequenceStore.getState().gmPending.a1).toBeDefined();

  notifyRoomRejoined({ socket, roomId: 'room-1' });
  await Promise.resolve();
  expect(requestActorEvent).not.toHaveBeenCalled();
});
