/**
 * Step 2: Race & Subrace Selection
 *
 * Integrated race selection with existing race data
 */

import React, { useState, useRef } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { RACE_DATA, getFullRaceData, getRacialBaseStats, getRacialSavingThrowModifiers, applyRacialModifiers } from '../../../data/raceData';
import { getEquipmentPreview, STARTING_EQUIPMENT_LIBRARY } from '../../../data/startingEquipmentData';
import { getIconUrl } from '../../../utils/assetManager';
import UnifiedSpellCard from '../../spellcrafting-wizard/components/common/UnifiedSpellCard';
import ItemTooltip from '../../item-generation/ItemTooltip';
import { useSpellLibrary, useSpellLibraryDispatch } from '../../spellcrafting-wizard/context/SpellLibraryContext';
import { getRacialSpells, addSpellsToLibrary, filterNewSpells, removeSpellsByCategory, isPassiveStatModifier } from '../../../utils/raceDisciplineSpellUtils';
import useCharacterStore from '../../../store/characterStore';
import RaceEpicLore from '../../rules/RaceEpicLore';

// Derive concise passive summaries: 1 line flavor text, then game mechanics
const getPassiveSummary = (trait = {}) => {
    const parts = [];
    
    // Extract first sentence of description as flavor text
    if (trait.description) {
        const firstSentence = trait.description.split(/[.!?]+/)[0].trim();
        if (firstSentence) parts.push(firstSentence + '.');
    }

    // Extract condition from triggerConfig if present
    let conditionText = '';
    if (trait.triggerConfig?.global?.compoundTriggers) {
        const healthTrigger = trait.triggerConfig.global.compoundTriggers.find(t => t.id === 'health_threshold');
        if (healthTrigger?.parameters) {
            const percentage = healthTrigger.parameters.percentage;
            const comparison = healthTrigger.parameters.comparison;
            if (percentage && comparison) {
                if (comparison === 'less_than' || comparison === 'below') {
                    conditionText = `when below ${percentage}% HP`;
                } else if (comparison === 'greater_than' || comparison === 'above') {
                    conditionText = `when above ${percentage}% HP`;
                }
            }
        }
    }

    const formatStatMod = (mod = {}) => {
        const stat = (mod.stat || 'stat').replace(/_/g, ' ');
        const mag = mod.magnitudeType === 'percentage'
            ? `${mod.magnitude}%`
            : `${mod.magnitude > 0 ? '+' : ''}${mod.magnitude}`;
        return `${stat} ${mag}`;
    };

    // Group stat modifiers together
    const statMods = [];
    const otherEffects = [];

    // Process buff effects
    if (trait.buffConfig?.effects) {
        trait.buffConfig.effects.forEach(effect => {
            if (effect.statModifier) {
                statMods.push(formatStatMod(effect.statModifier));
            } else if (effect.statusEffect) {
                otherEffects.push(effect.name || effect.statusEffect.type || 'Status effect');
            }
        });
    }

    // Process debuff effects
    if (trait.debuffConfig?.effects) {
        trait.debuffConfig.effects.forEach(effect => {
            if (effect.statModifier) {
                statMods.push(formatStatMod(effect.statModifier));
            } else if (effect.statusEffect) {
                otherEffects.push(effect.name || effect.statusEffect.type || 'Status effect');
            }
        });
    }

    // Add healing config
    if (trait.healingConfig) {
        const { formula = 'healing', hotTickInterval, hotDuration, durationType } = trait.healingConfig;
        const intervalText = hotTickInterval
            ? ` every ${hotTickInterval} round${hotTickInterval > 1 ? 's' : ''}`
            : '';
        const durationText = hotDuration
            ? ` while ${hotDuration}`
            : durationType === 'permanent'
                ? ' continuously'
                : '';
        parts.push(`Regenerates ${formula}${intervalText}${durationText}`.trim() + '.');
    }

    // Add stat modifiers (grouped together)
    if (statMods.length > 0) {
        const modText = statMods.join(', ');
        parts.push(conditionText ? `${modText} ${conditionText}` : modText);
    }

    // Add other effects
    if (otherEffects.length > 0) {
        parts.push(otherEffects.join(', '));
    }

    return parts.length ? parts.join(' ') : 'No description available';
};

    const Step2RaceSelection = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const spellLibraryDispatch = useSpellLibraryDispatch();
    const spellLibrary = useSpellLibrary();
    const updateCharacterInfo = useCharacterStore(state => state.updateCharacterInfo);
    const [selectedRace, setSelectedRace] = useState(state.characterData.race);
    const [selectedSubrace, setSelectedSubrace] = useState(state.characterData.subrace);
    const [hoveredRace, setHoveredRace] = useState(null);
    const [hoveredSubrace, setHoveredSubrace] = useState(null);
    const [tooltip, setTooltip] = useState({ show: false, item: null, x: 0, y: 0 });
    const [showEpicLore, setShowEpicLore] = useState(false);
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
            essence: raceData.essence || raceData.name,
            gradient: raceData.gradient || 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
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
            'Corvani': 'fas fa-crow',
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
            'Corvani': '#6B5B95',
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

        // Update character store immediately so passives and stats update in real-time
        updateCharacterInfo('race', raceId);
        updateCharacterInfo('subrace', ''); // Clear subrace

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

        // Update character store immediately so passives and stats update in real-time
        updateCharacterInfo('subrace', subraceId);

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
                                        style={{ '--race-gradient': race.gradient }}
                                    >
                                        <div className="race-card-icon">
                                            <i className={race.icon}></i>
                                        </div>
                                        <h4 className="race-name">{race.name}</h4>
                                        {race.essence && <p className="race-essence">{race.essence}</p>}
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

                        {/* Epic Lore Trigger */}
                        {previewRace && (
                            <>
                                <div className="epic-lore-trigger-char-creation">
                                    <button
                                        className="epic-lore-button-compact"
                                        onClick={() => setShowEpicLore(true)}
                                    >
                                        <i className="fas fa-book-open"></i>
                                        View Race Lore
                                    </button>
                                </div>

                                {showEpicLore && previewRace && (
                                    <div className="epic-lore-overlay-char-creation">
                                        <RaceEpicLore
                                            raceData={RACE_DATA[previewRace.id]}
                                            availableTabs={['history', 'practices']}
                                            onClose={() => setShowEpicLore(false)}
                                        />
                                    </div>
                                )}
                            </>
                        )}

                    </div>

                    {validationErrors.race && (
                        <div className="error-message">
                            <i className="fas fa-exclamation-triangle"></i>
                            {validationErrors.race}
                        </div>
                    )}

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
                                                                <div 
                                                                    className="equipment-preview-grid"
                                                                    style={{
                                                                        minHeight: (() => {
                                                                            if (fullItems.length === 0) return '120px';
                                                                            
                                                                            const estimatedRows = Math.max(2, Math.ceil(fullItems.length / 3) + 1);
                                                                            const cellSize = 40;
                                                                            const rowGap = 2;
                                                                            const gridPadding = 8;
                                                                            const gridHeight = (gridPadding * 2) + (estimatedRows * cellSize) + ((estimatedRows - 1) * rowGap);
                                                                            return `${gridHeight}px`;
                                                                        })()
                                                                    }}
                                                                >
                                                                    {(() => {
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
                                                                            let maxRowToCheck = Math.max(6, totalRows + height + 2);
                                                                            
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
                                                                        });

                                                                        // Ensure we have enough rows for all placed items
                                                                        const minRows = Math.max(2, totalRows + 1);
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


                                                    {/* Base Stats */}
                                                    {(() => {
                                                        const baseStats = getRacialBaseStats(previewRace.id, previewSubrace.id);

                                                        // Display racial HP and Mana bonuses directly

                                                        if (baseStats && Object.keys(baseStats).length > 0) {
                                                            return (
                                                                <div className="subrace-info-section">
                                                                    <h6 className="section-title">Base Stats</h6>
                                                                    <div className="base-stats-preview">
                                                                        <div className="base-stat-item">
                                                                            <span className="base-stat-label">HP:</span>
                                                                            <span className="base-stat-value">{baseStats.hp || 0}</span>
                                                                        </div>
                                                                        <div className="base-stat-item">
                                                                            <span className="base-stat-label">Mana:</span>
                                                                            <span className="base-stat-value">{baseStats.mana || 0}</span>
                                                                        </div>
                                                                        <div className="base-stat-item">
                                                                            <span className="base-stat-label">Speed:</span>
                                                                            <span className="base-stat-value">{baseStats.speed} ft</span>
                                                                        </div>
                                                                        <div className="base-stat-item">
                                                                            <span className="base-stat-label">Action Points:</span>
                                                                            <span className="base-stat-value">{baseStats.ap}</span>
                                                                        </div>
                                                                        {baseStats.armor !== undefined && baseStats.armor !== 0 && (
                                                                            <div className="base-stat-item">
                                                                                <span className="base-stat-label">Armor:</span>
                                                                                <span className="base-stat-value">{baseStats.armor}</span>
                                                                            </div>
                                                                        )}
                                                                        {baseStats.passivePerception !== undefined && baseStats.passivePerception !== 0 && (
                                                                            <div className="base-stat-item">
                                                                                <span className="base-stat-label">Passive Perception:</span>
                                                                                <span className="base-stat-value">{baseStats.passivePerception > 0 ? '+' : ''}{baseStats.passivePerception}</span>
                                                                            </div>
                                                                        )}
                                                                        {baseStats.swimSpeed !== undefined && baseStats.swimSpeed !== 0 && (
                                                                            <div className="base-stat-item">
                                                                                <span className="base-stat-label">Swim Speed:</span>
                                                                                <span className="base-stat-value">{baseStats.swimSpeed > 0 ? '+' : ''}{baseStats.swimSpeed} ft</span>
                                                                            </div>
                                                                        )}
                                                                        {baseStats.climbSpeed !== undefined && baseStats.climbSpeed !== 0 && (
                                                                            <div className="base-stat-item">
                                                                                <span className="base-stat-label">Climb Speed:</span>
                                                                                <span className="base-stat-value">{baseStats.climbSpeed > 0 ? '+' : ''}{baseStats.climbSpeed} ft</span>
                                                                            </div>
                                                                        )}
                                                                        {baseStats.visionRange !== undefined && baseStats.visionRange !== 60 && (
                                                                            <div className="base-stat-item">
                                                                                <span className="base-stat-label">Vision Range:</span>
                                                                                <span className="base-stat-value">{baseStats.visionRange} ft</span>
                                                                            </div>
                                                                        )}
                                                                        {baseStats.darkvision !== undefined && baseStats.darkvision !== 0 && (
                                                                            <div className="base-stat-item">
                                                                                <span className="base-stat-label">Darkvision:</span>
                                                                                <span className="base-stat-value">{baseStats.darkvision} ft</span>
                                                                            </div>
                                                                        )}
                                                                        {baseStats.initiative !== undefined && baseStats.initiative !== 0 && (
                                                                            <div className="base-stat-item">
                                                                                <span className="base-stat-label">Initiative:</span>
                                                                                <span className="base-stat-value">{baseStats.initiative > 0 ? '+' : ''}{baseStats.initiative}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    })()}

                                                    {/* Saving Throw Modifiers */}
                                                    {(() => {
                                                        const savingThrowMods = getRacialSavingThrowModifiers(previewRace.id, previewSubrace.id);
                                                        if (savingThrowMods && (savingThrowMods.advantage || savingThrowMods.disadvantage || savingThrowMods.resistance || savingThrowMods.immunity)) {
                                                            return (
                                                                <div className="subrace-info-section">
                                                                    <h6 className="section-title">Special Modifiers</h6>
                                                                    <div className="saving-throw-mods-preview">
                                                                        {savingThrowMods.advantage && Array.isArray(savingThrowMods.advantage) && savingThrowMods.advantage.length > 0 && (
                                                                            <div className="saving-throw-mod-item advantage">
                                                                                <span className="saving-throw-mod-label">Advantage on saves against:</span>
                                                                                <span className="saving-throw-mod-value">{savingThrowMods.advantage.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}</span>
                                                                            </div>
                                                                        )}
                                                                        {savingThrowMods.disadvantage && Array.isArray(savingThrowMods.disadvantage) && savingThrowMods.disadvantage.length > 0 && (
                                                                            <div className="saving-throw-mod-item disadvantage">
                                                                                <span className="saving-throw-mod-label">Disadvantage on saves against:</span>
                                                                                <span className="saving-throw-mod-value">{savingThrowMods.disadvantage.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}</span>
                                                                            </div>
                                                                        )}
                                                                        {savingThrowMods.resistance && Array.isArray(savingThrowMods.resistance) && savingThrowMods.resistance.length > 0 && (
                                                                            <div className="saving-throw-mod-item resistance">
                                                                                <span className="saving-throw-mod-label">Damage resistance to:</span>
                                                                                <span className="saving-throw-mod-value">{savingThrowMods.resistance.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}</span>
                                                                            </div>
                                                                        )}
                                                                        {savingThrowMods.immunity && Array.isArray(savingThrowMods.immunity) && savingThrowMods.immunity.length > 0 && (
                                                                            <div className="saving-throw-mod-item immunity">
                                                                                <span className="saving-throw-mod-label">Damage immunity to:</span>
                                                                                <span className="saving-throw-mod-value">{savingThrowMods.immunity.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    })()}


                                            {/* Racial Traits */}
                                                    <div className="traits-section">
                                                        <h5 className="section-title">
                                                            <i className="fas fa-dna"></i> Racial Traits
                                                        </h5>
                                                        <div className="trait-list">
                                                            {previewSubrace.traits.map((trait) => {
                                                                if (isPassiveStatModifier(trait)) {
                                                                    return (
                                                                        <div key={trait.id} className="passive-summary-item">
                                                                            <div className="passive-summary-icon-wrapper">
                                                                                <img
                                                                                    src={getIconUrl(trait.icon || 'Utility/Utility', 'abilities')}
                                                                                    alt={trait.name}
                                                                                    className="passive-summary-icon"
                                                                                    onError={(e) => {
                                                                                        e.target.onerror = null;
                                                                                        e.target.src = getIconUrl('Utility/Utility', 'abilities');
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                            <div className="passive-summary-details">
                                                                                <div className="passive-summary-name">{trait.name}</div>
                                                                                <div className="passive-summary-description">
                                                                            {getPassiveSummary(trait)}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }

                                                                return (
                                                                    <div key={trait.id} className="active-trait-card">
                                                                        <UnifiedSpellCard
                                                                            spell={trait}
                                                                            variant="wizard"
                                                                            showActions={false}
                                                                            showDescription={true}
                                                                            showStats={true}
                                                                            showTags={true}
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

        </div>
    );
};

export default Step2RaceSelection;
