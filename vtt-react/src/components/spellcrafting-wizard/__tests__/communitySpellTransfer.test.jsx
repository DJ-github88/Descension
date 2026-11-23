import { definitionFromWizard } from '../../../services/authoredAbility';
import {
  saveUserSpell,
  shareSpellToCommunity
} from '../../../services/firebase/userSpellService';
import {
  uploadSpell,
  downloadSpell,
  getAllCommunitySpells,
  searchSpells
} from '../../../services/firebase/communitySpellService';
import { buildDownloadedLibrarySpell } from '../components/library/CommunitySpellsTab';

if (typeof global.crypto === 'undefined' || !global.crypto.randomUUID) {
  Object.defineProperty(global, 'crypto', { value: require('crypto').webcrypto, configurable: true });
}

if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function (type) {
    if (type !== '2d') return null;
    return {
      clearRect: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
      save: () => {},
      restore: () => {},
      translate: () => {},
      scale: () => {},
      fillText: () => {},
      measureText: () => ({ width: 0 }),
      setLineDash: () => {}
    };
  };
}

const mockDoc = jest.fn();
const mockCollection = jest.fn();
const mockQuery = jest.fn();
const mockWhere = jest.fn();
const mockOrderBy = jest.fn();
const mockLimit = jest.fn();
const mockGetDoc = jest.fn();
const mockGetDocs = jest.fn();
const mockGetCountFromServer = jest.fn();
const mockSetDoc = jest.fn();
const mockUpdateDoc = jest.fn();
const mockAddDoc = jest.fn();
const mockDeleteDoc = jest.fn();
const mockIncrement = jest.fn();
const mockArrayUnion = jest.fn();
const mockArrayRemove = jest.fn();
const mockServerTimestamp = jest.fn();
const mockShareEntityImages = jest.fn();
const mockUpsertCommunitySummary = jest.fn();
const mockGetCommunitySummaries = jest.fn();
const mockBackfillCommunitySummaries = jest.fn();

jest.mock('firebase/auth', () => ({
  __esModule: true,
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(() => () => {}),
  updateProfile: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  sendEmailVerification: jest.fn(),
  signInAnonymously: jest.fn()
}));

jest.mock('firebase/firestore', () => ({
  __esModule: true,
  collection: (...args) => mockCollection(...args),
  doc: (...args) => mockDoc(...args),
  query: (...args) => mockQuery(...args),
  where: (...args) => mockWhere(...args),
  orderBy: (...args) => mockOrderBy(...args),
  limit: (...args) => mockLimit(...args),
  getDoc: (...args) => mockGetDoc(...args),
  getDocs: (...args) => mockGetDocs(...args),
  getCountFromServer: (...args) => mockGetCountFromServer(...args),
  setDoc: (...args) => mockSetDoc(...args),
  updateDoc: (...args) => mockUpdateDoc(...args),
  addDoc: (...args) => mockAddDoc(...args),
  deleteDoc: (...args) => mockDeleteDoc(...args),
  increment: (...args) => mockIncrement(...args),
  arrayUnion: (...args) => mockArrayUnion(...args),
  arrayRemove: (...args) => mockArrayRemove(...args),
  serverTimestamp: (...args) => mockServerTimestamp(...args),
  Timestamp: {
    fromDate: (d) => ({ toDate: () => d, seconds: Math.floor(d.getTime() / 1000), nanoseconds: 0 })
  }
}));

jest.mock('../../../config/firebase', () => ({
  __esModule: true,
  db: { __mockDb: true },
  isFirebaseConfigured: true,
  isDemoMode: false,
  auth: { currentUser: { uid: 'acct-a' } },
  isMockOrDevUser: () => false
}));

jest.mock('../../../services/firebase/uploadService', () => ({
  __esModule: true,
  shareEntityImages: (...args) => mockShareEntityImages(...args)
}));

jest.mock('../../../services/firebase/communitySummaryService', () => ({
  __esModule: true,
  SUMMARY_KINDS: { SPELL: 'spell' },
  upsertCommunitySummary: (...args) => mockUpsertCommunitySummary(...args),
  getCommunitySummaries: (...args) => mockGetCommunitySummaries(...args),
  backfillCommunitySummaries: (...args) => mockBackfillCommunitySummaries(...args)
}));

function makeAuthoredRimeDraft(overrides = {}) {
  const baseDraft = {
    name: 'Rime Tether',
    description: 'Deals frost damage and binds enemy movement.',
    level: 1,
    spellType: 'ACTION',
    resolution: 'DICE',
    effectTypes: ['damage', 'control'],
    effectsMap: { damage: true, control: true },
    typeConfig: {
      school: 'rime',
      icon: 'Frost/Dripping Ice',
      castTimeType: 'IMMEDIATE',
      tags: ['attack']
    },
    damageConfig: {
      damageType: 'direct',
      formula: '1d6+2',
      elementType: 'rime',
      damageTypes: ['rime'],
      resolution: 'DICE'
    },
    controlConfig: {
      authoredCondition: {
        profile: 'authored-effect:v1',
        effect: 'movement',
        label: 'Frostbind',
        movementFeet: -10,
        expiryPolicy: 'target-next-end',
        durationText: "Until the end of the target's next turn",
        gmNote: 'GM confirms direct damage and Frostbind movement slow.'
      }
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['enemy'],
      maxTargets: 1,
      selectionMethod: 'manual',
      targetSelectionMethod: 'manual',
      aoeShape: 'circle',
      aoeType: 'sphere',
      aoeParameters: {},
      movementBehavior: 'static'
    },
    resourceCost: {
      actionPoints: 1,
      actionPointsSelected: true,
      mana: 2,
      components: [],
      resourceTypes: ['mana', 'actionPoints'],
      resourceValues: { mana: 2, actionPoints: 1 },
      resourceFormulas: {},
      useFormulas: { mana: false, actionPoints: false }
    },
    cooldownConfig: {
      cooldownType: 'none',
      cooldownValue: 0
    },
    durationConfig: { durationType: 'instant' },
    ...overrides
  };

  return {
    id: 'local-rime-1',
    name: baseDraft.name,
    description: baseDraft.description,
    icon: 'Frost/Dripping Ice',
    level: baseDraft.level,
    spellType: baseDraft.spellType,
    resolution: baseDraft.resolution,
    effectTypes: baseDraft.effectTypes,
    effectsMap: baseDraft.effectsMap,
    typeConfig: baseDraft.typeConfig,
    damageConfig: baseDraft.damageConfig,
    controlConfig: baseDraft.controlConfig,
    targetingConfig: baseDraft.targetingConfig,
    resourceCost: baseDraft.resourceCost,
    cooldownConfig: baseDraft.cooldownConfig,
    durationConfig: baseDraft.durationConfig,
    authoredDefinitionId: '11111111-1111-4111-8111-111111111111',
    authoredDraft: baseDraft,
    serializedData: JSON.stringify(baseDraft),
    dateCreated: '2026-11-21T10:00:00.000Z',
    lastModified: '2026-11-21T10:00:00.000Z',
    source: 'wizard'
  };
}

describe('Community spell transfer contract', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDoc.mockImplementation((_db, ...segments) => ({
      __path: segments.join('/'),
      id: segments[segments.length - 1]
    }));
    mockCollection.mockImplementation((_db, ...segments) => ({
      __collection: segments.join('/')
    }));
    mockQuery.mockImplementation((colRef, ...constraints) => ({
      __query: colRef?.__collection || '',
      constraints
    }));
    mockWhere.mockImplementation((field, op, value) => ({ field, op, value }));
    mockOrderBy.mockImplementation((field, dir) => ({ field, dir }));
    mockLimit.mockImplementation(n => ({ limit: n }));
    mockSetDoc.mockResolvedValue(undefined);
    mockUpdateDoc.mockResolvedValue(undefined);
    mockDeleteDoc.mockResolvedValue(undefined);
    mockIncrement.mockImplementation(n => ({ __increment: n }));
    mockArrayUnion.mockImplementation((...args) => ({ __arrayUnion: args }));
    mockArrayRemove.mockImplementation((...args) => ({ __arrayRemove: args }));
    mockServerTimestamp.mockReturnValue({ __serverTimestamp: true });
    mockShareEntityImages.mockImplementation(async (_uid, entity) => ({ ...entity }));
    mockUpsertCommunitySummary.mockResolvedValue(undefined);
    mockGetCommunitySummaries.mockResolvedValue({ summaries: [], lastDoc: null, hasMore: false });
    mockGetDocs.mockResolvedValue({ size: 0, docs: [], forEach: () => {} });
    mockGetCountFromServer.mockResolvedValue({ data: () => ({ count: 0 }) });
    mockGetDoc.mockImplementation(async (ref) => {
      if (ref.__path.startsWith('users/')) {
        return { exists: () => true, id: ref.id, data: () => ({ storageUsage: { spells: 0 } }) };
      }
      return { exists: () => false, id: ref.id, data: () => undefined };
    });
  });

  test('buildDownloadedLibrarySpell strips community metadata, normalizes Timestamps, and compiles cleanly via definitionFromWizard', () => {
    const sourceRecord = makeAuthoredRimeDraft();
    const communityDoc = {
      ...sourceRecord,
      id: 'community-doc-42',
      authorId: 'acct-a',
      isPublic: true,
      isFeatured: false,
      rating: 4,
      ratingCount: 1,
      downloadCount: 3,
      upvotes: 2,
      downvotes: 0,
      originalUserId: 'acct-a',
      originalSpellId: 'local-rime-1',
      originalId: 'stale-orig',
      sharedSpellId: 'community-doc-42',
      sharedAt: { toDate: () => new Date('2026-11-21T11:00:00.000Z') },
      rarity: 'rare',
      categoryId: 'cat-1',
      userId: 'acct-a',
      isShared: true,
      folderId: 'folder-1',
      author: 'Author One',
      authorName: 'Author One',
      createdAt: { seconds: 1795260000, nanoseconds: 0 },
      updatedAt: { toDate: () => new Date('2026-11-21T11:05:00.000Z') }
    };

    const localCopy = buildDownloadedLibrarySpell(communityDoc, 'community-doc-42', '2026-11-21T12:00:00.000Z');

    expect(localCopy.id).toMatch(/^community-community-doc-42-/);
    expect(localCopy.source).toBe('community');
    expect(localCopy.isCustom).toBe(true);
    expect(localCopy.isShared).toBe(false);
    expect(localCopy.icon).toBe('Frost/Dripping Ice');
    expect(localCopy.authoredDefinitionId).toBe(sourceRecord.authoredDefinitionId);
    expect(typeof localCopy.createdAt).toBe('string');
    expect(typeof localCopy.updatedAt).toBe('string');

    for (const forbidden of [
      'authorId', 'isPublic', 'isFeatured', 'rating', 'ratingCount', 'downloadCount',
      'upvotes', 'downvotes', 'originalUserId', 'originalSpellId', 'originalId',
      'sharedSpellId', 'sharedAt', 'rarity', 'categoryId', 'userId', 'folderId',
      'author', 'authorName'
    ]) {
      expect(Object.prototype.hasOwnProperty.call(localCopy, forbidden)).toBe(false);
    }

    const compiled = definitionFromWizard(localCopy, {
      roomId: 'room-1',
      classId: 'arcanoneer',
      definitionVersion: 1
    });
    expect(compiled).toEqual(expect.objectContaining({ ok: true }));
    expect(compiled.definition.effects.condition).toEqual(
      expect.objectContaining({ kind: 'movement', label: 'Frostbind', feet: -10 })
    );

    const updatedDraft = {
      ...localCopy.authoredDraft,
      name: 'Rime Tether (Glacial Grip)',
      controlConfig: {
        authoredCondition: {
          ...localCopy.authoredDraft.controlConfig.authoredCondition,
          label: 'Glacial Grip',
          movementFeet: -15,
          expiryPolicy: 'target-end-count',
          occurrences: 2,
          durationText: 'For 2 target turn ends'
        }
      }
    };
    const editedCopy = {
      ...localCopy,
      name: updatedDraft.name,
      controlConfig: updatedDraft.controlConfig,
      authoredDraft: updatedDraft,
      serializedData: JSON.stringify(updatedDraft)
    };
    const compiledV2 = definitionFromWizard(editedCopy, {
      roomId: 'room-1',
      classId: 'arcanoneer',
      definitionVersion: 2
    });
    expect(compiledV2).toEqual(expect.objectContaining({ ok: true }));
    expect(compiledV2.definition.definitionId).toBe(compiled.definition.definitionId);
    expect(compiledV2.definition.definitionVersion).toBe(2);
    expect(communityDoc.name).toBe('Rime Tether');
    expect(communityDoc.authoredDraft.controlConfig.authoredCondition.label).toBe('Frostbind');
  });

  test('saveUserSpell survives permission-denied on non-existent getDoc and never writes customSpells or lastModified', async () => {
    const spell = makeAuthoredRimeDraft();
    mockGetDoc.mockImplementation(async (ref) => {
      if (ref.__path.startsWith('user_spells/')) {
        const err = new Error('Null value error on missing resource');
        err.code = 'permission-denied';
        throw err;
      }
      if (ref.__path.startsWith('users/')) {
        return { exists: () => true, id: ref.id, data: () => ({ storageUsage: { spells: 0 } }) };
      }
      return { exists: () => false, id: ref.id, data: () => undefined };
    });

    const result = await saveUserSpell('acct-a', spell);
    expect(result).toEqual({ success: true, spellId: 'local-rime-1', localOnly: false });

    const spellWrite = mockSetDoc.mock.calls.find(([ref]) => ref.__path === 'user_spells/local-rime-1');
    expect(spellWrite).toBeTruthy();

    const userWrites = [
      ...mockSetDoc.mock.calls.filter(([ref]) => ref.__path === 'users/acct-a'),
      ...mockUpdateDoc.mock.calls.filter(([ref]) => ref.__path === 'users/acct-a')
    ];
    for (const [, payload] of userWrites) {
      expect(payload).not.toHaveProperty('customSpells');
      expect(payload).not.toHaveProperty('lastModified');
    }
    expect(userWrites.some(([, payload]) => Object.prototype.hasOwnProperty.call(payload, 'updatedAt'))).toBe(true);
  });

  test('shareSpellToCommunity preserves built-in relative icons and clears user id before uploadSpell', async () => {
    const storedSpell = {
      ...makeAuthoredRimeDraft(),
      id: 'local-rime-1',
      userId: 'acct-a',
      folderId: 'f-1',
      isCustom: true
    };
    mockGetDoc.mockImplementation(async (ref) => {
      if (ref.__path === 'user_spells/local-rime-1') {
        return { exists: () => true, id: 'local-rime-1', data: () => storedSpell };
      }
      return { exists: () => false, id: ref.id, data: () => undefined };
    });
    mockAddDoc.mockResolvedValueOnce({ id: 'firestore-comm-99' });

    const shared = await shareSpellToCommunity('acct-a', 'local-rime-1');
    expect(shared).toEqual({ success: true, sharedSpellId: 'firestore-comm-99' });
    expect(mockShareEntityImages).not.toHaveBeenCalled();

    const [, uploadedPayload] = mockAddDoc.mock.calls[0];
    expect(uploadedPayload).not.toHaveProperty('id');
    expect(uploadedPayload).not.toHaveProperty('userId');
    expect(uploadedPayload.icon).toBe('Frost/Dripping Ice');
    expect(uploadedPayload.authorId).toBe('acct-a');
    expect(uploadedPayload.isPublic).toBe(true);
    expect(mockUpsertCommunitySummary).toHaveBeenCalledWith(
      'spell',
      'firestore-comm-99',
      expect.objectContaining({ id: 'firestore-comm-99', icon: 'Frost/Dripping Ice' })
    );
  });

  test('communitySpellService preserves Firestore doc.id even when stored data has a stale id field', async () => {
    mockAddDoc.mockResolvedValueOnce({ id: 'doc-real-123' });
    const uploaded = await uploadSpell({ id: 'stale-local-id', name: 'Rime Tether', school: 'rime' }, 'acct-a');
    expect(uploaded.id).toBe('doc-real-123');
    expect(mockAddDoc.mock.calls[0][1]).not.toHaveProperty('id');

    const staleDoc = {
      id: 'doc-real-123',
      data: () => ({ id: 'stale-local-id', name: 'Rime Tether', isPublic: true, school: 'rime', rating: 0 })
    };
    mockGetDocs.mockResolvedValue({ docs: [staleDoc] });
    mockGetDoc.mockResolvedValue({ exists: () => true, id: 'doc-real-123', data: staleDoc.data });

    const all = await getAllCommunitySpells();
    expect(all.spells[0].id).toBe('doc-real-123');

    const searched = await searchSpells('Rime');
    expect(searched[0].id).toBe('doc-real-123');

    const downloaded = await downloadSpell('doc-real-123');
    expect(downloaded.id).toBe('doc-real-123');
  });
});
