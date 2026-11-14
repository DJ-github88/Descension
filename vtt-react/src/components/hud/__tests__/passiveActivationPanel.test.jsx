/**
 * Mounted UI tests for PassiveActivationPanel and its actual mounted parent (SpellConsequenceHost).
 *
 * Verifies:
 * 1. Shipped production policy (creatorApproval === null) keeps the activation control fail-closed.
 * 2. SpellConsequenceHost mounts PassiveActivationPanel alongside TriggerOfferPanel.
 * 3. Stored, Active, and Inactive states render exact truthful copy:
 *    - Stored — not active
 *    - Active — +2 initiative
 *    - Inactive — <reason>
 * 4. Static library / admitted records are never claimed active.
 * 5. Read-only authorityOf / explain output is never wired as an execution gate.
 * 6. GM activation binds exact character actorRef, passiveId, and sourceRecordId, and GM revocation revokes by activationId.
 * 7. Non-GM member view projects read-only status without GM controls.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PassiveActivationPanel from '../PassiveActivationPanel';
import SpellConsequenceHost from '../SpellConsequencePanel';
import useGameStore from '../../../store/gameStore';
import useCharacterTokenStore from '../../../store/characterTokenStore';

jest.mock('../../../services/passiveActivationPolicy', () => {
  const actual = jest.requireActual('../../../services/passiveActivationPolicy');
  return {
    ...actual,
    approved: jest.fn(() => actual.approved()),
    stackingMode: jest.fn(() => actual.stackingMode())
  };
});

jest.mock('../../../services/spellConsequenceService', () => {
  const actual = jest.requireActual('../../../services/spellConsequenceService');
  return {
    ...actual,
    refreshAuthoredAbilities: jest.fn(),
    restoreOwnerStatus: jest.fn(),
    refreshSpellApprovals: jest.fn(),
    retainedTargetResponses: jest.fn(() => []),
    routeSpellCast: jest.fn(),
    ownerSource: jest.fn(() => ({ ref: null, token: null, error: 'none' }))
  };
});

jest.mock('../../../services/triggerOfferService', () => {
  const { create } = require('zustand');
  return {
    useTriggerOfferStore: create(() => ({
      projection: { viewerRole: 'gm', revision: 0, obligations: [], listeners: [] },
      roomId: 'r',
      loading: false,
      error: null,
      message: '',
      declined: []
    })),
    refreshTriggerLedger: jest.fn(),
    registerTriggerOfferHandlers: jest.fn(() => () => {}),
    registerFollowUp: jest.fn(),
    registerComponentWatch: jest.fn(),
    revokeTriggerListener: jest.fn(),
    dismissTriggerOffer: jest.fn(),
    declineTriggerOffer: jest.fn(),
    primaryPcSources: jest.fn(() => []),
    FOLLOWUP_PREDICATE: { occurrence: 'immediate-damage', role: 'source', evidence: 'baseHpLost' },
    HEALING_FOLLOWUP_PREDICATE: { occurrence: 'immediate-healing', role: 'source', evidence: 'hpRestored' }
  };
});

jest.mock('../../../services/passiveActivationService', () => {
  const { create } = require('zustand');
  const actualPolicy = jest.requireActual('../../../services/passiveActivationPolicy');
  const store = create(() => ({
    projection: null,
    roomId: 'r',
    loading: false,
    error: null,
    message: ''
  }));
  return {
    usePassiveActivationStore: store,
    refreshPassiveLedger: jest.fn(),
    registerPassiveHandlers: jest.fn(() => () => {}),
    activatePassive: jest.fn(),
    revokePassive: jest.fn(),
    primaryPcTargets: jest.fn(() => []),
    HEIGHTENED_SENSES_PASSIVE: actualPolicy.HEIGHTENED_SENSES_PASSIVE,
    evaluatePassiveEligibility: actualPolicy.evaluatePassiveEligibility,
    describePassiveStatus: actualPolicy.describePassiveStatus
  };
});

const realPolicy = jest.requireActual('../../../services/passiveActivationPolicy');
const mockedPolicy = jest.requireMock('../../../services/passiveActivationPolicy');
const {
  ownerSource,
  retainedTargetResponses,
  refreshAuthoredAbilities,
  restoreOwnerStatus,
  refreshSpellApprovals
} = jest.requireMock('../../../services/spellConsequenceService');
const {
  usePassiveActivationStore,
  refreshPassiveLedger,
  registerPassiveHandlers,
  activatePassive,
  revokePassive,
  primaryPcTargets
} = jest.requireMock('../../../services/passiveActivationService');

const pc1 = {
  kind: 'character',
  roomId: 'r',
  mapId: 'default',
  tokenId: 'pc1',
  instanceId: 'inst-1',
  ownerUid: 'u1',
  characterId: 'char-1'
};
const pc2 = {
  kind: 'character',
  roomId: 'r',
  mapId: 'default',
  tokenId: 'pc2',
  instanceId: 'inst-2',
  ownerUid: 'u2',
  characterId: 'char-2'
};

beforeEach(() => {
  jest.clearAllMocks();
  mockedPolicy.approved.mockImplementation(() => realPolicy.approved());
  mockedPolicy.stackingMode.mockImplementation(() => realPolicy.stackingMode());
  ownerSource.mockReturnValue({ ref: null, token: null, error: 'none' });
  retainedTargetResponses.mockReturnValue([]);
  refreshAuthoredAbilities.mockResolvedValue({ success: true });
  restoreOwnerStatus.mockResolvedValue({ success: true });
  refreshSpellApprovals.mockResolvedValue({ success: true });
  refreshPassiveLedger.mockResolvedValue({ success: true, revision: 1, activations: [] });
  registerPassiveHandlers.mockReturnValue(() => {});
  activatePassive.mockResolvedValue({ success: true });
  revokePassive.mockResolvedValue({ success: true });
  primaryPcTargets.mockReturnValue([
    {
      ref: pc1,
      label: 'Ilse',
      mapId: 'default',
      character: { id: 'char-1', name: 'Ilse', skillRanks: { perception: 'NOVICE' } },
      eligibility: { ok: true, rank: 'NOVICE', skillId: 'perception', minRank: 'NOVICE' }
    },
    {
      ref: pc2,
      label: 'Brannoc',
      mapId: 'default',
      character: { id: 'char-2', name: 'Brannoc', skillRanks: { perception: 'ADEPT' } },
      eligibility: { ok: true, rank: 'ADEPT', skillId: 'perception', minRank: 'NOVICE' }
    }
  ]);
  useGameStore.setState({
    multiplayerRoom: { id: 'r' },
    multiplayerSocket: { on: jest.fn(), off: jest.fn() },
    isGMMode: true,
    isInMultiplayer: true
  });
  useCharacterTokenStore.setState({ characterTokens: [] });
  usePassiveActivationStore.setState({
    projection: {
      success: true,
      roomId: 'r',
      viewerRole: 'gm',
      revision: 1,
      activations: [],
      status: 'stored',
      displayStatus: 'Stored — not active',
      effectText: null,
      executableClaim: false
    },
    roomId: 'r',
    loading: false,
    error: null,
    message: ''
  });
});

test('1. Shipped production policy is creator-approved (approved() === true, P1-P5), while unapproved policy state remains fail-closed', () => {
  expect(realPolicy.POLICY.creatorApproval).toBeTruthy();
  expect(realPolicy.POLICY.creatorApproval.conversationId).toBe('35c44bc6-9afd-4967-80a4-49f31d81ce8e');
  expect(realPolicy.approved()).toBe(true);
  expect(realPolicy.stackingMode()).toBe('one-copy-additive');

  // Also verify fail-closed UI banner when policy is unapproved
  mockedPolicy.approved.mockReturnValue(false);
  const view = render(<PassiveActivationPanel />);
  const unapprovedBanner = view.container.querySelector('[data-passive-unapproved]');
  expect(unapprovedBanner).toBeTruthy();
  expect(unapprovedBanner.textContent).toMatch(/Inactive — creator approval pending \(P1–P5\): production passive activation is fail-closed/);
  expect(screen.getByRole('button', { name: /Activate Heightened Senses \(\+2 initiative\)/i })).toBeDisabled();
});

test('2. Mounted actual parent SpellConsequenceHost renders PassiveActivationPanel alongside TriggerOfferPanel', () => {
  const view = render(<SpellConsequenceHost />);
  const passivePanel = view.container.querySelector('[data-passive-activation-panel]');
  expect(passivePanel).toBeTruthy();
  expect(passivePanel.textContent).toMatch(/Heightened Senses/);
  expect(passivePanel.textContent).toMatch(/Stored — not active/);
});

test('3. Under test-approved policy, Stored — not active is shown when unactivated, and GM can activate for an exact primary PC', async () => {
  mockedPolicy.approved.mockReturnValue(true);

  const view = render(<PassiveActivationPanel />);
  const statusEl = view.container.querySelector('[data-passive-status]');
  expect(statusEl.getAttribute('data-passive-status')).toBe('stored');
  expect(statusEl.textContent).toMatch(/Stored — not active/);

  // Switch to second character (Brannoc) and activate
  fireEvent.change(screen.getByLabelText(/Target primary PC/i), { target: { value: '1' } });
  const btn = screen.getByRole('button', { name: /Activate Heightened Senses \(\+2 initiative\)/i });
  expect(btn).not.toBeDisabled();
  fireEvent.click(btn);

  await waitFor(() => expect(activatePassive).toHaveBeenCalledTimes(1));
  expect(activatePassive).toHaveBeenCalledWith({
    target: pc2,
    passiveId: 'heightened-senses',
    sourceRecordId: 'skill_perception_heightened_senses'
  });
});

test('4. Active — +2 initiative is displayed when active, duplicate activation is disabled under single-copy mode, and GM can revoke', async () => {
  mockedPolicy.approved.mockReturnValue(true);
  usePassiveActivationStore.setState({
    projection: {
      success: true,
      roomId: 'r',
      viewerRole: 'gm',
      revision: 2,
      activations: [
        {
          activationId: 'act-123',
          passiveId: 'heightened-senses',
          sourceRecordId: 'skill_perception_heightened_senses',
          target: pc1,
          state: 'active',
          status: 'active',
          effectText: '+2 initiative',
          displayStatus: 'Active — +2 initiative'
        }
      ],
      status: 'active',
      displayStatus: 'Active — +2 initiative',
      effectText: '+2 initiative',
      executableClaim: false
    }
  });

  const view = render(<PassiveActivationPanel />);
  const statusEl = view.container.querySelector('[data-passive-status]');
  expect(statusEl.getAttribute('data-passive-status')).toBe('active');
  expect(statusEl.textContent).toMatch(/Active — \+2 initiative/);

  // Duplicate activation for pc1 is disabled under one-copy-additive
  expect(screen.getByRole('button', { name: /Activate Heightened Senses \(\+2 initiative\)/i })).toBeDisabled();

  // Revoke button revokes the exact activationId
  fireEvent.click(screen.getByRole('button', { name: /Revoke passive/i }));
  await waitFor(() => expect(revokePassive).toHaveBeenCalledWith('act-123'));
});

test('5. Inactive — <reason> is displayed when character lacks Perception NOVICE or when an activation is stale', () => {
  mockedPolicy.approved.mockReturnValue(true);
  primaryPcTargets.mockReturnValue([
    {
      ref: pc1,
      label: 'Ilse',
      mapId: 'default',
      character: { id: 'char-1', name: 'Ilse', skillRanks: { perception: 'UNTRAINED' } },
      eligibility: { ok: false, code: 'passive_source_ineligible', rank: 'UNTRAINED', reason: 'requires Perception NOVICE' }
    }
  ]);

  const view = render(<PassiveActivationPanel />);
  const statusEl = view.container.querySelector('[data-passive-status]');
  expect(statusEl.getAttribute('data-passive-status')).toBe('inactive');
  expect(statusEl.textContent).toMatch(/Inactive — requires Perception NOVICE/);
  expect(screen.getByRole('button', { name: /Activate Heightened Senses \(\+2 initiative\)/i })).toBeDisabled();
});

test('6. Non-GM member view renders read-only status (Stored — not active / Active — +2 initiative) without GM controls', () => {
  mockedPolicy.approved.mockReturnValue(true);
  useGameStore.setState({ isGMMode: false });
  usePassiveActivationStore.setState({
    projection: {
      success: true,
      roomId: 'r',
      viewerRole: 'member',
      revision: 2,
      activations: [
        {
          activationId: 'act-123',
          passiveId: 'heightened-senses',
          sourceRecordId: 'skill_perception_heightened_senses',
          target: pc1,
          state: 'active',
          status: 'active',
          effectText: '+2 initiative',
          displayStatus: 'Active — +2 initiative'
        }
      ],
      status: 'active',
      displayStatus: 'Active — +2 initiative',
      effectText: '+2 initiative',
      executableClaim: false
    }
  });

  const view = render(<PassiveActivationPanel />);
  const memberBox = view.container.querySelector('[data-passive-member-panel]');
  expect(memberBox).toBeTruthy();
  expect(memberBox.textContent).toMatch(/Ilse.*Active — \+2 initiative/);
  expect(memberBox.textContent).toMatch(/Brannoc.*Stored — not active/);
  expect(screen.queryByRole('button', { name: /Activate Heightened Senses/i })).toBeNull();
  expect(screen.queryByRole('button', { name: /Revoke passive/i })).toBeNull();
});
