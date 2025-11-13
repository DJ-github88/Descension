import React, { useState, useRef } from 'react';
import WowWindow from './WowWindow';
import useCharacterStore from '../../store/characterStore';
import { CLASS_SPECIALIZATIONS } from '../../data/classSpellCategories';
import { getTalentsForSpec, getTreeBackdrop, getFallbackBackground } from '../../data/talentTreeData';
import { TalentArrowRenderer } from './TalentArrow';
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

// Helper function to calculate dynamic tooltip description based on current rank
const getDynamicDescription = (talent, currentRank) => {
    if (!talent.description) return '';

    // Show what you CURRENTLY have (currentRank)
    // This shows your actual bonuses
    const displayRank = currentRank;

    // Replace "per rank" calculations with actual values
    let description = talent.description;

    // Pattern: "X per rank" or "+X per rank" where X can be a number or dice notation
    const perRankPattern = /(\+?)(\d+(?:d\d+)?)\s+([a-zA-Z\s]+?)\s*per\s+rank\.?/gi;
    description = description.replace(perRankPattern, (match, plus, value, type) => {
        // Check if it's dice notation (e.g., "1d4")
        if (value.includes('d')) {
            const [numDice, diceSize] = value.split('d').map(Number);
            const scaledDice = numDice * displayRank;
            return `${plus}${scaledDice}d${diceSize} ${type.trim()}`;
        } else {
            // It's a flat number
            const scaledValue = parseInt(value) * displayRank;
            return `${plus}${scaledValue} ${type.trim()}`;
        }
    });

    // Pattern: "X% per rank" for percentage calculations
    const percentPerRankPattern = /(\d+)%\s+([a-zA-Z\s]+)\s+per rank/gi;
    description = description.replace(percentPerRankPattern, (match, percent, type) => {
        const scaledPercent = parseInt(percent) * displayRank;
        return `${scaledPercent}% ${type}`;
    });

    // Pattern: "on X+ per rank" for DC/difficulty scaling
    const dcPerRankPattern = /on\s+(\d+)\+\s+per rank/gi;
    description = description.replace(dcPerRankPattern, (match, baseDC) => {
        const scaledDC = parseInt(baseDC) + (displayRank - 1);
        return `on ${scaledDC}+`;
    });

    return description;
};

// Constants for grid layout - Compact fit for better usability
const CELL_WIDTH = 132;  // Width of each grid cell (fits 5 columns in 660px available)
const CELL_HEIGHT = 96;  // Height of each grid cell (fits 8 rows in 768px available)
const GRID_COLUMNS = 5;  // Number of columns in the grid
const GRID_ROWS = 8;     // Number of rows in the grid (reduced for more compact window)
const TALENT_SIZE = 56;  // Size of talent icon (optimized for perfect fit)

const TalentTreeWindow = ({ isOpen, onClose }) => {
    const { class: characterClass } = useCharacterStore();
    const [selectedTree, setSelectedTree] = useState(0);
    const [talents, setTalents] = useState({});
    const [hoveredTalent, setHoveredTalent] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [unlearnError, setUnlearnError] = useState(null);
    const hoverTimeoutRef = useRef(null);
    const gridContainerRef = useRef(null);

    const trees = getTalentTreesForClass(characterClass);
    const currentTree = trees[selectedTree];

    // Calculate total points spent in current tree
    // We need to count points from talents that belong to the current tree
    const pointsSpent = currentTree ?
        currentTree.talents.reduce((sum, talent) => {
            return sum + (talents[talent.id] || 0);
        }, 0) : 0;

    const handleTalentClick = (talentId, talent) => {
        if (!canLearnTalent(talent)) return;

        setTalents(prev => {
            const currentRanks = prev[talentId] || 0;
            if (currentRanks < talent.maxRanks) {
                return { ...prev, [talentId]: currentRanks + 1 };
            }
            return prev;
        });
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

        // Calculate points spent in simulated state
        const simulatedPointsSpent = currentTree ?
            currentTree.talents.reduce((sum, talent) => {
                return sum + (simulatedTalents[talent.id] || 0);
            }, 0) : 0;

        // Check if any currently invested talents would become inaccessible
        for (const [investedTalentId, investedRanks] of Object.entries(currentTalents)) {
            if (investedRanks === 0) continue; // Skip talents with 0 ranks

            const investedTalent = currentTree.talents.find(t => t.id === investedTalentId);
            if (!investedTalent) continue;

            // Check tier accessibility
            const accessibleTier = Math.floor(simulatedPointsSpent / 3);
            const talentTier = Math.floor(investedTalent.position.y);
            if (talentTier > accessibleTier) {
                return false; // This invested talent would become inaccessible
            }

            // Check prerequisites
            if (investedTalent.requires) {
                if (typeof investedTalent.requires === 'string') {
                    const prereqTalent = currentTree.talents.find(t => t.id === investedTalent.requires);
                    if (prereqTalent) {
                        const prereqRanks = simulatedTalents[investedTalent.requires] || 0;
                        if (prereqRanks < prereqTalent.maxRanks) {
                            return false; // Prerequisite would not be met
                        }
                    }
                }
                // Add similar checks for array prerequisites if needed
            }
        }

        return true; // Safe to unlearn
    };

    const handleTalentRightClick = (e, talentId, talent) => {
        e.preventDefault();
        if (!canUnlearnTalent(talentId, talents)) {
            // Show error message
            setUnlearnError({
                message: "Cannot unlearn this talent - other talents depend on it",
                position: { x: e.clientX, y: e.clientY }
            });
            // Clear error after 2 seconds
            setTimeout(() => setUnlearnError(null), 2000);
            return;
        }

        setTalents(prev => {
            const currentRanks = prev[talentId] || 0;
            if (currentRanks > 0) {
                const newTalents = { ...prev };
                newTalents[talentId] = currentRanks - 1;
                if (newTalents[talentId] === 0) {
                    delete newTalents[talentId];
                }
                return newTalents;
            }
            return prev;
        });
    };

    const canLearnTalent = (talent) => {
        // Calculate accessible tier based on points spent (every 3 points unlocks next tier)
        const accessibleTier = Math.floor(pointsSpent / 3);

        // Check if talent is in an accessible tier
        const talentTier = Math.floor(talent.position.y);
        if (talentTier > accessibleTier) return false;

        // Check if required talent(s) are FULLY MAXED OUT
        if (talent.requires) {
            if (typeof talent.requires === 'string') {
                // Single prerequisite - must be fully maxed
                const prereqTalent = currentTree.talents.find(t => t.id === talent.requires);
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
                        const prereqTalent = currentTree.talents.find(t => t.id === prereqId);
                        if (!prereqTalent) return false;

                        const currentRanks = talents[prereqId] || 0;
                        if (currentRanks < prereqTalent.maxRanks) {
                            return false;
                        }
                    }
                } else {
                    // OR logic - at least ONE prerequisite must be fully maxed
                    const hasAnyMaxedPrereq = talent.requires.some(prereqId => {
                        const prereqTalent = currentTree.talents.find(t => t.id === prereqId);
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
            setHoveredTalent(talent);
            setTooltipPosition({ x: e.clientX, y: e.clientY });
        }, 300);
    };

    const handleTalentMouseMove = (e, talent) => {
        if (hoveredTalent && hoveredTalent.id === talent.id) {
            setTooltipPosition({ x: e.clientX, y: e.clientY });
        }
    };

    const handleTalentMouseLeave = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        setHoveredTalent(null);
    };

    const resetTalents = () => {
        setTalents({});
    };

    if (!trees || trees.length === 0) {
        return (
            <WowWindow
                title="Talent Tree"
                isOpen={isOpen}
                onClose={onClose}
                defaultSize={{ width: 900, height: 700 }}
                defaultPosition={{ x: 200, y: 100 }}
            >
                <div className="talent-tree-error">
                    {!characterClass ? (
                        <div className="no-class-message">
                            <h2>❄️ The Empty Grimoire ❄️</h2>
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
            </WowWindow>
        );
    }

    return (
        <WowWindow
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
            <div className="talent-tree-container">

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
                                                            src={`https://wow.zamimg.com/images/wow/icons/large/${talent.icon}.jpg`}
                                                            alt={talent.name}
                                                            className="talent-summary-icon"
                                                            onError={(e) => e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg'}
                                                        />
                                                        <div className="talent-summary-ranks">
                                                            {currentRanks}/{talent.maxRanks}
                                                        </div>
                                                    </div>
                                                    <div className="talent-summary-details">
                                                        <div className="talent-summary-name">{talent.name}</div>
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
                                        onMouseMove={(e) => handleTalentMouseMove(e, talent)}
                                        onMouseLeave={handleTalentMouseLeave}
                                        style={{
                                            width: `${TALENT_SIZE}px`,
                                            height: `${TALENT_SIZE}px`
                                        }}
                                    >
                                        <div className="talent-icon-wrapper">
                                            <img
                                                src={`https://wow.zamimg.com/images/wow/icons/large/${talent.icon}.jpg`}
                                                alt={talent.name}
                                                className="talent-icon"
                                                onError={(e) => e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg'}
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

                {/* Talent Tooltip */}
                {hoveredTalent && (
                    <div
                        key={`${hoveredTalent.id}-${talents[hoveredTalent.id] || 0}`}
                        className="talent-tooltip"
                        style={{
                            position: 'fixed',
                            left: tooltipPosition.x + 5,
                            top: tooltipPosition.y + 5,
                            pointerEvents: 'none',
                            zIndex: 2147483647
                        }}
                    >
                        <div className="talent-tooltip-header">
                            <div className="talent-tooltip-name">{hoveredTalent.name}</div>
                            {hoveredTalent.maxRanks > 1 && (
                                <div className="talent-tooltip-ranks">
                                    Rank {talents[hoveredTalent.id] || 0}/{hoveredTalent.maxRanks}
                                </div>
                            )}
                        </div>
                        <div className="talent-tooltip-description">
                            {getDynamicDescription(hoveredTalent, talents[hoveredTalent.id] || 0)}
                        </div>
                        {(() => {
                            const talentTier = Math.floor(hoveredTalent.position.y);
                            const requiredPoints = (talentTier + 1) * 3;
                            return talentTier > 0 && (
                                <div className="talent-tooltip-requirement">
                                    Requires {requiredPoints} points in {currentTree.name}
                                </div>
                            );
                        })()}
                        {hoveredTalent.requires && (
                            <div className="talent-tooltip-requirement">
                                {typeof hoveredTalent.requires === 'string'
                                    ? 'Requires previous talent'
                                    : hoveredTalent.requiresAll
                                        ? `Requires all: ${hoveredTalent.requires.length} talents`
                                        : `Requires any: ${hoveredTalent.requires.length} talents`
                                }
                            </div>
                        )}
                        <div className="talent-tooltip-hint">
                            Left-click to learn | Right-click to unlearn
                        </div>
                    </div>
                )}
            </div>
        </WowWindow>
    );
};

export default TalentTreeWindow;

