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

    // Responsive container sizing for smooth scrolling tree board
    useEffect(() => {
        const updateDims = () => {
            if (boardRef.current) {
                const scrollParent = boardRef.current.closest('.talent-tree-scroll-container') || boardRef.current.parentElement;
                const parentRect = scrollParent?.getBoundingClientRect();
                const availableW = boardRef.current.clientWidth || (parentRect?.width ? parentRect.width - 64 : 440);
                const availableH = parentRect?.clientHeight || (parentRect?.height ? parentRect.height - 24 : 540);

                setGridDims({
                    width: Math.max(320, availableW),
                    height: Math.max(300, availableH)
                });
            }
        };

        updateDims();
        let ro = null;
        if (typeof ResizeObserver !== 'undefined' && boardRef.current) {
            ro = new ResizeObserver(updateDims);
            ro.observe(boardRef.current);
            const parent = boardRef.current.parentElement;
            if (parent) {
                ro.observe(parent);
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

    // Analyze current tree coordinate system to guarantee balanced auto-centering and full visibility
    const treeAnalysis = React.useMemo(() => {
        const talentsList = currentTree?.talents || [];
        if (!talentsList.length) return { xMode: '5-col-fractional', maxTreeY: 6, tierMap: {} };

        const xs = talentsList.map(t => t.position?.x ?? 0);
        const ys = talentsList.map(t => t.position?.y ?? 0);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const maxTreeY = Math.max(...ys, 6);

        let xMode = '5-col-fractional';
        if (minX >= 1 && maxX <= 3) {
            xMode = '3-col';
        } else if (minX === 0) {
            xMode = '5-col-index';
        } else {
            xMode = '5-col-fractional';
        }

        const tierMap = {};
        for (let tier = 1; tier <= 7; tier++) {
            const tierTalents = talentsList.filter(t => t.id && t.id.toLowerCase().includes(`_t${tier}_`));
            if (tierTalents.length > 0) {
                tierMap[tier] = tierTalents[0].position?.y ?? (tier - 1);
            } else {
                tierMap[tier] = tier - 1;
            }
        }

        return { xMode, maxTreeY, tierMap };
    }, [currentTree]);

    const cellHeight = Math.max(76, Math.floor(gridDims.height / 7));
    const boardHeight = Math.ceil((treeAnalysis.maxTreeY + 1.2) * cellHeight);
    const talentSize = Math.min(Math.max(48, Math.min(gridDims.width * 0.14, cellHeight * 0.74)), 70);

    const getNodePos = useCallback((x, y) => {
        const safeMargin = Math.max(talentSize / 2 + 14, 40);
        const safeWidth = Math.max(100, gridDims.width - safeMargin * 2);

        let normX;
        if (treeAnalysis.xMode === '3-col') {
            normX = (x - 1) / 2.0;
        } else if (treeAnalysis.xMode === '5-col-index') {
            normX = x / 4.0;
        } else {
            normX = (x - 0.5) / 4.0;
        }

        normX = Math.max(0, Math.min(1, normX));
        const posX = safeMargin + normX * safeWidth;
        const posY = y * cellHeight + cellHeight / 2;
        return { posX, posY };
    }, [treeAnalysis, gridDims.width, cellHeight, talentSize]);

    return (
        <div className="talent-tree-content-root">
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
                        <span>Talent Points:</span>
                        <span className="points-val">{pointsSpent}</span>
                        <span>/</span>
                        <span className="points-avail">{availablePoints}</span>
                        <span className="points-remaining-tag">({pointsRemaining} Left)</span>
                    </div>
                    <button type="button" className="talent-reset-btn" onClick={resetTalents} title="Refund all talent points in this character">
                        Reset All
                    </button>
                </div>
            </div>

            {activeTree === trees.length ? (
                <div className="talent-summary-view-wrapper">
                    <div className="talent-summary-scroll-content">
                        <div className="talent-summary-heading-box">
                            <i className="fas fa-scroll"></i>
                            <h3>Chronicled Talents & Masteries</h3>
                            <p>Herein lies the complete record of abilities unlocked through your progression.</p>
                        </div>

                        {trees.map((tree, tIdx) => {
                            const learned = (tree.talents || []).filter(t => (talents[t.id] || 0) > 0);
                            return (
                                <div key={tree.id || tIdx} className="talent-summary-tree-section">
                                    <div className="talent-summary-tree-header">
                                        <img
                                            src={getIconUrl(tree.icon, 'abilities')}
                                            alt={tree.name}
                                            className="talent-summary-tree-icon"
                                            onError={(e) => { e.target.src = getIconUrl('Utility/Utility', 'abilities'); }}
                                        />
                                        <h4>{tree.name}</h4>
                                        <span className="talent-summary-count-tag">{learned.length} Talents Learned</span>
                                    </div>

                                    {learned.length === 0 ? (
                                        <div className="talent-summary-empty-msg">
                                            No talent points invested in this specialization yet.
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
                    <div className="talent-tree-page-canvas">
                        <div
                            className="talent-backdrop-layer"
                            style={{
                                backgroundImage: currentTree?.backdrop || currentTree?.fallbackBackground
                            }}
                        />

                        <div className="talent-tree-scroll-container">
                            <div className="talent-tier-rail" style={{ height: `${boardHeight}px` }}>
                                {[1, 2, 3, 4, 5, 6, 7].map(tier => {
                                    const tierY = treeAnalysis.tierMap[tier] ?? (tier - 1);
                                    const { posY } = getNodePos(0, tierY);
                                    return (
                                        <div
                                            key={tier}
                                            className="talent-tier-label"
                                            style={{
                                                position: 'absolute',
                                                top: `${posY}px`,
                                                transform: 'translateY(-50%)'
                                            }}
                                        >
                                            T{tier}
                                        </div>
                                    );
                                })}
                            </div>

                            <div
                                ref={boardRef}
                                className="talent-grid-board"
                                style={{
                                    height: `${boardHeight}px`,
                                    minHeight: `${boardHeight}px`
                                }}
                            >
                                <TalentArrowRenderer
                                    talents={currentTree?.talents || []}
                                    learnedTalents={talents}
                                    cellWidth={gridDims.width / 5}
                                    cellHeight={cellHeight}
                                    talentSize={talentSize}
                                    getNodePos={getNodePos}
                                />

                                {(currentTree?.talents || []).map(talent => {
                                    const curRanks = talents[talent.id] || 0;
                                    const isMaxed = curRanks >= (talent.maxRanks || 1);
                                    const canLearn = canLearnTalent(talent);
                                    const isLearnable = canLearn && !isMaxed;
                                    const isSelected = inspectedTalent?.id === talent.id;

                                    const { posX, posY } = getNodePos(talent.position?.x ?? 0, talent.position?.y ?? 0);

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
                    </div>

                    <div className="talent-book-spine-divider">
                        <div className="talent-spine-stitch"></div>
                        <div className="talent-spine-stitch"></div>
                        <div className="talent-spine-stitch"></div>
                    </div>

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
