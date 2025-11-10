/**
 * Step 9: Character Summary & Finalization
 *
 * Final review of character before creation
 */

import React, { useState, useRef, useEffect } from 'react';
import { useCharacterWizardState } from '../context/CharacterWizardContext';
import { ABILITY_SCORES, getStatBreakdown } from '../../../utils/pointBuySystem';
import { getPathData, getPathStatModifiers } from '../../../data/pathData';
import { getBackgroundData } from '../../../data/backgroundData';
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
    const statBreakdown = getStatBreakdown(characterData.baseStats, racialModifiers, pathModifiers);

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
                                                        Path: {breakdown.background >= 0 ? '+' : ''}{breakdown.background}
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
                                            <div className="equipment-shop-grid">
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

                                                    let currentRow = 0;
                                                    let currentCol = 0;

                                                    // Place each item in the grid
                                                    allEquipment.forEach((item) => {
                                                        const itemWidth = item.width || 1;
                                                        const itemHeight = item.height || 1;

                                                        // Find next available position
                                                        let placed = false;
                                                        while (!placed && currentRow < 5) { // Allow more rows for bigger inventory
                                                            // Check if item fits at current position
                                                            let fits = true;
                                                            for (let r = 0; r < itemHeight; r++) {
                                                                for (let c = 0; c < itemWidth; c++) {
                                                                    const checkRow = currentRow + r;
                                                                    const checkCol = currentCol + c;
                                                                    if (checkCol >= COLS || occupiedCells.has(`${checkRow},${checkCol}`)) {
                                                                        fits = false;
                                                                        break;
                                                                    }
                                                                }
                                                                if (!fits) break;
                                                            }

                                                            if (fits) {
                                                                // Place the item
                                                                for (let r = 0; r < itemHeight; r++) {
                                                                    for (let c = 0; c < itemWidth; c++) {
                                                                        const placeRow = currentRow + r;
                                                                        const placeCol = currentCol + c;
                                                                        occupiedCells.set(`${placeRow},${placeCol}`, {
                                                                            item,
                                                                            isOrigin: r === 0 && c === 0
                                                                        });
                                                                    }
                                                                }
                                                                placed = true;
                                                            }

                                                            // Move to next position
                                                            currentCol++;
                                                            if (currentCol >= COLS) {
                                                                currentCol = 0;
                                                                currentRow++;
                                                            }
                                                        }
                                                    });

                                                    // Calculate total rows needed
                                                    const maxRow = Math.max(...Array.from(occupiedCells.keys()).map(key => parseInt(key.split(',')[0])), -1);
                                                    const totalRows = Math.max(maxRow + 1, 1); // Minimum 1 row

                                                    // Render the grid with rows
                                                    const gridRows = [];
                                                    for (let row = 0; row < totalRows; row++) {
                                                        const rowCells = [];
                                                        for (let col = 0; col < COLS; col++) {
                                                            const cellData = occupiedCells.get(`${row},${col}`);
                                                            const item = cellData?.item;
                                                            const isOrigin = cellData?.isOrigin;

                                                            rowCells.push(
                                                                <div
                                                                    key={`${row}-${col}`}
                                                                    className={`inventory-cell ${item ? 'occupied' : ''} ${item?.source === 'background' ? 'background-item' : ''}`}
                                                                    onMouseEnter={item && isOrigin ? (e) => handleItemMouseEnter(e, item) : undefined}
                                                                    onMouseMove={item && isOrigin ? handleItemMouseMove : undefined}
                                                                    onMouseLeave={item && isOrigin ? handleItemMouseLeave : undefined}
                                                                >
                                                                    {item && isOrigin && (
                                                                        <div
                                                                            className="item-icon-wrapper"
                                                                            style={{
                                                                                width: `calc(${(item.width || 1) * 100}% + ${(item.width || 1) - 1}px)`,
                                                                                height: `calc(${(item.height || 1) * 100}% + ${(item.height || 1) - 1}px)`,
                                                                                zIndex: 2
                                                                            }}
                                                                        >
                                                                            <div
                                                                                className="equipment-item-icon"
                                                                                style={{
                                                                                    backgroundImage: `url(https://wow.zamimg.com/images/wow/icons/large/${item.iconId}.jpg)`,
                                                                                    width: '100%',
                                                                                    height: '100%',
                                                                                    backgroundSize: 'cover',
                                                                                    backgroundPosition: 'center center',
                                                                                    backgroundRepeat: 'no-repeat'
                                                                                }}
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
                                                                    )}
                                                                </div>
                                                            );
                                                        }
                                                        gridRows.push(
                                                            <div key={row} className="inventory-row">
                                                                {rowCells}
                                                            </div>
                                                        );
                                                    }

                                                    return gridRows;
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

                    {/* Right side - Character summary preview */}
                    <div className="summary-preview">
                        <div className="preview-card">
                            <div className="preview-content">
                                <div className="preview-section">
                                    <h4>Character Portrait</h4>
                                    <div className="portrait-display">
                                        {characterData.characterImage ? (
                                            <div className="character-portrait-container">
                                                <img
                                                    src={characterData.characterImage}
                                                    alt={characterData.name}
                                                    className="character-portrait"
                                                    style={characterData.imageTransformations ? {
                                                        transform: `scale(${characterData.imageTransformations.scale}) rotate(${characterData.imageTransformations.rotation}deg) translate(${characterData.imageTransformations.positionX}px, ${characterData.imageTransformations.positionY}px)`
                                                    } : {}}
                                                />
                                            </div>
                                        ) : (
                                            <div className="portrait-placeholder">
                                                <i className="fas fa-user"></i>
                                                <span>No portrait</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="preview-section">
                                    <h4>Final Stats</h4>
                                    <div className="quick-stats-grid">
                                        {ABILITY_SCORES.map((ability) => {
                                            const breakdown = statBreakdown[ability.id];
                                            return (
                                                <div key={ability.id} className="quick-stat">
                                                    <span className="stat-name">{ability.shortName}</span>
                                                    <span className="stat-value">{breakdown.final}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
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
