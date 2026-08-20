import React, { useState, useRef, useEffect, useCallback } from 'react';
import useCharacterStore from '../../store/characterStore';
import useSpellbookStore from '../../store/spellbookStore';
import { CLASS_SPECIALIZATIONS } from '../../data/classSpellCategories';
import { getTalentsForSpec, getTreeBackdrop, getFallbackBackground } from '../../data/talentTreeData';
import { resolveTalentSpell, convertTalentSpellToLibrarySpell, extractTriggerFromDescription } from '../../data/talentTrees/talentSystem.mjs';
import { loadLibraryFromStorage, saveLibraryToStorage } from '../spellcrafting-wizard/core/utils/libraryManager';
import { TalentArrowRenderer } from '../windows/TalentArrow';
import { getIconUrl } from '../../utils/assetManager';
import './TalentTreeContent.css';

// Helper to extract specializations & talent lists for a class
const getTalentTreesForClass = (className) => {
    const classData = CLASS_SPECIALIZATIONS[className];
    if (!classData) return [];

    return classData.specializations.map((spec, index) => ({
        id: spec.id,
        name: spec.name,
        description: spec.description,
        color: spec.color,
        icon: spec.icon,
        backdrop: getTreeBackdrop(className, spec.id) || getFallbackBackground(index),
        fallbackBackground: getFallbackBackground(index),
        talents: getTalentsForSpec(className, spec.id) || []
    }));
};

// Format spell meta chips (AP, Resource, Range, CD, Reaction, Trigger)
const renderSpellMetaChips = (spell) => {
    if (!spell) return null;
    const isReaction = spell.spellType === 'REACTION' || spell.actionType === 'reaction' ||
        /^(as a )?reaction/i.test(spell.description || '') || /reaction\s*\(/i.test(spell.description || '');
    const isPassive = !isReaction && (spell.spellType === 'PASSIVE' || spell.actionType === 'passive' || /^passive/i.test(spell.description || ''));

    const triggerText = spell.reactionTrigger || spell.trigger || extractTriggerFromDescription(spell.description);

    const costs = [];
    if (spell.resourceCosts) {
        Object.entries(spell.resourceCosts).forEach(([key, val]) => {
            if (val && val.baseAmount > 0) {
                const cleanKey = key.replace(/([A-Z])/g, ' $1').toLowerCase();
                costs.push(`${val.baseAmount} ${cleanKey}`);
            }
        });
    }

    return (
        <div className="talent-meta-chips-row">
            {isReaction ? (
                <span className="talent-meta-chip chip-reaction">
                    <i className="fas fa-bolt-lightning"></i>
                    <span>Reaction</span>
                </span>
            ) : isPassive ? (
                <span className="talent-meta-chip chip-passive">
                    <i className="fas fa-shield-halved"></i>
                    <span>Passive</span>
                </span>
            ) : (
                <span className="talent-meta-chip chip-action">
                    <i className="fas fa-hand-sparkles"></i>
                    <span>Action</span>
                </span>
            )}

            {!isPassive && (spell.actionPoints > 0 || (spell.actionPoints === 0 && !isReaction)) && (
                <span className="talent-meta-chip chip-ap">
                    <i className="fas fa-bolt"></i>
                    <span>{spell.actionPoints} AP</span>
                </span>
            )}

            {costs.length > 0 && (
                <span className="talent-meta-chip chip-resource">
                    <i className="fas fa-gem"></i>
                    <span>{costs.join(' + ')}</span>
                </span>
            )}

            {spell.range && spell.range > 0 && (
                <span className="talent-meta-chip chip-range">
                    <i className="fas fa-location-crosshairs"></i>
                    <span>{spell.rangeType === 'melee' ? 'Melee (5 ft)' : `${spell.range} ft Range`}</span>
                </span>
            )}

            {!isPassive && spell.cooldownValue && (
                <span className="talent-meta-chip chip-cd">
                    <i className="fas fa-clock"></i>
                    <span>{spell.cooldownValue} {spell.cooldownUnit || 'Rds'} CD</span>
                </span>
            )}

            {triggerText && (
                <span className="talent-meta-chip chip-trigger" title={triggerText}>
                    <i className="fas fa-reply-all"></i>
                    <span>Trigger: {triggerText}</span>
                </span>
            )}
        </div>
    );
};

// Dynamic description for tooltips & inspector
const getDynamicDescription = (talent, currentRank) => {
    if (!talent) return null;
    const hasSpellData = Boolean(talent.spell);

    if (!hasSpellData) {
        return <div className="talent-desc-text">{talent.description || ''}</div>;
    }

    const maxRank = talent.maxRanks || 1;
    const parts = [];

    if (currentRank > 0) {
        const currentSpell = resolveTalentSpell(talent, currentRank);
        parts.push(
            <div key="current" className="talent-desc-block current-rank-block">
                <div className="talent-rank-header current">
                    {currentSpell?.spellType === 'PASSIVE' ? 'Passive' : 'Spell'} — Rank {currentRank}
                </div>
                <div className="talent-desc-text">{currentSpell?.description}</div>
            </div>
        );
    }

    if (currentRank < maxRank) {
        const nextSpell = resolveTalentSpell(talent, currentRank + 1);
        parts.push(
            <div key="next" className="talent-desc-block next-rank-block">
                <div className="talent-rank-header next">
                    {currentRank === 0 ? 'Rank 1 Effect:' : 'Next Rank Upgrade (+1):'}
                </div>
                <div className="talent-desc-text">{nextSpell?.description}</div>
            </div>
        );
    }

    return <div className="talent-desc-container">{parts}</div>;
};

const GRID_COLS = 5;
const GRID_ROWS = 7;

export const TalentTreeContent = ({
    customClass = null,
    selectedTreeIndex = null,
    onTreeSelect = null,
    hideHeader = false
}) => {
    const characterStore = useCharacterStore();
    const characterClass = customClass || characterStore.class;
    const level = characterStore.level || 1;
    const currentCharacterId = characterStore.currentCharacterId;

    const [internalTree, setInternalTree] = useState(0);
    const [talents, setTalents] = useState({});
    const [unlearnError, setUnlearnError] = useState(null);
    const [hoveredTalentId, setHoveredTalentId] = useState(null);
    const [selectedTalentId, setSelectedTalentId] = useState(null);
    const [gridDims, setGridDims] = useState({ width: 440, height: 540 });

    const boardRef = useRef(null);

    const activeTree = selectedTreeIndex !== null ? selectedTreeIndex : internalTree;

    const handleTreeChange = (idx) => {
        setSelectedTalentId(null);
        if (onTreeSelect) {
            onTreeSelect(idx);
        } else {
            setInternalTree(idx);
        }
    };

    // Sync talents from store on mount / character switch
    useEffect(() => {
        setTalents(useCharacterStore.getState().talents || {});
    }, [currentCharacterId]);

    // Responsive container sizing to fit 100% without scrollbars
    useEffect(() => {
        const updateDims = () => {
            if (boardRef.current) {
                const rect = boardRef.current.getBoundingClientRect();
                const parentRect = boardRef.current.parentElement?.getBoundingClientRect();
                const availableW = parentRect?.width && parentRect.width > 100 ? parentRect.width - 54 : (rect.width > 100 ? rect.width : 460);
                const availableH = parentRect?.height && parentRect.height > 100 ? parentRect.height - 24 : (rect.height > 100 ? rect.height : 540);

                setGridDims({
                    width: Math.max(340, availableW),
                    height: Math.max(480, availableH)
                });
            }
        };

        updateDims();
        let ro = null;
        if (typeof ResizeObserver !== 'undefined' && boardRef.current) {
            ro = new ResizeObserver(updateDims);
            ro.observe(boardRef.current);
            if (boardRef.current.parentElement) {
                ro.observe(boardRef.current.parentElement);
            }
        } else {
            window.addEventListener('resize', updateDims);
        }

        return () => {
            if (ro) ro.disconnect();
            window.removeEventListener('resize', updateDims);
        };
    }, [activeTree]);

    const trees = getTalentTreesForClass(characterClass);
    const currentTree = trees[activeTree];

    // Total points spent across all trees
    const pointsSpent = trees.reduce((total, tree) => {
        return total + tree.talents.reduce((sum, talent) => sum + (talents[talent.id] || 0), 0);
    }, 0);

    const availablePoints = Math.min((level || 1) * 5, 50);
    const pointsRemaining = availablePoints - pointsSpent;

    // Spellbook & Library synchronization
    const syncTalentSpell = (talent, newRank) => {
        if (!talent?.spell) return;
        const spellbook = useSpellbookStore.getState();
        const stableId = `talent-spell-${talent.id}`;
        const existing = (spellbook.spells || []).find(s => s.id === stableId);

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

    // Validation to learn
    const canLearnTalent = (talent) => {
        if (pointsSpent >= availablePoints) return false;
        if (!talent.requires) return true;

        const reqIds = Array.isArray(talent.requires) ? talent.requires : [talent.requires];
        if (talent.requiresAll) {
            return reqIds.every(reqId => {
                const prereq = currentTree?.talents?.find(t => t.id === reqId);
                return prereq && (talents[reqId] || 0) >= (prereq.maxRanks || 1);
            });
        } else {
            return reqIds.some(reqId => {
                const prereq = currentTree?.talents?.find(t => t.id === reqId);
                return prereq && (talents[reqId] || 0) >= (prereq.maxRanks || 1);
            });
        }
    };

    // Validation to unlearn
    const canUnlearnTalent = (talentId) => {
        const currentRanks = talents[talentId] || 0;
        if (currentRanks <= 0) return false;

        const sim = { ...talents, [talentId]: currentRanks - 1 };
        if (sim[talentId] === 0) delete sim[talentId];

        for (const tree of trees) {
            for (const t of tree.talents) {
                if ((sim[t.id] || 0) > 0 && t.requires) {
                    const reqIds = Array.isArray(t.requires) ? t.requires : [t.requires];
                    if (t.requiresAll) {
                        const allMet = reqIds.every(reqId => {
                            const p = tree.talents.find(node => node.id === reqId);
                            return (sim[reqId] || 0) >= (p?.maxRanks || 1);
                        });
                        if (!allMet) return false;
                    } else {
                        const anyMet = reqIds.some(reqId => {
                            const p = tree.talents.find(node => node.id === reqId);
                            return (sim[reqId] || 0) >= (p?.maxRanks || 1);
                        });
                        if (!anyMet) return false;
                    }
                }
            }
        }
        return true;
    };

    const handleTalentClick = (talentId, talent) => {
        setSelectedTalentId(talentId);
        if (!canLearnTalent(talent)) return;
        const currentRanks = talents[talentId] || 0;
        if (currentRanks >= (talent.maxRanks || 1)) return;

        const newTalents = { ...talents, [talentId]: currentRanks + 1 };
        setTalents(newTalents);
        useCharacterStore.getState().setTalents(newTalents);
        syncTalentSpell(talent, currentRanks + 1);
    };

    const handleTalentRightClick = (e, talentId, talent) => {
        e.preventDefault();
        setSelectedTalentId(talentId);
        if (!canUnlearnTalent(talentId)) {
            setUnlearnError({
                message: 'Cannot refund: other learned talents depend on this prerequisite.',
                position: { x: e.clientX, y: e.clientY }
            });
            setTimeout(() => setUnlearnError(null), 2400);
            return;
        }

        const currentRanks = talents[talentId] || 0;
        if (currentRanks <= 0) return;

        const newTalents = { ...talents };
        if (currentRanks - 1 === 0) {
            delete newTalents[talentId];
        } else {
            newTalents[talentId] = currentRanks - 1;
        }

        setTalents(newTalents);
        useCharacterStore.getState().setTalents(newTalents);
        syncTalentSpell(talent, currentRanks - 1);
    };

    const resetTalents = () => {
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

    const handleMouseEnter = (talent) => {
        setHoveredTalentId(talent.id);
    };

    const handleMouseLeave = () => {
        setHoveredTalentId(null);
    };

    if (!trees || trees.length === 0) {
        return (
            <div className="talent-tree-content-root">
                <div className="talent-tree-empty-state">
                    <h2>No Talent Trees Found</h2>
                    <p>Select a valid character class to view talent trees.</p>
                </div>
            </div>
        );
    }

    // Determine inspector talent
    const inspectedTalent = currentTree?.talents?.find(t => t.id === (selectedTalentId || hoveredTalentId))
        || currentTree?.talents?.[0];
    const inspectedRanks = inspectedTalent ? (talents[inspectedTalent.id] || 0) : 0;
    const inspectedMaxed = inspectedTalent ? (inspectedRanks >= (inspectedTalent.maxRanks || 1)) : false;
    const inspectedCanLearn = inspectedTalent ? canLearnTalent(inspectedTalent) : false;
    const inspectedCanUnlearn = inspectedTalent ? canUnlearnTalent(inspectedTalent.id) : false;

    const spentInActiveTree = currentTree?.talents?.reduce((sum, t) => sum + (talents[t.id] || 0), 0) || 0;

    // Grid math for zero-scroll auto-fit with enlarged talent blocks
    const cellWidth = gridDims.width / GRID_COLS;
    const cellHeight = gridDims.height / GRID_ROWS;
    const talentSize = Math.min(Math.max(46, Math.min(cellWidth * 0.72, cellHeight * 0.78)), 76);

    return (
        <div className="talent-tree-content-root">
            {/* Top Sub-Header: Ornate Specialization Crest & Grimoire Lore Plaque */}
            <div className="talent-tree-top-bar">
                <div className="talent-tree-header-left">
                    {activeTree < trees.length ? (
                        <div className="talent-active-spec-header">
                            <div className="talent-spec-header-crest">
                                <img
                                    src={getIconUrl(currentTree?.icon || 'Utility/Utility', 'abilities')}
                                    alt=""
                                    className="talent-spec-header-icon"
                                    onError={(e) => { e.target.src = getIconUrl('Utility/Utility', 'abilities'); }}
                                />
                            </div>
                            <div className="talent-spec-header-info">
                                <div className="talent-spec-header-top-row">
                                    <h3 className="talent-spec-header-title">{currentTree?.name}</h3>
                                    <span className="talent-spec-class-tag">{characterClass} Specialization</span>
                                    <span className="talent-spec-invested-pill">
                                        <i className="fas fa-sparkles"></i> {spentInActiveTree} Pts Allocated
                                    </span>
                                </div>
                                <div className="talent-spec-header-desc" title={currentTree?.description}>
                                    "{currentTree?.description}"
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="talent-active-spec-header">
                            <div className="talent-spec-header-crest summary-crest">
                                <i className="fas fa-book-bookmark"></i>
                            </div>
                            <div className="talent-spec-header-info">
                                <div className="talent-spec-header-top-row">
                                    <h3 className="talent-spec-header-title">Mastery Grimoire</h3>
                                    <span className="talent-spec-class-tag">{characterClass} Compendium</span>
                                    <span className="talent-spec-invested-pill summary-pill">
                                        <i className="fas fa-layer-group"></i> {pointsSpent} Total Points
                                    </span>
                                </div>
                                <div className="talent-spec-header-desc">
                                    Complete compendium of all learned abilities, techniques, and stances across {characterClass} specializations.
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="talent-stats-bar">
                    <div className="talent-points-badge">
                        <span className="points-label">Talent Points:</span>
                        <span className="points-val">{pointsSpent}</span>
                        <span>/</span>
                        <span className="points-avail">{availablePoints}</span>
                        <span className="points-remaining-tag">
                            {pointsRemaining > 0 ? `(${pointsRemaining} Left)` : '(0 Left)'}
                        </span>
                    </div>
                    <button className="talent-reset-btn" onClick={resetTalents} title="Refund all talent points in this character">
                        Reset All
                    </button>
                </div>
            </div>

            {/* Main Content Area: Split 2-Page Book Canvas OR Summary */}
            {activeTree === trees.length ? (
                <div className="talent-summary-view">
                    <div className="talent-summary-header">
                        <h2>Chronicled Talents & Masteries</h2>
                        <p>All active spells, stances, and martial techniques acquired across your class specialization trees.</p>
                    </div>

                    <div className="talent-summary-grid">
                        {trees.map(tree => {
                            const learned = tree.talents.filter(t => (talents[t.id] || 0) > 0);
                            const spent = tree.talents.reduce((sum, t) => sum + (talents[t.id] || 0), 0);

                            return (
                                <div key={tree.id} className="talent-summary-tree-card">
                                    <div className="talent-summary-card-header">
                                        <img
                                            src={getIconUrl(tree.icon, 'abilities')}
                                            alt=""
                                            className="talent-summary-card-icon"
                                            onError={(e) => { e.target.src = getIconUrl('Utility/Utility', 'abilities'); }}
                                        />
                                        <div className="talent-summary-card-titles">
                                            <h3>{tree.name}</h3>
                                            <span>{spent} points invested</span>
                                        </div>
                                    </div>

                                    {learned.length === 0 ? (
                                        <div className="talent-summary-empty-branch">
                                            <em>No talents invested in this specialization yet.</em>
                                        </div>
                                    ) : (
                                        <div className="talent-summary-items-list">
                                            {learned.map(talent => {
                                                const curRanks = talents[talent.id];
                                                return (
                                                    <div key={talent.id} className="talent-summary-item-row">
                                                        <img
                                                            src={getIconUrl(talent.icon, 'abilities')}
                                                            alt={talent.name}
                                                            className="talent-summary-item-img"
                                                            onError={(e) => { e.target.src = getIconUrl('Utility/Utility', 'abilities'); }}
                                                        />
                                                        <div className="talent-summary-item-info">
                                                            <div className="talent-summary-item-name">
                                                                {talent.name} <span className="talent-item-rank-chip">{curRanks}/{talent.maxRanks}</span>
                                                            </div>
                                                            <div className="talent-summary-item-meta">
                                                                {renderSpellMetaChips(talent.spell)}
                                                            </div>
                                                            <div className="talent-summary-item-desc">
                                                                {getDynamicDescription(talent, curRanks)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="talent-split-book-layout">
                    {/* Left Page: Branching Tree Grid Canvas */}
                    <div className="talent-tree-page-canvas">
                        <div
                            className="talent-backdrop-layer"
                            style={{
                                backgroundImage: currentTree?.backdrop || currentTree?.fallbackBackground
                            }}
                        />

                        {/* Tier Rail Indicators */}
                        <div className="talent-tier-rail">
                            {[0, 1, 2, 3, 4, 5, 6].map(tIdx => (
                                <div
                                    key={tIdx}
                                    className="talent-tier-label"
                                    style={{
                                        position: 'absolute',
                                        top: `${tIdx * cellHeight + cellHeight / 2}px`,
                                        transform: 'translateY(-50%)'
                                    }}
                                >
                                    T{tIdx + 1}
                                </div>
                            ))}
                        </div>

                        {/* Centered Tree Grid Board */}
                        <div ref={boardRef} className="talent-grid-board">
                            {/* SVG Prerequisite Connectors */}
                            <TalentArrowRenderer
                                talents={currentTree?.talents || []}
                                learnedTalents={talents}
                                cellWidth={cellWidth}
                                cellHeight={cellHeight}
                                talentSize={talentSize}
                            />

                            {/* Nodes */}
                            {(currentTree?.talents || []).map(talent => {
                                const curRanks = talents[talent.id] || 0;
                                const isMaxed = curRanks >= (talent.maxRanks || 1);
                                const canLearn = canLearnTalent(talent);
                                const isLearnable = canLearn && !isMaxed;
                                const isSelected = inspectedTalent?.id === talent.id;

                                const posX = (talent.position?.x ?? 0) * cellWidth + cellWidth / 2;
                                const posY = (talent.position?.y ?? 0) * cellHeight + cellHeight / 2;

                                return (
                                    <div
                                        key={talent.id}
                                        className="talent-node-cell"
                                        style={{
                                            left: `${posX}px`,
                                            top: `${posY}px`,
                                            width: `${talentSize}px`,
                                            height: `${talentSize}px`
                                        }}
                                    >
                                        <div
                                            className={`talent-node-button ${curRanks > 0 ? 'learned' : ''} ${isLearnable ? 'learnable' : ''} ${isMaxed ? 'maxed' : ''} ${!canLearn && curRanks === 0 ? 'locked' : ''} ${isSelected ? 'selected' : ''}`}
                                            style={{ width: `${talentSize}px`, height: `${talentSize}px` }}
                                            onClick={() => handleTalentClick(talent.id, talent)}
                                            onContextMenu={(e) => handleTalentRightClick(e, talent.id, talent)}
                                            onMouseEnter={() => handleMouseEnter(talent)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <div className="talent-node-icon-box">
                                                <img
                                                    src={getIconUrl(talent.icon, 'abilities')}
                                                    alt={talent.name}
                                                    className="talent-node-img"
                                                    onError={(e) => { e.target.src = getIconUrl('Utility/Utility', 'abilities'); }}
                                                />
                                            </div>
                                            <div className="talent-node-rank-badge">
                                                {curRanks}/{talent.maxRanks || 1}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Book Spine Divider */}
                    <div className="talent-book-spine-divider">
                        <div className="talent-spine-stitch"></div>
                        <div className="talent-spine-stitch"></div>
                        <div className="talent-spine-stitch"></div>
                    </div>

                    {/* Right Page: Talent Codex & Inspection Panel */}
                    <div className="talent-inspector-page">
                        {inspectedTalent ? (
                            <div className="talent-inspector-card">
                                <div className="talent-inspector-header">
                                    <img
                                        src={getIconUrl(inspectedTalent.icon, 'abilities')}
                                        alt={inspectedTalent.name}
                                        className="talent-inspector-icon"
                                        onError={(e) => { e.target.src = getIconUrl('Utility/Utility', 'abilities'); }}
                                    />
                                    <div className="talent-inspector-title-block">
                                        <h4>{inspectedTalent.name}</h4>
                                        <div className="talent-inspector-rank-row">
                                            <span className={`talent-inspector-rank-tag ${inspectedMaxed ? 'maxed' : inspectedRanks > 0 ? 'learned' : 'unlearned'}`}>
                                                Rank {inspectedRanks} of {inspectedTalent.maxRanks || 1} {inspectedMaxed ? '(Maxed)' : inspectedCanLearn ? '(Learnable)' : ''}
                                            </span>
                                            {inspectedTalent.position && (
                                                <span className="talent-tier-pos-tag">Tier {inspectedTalent.position.y + 1}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="talent-inspector-meta-box">
                                    {renderSpellMetaChips(inspectedTalent.spell)}
                                </div>

                                <div className="talent-inspector-body">
                                    <div className="talent-inspector-desc-scroll">
                                        {getDynamicDescription(inspectedTalent, inspectedRanks)}
                                    </div>

                                    {/* Requirements status */}
                                    {inspectedTalent.requires && (() => {
                                        const reqIds = Array.isArray(inspectedTalent.requires) ? inspectedTalent.requires : [inspectedTalent.requires];
                                        return (
                                            <div className="talent-inspector-reqs-box">
                                                <span className="req-box-title">Prerequisites:</span>
                                                {reqIds.map(reqId => {
                                                    const reqNode = currentTree?.talents?.find(t => t.id === reqId);
                                                    const reqName = reqNode ? reqNode.name : 'Prerequisite Talent';
                                                    const reqRanks = reqNode?.maxRanks || 1;
                                                    const curReqRanks = talents[reqId] || 0;
                                                    const isMet = curReqRanks >= reqRanks;

                                                    return (
                                                        <div key={reqId} className={`req-item-line ${isMet ? 'met' : 'unmet'}`}>
                                                            <i className={`fas ${isMet ? 'fa-check-circle' : 'fa-lock'}`}></i>
                                                            <span>{reqName} ({curReqRanks}/{reqRanks} points)</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Direct Allocation Action Buttons */}
                                <div className="talent-inspector-actions">
                                    <button
                                        type="button"
                                        className="talent-action-btn learn-btn"
                                        disabled={inspectedMaxed || !inspectedCanLearn}
                                        onClick={() => handleTalentClick(inspectedTalent.id, inspectedTalent)}
                                    >
                                        <i className="fas fa-plus-circle"></i>
                                        <span>Learn Rank (+1)</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="talent-action-btn refund-btn"
                                        disabled={inspectedRanks <= 0 || !inspectedCanUnlearn}
                                        onClick={(e) => handleTalentRightClick(e, inspectedTalent.id, inspectedTalent)}
                                    >
                                        <i className="fas fa-rotate-left"></i>
                                        <span>Refund (-1)</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="talent-inspector-empty">
                                <i className="fas fa-scroll"></i>
                                <h4>Specialization Codex</h4>
                                <p>{currentTree?.description}</p>
                                <span>Click any talent node on the left to examine its scaling powers and assign points.</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Error Popup */}
            {unlearnError && (
                <div
                    style={{
                        position: 'fixed',
                        left: unlearnError.position.x + 12,
                        top: unlearnError.position.y - 12,
                        background: '#8b0000',
                        color: '#fff',
                        padding: '8px 14px',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.6)',
                        zIndex: 99999,
                        pointerEvents: 'none'
                    }}
                >
                    {unlearnError.message}
                </div>
            )}
        </div>
    );
};

export default TalentTreeContent;
