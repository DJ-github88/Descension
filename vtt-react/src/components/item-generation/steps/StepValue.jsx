import React from 'react';
import { getIconUrl } from '../../../utils/assetManager';

const StepValue = ({ itemData, updateItemData }) => {
                if (!itemData.value) {
                    updateItemData({
                        value: { platinum: 0, gold: 0, silver: 0, copper: 0 }
                    });
                    return null;
                }
                return (
                    <>
                        <h3 className="wow-heading quality-text">Item Value</h3>
                        <div className="currency-grid">
                            <div className="currency-item">
                                <div className="currency-header">
                                    <img
                                        src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
                                        alt="Platinum"
                                        className="currency-icon coin-platinum"
                                    />
                                    <label className="currency-label wow-text">Platinum</label>
                                </div>
                                <div className="stat-input-group">
                                    <button
                                        className="stat-button"
                                        onClick={() => updateItemData({
                                            value: { ...itemData.value, platinum: Math.max(0, (itemData.value.platinum || 0) - 1) }
                                        })}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="0"
                                        value={itemData.value.platinum || 0}
                                        onChange={(e) => updateItemData({
                                            value: { ...itemData.value, platinum: Math.max(0, parseInt(e.target.value) || 0) }
                                        })}
                                        className="stat-input wow-input"
                                        placeholder="0"
                                    />
                                    <button
                                        className="stat-button"
                                        onClick={() => updateItemData({
                                            value: { ...itemData.value, platinum: (itemData.value.platinum || 0) + 1 }
                                        })}
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    className="randomize-button"
                                    onClick={() => updateItemData({
                                        value: { ...itemData.value, platinum: Math.floor(Math.random() * 99) + 1 }
                                    })}
                                    title="Randomize Platinum (1-99)"
                                >
                                    🎲
                                </button>
                            </div>

                            <div className="currency-item">
                                <div className="currency-header">
                                    <img
                                        src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
                                        alt="Gold"
                                        className="currency-icon coin-gold"
                                    />
                                    <label className="currency-label wow-text">Gold</label>
                                </div>
                                <div className="stat-input-group">
                                    <button
                                        className="stat-button"
                                        onClick={() => updateItemData({
                                            value: { ...itemData.value, gold: Math.max(0, (itemData.value.gold || 0) - 1) }
                                        })}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="0"
                                        value={itemData.value.gold || 0}
                                        onChange={(e) => updateItemData({
                                            value: { ...itemData.value, gold: Math.max(0, parseInt(e.target.value) || 0) }
                                        })}
                                        className="stat-input wow-input"
                                        placeholder="0"
                                    />
                                    <button
                                        className="stat-button"
                                        onClick={() => updateItemData({
                                            value: { ...itemData.value, gold: (itemData.value.gold || 0) + 1 }
                                        })}
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    className="randomize-button"
                                    onClick={() => updateItemData({
                                        value: { ...itemData.value, gold: Math.floor(Math.random() * 99) + 1 }
                                    })}
                                    title="Randomize Gold (1-99)"
                                >
                                    🎲
                                </button>
                            </div>

                            <div className="currency-item">
                                <div className="currency-header">
                                    <img
                                        src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
                                        alt="Silver"
                                        className="currency-icon coin-silver"
                                    />
                                    <label className="currency-label wow-text">Silver</label>
                                </div>
                                <div className="stat-input-group">
                                    <button
                                        className="stat-button"
                                        onClick={() => updateItemData({
                                            value: { ...itemData.value, silver: Math.max(0, Math.min(99, (itemData.value.silver || 0) - 1)) }
                                        })}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="0"
                                        max="99"
                                        value={itemData.value.silver || 0}
                                        onChange={(e) => updateItemData({
                                            value: { ...itemData.value, silver: Math.max(0, Math.min(99, parseInt(e.target.value) || 0)) }
                                        })}
                                        className="stat-input wow-input"
                                        placeholder="0"
                                    />
                                    <button
                                        className="stat-button"
                                        onClick={() => updateItemData({
                                            value: { ...itemData.value, silver: Math.min(99, (itemData.value.silver || 0) + 1) }
                                        })}
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    className="randomize-button"
                                    onClick={() => updateItemData({
                                        value: { ...itemData.value, silver: Math.floor(Math.random() * 99) + 1 }
                                    })}
                                    title="Randomize Silver (1-99)"
                                >
                                    🎲
                                </button>
                            </div>

                            <div className="currency-item">
                                <div className="currency-header">
                                    <img
                                        src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
                                        alt="Copper"
                                        className="currency-icon coin-copper"
                                    />
                                    <label className="currency-label wow-text">Copper</label>
                                </div>
                                <div className="stat-input-group">
                                    <button
                                        className="stat-button"
                                        onClick={() => updateItemData({
                                            value: { ...itemData.value, copper: Math.max(0, Math.min(99, (itemData.value.copper || 0) - 1)) }
                                        })}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="0"
                                        max="99"
                                        value={itemData.value.copper || 0}
                                        onChange={(e) => updateItemData({
                                            value: { ...itemData.value, copper: Math.max(0, Math.min(99, parseInt(e.target.value) || 0)) }
                                        })}
                                        className="stat-input wow-input"
                                        placeholder="0"
                                    />
                                    <button
                                        className="stat-button"
                                        onClick={() => updateItemData({
                                            value: { ...itemData.value, copper: Math.min(99, (itemData.value.copper || 0) + 1) }
                                        })}
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    className="randomize-button"
                                    onClick={() => updateItemData({
                                        value: { ...itemData.value, copper: Math.floor(Math.random() * 99) + 1 }
                                    })}
                                    title="Randomize Copper (1-99)"
                                >
                                    🎲
                                </button>
                            </div>
                        </div>
                        <div className="value-total">
                            <button
                                className="randomize-all-button"
                                onClick={() => updateItemData({
                                    value: {
                                        ...itemData.value,
                                        platinum: Math.floor(Math.random() * 99) + 1,
                                        gold: Math.floor(Math.random() * 99) + 1,
                                        silver: Math.floor(Math.random() * 99) + 1,
                                        copper: Math.floor(Math.random() * 99) + 1
                                    }
                                })}
                                title="Randomize All Currencies (1-99 each)"
                            >
                                🎲 RANDOMIZE ALL
                            </button>
                            <div className="total-content">
                                <span className="total-label">Total Value:</span>
                                <span className="currency-display">
                                    {(itemData.value.platinum || 0) > 0 && (
                                        <>
                                            <span className="platinum-amount">{itemData.value.platinum}</span>
                                            <span className="platinum-symbol">p</span>
                                        </>
                                    )}
                                    <span className="gold-amount">{itemData.value.gold || 0}</span>
                                    <span className="gold-symbol">g</span>
                                    <span className="silver-amount">{itemData.value.silver || 0}</span>
                                    <span className="silver-symbol">s</span>
                                    <span className="copper-amount">{itemData.value.copper || 0}</span>
                                    <span className="copper-symbol">c</span>
                                </span>
                            </div>
                        </div>
                    </>
                );
};

export default StepValue;
