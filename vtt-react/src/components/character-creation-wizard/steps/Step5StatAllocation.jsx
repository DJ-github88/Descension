/**
 * Step 5: Stat Allocation
 * 
 * Point-buy system for allocating ability scores with racial and background modifiers
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
    calculateAbilityModifier
} from '../../../utils/pointBuySystem';
import { getCustomBackgroundStartingPoints, getCustomBackgroundStatModifiers } from '../../../data/customBackgroundData';
import { applyRacialModifiers } from '../../../data/raceData';

const Step5StatAllocation = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();

    const { characterData, validationErrors } = state;
    const { baseStats, race, subrace, background } = characterData;

    // Get modifiers
    const backgroundStartingPoints = background ? getCustomBackgroundStartingPoints(background) : 0;
    const backgroundModifiers = background ? getCustomBackgroundStatModifiers(background) : {};
    const racialModifiers = race && subrace ? applyRacialModifiers({}, race, subrace) : {};

    // Calculate available points
    const availablePoints = calculateAvailablePoints(baseStats, backgroundStartingPoints);
    const totalPoints = POINT_BUY_CONFIG.BASE_POINT_POOL + backgroundStartingPoints;

    // Get stat breakdown for display
    const statBreakdown = getStatBreakdown(baseStats, racialModifiers, backgroundModifiers);

    // Handle stat changes
    const handleIncreaseStat = (statId) => {
        if (canIncreaseStat(baseStats, statId, backgroundStartingPoints)) {
            const newStats = increaseStat(baseStats, statId, backgroundStartingPoints);
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
                                    {backgroundStartingPoints > 0 && (
                                        <span className="bonus-points">Background: +{backgroundStartingPoints}</span>
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
                                const canIncrease = canIncreaseStat(baseStats, ability.id, backgroundStartingPoints);
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
                        <div className="summary-card">
                            <div className="summary-header">
                                <h3>Character Summary</h3>
                            </div>
                            <div className="summary-content">
                                <div className="summary-section">
                                    <h4>Basic Information</h4>
                                    <div className="summary-row">
                                        <span>Name:</span>
                                        <span>{characterData.name}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Race:</span>
                                        <span>{race} ({subrace})</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Class:</span>
                                        <span>{characterData.class}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Background:</span>
                                        <span>{background}</span>
                                    </div>
                                </div>

                                <div className="summary-section">
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

                                <div className="summary-section">
                                    <h4>Point Allocation</h4>
                                    <div className="allocation-summary">
                                        <div className="allocation-row">
                                            <span>Total Points:</span>
                                            <span>{totalPoints}</span>
                                        </div>
                                        <div className="allocation-row">
                                            <span>Points Used:</span>
                                            <span>{totalPoints - availablePoints}</span>
                                        </div>
                                        <div className="allocation-row remaining">
                                            <span>Points Remaining:</span>
                                            <span>{availablePoints}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

                <div className="step-footer">
                    <div className="step-hints">
                        <div className="hint">
                            <i className="fas fa-calculator"></i>
                            <span>Higher ability scores cost more points (14 costs 7 points, 15 costs 9 points)</span>
                        </div>
                        <div className="hint">
                            <i className="fas fa-plus"></i>
                            <span>Racial and background modifiers are applied automatically to your base scores</span>
                        </div>
                        <div className="hint">
                            <i className="fas fa-balance-scale"></i>
                            <span>Consider your class when allocating points - fighters need Strength, wizards need Intelligence</span>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default Step5StatAllocation;
