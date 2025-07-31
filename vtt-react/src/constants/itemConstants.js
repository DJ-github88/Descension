export const RARITY_COLORS = {
    poor: {
        border: '#8b7355',
        text: '#a08c70',
        glow: 'rgba(139, 115, 85, 0.3)',
        orbColor: 'rgba(139, 115, 85, 0.7)'
    },
    common: {
        border: '#a08c70',
        text: '#c4b896',
        glow: 'rgba(160, 140, 112, 0.3)',
        orbColor: 'rgba(160, 140, 112, 0.7)'
    },
    uncommon: {
        border: '#b8860b',
        text: '#daa520',
        glow: 'rgba(184, 134, 11, 0.3)',
        orbColor: 'rgba(184, 134, 11, 0.7)'
    },
    rare: {
        border: '#cd853f',
        text: '#deb887',
        glow: 'rgba(205, 133, 63, 0.3)',
        orbColor: 'rgba(205, 133, 63, 0.7)'
    },
    epic: {
        border: '#8b4513',
        text: '#a0522d',
        glow: 'rgba(139, 69, 19, 0.3)',
        orbColor: 'rgba(139, 69, 19, 0.7)'
    },
    legendary: {
        border: '#ffd700',
        text: '#ffed4e',
        glow: 'rgba(255, 215, 0, 0.4)',
        orbColor: 'rgba(255, 215, 0, 0.7)'
    },
    artifact: {
        border: '#e6cc80',
        text: '#f0e6d2',
        glow: 'rgba(230, 204, 128, 0.4)',
        orbColor: 'rgba(230, 204, 128, 0.7)'
    }
};

export const ELEMENT_COLORS = {
    fire: '#ff4400',
    cold: '#3399ff',
    lightning: '#ffff00',
    acid: '#00ff00',
    force: '#ff66ff',
    necrotic: '#660066',
    radiant: '#ffff99',
    poison: '#00ff00',
    psychic: '#ff00ff',
    thunder: '#0066ff'
};

export const TOOLTIP_COLORS = {
    equipment: '#4a9eff',
    buff: '#4eff4e',
    debuff: '#ff4e4e',
    header: '#ffd700',
    text: '#ffffff'
};

export const SKILL_LEVELS = {
    0: { name: 'Untrained', color: '#9d9d9d' },
    1: { name: 'Novice', color: '#ffffff' },
    2: { name: 'Apprentice', color: '#1eff00' },
    3: { name: 'Adept', color: '#0070dd' },
    4: { name: 'Expert', color: '#a335ee' },
    5: { name: 'Master', color: '#ff8000' }
};

/**
 * Helper function to get quality color based on item rarity
 * @param {string} quality - The quality/rarity of the item
 * @returns {string} - The color code for the specified quality
 */
export const getQualityColor = (quality) => {
    // Check for null or undefined and provide a default
    const qualityLower = quality?.toLowerCase() || 'common';
    return RARITY_COLORS[qualityLower]?.text || RARITY_COLORS.common.text;
};

export const STAT_LABELS = {
    str: 'Strength',
    agi: 'Agility',
    con: 'Constitution',
    int: 'Intellect',
    spir: 'Spirit',
    cha: 'Charisma',
    damage: 'Melee Damage',
    rangedDamage: 'Ranged Damage',
    spellDamage: 'Spell Damage',
    healingPower: 'Healing Power',
    critChance: 'Crit Chance',
    armor: 'Armor',
    healthRegen: 'Health Regeneration',
    manaRegen: 'Mana Regeneration',
    increaseMaxHealth: 'Increase Max Health',
    increaseMaxMana: 'Increase Max Mana',
    moveSpeed: 'Movement Speed',
    carryingCapacity: 'Encumbrance',
    restoreHealth: 'Health Restore',
    restoreMana: 'Mana Restore'
};
