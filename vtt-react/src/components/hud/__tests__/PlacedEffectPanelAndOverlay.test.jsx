import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { registerStore } from '../../../store/storeRegistry';
import useGameStore from '../../../store/gameStore';
import useMapStore from '../../../store/mapStore';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import { requestActorEvent, refOf } from '../../../services/actorConsequenceService';
import { useSpellConsequenceStore } from '../../../services/spellConsequenceService';
import { usePlacedEffectStore } from '../../../services/placedEffectService';
import { notifyRoomRejoined } from '../../../services/roomRejoinBus';
import PlacedEffectPanel from '../PlacedEffectPanel';
import PlacedEffectOverlay from '../../grid/PlacedEffectOverlay';

jest.mock('../../../services/actorConsequenceService', () => ({
  requestActorEvent: jest.fn(),
  refOf: jest.fn(token => token?.state?.actorContract?.actorRef || null)
}));

function makeSocket() {
  const listeners = new Map();
  return {
    connected: true,
    on: jest.fn((event, fn) => {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(fn);
    }),
    off: jest.fn((event, fn) => {
      listeners.get(event)?.delete(fn);
    }),
    trigger(event, payload) {
      for (const fn of listeners.get(event) || []) fn(payload);
    }
  };
}

describe('PlacedEffectPanel & PlacedEffectOverlay', () => {
  const ROOM_ID = 'room-placed-test';
  const PC_REF = {
    kind: 'character',
    roomId: ROOM_ID,
    mapId: 'default',
    tokenId: 'pc-1',
    ownerUid: 'owner-uid',
    characterId: 'char-1'
  };
  const DEF_REF = {
    roomId: ROOM_ID,
    definitionId: '22222222-2222-4222-8222-222222222222',
    definitionVersion: 1,
    definitionHash: 'a'.repeat(64)
  };
  const mockGridSystem = {
    worldToScreen: (x, y) => ({ x, y }),
    screenToWorld: (x, y) => ({ x, y }),
    getGridState: () => ({ gridType: 'square' })
  };

  let origRandomUUID;

  beforeEach(async () => {
    registerStore('gameStore', useGameStore);
    registerStore('mapStore', useMapStore);
    registerStore('characterTokenStore', useCharacterTokenStore);
    useMapStore.setState({ currentMapId: 'default' });
    jest.clearAllMocks();
    refOf.mockImplementation(token => token?.state?.actorContract?.actorRef || null);
    await Promise.resolve();
    origRandomUUID = global.crypto?.randomUUID;
    if (!global.crypto) global.crypto = {};
    let seq = 0;
    global.crypto.randomUUID = () => `00000000-0000-4000-8000-00000000000${++seq}`;

    usePlacedEffectStore.setState({
      projection: null,
      roomId: null,
      loading: false,
      error: null,
      message: '',
      placementDraft: null
    });
    useSpellConsequenceStore.setState({
      authoredRoomId: ROOM_ID,
      authoredEntries: [{
        definitionRef: DEF_REF,
        revoked: false,
        creatureOnly: false,
        canonicalDefinition: {
          name: 'Frost Snare',
          targeting: { kind: 'single', rangeFeet: 60 }
        }
      }]
    });
    useCharacterTokenStore.setState({
      characterTokens: [{
        id: 'pc-1',
        mapId: 'default',
        ownerUserId: 'owner-uid',
        character: { id: 'char-1', name: 'Lyra' },
        state: {
          actorContract: {
            version: 1,
            primary: true,
            ...PC_REF,
            actorRef: PC_REF
          }
        }
      }]
    });
  });

  afterEach(() => {
    if (origRandomUUID) global.crypto.randomUUID = origRandomUUID;
    act(() => {
      useGameStore.setState({
        multiplayerRoom: null,
        multiplayerSocket: null,
        isGMMode: false,
        currentMapId: 'default'
      });
    });
  });

  test('GM places an unarmed domain placement onto map canvas, renders marker, removes it, and recovers on rejoin', async () => {
    const socket = makeSocket();
    const placedRecord = {
      placementId: '33333333-3333-4333-8333-333333333333',
      contract: 'placed-effect:v1',
      family: 'inscription',
      armed: false,
      state: 'placed',
      visibility: 'owner-and-gm',
      location: {
        mapId: 'default',
        position: { x: 425, y: 325 },
        shape: 'circle',
        radiusFeet: 15
      },
      owner: PC_REF,
      definitionRef: DEF_REF,
      abilityName: 'Frost Snare',
      displayStatus: 'Placed (unarmed) — 15 ft radius · Frost Snare'
    };

    let currentPlacements = [];
    let currentRev = 0;

    requestActorEvent.mockImplementation(async (event, payload) => {
      if (event === 'actor_placed_effect_list') {
        return {
          success: true,
          roomId: ROOM_ID,
          contract: 'placed-effect:v1',
          armingApproved: false,
          revision: currentRev,
          placements: currentPlacements,
          executableClaim: false
        };
      }
      if (event === 'actor_placed_effect_place') {
        currentPlacements = [placedRecord];
        currentRev = 1;
        return {
          success: true,
          roomId: ROOM_ID,
          placement: placedRecord,
          revision: currentRev,
          placements: currentPlacements
        };
      }
      if (event === 'actor_placed_effect_remove') {
        currentPlacements = [];
        currentRev = 2;
        return {
          success: true,
          roomId: ROOM_ID,
          placementId: payload.placementId,
          revision: currentRev,
          placements: currentPlacements
        };
      }
      return { success: false };
    });

    useGameStore.setState({
      multiplayerRoom: { id: ROOM_ID },
      multiplayerSocket: socket,
      isGMMode: true,
      currentMapId: 'default'
    });

    render(
      <>
        <PlacedEffectPanel />
        <PlacedEffectOverlay gridSystem={mockGridSystem} feetPerTile={5} gridSize={50} currentMapId="default" />
      </>
    );

    await waitFor(() => {
      expect(screen.getByTestId('placed-effect-panel')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Placed effect domain'), { target: { value: 'inscription' } });
    fireEvent.change(screen.getByLabelText('Placed effect radius'), { target: { value: '15' } });
    fireEvent.click(screen.getByRole('button', { name: 'Place on map' }));

    const catcher = await screen.findByTestId('placed-effect-map-catcher');
    fireEvent.click(catcher, { clientX: 425, clientY: 325 });

    await waitFor(() => {
      expect(screen.getByTestId(`placed-marker-${placedRecord.placementId}`)).toBeInTheDocument();
      expect(screen.getByTestId(`placed-hud-item-${placedRecord.placementId}`)).toBeInTheDocument();
    });

    const placeCall = requestActorEvent.mock.calls.find(([evt]) => evt === 'actor_placed_effect_place');
    expect(placeCall[1]).toMatchObject({
      roomId: ROOM_ID,
      family: 'inscription',
      armed: false,
      owner: PC_REF,
      definitionRef: DEF_REF,
      location: { mapId: 'default', position: { x: 425, y: 325 }, radiusFeet: 15 }
    });

    // Rejoin triggers authoritative reload
    const listCallsBefore = requestActorEvent.mock.calls.filter(([evt]) => evt === 'actor_placed_effect_list').length;
    await act(async () => {
      notifyRoomRejoined({ socket, roomId: ROOM_ID });
    });
    await waitFor(() => {
      const listCallsAfter = requestActorEvent.mock.calls.filter(([evt]) => evt === 'actor_placed_effect_list').length;
      expect(listCallsAfter).toBeGreaterThan(listCallsBefore);
    });

    // Remove via map overlay diagonal button
    fireEvent.click(screen.getByTestId(`placed-remove-map-${placedRecord.placementId}`));
    await waitFor(() => {
      expect(screen.queryByTestId(`placed-marker-${placedRecord.placementId}`)).not.toBeInTheDocument();
      expect(screen.queryByTestId(`placed-hud-item-${placedRecord.placementId}`)).not.toBeInTheDocument();
    });
  });

  test('non-GM owner sees placement read-only while unrelated observer sees nothing when placements list is empty', async () => {
    const socket = makeSocket();
    const visibleItem = {
      placementId: '44444444-4444-4444-8444-444444444444',
      family: 'totem',
      state: 'placed',
      abilityName: 'Frost Snare',
      displayStatus: 'Placed (unarmed) — 10 ft radius · Frost Snare',
      location: { mapId: 'default', position: { x: 300, y: 300 }, radiusFeet: 10 }
    };

    requestActorEvent.mockResolvedValueOnce({
      success: true,
      roomId: ROOM_ID,
      armingApproved: false,
      revision: 1,
      placements: [visibleItem]
    });

    useGameStore.setState({
      multiplayerRoom: { id: ROOM_ID },
      multiplayerSocket: socket,
      isGMMode: false,
      currentMapId: 'default'
    });

    const { rerender } = render(
      <>
        <PlacedEffectPanel />
        <PlacedEffectOverlay gridSystem={mockGridSystem} feetPerTile={5} gridSize={50} currentMapId="default" />
      </>
    );

    await waitFor(() => {
      expect(screen.getByTestId(`placed-hud-item-${visibleItem.placementId}`)).toBeInTheDocument();
      expect(screen.getByTestId(`placed-marker-${visibleItem.placementId}`)).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: 'Place on map' })).not.toBeInTheDocument();
    expect(screen.queryByTestId(`placed-remove-map-${visibleItem.placementId}`)).not.toBeInTheDocument();

    // Observer with empty server projection sees neither HUD panel nor overlay
    requestActorEvent.mockResolvedValueOnce({
      success: true,
      roomId: ROOM_ID,
      armingApproved: false,
      revision: 1,
      placements: []
    });
    await act(async () => {
      notifyRoomRejoined({ socket, roomId: ROOM_ID });
    });
    rerender(
      <>
        <PlacedEffectPanel />
        <PlacedEffectOverlay gridSystem={mockGridSystem} feetPerTile={5} gridSize={50} currentMapId="default" />
      </>
    );
    await waitFor(() => {
      expect(screen.queryByTestId('placed-effect-panel')).not.toBeInTheDocument();
      expect(screen.queryByTestId('placed-effect-overlay')).not.toBeInTheDocument();
    });
  });
});
