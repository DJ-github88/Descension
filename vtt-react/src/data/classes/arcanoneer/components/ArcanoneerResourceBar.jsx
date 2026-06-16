import React, { useState, useRef, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/ArcanoneerResourceBar.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import SpellTooltip from '../../../../components/spellcrafting-wizard/components/common/SpellTooltip';
import { formulationToSpell } from '../formulationToSpell';
import { migrateBlockId } from '../../../../utils/arcanoneerMigration';

/**
 * ArcanoneerResourceBar — the "Building Blocks" resource system.
 *
 * Replaces the legacy canvas-based elemental-spheres renderer. Renders an 8-segment
 * pip bar where each segment is one of the 8 Building Blocks (Force, Light, Shadow,
 * Heat, Cold, Spark, Flesh, Wyrd). Each segment shows discrete pips for the count
 * banked. Includes:
 *
 *   - Hover tooltip per block: shows count, theme, flavor, and live list of which
 *     formulations the block currently enables (✓ ready / ✗ missing partner).
 *   - Click-to-edit portal menu per block: pip adjuster, +1/−1, reset.
 *   - Roll 4d8 button with animation; clamps to the 12-block bank cap.
 *   - Formulation chips: one per ready combination, with category tinting.
 *   - Compact mode for party-HUD: single thin row of fillable cells + popover.
 *
 * Single source of truth for block metadata: `classResources.js` `CLASS_RESOURCE_TYPES['Arcanoneer'].elements`.
 * Combination matrix: `arcanoneerData.js` `ARCANONEER_DATA.combinationMatrix`.
 *
 * Props follow the standard external resource-bar contract:
 *   { classResource, size, config, context, isOwner, onClassResourceUpdate }
 */
const ArcanoneerResourceBar = ({
    classResource = {},
    size = 'normal',
    config = {},
    context = 'hud',
    isOwner = true,
    onClassResourceUpdate = null,
    showcase = false,
}) => {
    // ===== Configuration =====
    const blocks = config?.elements || [];
    const maxBank = config?.mechanics?.max || 12;
    // The combination matrix is passed via config.combinationMatrix by ClassResourceBar's
    // dispatcher. We don't import arcanoneerData directly to avoid a circular dependency
    // and to keep this component pure.
    const matrix = config?.combinationMatrix || null;
    const matrixEntries = matrix?.entries || [];

    const canEdit = isOwner;
    const isCompact = size === 'small' || context === 'party';

    // ===== State =====
    // `spheres` is the canonical banked-blocks array (legacy field name, kept for save compat).
    // Normalize every ID through migrateBlockId() so legacy saves (with IDs like 'ember',
    // 'rime', 'nature', 'chaos') still match the new canonical block IDs ('heat', 'cold',
    // 'spark', 'wyrd'). Without this, formulations never show as "ready" for characters
    // whose Firebase data hasn't been through the persistence-migration hook yet.
    const normalizeSpheres = (arr) => Array.isArray(arr) ? arr.map(migrateBlockId) : [];
    const [localSpheres, setLocalSpheres] = useState(normalizeSpheres(classResource?.spheres));
    const [isRolling, setIsRolling] = useState(false);
    const [hoveredBlockId, setHoveredBlockId] = useState(null);
    const [editMenuBlockId, setEditMenuBlockId] = useState(null);
    const [showPanel, setShowPanel] = useState(false);
    const [lastRollResult, setLastRollResult] = useState(null);
    // In showcase mode (rules page), formulations are collapsed behind a toggle so the
    // demo reads as a bar first, with detail available on demand.
    const [showFormulations, setShowFormulations] = useState(false);
    // Formulation spellcard hover — shows a full-screen foggy spellcard (same UX as
    // hovering spells in the action bar) via SpellTooltip's fullscreenMode.
    const [hoveredFormulation, setHoveredFormulation] = useState(null);
    const formHoverTimeoutRef = useRef(null);
    const formHideTimeoutRef = useRef(null);

    // Keep localSpheres in sync if the upstream classResource changes (e.g. multiplayer update).
    useEffect(() => {
        const incoming = normalizeSpheres(classResource?.spheres);
        // Shallow compare — only update if the upstream array actually changed.
        if (incoming.length !== localSpheres.length ||
            incoming.some((v, i) => v !== localSpheres[i])) {
            setLocalSpheres(incoming);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classResource?.spheres]);

    const barRef = useRef(null);
    const editMenuRef = useRef(null);
    const panelRef = useRef(null);

    // Shared tooltip hook positions the tooltip portal centered above/below the bar.
    const tooltipRef = useResourceBarTooltip(barRef, hoveredBlockId !== null, [hoveredBlockId, localSpheres], {
        preferredWidth: 320,
        preferredHeight: 240,
    });

    // ===== Stores / logging =====
    const { addCombatNotification } = useChatStore();
    const isGMMode = useGameStore(state => state.isGMMode);
    const currentPlayerName = useCharacterStore(state => state.name || 'Player');

    const getActorName = () => {
        const actorName = currentPlayerName || 'Player';
        return isGMMode ? `${actorName} (GM)` : actorName;
    };

    const logChange = (blockName, amount, isPositive) => {
        const absAmount = Math.abs(amount);
        if (absAmount === 0) return;
        const actorName = getActorName();
        const characterName = currentPlayerName || 'Character';
        const verb = isPositive ? 'generated' : 'spent';
        addCombatNotification({
            type: 'combat_resource',
            attacker: actorName,
            target: characterName,
            amount: absAmount,
            resourceType: 'classResource',
            isPositive,
            customMessage: `${characterName} ${verb} ${absAmount} ${blockName} block${absAmount === 1 ? '' : 's'}`,
        });
    };

    // ===== Derived values =====
    // Count of each block currently banked.
    const blockCounts = useMemo(() => {
        const counts = {};
        for (const b of blocks) counts[b.id] = 0;
        for (const id of localSpheres) {
            if (counts[id] !== undefined) counts[id] += 1;
        }
        return counts;
    }, [localSpheres, blocks]);

    const totalBanked = localSpheres.length;

    // Which 2-block formulations are currently castable (both required blocks banked)?
    const readyFormulations = useMemo(() => {
        const out = [];
        for (const entry of matrixEntries) {
            const [a, b] = entry.elements;
            // Same-block pair (e.g. heat_heat) requires count >= 2.
            const need = (a === b) ? 2 : 1;
            if ((blockCounts[a] || 0) >= need && (blockCounts[b] || 0) >= need) {
                out.push(entry);
            }
        }
        return out;
    }, [matrixEntries, blockCounts]);

    const readyCount = readyFormulations.length;

    // ===== Actions =====
    const commitSpheres = (next, changeLog = null) => {
        const capped = next.slice(0, maxBank);
        setLocalSpheres(capped);
        if (onClassResourceUpdate) onClassResourceUpdate('spheres', capped);
        if (changeLog) logChange(changeLog.name, changeLog.amount, changeLog.isPositive);
    };

    const addBlock = (blockId) => {
        if (!canEdit) return;
        if (totalBanked >= maxBank) return;
        commitSpheres([...localSpheres, blockId], { name: blocks.find(b => b.id === blockId)?.name || 'Block', amount: 1, isPositive: true });
    };

    const removeBlock = (blockId) => {
        if (!canEdit) return;
        const idx = localSpheres.lastIndexOf(blockId);
        if (idx < 0) return;
        const next = [...localSpheres];
        next.splice(idx, 1);
        commitSpheres(next, { name: blocks.find(b => b.id === blockId)?.name || 'Block', amount: 1, isPositive: false });
    };

    const setBlockCount = (blockId, newCount) => {
        if (!canEdit) return;
        const current = blockCounts[blockId] || 0;
        if (newCount === current) return;
        const others = localSpheres.filter(s => s !== blockId);
        // Cap so we don't exceed the bank max when refilling this block.
        const room = Math.max(0, maxBank - others.length);
        const capped = Math.min(newCount, room);
        const next = [...others, ...Array.from({ length: capped }, () => blockId)];
        const delta = capped - current;
        commitSpheres(next, { name: blocks.find(b => b.id === blockId)?.name || 'Block', amount: Math.abs(delta), isPositive: delta > 0 });
    };

    const clearAll = () => {
        if (!canEdit || totalBanked === 0) return;
        const cleared = [...localSpheres];
        commitSpheres([], { name: 'all blocks', amount: cleared.length, isPositive: false });
    };

    /**
     * Roll 4d8 — the core generation mechanic.
     * Each die maps to a block by d8Value; bank all four (respecting cap).
     * Triggers a brief rolling animation, then commits.
     */
    const roll4d8 = () => {
        if (!canEdit || isRolling) return;
        setIsRolling(true);
        setLastRollResult(null);

        const dice = [];
        const newBlocks = [];
        for (let i = 0; i < 4; i++) {
            const roll = Math.floor(Math.random() * 8) + 1; // 1-8
            dice.push(roll);
            const block = blocks.find(b => b.d8Value === roll);
            if (block) newBlocks.push(block.id);
        }
        setLastRollResult({ dice, blocks: newBlocks });

        // Animation delay before committing.
        setTimeout(() => {
            const next = [...localSpheres, ...newBlocks].slice(0, maxBank);
            const banked = next.length - localSpheres.length;
            commitSpheres(next, { name: 'Spheres (4d8)', amount: Math.max(0, banked), isPositive: true });
            setIsRolling(false);
        }, 480);
    };

    /**
     * Cast a formulation: consumes the two required blocks and logs it.
     * Doesn't directly fire the spell — that's the combat resolver's job — but
     * updates the bank so the player sees their blocks spent.
     */
    const castFormulation = (entry) => {
        if (!canEdit) return;
        const [a, b] = entry.elements;
        const next = [...localSpheres];
        // Remove first instance of a, then first instance of b.
        const ia = next.indexOf(a);
        if (ia >= 0) next.splice(ia, 1);
        const ib = next.indexOf(b);
        if (ib >= 0) next.splice(ib, 1);
        if (ia < 0 || ib < 0) return; // safety check
        commitSpheres(next, { name: entry.name + ' formulation', amount: 2, isPositive: false });
    };

    // ===== Outside-click handling =====
    // Close edit menu when clicking outside it.
    useEffect(() => {
        if (!editMenuBlockId) return;
        const onDown = (e) => {
            const inMenu = editMenuRef.current?.contains(e.target);
            const inBar = barRef.current?.contains(e.target);
            if (!inMenu && !inBar) setEditMenuBlockId(null);
        };
        const id = setTimeout(() => document.addEventListener('mousedown', onDown), 0);
        return () => { clearTimeout(id); document.removeEventListener('mousedown', onDown); };
    }, [editMenuBlockId]);

    // Close compact popover panel on outside click.
    useEffect(() => {
        if (!showPanel) return;
        const onDown = (e) => {
            const inPanel = panelRef.current?.contains(e.target);
            const inBar = barRef.current?.contains(e.target);
            if (!inPanel && !inBar) setShowPanel(false);
        };
        const id = setTimeout(() => document.addEventListener('mousedown', onDown), 0);
        return () => { clearTimeout(id); document.removeEventListener('mousedown', onDown); };
    }, [showPanel]);

    // ===== Lookup helpers =====
    const getBlock = (id) => blocks.find(b => b.id === id);
    const formulationsUsingBlock = (blockId) => matrixEntries.filter(e => e.elements.includes(blockId));

    // ========================================================================
    // RENDER SUB-FRAGMENTS
    // ========================================================================

    // Tooltip content for the currently-hovered block.
    // Uses the SAME unified classes as every other class resource bar tooltip
    // (`.unified-resourcebar-tooltip.pathfinder-tooltip`) so it inherits the
    // shared look. Content-specific colors are inline, matching the pattern
    // used by Pyrofiend and Augur.
    const renderHoverTooltip = () => {
        if (!hoveredBlockId) return null;
        const block = getBlock(hoveredBlockId);
        if (!block) return null;
        const count = blockCounts[block.id] || 0;
        const forms = formulationsUsingBlock(block.id);
        return ReactDOM.createPortal(
            <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                <div className="tooltip-header">
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: block.isGradient ? 'conic-gradient(from 0deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3, #FF0000)' : block.color, border: '1px solid rgba(255,255,255,0.4)', marginRight: '6px' }} />
                    {block.name}
                    <span style={{ fontSize: '0.7rem', color: 'rgba(58,42,26,0.5)', marginLeft: '4px' }}>d8={block.d8Value}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.9rem', fontWeight: 700, color: block.isGradient ? '#FF00FF' : block.color }}>{count}</span>
                </div>
                <div className="tooltip-section">
                    <div className="tooltip-label" style={{ color: block.isGradient ? '#FF00FF' : block.color }}>{block.theme}</div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(58,42,26,0.85)' }}>{block.summary}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(58,42,26,0.55)', fontStyle: 'italic', marginTop: '4px' }}>{block.flavor}</div>
                </div>
                {forms.length > 0 && (
                    <>
                        <div className="tooltip-divider" />
                        <div className="tooltip-section">
                            <div className="tooltip-label">Enabled Formulations ({forms.length})</div>
                            <div style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                                {forms.slice(0, 8).map(f => {
                                    const [a, b] = f.elements;
                                    const need = a === b ? 2 : 1;
                                    const ready = (blockCounts[a] || 0) >= need && (blockCounts[b] || 0) >= need;
                                    const partner = a === block.id ? b : a;
                                    const partnerName = getBlock(partner)?.name || partner;
                                    const needStr = a === b ? `${block.name} ×2` : `${block.name} + ${partnerName}`;
                                    return (
                                        <div key={f.id} style={{ display: 'flex', gap: '4px', alignItems: 'baseline', marginBottom: '2px' }}>
                                            <span style={{ color: ready ? '#2d8a4e' : 'rgba(58,42,26,0.3)', fontWeight: 700 }}>{ready ? '✓' : '✗'}</span>
                                            <span style={{ flex: 1, color: ready ? 'rgba(58,42,26,0.9)' : 'rgba(58,42,26,0.5)' }}>{f.name}</span>
                                            <span style={{ fontSize: '0.72rem', color: 'rgba(58,42,26,0.4)', fontStyle: 'italic' }}>{needStr}</span>
                                        </div>
                                    );
                                })}
                                {forms.length > 8 && <div style={{ fontSize: '0.72rem', color: 'rgba(58,42,26,0.4)', textAlign: 'center', paddingTop: '2px' }}>+{forms.length - 8} more</div>}
                            </div>
                        </div>
                    </>
                )}
                {canEdit && (
                    <>
                        <div className="tooltip-divider" />
                        <div className="tooltip-section">
                            <div style={{ fontSize: '0.75rem', color: 'rgba(58,42,26,0.5)', fontStyle: 'italic' }}>
                                Click segment to adjust · Right-click to remove one
                            </div>
                        </div>
                    </>
                )}
            </div>,
            document.body
        );
    };

    // Single block segment — used by the full-mode bar.
    // Height is set via inline style so it can't be overridden by external CSS
    // (we had persistent specificity issues with the showcase-mode rules).
    const segmentHeight = showcase ? 95 : (size === 'large' ? 86 : (size === 'small' ? 48 : 64));
    const renderBlockSegment = (block) => {
        const count = blockCounts[block.id] || 0;
        const isHovered = hoveredBlockId === block.id;
        return (
            <div
                key={block.id}
                className={`arc-block-segment ${count > 0 ? 'filled' : 'empty'} ${isHovered ? 'hovered' : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    if (!canEdit) return;
                    if (editMenuBlockId === block.id) {
                        setEditMenuBlockId(null);
                    } else {
                        setEditMenuBlockId(block.id);
                    }
                }}
                onContextMenu={(e) => {
                    if (!canEdit) return;
                    e.preventDefault();
                    e.stopPropagation();
                    removeBlock(block.id);
                }}
                onMouseEnter={(e) => { setHoveredBlockId(block.id); }}
                onMouseLeave={() => { setHoveredBlockId(null); }}
                style={{
                    height: `${segmentHeight}px`,
                    cursor: canEdit ? 'pointer' : 'default',
                    '--block-color': block.color,
                    '--block-glow': block.glowColor,
                    '--fill-percent': showcase ? `${Math.min((count / 5) * 100, 100)}%` : '0%',
                }}
            >
                {showcase && count > 0 && <div className="arc-block-fill-overlay" />}
                <div className="arc-block-pips">
                    {Array.from({ length: 5 }).map((_, p) => (
                        <span key={p} className={`arc-block-pip ${p < count ? 'on' : 'off'}`} />
                    ))}
                    {count > 5 && <span className="arc-block-pip-overflow">+{count - 5}</span>}
                </div>
                <div className="arc-block-label">
                    <i className={`${block.icon} arc-block-icon`} />
                    <span className="arc-block-name">{block.name}</span>
                </div>
                <div className="arc-block-count-badge">{count}</div>
                <div className="arc-block-d8-badge">{block.d8Value}</div>
            </div>
        );
    };

    // The hover-bar grid (8 segments) — for full mode. In showcase mode (rules page)
    // the grid switches to 4 columns so it fits a constrained container without overflow.
    // Column count is set via inline style so it can't be accidentally overridden by CSS.
    const renderBlockGrid = () => {
        const cols = showcase ? 4 : 8;
        return (
            <div className="arc-block-grid" ref={barRef} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                {blocks.map(renderBlockSegment)}
            </div>
        );
    };

    // Header showing totals + ready count + roll button.
    const renderHeader = ({ compact = false } = {}) => (
        <div className="arc-header">
            <span className="arc-title-label"><i className="fas fa-dice-d8" /> Spheres</span>
            <div className="arc-totals">
                <span className="arc-total-count" title="Spheres banked">{totalBanked}/{maxBank}</span>
                <span className={`arc-ready-badge ${readyCount > 0 ? 'has-ready' : ''}`} title={`${readyCount} formulation${readyCount === 1 ? '' : 's'} ready`}>
                    <i className="fas fa-flask" /> {readyCount}
                </span>
                {canEdit && (
                    <button
                        className={`arc-roll-btn ${isRolling ? 'rolling' : ''}`}
                        onClick={(e) => { e.stopPropagation(); roll4d8(); }}
                        disabled={isRolling || totalBanked >= maxBank}
                        title={totalBanked >= maxBank ? 'Bank full — spend spheres first' : 'Roll 4d8 to generate 4 Spheres'}
                    >
                        <i className={`fas fa-dice ${isRolling ? 'fa-spin' : ''}`} />
                        {!compact && <span className="arc-roll-label">{isRolling ? 'Rolling…' : 'Roll 4d8'}</span>}
                    </button>
                )}
            </div>
        </div>
    );

    // Formulation chips — one per combination. Hover shows a full spellcard tooltip
    // (via SpellTooltip + formulationToSpell adapter) so players can read the
    // formulation's effect, range, damage, etc. without leaving the bar.
    // Uses fullscreenMode — same foggy-backdrop presentation as action-bar spell hovers.
    const handleFormHoverEnter = (entry) => {
        if (formHideTimeoutRef.current) { clearTimeout(formHideTimeoutRef.current); formHideTimeoutRef.current = null; }
        if (formHoverTimeoutRef.current) clearTimeout(formHoverTimeoutRef.current);
        formHoverTimeoutRef.current = setTimeout(() => {
            setHoveredFormulation(entry);
        }, 300);
    };
    const handleFormHoverLeave = () => {
        if (formHoverTimeoutRef.current) clearTimeout(formHoverTimeoutRef.current);
        formHideTimeoutRef.current = setTimeout(() => setHoveredFormulation(null), 100);
    };
    const handleFormTooltipEnter = () => {
        if (formHideTimeoutRef.current) { clearTimeout(formHideTimeoutRef.current); formHideTimeoutRef.current = null; }
    };
    const handleFormTooltipLeave = () => {
        formHideTimeoutRef.current = setTimeout(() => setHoveredFormulation(null), 100);
    };

    const renderFormulationTooltip = () => {
        if (!hoveredFormulation) return null;
        const spell = formulationToSpell(hoveredFormulation, matrix);
        if (!spell) return null;
        return (
            <SpellTooltip
                spell={spell}
                fullscreenMode
                onMouseEnter={handleFormTooltipEnter}
                onMouseLeave={handleFormTooltipLeave}
            />
        );
    };

    const renderFormulationChips = () => {
        if (matrixEntries.length === 0) return null;
        // In showcase mode (rules page), only show ready (castable) formulations
        // so the section stays clean and readable instead of flooding with all 36.
        const visibleEntries = showcase ? readyFormulations : matrixEntries;
        if (showcase && visibleEntries.length === 0) {
            return (
                <div className="arc-formulation-chips arc-formulation-empty">
                    <i className="fas fa-info-circle" />
                    <span>Bank Spheres above to see which formulations become available.</span>
                </div>
            );
        }
        return (
            <div className="arc-formulation-chips">
                {visibleEntries.map(entry => {
                    const [a, b] = entry.elements;
                    const need = a === b ? 2 : 1;
                    const ready = (blockCounts[a] || 0) >= need && (blockCounts[b] || 0) >= need;
                    const isWyrd = !!entry.isChaosCombo;
                    return (
                        <div
                            key={entry.id}
                            className="arc-form-chip-wrapper"
                            onMouseEnter={() => handleFormHoverEnter(entry)}
                            onMouseLeave={handleFormHoverLeave}
                        >
                            <button
                                className={`arc-form-chip ${ready ? 'ready' : ''} ${isWyrd ? 'is-wyrd' : ''}`}
                                disabled={!ready || !canEdit}
                                onClick={(e) => { e.stopPropagation(); castFormulation(entry); }}
                                title={`${entry.name}\n${entry.elements.map(id => getBlock(id)?.name || id).join(' + ')}\n${ready ? '✓ Ready — click to cast' : '✗ Not enough spheres'}`}
                            >
                                <span className="arc-form-chip-name">{entry.name}</span>
                                <span className="arc-form-chip-cost">
                                    {entry.elements.map(id => getBlock(id)?.name?.charAt(0) || '?').join('+')}
                                </span>
                            </button>
                        </div>
                    );
                })}
                {renderFormulationTooltip()}
            </div>
        );
    };

    // Per-block edit menu (portal).
    const renderEditMenu = () => {
        if (!editMenuBlockId || !barRef.current) return null;
        const block = getBlock(editMenuBlockId);
        if (!block) return null;
        const count = blockCounts[block.id] || 0;
        const barRect = barRef.current.getBoundingClientRect();
        const menuWidth = 220;
        let left = barRect.left + (barRect.width / 2) - (menuWidth / 2);
        if (left < 8) left = 8;
        if (left + menuWidth > window.innerWidth - 8) left = window.innerWidth - menuWidth - 8;
        const spaceBelow = window.innerHeight - barRect.bottom;
        const top = spaceBelow > 240 ? barRect.bottom + 6 : Math.max(8, barRect.top - 240);
        return ReactDOM.createPortal(
            <div
                ref={editMenuRef}
                className="unified-context-menu compact context-menu-container"
                onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation(); }}
                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation(); }}
                style={{ position: 'fixed', top: `${top}px`, left: `${left}px`, width: `${menuWidth}px`, zIndex: 100000 }}
            >
                <div className="context-menu-main">
                    <div className="context-menu-section">
                        <div className="context-menu-section-header" style={{ color: block.isGradient ? '#FF00FF' : block.color }}>
                            <i className={block.icon} style={{ marginRight: '5px' }} />
                            {block.name}
                            <span style={{ fontSize: '0.75rem', color: 'rgba(58,42,26,0.5)', marginLeft: 'auto' }}>{count}/{maxBank}</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'rgba(58,42,26,0.65)', marginBottom: '6px', lineHeight: 1.35 }}>{block.summary}</div>

                        <div className="context-menu-section-header" style={{ fontSize: '11px', marginTop: '4px' }}>Set Count</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '3px', marginBottom: '6px' }}>
                            {Array.from({ length: Math.max(5, Math.min(maxBank, 8)) }).map((_, p) => {
                                const val = p + 1;
                                const isActive = val <= count;
                                return (
                                    <button
                                        key={p}
                                        className={`context-menu-button ${isActive ? 'gain' : ''}`}
                                        onClick={(e) => { e.stopPropagation(); setBlockCount(block.id, val); }}
                                        disabled={!canEdit}
                                        title={`Set to ${val}`}
                                        style={isActive ? { background: block.isGradient ? 'rgba(255,0,255,0.2)' : `${block.color}33`, borderColor: block.isGradient ? '#FF00FF' : block.color } : {}}
                                    >
                                        {val}
                                    </button>
                                );
                            })}
                        </div>

                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button className="context-menu-button" onClick={(e) => { e.stopPropagation(); setBlockCount(block.id, Math.max(0, count - 1)); }} disabled={!canEdit || count === 0}>
                                <i className="fas fa-minus-circle"></i> −1
                            </button>
                            <button className="context-menu-button gain" onClick={(e) => { e.stopPropagation(); setBlockCount(block.id, count + 1); }} disabled={!canEdit || totalBanked >= maxBank}>
                                <i className="fas fa-plus-circle"></i> +1
                            </button>
                            <button className="context-menu-button" onClick={(e) => { e.stopPropagation(); setBlockCount(block.id, 0); }} disabled={!canEdit || count === 0} title="Reset to 0">
                                <i className="fas fa-undo"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    // Last-roll floating indicator.
    const renderRollIndicator = () => {
        if (!lastRollResult || !isRolling) return null;
        return ReactDOM.createPortal(
            <div className="arc-roll-indicator" style={{
                position: 'fixed',
                top: barRef.current ? barRef.current.getBoundingClientRect().top - 28 : '50%',
                left: barRef.current ? barRef.current.getBoundingClientRect().left + (barRef.current.getBoundingClientRect().width / 2) : '50%',
                transform: 'translateX(-50%)',
                zIndex: 100000,
                pointerEvents: 'none',
            }}>
                🎲 {lastRollResult.dice.join(' · ')}
            </div>,
            document.body
        );
    };

    // ========================================================================
    // COMPACT MODE (party-HUD): single thin row + popover panel
    // ========================================================================
    const renderCompactRow = () => (
        <div className={`class-resource-bar arcanoneer-blocks ${size} party-context`}>
            <div className="arc-compact-row" ref={barRef}>
                <div className="arc-compact-cells">
                    {blocks.map(block => {
                        const count = blockCounts[block.id] || 0;
                        const fillPct = Math.min(100, (count / 5) * 100); // visual: 5 = full
                        return (
                            <div
                                key={block.id}
                                className={`arc-compact-cell ${count > 0 ? 'filled' : 'empty'}`}
                                onClick={(e) => { e.stopPropagation(); if (canEdit) setShowPanel(true); }}
                                onMouseEnter={() => setHoveredBlockId(block.id)}
                                onMouseLeave={() => setHoveredBlockId(null)}
                                title={`${block.name} (d8=${block.d8Value}): ${count} banked`}
                                style={count > 0 ? { '--block-color': block.color, '--block-glow': block.glowColor } : {}}
                            >
                                <div className="arc-compact-fill" style={{ height: `${fillPct}%` }} />
                                <span className="arc-compact-glyph">{block.name.charAt(0)}</span>
                            </div>
                        );
                    })}
                </div>
                <button
                    className={`arc-compact-expand ${readyCount > 0 ? 'has-ready' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setShowPanel(!showPanel); }}
                    title={readyCount > 0 ? `${readyCount} formulation${readyCount === 1 ? '' : 's'} ready — open to cast` : 'Open Spheres panel'}
                >
                    <i className={`fas ${showPanel ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
                    <span className="arc-compact-banked">{totalBanked}</span>
                    {readyCount > 0 && <span className="arc-compact-ready">{readyCount}</span>}
                </button>
            </div>
            {renderHoverTooltip()}
            {renderCompactPanel()}
        </div>
    );

    // Compact popover panel — full edit surface + formulation chips.
    const renderCompactPanel = () => {
        if (!showPanel || !barRef.current) return null;
        const barRect = barRef.current.getBoundingClientRect();
        const panelWidth = 300;
        const panelHeight = 380;
        let left = barRect.right - panelWidth;
        if (left < 6) left = 6;
        if (left + panelWidth > window.innerWidth - 6) left = window.innerWidth - panelWidth - 6;
        const spaceBelow = window.innerHeight - barRect.bottom;
        const top = spaceBelow > panelHeight + 6 ? barRect.bottom + 6 : Math.max(6, barRect.top - panelHeight - 6);
        return ReactDOM.createPortal(
            <div
                ref={panelRef}
                className="unified-context-menu compact arc-panel-menu"
                onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation(); }}
                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation(); }}
                style={{ position: 'fixed', top: `${top}px`, left: `${left}px`, width: `${panelWidth}px`, zIndex: 100000 }}
            >
                <div className="context-menu-main">
                    {renderHeader({ compact: true })}
                    <div className="arc-panel-section">
                        <div className="arc-panel-section-label">Blocks</div>
                        <div className="arc-panel-blocks">
                            {blocks.map(block => {
                                const count = blockCounts[block.id] || 0;
                                return (
                                    <div key={block.id} className="arc-panel-block-row" style={{ '--block-color': block.color, '--block-glow': block.glowColor }}>
                                        <span className="arc-panel-block-icon"><i className={block.icon} /></span>
                                        <span className="arc-panel-block-name">{block.name}</span>
                                        <div className="arc-panel-block-pips">
                                            {Array.from({ length: 5 }).map((_, p) => (
                                                <span key={p} className={`arc-panel-pip ${p < count ? 'on' : 'off'}`} />
                                            ))}
                                        </div>
                                        {canEdit ? (
                                            <div className="arc-panel-block-controls">
                                                <button className="arc-panel-mini-btn" onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }} disabled={count === 0}>−</button>
                                                <span className="arc-panel-block-count">{count}</span>
                                                <button className="arc-panel-mini-btn" onClick={(e) => { e.stopPropagation(); addBlock(block.id); }} disabled={totalBanked >= maxBank}>+</button>
                                            </div>
                                        ) : (
                                            <span className="arc-panel-block-count">{count}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="arc-panel-section">
                        <div className="arc-panel-section-label">Formulations ({readyCount} ready)</div>
                        {renderFormulationChips()}
                    </div>
                    <div className="arc-panel-footer">
                        {canEdit && (
                            <button className="context-menu-button" onClick={(e) => { e.stopPropagation(); clearAll(); }} disabled={totalBanked === 0}>
                                <i className="fas fa-times" /> Clear All
                            </button>
                        )}
                        <button className="context-menu-button" onClick={(e) => { e.stopPropagation(); setShowPanel(false); }}>
                            <i className="fas fa-check" /> Close
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    // ========================================================================
    // FULL MODE: header + block grid + (collapsible) formulation chips
    // ========================================================================
    const renderFormulationSection = () => {
        // In showcase mode (rules page), collapse the formulation chips behind a toggle
        // so the demo reads as a bar first. Detail available on demand.
        if (showcase) {
            return (
                <div className="arc-formulation-collapsible">
                    <button
                        className="arc-formulation-toggle"
                        onClick={(e) => { e.stopPropagation(); setShowFormulations(!showFormulations); }}
                        title={showFormulations ? 'Hide formulations' : 'Show all 36 formulations'}
                    >
                        <i className={`fas ${showFormulations ? 'fa-chevron-up' : 'fa-flask'}`} />
                        <span>{showFormulations ? 'Hide' : 'Show'} Available Formulations</span>
                        {readyCount > 0 && <span className="arc-formulation-toggle-count">{readyCount} ready</span>}
                    </button>
                    {showFormulations && renderFormulationChips()}
                </div>
            );
        }
        return renderFormulationChips();
    };

    const renderFull = () => (
        <div className={`class-resource-bar arcanoneer-blocks ${size} ${showcase ? 'showcase-mode' : ''}`}>
            <div className="arc-container">
                {renderHeader()}
                {renderBlockGrid()}
                {renderFormulationSection()}
                {!showcase && canEdit && (
                    <div className="arc-footer">
                        <button className="arc-footer-btn" onClick={(e) => { e.stopPropagation(); clearAll(); }} disabled={totalBanked === 0}>
                            <i className="fas fa-times" /> Clear All
                        </button>
                    </div>
                )}
                {!showcase && lastRollResult && (
                    <div className="arc-last-roll">
                        Last roll: <span className="arc-last-roll-dice">[{lastRollResult.dice.join(', ')}]</span> → {lastRollResult.blocks.map(id => getBlock(id)?.name || id).join(', ')}
                    </div>
                )}
            </div>
            {renderHoverTooltip()}
            {renderEditMenu()}
            {renderRollIndicator()}
        </div>
    );

    if (isCompact) {
        return renderCompactRow();
    }
    return renderFull();
};

export default ArcanoneerResourceBar;
