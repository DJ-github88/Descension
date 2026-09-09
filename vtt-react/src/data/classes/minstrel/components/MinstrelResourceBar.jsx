import React, { useState, useRef, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/MinstrelResourceBar.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import ClassTip from '../../../../components/hud/ClassTip';
import SpellTooltip from '../../../../components/spellcrafting-wizard/components/common/SpellTooltip';
import { cadenceToSpell } from '../cadenceToSpell';

/**
 * MinstrelResourceBar, the "Musical Notes & Cadences" resource system.
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
 *     without leaving the bar, same UX as Arcanoneer formulation chips.
 *   - Click a ready cadence to consume its notes and log the resolution.
 *     Does NOT auto-cast the learned spell, that's still done via the
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
    // dispatcher, we don't import minstrelData directly (avoids circular deps
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
    // Cadences are collapsed by default behind an extend toggle so the bar remains compact in the header.
    const [showCadences, setShowCadences] = useState(false);
    // Cadence spellcard hover, shows a full-screen foggy spellcard (same UX
    // as hovering spells in the action bar / Arcanoneer formulations) via
    // SpellTooltip's fullscreenMode.
    const [hoveredCadence, setHoveredCadence] = useState(null);
    const [showStaffTooltip, setShowStaffTooltip] = useState(false);
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

    // Close panel and edit menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showPanel) {
                const inPanel = panelRef.current && panelRef.current.contains(e.target);
                const inBar = barRef.current && barRef.current.contains(e.target);
                if (!inPanel && !inBar) {
                    setShowPanel(false);
                }
            }
            if (editMenuNoteIndex !== null) {
                const inMenu = editMenuRef.current && editMenuRef.current.contains(e.target);
                const inBar = barRef.current && barRef.current.contains(e.target);
                if (!inMenu && !inBar) {
                    setEditMenuNoteIndex(null);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPanel, editMenuNoteIndex]);

    // Shared tooltip hook positions the tooltip portal centered above/below the bar.
    const tooltipRef = useResourceBarTooltip(
        barRef,
        (hoveredNoteIndex !== null || showStaffTooltip) && !showPanel && editMenuNoteIndex === null,
        [hoveredNoteIndex, showStaffTooltip, showPanel, editMenuNoteIndex, localNotes],
        {
            preferredWidth: 320,
            preferredHeight: 260,
        }
    );

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
     * Doesn't directly fire the learned spell, that's the action bar's job
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

    // Tooltip content for the currently-hovered note, using the shared
    // ClassTip body (Mechanic / Right now / Use) inside the standard
    // tooltip shell so every class reads the same way.
    const renderHoverTooltip = () => {
        if (showPanel || editMenuNoteIndex !== null) return null;
        if (hoveredNoteIndex === null && !showStaffTooltip) return null;

        if (hoveredNoteIndex !== null) {
            const note = notes[hoveredNoteIndex];
            if (!note) return null;
            const count = localNotes[hoveredNoteIndex] || 0;
            const forms = cadencesUsingNote(note.numeral);
            const readyForms = forms.filter(isCadenceReady);
            return ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip minstrel-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none', zIndex: 100000 }}>
                    <ClassTip
                        icon="fas fa-music"
                        tint={note.color}
                        title={`${note.name} (${note.numeral})`}
                        subtitle="Minstrel Musical Note"
                        state={`${count}/${maxPerNote}`}
                        stateTone={count > 0 ? 'good' : 'neutral'}
                        mechanic={`${note.function} — ${note.description} Generated by ${note.generatedBy}.`}
                        status={[
                            count > 0
                                ? `${count} banked — spendable in cadences.`
                                : 'Empty — play builders to bank this note.',
                            readyForms.length > 0
                                ? `Ready: ${readyForms.map(f => f.name).join(', ')}.`
                                : forms.length > 0
                                    ? `No cadence ready — needs partner notes (${forms.length} use this note).`
                                    : null,
                        ]}
                        usage={canEdit ? 'Click note to cycle · Right-click −1 · ♫ opens ledger.' : null}
                    />
                </div>,
                document.body
            );
        }

        // General Minstrel Staff Overview
        const readyCadences = cadenceEntries.filter(isCadenceReady);
        return ReactDOM.createPortal(
            <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip minstrel-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none', zIndex: 100000 }}>
                <ClassTip
                    icon="fas fa-music"
                    tint="#ec4899"
                    title="Minstrel Musical Stave"
                    subtitle="Cadence Engine & Harmonic Weave"
                    state={`${totalBanked} Notes Banked`}
                    stateTone={readyCadences.length > 0 ? 'good' : totalBanked > 0 ? 'neutral' : 'neutral'}
                    mechanic="Ascending musical staff with 7 pitch stations (I through VII). Bank notes through performance abilities to assemble harmonic cadences."
                    status={[
                        `Stave: ${totalBanked} note(s) currently held in harmony.`,
                        readyCadences.length > 0
                            ? `Ready Cadences: ${readyCadences.map(c => c.name).join(', ')}.`
                            : 'No complete cadences formed. Bank complementary pitches on the staff to weave cadences.',
                        'Hover individual pitch stations or click CADENCE bell to explore melodies.'
                    ]}
                    usage="Click note to increment · Right-click to decrement · Click CADENCE bell for songbook"
                    hint="Minstrels string individual melodic notes into harmonious cadences that inspire allies or unbalance foes."
                />
            </div>,
            document.body
        );
    };

    // Single note segment, used by the full-mode staff. Height is inline so
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

    // The staff grid (7 segments), full mode. In showcase mode (rules page)
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
                <span
                    className={`minstrel-ready-badge ${readyCount > 0 ? 'has-ready' : ''}`}
                    title={readyCount > 0 ? `${readyCount} cadence${readyCount === 1 ? '' : 's'} ready (click to toggle)` : 'Click to toggle cadences'}
                    onClick={(e) => { e.stopPropagation(); setShowCadences(!showCadences); }}
                    style={{ cursor: 'pointer' }}
                >
                    <i className="fas fa-music" /> {readyCount}
                </span>
            </div>
        </div>
    );

    // Cadence chips, one per progression (all 10). Hover shows a full
    // spellcard tooltip (via SpellTooltip + cadenceToSpell adapter) so
    // players can read the cadence's effect, range, consumed notes, etc.
    // without leaving the bar. Uses fullscreenMode, same foggy-backdrop
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
        // Always show all cadences, 10 is a manageable count and players want
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
                                title={`${entry.name}\n${entry.sequence}\nCost: ${costStr}\n${ready ? '✓ Ready, click to resolve' : '✗ Not enough notes'}`}
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

    // Per-note edit menu (portal), mirrors Arcanoneer's per-block edit menu.
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
                className="unified-context-menu compact context-menu-container minstrel-menu-container note-menu"
                onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation(); }}
                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation(); }}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseMove={(e) => e.stopPropagation()}
                onMouseOver={(e) => e.stopPropagation()}
                style={{ position: 'fixed', top: `${top}px`, left: `${left}px`, width: `${menuWidth}px`, zIndex: 100000 }}
            >
                <div className="context-menu-main">
                    <div className="context-menu-section">
                        <div className="context-menu-section-header" style={{ color: note.color }}>
                            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: note.color, marginRight: '6px', boxShadow: `0 0 4px ${note.glow}` }} />
                            {note.name} ({note.numeral})
                            <span style={{ fontSize: '0.75rem', color: 'rgba(58,42,26,0.5)', marginLeft: 'auto' }}>{count}/{maxPerNote}</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'rgba(58,42,26,0.65)', marginBottom: '6px', lineHeight: 1.35 }}>{note.function}, {note.description}</div>

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
    // COMPACT MODE (party-HUD): Illuminated Scale Stave SVG Prototype
    // ========================================================================
    // ========================================================================
    // COMPACT MODE (party-HUD): Illuminated Grand Stave & Cadence Folio
    // ========================================================================
    const renderCompactRow = () => {
        // Grand 76px fantasy soundboard folio:
        // Ornate gilded rosewood soundboard, left lyre/treble clef,
        // 5 golden staff lines with 7 ascending jewel note stations,
        // discrete illuminated pip beads per note, harmonic ligature chord arcs,
        // and right cadence resonator bell.
        const pitchYs = [55, 48, 41, 34, 27, 20, 13];
        const pitchXs = [32, 62, 92, 122, 152, 182, 212];

        // Find active ready cadence connections for ligature curves
        const firstReadyCadence = cadenceEntries.find(entry => isCadenceReady(entry));
        let readyNoteIndices = [];
        if (firstReadyCadence) {
            readyNoteIndices = Object.keys(firstReadyCadence.notes)
                .map(numeral => notes.findIndex(n => n.numeral === numeral))
                .filter(idx => idx !== -1)
                .sort((a, b) => a - b);
        }

        return (
            <div className={`class-resource-bar musical-notes-combo ${size} party-context`}>
                <div
                    className="minstrel-compact-row minstrel-stave-row"
                    ref={barRef}
                    onMouseEnter={() => setShowStaffTooltip(true)}
                    onMouseLeave={() => setShowStaffTooltip(false)}
                >
                    <svg
                        className="minstrel-stave-svg"
                        viewBox="0 0 292 76"
                        preserveAspectRatio="xMidYMid meet"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <filter id="minstrelStaffGlow" x="-25%" y="-25%" width="150%" height="150%">
                                <feGaussianBlur stdDeviation="1.6" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            <linearGradient id="minstrelStaffWood" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#24150e" />
                                <stop offset="40%" stopColor="#170c07" />
                                <stop offset="85%" stopColor="#0f0704" />
                                <stop offset="100%" stopColor="#080402" />
                            </linearGradient>
                            <linearGradient id="minstrelGoldBorder" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#b45309" />
                                <stop offset="25%" stopColor="#f59e0b" />
                                <stop offset="50%" stopColor="#fef08a" />
                                <stop offset="75%" stopColor="#d97706" />
                                <stop offset="100%" stopColor="#78350f" />
                            </linearGradient>
                            <linearGradient id="minstrelResonatorBed" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#1a0f08" />
                                <stop offset="50%" stopColor="#120a05" />
                                <stop offset="100%" stopColor="#0a0503" />
                            </linearGradient>
                        </defs>

                        {/* Chassis Base Plate with Soft Outer Glow & Bevel */}
                        <rect
                            x="1.5"
                            y="1.5"
                            width="289"
                            height="73"
                            rx="6"
                            fill="url(#minstrelStaffWood)"
                            stroke="url(#minstrelGoldBorder)"
                            strokeWidth="1.2"
                            className="minstrel-chassis-base"
                        />

                        {/* Inner Etched Bevel Inset */}
                        <rect
                            x="3.5"
                            y="3.5"
                            width="285"
                            height="69"
                            rx="4.5"
                            fill="none"
                            stroke="rgba(251, 191, 36, 0.22)"
                            strokeWidth="0.75"
                            pointerEvents="none"
                        />

                        {/* Corner Rivet Studs */}
                        <circle cx="6" cy="6" r="1.8" fill="#78350f" stroke="#fde047" strokeWidth="0.5" pointerEvents="none" />
                        <line x1="4.9" y1="6" x2="7.1" y2="6" stroke="#fde047" strokeWidth="0.5" pointerEvents="none" />
                        <circle cx="286" cy="6" r="1.8" fill="#78350f" stroke="#fde047" strokeWidth="0.5" pointerEvents="none" />
                        <line x1="284.9" y1="6" x2="287.1" y2="6" stroke="#fde047" strokeWidth="0.5" pointerEvents="none" />
                        <circle cx="6" cy="70" r="1.8" fill="#78350f" stroke="#fde047" strokeWidth="0.5" pointerEvents="none" />
                        <line x1="4.9" y1="70" x2="7.1" y2="70" stroke="#fde047" strokeWidth="0.5" pointerEvents="none" />
                        <circle cx="286" cy="70" r="1.8" fill="#78350f" stroke="#fde047" strokeWidth="0.5" pointerEvents="none" />
                        <line x1="284.9" y1="70" x2="287.1" y2="70" stroke="#fde047" strokeWidth="0.5" pointerEvents="none" />

                        {/* Filigree Corner Flourishes */}
                        <path d="M 5 14 L 14 5 M 5 62 L 14 71 M 287 14 L 278 5 M 287 62 L 278 71" stroke="rgba(251,191,36,0.35)" strokeWidth="0.9" fill="none" pointerEvents="none" />

                        {/* =================================================== */}
                        {/* 5 GOLDEN MUSICAL STAFF LINES (EXPANDED TO FULL STAVE)*/}
                        {/* =================================================== */}
                        {[20, 27, 34, 41, 48].map((lineY, idx) => (
                            <line
                                key={idx}
                                x1="18"
                                y1={lineY}
                                x2="228"
                                y2={lineY}
                                stroke="rgba(245, 158, 11, 0.48)"
                                strokeWidth="0.75"
                            />
                        ))}

                        {/* Stave Start Barlines */}
                        <line x1="18" y1="18" x2="18" y2="50" stroke="url(#minstrelGoldBorder)" strokeWidth="1.2" />
                        <line x1="20.5" y1="18" x2="20.5" y2="50" stroke="rgba(251, 191, 36, 0.45)" strokeWidth="0.6" />

                        {/* Stave End Barlines */}
                        <line x1="225.5" y1="18" x2="225.5" y2="50" stroke="rgba(251, 191, 36, 0.45)" strokeWidth="0.6" />
                        <line x1="228" y1="18" x2="228" y2="50" stroke="url(#minstrelGoldBorder)" strokeWidth="1.2" />

                        {/* Low-note Ledger Line (Note I sits on ledger at y = 55) */}
                        <line x1="22" y1="55" x2="42" y2="55" stroke="rgba(245, 158, 11, 0.65)" strokeWidth="0.8" />
                        {/* High-note Ledger Line (Note VII sits on ledger at y = 13) */}
                        <line x1="202" y1="13" x2="222" y2="13" stroke="rgba(245, 158, 11, 0.65)" strokeWidth="0.8" />

                        {/* Harmonic Ligature Curve if Cadence is ready */}
                        {readyNoteIndices.length >= 2 && (
                            <g className="minstrel-harmonic-ligatures" pointerEvents="none">
                                <path
                                    d={`M ${pitchXs[readyNoteIndices[0]]} ${pitchYs[readyNoteIndices[0]] - 7} Q ${(pitchXs[readyNoteIndices[0]] + pitchXs[readyNoteIndices[readyNoteIndices.length - 1]]) / 2} 4, ${pitchXs[readyNoteIndices[readyNoteIndices.length - 1]]} ${pitchYs[readyNoteIndices[readyNoteIndices.length - 1]] - 7}`}
                                    fill="none"
                                    stroke="url(#minstrelGoldBorder)"
                                    strokeWidth="1.8"
                                    strokeDasharray="4 2"
                                    opacity="0.95"
                                    filter="url(#minstrelStaffGlow)"
                                />
                                <path
                                    d={`M ${pitchXs[readyNoteIndices[0]]} ${pitchYs[readyNoteIndices[0]] - 7} Q ${(pitchXs[readyNoteIndices[0]] + pitchXs[readyNoteIndices[readyNoteIndices.length - 1]]) / 2} 4, ${pitchXs[readyNoteIndices[readyNoteIndices.length - 1]]} ${pitchYs[readyNoteIndices[readyNoteIndices.length - 1]] - 7}`}
                                    fill="none"
                                    stroke="#fde047"
                                    strokeWidth="0.75"
                                    opacity="1"
                                />
                            </g>
                        )}

                        {/* =================================================== */}
                        {/* 7 ASCENDING PITCH STATIONS (I through VII)          */}
                        {/* =================================================== */}
                        {notes.map((note, index) => {
                            const count = localNotes[index] || 0;
                            const noteX = pitchXs[index];
                            const noteY = pitchYs[index];
                            const isFilled = count > 0;
                            const isHovered = hoveredNoteIndex === index;
                            // Real notation: high notes (cy <= 30) take down-stems, low notes take up-stems
                            const stemDown = noteY <= 30;
                            const stemEnd = stemDown ? noteY + 16 : noteY - 16;
                            const stemX = stemDown ? noteX - 4.8 : noteX + 4.8;

                            return (
                                <g
                                    key={index}
                                    className={`svg-note-station station-${note.numeral} ${isFilled ? 'active' : 'dormant'} ${isHovered ? 'hovered' : ''}`}
                                    onMouseEnter={(e) => { e.stopPropagation(); setHoveredNoteIndex(index); }}
                                    onMouseLeave={(e) => { e.stopPropagation(); setHoveredNoteIndex(null); }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!canEdit) return;
                                        const next = count >= maxPerNote ? 0 : count + 1;
                                        setNoteCount(index, next);
                                    }}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (!canEdit) return;
                                        adjustNote(index, -1);
                                    }}
                                    style={{ cursor: canEdit ? 'pointer' : 'default' }}
                                >
                                    {/* Generous invisible click target (28px wide >= 26px for smoke test, full height) */}
                                    <rect
                                        x={noteX - 14}
                                        y="2"
                                        width="28"
                                        height="72"
                                        fill="transparent"
                                        pointerEvents="all"
                                    />

                                    {/* Hover Ring feedback */}
                                    {isHovered && (
                                        <circle
                                            cx={noteX}
                                            cy={noteY}
                                            r="11"
                                            fill={note.color}
                                            opacity="0.22"
                                            stroke={note.color}
                                            strokeWidth="0.8"
                                            strokeDasharray="3 2"
                                            pointerEvents="none"
                                        />
                                    )}

                                    {/* Soundwave concentric ripple when filled */}
                                    {isFilled && (
                                        <circle
                                            cx={noteX}
                                            cy={noteY}
                                            r="10.5"
                                            fill="none"
                                            stroke={note.glow}
                                            strokeWidth="0.6"
                                            strokeDasharray="3 2"
                                            opacity={isHovered ? "0.85" : "0.35"}
                                            pointerEvents="none"
                                        />
                                    )}

                                    {/* Note Head: Empty Watermark Socket vs Active Glowing Jewel */}
                                    <ellipse
                                        cx={noteX}
                                        cy={noteY}
                                        rx="5.8"
                                        ry="4"
                                        transform={`rotate(-22 ${noteX} ${noteY})`}
                                        fill={isFilled ? note.color : "rgba(22, 13, 8, 0.75)"}
                                        stroke={isFilled ? (isHovered ? "#ffffff" : note.glow) : "rgba(180, 130, 70, 0.38)"}
                                        strokeWidth={isFilled ? "1.2" : "0.75"}
                                        filter={isFilled ? "url(#minstrelStaffGlow)" : undefined}
                                        pointerEvents="none"
                                    />

                                    {/* Specular Highlight Sheen on Filled Note Head */}
                                    {isFilled && (
                                        <ellipse
                                            cx={noteX - 1.6}
                                            cy={noteY - 1.2}
                                            rx="3.5"
                                            ry="1.8"
                                            transform={`rotate(-22 ${noteX} ${noteY})`}
                                            fill="rgba(255, 255, 255, 0.45)"
                                            pointerEvents="none"
                                        />
                                    )}

                                    {/* Note Stem */}
                                    <line
                                        x1={stemX}
                                        y1={noteY}
                                        x2={stemX}
                                        y2={stemEnd}
                                        stroke={isFilled ? note.color : "rgba(180, 130, 70, 0.25)"}
                                        strokeWidth={isFilled ? "1.5" : "0.8"}
                                        strokeDasharray={isFilled ? undefined : "2 2"}
                                        strokeLinecap="round"
                                        pointerEvents="none"
                                    />

                                    {/* Note Flag for single notes */}
                                    {isFilled && (
                                        <path
                                            d={stemDown
                                                ? `M ${stemX} ${stemEnd} C ${stemX + 4} ${stemEnd - 4} ${stemX + 5} ${stemEnd - 8} ${stemX + 1} ${stemEnd - 11}`
                                                : `M ${stemX} ${stemEnd} C ${stemX + 4} ${stemEnd + 4} ${stemX + 5} ${stemEnd + 8} ${stemX + 1} ${stemEnd + 11}`
                                            }
                                            fill="none"
                                            stroke={note.color}
                                            strokeWidth="1.3"
                                            strokeLinecap="round"
                                            pointerEvents="none"
                                        />
                                    )}

                                    {/* 5-Pip Banked Gauge Beads */}
                                    <g className="minstrel-station-pips" pointerEvents="none">
                                        {Array.from({ length: maxPerNote }, (_, p) => {
                                            const pipX = noteX - 8 + p * 4;
                                            const pipY = 68.5;
                                            const isPipFilled = p < count;
                                            return (
                                                <circle
                                                    key={p}
                                                    cx={pipX}
                                                    cy={pipY}
                                                    r={isPipFilled ? 1.4 : 1.1}
                                                    fill={isPipFilled ? note.color : "rgba(75, 45, 25, 0.6)"}
                                                    stroke={isPipFilled ? (isHovered ? "#ffffff" : note.glow) : "rgba(180, 130, 70, 0.3)"}
                                                    strokeWidth="0.5"
                                                    filter={isPipFilled ? "url(#minstrelStaffGlow)" : undefined}
                                                />
                                            );
                                        })}
                                    </g>

                                    {/* Roman Numeral & Count Badge */}
                                    <text
                                        className="svg-note-numeral"
                                        x={noteX}
                                        y="63"
                                        textAnchor="middle"
                                        fill={isFilled ? note.color : "rgba(180, 140, 100, 0.6)"}
                                        fontSize="8.5"
                                        fontWeight={isFilled ? "800" : "600"}
                                        fontFamily="'Cinzel', serif"
                                        letterSpacing="0.2"
                                        pointerEvents="none"
                                    >
                                        {note.numeral}
                                        {isFilled && count > 1 && (
                                            <tspan fontSize="7.2" fontWeight="700" fill="#fde047">{`×${count}`}</tspan>
                                        )}
                                    </text>
                                </g>
                            );
                        })}

                        {/* =================================================== */}
                        {/* RIGHT SECTION: INLAID ACOUSTIC CADENCE ROSETTE SEAL */}
                        {/* =================================================== */}
                        <g
                            className={`minstrel-cadence-seal ${readyCount > 0 ? 'has-ready' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowPanel(prev => !prev);
                            }}
                            style={{ cursor: 'pointer' }}
                            title="Click to open Minstrel Cadence Spells (drag to Action Bar or resolve)"
                        >
                            {/* Transparent generous hit area */}
                            <circle cx="260" cy="38" r="26" fill="transparent" pointerEvents="all" />

                            {/* Inlaid Circular Medallion (Flush with soundboard, no popout) */}
                            <circle
                                cx="260"
                                cy="38"
                                r="23"
                                fill={readyCount > 0 ? "rgba(22, 38, 22, 0.88)" : "rgba(18, 10, 6, 0.75)"}
                                stroke={readyCount > 0 ? "url(#minstrelGoldBorder)" : "rgba(180, 130, 80, 0.45)"}
                                strokeWidth={readyCount > 0 ? "1.4" : "0.9"}
                                filter={readyCount > 0 ? "url(#minstrelStaffGlow)" : undefined}
                            />
                            {/* Inner Etched Concentric Rosette */}
                            <circle
                                cx="260"
                                cy="38"
                                r="20"
                                fill="none"
                                stroke={readyCount > 0 ? "rgba(254, 240, 138, 0.6)" : "rgba(217, 119, 6, 0.25)"}
                                strokeWidth="0.6"
                                strokeDasharray="3 2"
                            />

                            {/* Primary Status Text - balanced vertical fit */}
                            <text
                                x="260"
                                y="35"
                                textAnchor="middle"
                                fill={readyCount > 0 ? "#86efac" : "#fde68a"}
                                fontFamily="'Cinzel', serif"
                                fontSize="9"
                                fontWeight="800"
                                letterSpacing="0.2"
                                filter={readyCount > 0 ? "url(#minstrelStaffGlow)" : undefined}
                                pointerEvents="none"
                            >
                                {readyCount > 0 ? `♫ ${readyCount} RDY` : `♫ ${totalBanked}`}
                            </text>

                            {/* Subtitle Action Text */}
                            <text
                                x="260"
                                y="45"
                                textAnchor="middle"
                                fill={readyCount > 0 ? "#fef08a" : "rgba(217, 119, 6, 0.75)"}
                                fontFamily="'Cinzel', serif"
                                fontSize="6.5"
                                fontWeight="700"
                                letterSpacing="0.8"
                                pointerEvents="none"
                            >
                                CADENCE
                            </text>
                        </g>
                    </svg>
                </div>
                {renderHoverTooltip()}
                {renderCompactPanel()}
            </div>
        );
    };

    // Compact popover panel: full interactive Cadence Spells console + note tuner
    const renderCompactPanel = () => {
        if (!showPanel || !barRef.current) return null;
        const barRect = barRef.current.getBoundingClientRect();
        const frame = barRef.current.closest('.party-member-frame') || barRef.current.closest('.party-hud');
        const frameRect = frame ? frame.getBoundingClientRect() : barRect;
        const panelWidth = Math.min(310, Math.round(frameRect.width) || 310);

        let left = frame ? frameRect.left : (barRect.left + (barRect.width / 2) - (panelWidth / 2));
        if (left < 10) left = 10;
        if (left + panelWidth > window.innerWidth - 10) left = window.innerWidth - panelWidth - 10;

        const spaceBelow = window.innerHeight - (frame ? frameRect.bottom : barRect.bottom);
        const top = spaceBelow > 380
            ? (frame ? frameRect.bottom + 4 : barRect.bottom + 8)
            : Math.max(10, (frame ? frameRect.top : barRect.top) - 400);

        return ReactDOM.createPortal(
            <div
                ref={panelRef}
                className="minstrel-cadence-modal minstrel-menu-container"
                onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation(); }}
                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation(); }}
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseMove={(e) => e.stopPropagation()}
                onMouseOver={(e) => e.stopPropagation()}
                style={{
                    position: 'fixed',
                    top: `${top}px`,
                    left: `${left}px`,
                    width: `${panelWidth}px`,
                    zIndex: 100000
                }}
            >
                {/* Modal Header */}
                <div className="minstrel-modal-header">
                    <div className="minstrel-modal-title-row">
                        <span className="minstrel-modal-title">
                            <i className="fas fa-music" style={{ color: '#f59e0b', marginRight: '6px' }} />
                            Minstrel Cadences
                        </span>
                        <span className={`minstrel-modal-ready-pill ${readyCount > 0 ? 'ready' : ''}`}>
                            {readyCount > 0 ? `♫ ${readyCount} READY` : `${totalBanked} NOTES`}
                        </span>
                        <button
                            type="button"
                            className="minstrel-modal-close-btn"
                            onClick={(e) => { e.stopPropagation(); setShowPanel(false); }}
                            title="Close"
                        >
                            <i className="fas fa-times" />
                        </button>
                    </div>
                    <div className="minstrel-modal-subtitle">
                        Drag any cadence to your Action Bar, or click Resolve to spend notes.
                    </div>
                </div>

                {/* Banked Notes Quick Tuner Strip */}
                <div className="minstrel-modal-notes-strip">
                    <div className="minstrel-notes-strip-header">
                        <span>Banked Notes:</span>
                        <span style={{ fontSize: '10px', opacity: 0.7 }}>Click +/− to adjust</span>
                    </div>
                    <div className="minstrel-notes-strip-cells">
                        {notes.map((note, index) => {
                            const count = localNotes[index] || 0;
                            return (
                                <div
                                    key={index}
                                    className={`minstrel-strip-cell ${count > 0 ? 'active' : ''}`}
                                    style={{ '--cell-color': note.color, '--cell-glow': note.glow }}
                                >
                                    <span className="strip-cell-numeral">{note.numeral}</span>
                                    <span className="strip-cell-count">{count}</span>
                                    {canEdit && (
                                        <div className="strip-cell-btns">
                                            <button
                                                className="strip-btn minus"
                                                onClick={(e) => { e.stopPropagation(); adjustNote(index, -1); }}
                                                disabled={count === 0}
                                                title={`Decrease ${note.numeral}`}
                                            >
                                                −
                                            </button>
                                            <button
                                                className="strip-btn plus"
                                                onClick={(e) => { e.stopPropagation(); adjustNote(index, 1); }}
                                                disabled={count >= maxPerNote}
                                                title={`Increase ${note.numeral}`}
                                            >
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 10 Cadences Scrollable List */}
                <div className="minstrel-modal-cadences-list">
                    {cadenceEntries.map((entry) => {
                        const ready = isCadenceReady(entry);
                        const spell = cadenceToSpell(entry, matrix);

                        return (
                            <div
                                key={entry.id}
                                className={`minstrel-cadence-entry-card ${ready ? 'ready' : 'locked'}`}
                                draggable={true}
                                onDragStart={(e) => {
                                    if (!spell) return;
                                    e.dataTransfer.setData('application/json', JSON.stringify(spell));
                                    e.dataTransfer.setData('text/plain', JSON.stringify(spell));
                                    e.dataTransfer.effectAllowed = 'copy';
                                }}
                                onMouseEnter={() => handleCadHoverEnter(entry)}
                                onMouseLeave={handleCadHoverLeave}
                                title={`${entry.name} (${entry.sequence})\nDrag to your Action Bar!`}
                            >
                                {/* Drag Grip Handle */}
                                <div className="cadence-drag-handle" title="Drag to Action Bar">
                                    <i className="fas fa-grip-vertical" />
                                </div>

                                {/* Content Details */}
                                <div className="cadence-entry-info">
                                    <div className="cadence-entry-title-row">
                                        <span className="cadence-entry-name">{entry.name}</span>
                                        <span className={`cadence-entry-badge ${ready ? 'ready' : 'locked'}`}>
                                            {ready ? '✓ READY' : 'LOCKED'}
                                        </span>
                                    </div>
                                    <div className="cadence-entry-sequence">{entry.sequence}</div>

                                    {/* Note Cost Badges */}
                                    <div className="cadence-note-pills">
                                        {Object.entries(entry.notes).map(([numeral, reqCount]) => {
                                            const noteIdx = notes.findIndex(n => n.numeral === numeral);
                                            const noteObj = noteIdx !== -1 ? notes[noteIdx] : null;
                                            const bankedCount = noteIdx !== -1 ? (localNotes[noteIdx] || 0) : 0;
                                            const isMet = bankedCount >= reqCount;
                                            return (
                                                <span
                                                    key={numeral}
                                                    className={`cadence-note-pill ${isMet ? 'met' : 'unmet'}`}
                                                    style={{
                                                        borderColor: noteObj?.color || '#ffd43f',
                                                        color: isMet ? '#ffffff' : (noteObj?.color || '#ffd43f')
                                                    }}
                                                >
                                                    {numeral}×{reqCount} {isMet ? '✓' : `(${bankedCount}/${reqCount})`}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Actions on the right */}
                                <div className="cadence-entry-actions">
                                    <button
                                        type="button"
                                        className="cadence-bar-add-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!spell) return;
                                            window.dispatchEvent(new CustomEvent('spell-action-bar-assign-item', {
                                                detail: { spell, autoFindSlot: true }
                                            }));
                                            useChatStore.getState().addCombatNotification?.({
                                                type: 'system',
                                                sender: 'Action Bar',
                                                content: `Added ${entry.name} to Action Bar.`,
                                                timestamp: new Date().toISOString()
                                            });
                                        }}
                                        title="Add to Action Bar"
                                    >
                                        <i className="fas fa-plus" /> Bar
                                    </button>

                                    <button
                                        type="button"
                                        className={`cadence-resolve-btn ${ready ? 'ready' : ''}`}
                                        disabled={!ready || !canEdit}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            resolveCadence(entry);
                                        }}
                                        title={ready ? `Resolve ${entry.name}` : 'Not enough notes to resolve'}
                                    >
                                        Resolve
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Modal Footer */}
                <div className="minstrel-modal-footer">
                    {canEdit && (
                        <button
                            type="button"
                            className="minstrel-modal-clear-btn"
                            onClick={(e) => { e.stopPropagation(); clearAll(); }}
                            disabled={totalBanked === 0}
                        >
                            <i className="fas fa-undo" /> Clear Notes
                        </button>
                    )}
                    <button
                        type="button"
                        className="minstrel-modal-done-btn"
                        onClick={(e) => { e.stopPropagation(); setShowPanel(false); }}
                    >
                        Done
                    </button>
                </div>

                {renderCadenceTooltip()}
            </div>,
            document.body
        );
    };

    // ========================================================================
    // FULL MODE: header + note grid + (collapsible) cadence chips
    // ========================================================================
    const renderCadenceSection = () => (
        <div className="minstrel-cadence-collapsible">
            <button
                className="minstrel-cadence-toggle"
                onClick={(e) => { e.stopPropagation(); setShowCadences(!showCadences); }}
                title={showCadences ? 'Hide cadences' : 'Show all 10 cadences'}
            >
                <i className={`fas ${showCadences ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
                <span>{showCadences ? 'Hide Cadences' : 'Show Available Cadences (10)'}</span>
                {readyCount > 0 && <span className="minstrel-cadence-toggle-count">{readyCount} ready</span>}
            </button>
            {showCadences && renderCadenceChips()}
        </div>
    );

    const renderFull = () => (
        <div className={`class-resource-bar musical-notes-combo ${size} ${showcase ? 'showcase-mode' : ''}`}>
            <div
                className="minstrel-container"
                ref={barRef}
                onMouseEnter={() => setShowStaffTooltip(true)}
                onMouseLeave={() => setShowStaffTooltip(false)}
            >
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
