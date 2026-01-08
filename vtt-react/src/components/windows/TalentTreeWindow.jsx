import React, { useState, useRef, useEffect, useCallback } from 'react';
import WowWindow from './WowWindow';
import useCharacterStore from '../../store/characterStore';
import { CLASS_SPECIALIZATIONS } from '../../data/classSpellCategories';
import { getTalentsForSpec, getTreeBackdrop, getFallbackBackground } from '../../data/talentTreeData';
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

// Progressive tooltip descriptions for talents
const PROGRESSIVE_TOOLTIPS = {
    // Lunarch - Moonlight Sentinel
    'moonlight_sentinel_t0_lunar_precision': {
        1: 'Your ranged attacks gain +1 to attack rolls.',
        2: 'Your ranged attacks gain +1 to attack rolls. Lunar Arrow and Moonbeam have +10ft range.',
        3: 'Your ranged attacks gain +1 to attack rolls. Lunar Arrow and Moonbeam have +10ft range. Full Moon phase grants +1d4 bonus radiant damage on ranged attacks.',
        4: 'Your ranged attacks gain +1 to attack rolls. Lunar Arrow and Moonbeam have +20ft range. Full Moon phase grants +1d4 bonus radiant damage on ranged attacks.',
        5: 'Your ranged attacks gain +1 to attack rolls. Lunar Arrow and Moonbeam have +20ft range. Full Moon phase grants +2d4 bonus radiant damage on ranged attacks.'
    },
    'moonlight_sentinel_t1_true_shot': {
        1: 'Once per turn when you hit with a ranged attack, you can spend 1 action point to make another ranged attack at advantage.',
        2: 'Once per turn when you hit with a ranged attack, you can spend 1 action point to make another ranged attack at advantage. Your bonus attack also deals +1d6 radiant damage.',
        3: 'Once per turn when you hit with a ranged attack, you can spend 1 action point to make another ranged attack at advantage. Your bonus attack also deals +1d6 radiant damage and ignores half cover.',
        4: 'Once per turn when you hit with a ranged attack, you can spend 1 action point to make another ranged attack at advantage. Your bonus attack also deals +2d6 radiant damage and ignores half and three-quarters cover.'
    },
    'moonlight_sentinel_t2_lunar_guidance': {
        1: 'Your ranged attacks ignore half cover.',
        2: 'Your ranged attacks ignore half cover. Full Moon phase allows you to attack twice using 1 action point when you crit.',
        3: 'Your ranged attacks ignore half cover and three-quarters cover. Full Moon phase allows you to attack twice using 1 action point when you crit.',
        4: 'Your ranged attacks ignore half cover and three-quarters cover. Full Moon phase allows you to attack three times using 1 action point when you crit.'
    },
    'moonlight_sentinel_t3_marksman_focus': {
        1: 'You can spend 1 action point to gain advantage on your next ranged attack.',
        2: 'You can spend 1 action point to gain advantage on your next ranged attack. Your critical hit range increases by 1.',
        3: 'You can spend 1 action point to gain advantage on your next ranged attack. Your critical hit range increases by 1. You can use this ability twice per short rest.',
        4: 'You can spend 1 action point to gain advantage on your next ranged attack. Your critical hit range increases by 2. You can use this ability twice per short rest.'
    },
    'moonlight_sentinel_t1_moonlight_arrow': {
        1: 'Your Lunar Arrow deals +1d6 radiant damage.',
        2: 'Your Lunar Arrow deals +1d6 radiant damage and reduces the target\'s radiant resistance by 5.',
        3: 'Your Lunar Arrow deals +2d6 radiant damage and reduces the target\'s radiant resistance by 5.',
        4: 'Your Lunar Arrow deals +2d6 radiant damage and reduces the target\'s radiant resistance by 10.'
    },
    'moonlight_sentinel_t2_radiant_burst': {
        1: 'When you crit with a ranged attack during Full Moon, all enemies within 10ft of the target take 1d8 radiant damage.',
        2: 'When you crit with a ranged attack during Full Moon, all enemies within 10ft of the target take 2d8 radiant damage.',
        3: 'When you crit with a ranged attack during Full Moon, all enemies within 10ft of the target take 2d8 radiant damage. Enemies hit take -1d4 on their next attack.',
        4: 'When you crit with a ranged attack during Full Moon, all enemies within 15ft of the target take 3d8 radiant damage. Enemies hit take -1d4 on their next attack.'
    },
    'moonlight_sentinel_t3_lunar_empowerment': {
        1: 'During Full Moon, your ranged attacks reduce the target\'s radiant resistance by 5, to a minimum of 0.',
        2: 'During Full Moon, your ranged attacks reduce the target\'s radiant resistance by 10, to a minimum of 0.',
        3: 'During Full Moon, your ranged attacks reduce the target\'s radiant resistance by 10, to a minimum of 0. You gain +1 to attack rolls during Full Moon.',
        4: 'During Full Moon, your ranged attacks reduce the target\'s radiant resistance by 15, to a minimum of 0. You gain +1 to attack rolls during Full Moon.'
    },
    'moonlight_sentinel_t4_deadly_precision': {
        1: 'Enemies that die from your AoE spells explode, dealing 3d6 force damage to all enemies within 10ft.',
        2: 'Enemies that die from your AoE spells explode, dealing 6d6 force damage to all enemies within 10ft.',
        3: 'Enemies that die from your AoE spells explode, dealing 9d6 force damage to all enemies within 10ft.',
        4: 'Enemies that die from your AoE spells explode, dealing 12d6 force damage to all enemies within 10ft.',
        5: 'Enemies that die from your AoE spells explode, dealing 15d6 force damage to all enemies within 10ft.'
    },
    'moonlight_sentinel_t5_lunar_sentinel': {
        1: 'As a reaction when an ally within 30ft takes damage, you can reduce the damage by 2d6 per rank and heal them for the reduced amount.',
        2: 'As a reaction when an ally within 30ft takes damage, you can reduce the damage by 2d6 per rank and heal them for the reduced amount.',
        3: 'As a reaction when an ally within 30ft takes damage, you can reduce the damage by 2d6 per rank and heal them for the reduced amount.',
        4: 'As a reaction when an ally within 30ft takes damage, you can reduce the damage by 2d6 per rank and heal them for the reduced amount.',
        5: 'As a reaction when an ally within 30ft takes damage, you can reduce the damage by 2d6 per rank and heal them for the reduced amount.'
    },
    // Starfall Invoker
    'starfall_invoker_t0_cosmic_attunement': {
        1: 'Your spells can be cast as ranged spell attacks.',
        2: 'Your spells can be cast as ranged spell attacks. Starfall and Moonbeam affect +5ft radius.',
        3: 'Your spells can be cast as ranged spell attacks. Starfall and Moonbeam affect +5ft radius. Waning Moon phase allows you to affect one extra target with single-target spells.',
        4: 'Your spells can be cast as ranged spell attacks. Starfall and Moonbeam affect +10ft radius. Waning Moon phase allows you to affect one extra target with single-target spells.',
        5: 'Your spells can be cast as ranged spell attacks. Starfall and Moonbeam affect +10ft radius. Waning Moon phase allows you to affect two extra targets with single-target spells.'
    }
};

// Helper function to generate progressive tooltips for multi-rank talents
const generateProgressiveTooltip = (talent, currentRank) => {
    // Split the description into sentences
    const sentences = talent.description.split(/[.!?]+/).filter(s => s.trim().length > 0);

    if (sentences.length <= 1 || talent.maxRanks === 1) {
        // Single benefit talent or single-rank talent - show full description
        return talent.description;
    }

    // Multi-benefit, multi-rank talent - show progressive unlocking of benefits
    const numBenefits = sentences.length;
    const benefitsPerRank = Math.max(1, Math.ceil(numBenefits / talent.maxRanks));
    const benefitsToShow = Math.min(numBenefits, currentRank * benefitsPerRank);

    const progressiveDescription = sentences.slice(0, benefitsToShow).join('. ').trim();
    return progressiveDescription + (progressiveDescription ? '.' : '');
};

// Helper function to get description for a specific rank
const getDescriptionForRank = (talent, rank) => {
    // Check if this talent has progressive tooltips defined
    if (PROGRESSIVE_TOOLTIPS[talent.id] && PROGRESSIVE_TOOLTIPS[talent.id][rank]) {
        return PROGRESSIVE_TOOLTIPS[talent.id][rank];
    }

    // Check if description uses rank-specific format (e.g., "Rank 1: effect. Rank 2: effect.")
    const rankSpecificPattern = /Rank\s+(\d+)(?:-(\d+))?:\s*([^]+?)(?=\s*Rank\s+\d+:|\s*$)/gi;
    const rankMatches = [];
    let match;

    // Extract all rank-specific descriptions
    while ((match = rankSpecificPattern.exec(talent.description)) !== null) {
        const startRank = parseInt(match[1]);
        const endRank = match[2] ? parseInt(match[2]) : startRank;
        const description = match[3].trim();

        rankMatches.push({
            startRank,
            endRank,
            description
        });
    }

    // If rank-specific descriptions found, find the one for this rank
    if (rankMatches.length > 0) {
        for (const rankMatch of rankMatches) {
            if (rank >= rankMatch.startRank && rank <= rankMatch.endRank) {
                return rankMatch.description;
            }
        }
        // Fallback to last rank if specific rank not found
        return rankMatches[rankMatches.length - 1].description;
    }

    // For "per rank" talents, calculate individual rank effect
    let description = talent.description;

    // Pattern: "X per rank" or "+X per rank" where X can be a number or dice notation
    const perRankPattern = /(\+?)(\d+(?:d\d+)?)\s+([a-zA-Z\s]+?)\s*per\s+rank\.?/gi;
    description = description.replace(perRankPattern, (match, plus, value, type) => {
        // Check if it's dice notation (e.g., "1d4")
        if (value.includes('d')) {
            return `${plus}${value} ${type.trim()}`;
        } else {
            // It's a flat number
            return `${plus}${value} ${type.trim()}`;
        }
    });

    // Pattern: "X% per rank" for percentage calculations
    const percentPerRankPattern = /(\d+)%\s+([a-zA-Z\s]+)\s+per rank/gi;
    description = description.replace(percentPerRankPattern, (match, percent, type) => {
        return `${percent}% ${type}`;
    });

    // Pattern: "on X+ per rank" for DC/difficulty scaling
    const dcPerRankPattern = /on\s+(\d+)\+\s+per rank/gi;
    description = description.replace(dcPerRankPattern, (match, baseDC) => {
        return `on ${baseDC}+`;
    });

    return description;
};

// Helper function to calculate dynamic tooltip description based on current rank (WoW Classic style)
const getDynamicDescription = (talent, currentRank) => {
    if (!talent.description) return '';

    const tooltipParts = [];

    // Show current rank effect (if any ranks invested)
    if (currentRank > 0) {
        const currentEffect = getDescriptionForRank(talent, currentRank);
        tooltipParts.push(
            <div key="current" style={{ marginBottom: '8px' }}>
                <div style={{ color: '#8B4513', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.9rem' }}>
                    Rank {currentRank}:
                </div>
                <div style={{ color: '#2d1810' }}>{currentEffect}</div>
            </div>
        );
    }

    // Show next rank effect (if not maxed out)
    if (currentRank < talent.maxRanks) {
        const nextRank = currentRank + 1;
        const nextEffect = getDescriptionForRank(talent, nextRank);
        tooltipParts.push(
            <div key="next" style={{ marginTop: currentRank > 0 ? '8px' : '0', paddingTop: currentRank > 0 ? '8px' : '0', borderTop: currentRank > 0 ? '1px solid rgba(139, 69, 19, 0.3)' : 'none' }}>
                <div style={{ color: '#b8860b', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.9rem' }}>
                    Next Rank {nextRank}:
                </div>
                <div style={{ color: '#5a1e12' }}>{nextEffect}</div>
            </div>
        );
    }

    // For rank 0 talents, just show the next rank effect without "Next Rank" label
    if (currentRank === 0) {
        const nextEffect = getDescriptionForRank(talent, 1);
        return nextEffect;
    }

    return <div>{tooltipParts}</div>;
};

// Constants for grid layout - Compact fit for better usability
const CELL_WIDTH = 132;  // Width of each grid cell (fits 5 columns in 660px available)
const CELL_HEIGHT = 96;  // Height of each grid cell (fits 8 rows in 768px available)
const GRID_COLUMNS = 5;  // Number of columns in the grid
const GRID_ROWS = 8;     // Number of rows in the grid (reduced for more compact window)
const TALENT_SIZE = 56;  // Size of talent icon (optimized for perfect fit)

const TalentTreeWindow = ({ isOpen, onClose }) => {
    const { class: characterClass, level } = useCharacterStore();
    const [selectedTree, setSelectedTree] = useState(0);
    const [talents, setTalents] = useState({});
    const [unlearnError, setUnlearnError] = useState(null);
    const hoverTimeoutRef = useRef(null);
    const gridContainerRef = useRef(null);

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

    // Calculate available talent points based on level (3 points per level, max 30 at level 10)
    const availablePoints = Math.min((level || 1) * 3, 30);
    const pointsRemaining = availablePoints - pointsSpent;

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

        // Calculate total points spent across ALL trees in simulated state
        const simulatedPointsSpent = trees.reduce((total, tree) => {
            return total + tree.talents.reduce((sum, talent) => {
                return sum + (simulatedTalents[talent.id] || 0);
            }, 0);
        }, 0);

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
        </WowWindow>
    );
};

export default TalentTreeWindow;

