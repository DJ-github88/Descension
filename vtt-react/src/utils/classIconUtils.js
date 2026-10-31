import { CLASS_DISPLAY_DATA } from '../data/classes/classDisplayData';

const normalize = (value) => String(value || '').trim().toLowerCase().replace(/[-_\s]+/g, ' ');

/**
 * Canonical class icon path for a class name, or null when unknown.
 * @param {string} className - e.g. "Crusader", "False Prophet", "chaos-weaver", "false_prophet"
 */
export const getClassIconUrl = (className, options = {}) => {
    if (!className) return null;
    const entry = CLASS_DISPLAY_DATA.find(c => normalize(c.name) === normalize(className));
    if (!entry?.imageIcon) return null;
    if (options.variant === 'transparent') {
        return entry.imageIcon.replace('/classes/', '/classes/transparent/');
    }
    return entry.imageIcon;
};

/**
 * True when the class has a transparent pixel-art portrait under
 * /assets/icons/classes/transparent/. Kept in sync with the authored assets.
 */
const PIXEL_ART_BASENAMES = new Set([
    'animist', 'apex', 'arcanoneer', 'augur', 'berserker', 'chronarch',
    'crusader', 'false_prophet', 'gambit', 'harbinger', 'inquisitor',
    'lunarch', 'martyr', 'minstrel', 'plaguebringer', 'pyrofiend',
    'revenant', 'shaper', 'spellguard', 'toxicologist', 'warden'
]);

export const hasClassPixelArt = (className) => {
    const url = getClassIconUrl(className);
    if (!url) return false;
    const base = url.substring(url.lastIndexOf('/') + 1).replace(/\.png$/i, '').toLowerCase();
    return PIXEL_ART_BASENAMES.has(base);
};

/**
 * Portrait-option id for a class icon (e.g. "classes/lunarch"). This id is
 * stored in lore.characterIcon and resolved by getCustomIconUrl().
 */
export const getClassPortraitId = (className) => {
    const url = getClassIconUrl(className);
    if (!url) return null;
    const base = url.substring(url.lastIndexOf('/') + 1).replace(/\.png$/i, '');
    return `classes/${base}`;
};

/** Registered class icons as Portrait Workshop options. */
export const CLASS_PORTRAIT_ICONS = CLASS_DISPLAY_DATA
    .map(c => ({ id: getClassPortraitId(c.name), name: c.name, folder: 'Classes' }))
    .filter(icon => Boolean(icon.id));
