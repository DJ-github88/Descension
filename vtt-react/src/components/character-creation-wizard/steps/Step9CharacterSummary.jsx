/**
 * Step 9: Character Summary & Finalization
 *
 * Final review of character before creation
 */

import React from 'react';
import { useCharacterWizardState } from '../context/CharacterWizardContext';
import { ABILITY_SCORES, getStatBreakdown } from '../../../utils/pointBuySystem';
import { getPathData, getPathStatModifiers } from '../../../data/pathData';
import { getBackgroundData } from '../../../data/backgroundData';
import { applyRacialModifiers } from '../../../data/raceData';

const Step9CharacterSummary = () => {
    const state = useCharacterWizardState();
    const { characterData } = state;

    // Get modifiers for stat breakdown
    const pathModifiers = characterData.path ? getPathStatModifiers(characterData.path) : {};
    const racialModifiers = characterData.race && characterData.subrace ? applyRacialModifiers({}, characterData.race, characterData.subrace) : {};
    const statBreakdown = getStatBreakdown(characterData.baseStats, racialModifiers, pathModifiers);

    // Get background and path data for display
    const backgroundData = characterData.background ? getBackgroundData(characterData.background) : null;
    const pathData = characterData.path ? getPathData(characterData.path) : null;

    return (
        <div className="wizard-step-content">
            <div className="step-body">
                <div className="character-summary-layout">
                    {/* Left side - Character details */}
                    <div className="summary-details">
                        {/* Basic Information */}
                        <div className="summary-section">
                            <h3 className="section-title">
                                <i className="fas fa-user"></i>
                                Basic Information
                            </h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Name:</span>
                                    <span className="detail-value">{characterData.name}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Gender:</span>
                                    <span className="detail-value">{characterData.gender}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Race:</span>
                                    <span className="detail-value">{characterData.race}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Subrace:</span>
                                    <span className="detail-value">{characterData.subrace}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Class:</span>
                                    <span className="detail-value">{characterData.class}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Background:</span>
                                    <span className="detail-value">{backgroundData?.name || characterData.background}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Path:</span>
                                    <span className="detail-value">{pathData?.name || characterData.path}</span>
                                </div>
                            </div>
                        </div>

                        {/* Ability Scores */}
                        <div className="summary-section">
                            <h3 className="section-title">
                                <i className="fas fa-chart-bar"></i>
                                Ability Scores
                            </h3>
                            <div className="abilities-grid">
                                {ABILITY_SCORES.map((ability) => {
                                    const breakdown = statBreakdown[ability.id];
                                    return (
                                        <div key={ability.id} className="ability-summary">
                                            <div className="ability-header">
                                                <i className={ability.icon}></i>
                                                <span className="ability-name">{ability.name}</span>
                                            </div>
                                            <div className="ability-value">
                                                <span className="final-score">{breakdown.final}</span>
                                                <span className="modifier">
                                                    ({breakdown.modifier >= 0 ? '+' : ''}{breakdown.modifier})
                                                </span>
                                            </div>
                                            <div className="ability-breakdown">
                                                <span className="base">Base: {breakdown.base}</span>
                                                {breakdown.racial !== 0 && (
                                                    <span className="racial">
                                                        Racial: {breakdown.racial >= 0 ? '+' : ''}{breakdown.racial}
                                                    </span>
                                                )}
                                                {breakdown.background !== 0 && (
                                                    <span className="background">
                                                        Path: {breakdown.background >= 0 ? '+' : ''}{breakdown.background}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Background Benefits */}
                        {backgroundData && (
                            <div className="summary-section">
                                <h3 className="section-title">
                                    <i className="fas fa-book"></i>
                                    Background Benefits
                                </h3>
                                <div className="background-benefits">
                                    <div className="benefit-group">
                                        <h4>Skill Proficiencies</h4>
                                        <div className="skill-tags">
                                            {backgroundData.skillProficiencies.map((skill, index) => (
                                                <span key={index} className="skill-tag">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {backgroundData.toolProficiencies && (
                                        <div className="benefit-group">
                                            <h4>Tool Proficiencies</h4>
                                            <div className="tool-tags">
                                                {backgroundData.toolProficiencies.map((tool, index) => (
                                                    <span key={index} className="tool-tag">{tool}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="benefit-group">
                                        <h4>Special Feature</h4>
                                        <div className="feature-display">
                                            <h5>{backgroundData.feature.name}</h5>
                                            <p>{backgroundData.feature.description}</p>
                                        </div>
                                    </div>

                                    {backgroundData.equipment && backgroundData.equipment.length > 0 && (
                                        <div className="benefit-group">
                                            <h4>Starting Equipment</h4>
                                            <ul className="equipment-list">
                                                {backgroundData.equipment.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right side - Character summary preview */}
                    <div className="summary-preview">
                        <div className="preview-card">
                            <div className="preview-header">
                                <div className="preview-icon">
                                    <i className="fas fa-scroll"></i>
                                </div>
                                <h3 className="preview-title">Character Summary</h3>
                            </div>
                            <div className="preview-content">
                                <div className="preview-section">
                                    <h4>Character Portrait</h4>
                                    <div className="portrait-display">
                                        {characterData.characterImage ? (
                                            <div className="character-portrait-container">
                                                <img
                                                    src={characterData.characterImage}
                                                    alt={characterData.name}
                                                    className="character-portrait"
                                                    style={characterData.imageTransformations ? {
                                                        transform: `scale(${characterData.imageTransformations.scale}) rotate(${characterData.imageTransformations.rotation}deg) translate(${characterData.imageTransformations.positionX}px, ${characterData.imageTransformations.positionY}px)`
                                                    } : {}}
                                                />
                                            </div>
                                        ) : (
                                            <div className="portrait-placeholder">
                                                <i className="fas fa-user"></i>
                                                <span>No portrait</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="preview-section">
                                    <h4>Final Stats</h4>
                                    <div className="quick-stats-grid">
                                        {ABILITY_SCORES.map((ability) => {
                                            const breakdown = statBreakdown[ability.id];
                                            return (
                                                <div key={ability.id} className="quick-stat">
                                                    <span className="stat-name">{ability.shortName}</span>
                                                    <span className="stat-value">{breakdown.final}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            </div>
    );
};

export default Step9CharacterSummary;
