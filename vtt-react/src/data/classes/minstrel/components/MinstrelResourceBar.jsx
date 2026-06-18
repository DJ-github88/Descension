import React, { useState, useRef, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/MinstrelResourceBar.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import SpellTooltip from '../../../../components/spellcrafting-wizard/components/common/SpellTooltip';
import { cadenceToSpell } from '../cadenceToSpell';

/**
 * MinstrelResourceBar — the "Musical Notes & Cadences" resource system.
 *
 * Spiritual sibling to ArcanoneerResourceBar. Renders a 7-segment note staff
 * (I–VII) where each segment is one of the seven musical notes, with discrete
 * pip stacks for the count banked (0–5 per note). Includes:
 *
 *   - Hover tooltip per note: shows count, function, thematic role, flavor,
 *     and a live list of which cadences the note currently participates in
 *     (✓ ready / ✗ missing partner notes).
 *   - Click-to-edit portal menu per note: pip adjuster, +1/−1, reset.
 *   - Cadence chips: one per progression (all 10). Hover shows a full
 *     UnifiedSpellCard tooltip (via SpellTooltip + cadenceToSpell adapter)
 *     so players can read the cadence's effect, range, consumed notes, etc.
 *     without leaving the bar — same UX as Arcanoneer formulation chips.
 *   - Click a ready cadence to consume its notes and log the resolution.
 *     Does NOT auto-cast the learned spell — that's still done via the
 *     action bar with its own targeting. This just tracks note economy.
 *   - Compact mode for party-HUD: single thin row of note cells + popover.
 *
 * Single source of truth for note metadata: `classResources.js`
 * `CLASS_RESOURCE_TYPES['Minstrel'].visual.notes`. Cadence matrix:
 * `minstrelData.js` `MINSTREL_DATA.cadenceMatrix` (passed via config to
 * keep this component pure and avoid a circular import).
 *
 * Specializations are intentionally NOT rendered here (currently on hold).
 *
 * Props follow the standard external resource-bar contract:
 *   { classResource, size, config, context, isOwner, onClassResourceUpdate }
 */
const MinstrelResourceBar = ({
    classResource = {},
    size = 'normal',
    config = {},
    context = 'hud',
    isOwner = true,
    onClassResourceUpdate = null,
    showcase = false,
}) => {
    // ===== Configuration =====
    const notes = config?.visual?.notes || [];
    const maxPerNote = config?.mechanics?.maxPerNote || 5;
    // Cadence matrix is plumbed via config.cadenceMatrix by ClassResourceBar's
    // dispatcher — we don't import minstrelData directly (avoids circular deps
    // and matches the Arcanoneer pattern).
    const matrix = config?.cadenceMatrix || null;
    const cadenceEntries = matrix?.entries || [];

    const canEdit = isOwner;
    const isCompact = size === 'small' || context === 'party';

    // ===== State =====
    // `notes` state mirrors the canonical 7-element count array
    // (index 0 = I, 6 = VII; values are banked counts 0–5). Default to all
    // zeros if upstream hasn't populated it yet so the bar never NaNs.
    const normalizeNotes = (arr) => {
        if (Array.isArray(arr) && arr.length === 7) return arr.map(v => Math.max(0, Math.min(maxPerNote, parseInt(v, 10) || 0)));
        return [0, 0, 0, 0, 0, 0, 0];
    };
    const [localNotes, setLocalNotes] = useState(normalizeNotes(classResource?.notes));
    const [hoveredNoteIndex, setHoveredNoteIndex] = useState(null);
    const [editMenuNoteIndex, setEditMenuNoteIndex] = useState(null);
    const [showPanel, setShowPanel] = useState(false);
    // In showcase mode (rules page), cadences are collapsed behind a toggle so
    // the demo reads as a staff first. Default open in showcase so the rules
    // reference immediately shows all 10 cadences and their hover-spellcards.
    const [showCadences, setShowCadences] = useState(showcase);
    // Cadence spellcard hover — shows a full-screen foggy spellcard (same UX
    // as hovering spells in the action bar / Arcanoneer formulations) via
    // SpellTooltip's fullscreenMode.
    const [hoveredCadence, setHoveredCadence] = useState(null);
    const cadHoverTimeoutRef = useRef(null);
    const cadHideTimeoutRef = useRef(null);

    // Keep localNotes in sync if upstream classResource changes (e.g. multiplayer).
    useEffect(() => {
        const incoming = normalizeNotes(classResource?.notes);
        if (incoming.some((v, i) => v !== localNotes[i])) {
            setLocalNotes(incoming);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classResource?.notes]);

    const barRef = useRef(null);
    const editMenuRef = useRef(null);
    const panelRef = useRef(null);

    // Shared tooltip hook positions the tooltip portal centered above/below the bar.
    const tooltipRef = useResourceBarTooltip(barRef, hoveredNoteIndex !== null, [hoveredNoteIndex, localNotes], {
        preferredWidth: 320,
        preferredHeight: 260,
    });

    // ===== Stores / logging =====
    const { addCombatNotification } = useChatStore();
    const isGMMode = useGameStore(state => state.isGMMode);
    const currentPlayerName = useCharacterStore(state => state.name || 'Player');

    const getActorName = () => {
        const actorName = currentPlayerName || 'Player';
        return isGMMode ? `${actorName} (GM)` : actorName;
    };

    const logChange = (noteName, amount, isPositive) => {
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
            customMessage: `${characterName} ${verb} ${absAmount} ${noteName} note${absAmount === 1 ? '' : 's'}`,
        });
    };

    // ===== Derived values =====
    // Map numeral → current banked count for quick cadence readiness lookups.
    const noteCountByNumeral = useMemo(() => {
        const map = {};
        notes.forEach((n, i) => { map[n.numeral] = localNotes[i] || 0; });
        return map;
    }, [localNotes, notes]);

    const totalBanked = localNotes.reduce((a, b) => a + b, 0);

    // Which cadences are currently resolvable (all required notes banked)?
    const readyCadences = useMemo(() => {
        const out = [];
        for (const entry of cadenceEntries) {
            let ready = true;
            for (const [numeral, need] of Object.entries(entry.notes || {})) {
                if ((noteCountByNumeral[numeral] || 0) < need) { ready = false; break; }
            }
            if (ready) out.push(entry);
        }
        return out;
    }, [cadenceEntries, noteCountByNumeral]);

    const readyCount = readyCadences.length;

    // ===== Actions =====
    const commitNotes = (next, changeLog = null) => {
        const clamped = next.map(v => Math.max(0, Math.min(maxPerNote, v)));
        setLocalNotes(clamped);
        if (onClassResourceUpdate) onClassResourceUpdate('notes', clamped);
        if (changeLog) logChange(changeLog.name, changeLog.amount, changeLog.isPositive);
    };

    const adjustNote = (noteIndex, delta) => {
        if (!canEdit) return;
        const next = [...localNotes];
        const oldValue = next[noteIndex];
        next[noteIndex] = Math.max(0, Math.min(maxPerNote, oldValue + delta));
        const actualAmount = Math.abs(next[noteIndex] - oldValue);
        setLocalNotes(next);
        if (actualAmount > 0) {
            const noteName = notes[noteIndex]?.name || 'Musical Note';
            logChange(noteName, actualAmount, delta > 0);
            if (onClassResourceUpdate) onClassResourceUpdate('notes', next);
        }
    };

    const setNoteCount = (noteIndex, newCount) => {
        if (!canEdit) return;
        const oldValue = localNotes[noteIndex];
        const clamped = Math.max(0, Math.min(maxPerNote, newCount));
        if (clamped === oldValue) return;
        const next = [...localNotes];
        next[noteIndex] = clamped;
        const delta = clamped - oldValue;
        commitNotes(next, { name: notes[noteIndex]?.name || 'Musical Note', amount: Math.abs(delta), isPositive: delta > 0 });
    };

    const resetNote = (noteIndex) => {
        if (!canEdit) return;
        setNoteCount(noteIndex, 0);
    };

    const clearAll = () => {
        if (!canEdit || totalBanked === 0) return;
        const cleared = totalBanked;
        commitNotes([0, 0, 0, 0, 0, 0, 0], { name: 'all notes', amount: cleared, isPositive: false });
    };

    /**
     * Resolve a cadence: consumes the required notes and logs it.
     * Doesn't directly fire the learned spell — that's the action bar's job
     * (cadences exist as learnable spells like `minstrel_perfect_cadence`).
     * This just decrements the bank so the player sees their notes spent.
     */
    const resolveCadence = (entry) => {
        if (!canEdit) return;
        const next = [...localNotes];
        let consumed = 0;
        for (const [numeral, need] of Object.entries(entry.notes || {})) {
            const idx = notes.findIndex(n => n.numeral === numeral);
            if (idx < 0) continue;
            next[idx] = Math.max(0, next[idx] - need);
            consumed += need;
        }
        commitNotes(next, { name: `${entry.name} cadence`, amount: consumed, isPositive: false });
    };

    // ===== Outside-click handling =====
    useEffect(() => {
        if (editMenuNoteIndex === null) return;
        const onDown = (e) => {
            const inMenu = editMenuRef.current?.contains(e.target);
            const inBar = barRef.current?.contains(e.target);
            if (!inMenu && !inBar) setEditMenuNoteIndex(null);
        };
        const id = setTimeout(() => document.addEventListener('mousedown', onDown), 0);
        return () => { clearTimeout(id); document.removeEventListener('mousedown', onDown); };
    }, [editMenuNoteIndex]);

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
    const cadencesUsingNote = (numeral) => cadenceEntries.filter(e => Object.keys(e.notes || {}).includes(numeral));
    const isCadenceReady = (entry) => {
        for (const [numeral, need] of Object.entries(entry.notes || {})) {
            if ((noteCountByNumeral[numeral] || 0) < need) return false;
        }
        return true;
    };

    // ========================================================================
    // RENDER SUB-FRAGMENTS
    // ========================================================================

    // Tooltip content for the currently-hovered note. Uses the same unified
    // tooltip classes as every other class resource bar tooltip
    // (`.unified-resourcebar-tooltip.pathfinder-tooltip`) so it inherits the
    // shared look. Content-specific colors are inline.
    const renderHoverTooltip = () => {
        if (hoveredNoteIndex === null) return null;
        const note = notes[hoveredNoteIndex];
        if (!note) return null;
        const count = localNotes[hoveredNoteIndex] || 0;
        const forms = cadencesUsingNote(note.numeral);
        return ReactDOM.createPortal(
            <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                <div className="tooltip-header">
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: note.color, border: '1px solid rgba(255,255,255,0.4)', marginRight: '6px', boxShadow: `0 0 6px ${note.glow}` }} />
                    {note.name}
                    <span style={{ fontSize: '0.7rem', color: 'rgba(58,42,26,0.5)', marginLeft: '4px' }}>{note.numeral}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.9rem', fontWeight: 700, color: note.color }}>{count}/{maxPerNote}</span>
                </div>
                <div className="tooltip-section">
                    <div className="tooltip-label" style={{ color: note.color }}>{note.function}</div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(58,42,26,0.85)' }}>{note.description}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(58,42,26,0.55)', fontStyle: 'italic', marginTop: '4px' }}>Generated by: {note.generatedBy}</div>
                </div>
                {forms.length > 0 && (
                    <>
                        <div className="tooltip-divider" />
                        <div className="tooltip-section">
                            <div className="tooltip-label">Used In Cadences ({forms.length})</div>
                            <div style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                                {forms.map(f => {
                                    const ready = isCadenceReady(f);
                                    const needStr = Object.entries(f.notes)
                                        .map(([numeral, cnt]) => `${numeral}×${cnt}`)
                                        .join(', ');
                                    return (
                                        <div key={f.id} style={{ display: 'flex', gap: '4px', alignItems: 'baseline', marginBottom: '2px' }}>
                                            <span style={{ color: ready ? '#2d8a4e' : 'rgba(58,42,26,0.3)', fontWeight: 700 }}>{ready ? '✓' : '✗'}</span>
                                            <span style={{ flex: 1, color: ready ? 'rgba(58,42,26,0.9)' : 'rgba(58,42,26,0.5)' }}>{f.name}</span>
                                            <span style={{ fontSize: '0.72rem', color: 'rgba(58,42,26,0.4)', fontStyle: 'italic' }}>{needStr}</span>
                                        </div>
                                    );
                                })}
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

    // Single note segment — used by the full-mode staff. Height is inline so
    // it can't be overridden by external CSS (matches Arcanoneer workaround).
    const segmentHeight = showcase ? 95 : (size === 'large' ? 86 : (size === 'small' ? 48 : 64));
    const renderNoteSegment = (note, index) => {
        const count = localNotes[index] || 0;
        const isHovered = hoveredNoteIndex === index;
        return (
            <div
                key={index}
                className={`minstrel-note-segment ${count > 0 ? 'filled' : 'empty'} ${isHovered ? 'hovered' : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    if (!canEdit) return;
                    if (editMenuNoteIndex === index) setEditMenuNoteIndex(null);
                    else setEditMenuNoteIndex(index);
                }}
                onContextMenu={(e) => {
                    if (!canEdit) return;
                    e.preventDefault();
                    e.stopPropagation();
                    adjustNote(index, -1);
                }}
                onMouseEnter={() => setHoveredNoteIndex(index)}
                onMouseLeave={() => setHoveredNoteIndex(null)}
                style={{
                    height: `${segmentHeight}px`,
                    cursor: canEdit ? 'pointer' : 'default',
                    '--note-color': note.color,
                    '--note-glow': note.glow,
                    '--fill-percent': showcase ? `${Math.min((count / maxPerNote) * 100, 100)}%` : '0%',
                }}
            >
                {showcase && count > 0 && <div className="minstrel-note-fill-overlay" />}
                <div className="minstrel-note-pips">
                    {Array.from({ length: maxPerNote }).map((_, p) => (
                        <span key={p} className={`minstrel-note-pip ${p < count ? 'on' : 'off'}`} />
                    ))}
                </div>
                <div className="minstrel-note-label">
                    <span className="minstrel-note-numeral">{note.numeral}</span>
                    <span className="minstrel-note-name">{note.name}</span>
                </div>
                <div className="minstrel-note-count-badge">{count}</div>
            </div>
        );
    };

    // The staff grid (7 segments) — full mode. In showcase mode (rules page)
    // the grid switches to 4 columns so it fits a constrained container.
    const renderNoteGrid = () => {
        const cols = showcase ? 4 : 7;
        return (
            <div className="minstrel-note-grid" ref={barRef} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                {notes.map((note, index) => renderNoteSegment(note, index))}
            </div>
        );
    };

    // Header showing totals + ready count.
    const renderHeader = ({ compact = false } = {}) => (
        <div className="minstrel-header">
            <span className="minstrel-title-label"><i className="fas fa-music" /> Notes</span>
            <div className="minstrel-totals">
                <span className="minstrel-total-count" title="Total notes banked">{totalBanked}/{maxPerNote * 7}</span>
                <span className={`minstrel-ready-badge ${readyCount > 0 ? 'has-ready' : ''}`} title={`${readyCount} cadence${readyCount === 1 ? '' : 's'} ready`}>
                    <i className="fas fa-music" /> {readyCount}
                </span>
            </div>
        </div>
    );

    // Cadence chips — one per progression (all 10). Hover shows a full
    // spellcard tooltip (via SpellTooltip + cadenceToSpell adapter) so
    // players can read the cadence's effect, range, consumed notes, etc.
    // without leaving the bar. Uses fullscreenMode — same foggy-backdrop
    // presentation as action-bar spell hovers and Arcanoneer formulations.
    const handleCadHoverEnter = (entry) => {
        if (cadHideTimeoutRef.current) { clearTimeout(cadHideTimeoutRef.current); cadHideTimeoutRef.current = null; }
        if (cadHoverTimeoutRef.current) clearTimeout(cadHoverTimeoutRef.current);
        cadHoverTimeoutRef.current = setTimeout(() => {
            setHoveredCadence(entry);
        }, 300);
    };
    const handleCadHoverLeave = () => {
        if (cadHoverTimeoutRef.current) clearTimeout(cadHoverTimeoutRef.current);
        cadHideTimeoutRef.current = setTimeout(() => setHoveredCadence(null), 100);
    };
    const handleCadTooltipEnter = () => {
        if (cadHideTimeoutRef.current) { clearTimeout(cadHideTimeoutRef.current); cadHideTimeoutRef.current = null; }
    };
    const handleCadTooltipLeave = () => {
        cadHideTimeoutRef.current = setTimeout(() => setHoveredCadence(null), 100);
    };

    const renderCadenceTooltip = () => {
        if (!hoveredCadence) return null;
        const spell = cadenceToSpell(hoveredCadence, matrix);
        if (!spell) return null;
        return (
            <SpellTooltip
                spell={spell}
                fullscreenMode
                onMouseEnter={handleCadTooltipEnter}
                onMouseLeave={handleCadTooltipLeave}
            />
        );
    };

    const renderCadenceChips = () => {
        if (cadenceEntries.length === 0) return null;
        // Always show all cadences — 10 is a manageable count and players want
        // to read every cadence's spellcard whether or not it's currently
        // resolvable. The ready/locked styling indicates which are spendable
        // given the current note bank. (Arcanoneer filters to ready-only in
        // showcase because it has 36 formulations; Minstrel's 10 don't need it.)
        const visibleEntries = cadenceEntries;
        return (
            <div className="minstrel-cadence-chips">
                {visibleEntries.map(entry => {
                    const ready = isCadenceReady(entry);
                    const costStr = Object.entries(entry.notes)
                        .map(([numeral, cnt]) => `${numeral}${cnt > 1 ? `×${cnt}` : ''}`)
                        .join(' · ');
                    return (
                        <div
                            key={entry.id}
                            className="minstrel-cad-chip-wrapper"
                            onMouseEnter={() => handleCadHoverEnter(entry)}
                            onMouseLeave={handleCadHoverLeave}
                        >
                            <button
                                className={`minstrel-cad-chip ${ready ? 'ready' : ''}`}
                                disabled={!ready || !canEdit}
                                onClick={(e) => { e.stopPropagation(); resolveCadence(entry); }}
                                title={`${entry.name}\n${entry.sequence}\nCost: ${costStr}\n${ready ? '✓ Ready — click to resolve' : '✗ Not enough notes'}`}
                            >
                                <span className="minstrel-cad-chip-name">{entry.name}</span>
                                <span className="minstrel-cad-chip-seq">{entry.sequence}</span>
                                <span className="minstrel-cad-chip-cost">{costStr}</span>
                            </button>
                        </div>
                    );
                })}
                {renderCadenceTooltip()}
            </div>
        );
    };

    // Per-note edit menu (portal) — mirrors Arcanoneer's per-block edit menu.
    const renderEditMenu = () => {
        if (editMenuNoteIndex === null || !barRef.current) return null;
        const note = notes[editMenuNoteIndex];
        if (!note) return null;
        const count = localNotes[editMenuNoteIndex] || 0;
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
                        <div className="context-menu-section-header" style={{ color: note.color }}>
                            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: note.color, marginRight: '6px', boxShadow: `0 0 4px ${note.glow}` }} />
                            {note.name} ({note.numeral})
                            <span style={{ fontSize: '0.75rem', color: 'rgba(58,42,26,0.5)', marginLeft: 'auto' }}>{count}/{maxPerNote}</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'rgba(58,42,26,0.65)', marginBottom: '6px', lineHeight: 1.35 }}>{note.function} — {note.description}</div>

                        <div className="context-menu-section-header" style={{ fontSize: '11px', marginTop: '4px' }}>Set Count</div>
                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(maxPerNote + 1, 6)}, 1fr)`, gap: '3px', marginBottom: '6px' }}>
                            {Array.from({ length: maxPerNote + 1 }).map((_, p) => {
                                const val = p;
                                const isActive = val <= count;
                                return (
                                    <button
                                        key={p}
                                        className={`context-menu-button ${isActive ? 'gain' : ''}`}
                                        onClick={(e) => { e.stopPropagation(); setNoteCount(editMenuNoteIndex, val); }}
                                        disabled={!canEdit}
                                        title={`Set to ${val}`}
                                        style={isActive ? { background: `${note.color}33`, borderColor: note.color } : {}}
                                    >
                                        {val}
                                    </button>
                                );
                            })}
                        </div>

                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button className="context-menu-button" onClick={(e) => { e.stopPropagation(); adjustNote(editMenuNoteIndex, -1); }} disabled={!canEdit || count === 0}>
                                <i className="fas fa-minus-circle"></i> −1
                            </button>
                            <button className="context-menu-button gain" onClick={(e) => { e.stopPropagation(); adjustNote(editMenuNoteIndex, 1); }} disabled={!canEdit || count >= maxPerNote}>
                                <i className="fas fa-plus-circle"></i> +1
                            </button>
                            <button className="context-menu-button" onClick={(e) => { e.stopPropagation(); resetNote(editMenuNoteIndex); }} disabled={!canEdit || count === 0} title="Reset to 0">
                                <i className="fas fa-undo"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    // ========================================================================
    // COMPACT MODE (party-HUD): single thin row + popover panel
    // ========================================================================
    const renderCompactRow = () => (
        <div className={`class-resource-bar musical-notes-combo ${size} party-context`}>
            <div className="minstrel-compact-row" ref={barRef}>
                <div className="minstrel-compact-cells">
                    {notes.map((note, index) => {
                        const count = localNotes[index] || 0;
                        const fillPct = Math.min(100, (count / maxPerNote) * 100);
                        return (
                            <div
                                key={index}
                                className={`minstrel-compact-cell ${count > 0 ? 'filled' : 'empty'}`}
                                onClick={(e) => { e.stopPropagation(); if (canEdit) setShowPanel(true); }}
                                onMouseEnter={() => setHoveredNoteIndex(index)}
                                onMouseLeave={() => setHoveredNoteIndex(null)}
                                title={`${note.name} (${note.numeral}): ${count}`}
                                style={count > 0 ? { '--note-color': note.color, '--note-glow': note.glow } : {}}
                            >
                                <div className="minstrel-compact-fill" style={{ height: `${fillPct}%` }} />
                                <span className="minstrel-compact-glyph">{note.numeral}</span>
                            </div>
                        );
                    })}
                </div>
                <button
                    className={`minstrel-compact-expand ${readyCount > 0 ? 'has-ready' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setShowPanel(!showPanel); }}
                    title={readyCount > 0 ? `${readyCount} cadence${readyCount === 1 ? '' : 's'} ready — open to resolve` : 'Open Notes panel'}
                >
                    <i className={`fas ${showPanel ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
                    <span className="minstrel-compact-banked">{totalBanked}</span>
                    {readyCount > 0 && <span className="minstrel-compact-ready">{readyCount}</span>}
                </button>
            </div>
            {renderHoverTooltip()}
            {renderCompactPanel()}
        </div>
    );

    // Compact popover panel — full edit surface + cadence chips.
    const renderCompactPanel = () => {
        if (!showPanel || !barRef.current) return null;
        const barRect = barRef.current.getBoundingClientRect();
        const panelWidth = 264;
        const panelHeight = 360;
        let left = barRect.right - panelWidth;
        if (left < 6) left = 6;
        if (left + panelWidth > window.innerWidth - 6) left = window.innerWidth - panelWidth - 6;
        const spaceBelow = window.innerHeight - barRect.bottom;
        const top = spaceBelow > panelHeight + 6 ? barRect.bottom + 6 : Math.max(6, barRect.top - panelHeight - 6);
        return ReactDOM.createPortal(
            <div
                ref={panelRef}
                className="unified-context-menu compact minstrel-panel-menu"
                onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation(); }}
                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation(); }}
                style={{ position: 'fixed', top: `${top}px`, left: `${left}px`, width: `${panelWidth}px`, zIndex: 100000 }}
            >
                <div className="context-menu-main">
                    {renderHeader({ compact: true })}
                    <div className="minstrel-panel-section">
                        <div className="minstrel-panel-section-label">Notes</div>
                        <div className="minstrel-panel-notes">
                            {notes.map((note, index) => {
                                const count = localNotes[index] || 0;
                                return (
                                    <div key={index} className="minstrel-panel-note-row" style={{ '--note-color': note.color, '--note-glow': note.glow }}>
                                        <span className="minstrel-panel-note-numeral">{note.numeral}</span>
                                        <span className="minstrel-panel-note-name">{note.name}</span>
                                        <div className="minstrel-panel-note-pips">
                                            {Array.from({ length: maxPerNote }).map((_, p) => (
                                                <span key={p} className={`minstrel-panel-pip ${p < count ? 'on' : 'off'}`} />
                                            ))}
                                        </div>
                                        {canEdit ? (
                                            <div className="minstrel-panel-note-controls">
                                                <button className="minstrel-panel-mini-btn" onClick={(e) => { e.stopPropagation(); adjustNote(index, -1); }} disabled={count === 0}>−</button>
                                                <span className="minstrel-panel-note-count">{count}</span>
                                                <button className="minstrel-panel-mini-btn" onClick={(e) => { e.stopPropagation(); adjustNote(index, 1); }} disabled={count >= maxPerNote}>+</button>
                                            </div>
                                        ) : (
                                            <span className="minstrel-panel-note-count">{count}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="minstrel-panel-section">
                        <div className="minstrel-panel-section-label">Cadences ({readyCount} ready)</div>
                        {renderCadenceChips()}
                    </div>
                    <div className="minstrel-panel-footer">
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
    // FULL MODE: header + note grid + (collapsible) cadence chips
    // ========================================================================
    const renderCadenceSection = () => {
        // In showcase mode (rules page), collapse the cadence chips behind a
        // toggle so the demo reads as a staff first. Detail available on demand.
        if (showcase) {
            return (
                <div className="minstrel-cadence-collapsible">
                    <button
                        className="minstrel-cadence-toggle"
                        onClick={(e) => { e.stopPropagation(); setShowCadences(!showCadences); }}
                        title={showCadences ? 'Hide cadences' : 'Show all 10 cadences'}
                    >
                        <i className={`fas ${showCadences ? 'fa-chevron-up' : 'fa-music'}`} />
                        <span>{showCadences ? 'Hide' : 'Show'} Available Cadences</span>
                        {readyCount > 0 && <span className="minstrel-cadence-toggle-count">{readyCount} ready</span>}
                    </button>
                    {showCadences && renderCadenceChips()}
                </div>
            );
        }
        return renderCadenceChips();
    };

    const renderFull = () => (
        <div className={`class-resource-bar musical-notes-combo ${size} ${showcase ? 'showcase-mode' : ''}`}>
            <div className="minstrel-container">
                {renderHeader()}
                {renderNoteGrid()}
                {renderCadenceSection()}
                {!showcase && canEdit && (
                    <div className="minstrel-footer">
                        <button className="minstrel-footer-btn" onClick={(e) => { e.stopPropagation(); clearAll(); }} disabled={totalBanked === 0}>
                            <i className="fas fa-times" /> Clear All
                        </button>
                    </div>
                )}
            </div>
            {renderHoverTooltip()}
            {renderEditMenu()}
        </div>
    );

    if (isCompact) {
        return renderCompactRow();
    }
    return renderFull();
};

export default MinstrelResourceBar;
