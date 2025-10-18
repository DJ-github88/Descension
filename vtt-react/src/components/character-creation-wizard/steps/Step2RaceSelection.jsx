/**
 * Step 2: Race & Subrace Selection
 *
 * Integrated race selection with existing race data
 */

import React, { useState } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { RACE_DATA, getFullRaceData } from '../../../data/raceData';
import { getEquipmentPreview } from '../../../data/startingEquipmentData';

const Step2RaceSelection = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const [selectedRace, setSelectedRace] = useState(state.characterData.race);
    const [selectedSubrace, setSelectedSubrace] = useState(state.characterData.subrace);
    const [hoveredRace, setHoveredRace] = useState(null);
    const [hoveredSubrace, setHoveredSubrace] = useState(null);

    const { validationErrors } = state;

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
        setSelectedRace(raceId);
        setSelectedSubrace(null); // Reset subrace when race changes
        dispatch(wizardActionCreators.setRace(raceId));
        dispatch(wizardActionCreators.setSubrace(null));
    };

    // Handle subrace selection
    const handleSubraceSelect = (subraceId) => {
        setSelectedSubrace(subraceId);
        dispatch(wizardActionCreators.setSubrace(subraceId));
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
                                        <div className="race-icon">
                                            <i className={race.icon}></i>
                                        </div>
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
                            <div className="preview-card">
                                <div className="preview-header" style={{ '--race-color': previewRace.color }}>
                                    <div className="preview-icon">
                                        <i className={previewRace.icon}></i>
                                    </div>
                                    <h3 className="preview-title">{previewRace.name}</h3>
                                </div>

                                <div className="preview-content">
                                    <div className="preview-section">
                                        <h4>Overview</h4>
                                        <p className="race-full-description">
                                            {previewRace.description}
                                        </p>
                                    </div>

                                    {/* Cultural Background - Show for all races */}
                                    {(() => {
                                        const raceData = RACE_DATA[previewRace.id];
                                        if (raceData?.culturalBackground) {
                                            return (
                                                <div className="preview-section">
                                                    <h4><i className="fas fa-book"></i> Cultural Background</h4>
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
                                                <div className="preview-section">
                                                    <h4><i className="fas fa-info-circle"></i> Basic Information</h4>
                                                    <div className="basic-info-grid">
                                                        <div className="info-item">
                                                            <span className="info-label">Size:</span>
                                                            <span className="info-value">{raceData.baseTraits.size}</span>
                                                        </div>
                                                        <div className="info-item">
                                                            <span className="info-label">Speed:</span>
                                                            <span className="info-value">{raceData.baseTraits.baseSpeed} feet</span>
                                                        </div>
                                                        <div className="info-item">
                                                            <span className="info-label">Lifespan:</span>
                                                            <span className="info-value">{raceData.baseTraits.lifespan}</span>
                                                        </div>
                                                        <div className="info-item">
                                                            <span className="info-label">Languages:</span>
                                                            <span className="info-value">{raceData.baseTraits.languages.join(', ')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}

                                    {previewSubrace && (
                                        <>
                                            <div className="preview-section">
                                                <h4>Subrace: {previewSubrace.name}</h4>
                                                <p className="subrace-full-description">
                                                    {previewSubrace.description}
                                                </p>
                                            </div>

                                            <div className="preview-section">
                                                <h4>Stat Modifiers</h4>
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

                                            <div className="preview-section">
                                                <h4>Racial Traits</h4>
                                                <div className="traits-list">
                                                    {previewSubrace.traits.map((trait, index) => (
                                                        <div key={index} className="trait-item">
                                                            <h5 className="trait-name">{trait.name}</h5>
                                                            <p className="trait-description">{trait.description}</p>
                                                            <span className="trait-type">{trait.type}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Integration Notes */}
                                            {(() => {
                                                const raceData = RACE_DATA[previewRace.id];
                                                if (raceData?.integrationNotes) {
                                                    return (
                                                        <div className="preview-section">
                                                            <h4><i className="fas fa-link"></i> Integration with Game Systems</h4>
                                                            <div className="integration-notes">
                                                                {raceData.integrationNotes.actionPointSystem && (
                                                                    <div className="integration-item">
                                                                        <strong>Action Points:</strong> {raceData.integrationNotes.actionPointSystem}
                                                                    </div>
                                                                )}
                                                                {raceData.integrationNotes.backgroundSynergy && (
                                                                    <div className="integration-item">
                                                                        <strong>Background Synergy:</strong> {raceData.integrationNotes.backgroundSynergy}
                                                                    </div>
                                                                )}
                                                                {raceData.integrationNotes.classCompatibility && (
                                                                    <div className="integration-item">
                                                                        <strong>Class Compatibility:</strong> {raceData.integrationNotes.classCompatibility}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })()}

                                            {/* Starting Equipment Preview */}
                                            {(() => {
                                                const raceEquipment = getEquipmentPreview('race', previewRace.id);
                                                const subraceEquipment = getEquipmentPreview('subrace', previewSubrace.id);
                                                const totalCount = raceEquipment.count + subraceEquipment.count;

                                                if (totalCount > 0) {
                                                    return (
                                                        <div className="preview-section">
                                                            <h4>
                                                                <i className="fas fa-shopping-bag"></i> Starting Equipment
                                                            </h4>
                                                            <p className="equipment-preview-text">
                                                                Unlocks <strong>{totalCount}</strong> item{totalCount !== 1 ? 's' : ''} for purchase during character creation
                                                            </p>
                                                            {[...raceEquipment.examples, ...subraceEquipment.examples].length > 0 && (
                                                                <div className="equipment-examples">
                                                                    <span className="examples-label">Examples:</span>
                                                                    <span className="examples-list">
                                                                        {[...raceEquipment.examples, ...subraceEquipment.examples].join(', ')}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })()}
                                        </>
                                    )}

                                    {!previewSubrace && selectedRace && (
                                        <div className="preview-section">
                                            <div className="subrace-prompt">
                                                <i className="fas fa-arrow-down"></i>
                                                <p>Select a subrace to see detailed traits and abilities</p>
                                            </div>
                                        </div>
                                    )}
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
                </div>
        </div>
    );
};

export default Step2RaceSelection;
