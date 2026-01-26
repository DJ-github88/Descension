/**
 * Step 4: Background Selection
 *
 * Choose from standard D&D backgrounds (Acolyte, Criminal, Entertainer, etc.)
 */

import React, { useState } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { BACKGROUND_DATA, getAllBackgrounds, getBackgroundData } from '../../../data/backgroundData';
import { getCustomBackgroundAbilities } from '../../../data/customBackgroundData';
import { getWowIconUrl, getIconUrl } from '../../../utils/assetManager';
import { getEquipmentPreview, STARTING_EQUIPMENT_LIBRARY } from '../../../data/startingEquipmentData';
import { getBackgroundAbilities } from '../../../data/backgroundAbilities';
import { formatCurrency } from '../../../data/startingCurrencyData';
import ItemTooltip from '../../item-generation/ItemTooltip';

const Step4BackgroundSelection = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const [selectedBackground, setSelectedBackground] = useState(state.characterData.background);
    const [hoveredBackground, setHoveredBackground] = useState(null);

    // Tooltip state
    const [tooltip, setTooltip] = useState({ show: false, item: null, x: 0, y: 0 });
    const tooltipRef = React.useRef(null);

    const backgrounds = Object.values(BACKGROUND_DATA) || [];
    const { validationErrors } = state;

    // Handle background selection
    const handleBackgroundSelect = (backgroundId) => {
        setSelectedBackground(backgroundId);
        dispatch(wizardActionCreators.setBackground(backgroundId));
    };

    // Get background for preview (hovered or selected)
    const getPreviewBackground = () => {
        const previewId = hoveredBackground || selectedBackground;
        return previewId ? BACKGROUND_DATA[previewId] : null;
    };

    const previewBackground = getPreviewBackground();

    // Helper function to get full item objects from item names
    const getFullItemObjects = (itemNames) => {
        return itemNames.map(itemName => {
            // Handle different item name formats
            return STARTING_EQUIPMENT_LIBRARY.find(item =>
                item.name.toLowerCase() === itemName.toLowerCase() ||
                item.name.toLowerCase().includes(itemName.toLowerCase().split(' ')[0])
            );
        }).filter(item => item); // Remove undefined items
    };

    // Tooltip handlers
    const handleItemMouseEnter = (e, item) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const tooltipWidth = 280;
        const tooltipHeight = 250;
        const margin = 15;

        let x = rect.right + margin;
        let y = rect.top;

        const fitsRight = (x + tooltipWidth) <= viewportWidth;
        const fitsBelow = (y + tooltipHeight) <= viewportHeight;

        if (!fitsRight) {
            x = rect.left - tooltipWidth - margin;
            if (x < margin) {
                x = (viewportWidth - tooltipWidth) / 2;
            }
        }

        if (!fitsBelow) {
            y = rect.top - tooltipHeight - margin;
            if (y < margin) {
                y = Math.max(margin, viewportHeight - tooltipHeight - margin);
            }
        }

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

            const tooltipWidth = 280;
            const tooltipHeight = 250;
            const margin = 15;

            let x = rect.right + margin;
            let y = rect.top;

            const fitsRight = (x + tooltipWidth) <= viewportWidth;
            const fitsBelow = (y + tooltipHeight) <= viewportHeight;

            if (!fitsRight) {
                x = rect.left - tooltipWidth - margin;
                if (x < margin) {
                    x = (viewportWidth - tooltipWidth) / 2;
                }
            }

            if (!fitsBelow) {
                y = rect.top - tooltipHeight - margin;
                if (y < margin) {
                    y = Math.max(margin, viewportHeight - tooltipHeight - margin);
                }
            }

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

    return (
        <div className="wizard-step-content">
            <div className="path-selection-section">
                <h3 className="step-title">
                    Select a Background
                </h3>
                <div className="background-selection-layout">
                    {/* Left side - Background grid */}
                    <div className="background-grid-container">
                        <div className="background-grid">
                            {backgrounds.map((background) => (
                                <div
                                    key={background.id}
                                    className={`background-card ${selectedBackground === background.id ? 'selected' : ''}`}
                                    onClick={() => handleBackgroundSelect(background.id)}
                                    onMouseEnter={() => setHoveredBackground(background.id)}
                                    onMouseLeave={() => setHoveredBackground(null)}
                                >
                                    <div className="background-info">
                                        <h3 className="background-name">{background.name}</h3>
                                        <p className="background-card-description">
                                            {background.description.substring(0, 100)}...
                                        </p>
                                    </div>
                                    <div className="background-benefits">
                                        <div className="benefit-item">
                                            <i className="fas fa-cogs"></i>
                                            <span>{background.skillProficiencies?.length || 0} Skills</span>
                                        </div>
                                        {background.languages > 0 && (
                                            <div className="benefit-item">
                                                <i className="fas fa-language"></i>
                                                <span>{background.languages} Language{background.languages > 1 ? 's' : ''}</span>
                                            </div>
                                        )}
                                        {background.toolProficiencies && background.toolProficiencies.length > 0 && (
                                            <div className="benefit-item">
                                                <i className="fas fa-tools"></i>
                                                <span>{background.toolProficiencies.length} Tool{background.toolProficiencies.length > 1 ? 's' : ''}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {validationErrors.background && (
                            <div className="error-message">
                                <i className="fas fa-exclamation-triangle"></i>
                                {validationErrors.background}
                            </div>
                        )}
                    </div>

                    {/* Right side - Background preview */}
                    <div className="background-preview">
                        {previewBackground ? (
                            <div className="subrace-info-section">
                                <h2 className="class-preview-title">{previewBackground.name}</h2>

                                <p className="class-flavor-text">
                                    {previewBackground.description}
                                </p>


                                <div className="class-meta-row">
                                    {/* Stat Modifiers (only for custom backgrounds) */}
                                    {previewBackground.statModifiers && Object.keys(previewBackground.statModifiers).length > 0 && (
                                        <div className="stat-modifiers-display">
                                            {Object.entries(previewBackground.statModifiers)
                                                .filter(([_, value]) => value !== 0)
                                                .map(([stat, value]) => {
                                                    const statAbbrev = {
                                                        strength: 'STR',
                                                        agility: 'AGI',
                                                        constitution: 'CON',
                                                        intelligence: 'INT',
                                                        spirit: 'SPI',
                                                        charisma: 'CHA'
                                                    }[stat] || stat.toUpperCase().substring(0, 3);
                                                    return (
                                                        <span key={stat} className={`stat-modifier ${value > 0 ? 'positive' : 'negative'}`}>
                                                            {value > 0 ? '+' : ''}{value} {statAbbrev}
                                                        </span>
                                                    );
                                                })}
                                        </div>
                                    )}

                                    {/* Skills, Tools, Languages */}
                                    <div className="background-benefits-summary">
                                        <span className="benefit-item">
                                            <i className="fas fa-brain"></i>
                                            <span className="benefit-label">SKILLS</span>
                                            <span className="benefit-value">{previewBackground.skillProficiencies?.length || 0}</span>
                                        </span>
                                        {previewBackground.toolProficiencies && previewBackground.toolProficiencies.length > 0 && (
                                            <span className="benefit-item">
                                                <i className="fas fa-tools"></i>
                                                <span className="benefit-label">TOOLS</span>
                                                <span className="benefit-value">{previewBackground.toolProficiencies.length}</span>
                                            </span>
                                        )}
                                        {previewBackground.languages > 0 && (
                                            <span className="benefit-item">
                                                <i className="fas fa-language"></i>
                                                <span className="benefit-label">LANGUAGES</span>
                                                <span className="benefit-value">+{previewBackground.languages}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="background-details-grid">
                                    <div className="detail-section">
                                        <h5 className="section-title">
                                            <i className="fas fa-brain"></i> Skill Proficiencies
                                        </h5>
                                        <div className="skill-list">
                                            {previewBackground.skillProficiencies.map((skill, index) => (
                                                <span key={index} className="skill-tag">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {previewBackground.toolProficiencies && previewBackground.toolProficiencies.length > 0 && (
                                        <div className="detail-section">
                                            <h5 className="section-title">
                                                <i className="fas fa-tools"></i> Tool Proficiencies
                                            </h5>
                                            <div className="tool-list">
                                                {previewBackground.toolProficiencies.map((tool, index) => (
                                                    <span key={index} className="tool-tag">
                                                        {tool}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </div>

                                {(previewBackground.equipment || previewBackground.startingEquipment) && (previewBackground.equipment || previewBackground.startingEquipment).length > 0 && (
                                    <div className="detail-section">
                                        <h5 className="section-title">
                                            <i className="fas fa-shopping-bag"></i> Starting Equipment
                                        </h5>
                                        <div
                                            className="equipment-preview-grid"
                                            style={{
                                                minHeight: (() => {
                                                    const equipment = previewBackground.equipment || previewBackground.startingEquipment || [];
                                                    const equipmentList = Array.isArray(equipment) ? equipment : [equipment];
                                                    const fullItems = getFullItemObjects(equipmentList);
                                                    if (fullItems.length === 0) return '120px';

                                                    // Estimate rows needed: at least 1 row per item, but could be more
                                                    const estimatedRows = Math.max(3, Math.ceil(fullItems.length / 3) + 1);
                                                    const cellSize = 40;
                                                    const rowGap = 2;
                                                    const gridPadding = 8;
                                                    const gridHeight = (gridPadding * 2) + (estimatedRows * cellSize) + ((estimatedRows - 1) * rowGap);
                                                    return `${gridHeight}px`;
                                                })()
                                            }}
                                        >
                                            {(() => {
                                                const equipment = previewBackground.equipment || previewBackground.startingEquipment || [];
                                                const equipmentList = Array.isArray(equipment) ? equipment : [equipment];
                                                const fullItems = getFullItemObjects(equipmentList);
                                                const COLS = 6;
                                                const occupiedCells = new Map();
                                                const gridRows = [];
                                                const itemWrappers = [];
                                                let totalRows = 0;

                                                // Calculate grid constants
                                                const cellSize = 40;
                                                const cellGap = 1;
                                                const rowGap = 2;
                                                const gridPadding = 8;

                                                // Place items in grid with proper dimensions
                                                fullItems.forEach((item, index) => {
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
                                                                    </div>
                                                                );
                                                                placed = true;
                                                                totalRows = Math.max(totalRows, row + height);
                                                            }
                                                        }
                                                    }

                                                    // If item wasn't placed, still expand grid to show it would fit
                                                    if (!placed) {
                                                        totalRows = Math.max(totalRows, fullItems.length * 2);
                                                    }
                                                });

                                                // Ensure we have enough rows for all placed items
                                                // Add extra row to ensure items at the bottom aren't cut off
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
                                                                {Array.from({ length: COLS }, (_, colIndex) => (
                                                                    <div
                                                                        key={`cell-${rowIndex}-${colIndex}`}
                                                                        className={rowCells && rowCells[colIndex] ? "equipment-preview-cell occupied" : "equipment-preview-cell empty"}
                                                                    ></div>
                                                                ))}
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

                                        {/* Starting Currency Info */}
                                        <div className="starting-resources-compact">
                                            <div className="currency-info">
                                                <i className="fas fa-coins"></i>
                                                <span className="currency-label">Starting Currency:</span>
                                                <span className="currency-amount">
                                                    {(() => {
                                                        if (previewBackground?.startingCurrency) {
                                                            return formatCurrency({
                                                                gold: previewBackground.startingCurrency.gold || 0,
                                                                silver: previewBackground.startingCurrency.silver || 0,
                                                                copper: previewBackground.startingCurrency.copper || 0
                                                            });
                                                        }
                                                        return '15g'; // Default for backgrounds without specified currency
                                                    })()}
                                                </span>
                                            </div>
                                            <div className="equipment-note">
                                                <i className="fas fa-info-circle"></i>
                                                <span>Background equipment included free</span>
                                            </div>
                                        </div>
                                    </div>
                                )}


                                {/* Background Abilities/Features */}
                                {(() => {
                                    // Handle custom background abilities
                                    const customAbilities = previewBackground.abilities;
                                    if (customAbilities && customAbilities.length > 0) {
                                        return (
                                            <div className="detail-section">
                                                <h5 className="section-title">
                                                    <i className="fas fa-magic"></i> Background Abilities
                                                </h5>
                                                <div className="abilities-list">
                                                    {customAbilities.map((ability, index) => (
                                                        <div key={index} className="ability-item">
                                                            <div className="ability-header">
                                                                <h5 className="ability-name">{ability.name}</h5>
                                                                <div className="ability-meta">
                                                                    <span className={`ability-type ${ability.type.toLowerCase()}`}>
                                                                        {ability.type}
                                                                    </span>
                                                                    <span className="ability-usage">{ability.usage || 'Passive'}</span>
                                                                </div>
                                                            </div>
                                                            <p className="ability-description">
                                                                {ability.description}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    }

                                    // Handle standard background feature
                                    const standardFeature = previewBackground.feature;
                                    if (standardFeature) {
                                        return (
                                            <div className="detail-section">
                                                <h5 className="section-title">
                                                    <i className="fas fa-star"></i> Background Feature
                                                </h5>
                                                <div className="abilities-list">
                                                    <div className="ability-item">
                                                        <div className="ability-header">
                                                            <h5 className="ability-name">{standardFeature.name}</h5>
                                                            <div className="ability-meta">
                                                                <span className="ability-type passive">
                                                                    Feature
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="ability-description">
                                                            {standardFeature.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return null;
                                })()}

                            </div>
                        ) : (
                            <div className="preview-placeholder">
                                <i className="fas fa-book"></i>
                                <h3>Select a Background</h3>
                                <p>Hover over or select a background to see its details and benefits.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Item Tooltip */}
                {tooltip.show && tooltip.item && (
                    <div
                        ref={tooltipRef}
                        style={{
                            position: 'fixed',
                            left: tooltip.x,
                            top: tooltip.y,
                            zIndex: 1000,
                            pointerEvents: 'none'
                        }}
                    >
                        <ItemTooltip item={tooltip.item} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Step4BackgroundSelection;
