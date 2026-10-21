/**
 * Ancestral Gifts — Calm TTRPG-styled Racials Panel & Codex Block (Step 1).
 *
 * Implements the World of Warcraft Classic-inspired racials picker tailored
 * specifically for Mythrill's calm, immersive, detailed dark-fantasy aesthetic:
 *  - 1 locked core passive or active spell (Innate Birthright) for the heritage.
 *  - 3 rows of mutually exclusive power pairs (select 1 of 2 per row).
 *  - Detailed TTRPG look: each card showcases its title and concise mechanics summary.
 *  - Selected powers feature antique gold embossed borders, full-color icons, and warm gold typography.
 *  - Unselected powers have a calm weathered plate aesthetic, desaturated icons, and readable muted text.
 *  - Direct 1-click selection with instant visual toggle.
 *  - Atmospheric floating RPG spell tooltip on hover displaying full mechanics, range, AP, and ancestral rules.
 *  - Antiqued crimson-and-brass RPG button with flavorful tip note.
 */
import React, { useMemo, useState, useRef, useLayoutEffect, useEffect } from 'react';
import { getResolvedAncestryLoadout, validateAncestry } from '../../../data/ancestryLoadouts';
import { getRaceData, getSubraceData } from '../../../data/raceData';
import UnifiedSpellCard from '../../spellcrafting-wizard/components/common/UnifiedSpellCard';
import '../styles/AncestralGifts.css';

const GIFT_QUICK_MECHANICS = {
    // Ithran Groven
    ithran_vat_knit_flesh: 'Passive \u00B7 End of turn: recover 1 HP (halted by ember)',
    ithran_span_reach: 'Passive \u00B7 +10 ft speed, ignores rough stone terrain',
    ithran_chasm_leap: 'Action \u00B7 1 AP \u00B7 15 ft leap across gaps or ledges',
    toll_keepers_eye: 'Passive \u00B7 Assess tolls, coin authenticity & weight balance',
    bone_reading_ithran: 'Passive \u00B7 Divine hidden hazards & echoes in bone and stone',
    fiber_cord_snare_ithran: 'Action \u00B7 1 AP \u00B7 Snare & tether target within 15 ft',
    ithran_overhang_strike: 'Action \u00B7 1 AP \u00B7 Drop attack from above (+1 die step)',

    // Morgh Groven
    morgh_slow_knit_stone: 'Passive \u00B7 If stationary: recover 1 HP (halted by ember)',
    morgh_stone_scales: 'Passive \u00B7 +1 Durability, 25% physical damage resistance',
    bridge_wardens_wall: 'Action \u00B7 1 AP \u00B7 Unyielding stone defensive barrier',
    ancestors_burden_morgh: 'Passive \u00B7 Immovable mass & increased carrying capacity',
    morgh_load_bearer: 'Reaction \u00B7 1/Rest \u00B7 Prevent ally forced move or fall',
    chain_drive_morgh: 'Passive \u00B7 Chain anchor against physical displacement',
    morgh_bedrock_slam: 'Action \u00B7 2 AP \u00B7 1/Rest \u00B7 Knock down all foes in 5 ft',
};

function getGiftMechanicHint(gift) {
    if (!gift) return '';
    if (GIFT_QUICK_MECHANICS[gift.id]) return GIFT_QUICK_MECHANICS[gift.id];
    const type = gift.spellType === 'PASSIVE' ? 'Passive' : (gift.spellType === 'REACTION' ? 'Reaction' : `${gift.resourceCost?.actionPoints || 1} AP`);
    const school = gift.typeConfig?.school ? ` \u00B7 ${gift.typeConfig.school}` : '';
    const desc = gift.description || '';
    const firstSentence = desc.split(/[.;!]/)[0] || desc;
    const shortDesc = firstSentence.length > 46 ? `${firstSentence.slice(0, 44)}...` : firstSentence;
    return `${type}${school} \u00B7 ${shortDesc}`;
}

const GiftIcon = ({ gift, getIconUrl }) => {
    const icon = gift?.icon;
    if (typeof icon === 'string' && (icon.startsWith('fa-') || icon.startsWith('fas ') || icon.startsWith('far ') || icon.startsWith('fab '))) {
        return (
            <div className="ancestral-icon-box">
                <i className={icon} aria-hidden="true"></i>
            </div>
        );
    }
    const resolvedUrl = getIconUrl ? getIconUrl(icon) : (icon || '');
    return (
        <div className="ancestral-icon-box">
            <img
                src={resolvedUrl}
                alt={gift?.name || ''}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    if (e.target.parentNode) {
                        e.target.parentNode.innerHTML = '<i class="fas fa-sparkles" aria-hidden="true" style="color: #c59f56; font-size: 16px;"></i>';
                    }
                }}
            />
        </div>
    );
};

export function AncestralGiftsDrawer({ raceId, subraceId, ancestry, sealed = false, onPick, onClose, getIconUrl }) {
    const loadout = useMemo(() => getResolvedAncestryLoadout(raceId, subraceId), [raceId, subraceId]);
    const check = validateAncestry(subraceId, ancestry);
    const picks = (ancestry && ancestry.heritageId === subraceId && ancestry.picks) || {};

    const subraceData = useMemo(() => (raceId && subraceId ? getSubraceData(raceId, subraceId) : null), [raceId, subraceId]);
    const raceData = useMemo(() => (raceId ? getRaceData(raceId) : null), [raceId]);

    const fixedTraits = useMemo(() => {
        if (loadout || !raceId || !subraceId) return [];
        const specificTraits = Array.isArray(subraceData?.traits) ? subraceData.traits : Object.values(subraceData?.traits || {});
        const shared = Array.isArray(raceData?.sharedTraits) ? raceData.sharedTraits : [];
        return [...shared, ...specificTraits].filter(Boolean);
    }, [loadout, raceId, subraceId, subraceData, raceData]);

    const coreGift = loadout ? loadout.core : (fixedTraits.length > 0 ? fixedTraits[0] : null);
    const canonicalRemaining = loadout ? [] : fixedTraits.slice(1);

    // Hover tooltip state & layout measurement refs
    const [hoveredGift, setHoveredGift] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
    const [hoveredMeta, setHoveredMeta] = useState({ isSelected: false, isCore: false, rowLabel: '' });
    const tooltipRef = useRef(null);
    const tooltipScrollRef = useRef(null);
    const targetRectRef = useRef(null);
    const closeTimeoutRef = useRef(null);

    const cancelCloseTimer = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    };

    const scheduleClose = () => {
        cancelCloseTimer();
        closeTimeoutRef.current = setTimeout(() => {
            setHoveredGift(null);
        }, 120);
    };

    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    const clampAndSetPosition = (targetRect) => {
        if (!targetRect) return;
        const tooltipEl = tooltipRef.current;
        const tooltipWidth = (tooltipEl && tooltipEl.offsetWidth) || 460;
        const tooltipHeight = (tooltipEl && tooltipEl.offsetHeight) || 460;
        const padding = 12;

        let left = targetRect.right + padding;
        if (left + tooltipWidth > window.innerWidth - padding) {
            left = targetRect.left - tooltipWidth - padding;
        }
        left = Math.max(padding, Math.min(window.innerWidth - tooltipWidth - padding, left));

        let top = targetRect.top;
        if (top + tooltipHeight > window.innerHeight - padding) {
            top = window.innerHeight - tooltipHeight - padding;
        }
        if (top < padding) {
            top = padding;
        }

        setTooltipPos({ top: Math.round(top), left: Math.round(left) });
    };

    useLayoutEffect(() => {
        if (hoveredGift && targetRectRef.current) {
            clampAndSetPosition(targetRectRef.current);
        }
    }, [hoveredGift]);

    const handleMouseEnter = (e, gift, isSelected, isCore, rowLabel = '') => {
        cancelCloseTimer();
        if (!gift) return;
        const rect = e.currentTarget.getBoundingClientRect();
        targetRectRef.current = rect;
        clampAndSetPosition(rect);
        setHoveredGift(gift);
        setHoveredMeta({ isSelected, isCore, rowLabel });
    };

    const handleMouseLeave = () => {
        scheduleClose();
    };

    const handleTooltipMouseEnter = () => {
        cancelCloseTimer();
    };

    const handleTooltipMouseLeave = () => {
        scheduleClose();
    };

    const handleCardWheel = (e) => {
        if (tooltipScrollRef.current) {
            tooltipScrollRef.current.scrollTop += e.deltaY;
            e.preventDefault();
        }
    };

    if (!loadout && fixedTraits.length === 0) return null;

    const total = loadout?.rows?.length || 0;
    const titleName = subraceData?.name || raceData?.name || 'Heritage';

    const handlePick = (rowId, giftId) => {
        if (sealed) return;
        if (onPick) {
            onPick(rowId, giftId);
        }
    };

    return (
        <div className="ancestral-modal-overlay" onClick={onClose}>
            <div
                className="ancestral-racials-panel"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-label="Ancestral Gifts"
                data-testid="ancestral-gifts-dialog"
            >
                {/* Header */}
                <div className="ancestral-panel-header">
                    <button
                        type="button"
                        className="ancestral-modal-close drawer-close-btn"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <i className="fas fa-times" aria-hidden="true"></i>
                    </button>
                    <div className="ancestral-header-ornament">
                        <i className="fas fa-diamond" aria-hidden="true" style={{ fontSize: '9px', color: '#c59f56' }}></i>
                    </div>
                    <h2 className="ancestral-racials-title">{titleName} Racials</h2>
                    <p className="ancestral-racials-subtitle">
                        {loadout ? 'Choose one power per row.' : 'Innate powers granted by bloodline and homeland.'}
                    </p>
                </div>

                <div className="ancestral-panel-content">
                    {/* INNATE BIRTHRIGHT (1 Locked Passive or Active Spell) */}
                    {coreGift && (
                        <div className="ancestral-locked-section">
                            <div className="ancestral-section-header">
                                <span className="ancestral-section-title">
                                    <i className="fas fa-shield-alt"></i> Innate Birthright
                                </span>
                                <span className="ancestral-locked-badge">
                                    <i className="fas fa-lock"></i> Locked {coreGift.spellType === 'ACTION' ? 'Active' : 'Passive'}
                                </span>
                            </div>
                            <div
                                className="ancestral-power-card locked-birthright selected"
                                onMouseEnter={(e) => handleMouseEnter(e, coreGift, true, true)}
                                onMouseLeave={handleMouseLeave}
                                onWheel={handleCardWheel}
                                data-gift={coreGift.id}
                            >
                                <GiftIcon gift={coreGift} getIconUrl={getIconUrl} />
                                <div className="ancestral-power-info">
                                    <span className="ancestral-power-name">{coreGift.name}</span>
                                    <span className="ancestral-power-subtext">{getGiftMechanicHint(coreGift)}</span>
                                </div>
                                <div className="ancestral-gold-lock">
                                    <i className="fas fa-lock" title="Innate heritage power - always granted"></i>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3 CHOICE ROWS (Select 1 of 2 on 3 rows) */}
                    {loadout ? (
                        <div className="ancestral-rows-container">
                            <div className="ancestral-section-header">
                                <span className="ancestral-section-title">
                                    <i className="fas fa-gem"></i> Ancestral Gifts
                                </span>
                                <span className="ancestral-choice-count">
                                    {check.chosen} of {total} chosen
                                </span>
                            </div>

                            {loadout.rows.map((row, idx) => {
                                const rowPickedId = picks[row.id];
                                return (
                                    <div key={row.id} className="ancestral-choice-row" data-row={row.id}>
                                        <div className="ancestral-row-label-bar">
                                            <span className="ancestral-row-name">Row {idx + 1} &middot; {row.label}</span>
                                            {!rowPickedId && <span className="ancestral-row-alert">Choose one</span>}
                                        </div>
                                        <div className="ancestral-options-pair">
                                            {row.options.map((opt) => {
                                                if (!opt) return null;
                                                const isSelected = rowPickedId === opt.id;
                                                return (
                                                    <button
                                                        key={opt.id}
                                                        type="button"
                                                        className={`ancestral-power-card choice-option ${isSelected ? 'selected' : 'unselected'}`}
                                                        onClick={() => handlePick(row.id, opt.id)}
                                                        onMouseEnter={(e) => handleMouseEnter(e, opt, isSelected, false, row.label)}
                                                        onMouseLeave={handleMouseLeave}
                                                        onWheel={handleCardWheel}
                                                        disabled={sealed}
                                                        data-gift={opt.id}
                                                        aria-label={isSelected ? `Chosen for ${row.label}: ${opt.name}` : `Choose for ${row.label}: ${opt.name}`}
                                                    >
                                                        <GiftIcon gift={opt} getIconUrl={getIconUrl} />
                                                        <div className="ancestral-power-info">
                                                            <span className="ancestral-power-name">{opt.name}</span>
                                                            <span className="ancestral-power-subtext">{getGiftMechanicHint(opt)}</span>
                                                        </div>
                                                        {isSelected && (
                                                            <div className="ancestral-corner-notch">
                                                                <i className="fas fa-check" aria-hidden="true"></i>
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Canonical Traits Fallback in matching calm TTRPG grid */
                        <div className="ancestral-rows-container">
                            <div className="ancestral-section-header">
                                <span className="ancestral-section-title">
                                    <i className="fas fa-feather-alt"></i> Heritage Traits
                                </span>
                                <span className="ancestral-choice-count">
                                    {fixedTraits.length} Granted
                                </span>
                            </div>
                            <div className="ancestral-options-pair">
                                {canonicalRemaining.map((trait) => (
                                    <div
                                        key={trait.id}
                                        className="ancestral-power-card choice-option selected canonical-trait"
                                        onMouseEnter={(e) => handleMouseEnter(e, trait, true, true)}
                                        onMouseLeave={handleMouseLeave}
                                        onWheel={handleCardWheel}
                                        data-gift={trait.id}
                                    >
                                        <GiftIcon gift={trait} getIconUrl={getIconUrl} />
                                        <div className="ancestral-power-info">
                                            <span className="ancestral-power-name">{trait.name}</span>
                                            <span className="ancestral-power-subtext">{getGiftMechanicHint(trait)}</span>
                                        </div>
                                        <div className="ancestral-corner-notch">
                                            <i className="fas fa-check" aria-hidden="true"></i>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer with Tip & Classic Red/Gold RPG Button */}
                <div className="ancestral-panel-footer">
                    <div className="ancestral-tip-text">
                        <span className="ancestral-tip-label">Tip:</span>{' '}
                        {sealed
                            ? 'These ancestral gifts are sealed and cannot be changed.'
                            : (loadout ? 'Gifts are permanent once your hero is created.' : 'Canonical traits are automatically granted to your hero.')}
                    </div>
                    <div className="ancestral-footer-actions">
                        <button
                            type="button"
                            className="ancestral-rpg-btn"
                            onClick={onClose}
                            disabled={Boolean(loadout && !sealed && !check.complete)}
                            aria-label={loadout && !sealed && !check.complete ? `Confirm Gifts (Need ${total - check.chosen})` : 'Confirm Gifts'}
                        >
                            <span className="ancestral-btn-arrow"><i className="fas fa-chevron-left" aria-hidden="true" style={{ marginRight: '6px' }}></i></span>{' '}
                            {loadout && !sealed && !check.complete
                                ? `Confirm Gifts (Need ${total - check.chosen})`
                                : (loadout ? (sealed ? 'Close' : 'Confirm & Inscribe') : 'Close')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating RPG Spell Tooltip */}
            {hoveredGift && (
                <div
                    ref={tooltipRef}
                    className="ancestral-floating-tooltip"
                    style={{ top: `${tooltipPos.top}px`, left: `${tooltipPos.left}px` }}
                    onMouseEnter={handleTooltipMouseEnter}
                    onMouseLeave={handleTooltipMouseLeave}
                >
                    <div className="ancestral-tooltip-scrollable" ref={tooltipScrollRef}>
                        <div className="ancestral-tooltip-card">
                            <UnifiedSpellCard
                                spell={hoveredGift}
                                variant="wizard"
                                showActions={false}
                                showDescription={true}
                                showStats={true}
                                showTags={true}
                            />
                        </div>
                    </div>

                    <div className="ancestral-tooltip-status">
                        {hoveredMeta.isCore ? (
                            <span className="status-core"><i className="fas fa-lock"></i> Innate Birthright (Permanent)</span>
                        ) : hoveredMeta.isSelected ? (
                            <span className="status-selected"><i className="fas fa-check-circle"></i> Chosen for {hoveredMeta.rowLabel || 'this row'}</span>
                        ) : (
                            <span className="status-prompt"><i className="fas fa-mouse-pointer"></i> Click to choose for {hoveredMeta.rowLabel || 'this row'}</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

/** Codex (lore page) block: the core gift plus one slot per row, dashed while unchosen. */
export function AncestralGiftsCodex({ raceId, subraceId, ancestry, onOpenDrawer }) {
    const loadout = useMemo(() => getResolvedAncestryLoadout(raceId, subraceId), [raceId, subraceId]);
    if (!loadout) return null;
    const picks = (ancestry && ancestry.heritageId === subraceId && ancestry.picks) || {};
    const card = (key, title, gift, tag) => (
        <div key={key} className={`grimoire-trait-card ${gift ? '' : 'ancestral-slot-empty'}`} onClick={onOpenDrawer} style={{ cursor: onOpenDrawer ? 'pointer' : 'default' }}>
            <div className="grimoire-trait-header">
                <div className="grimoire-trait-icon"><i className={gift ? 'fas fa-star' : 'far fa-circle'}></i></div>
                <span className="grimoire-trait-title">{gift ? gift.name : title}</span>
                <span className="ancestral-codex-tag">{tag}</span>
            </div>
            <span className="grimoire-trait-desc">{gift ? gift.description : `Choose one of: ${loadout.rows.find(r => r.label === title)?.options.map(o => o?.name).filter(Boolean).join(' or ')}.`}</span>
        </div>
    );
    return (
        <div className="grimoire-traits-list ancestral-codex-list">
            {card('core', 'Core', loadout.core, 'Core')}
            {loadout.rows.map(row => card(row.id, row.label, row.options.find(o => o && o.id === picks[row.id]) || null, row.label))}
        </div>
    );
}
