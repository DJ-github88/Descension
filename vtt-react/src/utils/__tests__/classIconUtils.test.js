import { getClassIconUrl, getClassPortraitId, CLASS_PORTRAIT_ICONS } from '../classIconUtils';
import { getCustomIconUrl } from '../assetManager';

describe('classIconUtils', () => {
    it('resolves the canonical class icon path by class name', () => {
        expect(getClassIconUrl('Lunarch')).toBe('/assets/icons/classes/lunarch.png');
        expect(getClassIconUrl('False Prophet')).toBe('/assets/icons/classes/false_prophet.png');
        expect(getClassIconUrl('Crusader')).toBe('/assets/icons/classes/crusader.png');
        expect(getClassIconUrl('lunarch')).toBe('/assets/icons/classes/lunarch.png');
    });

    it('returns null for unknown or missing class names', () => {
        expect(getClassIconUrl('Hunter')).toBeNull();
        expect(getClassIconUrl('')).toBeNull();
        expect(getClassIconUrl(null)).toBeNull();
    });

    it('builds portrait option ids under the classes/ namespace', () => {
        expect(getClassPortraitId('Crusader')).toBe('classes/crusader');
        expect(getClassPortraitId('False Prophet')).toBe('classes/false_prophet');
        expect(getClassPortraitId('Hunter')).toBeNull();
    });

    it('exposes all 21 classes as portrait options', () => {
        expect(CLASS_PORTRAIT_ICONS).toHaveLength(21);
        CLASS_PORTRAIT_ICONS.forEach(icon => {
            expect(icon.id.startsWith('classes/')).toBe(true);
            expect(icon.folder).toBe('Classes');
            expect(typeof icon.name).toBe('string');
        });
    });

    it('resolves classes/ portrait ids through getCustomIconUrl regardless of category', () => {
        expect(getCustomIconUrl('classes/lunarch', 'creatures')).toBe('/assets/icons/classes/lunarch.png');
        expect(getCustomIconUrl('classes/false_prophet', 'items')).toBe('/assets/icons/classes/false_prophet.png');
        expect(getCustomIconUrl('Human/Icon1', 'creatures')).toBe('/assets/icons/creatures/Human/Icon1.png');
    });

    it('passes through already-resolved system asset paths', () => {
        expect(getCustomIconUrl('/assets/icons/classes/crusader.png', 'creatures'))
            .toBe('/assets/icons/classes/crusader.png');
    });
});
