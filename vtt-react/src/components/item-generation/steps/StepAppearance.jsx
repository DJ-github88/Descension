import React, { useState } from 'react';
import { DEFAULT_ITEM_IMAGE } from '../itemWizardConfig';
import { getIconUrl } from '../../../utils/assetManager';
import { WOW_ICONS } from '../wowIcons';

const StepAppearance = ({ itemData, updateItemData }) => {
    const [openCategories, setOpenCategories] = useState(new Set());
                return (
                    <>
                        <h3 className="wow-heading quality-text">Item Appearance</h3>
                        {Object.entries(WOW_ICONS).map(([category, items]) => {
                            const isOpen = openCategories.has(category);
                            return (
                                <div key={category} className="wow-icon-category">
                                    <h4
                                        className="wow-category-title"
                                        onClick={() => {
                                            const newOpenCategories = new Set(openCategories);
                                            if (isOpen) {
                                                newOpenCategories.delete(category);
                                            } else {
                                                newOpenCategories.add(category);
                                            }
                                            setOpenCategories(newOpenCategories);
                                        }}
                                        style={{ cursor: 'pointer', userSelect: 'none' }}
                                    >
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                        <span className="category-toggle">{isOpen ? ' ▲' : ' ▼'}</span>
                                    </h4>
                                    {isOpen && (
                                        <div className="wow-icon-grid">
                                            {(() => {
                                                // Flatten all items into a single array regardless of structure
                                                const allItems = Array.isArray(items)
                                                    ? items
                                                    : Object.values(items).flat();

                                                // Remove duplicates based on item.id
                                                const uniqueItems = allItems.filter((item, index, self) =>
                                                    index === self.findIndex(i => i.id === item.id)
                                                );

                                                return uniqueItems.map(item => (
                                                    <button
                                                        key={item.id}
                                                        className={`wow-icon-button ${itemData.iconId === item.id ? 'selected' : ''}`}
                                                        onClick={() => updateItemData({
                                                            iconId: item.id,
                                                            imageUrl: getIconUrl(item.id, 'items')
                                                        })}
                                                    >
                                                        <img
                                                            src={getIconUrl(item.id, 'items')}
                                                            alt={item.name}
                                                            className="wow-item-icon"
                                                        />
                                                        <span className="wow-icon-name">{item.name}</span>
                                                    </button>
                                                ));
                                            })()}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <div className="wow-custom-url-section">
                            <h4 className="wow-section-title">Custom Image URL</h4>
                            <input
                                type="text"
                                value={itemData.imageUrl || ''}
                                onChange={(e) => updateItemData({ imageUrl: e.target.value })}
                                placeholder="Enter custom image URL..."
                                className="wow-input"
                            />
                        </div>
                        <div className="wow-preview-section">
                            <h4 className="wow-section-title">Preview</h4>
                            <div className="wow-item-preview">
                                <img
                                    src={itemData.imageUrl || (itemData.iconId ? getIconUrl(itemData.iconId, 'items') : DEFAULT_ITEM_IMAGE)}
                                    alt="Item Preview"
                                    className="wow-preview-image"
                                    onError={(e) => {
                                        e.target.src = DEFAULT_ITEM_IMAGE;
                                    }}
                                />
                            </div>
                        </div>
                    </>
                );
};

export default StepAppearance;
