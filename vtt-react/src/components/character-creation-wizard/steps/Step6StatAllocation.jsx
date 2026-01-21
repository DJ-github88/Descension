/**
 * Step 6: Stat Allocation
 *
 * Point-buy system for allocating ability scores with racial and path modifiers
 */

import React from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import {
    ABILITY_SCORES,
    POINT_BUY_CONFIG,
    increaseStat,
    decreaseStat,
    canIncreaseStat,
    canDecreaseStat,
    calculateAvailablePoints,
    getStatBreakdown,
    calculateAbilityModifier,
    getTotalBonusPoints
} from '../../../utils/pointBuySystem';
import { getPathStatModifiers } from '../../../data/pathData';
import { applyRacialModifiers, getRacialBaseStats } from '../../../data/raceData';

const Step6StatAllocation = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();

    const { characterData, validationErrors } = state;
    const { baseStats, race, subrace, path } = characterData;

    // Get modifiers and bonuses
    const bonusPoints = getTotalBonusPoints(characterData);
    const pathModifiers = path ? getPathStatModifiers(path) : {};
    const racialModifiers = race && subrace ? applyRacialModifiers({}, race, subrace) : {};

    // Calculate available points
    const availablePoints = calculateAvailablePoints(baseStats, bonusPoints);
    const totalPoints = POINT_BUY_CONFIG.BASE_POINT_POOL + bonusPoints.total;

    // Get stat breakdown for display
    const statBreakdown = getStatBreakdown(baseStats, racialModifiers, pathModifiers);

    // Handle stat changes
    const handleIncreaseStat = (statId) => {
        if (canIncreaseStat(baseStats, statId, bonusPoints)) {
            const newStats = increaseStat(baseStats, statId, bonusPoints);
            dispatch(wizardActionCreators.updateBaseStats(newStats));
        }
    };

    const handleDecreaseStat = (statId) => {
        if (canDecreaseStat(baseStats, statId)) {
            const newStats = decreaseStat(baseStats, statId);
            dispatch(wizardActionCreators.updateBaseStats(newStats));
        }
    };

    return (
        <div className="wizard-step-content">
            <div className="step-body">
                <div className="stat-allocation-layout">
                    {/* Left side - Point allocation */}
                    <div className="stat-allocation-panel">
                        {/* Point pool display */}
                        <div className="point-pool-display">
                            <div className="pool-header">
                                <h3>Point Pool</h3>
                                <div className="pool-breakdown">
                                    <span className="base-points">Base: {POINT_BUY_CONFIG.BASE_POINT_POOL}</span>
                                    {bonusPoints.race > 0 && (
                                        <span className="bonus-points">Race: +{bonusPoints.race}</span>
                                    )}
                                    {bonusPoints.subrace > 0 && (
                                        <span className="bonus-points">Subrace: +{bonusPoints.subrace}</span>
                                    )}
                                    {bonusPoints.background > 0 && (
                                        <span className="bonus-points">Background: +{bonusPoints.background}</span>
                                    )}
                                    {bonusPoints.path > 0 && (
                                        <span className="bonus-points">Path: +{bonusPoints.path}</span>
                                    )}
                                </div>
                            </div>
                            <div className="pool-status">
                                <div className="points-remaining">
                                    <span className="points-number">{availablePoints}</span>
                                    <span className="points-label">points remaining</span>
                                </div>
                                <div className="points-bar">
                                    <div
                                        className="points-used"
                                        style={{ width: `${((totalPoints - availablePoints) / totalPoints) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stat allocation controls */}
                        <div className="stat-controls">
                            {ABILITY_SCORES.map((ability) => {
                                const breakdown = statBreakdown[ability.id];
                                const canIncrease = canIncreaseStat(baseStats, ability.id, bonusPoints);
                                const canDecrease = canDecreaseStat(baseStats, ability.id);

                                return (
                                    <div key={ability.id} className="stat-control-row">
                                        <div className="stat-info">
                                            <div className="stat-header">
                                                <i className={ability.icon}></i>
                                                <div className="stat-names">
                                                    <span className="stat-name">{ability.name}</span>
                                                    <span className="stat-short">({ability.shortName})</span>
                                                </div>
                                            </div>
                                            <p className="stat-description">{ability.description}</p>
                                        </div>

                                        <div className="stat-controls-section">
                                            <div className="stat-adjustment">
                                                <button
                                                    type="button"
                                                    className="stat-btn decrease"
                                                    onClick={() => handleDecreaseStat(ability.id)}
                                                    disabled={!canDecrease}
                                                    title="Decrease stat"
                                                >
                                                    <i className="fas fa-minus"></i>
                                                </button>

                                                <div className="stat-display">
                                                    <div className="base-stat">
                                                        <span className="stat-value">{breakdown.base}</span>
                                                        <span className="stat-cost">({breakdown.pointCost} pts)</span>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="stat-btn increase"
                                                    onClick={() => handleIncreaseStat(ability.id)}
                                                    disabled={!canIncrease}
                                                    title="Increase stat"
                                                >
                                                    <i className="fas fa-plus"></i>
                                                </button>
                                            </div>

                                            <div className="stat-breakdown">
                                                <div className="breakdown-row">
                                                    <span className="breakdown-label">Base:</span>
                                                    <span className="breakdown-value">{breakdown.base}</span>
                                                </div>
                                                {breakdown.racial !== 0 && (
                                                    <div className="breakdown-row racial">
                                                        <span className="breakdown-label">Racial:</span>
                                                        <span className="breakdown-value">
                                                            {breakdown.racial >= 0 ? '+' : ''}{breakdown.racial}
                                                        </span>
                                                    </div>
                                                )}
                                                {breakdown.background !== 0 && (
                                                    <div className="breakdown-row background">
                                                        <span className="breakdown-label">Background:</span>
                                                        <span className="breakdown-value">
                                                            {breakdown.background >= 0 ? '+' : ''}{breakdown.background}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="breakdown-row final">
                                                    <span className="breakdown-label">Final:</span>
                                                    <span className="breakdown-value final-value">
                                                        {breakdown.final} ({breakdown.modifier >= 0 ? '+' : ''}{breakdown.modifier})
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {validationErrors.stats && (
                            <div className="error-message">
                                <i className="fas fa-exclamation-triangle"></i>
                                {validationErrors.stats}
                            </div>
                        )}
                    </div>

                    {/* Right side - Character summary */}
                    <div className="character-summary-panel">
                        <div className="preview-card">
                            <div className="preview-content">
                                <div className="preview-section">
                                    <h4>Basic Information</h4>
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Name:</span>
                                            <span className="detail-value">{characterData.name}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Race:</span>
                                            <span className="detail-value">{race} ({subrace})</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Class:</span>
                                            <span className="detail-value">{characterData.class}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Background:</span>
                                            <span className="detail-value">{characterData.background}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="preview-section">
                                    <h4>Final Ability Scores</h4>
                                    <div className="final-stats-grid">
                                        {ABILITY_SCORES.map((ability) => {
                                            const breakdown = statBreakdown[ability.id];
                                            return (
                                                <div key={ability.id} className="final-stat">
                                                    <div className="final-stat-header">
                                                        <i className={ability.icon}></i>
                                                        <span className="final-stat-name">{ability.shortName}</span>
                                                    </div>
                                                    <div className="final-stat-value">
                                                        <span className="stat-number">{breakdown.final}</span>
                                                        <span className="stat-modifier">
                                                            ({breakdown.modifier >= 0 ? '+' : ''}{breakdown.modifier})
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="preview-section">
                                    <h4>Base Stats Preview</h4>
                                    <div className="base-stats-preview-grid">
                                        {(() => {
                                            const baseStats = getRacialBaseStats(race, subrace);
                                            const finalConstitution = statBreakdown.constitution.final;
                                            const finalIntelligence = statBreakdown.intelligence.final;

                                            // Calculate HP based on final constitution and Mana based on final intelligence
                                            const baseHP = (finalConstitution * 5) + (baseStats.hp || 0);
                                            const baseMana = (finalIntelligence * 5) + (baseStats.mana || 0);

                                            return (
                                                <>
                                                    <div className="base-stat-preview-item">
                                                        <div className="base-stat-preview-header">
                                                            <i className="fas fa-heart"></i>
                                                            <span className="base-stat-preview-name">HP</span>
                                                        </div>
                                                        <div className="base-stat-preview-value">{baseHP}</div>
                                                        <div className="base-stat-preview-detail">
                                                            ({finalConstitution} × 5 {baseStats.hp ? `+ ${baseStats.hp}` : ''})
                                                        </div>
                                                    </div>
                                                    <div className="base-stat-preview-item">
                                                        <div className="base-stat-preview-header">
                                                            <i className="fas fa-magic"></i>
                                                            <span className="base-stat-preview-name">Mana</span>
                                                        </div>
                                                        <div className="base-stat-preview-value">{baseMana}</div>
                                                        <div className="base-stat-preview-detail">
                                                            ({finalIntelligence} × 5 {baseStats.mana ? `+ ${baseStats.mana}` : ''})
                                                        </div>
                                                    </div>
                                                    <div className="base-stat-preview-item">
                                                        <div className="base-stat-preview-header">
                                                            <i className="fas fa-running"></i>
                                                            <span className="base-stat-preview-name">Speed</span>
                                                        </div>
                                                        <div className="base-stat-preview-value">{baseStats.speed} ft</div>
                                                    </div>
                                                    <div className="base-stat-preview-item">
                                                        <div className="base-stat-preview-header">
                                                            <i className="fas fa-bolt"></i>
                                                            <span className="base-stat-preview-name">AP</span>
                                                        </div>
                                                        <div className="base-stat-preview-value">{baseStats.ap}</div>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>

                                <div className="preview-section">
                                    <h4>Point Allocation</h4>
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Total Points:</span>
                                            <span className="detail-value">{totalPoints}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Points Used:</span>
                                            <span className="detail-value">{totalPoints - availablePoints}</span>
                                        </div>
                                        <div className="detail-item remaining">
                                            <span className="detail-label">Points Remaining:</span>
                                            <span className="detail-value">{availablePoints}</span>
                                        </div>
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

export default Step6StatAllocation;
