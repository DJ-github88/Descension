/**
 * StatsTab - Displays stat modifiers and base stats
 * 
 * Used by Race and Background selections
 */

import React from 'react';

const StatsTab = ({
    statModifiers = {},
    baseStats = null,
    savingThrowMods = null,
    title = "Stat Modifiers"
}) => {
    const hasStatModifiers = statModifiers && Object.keys(statModifiers).length > 0;
    const hasBaseStats = baseStats && Object.keys(baseStats).length > 0;
    const hasSavingThrowMods = savingThrowMods && (
        (savingThrowMods.advantage && savingThrowMods.advantage.length > 0) ||
        (savingThrowMods.disadvantage && savingThrowMods.disadvantage.length > 0) ||
        (savingThrowMods.resistance && savingThrowMods.resistance.length > 0) ||
        (savingThrowMods.immunity && savingThrowMods.immunity.length > 0)
    );

    if (!hasStatModifiers && !hasBaseStats && !hasSavingThrowMods) {
        return (
            <div className="selection-tab stats-tab">
                <div className="no-data-message">
                    <i className="fas fa-chart-bar"></i>
                    <p>No stat modifiers available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="selection-tab stats-tab">
            {hasStatModifiers && (
                <div className="stats-section">
                    <h5 className="section-title">{title}</h5>
                    <div className="stat-modifiers-grid">
                        {Object.entries(statModifiers).map(([stat, modifier]) => (
                            modifier !== 0 && (
                                <div 
                                    key={stat} 
                                    className={`stat-modifier-card ${modifier >= 0 ? 'positive' : 'negative'}`}
                                >
                                    <span className="stat-name">
                                        {stat.charAt(0).toUpperCase() + stat.slice(1).replace(/_/g, ' ')}
                                    </span>
                                    <span className="stat-value">
                                        {modifier >= 0 ? '+' : ''}{modifier}
                                    </span>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            )}

            {hasBaseStats && (
                <div className="stats-section">
                    <h5 className="section-title">Base Stats</h5>
                    <div className="base-stats-grid">
                        {baseStats.hp !== undefined && (
                            <div className="base-stat-item">
                                <span className="base-stat-label">HP:</span>
                                <span className="base-stat-value">{baseStats.hp}</span>
                            </div>
                        )}
                        {baseStats.mana !== undefined && (
                            <div className="base-stat-item">
                                <span className="base-stat-label">Mana:</span>
                                <span className="base-stat-value">{baseStats.mana}</span>
                            </div>
                        )}
                        {baseStats.speed !== undefined && (
                            <div className="base-stat-item">
                                <span className="base-stat-label">Speed:</span>
                                <span className="base-stat-value">{baseStats.speed} ft</span>
                            </div>
                        )}
                        {baseStats.ap !== undefined && (
                            <div className="base-stat-item">
                                <span className="base-stat-label">Action Points:</span>
                                <span className="base-stat-value">{baseStats.ap}</span>
                            </div>
                        )}
                        {baseStats.armor !== undefined && baseStats.armor !== 0 && (
                            <div className="base-stat-item">
                                <span className="base-stat-label">Armor:</span>
                                <span className="base-stat-value">{baseStats.armor}</span>
                            </div>
                        )}
                        {baseStats.passivePerception !== undefined && baseStats.passivePerception !== 0 && (
                            <div className="base-stat-item">
                                <span className="base-stat-label">Passive Perception:</span>
                                <span className="base-stat-value">
                                    {baseStats.passivePerception > 0 ? '+' : ''}{baseStats.passivePerception}
                                </span>
                            </div>
                        )}
                        {baseStats.initiative !== undefined && baseStats.initiative !== 0 && (
                            <div className="base-stat-item">
                                <span className="base-stat-label">Initiative:</span>
                                <span className="base-stat-value">
                                    {baseStats.initiative > 0 ? '+' : ''}{baseStats.initiative}
                                </span>
                            </div>
                        )}
                        {baseStats.darkvision !== undefined && baseStats.darkvision !== 0 && (
                            <div className="base-stat-item">
                                <span className="base-stat-label">Darkvision:</span>
                                <span className="base-stat-value">{baseStats.darkvision} ft</span>
                            </div>
                        )}
                        {baseStats.visionRange !== undefined && baseStats.visionRange !== 60 && (
                            <div className="base-stat-item">
                                <span className="base-stat-label">Vision Range:</span>
                                <span className="base-stat-value">{baseStats.visionRange} ft</span>
                            </div>
                        )}
                        {baseStats.swimSpeed !== undefined && baseStats.swimSpeed !== 0 && (
                            <div className="base-stat-item">
                                <span className="base-stat-label">Swim Speed:</span>
                                <span className="base-stat-value">
                                    {baseStats.swimSpeed > 0 ? '+' : ''}{baseStats.swimSpeed} ft
                                </span>
                            </div>
                        )}
                        {baseStats.climbSpeed !== undefined && baseStats.climbSpeed !== 0 && (
                            <div className="base-stat-item">
                                <span className="base-stat-label">Climb Speed:</span>
                                <span className="base-stat-value">
                                    {baseStats.climbSpeed > 0 ? '+' : ''}{baseStats.climbSpeed} ft
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {hasSavingThrowMods && (
                <div className="stats-section">
                    <h5 className="section-title">Special Modifiers</h5>
                    <div className="saving-throw-mods">
                        {savingThrowMods.advantage && savingThrowMods.advantage.length > 0 && (
                            <div className="save-mod-item advantage">
                                <span className="save-mod-label">
                                    <i className="fas fa-check-circle"></i> Advantage on saves against:
                                </span>
                                <span className="save-mod-value">
                                    {savingThrowMods.advantage.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
                                </span>
                            </div>
                        )}
                        {savingThrowMods.disadvantage && savingThrowMods.disadvantage.length > 0 && (
                            <div className="save-mod-item disadvantage">
                                <span className="save-mod-label">
                                    <i className="fas fa-times-circle"></i> Disadvantage on saves against:
                                </span>
                                <span className="save-mod-value">
                                    {savingThrowMods.disadvantage.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
                                </span>
                            </div>
                        )}
                        {savingThrowMods.resistance && savingThrowMods.resistance.length > 0 && (
                            <div className="save-mod-item resistance">
                                <span className="save-mod-label">
                                    <i className="fas fa-shield-alt"></i> Damage resistance to:
                                </span>
                                <span className="save-mod-value">
                                    {savingThrowMods.resistance.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
                                </span>
                            </div>
                        )}
                        {savingThrowMods.immunity && savingThrowMods.immunity.length > 0 && (
                            <div className="save-mod-item immunity">
                                <span className="save-mod-label">
                                    <i className="fas fa-ban"></i> Damage immunity to:
                                </span>
                                <span className="save-mod-value">
                                    {savingThrowMods.immunity.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatsTab;
