import React from 'react';
import { render, screen, fireEvent, act, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellConsequenceHost from '../SpellConsequencePanel';
import useGameStore from '../../../store/gameStore';
import useCharacterStore from '../../../store/characterStore';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useCreatureStore from '../../../store/creatureStore';
import useAuthStore from '../../../store/authStore';
import useChatStore from '../../../store/chatStore';
import useConditionStore from '../../../store/conditionStore';
import { registerStore } from '../../../store/storeRegistry';
import * as spellConsequence from '../../../services/spellConsequence';
import * as authoredChanneled from '../../../services/authoredChanneled';
import { definitionFromWizard, CHANNELED_CAPABILITY } from '../../../services/authoredAbility';
import { replaceAuthoredRegistry } from '../../../services/authoredAbilityRegistry';
import { registerRendered, actorKey, resetCombatFeed } from '../../../services/acceptedResultFeed';
import { notifyRoomRejoined } from '../../../services/roomRejoinBus';
import {
  useSpellConsequenceStore,
  consumeSpellReceipt,
  registerSpellConsequenceHandlers,
  routeSpellCast,
  closeOwnerPanel,
  restoreOwnerStatus
} from '../../../services/spellConsequenceService';
import { activatePrivateScope } from '../../../persistence/bootstrapPrivacyGate';
import { createUserScope } from '../../../persistence/scopeModel';
import { loadLatestSpell, retainLatestSpell, spellContext } from '../../../services/spellConsequenceCustody';

if (typeof global.crypto === 'undefined' || !global.crypto.randomUUID) {
  Object.defineProperty(global, 'crypto', { value: require('crypto').webcrypto, configurable: true });
}

const pcRef = {
  kind: 'character',
  roomId: 'room-1',
  mapId: 'm',
  tokenId: 'pc-1',
  instanceId: 'i-pc',
  ownerUid: 'owner-1',
  characterId: 'pc-1'
};

const foeRef = {
  kind: 'creature',
  roomId: 'room-1',
  mapId: 'm',
  tokenId: 'foe-1',
  instanceId: 'i-foe'
};

jest.mock('../../../services/actorConsequenceService', () => {
  const actual = jest.requireActual('../../../services/actorConsequenceService');
  return {
    ...actual,
    refreshActorSnapshot: jest.fn(),
    requestActorEvent: jest.fn(),
    roomResourceProjection: jest.fn()
  };
});

jest.mock('../../../store/authStore', () => {
  const state = { user: { uid: 'owner-1' } };
  const useAuthStore = sel => (typeof sel === 'function' ? sel(state) : state);
  useAuthStore.getState = () => state;
  return { __esModule: true, default: useAuthStore };
});

jest.mock('../../../services/triggerOfferService', () => {
  const { create } = require('zustand');
  return {
    useTriggerOfferStore: create(() => ({
      projection: { roomId: 'room-1', viewerRole: 'player', revision: 1, obligations: [], listeners: [] },
      loading: false,
      error: null,
      message: '',
      declined: [],
      setupRequest: null
    })),
    refreshTriggerLedger: jest.fn(),
    registerTriggerOfferHandlers: jest.fn(() => () => {}),
    registerFollowUp: jest.fn(),
    registerComponentWatch: jest.fn(),
    revokeTriggerListener: jest.fn(),
    dismissTriggerOffer: jest.fn(),
    declineTriggerOffer: jest.fn(),
    clearTriggerRegistrationSetup: jest.fn(),
    primaryPcSources: jest.fn(() => []),
    FOLLOWUP_PREDICATE: { occurrence: 'immediate-damage', role: 'source', evidence: 'baseHpLost' },
    HEALING_FOLLOWUP_PREDICATE: { occurrence: 'immediate-healing', role: 'source', evidence: 'hpRestored' }
  };
});

jest.mock('../../../services/passiveActivationService', () => {
  const { create } = require('zustand');
  return {
    usePassiveActivationStore: create(() => ({
      projection: { success: true, roomId: 'room-1', viewerRole: 'player', revision: 1, activations: [] },
      loading: false,
      error: null,
      message: ''
    })),
    refreshPassiveLedger: jest.fn(),
    registerPassiveHandlers: jest.fn(() => () => {}),
    activatePassive: jest.fn(),
    revokePassive: jest.fn(),
    primaryPcTargets: jest.fn(() => [])
  };
});

function makeChanneledEntry() {
  const draft = {
    name: 'Arcane Beam',
    description: 'Sustained arcane damage beam',
    level: '',
    spellType: 'CHANNELED',
    typeConfig: {
      school: 'arcane',
      maxChannelDuration: 4,
      durationUnit: 'TURNS',
      tickFrequency: 'START_OF_TURN',
      concentrationDC: 12,
      dcType: 'CONSTITUTION',
      breakEffect: 'none',
      interruptible: true,
      movementAllowed: false
    },
    effectTypes: ['damage'],
    damageConfig: {
      formula: '1d6',
      damageType: 'direct',
      elementType: 'arcane',
      resolution: 'DICE',
      canCrit: false
    },
    targetingConfig: {
      rangeType: 'ranged',
      rangeDistance: 30,
      targetingType: 'single',
      maxTargets: 1,
      targetRestrictions: ['enemy']
    },
    resourceCost: {
      actionPoints: 2,
      actionPointsSelected: true,
      resourceTypes: ['actionPoints', 'mana'],
      resourceValues: { actionPoints: 2, mana: 10 },
      resourceFormulas: {},
      useFormulas: {},
      primaryResourceType: 'actionPoints'
    }
  };
  const record = {
    ...JSON.parse(JSON.stringify(draft)),
    authoredDefinitionId: '81bc4196-4595-4cd6-980d-5dde91c530a8',
    authoredDraft: draft
  };
  const compiled = definitionFromWizard(record, { roomId: 'room-1', definitionVersion: 1, classId: 'arcanoneer' });
  expect(compiled.ok).toBe(true);
  const hashHex = spellConsequence.sha256Hex('mythrill:authored-channeled:v1\n' + JSON.stringify(compiled.definition));
  const definitionRef = {
    roomId: 'room-1',
    definitionId: compiled.definition.definitionId,
    definitionVersion: 1,
    definitionHash: hashHex
  };
  return {
    definitionRef,
    canonicalDefinition: compiled.definition,
    compilerVersion: 'p14-channeled-1',
    descriptor: {
      schemaVersion: 9,
      capabilityId: CHANNELED_CAPABILITY,
      compilerVersion: 'p14-channeled-1',
      definitionRef,
      binding: compiled.definition.binding,
      price: { ap: 2, mana: 10 },
      targeting: compiled.definition.targeting,
      tickEffect: compiled.definition.tickEffect,
      channel: compiled.definition.channel,
      timing: compiled.definition.timing,
      executionEnabled: true
    },
    revoked: false,
    creatureOnly: false
  };
}

function makeChanneledReceipt({ commandId, approval, targetHp = 40, pcAp = 4, pcMana = 20, status = 'checkpoint-confirmed' }) {
  const resolution = {
    gmConfirmed: true,
    timing: approval.channelTerms.timing,
    timingNote: 'Confirmed 4-turn channel'
  };
  return {
    success: true,
    status,
    receipt: {
      version: 1,
      roomId: 'room-1',
      submitterUid: 'gm-1',
      commandId,
      commitSequence: 10,
      acceptedAt: Date.now(),
      checkpointRevision: 2,
      source: approval.source,
      target: approval.target,
      authorization: { kind: 'owner-approval-gm', proposalId: approval.approvalId },
      actors: [
        { ref: approval.source, finalResources: { ap: { current: pcAp, temp: 0 }, mana: { current: pcMana, temp: 0 }, hp: { current: 30, temp: 0 } } },
        { ref: approval.target, finalResources: { hp: { current: targetHp, temp: 0 } }, conditions: [authoredChanneled.recordFor(approval)] }
      ],
      adjudication: {
        definitionId: approval.spell.definitionId,
        definitionVersionOrHash: approval.spell.definitionHash,
        finalAmount: 0,
        adjustmentReason: '',
        chosenResult: JSON.stringify(authoredChanneled.resultFor(approval, resolution, { outcome: 'added', replacesInstanceId: null }))
      }
    }
  };
}

function makeSocket() {
  const handlers = {};
  return {
    connected: true,
    handlers,
    emit: jest.fn(),
    on: jest.fn((event, fn) => { handlers[event] = fn; }),
    off: jest.fn((event, fn) => { if (handlers[event] === fn) delete handlers[event]; })
  };
}

let unregisterRendered = null;

beforeEach(() => {
  localStorage.clear();
  resetCombatFeed();
  activatePrivateScope(createUserScope('owner-1'));
  jest.restoreAllMocks();
  const acs = jest.requireMock('../../../services/actorConsequenceService');
  acs.refreshActorSnapshot.mockResolvedValue({
    success: true,
    roomId: 'room-1',
    actionEpoch: 'epoch-1',
    commitSequence: 5
  });
  acs.roomResourceProjection.mockImplementation(() => ({
    health: { current: 30, max: 30 },
    mana: { current: 30, max: 30 },
    actionPoints: { current: 6, max: 6 },
    tempHealth: 0,
    tempMana: 0,
    tempActionPoints: 0,
    roomActorProjection: { ref: pcRef, revision: 1, accountGeneration: 0 }
  }));
  const tos = jest.requireMock('../../../services/triggerOfferService');
  tos.registerTriggerOfferHandlers.mockImplementation(() => () => {});
  tos.primaryPcSources.mockImplementation(() => []);
  const pas = jest.requireMock('../../../services/passiveActivationService');
  pas.registerPassiveHandlers.mockImplementation(() => () => {});
  pas.primaryPcTargets.mockImplementation(() => []);

  registerStore('gameStore', useGameStore);
  registerStore('characterStore', useCharacterStore);
  registerStore('characterTokenStore', useCharacterTokenStore);
  registerStore('creatureStore', useCreatureStore);
  registerStore('authStore', useAuthStore);
  registerStore('chatStore', useChatStore);
  registerStore('conditionStore', useConditionStore);

  useChatStore.setState({ notifications: { social: [], combat: [], loot: [] } });
  useGameStore.setState({
    isInMultiplayer: true,
    isGMMode: false,
    multiplayerRoom: { id: 'room-1' },
    multiplayerSocket: null,
    gridSize: 50,
    feetPerTile: 5
  });
  useCharacterStore.setState({ currentCharacterId: 'pc-1', class: 'Arcanoneer' });
  useCharacterTokenStore.setState({
    characterTokens: [{
      id: 'pc-1',
      mapId: 'm',
      name: 'Lyra',
      ownerUserId: 'owner-1',
      character: {
        id: 'pc-1',
        name: 'Lyra',
        class: 'Arcanoneer',
        health: { current: 30, max: 30 },
        mana: { current: 30, max: 30 },
        actionPoints: { current: 6, max: 6 },
        tempHealth: 0,
        tempMana: 0,
        tempActionPoints: 0
      },
      state: { conditions: [], actorContract: { version: 1, ...pcRef, revision: 1, primary: true } }
    }]
  });
  useCreatureStore.setState({
    creatureTokens: [{
      id: 'foe-1',
      mapId: 'm',
      name: 'Target Raider',
      state: { currentHp: 40, maxHp: 40, tempHealth: 0, conditions: [], actorContract: { version: 1, ...foeRef, revision: 1 } }
    }]
  });
  useSpellConsequenceStore.setState({
    owner: null,
    ownerStatus: null,
    gmPending: {},
    gmStatus: {},
    targetProposals: [],
    authoredEntries: [],
    authoredRoomId: 'room-1',
    draftVersion: 0,
    registryRevision: 1
  });
  unregisterRendered = registerRendered(actorKey(foeRef));
});

afterEach(() => {
  if (unregisterRendered) { unregisterRendered(); unregisterRendered = null; }
  try {
    if (loadLatestSpell()) retainLatestSpell(spellContext(), { phase: 'reconciled', draft: null, supersedes: true });
  } catch (_) { /* noop */ }
  cleanup();
});

describe('authored-channeled:v1 caster receipt reconciliation and recast', () => {
  test('spellReceipt accepts valid authored-channeled:v1 receipts and rejects mismatched authorization or proposalId', () => {
    const entry = makeChanneledEntry();
    const defId = `authored:${entry.definitionRef.definitionId}:1:${entry.definitionRef.definitionHash}`;
    const approval = {
      approvalId: '11111111-1111-4111-8111-111111111111',
      source: pcRef,
      target: foeRef,
      spell: {
        definitionId: defId,
        definitionHash: `${CHANNELED_CAPABILITY}/${entry.definitionRef.definitionHash}`,
        name: 'Arcane Beam',
        kind: 'channeled',
        damageTypes: ['arcane']
      },
      channelTerms: authoredChanneled.termsFor(entry.canonicalDefinition)
    };
    const valid = makeChanneledReceipt({ commandId: 'cmd-1', approval });
    const parsed = spellConsequence.spellReceipt(valid);
    expect(parsed).toMatchObject({
      approvalId: approval.approvalId,
      recorded: { capability: CHANNELED_CAPABILITY, kind: 'channeled', spellName: 'Arcane Beam' }
    });

    const wrongProposal = JSON.parse(JSON.stringify(valid));
    wrongProposal.receipt.authorization.proposalId = '22222222-2222-4222-8222-222222222222';
    expect(spellConsequence.spellReceipt(wrongProposal)).toBeNull();

    const wrongAuth = JSON.parse(JSON.stringify(valid));
    wrongAuth.receipt.authorization.kind = 'gm';
    expect(spellConsequence.spellReceipt(wrongAuth)).toBeNull();
  });

  test('first cast transitions to Accepted immediately, reconnect preserves status without duplicate chat, and same player can recast without refresh', async () => {
    const entry = makeChanneledEntry();
    replaceAuthoredRegistry('room-1', [entry]);
    useSpellConsequenceStore.setState({ authoredEntries: [entry], authoredRoomId: 'room-1' });
    const defId = `authored:${entry.definitionRef.definitionId}:1:${entry.definitionRef.definitionHash}`;

    const socket = makeSocket();
    useGameStore.setState({ multiplayerSocket: socket, isInMultiplayer: true, isGMMode: false, multiplayerRoom: { id: 'room-1' } });
    const stopHandlers = registerSpellConsequenceHandlers({ socket });

    const acs = jest.requireMock('../../../services/actorConsequenceService');
    const approvals = [];
    let latestAcceptedReceipt = null;
    acs.requestActorEvent.mockImplementation(async (event, payload) => {
      if (event === 'actor_relationship_list') return { success: true, value: 'enemy', revision: 1 };
      if (event === 'actor_spell_approve') {
        approvals.push(payload);
        return { success: false, code: 'awaiting_gm', contentHash: `hash-${approvals.length}` };
      }
      if (event === 'actor_spell_list') {
        return latestAcceptedReceipt
          ? { success: true, pending: [], targetProposals: [], consumedReceipt: latestAcceptedReceipt }
          : { success: true, pending: [], targetProposals: [] };
      }
      if (event === 'actor_authored_list') {
        return { success: true, entries: [entry], revision: 1 };
      }
      return { success: true };
    });

    expect(routeSpellCast({ id: defId }, { producer: 'admitted-library' })).toBe(true);
    render(<SpellConsequenceHost />);

    await waitFor(() => expect(screen.getByLabelText(/^Target/)).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/^Target/), { target: { value: JSON.stringify(foeRef) } });
    await waitFor(() => expect(screen.getByText(/Target is an enemy of the caster\./i)).toBeInTheDocument());

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Approve price and send to GM' }));
    });
    expect(approvals).toHaveLength(1);
    expect(loadLatestSpell().phase).toBe('awaiting');
    expect(screen.getByRole('button', { name: 'Check this same approval' })).toBeInTheDocument();

    // Non-matching approval receipt must not transition owner custody
    const wrongApproval = { ...approvals[0], approvalId: '99999999-9999-4999-8999-999999999999' };
    act(() => {
      consumeSpellReceipt(makeChanneledReceipt({ commandId: 'cmd-other', approval: wrongApproval }), { historical: true });
    });
    expect(loadLatestSpell().phase).toBe('awaiting');
    expect(useSpellConsequenceStore.getState().ownerStatus.phase).toBe('awaiting');

    // Valid GM start receipt lands over socket
    latestAcceptedReceipt = makeChanneledReceipt({ commandId: 'cmd-channeled-1', approval: approvals[0] });
    act(() => {
      socket.handlers.actor_consequence_accepted(latestAcceptedReceipt);
    });

    expect(loadLatestSpell().phase).toBe('accepted');
    expect(useSpellConsequenceStore.getState().ownerStatus.phase).toBe('accepted');
    expect(screen.getByText(/Accepted and paid/i)).toBeInTheDocument();
    expect(screen.getByText(/cmd-channeled-1/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Check this same approval' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Withdraw before acceptance' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Approve price and send to GM' })).toBeNull();
    expect(useChatStore.getState().notifications.combat).toHaveLength(1);
    expect(useChatStore.getState().notifications.combat[0].content).toMatch(/Arcane Beam channel started.*cmd-channeled-1/);

    // Reconnect mid-channel preserves Accepted status and does NOT repeat the combat chat notification
    act(() => { closeOwnerPanel(); });
    expect(document.querySelector('.p9-chip')).toBeNull();

    await act(async () => {
      notifyRoomRejoined({ socket, roomId: 'room-1' });
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(useSpellConsequenceStore.getState().ownerStatus.phase).toBe('accepted');
    expect(useChatStore.getState().notifications.combat).toHaveLength(1);
    expect(document.querySelector('.p9-chip')).toBeNull();

    // Simulated reload with restoreOwnerStatus preserves accepted status & keeps chip absent
    act(() => {
      useSpellConsequenceStore.setState({ ownerStatus: null, owner: null });
      restoreOwnerStatus();
    });
    expect(useSpellConsequenceStore.getState().ownerStatus.phase).toBe('accepted');
    expect(document.querySelector('.p9-chip')).toBeNull();
    expect(useChatStore.getState().notifications.combat).toHaveLength(1);

    // Same player casts Arcane Beam again after completion WITHOUT refreshing the page
    act(() => {
      expect(routeSpellCast({ id: defId }, { producer: 'admitted-library' })).toBe(true);
    });

    await waitFor(() => expect(screen.getByRole('button', { name: 'Approve price and send to GM' })).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/^Target/), { target: { value: JSON.stringify(foeRef) } });
    await waitFor(() => expect(screen.getByText(/Target is an enemy of the caster\./i)).toBeInTheDocument());

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Approve price and send to GM' }));
    });
    expect(approvals).toHaveLength(2);
    expect(approvals[1].approvalId).not.toBe(approvals[0].approvalId);

    const cast2Receipt = makeChanneledReceipt({ commandId: 'cmd-channeled-2', approval: approvals[1], pcAp: 2, pcMana: 10 });
    latestAcceptedReceipt = cast2Receipt;
    act(() => {
      socket.handlers.actor_consequence_accepted(cast2Receipt);
    });

    expect(useSpellConsequenceStore.getState().ownerStatus.phase).toBe('accepted');
    expect(screen.getByText(/Accepted and paid/i)).toBeInTheDocument();
    expect(screen.getByText(/cmd-channeled-2/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Approve price and send to GM' })).toBeNull();
    expect(useChatStore.getState().notifications.combat).toHaveLength(2);

    stopHandlers();
  });
});
