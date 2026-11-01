/**
 * weaponSkillLookup.js
 * 
 * Authoritative weapon-skill and weapon-table resolution utility.
 * Reuses existing definitions from weaponTypeMeta, weaponTypeSimpleTables,
 * weaponProficiency, and skillDefinitions.
 * 
 * Pure functions only. No combat dice resolution or persistence mutation.
 */

import { WEAPON_TYPE_META } from '../constants/weaponTypeMeta';
import {
    WEAPON_SIMPLE_TABLE_MAP,
    WEAPON_TYPE_TIERS,
    WEAPON_TYPE_SIMPLE_TABLES,
    getWeaponArchetype
} from '../constants/weaponTypeSimpleTables';
import {
    resolveWeaponRank,
    WEAPON_MASTERY_SKILL_ID
} from './weaponProficiency';
import { SKILL_RANKS } from '../constants/skillDefinitions';
import { getWeaponDisciplineKey } from '../data/weaponActionSpells';

export const DIE_SIZE_MAP = Object.freeze({
    UNTRAINED: 4,
    NOVICE: 6,
    TRAINED: 8,
    APPRENTICE: 10,
    ADEPT: 12,
    EXPERT: 20,
    MASTER: 20
});

/**
 * Format weapon damage dice and damage type into a clean human string.
 * Distinguishes weapon damage from weapon skill dice.
 */
export function formatDamageDice(item) {
    if (!item) return null;
    const baseDamage = item.weaponStats?.baseDamage || item.baseDamage;
    if (!baseDamage) {
        if (typeof item.damage === 'string') return item.damage;
        return null;
    }

    if (baseDamage.display?.base) {
        const typeStr = baseDamage.damageType ? ` ${capitalize(baseDamage.damageType)}` : '';
        return `${baseDamage.display.base}${typeStr}`;
    }

    const count = baseDamage.diceCount || 1;
    const rawType = String(baseDamage.diceType || 4).replace(/^d+/i, '');
    const typeStr = baseDamage.damageType ? ` ${capitalize(baseDamage.damageType)}` : '';
    const bonus = baseDamage.bonusDamage > 0 ? ` +${baseDamage.bonusDamage}` : '';
    return `${count}d${rawType}${bonus}${typeStr}`;
}

/**
 * Format equipment blocking dice / rating.
 * Distinguishes equipment blocking dice from weapon damage and skill dice.
 */
export function formatBlockingDice(item) {
    if (!item) return null;
    if (item.blockingDice) return String(item.blockingDice);
    if (item.stats?.blockingDice) return String(item.stats.blockingDice);
    if (item.combatStats?.blockingDice) return String(item.combatStats.blockingDice);
    if (item.stats?.blockRating) return `${item.stats.blockRating} Block`;
    if (item.combatStats?.block) return `${item.combatStats.block} Block`;
    if (item.armorRating || item.armor) return `${item.armorRating || item.armor} Armor`;
    return null;
}

function capitalize(str) {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Resolve comprehensive weapon-skill info and table for any equipped item.
 * 
 * @param {Object|null} item - The equipped item (from equipment.mainHand, offHand, etc.)
 * @param {Object} [options]
 * @param {Object} [options.skillRanks] - Character's skillRanks store
 * @param {Object} [options.skillProgress] - Character's skillProgress store
 * @param {string} [options.slotName] - 'mainHand' | 'offHand' | 'ranged'
 * @returns {Object} Structured weapon skill details, rank, dice breakdown, and 1-20 table
 */
export function resolveWeaponSkillInfo(item, { skillRanks = {}, skillProgress = {}, slotName = 'mainHand' } = {}) {
    const slotLabel = slotName === 'mainHand' ? 'Main Hand' : slotName === 'offHand' ? 'Off Hand' : 'Ranged';

    // 1. Empty slot
    if (!item) {
        return {
            hasItem: false,
            status: 'empty',
            slotName,
            slotLabel,
            itemName: null,
            reason: `No item equipped in ${slotLabel}.`,
            canonicalSkill: 'Weapon Mastery',
            rank: null,
            skillDie: null,
            skillDieSize: null,
            damageDice: null,
            blockingDice: null,
            table: null,
            tableEntries: []
        };
    }

    const itemName = item.name || 'Equipped Item';
    const subtypeLower = (item.subtype || '').toLowerCase().trim();
    const nameLower = (item.name || '').toLowerCase().trim();

    // 2. Shield (Off-Hand defense)
    const isShield = subtypeLower.includes('shield') || subtypeLower.includes('buckler') ||
                     nameLower.includes('shield') || nameLower.includes('buckler');
    if (isShield) {
        const blockingDice = formatBlockingDice(item);
        return {
            hasItem: true,
            isShield: true,
            status: 'shield',
            slotName,
            slotLabel,
            itemName,
            item,
            blockingDice,
            reason: 'Shields provide defensive equipment guard and blocking dice, not weapon skill attack tables.',
            canonicalSkill: null,
            rank: null,
            skillDie: null,
            skillDieSize: null,
            damageDice: null,
            table: null,
            tableEntries: []
        };
    }

    // 3. Off-hand focus items (idol, tome, sphere, totem)
    const isFocus = subtypeLower.includes('idol') || subtypeLower.includes('fetish') ||
                    subtypeLower.includes('tome') || subtypeLower.includes('book') ||
                    subtypeLower.includes('codex') || subtypeLower.includes('grimoire') ||
                    subtypeLower.includes('sphere') || subtypeLower.includes('orb') ||
                    subtypeLower.includes('totem') || subtypeLower.includes('effigy');
    if (isFocus) {
        return {
            hasItem: true,
            isFocus: true,
            status: 'focus',
            slotName,
            slotLabel,
            itemName,
            item,
            reason: 'Off-hand foci channel magical energy and spell power, not martial weapon skill tables.',
            canonicalSkill: null,
            rank: null,
            skillDie: null,
            skillDieSize: null,
            damageDice: null,
            blockingDice: null,
            table: null,
            tableEntries: []
        };
    }

    // 4. Resolve weapon discipline key
    const weaponType = getWeaponDisciplineKey(item);
    const weaponMeta = WEAPON_TYPE_META[weaponType] || null;
    const archetype = getWeaponArchetype(weaponType);

    // Check if archetype exists in flavor tables
    const table = WEAPON_TYPE_SIMPLE_TABLES[archetype] || (weaponType ? WEAPON_TYPE_SIMPLE_TABLES[weaponType] : null);

    if (!table) {
        return {
            hasItem: true,
            status: 'unmapped',
            slotName,
            slotLabel,
            itemName,
            item,
            weaponType,
            archetype,
            reason: `No canonical weapon skill table defined for weapon type "${weaponType || 'unknown'}".`,
            canonicalSkill: weaponMeta?.label ? `Weapon Mastery: ${weaponMeta.label}` : 'Weapon Mastery',
            rank: null,
            skillDie: null,
            skillDieSize: null,
            damageDice: formatDamageDice(item),
            blockingDice: formatBlockingDice(item),
            table: null,
            tableEntries: []
        };
    }

    // 5. Resolve character proficiency rank for this specific weapon type
    const resolvedRank = resolveWeaponRank({ skillRanks, skillProgress, weaponType });
    const rankKey = resolvedRank?.key || 'UNTRAINED';
    const rankMeta = SKILL_RANKS[rankKey] || SKILL_RANKS.UNTRAINED;
    const skillDieSize = DIE_SIZE_MAP[rankKey] || 4;
    const skillDie = `d${skillDieSize}`;

    const damageDice = formatDamageDice(item);
    const blockingDice = formatBlockingDice(item);

    // 6. Build the 1-20 table entries
    const tableEntries = [];
    for (let face = 1; face <= 20; face++) {
        const tier = WEAPON_TYPE_TIERS[face] || { name: `Face ${face}`, delta: '+0', tone: 'base', blurb: '' };
        const text = table[face] || tier.blurb || '';
        const isBaseDieReachable = face <= skillDieSize;

        tableEntries.push({
            face,
            name: tier.name,
            delta: tier.delta,
            tone: tier.tone,
            blurb: tier.blurb,
            text,
            isBaseDieReachable,
            rankReq: tier.rankReq,
            dieReq: tier.dieReq
        });
    }

    return {
        hasItem: true,
        status: 'available',
        slotName,
        slotLabel,
        itemName,
        item,
        weaponType,
        weaponMeta: weaponMeta || { label: capitalize(weaponType), hint: '', icon: null },
        archetype,
        canonicalSkill: `Weapon Mastery: ${weaponMeta?.label || capitalize(weaponType)}`,
        rank: {
            key: rankKey,
            name: rankMeta.name,
            color: rankMeta.color,
            source: resolvedRank?.source || 'default',
            statBonus: rankMeta.statBonus ?? 0
        },
        skillDie,
        skillDieSize,
        damageDice,
        blockingDice,
        table,
        tableEntries
    };
}
