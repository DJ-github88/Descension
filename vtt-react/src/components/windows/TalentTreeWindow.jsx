import React, { useState, useRef } from 'react';
import WowWindow from './WowWindow';
import useCharacterStore from '../../store/characterStore';
import { CLASS_SPECIALIZATIONS } from '../../data/classSpellCategories';
import { getTalentsForSpec, getTreeBackdrop, getFallbackBackground } from '../../data/talentTreeData';
import { TalentArrowRenderer } from './TalentArrow';
import TooltipPortal from '../tooltips/TooltipPortal';
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

    // If no ranks invested, show the base description
    if (currentRank === 0) return talent.description;

    // Replace "per rank" calculations with actual values
    let description = talent.description;

    // Pattern: "X per rank" or "+X per rank" where X can be a number or dice notation
    const perRankPattern = /(\+?)(\d+d?\d*)\s+([a-zA-Z\s]+)\s+per rank/gi;
    description = description.replace(perRankPattern, (match, plus, value, type) => {
        // Check if it's dice notation (e.g., "1d4")
        if (value.includes('d')) {
            const [numDice, diceSize] = value.split('d').map(Number);
            const scaledDice = numDice * currentRank;
            return `${plus}${scaledDice}d${diceSize} ${type}`;
        } else {
            // It's a flat number
            const scaledValue = parseInt(value) * currentRank;
            return `${plus}${scaledValue} ${type}`;
        }
    });

    return description;
};

// Constants for grid layout - TTRPG style with larger icons
const CELL_WIDTH = 120;  // Width of each grid cell (increased for larger icons)
const CELL_HEIGHT = 110; // Height of each grid cell (tighter vertical spacing)
const GRID_COLUMNS = 5;  // Number of columns in the grid (expanded for more interesting trees)
const GRID_ROWS = 7;     // Number of rows in the grid
const TALENT_SIZE = 80;  // Size of talent icon (increased from 64px)

const TalentTreeWindow = ({ isOpen, onClose }) => {
    const { class: characterClass } = useCharacterStore();
    const [selectedTree, setSelectedTree] = useState(0);
    const [talents, setTalents] = useState({});
    const [hoveredTalent, setHoveredTalent] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
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

    const handleTalentRightClick = (e, talentId, talent) => {
        e.preventDefault();
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
        // Check if player has enough points spent in tree
        if (pointsSpent < talent.requiresPoints) return false;

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
                    <p>No talent trees available for class: {characterClass}</p>
                </div>
            </WowWindow>
        );
    }

    return (
        <WowWindow
            title={`Talent Tree - ${characterClass}`}
            isOpen={isOpen}
            onClose={onClose}
            defaultSize={{ width: 700, height: 800 }}
            defaultPosition={{ x: 200, y: 50 }}
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
                            height: `${GRID_ROWS * CELL_HEIGHT}px`
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

                    {/* Talent Tooltip */}
                    {hoveredTalent && selectedTree < trees.length && (
                        <TooltipPortal>
                            <div
                                className="talent-tooltip"
                                style={{
                                    position: 'fixed',
                                    left: tooltipPosition.x + 15,
                                    top: tooltipPosition.y - 10,
                                    pointerEvents: 'none'
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
                                {hoveredTalent.requiresPoints > 0 && (
                                    <div className="talent-tooltip-requirement">
                                        Requires {hoveredTalent.requiresPoints} points in {currentTree.name}
                                    </div>
                                )}
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
                        </TooltipPortal>
                    )}
                )}
            </div>
        </WowWindow>
    );
};

export default TalentTreeWindow;

