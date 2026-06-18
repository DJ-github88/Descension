import React from 'react';
import { DAMAGE_TYPES, UTILITY_STATS, DURATION_TYPES, DAMAGE_DICE, DAMAGE_AMOUNT, PHYSICAL_DAMAGE_TYPES, DAMAGE_ICONS } from '../itemWizardConfig';
import { getIconUrl } from '../../../utils/assetManager';
import { getCustomIconUrl } from '../../../utils/assetManager';

const StepUtility = ({ itemData, updateItemData }) => {
                return (
                    <>
                        <h3 className="wow-heading quality-text">Utility Stats</h3>
                        {itemData.type === 'weapon' && itemData.weaponStats && itemData.weaponStats.baseDamage && (
                            <>
                                <h4 className="wow-heading">Damage Properties</h4>
                                <div className="damage-grid">
                                    {/* Base Damage Controls Row */}
                                    <div className="damage-controls-row">
                                        <div className="damage-section">
                                            <div className="section-header">
                                                <img src={getIconUrl(DAMAGE_ICONS.base, 'abilities')} alt="Base Damage" className="section-icon" />
                                                <h5 className="wow-heading">Base Damage</h5>
                                            </div>
                                            <div className="damage-content">
                                                <div className="damage-dice-section">
                                                    <div className="dice-input-group">
                                                        <select
                                                            value={itemData.weaponStats?.baseDamage?.diceCount || 1}
                                                            onChange={(e) => {
                                                                const newWeaponStats = { ...itemData.weaponStats };
                                                                if (!newWeaponStats.baseDamage) {
                                                                    newWeaponStats.baseDamage = {};
                                                                }
                                                                newWeaponStats.baseDamage.diceCount = parseInt(e.target.value);
                                                                updateItemData({ weaponStats: newWeaponStats });
                                                            }}
                                                            className="wow-select"
                                                            style={{
                                                                color: itemData.weaponStats?.baseDamage?.damageType ?
                                                                    (PHYSICAL_DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.damageType]?.color ||
                                                                        DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.damageType]?.color) : 'inherit',
                                                                textShadow: itemData.weaponStats?.baseDamage?.damageType ?
                                                                    `0 0 8px ${PHYSICAL_DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.damageType]?.color ||
                                                                    DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.damageType]?.color}` : 'none'
                                                            }}
                                                        >
                                                            {DAMAGE_AMOUNT.map(amount => (
                                                                <option key={amount} value={amount}>{amount}</option>
                                                            ))}
                                                        </select>
                                                        <select
                                                            value={itemData.weaponStats?.baseDamage?.diceType || 'd6'}
                                                            onChange={(e) => {
                                                                const newWeaponStats = { ...itemData.weaponStats };
                                                                if (!newWeaponStats.baseDamage) {
                                                                    newWeaponStats.baseDamage = {};
                                                                }
                                                                newWeaponStats.baseDamage.diceType = e.target.value;
                                                                updateItemData({ weaponStats: newWeaponStats });
                                                            }}
                                                            className="wow-select"
                                                            style={{
                                                                color: itemData.weaponStats?.baseDamage?.damageType ?
                                                                    (PHYSICAL_DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.damageType]?.color ||
                                                                        DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.damageType]?.color) : 'inherit',
                                                                textShadow: itemData.weaponStats?.baseDamage?.damageType ?
                                                                    `0 0 8px ${PHYSICAL_DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.damageType]?.color ||
                                                                    DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.damageType]?.color}` : 'none'
                                                            }}
                                                        >
                                                            {DAMAGE_DICE.map(dice => (
                                                                <option key={dice} value={dice}>{dice}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Full Width Damage Type Selection */}
                                    <div className="damage-type-selection-section">
                                        <div className="section-header">
                                            <h5 className="wow-heading">Select Damage Type</h5>
                                        </div>
                                        <div className="damage-type-section item-editor">
                                            <div className="damage-type-grid">
                                                {/* Physical Damage Types First */}
                                                {Object.entries(PHYSICAL_DAMAGE_TYPES).map(([type, info]) => {
                                                    const descriptions = {
                                                        piercing: "Sharp points that penetrate armor and flesh",
                                                        slashing: "Cutting edges that cleave through defenses",
                                                        bludgeoning: "Crushing force that shatters bone and stone"
                                                    };
                                                    // Convert hex to RGB for glow effects
                                                    const hexToRgb = (hex) => {
                                                        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                                                        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
                                                    };
                                                    return (
                                                        <button
                                                            key={type}
                                                            className={`damage-type-button ${itemData.weaponStats?.baseDamage?.damageType === type ? 'selected' : ''}`}
                                                            onClick={() => {
                                                                const newWeaponStats = { ...itemData.weaponStats };
                                                                if (!newWeaponStats.baseDamage) {
                                                                    newWeaponStats.baseDamage = {};
                                                                }
                                                                newWeaponStats.baseDamage.damageType = type;
                                                                updateItemData({ weaponStats: newWeaponStats });
                                                            }}
                                                            style={{
                                                                '--type-color': info.color,
                                                                '--type-color-rgb': hexToRgb(info.color)
                                                            }}
                                                        >
                                                            <img src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')} alt={info.name} className="damage-type-icon" />
                                                            <div className="damage-type-tooltip">
                                                                <span className="damage-type-name">{info.name}</span>
                                                                <span className="damage-type-description">{descriptions[type] || info.description || `${info.name.toLowerCase()} damage`}</span>
                                                            </div>
                                                        </button>
                                                    )
                                                })}
                                                {/* Magical Damage Types Second */}
                                                {Object.entries(DAMAGE_TYPES).map(([type, info]) => {
                                                    const descriptions = {
                                                        fire: "Searing flames that burn and incinerate",
                                                        cold: "Freezing energy that chills to the bone",
                                                        lightning: "Electric bolts that shock and stun",
                                                        acid: "Corrosive energy that melts and dissolves",
                                                        force: "Pure magical energy that warps reality",
                                                        necrotic: "Death energy that withers and decays",
                                                        radiant: "Divine light that sears and purifies",
                                                        poison: "Toxic essence that corrupts and weakens",
                                                        psychic: "Mental energy that shatters the mind",
                                                        thunder: "Concussive force that deafens and destroys"
                                                    };
                                                    // Convert hex to RGB for glow effects
                                                    const hexToRgb = (hex) => {
                                                        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                                                        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
                                                    };
                                                    return (
                                                        <button
                                                            key={type}
                                                            className={`damage-type-button ${itemData.weaponStats?.baseDamage?.damageType === type ? 'selected' : ''}`}
                                                            onClick={() => {
                                                                const newWeaponStats = { ...itemData.weaponStats };
                                                                if (!newWeaponStats.baseDamage) {
                                                                    newWeaponStats.baseDamage = {};
                                                                }
                                                                newWeaponStats.baseDamage.damageType = type;
                                                                updateItemData({ weaponStats: newWeaponStats });
                                                            }}
                                                            style={{
                                                                '--type-color': info.color,
                                                                '--type-color-rgb': hexToRgb(info.color)
                                                            }}
                                                        >
                                                            <img src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')} alt={info.name} className="damage-type-icon" />
                                                            <div className="damage-type-tooltip">
                                                                <span className="damage-type-name">{info.name}</span>
                                                                <span className="damage-type-description">{descriptions[type] || info.description || `${info.name.toLowerCase()} damage`}</span>
                                                            </div>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bonus Damage and Critical Hit Row */}
                                    <div className="damage-controls-row">
                                        <div className="damage-section">
                                            <div className="section-header">
                                                <img src={getIconUrl(DAMAGE_ICONS.bonus, 'abilities')} alt="Bonus Damage" className="section-icon" />
                                                <h5 className="wow-heading">Bonus Damage</h5>
                                            </div>
                                            <div className="damage-content">
                                                <div className="bonus-damage-section">
                                                    <div className="bonus-input-group">
                                                        <button
                                                            className="stat-button"
                                                            onClick={() => {
                                                                const newWeaponStats = { ...itemData.weaponStats };
                                                                if (!newWeaponStats.baseDamage) {
                                                                    newWeaponStats.baseDamage = {};
                                                                }
                                                                newWeaponStats.baseDamage.bonusDamage = Math.max(0, (newWeaponStats.baseDamage.bonusDamage || 0) - 1);
                                                                updateItemData({ weaponStats: newWeaponStats });
                                                            }}
                                                        >
                                                            -
                                                        </button>
                                                        <input
                                                            type="number"
                                                            value={itemData.weaponStats?.baseDamage?.bonusDamage || 0}
                                                            onChange={(e) => {
                                                                const newWeaponStats = { ...itemData.weaponStats };
                                                                if (!newWeaponStats.baseDamage) {
                                                                    newWeaponStats.baseDamage = {};
                                                                }
                                                                const value = e.target.value === '' ? 0 : Math.max(-20, Math.min(20, parseInt(e.target.value) || 0));
                                                                newWeaponStats.baseDamage.bonusDamage = value;
                                                                updateItemData({ weaponStats: newWeaponStats });
                                                            }}
                                                            className="stat-input wow-input"
                                                            style={{
                                                                color: itemData.weaponStats?.baseDamage?.bonusDamageType ?
                                                                    (PHYSICAL_DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.bonusDamageType]?.color ||
                                                                        DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.bonusDamageType]?.color) : 'inherit',
                                                                textShadow: itemData.weaponStats?.baseDamage?.bonusDamageType ?
                                                                    `0 0 8px ${PHYSICAL_DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.bonusDamageType]?.color ||
                                                                    DAMAGE_TYPES[itemData.weaponStats?.baseDamage?.bonusDamageType]?.color}` : 'none'
                                                            }}
                                                        />
                                                        <button
                                                            className="stat-button"
                                                            onClick={() => {
                                                                const newWeaponStats = { ...itemData.weaponStats };
                                                                if (!newWeaponStats.baseDamage) {
                                                                    newWeaponStats.baseDamage = {};
                                                                }
                                                                newWeaponStats.baseDamage.bonusDamage = (newWeaponStats.baseDamage.bonusDamage || 0) + 1;
                                                                updateItemData({ weaponStats: newWeaponStats });
                                                            }}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="damage-type-section item-editor">
                                                    <div className="damage-type-grid">
                                                        {/* Physical Damage Types First */}
                                                        {Object.entries(PHYSICAL_DAMAGE_TYPES).map(([type, info]) => {
                                                            const descriptions = {
                                                                piercing: "Sharp points that penetrate armor and flesh",
                                                                slashing: "Cutting edges that cleave through defenses",
                                                                bludgeoning: "Crushing force that shatters bone and stone"
                                                            };
                                                            // Convert hex to RGB for glow effects
                                                            const hexToRgb = (hex) => {
                                                                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                                                                return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
                                                            };
                                                            return (
                                                                <button
                                                                    key={type}
                                                                    className={`damage-type-button ${itemData.weaponStats?.baseDamage?.bonusDamageType === type ? 'selected' : ''}`}
                                                                    onClick={() => {
                                                                        const newWeaponStats = { ...itemData.weaponStats };
                                                                        newWeaponStats.baseDamage.bonusDamageType = type;
                                                                        updateItemData({ weaponStats: newWeaponStats });
                                                                    }}
                                                                    style={{
                                                                        '--type-color': info.color,
                                                                        '--type-color-rgb': hexToRgb(info.color)
                                                                    }}
                                                                >
                                                                    <img src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')} alt={info.name} className="damage-type-icon" />
                                                                    <div className="damage-type-tooltip">
                                                                        <span className="damage-type-name">{info.name}</span>
                                                                        <span className="damage-type-description">{descriptions[type] || info.description || `${info.name.toLowerCase()} damage`}</span>
                                                                    </div>
                                                                </button>
                                                            )
                                                        })}
                                                        {/* Magical Damage Types Second */}
                                                        {Object.entries(DAMAGE_TYPES).map(([type, info]) => {
                                                            const descriptions = {
                                                                fire: "Searing flames that burn and incinerate",
                                                                cold: "Freezing energy that chills to the bone",
                                                                lightning: "Electric bolts that shock and stun",
                                                                acid: "Corrosive energy that melts and dissolves",
                                                                force: "Pure magical energy that warps reality",
                                                                necrotic: "Death energy that withers and decays",
                                                                radiant: "Divine light that sears and purifies",
                                                                poison: "Toxic essence that corrupts and weakens",
                                                                psychic: "Mental energy that shatters the mind",
                                                                thunder: "Concussive force that deafens and destroys"
                                                            };
                                                            // Convert hex to RGB for glow effects
                                                            const hexToRgb = (hex) => {
                                                                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                                                                return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
                                                            };
                                                            return (
                                                                <button
                                                                    key={type}
                                                                    className={`damage-type-button ${itemData.weaponStats?.baseDamage?.bonusDamageType === type ? 'selected' : ''}`}
                                                                    onClick={() => {
                                                                        const newWeaponStats = { ...itemData.weaponStats };
                                                                        newWeaponStats.baseDamage.bonusDamageType = type;
                                                                        updateItemData({ weaponStats: newWeaponStats });
                                                                    }}
                                                                    style={{
                                                                        '--type-color': info.color,
                                                                        '--type-color-rgb': hexToRgb(info.color)
                                                                    }}
                                                                >
                                                                    <img src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')} alt={info.name} className="damage-type-icon" />
                                                                    <div className="damage-type-tooltip">
                                                                        <span className="damage-type-name">{info.name}</span>
                                                                        <span className="damage-type-description">{descriptions[type] || info.description || `${info.name.toLowerCase()} damage`}</span>
                                                                    </div>
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="utility-section">
                            <h5 className="wow-heading">Utility Stats</h5>
                            <div className="utility-stats-grid">
                                <div className="stat-item">
                                    <div className="stat-header">
                                        <img src={UTILITY_STATS.movementSpeed.icon} alt="Movement Speed" className="stat-icon" />
                                        <label className="stat-label wow-text">Movement Speed</label>
                                    </div>
                                    <div className="stat-input-group">
                                        <button
                                            className="stat-button"
                                            onClick={() => {
                                                const newStats = { ...itemData.utilityStats };
                                                newStats.movementSpeed = {
                                                    ...newStats.movementSpeed,
                                                    value: newStats.movementSpeed.value - 1
                                                };
                                                updateItemData({ utilityStats: newStats });
                                            }}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={itemData.utilityStats.movementSpeed.value}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                const newStats = { ...itemData.utilityStats };
                                                newStats.movementSpeed = {
                                                    ...newStats.movementSpeed,
                                                    value: val
                                                };
                                                updateItemData({ utilityStats: newStats });
                                            }}
                                            className="stat-input wow-input"
                                        />
                                        <button
                                            className="stat-button"
                                            onClick={() => {
                                                const newStats = { ...itemData.utilityStats };
                                                newStats.movementSpeed = {
                                                    ...newStats.movementSpeed,
                                                    value: newStats.movementSpeed.value + 1
                                                };
                                                updateItemData({ utilityStats: newStats });
                                            }}
                                        >
                                            +
                                        </button>
                                        <button
                                            className={`type-toggle ${itemData.utilityStats.movementSpeed.isPercentage ? 'active' : ''}`}
                                            onClick={() => {
                                                const newStats = { ...itemData.utilityStats };
                                                newStats.movementSpeed = {
                                                    ...newStats.movementSpeed,
                                                    isPercentage: !newStats.movementSpeed.isPercentage
                                                };
                                                updateItemData({ utilityStats: newStats });
                                            }}
                                        >
                                            {itemData.utilityStats.movementSpeed.isPercentage ? '%' : '#'}
                                        </button>
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-header">
                                        <img src={UTILITY_STATS.swimSpeed.icon} alt="Swim Speed" className="stat-icon" />
                                        <label className="stat-label wow-text">Swim Speed</label>
                                    </div>
                                    <div className="stat-input-group">
                                        <button
                                            className="stat-button"
                                            onClick={() => {
                                                const newStats = { ...itemData.utilityStats };
                                                newStats.swimSpeed = {
                                                    ...newStats.swimSpeed,
                                                    value: newStats.swimSpeed.value - 1
                                                };
                                                updateItemData({ utilityStats: newStats });
                                            }}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={itemData.utilityStats.swimSpeed.value}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                const newStats = { ...itemData.utilityStats };
                                                newStats.swimSpeed = {
                                                    ...newStats.swimSpeed,
                                                    value: val
                                                };
                                                updateItemData({ utilityStats: newStats });
                                            }}
                                            className="stat-input wow-input"
                                        />
                                        <button
                                            className="stat-button"
                                            onClick={() => {
                                                const newStats = { ...itemData.utilityStats };
                                                newStats.swimSpeed = {
                                                    ...newStats.swimSpeed,
                                                    value: newStats.swimSpeed.value + 1
                                                };
                                                updateItemData({ utilityStats: newStats });
                                            }}
                                        >
                                            +
                                        </button>
                                        <button
                                            className={`type-toggle ${itemData.utilityStats.swimSpeed.isPercentage ? 'active' : ''}`}
                                            onClick={() => {
                                                const newStats = { ...itemData.utilityStats };
                                                newStats.swimSpeed = {
                                                    ...newStats.swimSpeed,
                                                    isPercentage: !newStats.swimSpeed.isPercentage
                                                };
                                                updateItemData({ utilityStats: newStats });
                                            }}
                                        >
                                            {itemData.utilityStats.swimSpeed.isPercentage ? '%' : '#'}
                                        </button>
                                    </div>
                                </div>
                                {/* Duration Type for Consumables */}
                                {itemData.type === 'consumable' && (
                                    <div className="stat-item">
                                        <div className="stat-header">
                                            <img
                                                src={getIconUrl('Radiant/Holy Cross', 'abilities')}
                                                alt="Duration Type"
                                                className="stat-icon"
                                            />
                                            <label className="stat-label wow-text">Duration Type</label>
                                        </div>
                                        <div className="stat-input-group">
                                            <select
                                                value={itemData.utilityStats?.duration?.type || 'ROUNDS'}
                                                onChange={(e) => {
                                                    updateItemData({
                                                        utilityStats: {
                                                            ...itemData.utilityStats,
                                                            duration: {
                                                                ...itemData.utilityStats?.duration,
                                                                type: e.target.value
                                                            }
                                                        }
                                                    });
                                                }}
                                                className="stat-input wow-input"
                                            >
                                                {Object.entries(DURATION_TYPES).map(([key, value]) => (
                                                    <option key={key} value={key}>{value.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {/* Duration Value for Consumables */}
                                {itemData.type === 'consumable' && (
                                    <div className="stat-item">
                                        <div className="stat-header">
                                            <img
                                                src={getIconUrl('Utility/Utility Tool', 'abilities')}
                                                alt="Duration Value"
                                                className="stat-icon"
                                            />
                                            <label className="stat-label wow-text">Duration Value</label>
                                        </div>
                                        <div className="stat-input-group">
                                            <button
                                                className="stat-button"
                                                onClick={() => {
                                                    const currentValue = itemData.utilityStats?.duration?.value || 1;
                                                    if (currentValue > 1) {
                                                        updateItemData({
                                                            utilityStats: {
                                                                ...itemData.utilityStats,
                                                                duration: {
                                                                    ...itemData.utilityStats?.duration,
                                                                    value: currentValue - 1
                                                                }
                                                            }
                                                        });
                                                    }
                                                }}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={itemData.utilityStats?.duration?.value || 1}
                                                onChange={(e) => {
                                                    const val = Math.max(1, parseInt(e.target.value) || 1);
                                                    updateItemData({
                                                        utilityStats: {
                                                            ...itemData.utilityStats,
                                                            duration: {
                                                                ...itemData.utilityStats?.duration,
                                                                value: val
                                                            }
                                                        }
                                                    });
                                                }}
                                                className="stat-input wow-input"
                                            />
                                            <button
                                                className="stat-button"
                                                onClick={() => {
                                                    const currentValue = itemData.utilityStats?.duration?.value || 1;
                                                    updateItemData({
                                                        utilityStats: {
                                                            ...itemData.utilityStats,
                                                            duration: {
                                                                ...itemData.utilityStats?.duration,
                                                                value: currentValue + 1
                                                            }
                                                        }
                                                    });
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="stat-item">
                                    <div className="stat-header">
                                        <img src={UTILITY_STATS.carryingCapacity.icon} alt="Carrying Capacity" className="stat-icon" />
                                        <label className="stat-label wow-text">Carrying Capacity</label>
                                    </div>
                                    <div className="carrying-capacity-section">
                                        <label className="capacity-toggle">
                                            <div className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    id="carrying-capacity-toggle"
                                                    checked={itemData.utilityStats.carryingCapacity.enabled}
                                                    onChange={(e) => {
                                                        const newUtilityStats = { ...itemData.utilityStats };
                                                        newUtilityStats.carryingCapacity.enabled = e.target.checked;
                                                        updateItemData({ utilityStats: newUtilityStats });
                                                    }}
                                                />
                                                <span className="slider"></span>
                                            </div>
                                            <span>Additional Inventory Space</span>
                                        </label>

                                        {itemData.utilityStats.carryingCapacity.enabled && (
                                            <div className="slots-input">
                                                <label>Additional Slots:</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="25"
                                                    value={itemData.utilityStats.carryingCapacity.slots === 0 ? '' : itemData.utilityStats.carryingCapacity.slots}
                                                    onChange={(e) => {
                                                        const slots = e.target.value === '' ? 0 : Math.max(0, Math.min(25, parseInt(e.target.value) || 0));
                                                        const newUtilityStats = { ...itemData.utilityStats };
                                                        newUtilityStats.carryingCapacity = {
                                                            ...newUtilityStats.carryingCapacity,
                                                            slots
                                                        };
                                                        updateItemData({ utilityStats: newUtilityStats });
                                                    }}
                                                    className="wow-input"
                                                />
                                            </div>
                                        )}
                                        {itemData.utilityStats.carryingCapacity.enabled && (
                                            <div className="capacity-preview">
                                                <div className="preview-label">Additional Inventory Space:</div>
                                                <div className="additional-slots-grid">
                                                    {Array(itemData.utilityStats.carryingCapacity.slots || 1)
                                                        .fill(null)
                                                        .map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className="additional-slot"
                                                            // Removed title to prevent browser tooltip conflict
                                                            >
                                                                <div className="slot-plus">+</div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </>
                );
};

export default StepUtility;
