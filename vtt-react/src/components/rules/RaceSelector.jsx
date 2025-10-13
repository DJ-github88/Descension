import React, { useState } from 'react';
import { RACE_DATA } from '../../data/raceData';
import './RaceSelector.css';

const RaceSelector = () => {
    const [selectedRace, setSelectedRace] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);

    // Get all races as array
    const races = Object.values(RACE_DATA);

    // Get selected race data
    const raceData = selectedRace ? RACE_DATA[selectedRace] : null;
    const variantData = selectedVariant && raceData ? raceData.subraces[selectedVariant] : null;

    const handleRaceSelect = (raceId) => {
        setSelectedRace(raceId);
        setSelectedVariant(null); // Reset variant when race changes
    };

    const handleVariantSelect = (variantId) => {
        setSelectedVariant(variantId);
    };

    return (
        <div className="race-selector-container">
            {/* Step 1: Race Selection */}
            <div className="race-selection-step">
                <h3 className="step-title">
                    <span className="step-number">1</span>
                    Select a Race
                </h3>
                <div className="race-grid">
                    {races.map(race => (
                        <div
                            key={race.id}
                            className={`race-card ${selectedRace === race.id ? 'selected' : ''}`}
                            onClick={() => handleRaceSelect(race.id)}
                        >
                            <div className="race-card-icon">
                                <i className={race.icon}></i>
                            </div>
                            <h4 className="race-card-name">{race.name}</h4>
                            <p className="race-card-description">{race.description}</p>
                            <div className="race-card-info">
                                <span className="info-badge">
                                    <i className="fas fa-users"></i>
                                    {Object.keys(race.subraces).length} Variants
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step 2: Variant Selection */}
            {raceData && (
                <div className="variant-selection-step">
                    <h3 className="step-title">
                        <span className="step-number">2</span>
                        Select a Variant
                    </h3>
                    <div className="variant-grid">
                        {Object.entries(raceData.subraces).map(([variantId, variant]) => (
                            <div
                                key={variantId}
                                className={`variant-card ${selectedVariant === variantId ? 'selected' : ''}`}
                                onClick={() => handleVariantSelect(variantId)}
                            >
                                <h4 className="variant-card-name">{variant.name}</h4>
                                <p className="variant-card-description">{variant.description}</p>
                                
                                {/* Stat Modifiers Preview */}
                                <div className="stat-modifiers-mini">
                                    {Object.entries(variant.statModifiers).map(([stat, modifier]) => {
                                        if (modifier === 0) return null;
                                        return (
                                            <span key={stat} className={`stat-mod ${modifier > 0 ? 'positive' : 'negative'}`}>
                                                {stat.substring(0, 3).toUpperCase()} {modifier > 0 ? '+' : ''}{modifier}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 3: Detailed View */}
            {variantData && raceData && (
                <div className="variant-details-view">
                    <h3 className="step-title">
                        <span className="step-number">3</span>
                        {variantData.name} Details
                    </h3>

                    <div className="details-layout">
                        {/* Left Column: Stats & Basic Info */}
                        <div className="details-left">
                            {/* Stat Block */}
                            <div className="stat-block">
                                <h4 className="stat-block-title">Stat Modifiers</h4>
                                <div className="stat-modifiers-full">
                                    {Object.entries(variantData.statModifiers).map(([stat, modifier]) => (
                                        <div key={stat} className="stat-row">
                                            <span className="stat-label">{stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
                                            <span className={`stat-value ${modifier > 0 ? 'positive' : modifier < 0 ? 'negative' : 'neutral'}`}>
                                                {modifier > 0 ? '+' : ''}{modifier}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="info-block">
                                <h4 className="info-block-title">Basic Information</h4>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Size</span>
                                        <span className="info-value">{raceData.baseTraits.size}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Speed</span>
                                        <span className="info-value">{raceData.baseTraits.baseSpeed} ft</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Lifespan</span>
                                        <span className="info-value">{raceData.baseTraits.lifespan}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Languages</span>
                                        <span className="info-value">{raceData.baseTraits.languages.join(', ')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Traits */}
                        <div className="details-right">
                            <div className="traits-block">
                                <h4 className="traits-block-title">Racial Traits</h4>
                                <div className="traits-list">
                                    {variantData.traits.map((trait, index) => (
                                        <div key={index} className="trait-card">
                                            <div className="trait-header">
                                                <h5 className="trait-name">{trait.name}</h5>
                                                <span className="trait-type" data-type={trait.type}>{trait.type}</span>
                                            </div>
                                            <p className="trait-description">{trait.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cultural Background */}
                    {raceData.culturalBackground && (
                        <div className="cultural-section">
                            <h4 className="cultural-title">
                                <i className="fas fa-book"></i> Cultural Background
                            </h4>
                            <p className="cultural-text">{raceData.culturalBackground}</p>
                        </div>
                    )}

                    {/* Integration Notes */}
                    {raceData.integrationNotes && (
                        <div className="integration-section">
                            <h4 className="integration-title">
                                <i className="fas fa-link"></i> Integration with Game Systems
                            </h4>
                            <div className="integration-grid">
                                {raceData.integrationNotes.actionPointSystem && (
                                    <div className="integration-card">
                                        <h5>Action Points</h5>
                                        <p>{raceData.integrationNotes.actionPointSystem}</p>
                                    </div>
                                )}
                                {raceData.integrationNotes.backgroundSynergy && (
                                    <div className="integration-card">
                                        <h5>Background Synergy</h5>
                                        <p>{raceData.integrationNotes.backgroundSynergy}</p>
                                    </div>
                                )}
                                {raceData.integrationNotes.classCompatibility && (
                                    <div className="integration-card">
                                        <h5>Class Compatibility</h5>
                                        <p>{raceData.integrationNotes.classCompatibility}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Empty State */}
            {!selectedRace && (
                <div className="empty-state">
                    <i className="fas fa-hand-pointer"></i>
                    <p>Select a race above to view variants and details</p>
                </div>
            )}

            {selectedRace && !selectedVariant && (
                <div className="empty-state">
                    <i className="fas fa-hand-pointer"></i>
                    <p>Select a variant to view detailed information</p>
                </div>
            )}
        </div>
    );
};

export default RaceSelector;

