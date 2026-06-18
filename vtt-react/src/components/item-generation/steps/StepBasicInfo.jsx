import React from 'react';
import { QUALITY_TYPES } from '../itemWizardConfig';
import { getIconUrl } from '../../../utils/assetManager';

const StepBasicInfo = ({ itemData, updateItemData }) => {
                return (
                    <>
                        <h3 className="wow-heading quality-text">Basic Information</h3>
                        <div className="form-group">
                            <label>Name:</label>
                            <input
                                type="text"
                                value={itemData.name}
                                onChange={(e) => updateItemData({ name: e.target.value })}
                                placeholder="Enter item name..."
                                className={`item-name-input quality-text`}
                                style={{ color: QUALITY_TYPES[itemData.quality]?.color }}
                            />
                        </div>

                        <div className="form-group">
                            <label>Quality:</label>
                            <div className="quality-grid">
                                {Object.entries(QUALITY_TYPES).map(([quality, data]) => (
                                    <button
                                        key={quality}
                                        className={`quality-button ${itemData.quality === quality ? 'selected' : ''}`}
                                        data-quality={quality}
                                        onClick={() => updateItemData({ quality })}
                                        style={{ '--wow-accent-color': data.color }}
                                    >
                                        <img
                                            src={getIconUrl(data.icon, 'items')}
                                            alt={data.name}
                                        />
                                        <span>{data.name}</span>
                                        <div className="flavor-text" style={{ color: data.color }}>
                                            {data.flavor}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Level Requirement:</label>
                            <div className="level-requirement-input">
                                <div className="level-input-group">
                                    <img
                                        src={getIconUrl('Misc/Books/book-golden-star-red-bookmark', 'items')}
                                        alt="Level Requirement"
                                        className="level-icon"
                                    />
                                    <button
                                        className="level-button"
                                        onClick={() => {
                                            const newLevel = Math.max(0, (itemData.requiredLevel || 0) - 1);
                                            updateItemData({ requiredLevel: newLevel });
                                        }}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={itemData.requiredLevel || 0}
                                        onChange={(e) => updateItemData({ requiredLevel: Math.max(0, parseInt(e.target.value) || 0) })}
                                        className="wow-input"
                                        min="0"
                                    />
                                    <button
                                        className="level-button"
                                        onClick={() => {
                                            const newLevel = (itemData.requiredLevel || 0) + 1;
                                            updateItemData({ requiredLevel: newLevel });
                                        }}
                                    >
                                        +
                                    </button>
                                    <span className="level-label">Required Level</span>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description:</label>
                            <textarea
                                value={itemData.description || ''}
                                onChange={(e) => updateItemData({ description: e.target.value })}
                                placeholder="Enter item description..."
                                className="item-description"
                                rows={4}
                            />
                        </div>
                    </>
                );
};

export default StepBasicInfo;
