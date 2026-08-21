import uploadService, {
  UPLOAD_CATEGORIES,
  isSystemAsset,
  getSystemAssetUrl,
  extractStoragePath,
  generateAssetId
} from '../uploadService';

describe('uploadService', () => {
  describe('Asset Category & System Asset Routing', () => {
    it('should identify system assets correctly', () => {
      expect(isSystemAsset('/assets/icons/spells/fireball.png')).toBe(true);
      expect(isSystemAsset('/system-assets/maps/dungeon_base.webp')).toBe(true);
      expect(isSystemAsset('https://firebasestorage.googleapis.com/v0/b/mythrill.appspot.com/o/users%2F123%2Fportraits%2Fhero.webp')).toBe(false);
      expect(isSystemAsset('data:image/webp;base64,...')).toBe(false);
    });

    it('should generate system asset paths properly', () => {
      const url = getSystemAssetUrl('icons', 'spells/fireball.webp');
      expect(url).toBe('/assets/icons/spells/fireball.webp');
    });

    it('should generate unique non-colliding UUIDs', () => {
      const id1 = generateAssetId();
      const id2 = generateAssetId();
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toEqual(id2);
    });
  });

  describe('extractStoragePath', () => {
    it('should extract storage path from Firebase download URL', () => {
      const url = 'https://firebasestorage.googleapis.com/v0/b/bucket-name.appspot.com/o/users%2Fuser123%2Fportraits%2Fhero_abc.webp?alt=media&token=12345';
      const path = extractStoragePath(url);
      expect(path).toBe('users/user123/portraits/hero_abc.webp');
    });

    it('should return null for data URLs and system assets', () => {
      expect(extractStoragePath('data:image/webp;base64,12345')).toBeNull();
      expect(extractStoragePath('/assets/icons/spells/fire.webp')).toBeNull();
    });

    it('should accept direct storage paths', () => {
      expect(extractStoragePath('users/user123/tokens/token_1.webp')).toBe('users/user123/tokens/token_1.webp');
    });
  });
});
