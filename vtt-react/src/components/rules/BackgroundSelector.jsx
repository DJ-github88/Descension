import React, { useState } from 'react';
import { ENHANCED_PATHS } from '../../data/enhancedPathData';
import { UnifiedSpellCard } from '../spellcrafting-wizard/components/common';
import '../spellcrafting-wizard/styles/pathfinder/main.css';
import '../spellcrafting-wizard/styles/pathfinder/components/cards.css';
import './BackgroundSelector.css';

const BackgroundSelector = () => {
    const [selectedPath, setSelectedPath] = useState(null);
    const [selectedSubPath, setSelectedSubPath] = useState(null);
    const [selectedAbilities, setSelectedAbilities] = useState([]);
    const [viewingAbility, setViewingAbility] = useState(null); // Currently viewing ability in detail panel

    // Get all paths as array
    const paths = Object.values(ENHANCED_PATHS);

    // Get selected path data
    const pathData = selectedPath ? ENHANCED_PATHS[selectedPath] : null;
    const subPathData = selectedSubPath && pathData
        ? pathData.subPaths[selectedSubPath]
        : null;

    const handlePathSelect = (pathId) => {
        setSelectedPath(pathId);
        setSelectedSubPath(null); // Reset sub-path when path changes
        setSelectedAbilities([]); // Reset ability selection
        setViewingAbility(null); // Reset viewing
    };

    const handleSubPathSelect = (subPathId) => {
        setSelectedSubPath(subPathId);
        setSelectedAbilities([]); // Reset ability selection when sub-path changes
        setViewingAbility(null); // Reset viewing

        // Auto-select first ability for viewing
        const subPath = pathData?.subPaths[subPathId];
        if (subPath?.abilities?.length > 0) {
            setViewingAbility(subPath.abilities[0].id);
        }
    };

    const handleAbilityToggle = (abilityId) => {
        setSelectedAbilities(prev => {
            if (prev.includes(abilityId)) {
                // Remove if already selected
                return prev.filter(id => id !== abilityId);
            } else if (prev.length < 1) {
                // Add if less than 1 selected
                return [...prev, abilityId];
            }
            // Don't add if already have 1 selected
            return prev;
        });
    };

    const handleAbilityView = (abilityId) => {
        setViewingAbility(abilityId);
    };

    // Get icon URL helper
    const getIconUrl = (iconId) => {
        if (!iconId) return 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
        return `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`;
    };

    return (
        <div className="background-selector-container">
            {/* Step 1: Path Selection */}
            <div className="background-selection-step">
                <h3 className="step-title">
                    <span className="step-number">1</span>
                    Select a Path
                </h3>
                <div className="background-grid">
                    {paths.map(path => (
                        <div
                            key={path.id}
                            className={`background-card ${selectedPath === path.id ? 'selected' : ''}`}
                            onClick={() => handlePathSelect(path.id)}
                        >
                            <div className="background-card-icon">
                                <i className={path.icon}></i>
                            </div>
                            <h4 className="background-card-name">{path.name}</h4>
                            <p className="background-card-description">{path.description}</p>
                            <div className="background-card-info">
                                <span className="info-badge">
                                    <i className="fas fa-users"></i>
                                    {Object.keys(path.subPaths).length} Specializations
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step 2: Sub-Path Selection */}
            {pathData && (
                <div className="sub-background-selection-step">
                    <h3 className="step-title">
                        <span className="step-number">2</span>
                        Select a Specialization
                    </h3>

                    {/* Overview Section */}
                    <div className="background-overview">
                        <h4>Overview</h4>
                        <p>{pathData.overview}</p>
                    </div>

                    {/* Path-Level Mechanical Benefits */}
                    {pathData.mechanicalBenefits && (
                        <div className="mechanical-benefits">
                            <h4>{pathData.name} Path Passive Abilities</h4>
                            <div className="benefits-grid">
                                {pathData.mechanicalBenefits.map((benefit, index) => (
                                    <div key={index} className="benefit-card">
                                        <div className="benefit-header">
                                            <span className="benefit-name">{benefit.name}</span>
                                            <span className="benefit-type" data-type={benefit.type}>
                                                {benefit.type}
                                            </span>
                                        </div>
                                        <p className="benefit-description">{benefit.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sub-Path Cards */}
                    <div className="sub-background-grid">
                        {Object.entries(pathData.subPaths).map(([subPathId, subPath]) => (
                            <div
                                key={subPathId}
                                className={`sub-background-card ${selectedSubPath === subPathId ? 'selected' : ''}`}
                                onClick={() => handleSubPathSelect(subPathId)}
                            >
                                <div className="sub-background-icon">
                                    <i className={subPath.icon}></i>
                                </div>
                                <h4 className="sub-background-name">{subPath.name}</h4>
                                <p className="sub-background-description">{subPath.description}</p>
                                <div className="sub-background-theme">
                                    <strong>Theme:</strong> {subPath.theme}
                                </div>
                                <div className="sub-background-abilities-count">
                                    {subPath.abilities.length} abilities available
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Subpath-Specific Mechanical Benefits - Show for selected subpath */}
                    {selectedSubPath && pathData.subPaths[selectedSubPath]?.mechanicalBenefits && (
                        <div className="mechanical-benefits">
                            <h4>{pathData.subPaths[selectedSubPath].name} Specialization Passive Abilities</h4>
                            <div className="benefits-grid">
                                {pathData.subPaths[selectedSubPath].mechanicalBenefits.map((benefit, index) => (
                                    <div key={index} className="benefit-card">
                                        <div className="benefit-header">
                                            <span className="benefit-name">{benefit.name}</span>
                                            <span className="benefit-type" data-type={benefit.type}>
                                                {benefit.type}
                                            </span>
                                        </div>
                                        <p className="benefit-description">{benefit.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Step 3: Ability Selection - Icon Grid + Detail View */}
            {subPathData && (
                <div className="ability-selection-step">
                    <h3 className="step-title">
                        <span className="step-number">3</span>
                        Choose Your Abilities
                    </h3>

                    <div className="ability-selection-info">
                        <p>Select 1 ability from the {subPathData.name} specialization pool. Click an ability to view details.</p>
                        <div className="selection-counter">
                            Your Selection ({selectedAbilities.length}/1)
                        </div>
                    </div>

                    {/* Ability Icon Grid */}
                    <div className="ability-icon-grid">
                        {subPathData.abilities.map(ability => {
                            const isSelected = selectedAbilities.includes(ability.id);
                            const isViewing = viewingAbility === ability.id;

                            return (
                                <div
                                    key={ability.id}
                                    className={`ability-icon-card ${isSelected ? 'selected' : ''} ${isViewing ? 'viewing' : ''}`}
                                    onClick={() => handleAbilityView(ability.id)}
                                    title={ability.name}
                                >
                                    <div className="ability-icon-image">
                                        <img
                                            src={getIconUrl(ability.icon)}
                                            alt={ability.name}
                                        />
                                    </div>
                                    <div className="ability-icon-name">{ability.name}</div>
                                    {isSelected && (
                                        <div className="ability-icon-selected-badge">
                                            <i className="fas fa-check-circle"></i>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Ability Detail View */}
                    {viewingAbility && (
                        <div className="ability-detail-view">
                            <div className="ability-detail-header">
                                <h4>Ability Details</h4>
                                <div className="ability-detail-actions">
                                    {selectedAbilities.includes(viewingAbility) ? (
                                        <button
                                            className="ability-deselect-button"
                                            onClick={() => handleAbilityToggle(viewingAbility)}
                                        >
                                            <i className="fas fa-times-circle"></i> Deselect
                                        </button>
                                    ) : (
                                        <button
                                            className="ability-select-button"
                                            onClick={() => handleAbilityToggle(viewingAbility)}
                                            disabled={selectedAbilities.length >= 1}
                                        >
                                            <i className="fas fa-check-circle"></i> Select Ability
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="ability-detail-card">
                                <UnifiedSpellCard
                                    spell={subPathData.abilities.find(a => a.id === viewingAbility)}
                                    variant="wizard"
                                    showDescription={true}
                                    showStats={true}
                                    showTags={true}
                                    showActions={false}
                                />
                            </div>
                        </div>
                    )}

                    {/* Roleplaying Tips */}
                    {pathData.roleplayingTips && (
                        <div className="roleplaying-section">
                            <h4>Roleplaying a {pathData.name}</h4>
                            <p>Characters following the {pathData.name} path embody the themes and philosophies of their chosen path.</p>
                            <div className="roleplaying-tips">
                                <strong>Roleplaying Tips:</strong>
                                <ul>
                                    {pathData.roleplayingTips.map((tip, index) => (
                                        <li key={index}>{tip}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Thematic Elements */}
                    {pathData.thematicElements && (
                        <div className="thematic-section">
                            <h4>Thematic Elements</h4>
                            <div className="thematic-content">
                                <div className="thematic-item">
                                    <h5>Core Philosophy</h5>
                                    <p>{pathData.thematicElements.corePhilosophy}</p>
                                </div>
                                <div className="thematic-item">
                                    <h5>Mechanical Integration</h5>
                                    <p>{pathData.thematicElements.mechanicalIntegration}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Empty States */}
            {!selectedPath && (
                <div className="empty-state">
                    <i className="fas fa-hand-pointer"></i>
                    <p>Select a path above to view specializations and details</p>
                </div>
            )}

            {selectedPath && !selectedSubPath && (
                <div className="empty-state">
                    <i className="fas fa-hand-pointer"></i>
                    <p>Select a specialization to view available abilities</p>
                </div>
            )}
        </div>
    );
};

export default BackgroundSelector;

