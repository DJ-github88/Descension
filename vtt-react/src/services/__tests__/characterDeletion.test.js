import service from '../firebase/characterPersistenceService';
import { doc, runTransaction } from 'firebase/firestore';
import { createCoreSlice } from '../../store/characterSlices/coreSlice';
import { saveRoster, clearActivePointer } from '../../persistence/characterScopedStorage';
import { captureOwnerGuard } from '../../persistence/scopedConsumer';

jest.mock('../../config/firebase', () => ({ db: {}, auth: null, isFirebaseConfigured: true, isDemoMode: false }));
jest.mock('firebase/firestore', () => ({
  doc: jest.fn((_db, collection, id) => `${collection}/${id}`),
  runTransaction: jest.fn(), serverTimestamp: () => 'server-time'
}));
jest.mock('../firebase/characterStateService', () => ({ deleteCharacterState: jest.fn().mockResolvedValue(true) }));
jest.mock('../firebase/characterSessionService', () => ({ forceEndAllSessions: jest.fn().mockResolvedValue(true) }));
jest.mock('../../utils/firebaseUtils', () => ({ sanitizeForFirestore: value => value }));
jest.mock('../../store/characterHelpers', () => ({
  getCurrentUserId: () => 'owner', isGuestUser: () => false, shouldUseFirebase: () => true,
  discardCharacterAutoSave: jest.fn()
}));
jest.mock('../../persistence/characterScopedStorage', () => ({ saveRoster: jest.fn(), clearActivePointer: jest.fn() }));
jest.mock('../../persistence/scopedConsumer', () => ({ captureOwnerGuard: jest.fn() }));

afterEach(() => jest.restoreAllMocks());

test('cloud deletion completes all reads before writing the deletion and roster', async () => {
  doc.mockImplementation((_db, collection, id) => `${collection}/${id}`);
  let wrote = false;
  const update = jest.fn(() => { wrote = true; });
  runTransaction.mockImplementation((_db, run) => run({
    get: async ref => {
      if (wrote) throw new Error('Firestore transactions require all reads before writes');
      return { exists: () => true, data: () => ref.startsWith('characters/')
        ? { metadata: { userId: 'owner' } } : { characters: ['remove-me', 'keep-me'] } };
    }, update
  }));
  await expect(service.deleteCharacter('remove-me', 'owner')).resolves.toBe(true);
  expect(update).toHaveBeenCalledWith('users/owner', { characters: ['keep-me'] });
});

test('vault deletion waits for durable roster removal before resolving and clears the active pointer', async () => {
  captureOwnerGuard.mockReturnValue({ ok: true, context: {}, isCurrent: () => true });
  jest.spyOn(service, 'deleteCharacter').mockResolvedValue(true);
  let finishSave;
  saveRoster.mockImplementation(() => new Promise(resolve => { finishSave = resolve; }));
  let state;
  const set = update => { state = { ...state, ...update }; };
  state = { ...createCoreSlice(set, () => state), characters: [{ id: 'remove-me' }, { id: 'keep-me' }], currentCharacterId: 'remove-me' };
  let completed = false;
  const deletion = state.deleteCharacter('remove-me').then(() => { completed = true; });
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(completed).toBe(false);
  expect(state.characters).toHaveLength(2);
  finishSave({ status: 'OK' });
  await deletion;
  expect(state.characters).toEqual([{ id: 'keep-me' }]);
  expect(state.currentCharacterId).toBeNull();
  expect(clearActivePointer).toHaveBeenCalled();
  service.deleteCharacter.mockRestore();
});

test('a cloud refusal keeps the character visible and reports deletion failure', async () => {
  captureOwnerGuard.mockReturnValue({ ok: true, context: {}, isCurrent: () => true });
  jest.spyOn(service, 'deleteCharacter').mockRejectedValue(new Error('Access denied'));
  let state;
  const set = update => { state = { ...state, ...update }; };
  state = { ...createCoreSlice(set, () => state), characters: [{ id: 'keep-me' }] };
  await expect(state.deleteCharacter('keep-me')).rejects.toThrow('Access denied');
  expect(state.characters).toEqual([{ id: 'keep-me' }]);
  expect(state.isLoading).toBe(false);
  service.deleteCharacter.mockRestore();
});
