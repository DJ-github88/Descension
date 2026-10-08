import {
  performGenericCleanup,
  removeDisposableKey,
  collectDisposableKeys,
  CLEANUP_REMOVAL_STATUS
} from '../cleanupAdapter';
import {
  classifyStorageKey,
  isProtectedStorageKey,
  readDurable,
  writeDurable,
  DURABLE_STATUS
} from '../protectedStorage';

function seed(entries) {
  Object.entries(entries).forEach(([key, value]) => {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  });
}

describe('Wave A S2 — protected storage and cleanup rewiring', () => {
  beforeEach(() => localStorage.clear());

  it('WA-01 generic cleanup cannot delete authored/recoverable/quarantine/fork data', () => {
    const protectedEntries = {
      'mythrill-campaigns': '[{"id":"campaign_1"}]',
      'mythrill-backup-char-1-123': '{"characterData":{}}',
      'character_draft_abc': '{"draft":true}',
      'mythrill_local_room_state_room_1': '{"tokens":[]}',
      'mythrill-temp-scratch': 'semi-authored',
      'mythrill_map_history_backup': '{"history":1}',
      'mythrill:p5:user:user-a:campaign.collection:fork_1': '{"fork":true}'
    };
    seed(protectedEntries);

    const result = performGenericCleanup({ storage: localStorage });

    expect(result.removed).toEqual([]);
    expect(result.storagePressure).toBe(true);
    for (const key of Object.keys(protectedEntries)) {
      expect(localStorage.getItem(key)).not.toBeNull();
    }
  });

  it('WA-02/WA-24 public rebuildable and session-only caches remain deletable', () => {
    seed({
      'creature-library-version': '7',
      'spell-cache-version': '1.2.0',
      'selectedRoomPassword': 'secret',
      'mythrill-campaigns': '[]'
    });

    const result = performGenericCleanup({ storage: localStorage });

    expect(result.removed.sort()).toEqual(
      ['creature-library-version', 'selectedRoomPassword', 'spell-cache-version'].sort()
    );
    expect(result.storagePressure).toBe(false);
    expect(localStorage.getItem('mythrill-campaigns')).toBe('[]');
  });

  it('WA-03 unknown/unregistered keys are not automatically deleted', () => {
    localStorage.setItem('totally-unknown-key', 'x');
    const result = performGenericCleanup({ storage: localStorage });
    expect(result.removed).toEqual([]);
    expect(localStorage.getItem('totally-unknown-key')).toBe('x');
    expect(removeDisposableKey('totally-unknown-key').status).toBe(CLEANUP_REMOVAL_STATUS.UNREGISTERED);
    expect(collectDisposableKeys(localStorage)).not.toContain('totally-unknown-key');
  });

  it('WA-04 quota pressure with no disposable data returns explicit pressure, never authored deletion', () => {
    seed({
      'mythrill-campaigns': '[]',
      'mythrill-characters': '[]',
      'mythrill_local_rooms': '[]',
      'another-unknown-key': '1'
    });

    const result = performGenericCleanup({ storage: localStorage });

    expect(result.storagePressure).toBe(true);
    expect(result.removed).toEqual([]);
    expect(localStorage.getItem('mythrill-campaigns')).toBe('[]');
    expect(localStorage.getItem('mythrill-characters')).toBe('[]');
    expect(localStorage.getItem('mythrill_local_rooms')).toBe('[]');
    expect(localStorage.getItem('another-unknown-key')).toBe('1');
  });

  it('WA-02b protected-storage adapter classifies keys and preserves prior values on failure', () => {
    expect(classifyStorageKey('mythrill-campaigns')).toMatchObject({
      classification: 'private',
      familyId: 'campaign.collection',
      protected: true,
      cleanupEligible: false
    });
    expect(classifyStorageKey('creature-library-version')).toMatchObject({
      classification: 'global',
      protected: false,
      cleanupEligible: true
    });
    expect(classifyStorageKey('mythrill:p5:user:user-a:campaign.collection')).toMatchObject({
      classification: 'p5-scoped',
      protected: true
    });
    expect(isProtectedStorageKey('character_draft_abc')).toBe(true);

    localStorage.setItem('protected-key', 'old-value');

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new Error('QuotaExceededError');
    });
    const failed = writeDurable('protected-key', 'new-value');
    setItemSpy.mockRestore();

    expect(failed.status).toBe(DURABLE_STATUS.STORAGE_ERROR);
    expect(failed.persisted).toBe(false);
    expect(localStorage.getItem('protected-key')).toBe('old-value');
    expect(readDurable('protected-key').raw).toBe('old-value');

    const circular = {};
    circular.self = circular;
    const serialization = writeDurable('protected-key', circular);
    expect(serialization.status).toBe(DURABLE_STATUS.SERIALIZATION_FAILED);
    expect(serialization.persisted).toBe(false);
    expect(localStorage.getItem('protected-key')).toBe('old-value');
  });
});
