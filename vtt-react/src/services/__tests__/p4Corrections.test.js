/**
 * Project 4 bounded correction tests (client):
 * - wire updateId reaches the inventory application seam
 * - authenticated community art references (no bearer download URLs)
 * - private legacy art resolves to fallback, not the private URL
 * - public profile migration preserves all private fields and retries the
 *   slim replacement after failure
 */

const mockGetBlob = jest.fn();
const mockUploadBytes = jest.fn();
const mockGetDownloadURL = jest.fn();
const mockDeleteObject = jest.fn();
const mockGetMetadata = jest.fn();

jest.mock('firebase/storage', () => ({
  ref: jest.fn((_storage, path) => ({ path })),
  uploadBytes: (...args) => mockUploadBytes(...args),
  getDownloadURL: (...args) => mockGetDownloadURL(...args),
  deleteObject: (...args) => mockDeleteObject(...args),
  getMetadata: (...args) => mockGetMetadata(...args),
  getBlob: (...args) => mockGetBlob(...args)
}));

jest.mock('../../config/firebase', () => ({
  storage: {},
  db: {},
  isFirebaseConfigured: true,
  isDemoMode: false,
  isMockOrDevUser: () => false,
  auth: { currentUser: { uid: 'u1' } }
}));

jest.mock('../../utils/imageProcessor', () => ({
  processImage: jest.fn(),
  IMAGE_PROFILES: {}
}));

jest.mock('../../services/firebase/storageLimitService', () => ({
  default: {}
}));

describe('Project 4 client corrections', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('forwards the wire updateId into the inventory application seam', () => {
    const applyRemoteInventory = jest.fn();
    let onUpdate = null;
    jest.isolateModules(() => {
      jest.doMock('../../store/characterStore', () => ({
        getState: () => ({ currentCharacterId: 'char-1' })
      }));
      jest.doMock('../../store/inventoryStore', () => ({
        getState: () => ({ applyRemoteInventory })
      }));
      jest.doMock('../../store/sharedInventoryStore', () => ({
        getState: () => ({ setSharedView: jest.fn(), markPending: jest.fn(), removeSharedView: jest.fn(), clearSharedViews: jest.fn() })
      }));
      const { registerInventoryHandlers } = require('../../components/multiplayer/socketHandlers/inventoryHandlers');
      registerInventoryHandlers({
        socket: { on: (event, handler) => { if (event === 'inventory_update') onUpdate = handler; }, off: jest.fn() }
      });
    });
    onUpdate({ playerId: 'char-1', updateId: 'retry-1', inventoryData: { changeType: 'add_item', item: { id: 'i1' } } });
    expect(applyRemoteInventory).toHaveBeenCalledTimes(1);
    expect(applyRemoteInventory.mock.calls[0][0].updateId).toBe('retry-1');
  });

  it('publishes art as an authenticated shared reference, never a bearer URL', async() => {
    mockGetBlob.mockResolvedValue({ type: 'image/webp' });
    mockUploadBytes.mockResolvedValue({});
    mockGetDownloadURL.mockResolvedValue('https://firebasestorage.googleapis.com/v0/b/x/o/shared%2Fu1%2Fa.webp?alt=media&token=BEARER');
    const upload = require('../firebase/uploadService');
    const result = await upload.copyAssetToShared('u1', 'users/u1/portraits/a.webp', 'portraits');
    expect(result).toBe('shared/u1/portraits/a.webp');
    expect(String(result).includes('token=')).toBe(false);
  });

  it('refuses foreign/legacy private sources without passing the private URL through', async() => {
    const upload = require('../firebase/uploadService');
    expect(await upload.copyAssetToShared('u1', 'media/other-user/a.webp')).toBe(null);
    expect(await upload.copyAssetToShared('u1', 'https://evil.example.com/a.webp')).toBe(null);
    expect(await upload.copyAssetToShared('u1', 'avatars/other-user/a.png')).toBe(null);
  });

  it('resolves approved shared references through authenticated SDK bytes and rejects bearer URLs', async() => {
    mockGetBlob.mockResolvedValue({ type: 'image/webp' });
    const originalCreate = global.URL.createObjectURL;
    global.URL.createObjectURL = jest.fn(() => 'blob:local-object-url');
    try {
      const upload = require('../firebase/uploadService');
      expect(await upload.resolveAssetUrl('/assets/icons/default.webp')).toBe('/assets/icons/default.webp');
      expect(await upload.resolveAssetUrl('https://firebasestorage.googleapis.com/v0/b/x/o/shared%2Fu1%2Fa.webp?alt=media&token=BEARER')).toBe(null);
      const resolved = await upload.resolveAssetUrl('shared/u1/portraits/a.webp');
      expect(mockGetBlob).toHaveBeenCalled();
      expect(resolved).toBe('blob:local-object-url');
    } finally {
      global.URL.createObjectURL = originalCreate;
    }
  });

  it('migration preserves all non-public legacy fields and retries the slim replacement', async() => {
    const docs = new Map([
      ['userProfiles/u1', { displayName: 'Legacy', bio: 'private-bio', discordTag: 'private-contact', projectionVersion: 1 }]
    ]);
    let slimAttempts = 0;
    const mockDb = {
      doc: (_db, ...parts) => parts.join('/'),
      getDoc: async(key) => ({ exists: () => docs.has(key), data: () => docs.get(key) }),
      setDoc: async(key, value) => {
        if (key === 'userProfiles/u1' && slimAttempts === 0) {
          slimAttempts += 1;
          throw new Error('transient slim failure');
        }
        docs.set(key, value);
      },
      updateDoc: async(key, value) => docs.set(key, { ...docs.get(key), ...value }),
      writeBatch: () => ({
        set: (key, value) => { docs.set(key, value); },
        commit: async() => {}
      }),
      serverTimestamp: () => 'server-time'
    };
    let profile;
    jest.isolateModules(() => {
      jest.doMock('firebase/firestore', () => mockDb);
      jest.doMock('../../config/firebase', () => ({
        db: {}, storage: {}, isFirebaseConfigured: true, isDemoMode: false,
        isMockOrDevUser: () => false, auth: { currentUser: { uid: 'u1' } }
      }));
      jest.doMock('../../utils/firebaseUtils', () => ({ sanitizeForFirestore: (x) => x }));
      profile = require('../firebase/userProfileService');
    });

    const loaded = await profile.loadUserProfile('u1');
    expect(loaded.bio).toBe('private-bio');
    expect(docs.get('userSettings/u1').profile.discordTag).toBe('private-contact');
    // Public doc is still the mixed v1 after the failed slim; retry on next load.
    await profile.loadUserProfile('u1');
    const publicDoc = docs.get('userProfiles/u1');
    expect(publicDoc.projectionVersion).toBe(1);
    expect(publicDoc.bio).toBeUndefined();
    expect(publicDoc.discordTag).toBeUndefined();
  });
});
