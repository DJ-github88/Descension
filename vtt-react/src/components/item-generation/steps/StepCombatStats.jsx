import React from 'react';
import { COMBAT_STATS, DAMAGE_TYPES, RESISTANCE_LEVELS, CONDITION_MODIFIER_OPTIONS } from '../itemWizardConfig';
import { getCustomIconUrl } from '../../../utils/assetManager';
import { CONDITIONS } from '../../../data/conditionsData';

const StepCombatStats = ({ itemData, updateItemData }) => {
                return (
                    <>
                        <h3 className="wow-heading quality-text">Combat Stats</h3>
                        <div className="combat-stats-grid">

                            {Object.entries(COMBAT_STATS)
                                .filter(([stat, _]) => {
                                    // Only show health, mana, and AP restore for consumables
                                    if ((stat === 'healthRestore' || stat === 'manaRestore' || stat === 'apRestore') && itemData.type !== 'consumable') {
                                        return false;
                                    }
                                    return true;
                                })
                                .map(([stat, info]) => (
                                    <div key={stat} className="stat-item">
                                        <div className="stat-header">
                                            <img
                                                src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')}
                                                alt={info.name}
                                                className="stat-icon"
                                            />
                                            <label className="stat-label wow-text">{info.name}</label>
                                        </div>
                                        <div className="stat-input-group">
                                            <button
                                                className="stat-button"
                                                onClick={() => {
                                                    const newStats = { ...itemData.combatStats };
                                                    newStats[stat] = {
                                                        ...newStats[stat],
                                                        value: newStats[stat].value - 1
                                                    };
                                                    updateItemData({ combatStats: newStats });
                                                }}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={itemData.combatStats[stat].value}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value) || 0;
                                                    const newStats = { ...itemData.combatStats };
                                                    newStats[stat] = {
                                                        ...newStats[stat],
                                                        value: val
                                                    };
                                                    updateItemData({ combatStats: newStats });
                                                }}
                                                className="stat-input wow-input"
                                            />
                                            <button
                                                className="stat-button"
                                                onClick={() => {
                                                    const newStats = { ...itemData.combatStats };
                                                    newStats[stat] = {
                                                        ...newStats[stat],
                                                        value: newStats[stat].value + 1
                                                    };
                                                    updateItemData({ combatStats: newStats });
                                                }}
                                            >
                                                +
                                            </button>
                                            <button
                                                className={`type-toggle ${itemData.combatStats[stat].isPercentage ? 'active' : ''}`}
                                                onClick={() => {
                                                    const newStats = { ...itemData.combatStats };
                                                    newStats[stat] = {
                                                        ...newStats[stat],
                                                        isPercentage: !newStats[stat].isPercentage
                                                    };
                                                    updateItemData({ combatStats: newStats });
                                                }}
                                            >
                                                {itemData.combatStats[stat].isPercentage ? '%' : '#'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            <div className="spell-damage-section">
                                <h4>Spell Damage</h4>
                                <div className="damage-type-grid">
                                    {Object.entries(DAMAGE_TYPES).map(([type, info]) => {
                                        const damageValue = itemData.combatStats.spellDamage.types[type] || { value: 0, isPercentage: false };
                                        return (
                                            <div key={type} className="damage-type-item">
                                                <div className="damage-type-header">
                                                    <img src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')} alt={info.name} className="damage-type-icon" />
                                                    <label className="damage-type-label wow-text">{info.name}</label>
                                                </div>
                                                <div className="stat-input-group">
                                                    <button
                                                        className="stat-button"
                                                        onClick={() => {
                                                            const newTypes = { ...itemData.combatStats.spellDamage.types };
                                                            newTypes[type] = {
                                                                ...newTypes[type],
                                                                value: (newTypes[type]?.value || 0) - 1
                                                            };
                                                            updateItemData({
                                                                combatStats: {
                                                                    ...itemData.combatStats,
                                                                    spellDamage: {
                                                                        ...itemData.combatStats.spellDamage,
                                                                        types: newTypes
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={damageValue.value}
                                                        onChange={(e) => {
                                                            const val = parseInt(e.target.value) || 0;
                                                            const newTypes = { ...itemData.combatStats.spellDamage.types };
                                                            newTypes[type] = {
                                                                ...newTypes[type],
                                                                value: val
                                                            };
                                                            updateItemData({
                                                                combatStats: {
                                                                    ...itemData.combatStats,
                                                                    spellDamage: {
                                                                        ...itemData.combatStats.spellDamage,
                                                                        types: newTypes
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                        className="stat-input wow-input"
                                                    />
                                                    <button
                                                        className="stat-button"
                                                        onClick={() => {
                                                            const newTypes = { ...itemData.combatStats.spellDamage.types };
                                                            newTypes[type] = {
                                                                ...newTypes[type],
                                                                value: (newTypes[type]?.value || 0) + 1
                                                            };
                                                            updateItemData({
                                                                combatStats: {
                                                                    ...itemData.combatStats,
                                                                    spellDamage: {
                                                                        ...itemData.combatStats.spellDamage,
                                                                        types: newTypes
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        +
                                                    </button>
                                                    <button
                                                        className={`type-toggle ${damageValue.isPercentage ? 'active' : ''}`}
                                                        onClick={() => {
                                                            const newTypes = { ...itemData.combatStats.spellDamage.types };
                                                            newTypes[type] = {
                                                                ...newTypes[type],
                                                                isPercentage: !(newTypes[type]?.isPercentage || false)
                                                            };
                                                            updateItemData({
                                                                combatStats: {
                                                                    ...itemData.combatStats,
                                                                    spellDamage: {
                                                                        ...itemData.combatStats.spellDamage,
                                                                        types: newTypes
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        {damageValue.isPercentage ? '%' : '#'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="resistance-section">
                                <h4>Resistances</h4>
                                <div className="resistance-grid">
                                    {Object.entries(DAMAGE_TYPES).map(([type, info]) => (
                                        <div key={type} className="resistance-item">
                                            <div className="resistance-header">
                                                <img src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')} alt={info.name} className="resistance-icon" />
                                                <label className="resistance-label wow-text">{info.name}</label>
                                            </div>
                                            <div className="resistance-controls">
                                                <select
                                                    value={itemData.combatStats.resistances[type]?.level || 100}
                                                    onChange={(e) => {
                                                        const level = parseInt(e.target.value);
                                                        const selectedLevel = RESISTANCE_LEVELS.find(r => r.value === level);
                                                        const newResistances = { ...itemData.combatStats.resistances };

                                                        if (level === 100) {
                                                            // Normal resistance - remove entry
                                                            delete newResistances[type];
                                                        } else {
                                                            newResistances[type] = {
                                                                level: level,
                                                                label: selectedLevel?.label || 'Normal',
                                                                description: selectedLevel?.description || 'Takes normal damage',
                                                                multiplier: selectedLevel?.multiplier || 1.0,
                                                                color: selectedLevel?.color || '#9e9e9e'
                                                            };
                                                        }

                                                        updateItemData({
                                                            combatStats: {
                                                                ...itemData.combatStats,
                                                                resistances: newResistances
                                                            }
                                                        });
                                                    }}
                                                    className="resistance-select"
                                                    style={{
                                                        color: itemData.combatStats.resistances[type]?.color || '#9e9e9e',
                                                        borderColor: info.color
                                                    }}
                                                >
                                                    {RESISTANCE_LEVELS.map(level => (
                                                        <option
                                                            key={level.value}
                                                            value={level.value}
                                                            style={{ color: level.color }}
                                                        >
                                                            {level.label} ({level.multiplier === 1.0 ? 'Normal' : level.multiplier < 0 ? `Heals ${Math.abs(level.multiplier)}×` : `${level.multiplier}×`})
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="resistance-description">
                                                    {itemData.combatStats.resistances[type]?.description || 'Takes normal damage'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="resistance-section">
                                <h4>Condition Modifiers</h4>
                                <div className="resistance-grid">
                                    {Object.entries(CONDITIONS).map(([conditionId, condition]) => (
                                        <div key={conditionId} className="resistance-item">
                                            <div className="resistance-header">
                                                <img
                                                    src={condition.icon || getCustomIconUrl('Status/mental/spiral-dizzy', 'abilities')}
                                                    alt={condition.name}
                                                    className="resistance-icon"
                                                />
                                                <label className="resistance-label wow-text">{condition.name}</label>
                                            </div>
                                            <div className="resistance-controls">
                                                <select
                                                    value={itemData.combatStats.conditionModifiers?.[conditionId]?.modifier || 'none'}
                                                    onChange={(e) => {
                                                        const modifier = e.target.value;
                                                        const selectedModifier = CONDITION_MODIFIER_OPTIONS.find(m => m.value === modifier);
                                                        const newConditionModifiers = { ...(itemData.combatStats.conditionModifiers || {}) };

                                                        if (modifier === 'none') {
                                                            // No modifier - remove entry
                                                            delete newConditionModifiers[conditionId];
                                                        } else {
                                                            newConditionModifiers[conditionId] = {
                                                                modifier: modifier,
                                                                label: selectedModifier?.label || 'None',
                                                                description: selectedModifier?.description || 'No modifier',
                                                                color: selectedModifier?.color || '#9e9e9e'
                                                            };
                                                        }

                                                        updateItemData({
                                                            combatStats: {
                                                                ...itemData.combatStats,
                                                                conditionModifiers: newConditionModifiers
                                                            }
                                                        });
                                                    }}
                                                    className="resistance-select"
                                                    style={{
                                                        color: itemData.combatStats.conditionModifiers?.[conditionId]?.color || '#9e9e9e',
                                                        borderColor: condition.color || '#9e9e9e'
                                                    }}
                                                >
                                                    {CONDITION_MODIFIER_OPTIONS.map(option => (
                                                        <option
                                                            key={option.value}
                                                            value={option.value}
                                                            style={{ color: option.color }}
                                                        >
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="resistance-description">
                                                    {itemData.combatStats.conditionModifiers?.[conditionId]?.description || 'No modifier'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                );
};

export default StepCombatStats;
