import { createUserScope, guestScope } from '../scopeModel';
import { buildScopedKey, isP5ScopedKey, isLegacyKey } from '../keyFormat';
import { createDraftEnvelope } from '../draftEnvelope';
import { readScopedRecord, readRawRecord, READ_STATUS } from '../safeRead';
import { writeScopedRecord, WRITE_STATUS } from '../safeWrite';
import {
  activatePrivateScope,
  resetBootstrapGateForTests
} from '../bootstrapPrivacyGate';
import {
  classifyLegacyRecord,
  classifyIndexedDbCustomMapRecord,
  LEGACY_OWNERSHIP
} from '../legacyClassification';
import { getFamily, SUBREGION_MAPS_INDEXEDDB } from '../privateStorageRegistry';

const FAMILY = 'campaign.collection';

const makeEnvelope = (scope, payload = { campaigns: [{ id: 'c1' }] }) =>
  createDraftEnvelope({ scope, draftId: 'draft_test', payload });

describe('P5 Slice 1 — safe read contract', () => {
  beforeEach(() => {
    localStorage.clear();
    resetBootstrapGateForTests();
  });

  it('S1-07 read states stay distinct: MISSING / PRESENT_VALID / MALFORMED / UNSUPPORTED / WRONG_SCOPE / STORAGE_ERROR', () => {
    const userA = createUserScope('user-a');
    const userB = createUserScope('user-b');
    activatePrivateScope(userA);

    // MISSING
    expect(readScopedRecord({ familyId: FAMILY, scope: userA }).status).toBe(READ_STATUS.MISSING);

    // PRESENT_VALID
    const write = writeScopedRecord({ familyId: FAMILY, scope: userA, value: makeEnvelope(userA) });
    expect(write.status).toBe(WRITE_STATUS.OK);
    const valid = readScopedRecord({ familyId: FAMILY, scope: userA });
    expect(valid.status).toBe(READ_STATUS.PRESENT_VALID);
    expect(valid.value.payload).toEqual({ campaigns: [{ id: 'c1' }] });

    // MALFORMED (raw string preserved on the result)
    const malformedKey = buildScopedKey({ scope: userA, familyId: FAMILY });
    localStorage.setItem(malformedKey, '{not-json');
    const malformed = readScopedRecord({ familyId: FAMILY, scope: userA });
    expect(malformed.status).toBe(READ_STATUS.MALFORMED);
    expect(malformed.raw).toBe('{not-json');

    // UNSUPPORTED_VERSION
    localStorage.setItem(
      malformedKey,
      JSON.stringify({ ...makeEnvelope(userA), schemaVersion: 999 })
    );
    expect(readScopedRecord({ familyId: FAMILY, scope: userA }).status).toBe(
      READ_STATUS.UNSUPPORTED_VERSION
    );

    // WRONG_SCOPE: a stored envelope whose owner scope does not match the
    // expected read scope.
    localStorage.setItem(malformedKey, JSON.stringify(makeEnvelope(userB)));
    expect(
      readRawRecord({ rawKey: malformedKey, familyId: FAMILY, expectedScope: userA }).status
    ).toBe(READ_STATUS.WRONG_SCOPE);

    // STORAGE_ERROR
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage exploded');
    });
    const errored = readScopedRecord({ familyId: FAMILY, scope: userA });
    spy.mockRestore();
    expect(errored.status).toBe(READ_STATUS.STORAGE_ERROR);
  });

  it('S1-08 malformed data is never converted, rewritten or deleted by a read', () => {
    const userA = createUserScope('user-a');
    activatePrivateScope(userA);
    const key = buildScopedKey({ scope: userA, familyId: FAMILY });
    const badRaw = '{"scopeKind":"user"';
    localStorage.setItem(key, badRaw);

    const removeSpy = jest.spyOn(Storage.prototype, 'removeItem');
    const result = readScopedRecord({ familyId: FAMILY, scope: userA });
    removeSpy.mockRestore();

    expect(result.status).toBe(READ_STATUS.MALFORMED);
    expect(localStorage.getItem(key)).toBe(badRaw);
    expect(removeSpy).not.toHaveBeenCalled();
  });

  it('S1-13 guest vs user separation and cross-user scope refusal', () => {
    const userA = createUserScope('user-a');
    const userB = createUserScope('user-b');
    const guest = guestScope();

    // Guest record cannot be read through a user scope: different scoped key.
    activatePrivateScope(guest);
    expect(
      writeScopedRecord({ familyId: FAMILY, scope: guest, value: makeEnvelope(guest) }).status
    ).toBe(WRITE_STATUS.OK);
    resetBootstrapGateForTests();
    activatePrivateScope(userA);
    expect(readScopedRecord({ familyId: FAMILY, scope: userA }).status).toBe(READ_STATUS.MISSING);
    expect(readScopedRecord({ familyId: FAMILY, scope: userB }).status).toBe(READ_STATUS.MISSING);

    // A guest envelope stored under a user-scoped key is refused as WRONG_SCOPE.
    const userAKey = buildScopedKey({ scope: userA, familyId: FAMILY });
    localStorage.setItem(userAKey, JSON.stringify(makeEnvelope(guest)));
    expect(readScopedRecord({ familyId: FAMILY, scope: userA }).status).toBe(READ_STATUS.WRONG_SCOPE);

    // User A's record read with user B expectation is WRONG_SCOPE, not B's data.
    localStorage.setItem(userAKey, JSON.stringify(makeEnvelope(userA)));
    expect(
      readRawRecord({ rawKey: userAKey, familyId: FAMILY, expectedScope: userB }).status
    ).toBe(READ_STATUS.WRONG_SCOPE);
    expect(
      readRawRecord({ rawKey: userAKey, familyId: FAMILY, expectedScope: userA }).status
    ).toBe(READ_STATUS.PRESENT_VALID);
  });

  it('S1-13b scoped key format is deterministic and collision-safe vs legacy keys', () => {
    const userA = createUserScope('user-a');
    const key = buildScopedKey({ scope: userA, familyId: FAMILY, locator: ['one', 'two 2'] });
    expect(isP5ScopedKey(key)).toBe(true);
    expect(key).toBe('mythrill:p5:user:user-a:campaign.collection:one:two%202');
    expect(buildScopedKey({ scope: userA, familyId: FAMILY, locator: [1] })).toBe(
      'mythrill:p5:user:user-a:campaign.collection:1'
    );
    expect(isLegacyKey('mythrill-campaigns')).toBe(true);
    expect(key.startsWith('mythrill:p5:')).toBe(true);
  });
});

describe('P5 Slice 1 — safe write foundation', () => {
  beforeEach(() => {
    localStorage.clear();
    resetBootstrapGateForTests();
  });

  it('S1-09 serialization/storage failure retains the previous valid record', () => {
    const userA = createUserScope('user-a');
    activatePrivateScope(userA);

    const first = makeEnvelope(userA, { campaigns: [{ id: 'first' }] });
    expect(writeScopedRecord({ familyId: FAMILY, scope: userA, value: first }).status).toBe(
      WRITE_STATUS.OK
    );
    const key = buildScopedKey({ scope: userA, familyId: FAMILY });

    // Storage failure mid-write: previous value must survive.
    const setItemSpy = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementationOnce(() => {
        throw new Error('QuotaExceededError');
      });
    const failed = writeScopedRecord({
      familyId: FAMILY,
      scope: userA,
      value: makeEnvelope(userA, { campaigns: [{ id: 'second' }] })
    });
    setItemSpy.mockRestore();
    expect(failed.status).toBe(WRITE_STATUS.STORAGE_ERROR);
    expect(failed.persisted).toBe(false);
    expect(readScopedRecord({ familyId: FAMILY, scope: userA }).value.payload).toEqual({
      campaigns: [{ id: 'first' }]
    });

    // Serialization failure: prior record must still survive.
    const circularPayload = {};
    circularPayload.self = circularPayload;
    const circularEnvelope = createDraftEnvelope({
      scope: userA,
      draftId: 'draft_circular',
      payload: circularPayload
    });
    const serialization = writeScopedRecord({
      familyId: FAMILY,
      scope: userA,
      value: circularEnvelope
    });
    expect(serialization.status).toBe(WRITE_STATUS.SERIALIZATION_FAILED);
    expect(serialization.persisted).toBe(false);
    expect(localStorage.getItem(key)).toContain('first');
  });

  it('S1-09b context refusal: gate and explicit context must match the write scope', () => {
    const userA = createUserScope('user-a');
    const userB = createUserScope('user-b');

    // Gate not active for the scope -> CONTEXT_REFUSED, nothing written.
    const refused = writeScopedRecord({
      familyId: FAMILY,
      scope: userA,
      value: makeEnvelope(userA)
    });
    expect(refused.status).toBe(WRITE_STATUS.CONTEXT_REFUSED);
    expect(localStorage.length).toBe(0);

    activatePrivateScope(userA);

    // Explicit context for a different scope is refused even while another
    // scope is active.
    const wrongContext = {
      scope: userB,
      phase: 'active',
      accountGeneration: 1,
      documentInstanceId: null
    };
    const refusedContext = writeScopedRecord({
      familyId: FAMILY,
      scope: userA,
      value: makeEnvelope(userA),
      context: wrongContext
    });
    expect(refusedContext.status).toBe(WRITE_STATUS.CONTEXT_REFUSED);

    // Matching explicit context is accepted.
    const goodContext = {
      scope: userA,
      phase: 'active',
      accountGeneration: 1,
      documentInstanceId: null
    };
    const accepted = writeScopedRecord({
      familyId: FAMILY,
      scope: userA,
      value: makeEnvelope(userA),
      context: goodContext
    });
    expect(accepted.status).toBe(WRITE_STATUS.OK);
    expect(accepted.persisted).toBe(true);
  });
});

describe('P5 Slice 1 — legacy ownership classification', () => {
  beforeEach(() => {
    localStorage.clear();
    resetBootstrapGateForTests();
  });

  it('S1-11 last-account markers and embedded IDs never prove ownership', () => {
    const rawCampaigns = JSON.stringify([{ id: 'campaign_1', name: 'Legacy' }]);

    const withoutMarkers = classifyLegacyRecord({ key: 'mythrill-campaigns', rawValue: rawCampaigns });
    const withMarkers = classifyLegacyRecord({
      key: 'mythrill-campaigns',
      rawValue: rawCampaigns,
      markers: { accountType: 'authenticated', userId: 'user-a' }
    });
    expect(withoutMarkers.ownership).toBe(LEGACY_OWNERSHIP.UNKNOWN);
    expect(withMarkers.ownership).toBe(LEGACY_OWNERSHIP.UNKNOWN);
    expect(withMarkers).toEqual(withoutMarkers);
    expect(withoutMarkers.familyId).toBe('campaign.collection');
    expect(withoutMarkers.recoverable).toBe(true);

    // Malformed JSON stays INVALID and recoverable (raw must be preserved).
    expect(
      classifyLegacyRecord({ key: 'mythrill-campaigns', rawValue: '{broken' }).ownership
    ).toBe(LEGACY_OWNERSHIP.INVALID);

    // A recognized verification receipt is the only path to PROVEN.
    const proven = classifyLegacyRecord({
      key: 'mythrill-campaigns',
      rawValue: rawCampaigns,
      verification: {
        kind: 'verified-recovery-receipt',
        receiptId: 'receipt-1',
        scopeKind: 'user',
        scopeId: 'user-a'
      }
    });
    expect(proven.ownership).toBe(LEGACY_OWNERSHIP.PROVEN);
    expect(proven.scopeId).toBe('user-a');

    // Public allowlisted data is not a draft at all.
    expect(
      classifyLegacyRecord({ key: 'creature-library-version', rawValue: '5' }).ownership
    ).toBe(LEGACY_OWNERSHIP.NOT_DRAFT);
  });

  it('S1-15 IndexedDB custom maps are preserved recovery sources, never verified drafts', () => {
    const family = getFamily('map.subregionCache');
    expect(family).not.toBeNull();
    expect(family.storage).toBe('indexedDB+localStorage');
    expect(family.migration).toBe('quarantine-only');
    expect(SUBREGION_MAPS_INDEXEDDB.database).toBe('mythrill_maps_db');
    expect(SUBREGION_MAPS_INDEXEDDB.store).toBe('custom_subregion_maps');

    const unknown = classifyIndexedDbCustomMapRecord({ id: 'map-1', image: 'data:image/png;base64,x' });
    expect(unknown.ownership).toBe(LEGACY_OWNERSHIP.UNKNOWN);
    expect(unknown.sourceClass).toBe('existing-authored-recovery-source');
    expect(unknown.trustedAsCurrentAccountDraft).toBe(false);
    expect(unknown.preserved).toBe(true);

    const proven = classifyIndexedDbCustomMapRecord(
      { id: 'map-1' },
      {
        verification: {
          kind: 'verified-recovery-receipt',
          receiptId: 'receipt-2',
          scopeKind: 'user',
          scopeId: 'user-a'
        }
      }
    );
    expect(proven.ownership).toBe(LEGACY_OWNERSHIP.PROVEN);
  });
});
