import {
  safeLocalStorageItem,
  safeLocalStorageGet,
  safeLocalStorageRemove,
  createStorageConfig,
  memoryFallbackStore,
  isQuotaExceededError
} from '../storageUtils';

describe('storageUtils', () => {
  beforeEach(() => {
    localStorage.clear();
    memoryFallbackStore.clear();
    jest.restoreAllMocks();
  });

  describe('isQuotaExceededError', () => {
    it('identifies QuotaExceededError correctly', () => {
      const error1 = new Error('QuotaExceededError');
      error1.name = 'QuotaExceededError';
      expect(isQuotaExceededError(error1)).toBe(true);

      const error2 = new Error('The quota has been exceeded');
      expect(isQuotaExceededError(error2)).toBe(true);

      const error3 = { code: 22, name: 'NS_ERROR_DOM_QUOTA_REACHED' };
      expect(isQuotaExceededError(error3)).toBe(true);

      const normalError = new Error('Some other error');
      expect(isQuotaExceededError(normalError)).toBe(false);
    });
  });

  describe('safeLocalStorageItem & safeLocalStorageGet', () => {
    it('stores and retrieves data successfully when localStorage is working', () => {
      const result = safeLocalStorageItem('test-key', JSON.stringify({ hello: 'world' }));
      expect(result.success).toBe(true);
      expect(result.isFallback).toBeUndefined();

      const stored = safeLocalStorageGet('test-key');
      expect(JSON.parse(stored)).toEqual({ hello: 'world' });
    });

    it('falls back to in-memory store when localStorage throws QuotaExceededError and never throws', () => {
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        const error = new Error('Setting the value exceeded the quota.');
        error.name = 'QuotaExceededError';
        throw error;
      });

      const result = safeLocalStorageItem('test-quota-key', JSON.stringify({ item: 'sword' }));
      expect(result.success).toBe(true);
      expect(result.isFallback).toBe(true);

      // Verify that retrieval still works from memory fallback
      const retrieved = safeLocalStorageGet('test-quota-key');
      expect(JSON.parse(retrieved)).toEqual({ item: 'sword' });
    });

    it('removes item from both localStorage and memory fallback', () => {
      memoryFallbackStore.set('test-remove-key', 'memory-val');
      localStorage.setItem('test-remove-key', 'local-val');

      safeLocalStorageRemove('test-remove-key');
      expect(safeLocalStorageGet('test-remove-key')).toBeNull();
      expect(memoryFallbackStore.has('test-remove-key')).toBe(false);
    });
  });

  describe('createStorageConfig', () => {
    it('provides getItem, setItem, and removeItem conforming to Zustand persist', () => {
      const config = createStorageConfig('inventory-test');
      expect(config.name).toBe('inventory-test');
      expect(typeof config.storage.getItem).toBe('function');
      expect(typeof config.storage.setItem).toBe('function');
      expect(typeof config.storage.removeItem).toBe('function');

      // Test setItem
      config.storage.setItem('inventory-test', { state: { items: [{ id: '1', name: 'Potion' }] }, version: 1 });

      // Test getItem
      const stored = config.storage.getItem('inventory-test');
      expect(stored).toEqual({ state: { items: [{ id: '1', name: 'Potion' }] }, version: 1 });

      // Test removeItem
      config.storage.removeItem('inventory-test');
      expect(config.storage.getItem('inventory-test')).toBeNull();
    });

    it('handles QuotaExceededError in Zustand setItem gracefully without throwing', () => {
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        const error = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      });

      const config = createStorageConfig('inventory-test');
      expect(() => {
        config.storage.setItem('inventory-test', { state: { items: [{ id: '1' }] } });
      }).not.toThrow();

      const stored = config.storage.getItem('inventory-test');
      expect(stored).toEqual({ state: { items: [{ id: '1' }] } });
    });
  });
});
