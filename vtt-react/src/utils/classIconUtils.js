import { CLASS_DISPLAY_DATA } from '../data/classes/classDisplayData';

const normalize = (value) => String(value || '').trim().toLowerCase();

/**
 * Canonical class icon path for a class name, or null when unknown.
 * @param {string} className - e.g. "Crusader", "False Prophet"
 */
export const getClassIconUrl = (className) => {
    if (!className) return null;
    const entry = CLASS_DISPLAY_DATA.find(c => normalize(c.name) === normalize(className));
    return entry?.imageIcon || null;
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

/** All 21 class icons as Portrait Workshop options. */
export const CLASS_PORTRAIT_ICONS = CLASS_DISPLAY_DATA
    .map(c => ({ id: getClassPortraitId(c.name), name: c.name, folder: 'Classes' }))
    .filter(icon => Boolean(icon.id));
