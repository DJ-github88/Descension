import React, { useState, useRef, useEffect, useCallback } from 'react';
import MythrillWindow from './MythrillWindow';
import useCharacterStore from '../../store/characterStore';
import useSpellbookStore from '../../store/spellbookStore';
import { CLASS_SPECIALIZATIONS } from '../../data/classSpellCategories';
import { getTalentsForSpec, getTreeBackdrop, getFallbackBackground } from '../../data/talentTreeData';
import { resolveTalentSpell, convertTalentSpellToLibrarySpell } from '../../data/talentTrees/talentSystem.mjs';
import { loadLibraryFromStorage, saveLibraryToStorage } from '../spellcrafting-wizard/core/utils/libraryManager';
import { TalentArrowRenderer } from './TalentArrow';
import UnifiedTooltip from '../common/UnifiedTooltip';
import useUnifiedTooltip from '../common/useUnifiedTooltip';
import { getIconUrl } from '../../utils/assetManager';
import './TalentTreeWindow.css';

// Helper function to get talent trees for current class
const getTalentTreesForClass = (className) => {
    const classData = CLASS_SPECIALIZATIONS[className];
    if (!classData) return [];

    return classData.specializations.map((spec, index) => ({
        id: spec.id,
        name: spec.name,
        description: spec.description,
        color: spec.color,
        icon: spec.icon,
        backdrop: getTreeBackdrop(className, spec.id),
        fallbackBackground: getFallbackBackground(index),
        talents: getTalentsForSpec(className, spec.id)
    }));
};

// ===== v2 spell-aware tooltip helpers =====
// v2 talents carry a full spell (talent.spell) plus hand-tuned rankUpgrades.
// resolveTalentSpell(talent, rank) returns the concrete spell at that rank.

// Format spell metadata line (cost / range / cooldown) like the spell tooltips
const formatSpellMeta = (spell) => {
    if (!spell) return '';
    const parts = [];
    parts.push(spell.spellType === 'PASSIVE' ? 'Passive' : 'Active');

    const costs = Object.entries(spell.resourceCosts || {})
        .filter(([key, val]) => val && val.baseAmount > 0)
        .map(([key, val]) => `${val.baseAmount} ${key === 'mana' ? 'mana' : key}`);
    if (costs.length) parts.push(costs.join(' + '));

    if (spell.range && spell.range > 0) {
        parts.push(spell.rangeType === 'melee' ? 'Melee' : `${spell.range} ft`);
    } else if (spell.targetingMode !== 'self') {
        parts.push('Self');
    }

    if (spell.spellType !== 'PASSIVE' && spell.cooldownValue) {
        parts.push(`${spell.cooldownValue}${spell.cooldownUnit === 'seconds' ? 's' : ' ' + (spell.cooldownUnit || '')} CD`);
    }

    return parts.join('  ·  ');
};

// WoW Classic style dynamic description: current rank + next rank preview
const getDynamicDescription = (talent, currentRank) => {
    if (!talent) return null;
    const hasSpellData = Boolean(talent.spell);

    // Legacy tree fallback (no spell payload): use plain description
    if (!hasSpellData) {
        return <div>{talent.description || ''}</div>;
    }

    const maxRank = talent.maxRanks || 1;
    const parts = [];

    if (currentRank > 0) {
        const currentSpell = resolveTalentSpell(talent, currentRank);
        parts.push(
            <div key="current" style={{ marginBottom: '8px' }}>
                <div style={{ color: '#ffd100', fontWeight: 'bold', marginBottom: '4px' }}>
                    {currentSpell?.spellType === 'PASSIVE' ? 'Passive' : 'Spell'} — Rank {currentRank}
                </div>
                <div style={{ color: '#1e1e1e' }}>{currentSpell?.description}</div>
            </div>
        );
    }

    if (currentRank < maxRank) {
        const nextSpell = resolveTalentSpell(talent, currentRank + 1);
        parts.push(
            <div key="next" style={{
                marginTop: currentRank > 0 ? '8px' : '0',
                paddingTop: currentRank > 0 ? '8px' : '0',
                borderTop: currentRank > 0 ? '1px solid rgba(139, 69, 19, 0.3)' : 'none'
            }}>
                <div style={{ color: '#1a7a1a', fontWeight: 'bold', marginBottom: '4px' }}>
                    {currentRank === 0 ? '' : 'Next Rank: '}
                </div>
                <div style={{ color: '#2d4a12' }}>{nextSpell?.description}</div>
            </div>
        );
    }

    return <div>{parts}</div>;
};

// Spell meta block for tooltips and summary
const getSpellMetaBlock = (talent, currentRank) => {
    if (!talent?.spell) return null;
    const spell = currentRank > 0
        ? resolveTalentSpell(talent, currentRank)
        : resolveTalentSpell(talent, 1);
    if (!spell) return null;
    const meta = formatSpellMeta(spell);
    if (!meta) return null;
    return <div style={{ fontSize: '0.8rem', color: '#5a4632', fontStyle: 'italic' }}>{meta}</div>;
};

// Constants for grid layout - Compact fit for better usability
const CELL_WIDTH = 132;  // Width of each grid cell (fits 5 columns in 660px available)
const CELL_HEIGHT = 96;  // Height of each grid cell (fits 8 rows in 768px available)
const GRID_COLUMNS = 5;  // Number of columns in the grid
const GRID_ROWS = 8;     // Number of rows in the grid (reduced for more compact window)
const TALENT_SIZE = 56;  // Size of talent icon (optimized for perfect fit)

const TalentTreeWindow = ({ isOpen, onClose }) => {
    console.log('[DEBUG] MythrillWindow:', MythrillWindow);
    console.log('[DEBUG] TalentArrowRenderer:', TalentArrowRenderer);
    console.log('[DEBUG] UnifiedTooltip:', UnifiedTooltip);
    const { class: characterClass, level, currentCharacterId } = useCharacterStore();
    const [selectedTree, setSelectedTree] = useState(0);
    const [talents, setTalents] = useState({});
    const [unlearnError, setUnlearnError] = useState(null);
    const hoverTimeoutRef = useRef(null);
    const gridContainerRef = useRef(null);

    useEffect(() => {
        setTalents(useCharacterStore.getState().talents || {});
    }, [currentCharacterId]);

    // Use unified tooltip system
    const { tooltipState, showTooltip, hideTooltip, updateTooltipPosition, updateTooltipContent } = useUnifiedTooltip();

    // Track currently hovered talent for real-time updates
    const [hoveredTalentId, setHoveredTalentId] = useState(null);

    const trees = getTalentTreesForClass(characterClass);
    const currentTree = trees[selectedTree];

    // Function to generate tooltip content for a talent
    const generateTooltipContent = useCallback((talent) => {
        if (!talent) return null;

        const currentRanks = talents[talent.id] || 0;
        const content = getDynamicDescription(talent, currentRanks);
        const title = talent.name;

        let subtitle = '';
        if (talent.maxRanks > 1) {
            subtitle = `Rank ${currentRanks}/${talent.maxRanks}`;
        }

        let requirements = [];
        if (talent.requires) {
            if (typeof talent.requires === 'string') {
                requirements.push('Requires previous talent');
            } else if (Array.isArray(talent.requires)) {
                if (talent.requiresAll) {
                    requirements.push(`Requires all: ${talent.requires.length} talents`);
                } else {
                    requirements.push(`Requires any: ${talent.requires.length} talents`);
                }
            }
        }

        const fullContent = (
            <div>
                {subtitle && <div style={{ fontSize: '0.9rem', color: '#D4AF37', marginBottom: '8px' }}>{subtitle}</div>}
                <div style={{ marginBottom: '8px' }}>{getSpellMetaBlock(talent, currentRanks)}</div>
                <div style={{ marginBottom: '12px' }}>{content}</div>
                {requirements.map((req, index) => (
                    <div key={index} style={{ fontSize: '0.85rem', color: '#DC143C', fontStyle: 'italic', marginBottom: '4px' }}>
                        {req}
                    </div>
                ))}
                <div style={{ fontSize: '0.8rem', color: '#8B4513', fontStyle: 'italic', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid rgba(139, 69, 19, 0.3)' }}>
                    Left-click to learn | Right-click to unlearn
                </div>
            </div>
        );

        return { content: fullContent, title };
    }, [talents, currentTree]);

    // Update tooltip content in real-time when talent ranks change
    useEffect(() => {
        if (tooltipState.isVisible && hoveredTalentId && currentTree) {
            const hoveredTalent = currentTree.talents.find(t => t.id === hoveredTalentId);
            if (hoveredTalent) {
                const { content, title } = generateTooltipContent(hoveredTalent);
                updateTooltipContent(content, { title });
            }
        }
    }, [talents, tooltipState.isVisible, hoveredTalentId, currentTree, generateTooltipContent, updateTooltipContent]);

    // Calculate total points spent across ALL trees (shared pool)
    const pointsSpent = trees.reduce((total, tree) => {
        return total + tree.talents.reduce((sum, talent) => {
            return sum + (talents[talent.id] || 0);
        }, 0);
    }, 0);

    // Talent system v2: 5 points per level, level cap 10 => 50 total points
    const availablePoints = Math.min((level || 1) * 5, 50);
    const pointsRemaining = availablePoints - pointsSpent;

    // ===== Spell library sync =====
    // Learning a talent grants its resolved rank-N spell to the spellbook and Spell Library.
    // Rank-ups UPDATE the same entry (stable id); unlearning to 0 removes it.
    const syncTalentSpell = (talent, newRank) => {
        if (!talent?.spell) return;
        const spellbook = useSpellbookStore.getState();
        const stableId = `talent-spell-${talent.id}`;
        const existing = (spellbook.spells || []).find(s => s.id === stableId);

        // Also sync with Spell Library storage so it immediately appears in Spell Library views
        const currentLib = loadLibraryFromStorage() || { spells: [] };
        const libIndex = (currentLib.spells || []).findIndex(s => s.id === stableId);

        if (newRank <= 0) {
            if (existing) spellbook.deleteSpell(stableId);
            if (libIndex !== -1) {
                currentLib.spells.splice(libIndex, 1);
                saveLibraryToStorage(currentLib);
            }
            return;
        }

        const librarySpell = convertTalentSpellToLibrarySpell(talent, newRank);
        if (!librarySpell) return;

        if (existing) {
            spellbook.updateSpell(stableId, librarySpell);
        } else {
            spellbook.addSpell(librarySpell);
        }

        if (libIndex !== -1) {
            currentLib.spells[libIndex] = librarySpell;
        } else {
            currentLib.spells = currentLib.spells || [];
            currentLib.spells.push(librarySpell);
        }
        saveLibraryToStorage(currentLib);
    };

    const handleTalentClick = (talentId, talent) => {
        if (!canLearnTalent(talent)) return;

        const currentRanks = talents[talentId] || 0;
        if (currentRanks >= talent.maxRanks) return;
        const newTalents = { ...talents, [talentId]: currentRanks + 1 };
        setTalents(newTalents);
        useCharacterStore.getState().setTalents(newTalents);
        syncTalentSpell(talent, currentRanks + 1);
    };

    const canUnlearnTalent = (talentId, currentTalents) => {
        const currentRanks = currentTalents[talentId] || 0;
        if (currentRanks <= 0) return false;

        // Simulate removing one point
        const simulatedTalents = { ...currentTalents };
        simulatedTalents[talentId] = currentRanks - 1;
        if (simulatedTalents[talentId] === 0) {
            delete simulatedTalents[talentId];
        }

        // Calculate total points spent across ALL trees in simulated state
        
        // Check if any currently invested talents would become inaccessible
        for (const [investedTalentId, investedRanks] of Object.entries(currentTalents)) {
            if (investedRanks === 0) continue; // Skip talents with 0 ranks

            // Search across all trees for the invested talent
            const investedTalent = trees.flatMap(tree => tree.talents).find(t => t.id === investedTalentId);
            if (!investedTalent) continue;

            // Check prerequisites
            if (investedTalent.requires) {
                if (typeof investedTalent.requires === 'string') {
                    // Search across all trees for the prerequisite
                    const prereqTalent = trees.flatMap(tree => tree.talents).find(t => t.id === investedTalent.requires);
                    if (prereqTalent) {
                        const prereqRanks = simulatedTalents[investedTalent.requires] || 0;
                        if (prereqRanks < prereqTalent.maxRanks) {
                            return false; // Prerequisite would not be met (needs to be fully maxed)
                        }
                    }
                } else if (Array.isArray(investedTalent.requires)) {
                    // Check array prerequisites
                    if (investedTalent.requiresAll) {
                        // ALL prerequisites must be fully maxed
                        for (const prereqId of investedTalent.requires) {
                            const prereqTalent = trees.flatMap(tree => tree.talents).find(t => t.id === prereqId);
                            if (prereqTalent) {
                                const prereqRanks = simulatedTalents[prereqId] || 0;
                                if (prereqRanks < prereqTalent.maxRanks) {
                                    return false;
                                }
                            }
                        }
                    } else {
                        // At least ONE prerequisite must be fully maxed
                        const hasAnyMaxedPrereq = investedTalent.requires.some(prereqId => {
                            const prereqTalent = trees.flatMap(tree => tree.talents).find(t => t.id === prereqId);
                            if (!prereqTalent) return false;
                            const prereqRanks = simulatedTalents[prereqId] || 0;
                            return prereqRanks >= prereqTalent.maxRanks;
                        });
                        if (!hasAnyMaxedPrereq) {
                            return false;
                        }
                    }
                }
            }
        }

        return true; // Safe to unlearn
    };

    const handleTalentRightClick = (e, talentId, talent) => {
        e.preventDefault();
        if (!canUnlearnTalent(talentId, talents)) {
            setUnlearnError({
                message: "Cannot unlearn this talent - other talents depend on it",
                position: { x: e.clientX, y: e.clientY }
            });
            setTimeout(() => setUnlearnError(null), 2000);
            return;
        }

        const currentRanks = talents[talentId] || 0;
        if (currentRanks <= 0) return;
        const newTalents = { ...talents };
        newTalents[talentId] = currentRanks - 1;
        if (newTalents[talentId] === 0) {
            delete newTalents[talentId];
        }
        setTalents(newTalents);
        useCharacterStore.getState().setTalents(newTalents);
        syncTalentSpell(talent, currentRanks - 1);
    };

    const canLearnTalent = (talent) => {
        // Check if we have available points
        if (pointsSpent >= availablePoints) return false;

        // Check if required talent(s) are FULLY MAXED OUT
        if (talent.requires) {
            if (typeof talent.requires === 'string') {
                // Single prerequisite - must be fully maxed
                // Search across all trees for the prerequisite
                const prereqTalent = trees.flatMap(tree => tree.talents).find(t => t.id === talent.requires);
                if (!prereqTalent) return false;

                const currentRanks = talents[talent.requires] || 0;
                if (currentRanks < prereqTalent.maxRanks) {
                    return false;
                }
            } else if (Array.isArray(talent.requires)) {
                // Multiple prerequisites
                if (talent.requiresAll) {
                    // AND logic - ALL prerequisites must be fully maxed
                    for (const prereqId of talent.requires) {
                        // Search across all trees for the prerequisite
                        const prereqTalent = trees.flatMap(tree => tree.talents).find(t => t.id === prereqId);
                        if (!prereqTalent) return false;

                        const currentRanks = talents[prereqId] || 0;
                        if (currentRanks < prereqTalent.maxRanks) {
                            return false;
                        }
                    }
                } else {
                    // OR logic - at least ONE prerequisite must be fully maxed
                    const hasAnyMaxedPrereq = talent.requires.some(prereqId => {
                        // Search across all trees for the prerequisite
                        const prereqTalent = trees.flatMap(tree => tree.talents).find(t => t.id === prereqId);
                        if (!prereqTalent) return false;

                        const currentRanks = talents[prereqId] || 0;
                        return currentRanks >= prereqTalent.maxRanks;
                    });
                    if (!hasAnyMaxedPrereq) {
                        return false;
                    }
                }
            }
        }

        return true;
    };

    const handleTalentMouseEnter = (e, talent) => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }

        hoverTimeoutRef.current = setTimeout(() => {
            setHoveredTalentId(talent.id);
            const { content, title } = generateTooltipContent(talent);
            showTooltip(content, { title, event: e });
        }, 300);
    };

    const handleTalentMouseMove = (e) => {
        updateTooltipPosition(e);
    };

    const handleTalentMouseLeave = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        setHoveredTalentId(null);
        hideTooltip();
    };

    const resetTalents = () => {
        // Remove all talent-granted spells from the spellbook and library storage
        const spellbook = useSpellbookStore.getState();
        (spellbook.spells || [])
            .filter(s => s.id?.startsWith('talent-spell-'))
            .forEach(s => spellbook.deleteSpell(s.id));

        const currentLib = loadLibraryFromStorage();
        if (currentLib?.spells) {
            currentLib.spells = currentLib.spells.filter(s => !s.id?.startsWith('talent-spell-'));
            saveLibraryToStorage(currentLib);
        }

        setTalents({});
        useCharacterStore.getState().setTalents({});
    };

    if (!trees || trees.length === 0) {
        return (
            <MythrillWindow
                title="Talent Tree"
                isOpen={isOpen}
                onClose={onClose}
                defaultSize={{ width: 900, height: 700 }}
                defaultPosition={{ x: 200, y: 100 }}
            >
                <div className="talent-tree-error">
                    {!characterClass ? (
                        <div className="no-class-message">
                            <h2>The Empty Grimoire</h2>
                            <p className="fantasy-text">
                                Ah, wanderer of realms untold,<br/>
                                No path of power hast thou yet chosen.<br/>
                                <span className="highlight">Select thy class</span> from the sacred tomes,<br/>
                                And let the arcane winds carry thee to glory!
                            </p>
                            <p className="subtle-text">
                                Choose a class in character creation to unlock your talent trees
                            </p>
                        </div>
                    ) : (
                        <p>No talent trees available for class: {characterClass}</p>
                    )}
                </div>
            </MythrillWindow>
        );
    }

    return (
        <MythrillWindow
            title={`Talent Tree - ${characterClass}`}
            isOpen={isOpen}
            onClose={onClose}
            defaultSize={{ width: 700, height: 850 }}
            defaultPosition={{ x: 200, y: 50 }}
            maxConstraints={[1200, 1000]}
            customHeader={
                <div className="spellbook-tab-container">
                    {trees.map((tree, index) => (
                        <button
                            key={tree.id}
                            className={`spellbook-tab-button ${selectedTree === index ? 'active' : ''}`}
                            onClick={() => setSelectedTree(index)}
                            title={tree.description}
                        >
                            <span>{tree.name}</span>
                        </button>
                    ))}
                    <button
                        key="summary"
                        className={`spellbook-tab-button ${selectedTree === trees.length ? 'active' : ''}`}
                        onClick={() => setSelectedTree(trees.length)}
                        title="View all learned talents"
                    >
                        <span>Summary</span>
                    </button>
                </div>
            }
        >
            <div className="talent-tree-container" style={{ position: 'relative' }}>
                {/* Summary Tab - Show all learned talents */}
                {selectedTree === trees.length ? (
                    <div className="talent-summary-container">
                        <div className="talent-summary-header">
                            <h2>Learned Talents</h2>
                            <button className="reset-talents-btn" onClick={resetTalents}>
                                Reset All
                            </button>
                        </div>

                        {trees.map((tree, treeIndex) => {
                            // Get all learned talents from this tree
                            const learnedTalents = tree.talents.filter(talent =>
                                talents[talent.id] && talents[talent.id] > 0
                            );

                            if (learnedTalents.length === 0) return null;

                            // Calculate points spent in this tree
                            const treePoints = tree.talents.reduce((sum, talent) =>
                                sum + (talents[talent.id] || 0), 0
                            );

                            return (
                                <div key={tree.id} className="talent-summary-tree">
                                    <div className="talent-summary-tree-header">
                                        <h3>{tree.name}</h3>
                                        <span className="talent-summary-points">{treePoints} points</span>
                                    </div>
                                    <div className="talent-summary-list">
                                        {learnedTalents.map(talent => {
                                            const currentRanks = talents[talent.id];
                                            return (
                                                <div key={talent.id} className="talent-summary-item">
                                                    <div className="talent-summary-icon-wrapper">
                                                        <img
                                                            src={getIconUrl(talent.icon, 'abilities')}
                                                            alt={talent.name}
                                                            className="talent-summary-icon"
                                                            onError={(e) => e.target.src = getIconUrl('Utility/Utility', 'abilities')}
                                                        />
                                                        <div className="talent-summary-ranks">
                                                            {currentRanks}/{talent.maxRanks}
                                                        </div>
                                                    </div>
                                                    <div className="talent-summary-details">
                                                        <div className="talent-summary-name">{talent.name}</div>
                                                        <div className="talent-summary-meta">
                                                            {getSpellMetaBlock(talent, currentRanks)}
                                                        </div>
                                                        <div className="talent-summary-description">
                                                            {getDynamicDescription(talent, currentRanks)}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Show message if no talents learned */}
                        {trees.every(tree =>
                            tree.talents.every(talent => !talents[talent.id] || talents[talent.id] === 0)
                        ) && (
                            <div className="talent-summary-empty">
                                <p>No talents learned yet.</p>
                                <p>Select a specialization tab above to begin investing talent points.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Talent Grid */
                    <div
                        ref={gridContainerRef}
                        className="talent-grid-container"
                        style={{
                            backgroundImage: currentTree.backdrop || currentTree.fallbackBackground,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    >
                    {/* Points and Reset Controls - Floating in top-right */}
                    <div className="talent-controls">
                        <div className="points-display">
                            <span className="points-label">Points:</span>
                            <span className="points-value">{pointsSpent}</span>
                            <span className="points-separator">/</span>
                            <span className="points-available">{availablePoints}</span>
                            {pointsRemaining > 0 && (
                                <span className="points-remaining"> ({pointsRemaining} remaining)</span>
                            )}
                        </div>
                        <button className="reset-talents-btn" onClick={resetTalents}>
                            Reset
                        </button>
                    </div>

                    <div
                        className="talent-grid-absolute"
                        style={{
                            width: `${GRID_COLUMNS * CELL_WIDTH}px`,
                            height: `${GRID_ROWS * CELL_HEIGHT}px`,
                            maxWidth: '100%',
                            maxHeight: '100%'
                        }}
                    >

                        {/* Render arrows first (behind talents) */}
                        <TalentArrowRenderer
                            talents={currentTree.talents}
                            learnedTalents={talents}
                            cellWidth={CELL_WIDTH}
                            cellHeight={CELL_HEIGHT}
                            containerRef={gridContainerRef}
                        />

                        {/* Render talent nodes */}
                        {currentTree.talents.map((talent) => {
                            const currentRanks = talents[talent.id] || 0;
                            const isMaxed = currentRanks >= talent.maxRanks;
                            const canLearn = canLearnTalent(talent);
                            const isLearnable = canLearn && !isMaxed;

                            return (
                                <div
                                    key={talent.id}
                                    className="talent-node-container"
                                    style={{
                                        position: 'absolute',
                                        left: `${talent.position.x * CELL_WIDTH}px`,
                                        top: `${talent.position.y * CELL_HEIGHT}px`,
                                        width: `${CELL_WIDTH}px`,
                                        height: `${CELL_HEIGHT}px`
                                    }}
                                >
                                    <div
                                        className={`talent-node ${currentRanks > 0 ? 'learned' : ''} ${isLearnable ? 'learnable' : ''} ${!canLearn && currentRanks === 0 ? 'locked' : ''}`}
                                        onClick={() => handleTalentClick(talent.id, talent)}
                                        onContextMenu={(e) => handleTalentRightClick(e, talent.id, talent)}
                                        onMouseEnter={(e) => handleTalentMouseEnter(e, talent)}
                                        onMouseMove={handleTalentMouseMove}
                                        onMouseLeave={handleTalentMouseLeave}
                                        style={{
                                            width: `${TALENT_SIZE}px`,
                                            height: `${TALENT_SIZE}px`
                                        }}
                                    >
                                        <div className="talent-icon-wrapper">
                                            <img
                                                src={getIconUrl(talent.icon, 'abilities')}
                                                alt={talent.name}
                                                className="talent-icon"
                                                onError={(e) => e.target.src = getIconUrl('Utility/Utility', 'abilities')}
                                            />
                                            {/* Always show rank indicator */}
                                            <div className="talent-ranks">
                                                {currentRanks}/{talent.maxRanks}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                )}

                {/* Error Tooltip */}
                {unlearnError && (
                    <div
                        className="talent-tooltip talent-error-tooltip"
                        style={{
                            position: 'fixed',
                            left: unlearnError.position.x + 15,
                            top: unlearnError.position.y - 10,
                            pointerEvents: 'none',
                            zIndex: 2147483647
                        }}
                    >
                        <div className="talent-tooltip-description error-text">
                            {unlearnError.message}
                        </div>
                    </div>
                )}

                {/* Unified Tooltip */}
                <UnifiedTooltip
                    content={tooltipState.content}
                    title={tooltipState.title}
                    isVisible={tooltipState.isVisible}
                    position={tooltipState.position}
                    variant="spell"
                />
            </div>
        </MythrillWindow>
    );
};

export default TalentTreeWindow;

