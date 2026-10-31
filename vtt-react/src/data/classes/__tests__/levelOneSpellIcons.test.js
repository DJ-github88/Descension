import fs from 'fs';
import path from 'path';
import { BASE_CLASSES_DATA } from '../index';
import { ALL_CLASS_SPELLS } from '../../classSpellGenerator';
import { LEVEL_ONE_SPELL_ICON_OVERRIDES } from '../levelOneSpellIcons';
import { getSelectableClassNames } from '../classDisplayData';

const assetExists = (icon) => {
    if (!icon || icon.startsWith('fa')) return true;
    if (icon.startsWith('/assets/')) {
        return fs.existsSync(path.join(process.cwd(), 'public', icon));
    }
    return fs.existsSync(path.join(process.cwd(), 'public', 'assets', 'icons', 'abilities', `${icon}.png`));
};

describe('level-1 spell icon assignments', () => {
    const CANONICAL_CLASSES = getSelectableClassNames();

    test('covers approved canonical classes (30 classes)', () => {
        expect(CANONICAL_CLASSES).toHaveLength(30);
    });

    test.each(CANONICAL_CLASSES)('%s has distinct, shipped level-1 spell icons', className => {
        const classData = BASE_CLASSES_DATA[className];
        const pool = new Set(classData.spellPools?.[1] || []);
        const coreIds = new Set(classData.progression?.policy?.grantedCoreSpellIds || []);
        const spells = (ALL_CLASS_SPELLS[className] || [])
            .filter(spell => spell.source !== 'general' && spell.level === 1 && (pool.size === 0 || pool.has(spell.id) || coreIds.has(spell.id)));

        expect(spells.length).toBeGreaterThan(0);
        const icons = spells.map(spell => spell.icon);
        expect(new Set(icons).size).toBe(icons.length);
        icons.forEach(icon => {
            expect(assetExists(icon)).toBe(true);
        });
    });

    test('every override targets an existing ability asset', () => {
        Object.entries(LEVEL_ONE_SPELL_ICON_OVERRIDES).forEach(([spellId, icon]) => {
            expect(spellId).toBeTruthy();
            expect(assetExists(icon)).toBe(true);
        });
    });

    test('legacy compatibility overrides resolve to existing assets', () => {
        ['fate-reading_loom', 'apex_sentry_spirit'].forEach(spellId => {
            const icon = LEVEL_ONE_SPELL_ICON_OVERRIDES[spellId];
            expect(icon).toBeTruthy();
            expect(assetExists(icon)).toBe(true);
        });
    });
});
