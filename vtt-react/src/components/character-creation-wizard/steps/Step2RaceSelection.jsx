/**
 * Step 2: Race & Subrace Selection
 *
 * Integrated race selection with existing race data
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { RACE_DATA, getFullRaceData } from '../../../data/raceData';
import { getEquipmentPreview } from '../../../data/startingEquipmentData';
import UnifiedSpellCard from '../../spellcrafting-wizard/components/common/UnifiedSpellCard';

const Step2RaceSelection = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const [selectedRace, setSelectedRace] = useState(state.characterData.race);
    const [selectedSubrace, setSelectedSubrace] = useState(state.characterData.subrace);
    const [hoveredRace, setHoveredRace] = useState(null);
    const [hoveredSubrace, setHoveredSubrace] = useState(null);
    const [viewingTrait, setViewingTrait] = useState(null);
    const [showTraitModal, setShowTraitModal] = useState(false);

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

                                                    {/* Starting Equipment */}
                                                    {(() => {
                                                        const raceEquipment = getEquipmentPreview('race', previewRace.id);
                                                        const subraceEquipment = getEquipmentPreview('subrace', previewSubrace.id);
                                                        const totalCount = raceEquipment.count + subraceEquipment.count;

                                                        if (totalCount > 0) {
                                                            return (
                                                                <div className="equipment-compact">
                                                                    <h6 className="section-title">Starting Equipment</h6>
                                                                    <p>Unlocks {totalCount} item{totalCount !== 1 ? 's' : ''} for purchase</p>
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
