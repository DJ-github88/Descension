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

        // Check if required talent(s) are learned
        if (talent.requires) {
            if (typeof talent.requires === 'string') {
                // Single prerequisite
                if (!talents[talent.requires] || talents[talent.requires] === 0) {
                    return false;
                }
            } else if (Array.isArray(talent.requires)) {
                // Multiple prerequisites
                if (talent.requiresAll) {
                    // AND logic - all prerequisites must be met
                    for (const prereqId of talent.requires) {
                        if (!talents[prereqId] || talents[prereqId] === 0) {
                            return false;
                        }
                    }
                } else {
                    // OR logic - at least one prerequisite must be met
                    const hasAnyPrereq = talent.requires.some(
                        prereqId => talents[prereqId] && talents[prereqId] > 0
                    );
                    if (!hasAnyPrereq) {
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
                </div>
            }
        >
            <div className="talent-tree-container">

                {/* Talent Grid */}
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
                        {/* Tier separators for visual hierarchy */}
                        {[1, 2, 3, 4, 5, 6].map(tier => (
                            <div
                                key={`tier-${tier}`}
                                className="tier-separator"
                                style={{
                                    position: 'absolute',
                                    top: `${tier * CELL_HEIGHT - 5}px`,
                                    left: '0',
                                    width: '100%',
                                    height: '1px',
                                    background: 'linear-gradient(90deg, transparent 0%, rgba(139, 69, 19, 0.3) 20%, rgba(139, 69, 19, 0.3) 80%, transparent 100%)',
                                    pointerEvents: 'none',
                                    zIndex: 1
                                }}
                            />
                        ))}

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
                {hoveredTalent && (
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
                                {hoveredTalent.description}
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
            </div>
        </WowWindow>
    );
};

export default TalentTreeWindow;

