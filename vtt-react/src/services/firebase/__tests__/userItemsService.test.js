/**
 * Unit tests for the storage-quota enforcement added to saveUserItem /
 * deleteUserItem. The spell (userSpellService) and creature
 * (userCreaturesService) services mirror this logic identically, so this
 * file covers the canonical contract.
 */

// Mocks are hoisted above imports by babel-jest. Define the mock bodies inside
// the factories, then pull references in via the (now-mocked) imports below.
jest.mock('../../../config/firebase', () => ({
  db: {},
  isFirebaseConfigured: true,
  isDemoMode: false
}));

jest.mock('../../../utils/firebaseUtils', () => ({
  sanitizeForFirestore: (data) => data
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn((...args) => ({ path: args.join('/') })),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  serverTimestamp: jest.fn(() => 'SERVER_TIMESTAMP'),
  arrayUnion: jest.fn(),
  arrayRemove: jest.fn()
}));

jest.mock('../storageLimitService', () => ({
  __esModule: true,
  default: {
    estimateDataSize: jest.fn((data) => Buffer.byteLength(JSON.stringify(data || {}))),
    canStoreData: jest.fn(),
    canStoreDocument: jest.fn(),
    countUserDocuments: jest.fn(),
    updateStorageUsage: jest.fn()
  }
}));

const { saveUserItem, deleteUserItem } = require('../userItemsService');
const { getDoc, setDoc, deleteDoc } = require('firebase/firestore');
const storageLimitService = require('../storageLimitService').default;

const USER_ID = 'user-123';

beforeEach(() => {
  jest.clearAllMocks();
  // Re-establish implementations (clearAllMocks wipes the factory defaults).
  storageLimitService.estimateDataSize.mockImplementation(
    (data) => Buffer.byteLength(JSON.stringify(data || {}))
  );
  storageLimitService.canStoreData.mockResolvedValue(true);
  storageLimitService.canStoreDocument.mockResolvedValue({ allowed: true, count: 0, limit: 100 });
  storageLimitService.updateStorageUsage.mockResolvedValue({});
  setDoc.mockResolvedValue(undefined);
  deleteDoc.mockResolvedValue(undefined);
});

describe('saveUserItem: storage quota enforcement', () => {
  it('blocks a NEW item when the user is over quota', async () => {
    // New document (item ref does not exist yet)
    getDoc.mockResolvedValueOnce({ exists: () => false });
    storageLimitService.canStoreData.mockResolvedValue(false);

    const result = await saveUserItem(USER_ID, { id: 'item-1', name: 'Sword' });

    expect(result).toMatchObject({ success: false, reason: 'storage_full' });
    expect(setDoc).not.toHaveBeenCalled();
    // No usage bookkeeping should run when the write was blocked
    expect(storageLimitService.updateStorageUsage).not.toHaveBeenCalled();
  });

  it('allows a NEW item when under quota and tracks the bytes', async () => {
    getDoc.mockResolvedValueOnce({ exists: () => false }); // item ref
    getDoc.mockResolvedValueOnce({ exists: () => true });  // user ref (list update)

    const result = await saveUserItem(USER_ID, { id: 'item-2', name: 'Shield' });

    expect(result.success).toBe(true);
    expect(result.itemId).toBe('item-2');
    expect(setDoc).toHaveBeenCalledTimes(1);
    // Quota was checked for a new doc
    expect(storageLimitService.canStoreData).toHaveBeenCalledWith(USER_ID, expect.any(Number), 'items');
    // Positive byte delta recorded
    expect(storageLimitService.updateStorageUsage).toHaveBeenCalledWith(USER_ID, 'items', expect.any(Number));
    const delta = storageLimitService.updateStorageUsage.mock.calls[0][2];
    expect(delta).toBeGreaterThan(0);
  });

  it('blocks a NEW item when the per-tier document COUNT limit is reached', async () => {
    // Under the byte quota, but at the count cap.
    getDoc.mockResolvedValueOnce({ exists: () => false });
    storageLimitService.canStoreDocument.mockResolvedValue({ allowed: false, count: 100, limit: 100 });

    const result = await saveUserItem(USER_ID, { id: 'item-ct', name: 'Cap Sword' });

    expect(result).toMatchObject({ success: false, reason: 'storage_full', limitType: 'count' });
    expect(result.error).toContain('100/100');
    expect(setDoc).not.toHaveBeenCalled();
    expect(storageLimitService.updateStorageUsage).not.toHaveBeenCalled();
  });

  it('allows a NEW item when the tier has unlimited (-1) count', async () => {
    getDoc.mockResolvedValueOnce({ exists: () => false });
    getDoc.mockResolvedValueOnce({ exists: () => true });
    storageLimitService.canStoreDocument.mockResolvedValue({ allowed: true, count: -1, limit: -1 });

    const result = await saveUserItem(USER_ID, { id: 'item-ul', name: 'Ultimate Shield' });

    expect(result.success).toBe(true);
    expect(storageLimitService.canStoreDocument).toHaveBeenCalledWith(USER_ID, 'userItems', 'maxItems');
  });

  it('does NOT block edits to an existing item (update path skips the guard)', async () => {
    const existingData = { id: 'item-3', name: 'Old Name' };
    getDoc.mockResolvedValueOnce({ exists: () => true, data: () => existingData }); // item ref → exists
    getDoc.mockResolvedValueOnce({ exists: () => true }); // user ref

    const result = await saveUserItem(USER_ID, { id: 'item-3', name: 'New Name' });

    expect(result.success).toBe(true);
    expect(setDoc).toHaveBeenCalledTimes(1);
    // Critical: editing your own content must never be quota-gated
    expect(storageLimitService.canStoreData).not.toHaveBeenCalled();
  });
});

describe('deleteUserItem: storage tracking', () => {
  it('decrements storage usage by the removed document size', async () => {
    const itemData = { id: 'item-9', name: 'Junk', userId: USER_ID };
    getDoc.mockResolvedValueOnce({ exists: () => true, data: () => itemData });

    const result = await deleteUserItem(USER_ID, 'item-9');

    expect(result.success).toBe(true);
    expect(deleteDoc).toHaveBeenCalledTimes(1);
    expect(storageLimitService.updateStorageUsage).toHaveBeenCalledWith(USER_ID, 'items', expect.any(Number));
    const delta = storageLimitService.updateStorageUsage.mock.calls[0][2];
    expect(delta).toBeLessThan(0); // negative → decrement
  });
});
