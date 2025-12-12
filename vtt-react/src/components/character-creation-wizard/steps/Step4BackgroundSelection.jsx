/**
 * Step 4: Background Selection
 *
 * Choose from standard D&D backgrounds (Acolyte, Sage, Soldier, etc.)
 */

import React, { useState } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { getAllBackgrounds, getBackgroundData } from '../../../data/backgroundData';
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

    const backgrounds = getAllBackgrounds() || [];
    const { validationErrors } = state;

    // Handle background selection
    const handleBackgroundSelect = (backgroundId) => {
        setSelectedBackground(backgroundId);
        dispatch(wizardActionCreators.setBackground(backgroundId));
    };

    // Get background for preview (hovered or selected)
    const getPreviewBackground = () => {
        const previewId = hoveredBackground || selectedBackground;
        return previewId ? getBackgroundData(previewId) : null;
    };

    const previewBackground = getPreviewBackground();

    // Helper function to get full item objects from item names
    const getFullItemObjects = (itemNames) => {
        return itemNames.map(itemName => {
            return STARTING_EQUIPMENT_LIBRARY.find(item =>
                item.name.toLowerCase() === itemName.toLowerCase()
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
                                        <p className="background-summary">
                                            {background.description.substring(0, 120)}...
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
                                        {previewBackground.skillProficiencies && previewBackground.skillProficiencies.length > 0 && (
                                            <span className="meta-badge">
                                                <span className="meta-label">Skills</span>
                                                {previewBackground.skillProficiencies.length}
                                            </span>
                                        )}
                                        {previewBackground.toolProficiencies && previewBackground.toolProficiencies.length > 0 && (
                                            <span className="meta-badge">
                                                <span className="meta-label">Tools</span>
                                                {previewBackground.toolProficiencies.length}
                                            </span>
                                        )}
                                        {previewBackground.languages > 0 && (
                                            <span className="meta-badge">
                                                <span className="meta-label">Languages</span>
                                                +{previewBackground.languages}
                                            </span>
                                        )}
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

                                        {previewBackground.languages > 0 && (
                                            <div className="detail-section">
                                                <h5 className="section-title">
                                                    <i className="fas fa-language"></i> Languages
                                                </h5>
                                                <p className="language-info">
                                                    Choose {previewBackground.languages} additional language{previewBackground.languages > 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {previewBackground.equipment && previewBackground.equipment.length > 0 && (
                                        <div className="detail-section">
                                            <h5 className="section-title">
                                                <i className="fas fa-shopping-bag"></i> Starting Equipment
                                            </h5>
                                            <div className="equipment-preview-grid">
                                                {(() => {
                                                    const fullItems = getFullItemObjects(previewBackground.equipment);
                                                    const COLS = 6;
                                                    const occupiedCells = new Map();
                                                    const gridRows = [];
                                                    let totalRows = 0;

                                                    // Place items in grid with proper dimensions
                                                    fullItems.forEach((item, index) => {
                                                        if (!item) return;

                                                        const width = item.width || 1;
                                                        const height = item.height || 1;

                                                        // Find a spot for this item
                                                        let placed = false;
                                                        for (let row = 0; row < 10 && !placed; row++) {
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

                                                                    // Add item to this position
                                                                    if (!gridRows[row]) gridRows[row] = [];
                                                                    gridRows[row][col] = (
                                                                        <div
                                                                            key={index}
                                                                            className="equipment-preview-cell occupied"
                                                                        >
                                                                            <div
                                                                                className="equipment-preview-item-wrapper"
                                                                                style={{
                                                                                    width: `calc(${width * 100}% + ${width - 1}px)`,
                                                                                    height: `calc(${height * 100}% + ${height - 1}px)`
                                                                                }}
                                                                                onMouseEnter={(e) => handleItemMouseEnter(e, item)}
                                                                                onMouseMove={handleItemMouseMove}
                                                                                onMouseLeave={handleItemMouseLeave}
                                                                            >
                                                                                <div
                                                                                    className="equipment-item-icon"
                                                                                    style={{
                                                                                        backgroundImage: `url(https://wow.zamimg.com/images/wow/icons/large/${item.iconId}.jpg)`,
                                                                                        width: '100%',
                                                                                        height: '100%',
                                                                                        backgroundSize: 'cover',
                                                                                        backgroundPosition: 'center',
                                                                                        backgroundRepeat: 'no-repeat',
                                                                                        position: 'absolute',
                                                                                        top: 0,
                                                                                        left: 0
                                                                                    }}
                                                                                    title={item.name}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                    placed = true;
                                                                    totalRows = Math.max(totalRows, row + height);
                                                                }
                                                            }
                                                        }
                                                    });

                                                    // Ensure we have at least 3 rows for consistent layout
                                                    const minRows = 3;
                                                    while (gridRows.length < minRows) {
                                                        gridRows.push(new Array(COLS).fill(null));
                                                    }

                                                    // Render grid rows
                                                    return gridRows.map((rowCells, rowIndex) => (
                                                        <div key={rowIndex} className="equipment-preview-row">
                                                            {Array.from({ length: COLS }, (_, colIndex) => (
                                                                rowCells && rowCells[colIndex] ? rowCells[colIndex] : (
                                                                    <div key={`empty-${rowIndex}-${colIndex}`} className="equipment-preview-cell empty"></div>
                                                                )
                                                            ))}
                                                        </div>
                                                    ));
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

                                    {previewBackground.feature && (
                                        <div className="detail-section">
                                            <h5 className="section-title">
                                                <i className="fas fa-star"></i> {previewBackground.feature.name}
                                            </h5>
                                            <p className="feature-description">
                                                {previewBackground.feature.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Background Abilities */}
                                    {(() => {
                                        const abilities = getBackgroundAbilities(previewBackground.id);
                                        if (abilities && abilities.length > 0) {
                                            return (
                                                <div className="detail-section">
                                                    <h5 className="section-title">
                                                        <i className="fas fa-magic"></i> Background Abilities
                                                    </h5>
                                                    <div className="abilities-list">
                                                        {abilities.map((ability, index) => (
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
    );
};

export default Step4BackgroundSelection;
