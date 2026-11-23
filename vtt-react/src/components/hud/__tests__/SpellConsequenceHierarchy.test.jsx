import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SpellConsequenceHost from '../SpellConsequencePanel';
import useGameStore from '../../../store/gameStore';
import useCharacterStore from '../../../store/characterStore';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useCreatureStore from '../../../store/creatureStore';
import { useSpellConsequenceStore } from '../../../services/spellConsequenceService';
import { useTriggerOfferStore } from '../../../services/triggerOfferService';
import { usePassiveActivationStore } from '../../../services/passiveActivationService';

jest.mock('../../../services/spellConsequence', () => ({
  ...jest.requireActual('../../../services/spellConsequence'),
  supportSpell: jest.fn(() => ({
    supported: true,
    kind: 'damage',
    name: 'Arcane Bolt',
    definitionId: 'spell-1',
    definitionHash: 'h1',
    damageTypes: ['arcane'],
    reading: { reading: '1d8 + 4', dice: [{ count: 1, sides: 8 }], constant: 4 },
    price: { ap: 1, mana: 4 },
    cooldown: { value: 0, type: 'none' },
    payment: { affordable: true, domain: 'none', classPayment: null },
    raw: { targetingConfig: { rangeDistance: 30, rangeType: 'ranged' } }
  }))
}));

jest.mock('../../../services/spellConsequenceService', () => {
  const { create } = require('zustand');
  const store = create(() => ({
    owner: null,
    ownerStatus: null,
    gmPending: {},
    gmStatus: {},
    targetProposals: [],
    authoredEntries: [],
    authoredRoomId: 'room-1',
    draftVersion: 0,
    registryRevision: 0,
    relationshipRevision: 0,
    relationshipRevisions: {}
  }));
  return {
    useSpellConsequenceStore: store,
    ownerSource: jest.fn(() => ({ ref: null, token: null, error: 'none' })),
    restoreOwnerStatus: jest.fn(),
    refreshAuthoredAbilities: jest.fn().mockResolvedValue({ success: true }),
    refreshSpellApprovals: jest.fn().mockResolvedValue({ success: true }),
    retainedTargetResponses: jest.fn(() => []),
    loadSpellDraft: jest.fn(() => null),
    loadDiscardedSpellDrafts: jest.fn(() => []),
    spellDraftContext: jest.fn(() => ({ characterId: 'pc-1', spellId: 'spell-1' })),
    saveSpellDraft: jest.fn(),
    discardSpellDraft: jest.fn(),
    closeOwnerPanel: jest.fn(),
    sendSpellApproval: jest.fn(),
    checkSpellApproval: jest.fn(),
    withdrawSpellApproval: jest.fn(),
    reapproveSpell: jest.fn(),
    gmAcceptSpell: jest.fn(),
    gmDeclineSpell: jest.fn(),
    gmCheckSpellCommand: jest.fn(),
    markSpellReconciled: jest.fn(),
    gmConditionResolution: jest.fn(() => null),
    saveGmConditionResolution: jest.fn(),
    changeAuthoredAdmission: jest.fn(),
    routeSpellCast: jest.fn(() => true),
    creatureAttempt: jest.fn(() => null),
    saveCreatureRoll: jest.fn(),
    prepareCreatureAbility: jest.fn(),
    cancelCreatureAbility: jest.fn(),
    revalidateCreatureContext: jest.fn(),
    saveCreatureResolution: jest.fn(),
    designateVoluntaryCondition: jest.fn(),
    respondToVoluntaryCondition: jest.fn(),
    readTargetRelationship: jest.fn()
  };
});

jest.mock('../../../services/triggerOfferService', () => {
  const { create } = require('zustand');
  return {
    useTriggerOfferStore: create(() => ({
      projection: { roomId: 'room-1', viewerRole: 'gm', revision: 1, obligations: [], listeners: [] },
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
    primaryPcSources: jest.fn(() => [
      { ref: { kind: 'character', roomId: 'room-1', mapId: 'm', tokenId: 'pc-1', instanceId: 'i-1' }, label: 'Ilse' }
    ]),
    FOLLOWUP_PREDICATE: { occurrence: 'immediate-damage', role: 'source', evidence: 'baseHpLost' },
    HEALING_FOLLOWUP_PREDICATE: { occurrence: 'immediate-healing', role: 'source', evidence: 'hpRestored' }
  };
});

jest.mock('../../../services/passiveActivationService', () => {
  const { create } = require('zustand');
  return {
    usePassiveActivationStore: create(() => ({
      projection: { success: true, roomId: 'room-1', viewerRole: 'gm', revision: 1, activations: [] },
      loading: false,
      error: null,
      message: ''
    })),
    refreshPassiveLedger: jest.fn(),
    registerPassiveHandlers: jest.fn(() => () => {}),
    activatePassive: jest.fn(),
    revokePassive: jest.fn(),
    primaryPcTargets: jest.fn(() => [
      {
        ref: { kind: 'character', roomId: 'room-1', mapId: 'm', tokenId: 'pc-1', instanceId: 'i-1' },
        label: 'Ilse',
        eligibility: { ok: true, rank: 'NOVICE', skillId: 'perception', minRank: 'NOVICE' }
      }
    ])
  };
});

const pcRef = { kind: 'character', roomId: 'room-1', mapId: 'm', tokenId: 'pc-1', instanceId: 'i-1' };
const foeRef = { kind: 'creature', roomId: 'room-1', mapId: 'm', tokenId: 'foe-1', instanceId: 'i-2' };

beforeEach(() => {
  jest.clearAllMocks();
  const scs = jest.requireMock('../../../services/spellConsequenceService');
  scs.ownerSource.mockReturnValue({ ref: null, token: null, error: 'none' });
  scs.retainedTargetResponses.mockReturnValue([]);
  scs.refreshAuthoredAbilities.mockResolvedValue({ success: true });
  scs.refreshSpellApprovals.mockResolvedValue({ success: true });
  scs.loadSpellDraft.mockReturnValue(null);
  scs.loadDiscardedSpellDrafts.mockReturnValue([]);
  scs.spellDraftContext.mockReturnValue({ characterId: 'pc-1', spellId: 'spell-1' });
  scs.routeSpellCast.mockReturnValue(true);
  scs.creatureAttempt.mockReturnValue(null);
  scs.gmConditionResolution.mockReturnValue(null);
  const tos = jest.requireMock('../../../services/triggerOfferService');
  tos.registerTriggerOfferHandlers.mockReturnValue(() => {});
  tos.primaryPcSources.mockReturnValue([
    { ref: { kind: 'character', roomId: 'room-1', mapId: 'm', tokenId: 'pc-1', instanceId: 'i-1' }, label: 'Ilse' }
  ]);
  const pas = jest.requireMock('../../../services/passiveActivationService');
  pas.registerPassiveHandlers.mockReturnValue(() => {});
  pas.primaryPcTargets.mockReturnValue([
    {
      ref: { kind: 'character', roomId: 'room-1', mapId: 'm', tokenId: 'pc-1', instanceId: 'i-1' },
      label: 'Ilse',
      eligibility: { ok: true, rank: 'NOVICE', skillId: 'perception', minRank: 'NOVICE' }
    }
  ]);
  jest.requireMock('../../../services/spellConsequence').supportSpell.mockReturnValue({
    supported: true,
    kind: 'damage',
    name: 'Arcane Bolt',
    definitionId: 'spell-1',
    definitionHash: 'h1',
    damageTypes: ['arcane'],
    reading: { reading: '1d8 + 4', dice: [{ count: 1, sides: 8 }], constant: 4 },
    price: { ap: 1, mana: 4 },
    cooldown: { value: 0, type: 'none' },
    payment: { affordable: true, domain: 'none', classPayment: null },
    raw: { targetingConfig: { rangeDistance: 30, rangeType: 'ranged' } }
  });
  useGameStore.setState({
    isInMultiplayer: true,
    isGMMode: true,
    multiplayerRoom: { id: 'room-1' },
    multiplayerSocket: { on: jest.fn(), off: jest.fn() },
    gridSize: 50,
    feetPerTile: 5
  });
  useCharacterStore.setState({ currentCharacterId: 'pc-1' });
  useCharacterTokenStore.setState({
    characterTokens: [{ id: 'pc-1', mapId: 'm', name: 'Ilse', character: { id: 'pc-1', name: 'Ilse', health: { current: 30, max: 30 } }, state: { conditions: [], actorContract: pcRef } }]
  });
  useCreatureStore.setState({
    creatureTokens: [{ id: 'foe-1', mapId: 'm', name: 'Alpha', state: { currentHp: 20, maxHp: 20, conditions: [], actorContract: foeRef } }]
  });
  useSpellConsequenceStore.setState({
    owner: null,
    ownerStatus: null,
    gmPending: {},
    gmStatus: {},
    targetProposals: [],
    authoredEntries: [],
    authoredRoomId: 'room-1'
  });
  useTriggerOfferStore.setState({
    projection: { roomId: 'room-1', viewerRole: 'gm', revision: 1, obligations: [], listeners: [] },
    declined: [],
    setupRequest: null
  });
  usePassiveActivationStore.setState({
    projection: { success: true, roomId: 'room-1', viewerRole: 'gm', revision: 1, activations: [] },
    error: null,
    message: ''
  });
});

test('empty encounter collapses passive and setup panels by default for GM and owner', () => {
  const { container } = render(<SpellConsequenceHost />);
  const gmPassive = container.querySelector('[data-passive-activation-panel]');
  expect(gmPassive).toBeTruthy();
  expect(gmPassive.hasAttribute('open')).toBe(false);

  act(() => {
    useGameStore.setState({ isGMMode: false });
    useTriggerOfferStore.setState({ projection: { roomId: 'room-1', viewerRole: 'member', revision: 1, obligations: [], listeners: [] } });
  });
  const memberPassive = container.querySelector('[data-passive-member-panel]');
  expect(memberPassive).toBeTruthy();
  expect(memberPassive.hasAttribute('open')).toBe(false);
  expect(container.querySelector('[data-passive-activation-panel]')).toBeNull();
  expect(screen.queryByText('Follow-up trigger registration')).toBeNull();
});

test('pending GM approval renders before passive/setup panels and hides technical details behind disclosure', () => {
  useSpellConsequenceStore.setState({
    gmPending: {
      'app-1': {
        approval: {
          approvalId: 'app-1',
          roomId: 'room-1',
          source: pcRef,
          target: foeRef,
          spell: { name: 'Arcane Bolt', kind: 'damage', damageTypes: ['arcane'], definitionId: 'spell-1' },
          roll: { mode: 'physical', dice: [{ faces: [6] }], constant: 4, total: 10, reading: '1d8 + 4' },
          price: { ap: 1, mana: 4 },
          classPayment: null
        },
        targetProposal: null
      }
    }
  });

  const { container } = render(<SpellConsequenceHost />);
  const gmRegion = screen.getByRole('region', { name: 'Spell adjudication' });
  const passiveRegion = screen.getByRole('region', { name: 'Passive ability activation' });
  expect(gmRegion.compareDocumentPosition(passiveRegion) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(screen.getByText('Needs GM action')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Accept one consequence' })).toBeInTheDocument();

  const techDisclosure = container.querySelector('.p9-gm-card details.p9-tech-disclosure');
  expect(techDisclosure).toBeTruthy();
  expect(techDisclosure.hasAttribute('open')).toBe(false);
});

test('owner outcome_unknown and unresolved states stay visible at top of OwnerPanel', () => {
  useGameStore.setState({ isGMMode: false });
  useSpellConsequenceStore.setState({
    owner: { spellId: 'spell-1', origin: { producer: 'action-bar' } },
    ownerStatus: {
      phase: 'unknown',
      message: 'Connection dropped before server reply.',
      latest: { approval: { approvalId: 'app-1', spell: { name: 'Arcane Bolt', definitionId: 'spell-1' }, price: { ap: 1, mana: 4 }, classPayment: null }, custody: 'retained' }
    }
  });

  render(<SpellConsequenceHost />);
  const dialog = screen.getByRole('dialog', { name: 'Supported spell cast' });
  expect(dialog).toHaveTextContent('Outcome unknown — check approval');
  expect(screen.getByRole('button', { name: 'Check this same approval' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Withdraw before acceptance' })).toBeInTheDocument();

  act(() => {
    useSpellConsequenceStore.setState({
      ownerStatus: { phase: 'unresolved', message: 'Reconcile with GM.', latest: null }
    });
  });
  expect(dialog).toHaveTextContent('Unresolved — reconcile with GM');
  expect(screen.getByRole('button', { name: 'Reconciled with the GM — clear this approval' })).toBeInTheDocument();
});

test('executable follow-up offer for owner is open with action badge and collapsed rules disclosure', () => {
  useGameStore.setState({ isGMMode: false });
  useTriggerOfferStore.setState({
    projection: {
      roomId: 'room-1',
      viewerRole: 'member',
      revision: 2,
      listeners: [{ listenerId: 'l-1', source: pcRef }],
      obligations: [{ obligationId: 'ob-1', listenerId: 'l-1', mode: 'follow-up', available: true, expiresAtSequence: 5, definitionRef: { definitionId: 'spell-1', definitionVersion: 1 } }]
    }
  });

  const { container } = render(<SpellConsequenceHost />);
  expect(screen.getByText('Needs your action')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Use this offer' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Decline' })).toBeInTheDocument();
  const rulesDisclosure = container.querySelector('.first-playable-trigger-box details.p9-tech-disclosure');
  expect(rulesDisclosure).toBeTruthy();
  expect(rulesDisclosure.hasAttribute('open')).toBe(false);
});

test('role and room changes immediately hide GM private controls', () => {
  useSpellConsequenceStore.setState({
    gmPending: {
      'app-1': {
        approval: {
          approvalId: 'app-1',
          roomId: 'room-1',
          source: pcRef,
          target: foeRef,
          spell: { name: 'Arcane Bolt', kind: 'damage', damageTypes: ['arcane'], definitionId: 'spell-1' },
          roll: { mode: 'physical', dice: [{ faces: [6] }], constant: 4, total: 10, reading: '1d8 + 4' },
          price: { ap: 1, mana: 4 },
          classPayment: null
        },
        targetProposal: null
      }
    }
  });
  const { rerender } = render(<SpellConsequenceHost />);
  expect(screen.getByRole('region', { name: 'Spell adjudication' })).toBeInTheDocument();

  // Room change hides room-1 pending card
  act(() => {
    useGameStore.setState({ multiplayerRoom: { id: 'room-2' } });
  });
  rerender(<SpellConsequenceHost />);
  expect(screen.queryByRole('region', { name: 'Spell adjudication' })).toBeNull();

  // Role change to non-GM hides all GM controls
  act(() => {
    useGameStore.setState({ multiplayerRoom: { id: 'room-1' }, isGMMode: false });
    useTriggerOfferStore.setState({ projection: { roomId: 'room-1', viewerRole: 'member', revision: 1, obligations: [], listeners: [] } });
  });
  rerender(<SpellConsequenceHost />);
  expect(screen.queryByRole('region', { name: 'Spell adjudication' })).toBeNull();
  expect(screen.queryByText('Follow-up trigger registration')).toBeNull();
});
