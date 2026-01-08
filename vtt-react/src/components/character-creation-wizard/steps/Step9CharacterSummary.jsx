/**
 * Step 9: Character Summary & Finalization
 *
 * Final review of character before creation
 */

import React, { useState, useRef, useEffect } from 'react';
import { useCharacterWizardState } from '../context/CharacterWizardContext';
import { ABILITY_SCORES, getStatBreakdown } from '../../../utils/pointBuySystem';
import { getPathData, getPathStatModifiers } from '../../../data/pathData';
import { getWowIconUrl, getIconUrl } from '../../../utils/assetManager';
import { getBackgroundData, getBackgroundStatModifiers } from '../../../data/backgroundData';
import { getBackgroundAbilities } from '../../../data/backgroundAbilities';
import { applyRacialModifiers } from '../../../data/raceData';
import { getEquipmentPreview, STARTING_EQUIPMENT_LIBRARY } from '../../../data/startingEquipmentData';
import ItemTooltip from '../../item-generation/ItemTooltip';

const Step9CharacterSummary = () => {
    const state = useCharacterWizardState();
    const { characterData } = state;
    const [tooltip, setTooltip] = useState({ show: false, item: null, x: 0, y: 0 });
    const tooltipRef = useRef(null);

    // Helper function to format values (replace underscores with spaces, capitalize)
    const formatValue = (value) => {
        if (!value) return '';
        return value
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    };

    // Get modifiers for stat breakdown
    const pathModifiers = characterData.path ? getPathStatModifiers(characterData.path) : {};
    const racialModifiers = characterData.race && characterData.subrace ? applyRacialModifiers({}, characterData.race, characterData.subrace) : {};
    const backgroundModifiers = characterData.background ? getBackgroundStatModifiers(characterData.background) : {};
    const statBreakdown = getStatBreakdown(characterData.baseStats, racialModifiers, backgroundModifiers, pathModifiers);

    // Helper functions for extended equipment preview
    const getFullItemObjects = (itemNames) => {
        return itemNames.map(itemName => {
            // First try to find the item by its full original name
            let foundItem = STARTING_EQUIPMENT_LIBRARY.find(item =>
                item.name.toLowerCase() === itemName.toLowerCase()
            );

            if (foundItem) {
                return foundItem;
            }

            // If not found, try parsing quantity and finding base item
            const quantityMatch = itemName.match(/(.+?)\s*\((\d+)\s*(?:feet?|lbs?|gp|sp|cp|gold|silver|copper)?\)/i);
            if (quantityMatch) {
                const cleanName = quantityMatch[1].trim();
                foundItem = STARTING_EQUIPMENT_LIBRARY.find(item =>
                    item.name.toLowerCase() === cleanName.toLowerCase()
                );
                if (foundItem) {
                    return foundItem;
                }
            }

            // Try some common name variations (capitalization, spacing)
            const variations = [
                itemName,
                itemName.toLowerCase(),
                itemName.charAt(0).toUpperCase() + itemName.slice(1).toLowerCase(),
                itemName.replace(/\b\w/g, l => l.toUpperCase()) // Title case
            ];

            for (const variation of variations) {
                foundItem = STARTING_EQUIPMENT_LIBRARY.find(item =>
                    item.name === variation
                );
                if (foundItem) {
                    return foundItem;
                }
            }

            return null;
        }).filter(item => item); // Remove undefined items
    };

    // Equipment hover handlers (same as equipment selection)
    const handleItemMouseEnter = (e, item) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Use more conservative estimates and add buffer
        const tooltipWidth = 280; // Increased estimate with buffer
        const tooltipHeight = 250; // Increased estimate with buffer
        const margin = 15; // Increased margin

        // Preferred position: right of item, aligned to top
        let x = rect.right + margin;
        let y = rect.top;

        // Check if preferred position fits
        const fitsRight = (x + tooltipWidth) <= viewportWidth;
        const fitsBelow = (y + tooltipHeight) <= viewportHeight;

        if (!fitsRight) {
            // Try left side
            x = rect.left - tooltipWidth - margin;
            if (x < margin) {
                // Doesn't fit left either, center horizontally
                x = (viewportWidth - tooltipWidth) / 2;
            }
        }

        // Handle vertical positioning
        if (!fitsBelow) {
            // Try above the item
            y = rect.top - tooltipHeight - margin;
            if (y < margin) {
                // Doesn't fit above, position below but clamp to viewport
                y = Math.max(margin, viewportHeight - tooltipHeight - margin);
            }
        }

        // Final clamping to ensure tooltip stays within viewport
        x = Math.max(margin, Math.min(x, viewportWidth - tooltipWidth - margin));
        y = Math.max(margin, Math.min(y, viewportHeight - tooltipHeight - margin));

        setTooltip({
            show: true,
            item: item,
            x: x,
            y: y
        });
    };

    const handleItemMouseMove = (e) => {
        if (tooltip.show) {
            const rect = e.currentTarget.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Use more conservative estimates and add buffer
            const tooltipWidth = 280; // Increased estimate with buffer
            const tooltipHeight = 250; // Increased estimate with buffer
            const margin = 15; // Increased margin

            // Preferred position: right of item, aligned to top
            let x = rect.right + margin;
            let y = rect.top;

            // Check if preferred position fits
            const fitsRight = (x + tooltipWidth) <= viewportWidth;
            const fitsBelow = (y + tooltipHeight) <= viewportHeight;

            if (!fitsRight) {
                // Try left side
                x = rect.left - tooltipWidth - margin;
                if (x < margin) {
                    // Doesn't fit left either, center horizontally
                    x = (viewportWidth - tooltipWidth) / 2;
                }
            }

            // Handle vertical positioning
            if (!fitsBelow) {
                // Try above the item
                y = rect.top - tooltipHeight - margin;
                if (y < margin) {
                    // Doesn't fit above, position below but clamp to viewport
                    y = Math.max(margin, viewportHeight - tooltipHeight - margin);
                }
            }

            // Final clamping to ensure tooltip stays within viewport
            x = Math.max(margin, Math.min(x, viewportWidth - tooltipWidth - margin));
            y = Math.max(margin, Math.min(y, viewportHeight - tooltipHeight - margin));

            setTooltip(prev => ({
                ...prev,
                x: x,
                y: y
            }));
        }
    };

    const handleItemMouseLeave = () => {
        setTooltip({ show: false, item: null, x: 0, y: 0 });
    };

    // Get background and path data for display
    const backgroundData = characterData.background ? getBackgroundData(characterData.background) : null;
    const backgroundAbilities = characterData.background ? getBackgroundAbilities(characterData.background) : [];
    const pathData = characterData.path ? getPathData(characterData.path) : null;

    return (
        <div className="wizard-step-content">
            <div className="step-body">
                <div className="character-summary-layout">
                    {/* Left side - Character details */}
                    <div className="summary-details">
                        {/* Basic Information */}
                        <div className="summary-section">
                            <h3 className="section-title">
                                <i className="fas fa-user"></i>
                                Basic Information
                            </h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Name:</span>
                                    <span className="detail-value">{characterData.name}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Gender:</span>
                                    <span className="detail-value">{characterData.gender}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Race:</span>
                                    <span className="detail-value">{characterData.race}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Subrace:</span>
                                    <span className="detail-value">{formatValue(characterData.subrace)}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Class:</span>
                                    <span className="detail-value">{formatValue(characterData.class)}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Background:</span>
                                    <span className="detail-value">{backgroundData?.name || formatValue(characterData.background)}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Path:</span>
                                    <span className="detail-value">{pathData?.name || formatValue(characterData.path)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Base Stats */}
                        <div className="summary-section">
                            <h3 className="section-title">
                                <i className="fas fa-heart"></i>
                                Base Stats
                            </h3>
                            <div className="base-stats-summary">
                                {(() => {
                                    const { getRacialBaseStats } = require('../../../data/raceData');
                                    const baseStats = getRacialBaseStats(characterData.race, characterData.subrace);

                                    // Calculate current constitution score with all modifiers
                                    const baseConstitution = characterData.baseStats.constitution || 5;
                                    const finalConstitution = statBreakdown.constitution.final;

                                    // Calculate HP and Mana based on final constitution
                                    const baseHP = (finalConstitution * 5) + (baseStats.hp || 0);
                                    const baseMana = (finalConstitution * 5) + (baseStats.mana || 0);

                                    return (
                                        <div className="base-stats-grid">
                                            <div className="base-stat-summary-item">
                                                <div className="base-stat-header">
                                                    <i className="fas fa-heart"></i>
                                                    <span className="base-stat-name">Hit Points</span>
                                                </div>
                                                <div className="base-stat-value-display">
                                                    <span className="base-stat-value">{baseHP}</span>
                                                </div>
                                            </div>
                                            <div className="base-stat-summary-item">
                                                <div className="base-stat-header">
                                                    <i className="fas fa-magic"></i>
                                                    <span className="base-stat-name">Mana</span>
                                                </div>
                                                <div className="base-stat-value-display">
                                                    <span className="base-stat-value">{baseMana}</span>
                                                </div>
                                            </div>
                                            <div className="base-stat-summary-item">
                                                <div className="base-stat-header">
                                                    <i className="fas fa-running"></i>
                                                    <span className="base-stat-name">Speed</span>
                                                </div>
                                                <div className="base-stat-value-display">
                                                    <span className="base-stat-value">{baseStats.speed} ft</span>
                                                </div>
                                            </div>
                                            <div className="base-stat-summary-item">
                                                <div className="base-stat-header">
                                                    <i className="fas fa-bolt"></i>
                                                    <span className="base-stat-name">Action Points</span>
                                                </div>
                                                <div className="base-stat-value-display">
                                                    <span className="base-stat-value">{baseStats.ap}</span>
                                                </div>
                                            </div>
                                            {baseStats.armor !== undefined && baseStats.armor !== 0 && (
                                                <div className="base-stat-summary-item">
                                                    <div className="base-stat-header">
                                                        <i className="fas fa-shield-alt"></i>
                                                        <span className="base-stat-name">Armor</span>
                                                    </div>
                                                    <div className="base-stat-value-display">
                                                        <span className="base-stat-value">{baseStats.armor}</span>
                                                    </div>
                                                </div>
                                            )}
                                            {baseStats.darkvision !== undefined && baseStats.darkvision !== 0 && (
                                                <div className="base-stat-summary-item">
                                                    <div className="base-stat-header">
                                                        <i className="fas fa-eye"></i>
                                                        <span className="base-stat-name">Darkvision</span>
                                                    </div>
                                                    <div className="base-stat-value-display">
                                                        <span className="base-stat-value">{baseStats.darkvision} ft</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Ability Scores */}
                        <div className="summary-section">
                            <h3 className="section-title">
                                <i className="fas fa-chart-bar"></i>
                                Ability Scores
                            </h3>
                            <div className="abilities-grid">
                                {ABILITY_SCORES.map((ability) => {
                                    const breakdown = statBreakdown[ability.id];
                                    return (
                                        <div key={ability.id} className="ability-summary">
                                            <div className="ability-header">
                                                <i className={ability.icon}></i>
                                                <span className="ability-name">{ability.name}</span>
                                            </div>
                                            <div className="ability-value">
                                                <span className="final-score">{breakdown.final}</span>
                                                <span className="modifier">
                                                    ({breakdown.modifier >= 0 ? '+' : ''}{breakdown.modifier})
                                                </span>
                                            </div>
                                            <div className="ability-breakdown">
                                                <span className="base">Base: {breakdown.base}</span>
                                                {breakdown.racial !== 0 && (
                                                    <span className="racial">
                                                        Racial: {breakdown.racial >= 0 ? '+' : ''}{breakdown.racial}
                                                    </span>
                                                )}
                                                {breakdown.background !== 0 && (
                                                    <span className="background">
                                                        Background: {breakdown.background >= 0 ? '+' : ''}{breakdown.background}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Background Benefits */}
                        {backgroundData && (
                            <div className="summary-section">
                                <h3 className="section-title">
                                    <i className="fas fa-book"></i>
                                    Background Benefits
                                </h3>
                                <div className="background-benefits">
                                    <div className="benefit-group">
                                        <h4>Skill Proficiencies</h4>
                                        <div className="skill-tags">
                                            {backgroundData.skillProficiencies.map((skill, index) => (
                                                <span key={index} className="skill-tag">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {backgroundData.toolProficiencies && (
                                        <div className="benefit-group">
                                            <h4>Tool Proficiencies</h4>
                                            <div className="tool-tags">
                                                {backgroundData.toolProficiencies.map((tool, index) => (
                                                    <span key={index} className="tool-tag">{tool}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="benefit-group">
                                        <h4>Special Feature</h4>
                                        <div className="feature-display">
                                            <h5>{backgroundData.feature.name}</h5>
                                            <p>{backgroundData.feature.description}</p>
                                        </div>
                                    </div>

                                    {/* Background Abilities */}
                                    {backgroundAbilities && backgroundAbilities.length > 0 && (
                                        <div className="benefit-group">
                                            <h4>Background Abilities</h4>
                                            <div className="abilities-list">
                                                {backgroundAbilities.map((ability, index) => (
                                                    <div key={index} className="ability-item">
                                                        <div className="ability-header">
                                                            <h5 className="ability-name">{ability.name}</h5>
                                                            <div className="ability-meta">
                                                                <span className={`ability-type ${ability.type.toLowerCase()}`}>
                                                                    {ability.type}
                                                                </span>
                                                                <span className="ability-usage">{ability.usage}</span>
                                                            </div>
                                                        </div>
                                                        <p className="ability-description">
                                                            {ability.description}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Combined Inventory Section */}
                                    {((characterData.selectedEquipment && characterData.selectedEquipment.length > 0) ||
                                      (backgroundData.equipment && backgroundData.equipment.length > 0)) && (
                                        <div className="benefit-group">
                                            <h4>Inventory</h4>
                                            <div 
                                                className="equipment-preview-grid"
                                                style={{
                                                    minHeight: (() => {
                                                        // Calculate minimum height based on items
                                                        const allEquipment = [];
                                                        if (characterData.selectedEquipment) {
                                                            characterData.selectedEquipment.forEach(item => {
                                                                const fullItem = getFullItemObjects([item.name])[0];
                                                                if (fullItem) {
                                                                    allEquipment.push(fullItem);
                                                                }
                                                            });
                                                        }
                                                        if (allEquipment.length === 0) return '120px';
                                                        
                                                        const estimatedRows = Math.max(3, Math.ceil(allEquipment.length / 4) + 1);
                                                        const cellSize = 40;
                                                        const rowGap = 2;
                                                        const gridPadding = 8;
                                                        const gridHeight = (gridPadding * 2) + (estimatedRows * cellSize) + ((estimatedRows - 1) * rowGap);
                                                        return `${gridHeight}px`;
                                                    })()
                                                }}
                                            >
                                                {(() => {
                                                    // Combine purchased and background equipment
                                                    const allEquipment = [];

                                                    // Process all selected equipment (includes both purchased and auto-added background items)
                                                    if (characterData.selectedEquipment) {
                                                        characterData.selectedEquipment.forEach(item => {
                                                            // Determine if this is background equipment or purchased
                                                            const isBackgroundItem = backgroundData.equipment &&
                                                                backgroundData.equipment.some(bgItem =>
                                                                    bgItem.toLowerCase().includes(item.name.toLowerCase()) ||
                                                                    item.name.toLowerCase().includes(bgItem.toLowerCase().replace(/\s*\([^)]*\)/, ''))
                                                                );

                                                            const fullItem = getFullItemObjects([item.name])[0];
                                                            if (fullItem) {
                                                                allEquipment.push({
                                                                    ...fullItem,
                                                                    quantity: item.quantity || 1,
                                                                    source: isBackgroundItem ? 'background' : 'purchased'
                                                                });
                                                            }
                                                        });
                                                    }

                                                    // Equipment shop grid logic (larger for combined inventory)
                                                    const COLS = 8; // More columns for bigger inventory
                                                    const occupiedCells = new Map(); // Track occupied cells by "row,col" key
                                                    const gridRows = [];
                                                    const itemWrappers = [];
                                                    let totalRows = 0;

                                                    // Calculate grid constants
                                                    const cellSize = 40;
                                                    const cellGap = 1;
                                                    const rowGap = 2;
                                                    const gridPadding = 8;

                                                    // Place items in grid with proper dimensions
                                                    allEquipment.forEach((item, index) => {
                                                        if (!item) return;

                                                        const width = item.width || 1;
                                                        const height = item.height || 1;

                                                        // Find a spot for this item - dynamically expand grid if needed
                                                        let placed = false;
                                                        let maxRowToCheck = Math.max(10, totalRows + height + 2); // Always check beyond current items
                                                        
                                                        for (let row = 0; row < maxRowToCheck && !placed; row++) {
                                                            for (let col = 0; col < COLS && !placed; col++) {
                                                                // Check if this position and area is free
                                                                let canPlace = true;
                                                                for (let dy = 0; dy < height && canPlace; dy++) {
                                                                    for (let dx = 0; dx < width && canPlace; dx++) {
                                                                        if (col + dx >= COLS || occupiedCells.has(`${row + dy},${col + dx}`)) {
                                                                            canPlace = false;
                                                                        }
                                                                    }
                                                                }

                                                                if (canPlace) {
                                                                    // Mark cells as occupied
                                                                    for (let dy = 0; dy < height; dy++) {
                                                                        for (let dx = 0; dx < width; dx++) {
                                                                            occupiedCells.set(`${row + dy},${col + dx}`, true);
                                                                        }
                                                                    }

                                                                    // Calculate position relative to grid container (accounting for 8px padding)
                                                                    const itemLeft = gridPadding + col * (cellSize + cellGap);
                                                                    const itemTop = gridPadding + row * (cellSize + rowGap);
                                                                    const itemWidth = width * cellSize + (width - 1) * cellGap;
                                                                    const itemHeight = height * cellSize + (height - 1) * rowGap;
                                                                    
                                                                    // Mark the first cell as occupied for rendering
                                                                    if (!gridRows[row]) gridRows[row] = [];
                                                                    gridRows[row][col] = true;
                                                                    
                                                                    // Create item wrapper as separate element
                                                                    itemWrappers.push(
                                                                        <div
                                                                            key={`item-${index}`}
                                                                            className="equipment-preview-item-wrapper"
                                                                            style={{
                                                                                width: `${itemWidth}px`,
                                                                                height: `${itemHeight}px`,
                                                                                left: `${itemLeft}px`,
                                                                                top: `${itemTop}px`
                                                                            }}
                                                                            onMouseEnter={(e) => handleItemMouseEnter(e, item)}
                                                                            onMouseMove={handleItemMouseMove}
                                                                            onMouseLeave={handleItemMouseLeave}
                                                                        >
                                                                            <div
                                                                                className="equipment-item-icon"
                                                                                style={{
                                                                                    backgroundImage: `url(${getIconUrl(item.iconId, 'items')})`,
                                                                                    backgroundColor: 'transparent',
                                                                                    width: '100%',
                                                                                    height: '100%',
                                                                                    backgroundSize: 'contain',
                                                                                    backgroundPosition: 'center',
                                                                                    backgroundRepeat: 'no-repeat',
                                                                                    position: 'absolute',
                                                                                    top: 0,
                                                                                    left: 0
                                                                                }}
                                                                                title={item.name}
                                                                            />
                                                                            {item.quantity > 1 && (
                                                                                <div className="item-quantity-badge">
                                                                                    {item.quantity}
                                                                                </div>
                                                                            )}
                                                                            {item.source === 'background' && (
                                                                                <div className="item-source-badge">
                                                                                    <i className="fas fa-star"></i>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                    placed = true;
                                                                    totalRows = Math.max(totalRows, row + height);
                                                                }
                                                            }
                                                        }
                                                    });

                                                    // Ensure we have enough rows for all placed items
                                                    const minRows = Math.max(3, totalRows + 1);
                                                    while (gridRows.length < minRows) {
                                                        gridRows.push(new Array(COLS).fill(null));
                                                    }
                                                    
                                                    // Calculate grid height: padding (top + bottom) + rows * (cell height + row gap) - last row gap
                                                    const gridHeight = (gridPadding * 2) + (gridRows.length * cellSize) + ((gridRows.length - 1) * rowGap);

                                                    // Render grid rows and item wrappers
                                                    return (
                                                        <>
                                                            {/* Grid cells */}
                                                            {gridRows.map((rowCells, rowIndex) => (
                                                                <div key={`row-${rowIndex}`} className="equipment-preview-row">
                                                                    {Array.from({ length: COLS }, (_, colIndex) => {
                                                                        const isOccupied = occupiedCells.has(`${rowIndex},${colIndex}`);
                                                                        return (
                                                                            <div 
                                                                                key={`cell-${rowIndex}-${colIndex}`} 
                                                                                className={`equipment-preview-cell ${isOccupied ? 'occupied' : 'empty'}`}
                                                                            ></div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            ))}
                                                            {/* Item wrappers positioned absolutely */}
                                                            {itemWrappers}
                                                            {/* Spacer to ensure grid container expands to fit all rows */}
                                                            <div style={{ 
                                                                height: `${gridHeight}px`, 
                                                                width: '1px', 
                                                                position: 'absolute',
                                                                pointerEvents: 'none',
                                                                visibility: 'hidden',
                                                                top: 0,
                                                                left: 0
                                                            }}></div>
                                                        </>
                                                    );
                                                })()}
                                            </div>

                                            {/* Currency Remaining */}
                                            {characterData.remainingCurrency && (
                                                <div className="currency-remaining">
                                                    <h5>Currency Remaining</h5>
                                                    <div className="currency-display">
                                                        <span className="currency-amount">
                                                            {characterData.remainingCurrency.platinum > 0 && `${characterData.remainingCurrency.platinum}p `}
                                                            {characterData.remainingCurrency.gold > 0 && `${characterData.remainingCurrency.gold}g `}
                                                            {characterData.remainingCurrency.silver > 0 && `${characterData.remainingCurrency.silver}s `}
                                                            {characterData.remainingCurrency.copper > 0 && `${characterData.remainingCurrency.copper}c`}
                                                            {(!characterData.remainingCurrency.platinum && !characterData.remainingCurrency.gold &&
                                                              !characterData.remainingCurrency.silver && !characterData.remainingCurrency.copper) && '0g'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Item Tooltip */}
            {tooltip.show && tooltip.item && (
                <div
                    ref={tooltipRef}
                    className="item-tooltip-overlay"
                    style={{
                        position: 'fixed',
                        left: tooltip.x,
                        top: tooltip.y,
                        zIndex: 9999,
                        pointerEvents: 'none'
                    }}
                >
                    <ItemTooltip item={tooltip.item} />
                </div>
            )}

            </div>
    );
};

export default Step9CharacterSummary;
