import React, { useState } from 'react';
import { getAllBackgrounds } from '../../data/backgroundData';
import '../spellcrafting-wizard/styles/pathfinder/main.css';
import '../spellcrafting-wizard/styles/pathfinder/components/cards.css';
import './BackgroundSelector.css';

const BackgroundsDisplay = () => {
    const [selectedBackground, setSelectedBackground] = useState(null);

    // Get all backgrounds as array
    const backgrounds = getAllBackgrounds();

    // Get selected background data
    const backgroundData = selectedBackground 
        ? backgrounds.find(bg => bg.id === selectedBackground)
        : null;

    const handleBackgroundSelect = (backgroundId) => {
        setSelectedBackground(backgroundId);
    };

    return (
        <div className="background-selector-container">
            {/* Background Selection */}
            <div className="background-selection-step">
                <h3 className="step-title">
                    <span className="step-number">1</span>
                    Select a Background
                </h3>
                <p className="step-description">
                    Backgrounds represent your character's history and origin before becoming an adventurer. 
                    Each background provides skill proficiencies, tool proficiencies, languages, starting equipment, and a unique feature.
                </p>
                <div className="background-grid">
                    {backgrounds.map(background => (
                        <div
                            key={background.id}
                            className={`background-card ${selectedBackground === background.id ? 'selected' : ''}`}
                            onClick={() => handleBackgroundSelect(background.id)}
                        >
                            <div className="background-card-icon">
                                <i className="fas fa-book"></i>
                            </div>
                            <h4 className="background-card-name">{background.name}</h4>
                            <p className="background-card-description">{background.description.substring(0, 100)}...</p>
                            <div className="background-card-info">
                                <span className="info-badge">
                                    <i className="fas fa-cogs"></i>
                                    {background.skillProficiencies.length} Skills
                                </span>
                                {background.languages > 0 && (
                                    <span className="info-badge">
                                        <i className="fas fa-language"></i>
                                        {background.languages} Lang
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background Details */}
            {backgroundData && (
                <div className="sub-background-selection-step">
                    <h3 className="step-title">
                        <span className="step-number">2</span>
                        {backgroundData.name} Details
                    </h3>

                    {/* Overview Section */}
                    <div className="background-overview">
                        <h4>Description</h4>
                        <p>{backgroundData.description}</p>
                    </div>

                    {/* Proficiencies Grid */}
                    <div className="benefits-section">
                        <h4>Proficiencies & Languages</h4>
                        <div className="benefits-grid">
                            {/* Skill Proficiencies */}
                            {backgroundData.skillProficiencies.map((skill, index) => (
                                <div key={`skill-${index}`} className="benefit-card">
                                    <div className="benefit-icon">
                                        <i className="fas fa-cogs"></i>
                                    </div>
                                    <div className="benefit-content">
                                        <h5 className="benefit-name">{skill}</h5>
                                        <p className="benefit-description">Skill Proficiency</p>
                                    </div>
                                </div>
                            ))}

                            {/* Tool Proficiencies */}
                            {backgroundData.toolProficiencies && backgroundData.toolProficiencies.map((tool, index) => (
                                <div key={`tool-${index}`} className="benefit-card">
                                    <div className="benefit-icon">
                                        <i className="fas fa-tools"></i>
                                    </div>
                                    <div className="benefit-content">
                                        <h5 className="benefit-name">{tool}</h5>
                                        <p className="benefit-description">Tool Proficiency</p>
                                    </div>
                                </div>
                            ))}

                            {/* Languages */}
                            {backgroundData.languages > 0 && (
                                <div className="benefit-card">
                                    <div className="benefit-icon">
                                        <i className="fas fa-language"></i>
                                    </div>
                                    <div className="benefit-content">
                                        <h5 className="benefit-name">{backgroundData.languages} Language{backgroundData.languages > 1 ? 's' : ''}</h5>
                                        <p className="benefit-description">Choose additional language{backgroundData.languages > 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Starting Equipment */}
                    {backgroundData.equipment && backgroundData.equipment.length > 0 && (
                        <div className="benefits-section">
                            <h4>Starting Equipment</h4>
                            <ul className="equipment-items">
                                {backgroundData.equipment.map((item, index) => (
                                    <li key={index}>
                                        <i className="fas fa-check"></i>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Special Feature */}
                    {backgroundData.feature && (
                        <div className="benefits-section feature-section">
                            <h4>Special Feature</h4>
                            <div className="feature-card">
                                <div className="feature-header">
                                    <div className="feature-icon">
                                        <i className="fas fa-star"></i>
                                    </div>
                                    <h5 className="feature-name">{backgroundData.feature.name}</h5>
                                </div>
                                <p className="feature-description">{backgroundData.feature.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Roleplaying Section */}
                    <div className="roleplaying-section">
                        <h4>Roleplaying a {backgroundData.name}</h4>
                        <p>
                            As a {backgroundData.name}, your character's past experiences shape how they interact with the world. 
                            Consider how your background influences your motivations, relationships, and approach to challenges.
                        </p>
                        <div className="roleplaying-tips">
                            <strong>Roleplaying Tips:</strong>
                            <ul>
                                <li>Think about what drove you to leave your previous life</li>
                                <li>Use your background feature creatively in social encounters</li>
                                <li>Connect with NPCs who share your background</li>
                                <li>Let your skills and proficiencies inform your character's expertise</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!selectedBackground && (
                <div className="empty-state">
                    <i className="fas fa-hand-pointer"></i>
                    <p>Select a background above to view its details and benefits</p>
                </div>
            )}
        </div>
    );
};

export default BackgroundsDisplay;

