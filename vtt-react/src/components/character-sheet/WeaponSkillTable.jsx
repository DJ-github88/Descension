import React, { useState, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { resolveWeaponSkillInfo } from '../../utils/weaponSkillLookup';
import { getIconUrl } from '../../utils/assetManager';
import './WeaponSkillTable.css';

/**
 * WeaponSkillTable
 * 
 * Shared presentation component for weapon skill mappings, rank proficiency,
 * dice distinctions, and the 1-20 outcome/stunt tables.
 * 
 * Reused across:
 * 1. Character Sheet MH/OH equipment slot tooltips.
 * 2. In-Game Action Bar MH/OH bubble fans (beside UnifiedSpellCard).
 */
export default function WeaponSkillTable({
    item,
    slotName = 'mainHand',
    skillRanks = {},
    skillProgress = {},
    isPinned = false,
    onTogglePin,
    onClose,
    embedded = false,
    className = ''
}) {
    const [filter, setFilter] = useState('all'); // 'all' | 'base' | 'stunts'
    const bodyRef = useRef(null);

    // Floating companions dismiss locally before Navigation's global Escape-to-exit shortcut.
    // Embedded tables leave dismissal to their character sheet.
    useEffect(() => {
        if (embedded || !onClose) return undefined;
        const handleEscape = (event) => {
            if (event.key !== 'Escape') return;
            event.preventDefault();
            event.stopImmediatePropagation();
            onClose();
        };
        window.addEventListener('keydown', handleEscape, true);
        return () => window.removeEventListener('keydown', handleEscape, true);
    }, [embedded, onClose]);

    const info = useMemo(() => {
        return resolveWeaponSkillInfo(item, { skillRanks, skillProgress, slotName });
    }, [item, skillRanks, skillProgress, slotName]);

    // Filter table entries based on selected tab
    const filteredEntries = useMemo(() => {
        if (!info.tableEntries || info.tableEntries.length === 0) return [];
        if (filter === 'base') {
            return info.tableEntries.filter(e => e.isBaseDieReachable);
        }
        if (filter === 'stunts') {
            return info.tableEntries.filter(e => !e.isBaseDieReachable);
        }
        return info.tableEntries;
    }, [info.tableEntries, filter]);

    // Bring the character's own rank rows into view when the table opens or the weapon changes.
    const currentRankKey = info.rank?.key;
    useEffect(() => {
        const body = bodyRef.current;
        const row = body && body.querySelector('[data-current-rank="true"]');
        if (row && typeof row.scrollIntoView === 'function') {
            row.scrollIntoView({ block: 'nearest' });
        }
    }, [currentRankKey, info.weaponType, filter]);

    // Handle unavailable state honestly (shield, focus, unmapped, empty)
    if (info.status !== 'available') {
        const isShield = info.status === 'shield';
        const isFocus = info.status === 'focus';
        const isEmpty = info.status === 'empty';

        return (
            <div className={`weapon-skill-table-container ${embedded ? 'embedded' : ''} ${className}`} data-testid="weapon-skill-table-unavailable">
                <div className="wst-header">
                    <div className="wst-header-left">
                        <div className="wst-title-block">
                            <span className="wst-item-name">{info.itemName || info.slotLabel}</span>
                            <div className="wst-pills-row">
                                <span className="wst-pill slot-pill">{info.slotLabel}</span>
                                {isShield && <span className="wst-pill">Shield</span>}
                                {isFocus && <span className="wst-pill">Focus</span>}
                                {isEmpty && <span className="wst-pill">Empty</span>}
                            </div>
                        </div>
                    </div>
                    {(onTogglePin || onClose) && (
                        <div className="wst-header-actions">
                            {onTogglePin && (
                                <button
                                    type="button"
                                    className={`wst-action-btn ${isPinned ? 'pinned' : ''}`}
                                    onClick={onTogglePin}
                                    title={isPinned ? 'Unpin table' : 'Pin table open'}
                                    aria-label="Pin weapon table"
                                >
                                    <i className="fas fa-thumbtack"></i>
                                </button>
                            )}
                            {onClose && (
                                <button
                                    type="button"
                                    className="wst-action-btn"
                                    onClick={onClose}
                                    title="Close"
                                    aria-label="Close weapon table"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="wst-unavailable-card">
                    <i className={`wst-unavailable-icon ${isShield ? 'fas fa-shield-halved' : isFocus ? 'fas fa-wand-sparkles' : isEmpty ? 'fas fa-hand' : 'fas fa-circle-question'}`}></i>
                    <div className="wst-unavailable-title">
                        {isShield ? 'Defensive Equipment (Shield)' : isFocus ? 'Spellcasting Focus' : isEmpty ? 'Empty Equipment Slot' : 'Weapon Table Unavailable'}
                    </div>
                    <div className="wst-unavailable-desc">
                        {info.reason}
                    </div>
                    {info.blockingDice && (
                        <div className="wst-unavailable-stats" data-testid="equipment-blocking-dice">
                            Equipment Blocking: {info.blockingDice}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const {
        itemName,
        slotLabel,
        weaponMeta,
        canonicalSkill,
        rank,
        skillDie,
        skillDieSize,
        damageDice,
        blockingDice
    } = info;

    const itemIconSrc = item?.icon ? getIconUrl(item.icon, 'items')
        : item?.iconId ? getIconUrl(item.iconId, 'items')
        : (weaponMeta?.icon || getIconUrl('Armor/Neck/magical-sword-pendant', 'items'));

    return (
        <div className={`weapon-skill-table-container ${embedded ? 'embedded' : ''} ${className}`} data-testid="weapon-skill-table">
            {/* Header */}
            <div className="wst-header">
                <div className="wst-header-left">
                    <img src={itemIconSrc} alt={itemName} className="wst-item-icon" />
                    <div className="wst-title-block">
                        <span className="wst-item-name" title={itemName}>{itemName}</span>
                        <div className="wst-pills-row">
                            <span className="wst-pill slot-pill" data-testid="weapon-slot-pill">{slotLabel}</span>
                            <span className="wst-pill skill-pill" data-testid="weapon-skill-pill">{canonicalSkill}</span>
                            <span
                                className="wst-pill rank-pill"
                                data-testid="weapon-rank-pill"
                            >
                                {rank?.name} ({skillDie})
                            </span>
                        </div>
                    </div>
                </div>

                {(onTogglePin || onClose) && (
                    <div className="wst-header-actions">
                        {onTogglePin && (
                            <button
                                type="button"
                                className={`wst-action-btn ${isPinned ? 'pinned' : ''}`}
                                onClick={onTogglePin}
                                title={isPinned ? 'Unpin table' : 'Pin table open'}
                                aria-label="Pin weapon table"
                                data-testid="weapon-pin-btn"
                            >
                                <i className="fas fa-thumbtack"></i>
                            </button>
                        )}
                        {onClose && (
                            <button
                                type="button"
                                className="wst-action-btn"
                                onClick={onClose}
                                title="Close"
                                aria-label="Close weapon table"
                                data-testid="weapon-close-btn"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Distinct Dice Breakdown Bar: Weapon Skill Die vs Damage Die vs Blocking Die */}
            <div className="wst-dice-bar" data-testid="wst-dice-bar">
                <div className="wst-die-card skill-die-card" title="Weapon Skill / Proficiency Die: rolled for martial stunts on this 1–20 table">
                    <span className="wst-die-label">Skill Die</span>
                    <span className="wst-die-value" data-testid="wst-skill-die">{skillDie}</span>
                </div>
                <div className="wst-die-card damage-die-card" title="Weapon Damage: base damage dealt on hit">
                    <span className="wst-die-label">Damage</span>
                    <span className="wst-die-value" data-testid="wst-damage-die">{damageDice || '1d4'}</span>
                </div>
                <div className="wst-die-card blocking-die-card" title="Equipment Blocking: guard and armor damage mitigation">
                    <span className="wst-die-label">Block / DR</span>
                    <span className="wst-die-value" data-testid="wst-blocking-die">{blockingDice || 'None'}</span>
                </div>
            </div>

            {/* Rank reachability notice */}
            <div className="wst-reach-notice">
                <span>
                    Rank <strong>{rank?.name}</strong>: Base die <strong>{skillDie}</strong>
                </span>
                <span className="wst-reach-badge">
                    Base Faces 1–{skillDieSize}
                </span>
            </div>

            <div className="wst-rank-note" data-testid="wst-rank-note">
                Each row lists the rank it is filed under; highlighted rows are filed under your rank.
                The faces you can roll follow your skill die ({skillDie}), shown on each row.
            </div>

            {/* Filter Pills */}
            <div className="wst-filters">
                <button
                    type="button"
                    className={`wst-filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All (1–20)
                </button>
                <button
                    type="button"
                    className={`wst-filter-btn ${filter === 'base' ? 'active' : ''}`}
                    onClick={() => setFilter('base')}
                >
                    Base Die (1–{skillDieSize})
                </button>
                <button
                    type="button"
                    className={`wst-filter-btn ${filter === 'stunts' ? 'active' : ''}`}
                    onClick={() => setFilter('stunts')}
                >
                    Surge / Mods ({skillDieSize < 20 ? `${skillDieSize + 1}–20` : 'None'})
                </button>
            </div>

            {/* Table Rows */}
            <div
                className="wst-body"
                ref={bodyRef}
                role="list"
                tabIndex={0}
                aria-label={`${weaponMeta?.label || 'Weapon'} stunt table, ${rank?.name} rank highlighted`}
            >
                {filteredEntries.map(entry => {
                    const isBase = entry.isBaseDieReachable;

                    return (
                        <div
                            key={entry.face}
                            className={`wst-row ${isBase ? 'in-base-range' : 'out-of-base-range'} ${entry.isCurrentRank ? 'current-rank' : ''}`}
                            role="listitem"
                            aria-current={entry.isCurrentRank ? 'true' : undefined}
                            data-current-rank={entry.isCurrentRank ? 'true' : undefined}
                            data-testid={`wst-row-${entry.face}`}
                        >
                            <div className="wst-row-top">
                                <div className="wst-row-title-group">
                                    <span className={`wst-face-badge tone-${entry.tone}`}>
                                        {entry.face}
                                    </span>
                                    <span className="wst-row-tier-name">{entry.name}</span>
                                    <span className="wst-row-delta">{entry.delta}</span>
                                    {entry.rankReqName && (
                                        <span className="wst-row-rank" data-testid={`wst-row-rank-${entry.face}`}>
                                            {entry.isCurrentRank ? `Rank: ${entry.rankReqName} (your rank)` : `Rank: ${entry.rankReqName}`}
                                        </span>
                                    )}
                                </div>
                                <span className={`wst-row-reach-tag ${isBase ? 'base-tag' : 'surge-tag'}`}>
                                    {isBase ? `Base ${skillDie}` : 'Surge / Mod'}
                                </span>
                            </div>
                            <div className="wst-row-text">
                                {entry.text}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

WeaponSkillTable.propTypes = {
    item: PropTypes.object,
    slotName: PropTypes.string,
    skillRanks: PropTypes.object,
    skillProgress: PropTypes.object,
    isPinned: PropTypes.bool,
    onTogglePin: PropTypes.func,
    onClose: PropTypes.func,
    embedded: PropTypes.bool,
    className: PropTypes.string
};
