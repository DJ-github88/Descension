/**
 * Project 3 — roomService shared-writer boundary (frozen 40).
 */

import {
  saveCompleteGameState,
  updateRoomGameState,
  updateGameStateSection,
  updateRoom,
  requestRoomMetadataUpdate
} from '../roomService';
import { registerStore } from '../../store/storeRegistry';

describe('roomService shared-write boundary', () => {
  test('browser whole-room and section writers are closed', async () => {
    await expect(saveCompleteGameState('room-1', { tokens: {} })).rejects.toThrow(/Project 3/);
    await expect(updateRoomGameState('room-1', { tokens: {} })).rejects.toThrow(/Project 3/);
    await expect(updateGameStateSection('room-1', 'tokens', {})).rejects.toThrow(/Project 3/);
  });

  test('metadata updates reject shared gameState/checkpoint fields', async () => {
    await expect(updateRoom('room-1', { gameState: { tokens: {} } })).rejects.toThrow(/shared room field "gameState"/);
    await expect(updateRoom('room-1', { checkpoint: { revision: 1 } })).rejects.toThrow(/shared room field "checkpoint"/);
    await expect(updateRoom('room-1', { 'gameState.tokens': {} })).rejects.toThrow(/shared room field/);
    await expect(updateRoom('room-1', { 'checkpoint.revision': 2 })).rejects.toThrow(/shared room field/);
  });

  test('shared canonical metadata (name/description/settings) is server-checkpoint only', async () => {
    await expect(updateRoom('room-1', { name: 'Renamed' })).rejects.toThrow(/shared room field "name"/);
    await expect(updateRoom('room-1', { description: 'Edited' })).rejects.toThrow(/shared room field "description"/);
    await expect(updateRoom('room-1', { settings: { maxPlayers: 12 } })).rejects.toThrow(/shared room field "settings"/);
    await expect(updateRoom('room-1', { 'settings.maxPlayers': 12 })).rejects.toThrow(/shared room field/);
  });
});

describe('roomService server-mediated metadata boundary', () => {
  test('shared metadata requests are emitted on the verified multiplayer socket, not Firestore', async() => {
    const emitted = [];
    const socket = {
      connected: true,
      emit: (event, payload, ack) => {
        emitted.push({ event, payload });
        ack({ success: true, outcome: 'confirmed', name: payload.name });
      }
    };
    registerStore('presenceStore', { getState: () => ({ socket }) });

    const result = await requestRoomMetadataUpdate('room-1', { name: 'Renamed' });
    expect(result).toEqual({ success: true, outcome: 'confirmed', name: 'Renamed' });
    expect(emitted).toHaveLength(1);
    expect(emitted[0].event).toBe('update_room_metadata');
    expect(emitted[0].payload).toMatchObject({ roomId: 'room-1', name: 'Renamed' });
  });

  test('a server refusal propagates as a bounded error and never reports success', async() => {
    const socket = {
      connected: true,
      emit: (event, payload, ack) => ack({ success: false, error: 'GM privileges required' })
    };
    registerStore('presenceStore', { getState: () => ({ socket }) });
    await expect(requestRoomMetadataUpdate('room-1', { name: 'Hijack' }))
      .rejects.toThrow(/GM privileges required/);
  });

  test('without a connected multiplayer socket there is no metadata write attempt', async() => {
    registerStore('presenceStore', { getState: () => ({ socket: null }) });
    await expect(requestRoomMetadataUpdate('room-1', { name: 'X' }))
      .rejects.toThrow(/connection unavailable/);
  });
});
