import React, { useState, useRef, useCallback } from 'react';
import { getAllBackgrounds, BACKGROUND_FLAVOR_TEXT, BACKGROUND_ROLEPLAYING_HOOKS } from '../../data/backgroundData';
import '../spellcrafting-wizard/styles/pathfinder/main.css';
import '../spellcrafting-wizard/styles/pathfinder/components/cards.css';
import './BackgroundSelector.css';

const getFlavorText = (bg) => BACKGROUND_FLAVOR_TEXT[bg.id] || bg.description?.substring(0, 150) + '...';

const getPrimaryBadge = (bg) => {
    if (bg.feature?.name) return { label: bg.feature.name, icon: 'fas fa-star', type: 'feature' };
    if (bg.toolProficiencies?.length > 0) return { label: bg.toolProficiencies[0], icon: 'fas fa-tools', type: 'tool' };
    if (bg.languages >= 2) return { label: `${bg.languages} Languages`, icon: 'fas fa-language', type: 'language' };
    return { label: bg.skillProficiencies[0], icon: 'fas fa-cogs', type: 'skill' };
};

const getSecondaryBadges = (bg) => {
    const badges = [];
    if (bg.statModifiers) {
        const best = Object.entries(bg.statModifiers).sort((a, b) => b[1] - a[1])[0];
        if (best && best[1] > 0) badges.push({ label: `${best[0].charAt(0).toUpperCase() + best[0].slice(1)} +${best[1]}`, icon: 'fas fa-arrow-up', type: 'stat' });
    }
    if (bg.toolProficiencies?.length > 0) badges.push({ label: `${bg.toolProficiencies.length} Tools`, icon: 'fas fa-hammer', type: 'tool' });
    if (bg.languages > 0) badges.push({ label: `${bg.languages} Lang`, icon: 'fas fa-book', type: 'lang' });
    return badges.slice(0, 2);
};

const BackgroundCard = ({ background, isActive, onSelect }) => {
    const primary = getPrimaryBadge(background);
    const secondary = getSecondaryBadges(background);

    return (
        <div
            className={`background-card-compact ${isActive ? 'active' : ''}`}
            onClick={() => onSelect(background.id)}
        >
            <h4 className="background-compact-name">{background.name}</h4>
            <p className="background-compact-description">{getFlavorText(background)}</p>
            <div className="background-compact-badges">
                <span className={`compact-badge compact-badge-${primary.type}`}>
                    <i className={primary.icon}></i> {primary.label}
                </span>
                {secondary.map((b, i) => (
                    <span key={i} className={`compact-badge compact-badge-${b.type}`}>
                        <i className={b.icon}></i> {b.label}
                    </span>
                ))}
            </div>
        </div>
    );
};

const BackgroundsDisplay = () => {
    const [selectedBackground, setSelectedBackground] = useState(null);
    const detailRef = useRef(null);

    const backgrounds = getAllBackgrounds();

    const backgroundData = selectedBackground 
        ? backgrounds.find(bg => bg.id === selectedBackground)
        : null;

    const handleBackgroundSelect = useCallback((backgroundId) => {
        setSelectedBackground(backgroundId);
        setTimeout(() => {
            detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }, []);

    return (
        <div className="background-selector-container">
            {/* Background Selection */}
            <div className="background-selection-step">
                <h3 className="step-title">
                    Select a Background
                </h3>
                <p className="step-description">
                    Backgrounds represent your character's history and origin before becoming an adventurer. 
                    Each background provides skill proficiencies, tool proficiencies, languages, starting equipment, and a unique feature.
                </p>
                <div className="background-grid">
                    {backgrounds.map(background => (
                        <BackgroundCard
                            key={background.id}
                            background={background}
                            isActive={selectedBackground === background.id}
                            onSelect={handleBackgroundSelect}
                        />
                    ))}
                </div>
            </div>

            {/* Background Details */}
            {backgroundData && (
                <div ref={detailRef} className="sub-background-selection-step">
                    <h3 className="step-title">
                        {backgroundData.name} Details
                    </h3>

                    {/* Overview Section */}
                    <div className="background-overview">
                        <h4>Description</h4>
                        <p>{backgroundData.description}</p>
                    </div>

                    {/* Proficiencies & Languages */}
                    <div className="benefits-section">
                        <h4>Proficiencies & Languages</h4>
                        <ul className="equipment-items">
                            {/* Skill Proficiencies */}
                            {backgroundData.skillProficiencies.map((skill, index) => (
                                <li key={`skill-${index}`}>
                                    <i className="fas fa-cogs"></i>
                                    {skill} Skill Proficiency
                                </li>
                            ))}

                            {/* Tool Proficiencies */}
                            {backgroundData.toolProficiencies && backgroundData.toolProficiencies.map((tool, index) => (
                                <li key={`tool-${index}`}>
                                    <i className="fas fa-tools"></i>
                                    {tool} Tool Proficiency
                                </li>
                            ))}

                            {/* Languages */}
                            {backgroundData.languages > 0 && (
                                <li>
                                    <i className="fas fa-language"></i>
                                    {backgroundData.languages} Language{backgroundData.languages > 1 ? 's' : ''} - Choose additional language{backgroundData.languages > 1 ? 's' : ''}
                                </li>
                            )}
                        </ul>
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
                        <div className="benefits-section">
                            <h4>Special Feature</h4>
                            <ul className="equipment-items feature-items">
                                <li>
                                    <i className="fas fa-star"></i>
                                    <strong>{backgroundData.feature.name}</strong> {backgroundData.feature.description}
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Roleplaying Section */}
                    <div className="roleplaying-section">
                        <h4>Narrative Hooks</h4>
                        <p>Questions to ask yourself about your {backgroundData.name}'s past:</p>
                        <div className="roleplaying-tips">
                            <ul>
                                {(BACKGROUND_ROLEPLAYING_HOOKS[backgroundData.id] || ['Your past shapes how you see the world. What memory drives your decisions?']).map((hook, index) => (
                                    <li key={index}><em>{hook}</em></li>
                                ))}
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

