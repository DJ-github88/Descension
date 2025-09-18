/**
 * Step 2: Race & Subrace Selection
 *
 * Integrated race selection with existing race data
 */

import React, { useState } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { RACE_DATA, getFullRaceData } from '../../../data/raceData';

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
            subraces: Object.entries(raceData.subraces).map(([subraceId, subraceData]) => ({
                id: subraceId,
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
            <div className="step-body">
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
                                        <h4>Description</h4>
                                        <p className="race-full-description">
                                            {previewRace.description}
                                        </p>
                                    </div>

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

                <div className="step-footer">
                    <div className="step-hints">
                        <div className="hint">
                            <i className="fas fa-lightbulb"></i>
                            <span>Each race has unique subraces with different stat bonuses and abilities</span>
                        </div>
                        <div className="hint">
                            <i className="fas fa-balance-scale"></i>
                            <span>Consider how racial traits complement your chosen background and class</span>
                        </div>
                        <div className="hint">
                            <i className="fas fa-star"></i>
                            <span>Racial stat modifiers are applied automatically to your final ability scores</span>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default Step2RaceSelection;
