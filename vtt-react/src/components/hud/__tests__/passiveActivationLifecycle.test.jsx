import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SpellConsequenceHost from '../SpellConsequencePanel';
import useGameStore from '../../../store/gameStore';
import useCharacterTokenStore from '../../../store/characterTokenStore';

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
  const actual = jest.requireActual('../../../services/triggerOfferService');
  return {
    ...actual,
    registerTriggerOfferHandlers: jest.fn(() => () => {}),
    refreshTriggerOffers: jest.fn(),
    useTriggerOfferStore: jest.fn(selector => selector({
      offers: [],
      pendingOfferId: null,
      loading: false,
      error: null,
      message: null
    }))
  };
});

const mockServiceState = {
  projection: null,
  loading: false,
  error: null,
  message: null
};

jest.mock('../../../services/passiveActivationService', () => {
  const actualPolicy = jest.requireActual('../../../services/passiveActivationPolicy');
  return {
    usePassiveActivationStore: jest.fn(selector => selector(mockServiceState)),
    refreshPassiveLedger: jest.fn(async () => ({ success: true })),
    registerPassiveHandlers: jest.fn(() => () => {}),
    activatePassive: jest.fn(async () => ({ success: true })),
    revokePassive: jest.fn(async () => ({ success: true })),
    primaryPcTargets: jest.fn(() => [])
  };
});

const {
  usePassiveActivationStore,
  activatePassive,
  revokePassive,
  primaryPcTargets
} = jest.requireMock('../../../services/passiveActivationService');

const realPolicy = jest.requireActual('../../../services/passiveActivationPolicy');

const pcRef = {
  kind: 'character',
  roomId: 'room-1',
  mapId: 'map-1',
  tokenId: 'pc-1',
  instanceId: 'inst-pc-1',
  ownerUid: 'owner-1',
  characterId: 'ilse'
};

const {
  ownerSource,
  retainedTargetResponses
} = jest.requireMock('../../../services/spellConsequenceService');
const {
  useTriggerOfferStore
} = jest.requireMock('../../../services/triggerOfferService');

describe('PassiveActivationPanel lifecycle (stale, reactivation, observer privacy)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ownerSource.mockReturnValue({ ref: null, token: null, error: 'none' });
    retainedTargetResponses.mockReturnValue([]);
    useTriggerOfferStore.mockImplementation(selector => selector({
      offers: [],
      pendingOfferId: null,
      loading: false,
      error: null,
      message: null
    }));
    usePassiveActivationStore.mockImplementation(selector => selector(mockServiceState));
    useGameStore.setState({
      isInMultiplayer: true,
      multiplayerRoom: { id: 'room-1' },
      multiplayerSocket: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
      isGMMode: true
    });
    useCharacterTokenStore.setState({ characterTokens: [] });
  });

  test('stale activation disables Activate, keeps Revoke enabled, and allows explicit GM reactivation after revoke', async () => {
    primaryPcTargets.mockReturnValue([
      {
        ref: pcRef,
        label: 'Ilse',
        eligibility: realPolicy.evaluatePassiveEligibility({ skillRanks: { perception: 'NOVICE' } })
      }
    ]);
    mockServiceState.projection = {
      capability: 'passive-activation:v1',
      viewerRole: 'gm',
      revision: 2,
      activations: [
        {
          activationId: 'act-stale-1',
          target: pcRef,
          passiveId: 'heightened-senses',
          sourceRecordId: 'skill_perception_heightened_senses',
          state: 'stale',
          reason: 'character sheet or contract revision changed since activation',
          displayStatus: 'Inactive — character sheet or contract revision changed since activation'
        }
      ],
      status: 'inactive',
      displayStatus: 'Inactive — character sheet or contract revision changed since activation'
    };

    const { rerender } = render(<SpellConsequenceHost />);
    const activateBtn = screen.getByRole('button', { name: 'Activate Heightened Senses (+2 initiative)' });
    const revokeBtn = screen.getByRole('button', { name: 'Revoke passive' });

    expect(activateBtn).toBeDisabled();
    expect(revokeBtn).not.toBeDisabled();
    expect(screen.getAllByText(/Inactive — character sheet or contract revision changed since activation/).length).toBeGreaterThan(0);

    fireEvent.click(revokeBtn);
    await waitFor(() => expect(revokePassive).toHaveBeenCalledWith('act-stale-1'));

    mockServiceState.projection = {
      capability: 'passive-activation:v1',
      viewerRole: 'gm',
      revision: 3,
      activations: [],
      status: 'stored',
      displayStatus: 'Stored — not active'
    };
    rerender(<SpellConsequenceHost />);

    const reactivateBtn = screen.getByRole('button', { name: 'Activate Heightened Senses (+2 initiative)' });
    expect(reactivateBtn).not.toBeDisabled();
    fireEvent.click(reactivateBtn);
    await waitFor(() => expect(activatePassive).toHaveBeenCalledWith({
      target: pcRef,
      passiveId: 'heightened-senses',
      sourceRecordId: 'skill_perception_heightened_senses'
    }));
  });

  test('unrelated observer sees no GM controls and no other player activation rows', () => {
    useGameStore.setState({ isGMMode: false });
    primaryPcTargets.mockReturnValue([]);
    mockServiceState.projection = {
      capability: 'passive-activation:v1',
      viewerRole: 'member',
      revision: 1,
      activations: [],
      status: 'stored',
      displayStatus: 'Stored — not active'
    };

    render(<SpellConsequenceHost />);
    expect(screen.queryByRole('button', { name: /Activate Heightened Senses/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /Revoke passive/i })).toBeNull();
    expect(screen.queryByText(/Ilse/i)).toBeNull();
  });
});
