import { getClassResourceConfig } from '../data/classResources';

const EMOJI_TO_FA = {
    '💀': 'fas fa-skull',
    '🩸': 'fas fa-tint',
    '⏳': 'fas fa-hourglass-half',
    '⚠️': 'fas fa-triangle-exclamation',
    '⚔️': 'fas fa-khanda',
    '🔮': 'fas fa-crystal-ball',
    '✦': 'fas fa-star-of-life',
    '✧': 'fas fa-star',
};

const isFontAwesomeIcon = (icon) => typeof icon === 'string' && /^fa[bsrl]\s/.test(icon);

export const normalizeResourceIcon = (icon) => {
    if (!icon || typeof icon !== 'string') return null;
    const trimmed = icon.trim();
    if (isFontAwesomeIcon(trimmed)) return trimmed;
    if (trimmed.startsWith('fa-')) return `fas ${trimmed}`;
    if (EMOJI_TO_FA[trimmed]) return EMOJI_TO_FA[trimmed];
    if (/^[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(trimmed)) return null;
    return trimmed;
};

export const renderResourceIcon = (icon, style = {}) => {
    const normalized = normalizeResourceIcon(icon);
    if (!normalized) return null;
    if (isFontAwesomeIcon(normalized)) {
        return { type: 'fa', className: normalized, style };
    }
    return { type: 'text', glyph: normalized, style };
};

export const getClassResourceIcon = (className, section = null) => {
    const config = getClassResourceConfig(className);
    if (!config) return null;
    if (section && config.visual?.[section]) {
        return normalizeResourceIcon(config.visual[section].icon);
    }
    return normalizeResourceIcon(config.visual?.icon);
};
