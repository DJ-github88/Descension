import { createPersistentRoom } from '../roomService';
import { getStore } from '../../store/storeRegistry';

jest.mock('../../config/firebase', () => ({ db: null, auth: null }));
jest.mock('../../store/storeRegistry', () => ({ getStore: jest.fn() }));
jest.mock('../subscriptionService', () => ({ getUserTier: jest.fn() }));

test('permanent creation uses server authentication without a browser Firestore dependency', async () => {
  const socket = { connected: true, emit: jest.fn((_event, _payload, ack) => ack({ success: true, roomId: 'permanent-hall' })) };
  getStore.mockReturnValue({ getState: () => ({ socket }) });
  await expect(createPersistentRoom({ name: 'Quiet Hall', maxPlayers: 6 })).resolves.toBe('permanent-hall');
  expect(socket.emit).toHaveBeenCalledWith('create_room_draft', expect.objectContaining({ name: 'Quiet Hall' }), expect.any(Function));
});

test('server account denial is reported without claiming room creation', async () => {
  const socket = { connected: true, emit: jest.fn((_event, _payload, ack) => ack({ success: false, code: 'account_required', error: 'A signed-in, non-anonymous account is required' })) };
  getStore.mockReturnValue({ getState: () => ({ socket }) });
  await expect(createPersistentRoom({ name: 'Quiet Hall' })).rejects.toMatchObject({ code: 'account_required' });
});
