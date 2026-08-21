import {
  IMAGE_PROFILES,
  getProfile,
  calculateScaledDimensions,
  processImage
} from '../imageProcessor';

describe('imageProcessor', () => {
  describe('Profile Resolution', () => {
    it('should return correct default profile if unknown profile is provided', () => {
      const profile = getProfile('UNKNOWN_PROFILE');
      expect(profile.maxWidth).toBe(1920);
      expect(profile.maxHeight).toBe(1920);
      expect(profile.mimeType).toBe('image/webp');
    });

    it('should resolve TOKEN profile (512x512, webp)', () => {
      const profile = getProfile('TOKEN');
      expect(profile.maxWidth).toBe(512);
      expect(profile.maxHeight).toBe(512);
      expect(profile.quality).toBeCloseTo(0.82);
      expect(profile.mimeType).toBe('image/webp');
    });

    it('should resolve PORTRAIT profile (1024x1024, webp)', () => {
      const profile = getProfile('portrait');
      expect(profile.maxWidth).toBe(1024);
      expect(profile.maxHeight).toBe(1024);
      expect(profile.quality).toBeCloseTo(0.85);
      expect(profile.mimeType).toBe('image/webp');
    });

    it('should resolve BATTLEMAP profile (4096x4096, webp)', () => {
      const profile = getProfile('BATTLEMAP');
      expect(profile.maxWidth).toBe(4096);
      expect(profile.maxHeight).toBe(4096);
      expect(profile.quality).toBeCloseTo(0.78);
      expect(profile.mimeType).toBe('image/webp');
    });
  });

  describe('calculateScaledDimensions', () => {
    it('should not scale down images smaller than maxWidth/maxHeight', () => {
      const dims = calculateScaledDimensions(300, 200, 512, 512);
      expect(dims).toEqual({ width: 300, height: 200 });
    });

    it('should scale down wide image maintaining aspect ratio', () => {
      const dims = calculateScaledDimensions(2000, 1000, 1000, 1000);
      expect(dims).toEqual({ width: 1000, height: 500 });
    });

    it('should scale down tall image maintaining aspect ratio', () => {
      const dims = calculateScaledDimensions(1000, 2000, 1000, 1000);
      expect(dims).toEqual({ width: 500, height: 1000 });
    });

    it('should handle large battlemaps down to 4096', () => {
      const dims = calculateScaledDimensions(8000, 6000, 4096, 4096);
      expect(dims.width).toBe(4096);
      expect(dims.height).toBe(3072);
    });
  });
});
