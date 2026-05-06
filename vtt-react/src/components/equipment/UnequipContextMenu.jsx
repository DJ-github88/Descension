import React, { useState } from 'react';
import { getEquipSlotDisplayName } from '../../utils/equipmentUtils';
import useItemStore from '../../store/itemStore';
import DurabilityAdjustModal from '../item-generation/DurabilityAdjustModal';
import '../../styles/unified-context-menu.css';

const UnequipContextMenu = ({ x, y, item, slotName, onClose, onUnequip }) => {
    const [showDurabilityModal, setShowDurabilityModal] = useState(false);
    const updateItemDurability = useItemStore(state => state.updateItemDurability);

    if (!item) return null;

    const hasDurability = ['weapon', 'armor', 'accessory'].includes(item.type) && item.maxDurability != null;

    return (
        <>
            <div
                className="unified-context-menu"
                style={{
                    left: x,
                    top: y
                }}
                onClick={e => e.stopPropagation()}
            >
                <div className="context-menu-main">
                    <div className="context-menu-group">
                        <div className="group-header">
                            <i className="fas fa-shield-alt"></i>
                            <span>Equipment Actions</span>
                            <i className="fas fa-chevron-right"></i>
                        </div>
                        <div className="submenu">
                            <div style={{ padding: '8px 16px', color: '#666', fontSize: '12px', fontStyle: 'italic', borderBottom: '1px solid #d5cbb0', marginBottom: '4px' }}>
                                {item.name} - Currently equipped in {getEquipSlotDisplayName(slotName, item)}
                            </div>
                            <button
                                className="context-menu-button"
                                onClick={() => {
                                    onUnequip(slotName);
                                    onClose();
                                }}
                            >
                                <i className="fas fa-arrow-left"></i>
                                Unequip to Inventory
                            </button>
                            {hasDurability && (
                                <button
                                    className="context-menu-button"
                                    onClick={() => setShowDurabilityModal(true)}
                                    style={{ color: item.durability === 0 ? '#ff4444' : (item.durability ?? item.maxDurability) / item.maxDurability <= 0.25 ? '#ff8844' : (item.durability ?? item.maxDurability) / item.maxDurability <= 0.50 ? '#ffaa00' : 'inherit' }}
                                >
                                    <i className="fas fa-shield-alt"></i>
                                    Durability: {item.durability ?? item.maxDurability}/{item.maxDurability}
                                </button>
                            )}
                            <button
                                className="context-menu-button"
                                onClick={onClose}
                            >
                                <i className="fas fa-times"></i>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showDurabilityModal && item && (
                <DurabilityAdjustModal
                    visible={showDurabilityModal}
                    item={item}
                    onClose={() => {
                        setShowDurabilityModal(false);
                        onClose();
                    }}
                    onDurabilityChange={(itemId, newDurability) => {
                        updateItemDurability(itemId, newDurability);
                    }}
                />
            )}
        </>
    );
};

export default UnequipContextMenu;
