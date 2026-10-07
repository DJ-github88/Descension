import storageLimitService, { STORAGE_LIMITS } from '../storageLimitService';

describe('storageLimitService (pure helpers)', () => {
  describe('estimateDataSize', () => {
    it('matches the JSON byte size', () => {
      const data = { a: 1, b: 'hello', list: [1, 2, 3] };
      expect(storageLimitService.estimateDataSize(data)).toBe(new Blob([JSON.stringify(data)]).size);
    });

    it('grows with larger payloads', () => {
      const small = storageLimitService.estimateDataSize({ a: 1 });
      const big = storageLimitService.estimateDataSize({ a: 'x'.repeat(500) });
      expect(big).toBeGreaterThan(small);
    });
  });

  describe('formatBytes', () => {
    it('formats byte magnitudes', () => {
      expect(storageLimitService.formatBytes(0)).toBe('0 Bytes');
      expect(storageLimitService.formatBytes(1024)).toBe('1 KB');
      expect(storageLimitService.formatBytes(1024 * 1024)).toBe('1 MB');
      expect(storageLimitService.formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
    });
  });

  describe('STORAGE_LIMITS', () => {
    it('defines limits for the known tiers', () => {
      expect(STORAGE_LIMITS.FREE).toBeTruthy();
      expect(STORAGE_LIMITS.PRO).toBeTruthy();
      expect(STORAGE_LIMITS.ULTIMATE).toBeTruthy();
    });
  });
});
