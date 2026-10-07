/**
 * Project 4 R11 — profile migration safety.
 *
 * The slim public replacement is a HARD-gated batch: legacy private values are
 * preserved (existing private values win) atomically with the slim write. A
 * failed preservation can never leave a slimmed public document.
 */

const mockBatchSet = jest.fn();
let mockBatchCommit = jest.fn(async() => {});

jest.mock('firebase/firestore', () => ({
  doc: (_db, collection, id) => ({ collection, id, path: `${collection}/${id}` }),
  getDoc: jest.fn(),
  setDoc: jest.fn(async() => {}),
  updateDoc: jest.fn(async() => {}),
  writeBatch: jest.fn(() => ({
    set: (...args) => mockBatchSet(...args),
    commit: () => mockBatchCommit()
  })),
  serverTimestamp: jest.fn(() => 'TS')
}));

jest.mock('../../../config/firebase', () => ({
  db: {},
  isFirebaseConfigured: true,
  isDemoMode: false,
  isMockOrDevUser: () => false,
  auth: { currentUser: { uid: 'u1' } }
}));

jest.mock('../../../utils/firebaseUtils', () => ({
  sanitizeForFirestore: (value) => value
}));

const { getDoc, setDoc, writeBatch } = require('firebase/firestore');
const { loadUserProfile } = require('../userProfileService');

const PUBLIC_LEGACY = {
  displayName: 'D',
  photoURL: null,
  projectionVersion: 0,
  bio: 'LEGACY_BIO',
  customLegacy: 'LEGACY_CUSTOM'
};

function mockDocs(privateProfileData, legacyData) {
  getDoc.mockImplementation(async(ref) => {
    if (ref.collection === 'userSettings') {
      return {
        exists: () => privateProfileData !== null,
        data: () => (privateProfileData === null ? undefined : { profile: privateProfileData })
      };
    }
    return {
      exists: () => legacyData !== null,
      data: () => legacyData || {}
    };
  });
}

describe('Project 4 R11 profile migration safety', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBatchCommit = jest.fn(async() => {});
    // CRA resets mock implementations between tests; re-install the batch seam.
    writeBatch.mockImplementation(() => ({
      set: (...args) => mockBatchSet(...args),
      commit: () => mockBatchCommit()
    }));
  });

  it('A: a failed preservation batch leaves the public mixed document untouched', async() => {
    mockDocs({ displayName: 'D' }, PUBLIC_LEGACY);
    mockBatchCommit = jest.fn(async() => {throw new Error('commit unavailable');});

    const profile = await loadUserProfile('u1');

    // Nothing persisted: public keeps its full/mixed shape and no slim write
    // ever lands.
    expect(setDoc).not.toHaveBeenCalled();
    expect(mockBatchSet).toHaveBeenCalled();
    expect(profile.displayName).toBe('D');
  });

  it('B: a successful retry preserves legacy-only private fields and slims exactly', async() => {
    mockDocs({ displayName: 'D' }, PUBLIC_LEGACY);

    const profile = await loadUserProfile('u1');

    const privateSet = mockBatchSet.mock.calls.find(([ref]) => ref.collection === 'userSettings');
    expect(privateSet).toBeTruthy();
    const fill = privateSet[1].profile;
    expect(fill.bio).toBe('LEGACY_BIO');
    expect(fill.customLegacy).toBe('LEGACY_CUSTOM');

    const publicSet = mockBatchSet.mock.calls.find(([ref]) => ref.collection === 'userProfiles');
    expect(publicSet).toBeTruthy();
    const slim = publicSet[1];
    expect(Object.keys(slim).sort()).toEqual([
      'displayName', 'friendId', 'friendId_lowercase', 'photoURL', 'projectionVersion', 'updatedAt'
    ]);
    expect(slim.projectionVersion).toBe(1);
    expect(profile.bio).toBe('LEGACY_BIO');
    expect(profile.customLegacy).toBe('LEGACY_CUSTOM');
  });

  it('C: an existing NEW private value is never overwritten by the older legacy value', async() => {
    mockDocs({ displayName: 'D', bio: 'NEW_BIO' }, PUBLIC_LEGACY);

    const profile = await loadUserProfile('u1');

    const privateSet = mockBatchSet.mock.calls.find(([ref]) => ref.collection === 'userSettings');
    if (privateSet) {
      expect('bio' in privateSet[1].profile).toBe(false);
    }
    expect(profile.bio).toBe('NEW_BIO');
  });

  it('D: a custom legacy field missing privately is preserved privately', async() => {
    mockDocs({ displayName: 'D', bio: 'NEW_BIO' }, PUBLIC_LEGACY);

    await loadUserProfile('u1');

    const privateSet = mockBatchSet.mock.calls.find(([ref]) => ref.collection === 'userSettings');
    expect(privateSet).toBeTruthy();
    expect(privateSet[1].profile.customLegacy).toBe('LEGACY_CUSTOM');
    expect('bio' in privateSet[1].profile).toBe(false);
  });
});
