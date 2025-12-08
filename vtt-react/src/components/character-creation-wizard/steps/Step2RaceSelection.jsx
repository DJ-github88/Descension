/**
 * Step 2: Race & Subrace Selection
 *
 * Integrated race selection with existing race data
 */

import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { RACE_DATA, getFullRaceData } from '../../../data/raceData';
import { getEquipmentPreview, STARTING_EQUIPMENT_LIBRARY } from '../../../data/startingEquipmentData';
import UnifiedSpellCard from '../../spellcrafting-wizard/components/common/UnifiedSpellCard';
import ItemTooltip from '../../item-generation/ItemTooltip';
import { useSpellLibrary, useSpellLibraryDispatch } from '../../spellcrafting-wizard/context/SpellLibraryContext';
import { getRacialSpells, addSpellsToLibrary, filterNewSpells, removeSpellsByCategory } from '../../../utils/raceDisciplineSpellUtils';

const Step2RaceSelection = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const spellLibraryDispatch = useSpellLibraryDispatch();
    const spellLibrary = useSpellLibrary();
    const [selectedRace, setSelectedRace] = useState(state.characterData.race);
    const [selectedSubrace, setSelectedSubrace] = useState(state.characterData.subrace);
    const [hoveredRace, setHoveredRace] = useState(null);
    const [hoveredSubrace, setHoveredSubrace] = useState(null);
    const [viewingTrait, setViewingTrait] = useState(null);
    const [showTraitModal, setShowTraitModal] = useState(false);
    const [tooltip, setTooltip] = useState({ show: false, item: null, x: 0, y: 0 });
    const tooltipRef = useRef(null);

    const { validationErrors } = state;

    // Helper function to get full item objects from item names
    const getFullItemObjects = (itemNames) => {
        return itemNames.map(itemName => {
            return STARTING_EQUIPMENT_LIBRARY.find(item => item.name === itemName);
        }).filter(item => item != null);
    };

    // Equipment tooltip handlers
    const handleItemMouseEnter = (e, item) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
            show: true,
            item: item,
            x: rect.left + rect.width / 2,
            y: rect.top - 10
        });
    };

    const handleItemMouseMove = (e) => {
        if (tooltip.show) {
            setTooltip(prev => ({
                ...prev,
                x: e.clientX,
                y: e.clientY - 10
            }));
        }
    };

    const handleItemMouseLeave = () => {
        setTooltip({ show: false, item: null, x: 0, y: 0 });
    };

    // Convert RACE_DATA to array format
    const getRaceList = () => {
        return Object.entries(RACE_DATA).map(([raceId, raceData]) => ({
            id: raceId,
            name: raceData.name,
            description: raceData.description,
            icon: getRaceIcon(raceData.name),
            color: getRaceColor(raceData.name),
            subraces: Object.entries(raceData.subraces).map(([subraceKey, subraceData]) => ({
                id: subraceData.id, // Use the actual ID from subraceData, not the object key
                name: subraceData.name,
                description: subraceData.description,
                statModifiers: subraceData.statModifiers,
                traits: subraceData.traits
            }))
        }));
    };

    const getRaceIcon = (raceName) => {
        const icons = {
            'Nordmark': 'fas fa-mountain',
            'Grimheart': 'fas fa-hammer',
            'Voidtouched': 'fas fa-eye',
            'Mirrorkin': 'fas fa-mask',
            'Thornkin': 'fas fa-leaf',
            'Stormcaller': 'fas fa-bolt',
            'Shadowmere': 'fas fa-moon',
            'Ironbound': 'fas fa-shield',
            'Flameborn': 'fas fa-fire',
            'Frostkin': 'fas fa-snowflake',
            'Wildkin': 'fas fa-tree',
            'Graveworn': 'fas fa-skull'
        };
        return icons[raceName] || 'fas fa-user';
    };

    const getRaceColor = (raceName) => {
        const colors = {
            'Nordmark': '#8B7355',
            'Grimheart': '#A0522D',
            'Voidtouched': '#4B0082',
            'Mirrorkin': '#C0C0C0',
            'Thornkin': '#228B22',
            'Stormcaller': '#4169E1',
            'Shadowmere': '#2F2F4F',
            'Ironbound': '#708090',
            'Flameborn': '#FF4500',
            'Frostkin': '#87CEEB',
            'Wildkin': '#8FBC8F',
            'Graveworn': '#696969'
        };
        return colors[raceName] || '#d4af37';
    };

    // Handle race selection
    const handleRaceSelect = (raceId) => {
        // Remove old racial spells first
        removeSpellsByCategory(spellLibraryDispatch, 'Racial Abilities', spellLibrary.spells);

        setSelectedRace(raceId);
        setSelectedSubrace(null); // Reset subrace when race changes
        dispatch(wizardActionCreators.setRace(raceId));
        dispatch(wizardActionCreators.setSubrace(null));

        // Add racial spells to spell library
        const racialSpells = getRacialSpells(raceId, null);
        if (racialSpells.length > 0) {
            addSpellsToLibrary(spellLibraryDispatch, racialSpells, 'Racial Abilities');
        }
    };

    // Handle subrace selection
    const handleSubraceSelect = (subraceId) => {
        // Remove old racial spells first (in case we're changing subrace)
        removeSpellsByCategory(spellLibraryDispatch, 'Racial Abilities', spellLibrary.spells);

        setSelectedSubrace(subraceId);
        dispatch(wizardActionCreators.setSubrace(subraceId));

        // Add subrace spells to spell library
        const racialSpells = getRacialSpells(selectedRace, subraceId);
        if (racialSpells.length > 0) {
            addSpellsToLibrary(spellLibraryDispatch, racialSpells, 'Racial Abilities');
        }
    };

    // Get selected race data
    const getSelectedRaceData = () => {
        if (!selectedRace) return null;
        return getRaceList().find(race => race.id === selectedRace);
    };

    // Get preview data (hovered or selected)
    const getPreviewRaceData = () => {
        const previewId = hoveredRace || selectedRace;
        return previewId ? getRaceList().find(race => race.id === previewId) : null;
    };

    const getPreviewSubraceData = () => {
        const raceData = getPreviewRaceData();
        if (!raceData) return null;

        const previewSubraceId = hoveredSubrace || selectedSubrace;
        return previewSubraceId ? raceData.subraces.find(subrace => subrace.id === previewSubraceId) : null;
    };

    const previewRace = getPreviewRaceData();
    const previewSubrace = getPreviewSubraceData();

    return (
        <div className="wizard-step-content">
            <div className="race-selection-layout">
                    {/* Left side - Race and Subrace selection */}
                    <div className="race-selection-panel">
                        {/* Race Selection */}
                        <div className="race-section">
                            <h3 className="section-title">
                                <i className="fas fa-users"></i>
                                Choose Race
                            </h3>
                            <div className="race-grid">
                                {getRaceList().map((race) => (
                                    <div
                                        key={race.id}
                                        className={`race-card ${selectedRace === race.id ? 'selected' : ''}`}
                                        onClick={() => handleRaceSelect(race.id)}
                                        onMouseEnter={() => setHoveredRace(race.id)}
                                        onMouseLeave={() => setHoveredRace(null)}
                                        style={{ '--race-color': race.color }}
                                    >
                                        <div className="race-info">
                                            <h4 className="race-name">{race.name}</h4>
                                            <p className="race-description">
                                                {race.description.substring(0, 60)}...
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Subrace Selection */}
                        {selectedRace && getSelectedRaceData()?.subraces && (
                            <div className="subrace-section">
                                <h3 className="section-title">
                                    <i className="fas fa-user-friends"></i>
                                    Choose Subrace
                                </h3>
                                <div className="subrace-grid">
                                    {getSelectedRaceData().subraces.map((subrace) => (
                                        <div
                                            key={subrace.id}
                                            className={`subrace-card ${selectedSubrace === subrace.id ? 'selected' : ''}`}
                                            onClick={() => handleSubraceSelect(subrace.id)}
                                            onMouseEnter={() => setHoveredSubrace(subrace.id)}
                                            onMouseLeave={() => setHoveredSubrace(null)}
                                        >
                                            <h4 className="subrace-name">{subrace.name}</h4>
                                            <p className="subrace-description">
                                                {subrace.description.substring(0, 80)}...
                                            </p>
                                            <div className="stat-preview">
                                                {Object.entries(subrace.statModifiers).map(([stat, modifier]) => (
                                                    modifier !== 0 && (
                                                        <span key={stat} className={`stat-mod ${modifier >= 0 ? 'positive' : 'negative'}`}>
                                                            {stat.charAt(0).toUpperCase() + stat.slice(1)}: {modifier >= 0 ? '+' : ''}{modifier}
                                                        </span>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {validationErrors.race && (
                            <div className="error-message">
                                <i className="fas fa-exclamation-triangle"></i>
                                {validationErrors.race}
                            </div>
                        )}
                    </div>

                    {/* Right side - Race/Subrace preview */}
                    <div className="race-preview">
                        {previewRace ? (
                            <div className="racial-traits-browser">
                                <div className="traits-intro">
                                    <h3>{previewSubrace ? `${previewSubrace.name} ${previewRace.name}` : previewRace.name} Racial Abilities</h3>
                                </div>

                                <div className="traits-content">
                                    <div className="race-info-section">
                                        {/* Race Description - Always shown */}
                                        <div className="subrace-info-section">
                                            <p className="race-description">
                                                {previewRace.description}
                                            </p>
                                        </div>

                                        {/* Cultural Background */}
                                        {(() => {
                                            const raceData = RACE_DATA[previewRace.id];
                                            if (raceData?.culturalBackground) {
                                                return (
                                                    <div className="subrace-info-section">
                                                        <h5 className="section-title">
                                                            <i className="fas fa-book"></i> Cultural Background
                                                        </h5>
                                                        <p className="cultural-background-text">
                                                            {raceData.culturalBackground}
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}

                                        {/* Basic Information */}
                                        {(() => {
                                            const raceData = RACE_DATA[previewRace.id];
                                            if (raceData?.baseTraits) {
                                                return (
                                                    <div className="subrace-info-section">
                                                        <h5 className="section-title">
                                                            <i className="fas fa-info-circle"></i> Basic Information
                                                        </h5>
                                                        <p className="cultural-background-text">
                                                            <strong>Size:</strong> {raceData.baseTraits.size} • <strong>Speed:</strong> {raceData.baseTraits.baseSpeed} feet • <strong>Lifespan:</strong> {raceData.baseTraits.lifespan} • <strong>Languages:</strong> {raceData.baseTraits.languages.join(', ')}
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}

                                        {/* Starting Equipment - Show when race is selected */}
                                        {(() => {
                                            if (previewRace) {
                                                const raceEquipment = getEquipmentPreview('race', previewRace.id);
                                                const subraceEquipment = previewSubrace ? getEquipmentPreview('subrace', previewSubrace.id) : { count: 0, examples: [] };
                                                const totalCount = raceEquipment.count + subraceEquipment.count;

                                                if (totalCount > 0) {
                                                    const allItemNames = [
                                                        ...(raceEquipment.examples || []),
                                                        ...(subraceEquipment.examples || [])
                                                    ];
                                                    const fullItems = getFullItemObjects(allItemNames);

                                                    if (fullItems.length > 0) {
                                                        return (
                                                            <div className="starting-equipment-section">
                                                                <h5 className="section-title">
                                                                    <i className="fas fa-shopping-bag"></i> Starting Equipment Pool
                                                                </h5>
                                                                <div className="equipment-shop-grid">
                                                                    {(() => {
                                                                        const COLS = 6;
                                                                        const occupiedCells = new Map();
                                                                        let currentRow = 0;
                                                                        let currentCol = 0;

                                                                        fullItems.forEach((item) => {
                                                                            const itemWidth = item.width || 1;
                                                                            const itemHeight = item.height || 1;
                                                                            let placed = false;
                                                                            while (!placed && currentRow < 6) {
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
                                                                                currentCol++;
                                                                                if (currentCol >= COLS) {
                                                                                    currentCol = 0;
                                                                                    currentRow++;
                                                                                }
                                                                            }
                                                                        });

                                                                        const maxRow = Math.max(...Array.from(occupiedCells.keys()).map(key => parseInt(key.split(',')[0])), -1);
                                                                        const totalRows = Math.max(maxRow + 1, 2);
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
                                                                                        className={`inventory-cell ${item ? 'occupied' : ''}`}
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
                                                                                                        backgroundPosition: 'center',
                                                                                                        backgroundRepeat: 'no-repeat'
                                                                                                    }}
                                                                                                />
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
                                                                <div className="equipment-pool-note">
                                                                    <div className="note-content">
                                                                        <i className="fas fa-info-circle"></i>
                                                                        <span>These items are added to your starting equipment pool. You can purchase additional items like these in Step 10 among other equipment choices. Equipping happens during actual gameplay.</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                }
                                            }
                                            return null;
                                        })()}

                                        {/* Subrace Information - Show when subrace is selected */}
                                        {previewSubrace && (
                                            <>
                                                <div className="subrace-info-section">
                                                    <h5 className="section-title">
                                                        <i className="fas fa-user-tag"></i> {previewSubrace.name} Subrace
                                                    </h5>
                                                    <p className="subrace-description">
                                                        {previewSubrace.description}
                                                    </p>

                                                    {/* Stat Modifiers */}
                                                    <div className="stat-modifiers-compact">
                                                        <h6 className="section-title">Stat Modifiers</h6>
                                                        <div className="stat-modifiers-preview">
                                                            {Object.entries(previewSubrace.statModifiers).map(([stat, modifier]) => (
                                                                <div key={stat} className={`stat-modifier-preview ${modifier >= 0 ? 'positive' : 'negative'}`}>
                                                                    <span className="stat-name">{stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
                                                                    <span className="stat-value">
                                                                        {modifier >= 0 ? '+' : ''}{modifier}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>


                                                    {/* Racial Traits */}
                                                    <div className="traits-section">
                                                        <h5 className="section-title">
                                                            <i className="fas fa-dna"></i> Racial Traits
                                                        </h5>
                                                        <div className="trait-icon-grid">
                                                            {previewSubrace.traits.map((trait) => {
                                                                return (
                                                                    <div
                                                                        key={trait.id}
                                                                        className="trait-icon"
                                                                        onClick={() => {
                                                                            setViewingTrait(trait.id);
                                                                            setShowTraitModal(true);
                                                                        }}
                                                                        title={trait.name}
                                                                    >
                                                                        <img
                                                                            src={`https://wow.zamimg.com/images/wow/icons/large/${trait.icon}.jpg`}
                                                                            alt={trait.name}
                                                                            onError={(e) => {
                                                                                e.target.onerror = null;
                                                                                e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                                                                            }}
                                                                        />
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                </div>
                            </div>
                        ) : (
                            <div className="preview-placeholder">
                                <i className="fas fa-users"></i>
                                <h3>Select a Race</h3>
                                <p>Hover over or select a race to see its details and available subraces.</p>
                            </div>
                        )}
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

                {/* Trait Modal */}
                {showTraitModal && viewingTrait && previewSubrace && (() => {
                    const currentTrait = previewSubrace.traits.find(t => t.id === viewingTrait);
                    if (currentTrait) {
                        return createPortal(
                            <div
                                className="trait-modal-overlay"
                                onClick={() => setShowTraitModal(false)}
                            >
                                <div
                                    className="trait-modal-content"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        className="trait-modal-close"
                                        onClick={() => setShowTraitModal(false)}
                                        title="Close"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                    <UnifiedSpellCard
                                        spell={currentTrait}
                                        variant="wizard"
                                        showActions={false}
                                        showDescription={true}
                                        showStats={true}
                                        showTags={true}
                                    />
                                </div>
                            </div>,
                            document.body
                        );
                    }
                    return null;
                })()}
        </div>
    );
};

export default Step2RaceSelection;
