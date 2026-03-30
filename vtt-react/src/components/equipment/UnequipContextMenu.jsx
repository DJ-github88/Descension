import React from 'react';
import { getSlotDisplayName, getEquipSlotDisplayName } from '../../utils/equipmentUtils';
import '../../styles/unified-context-menu.css';

/**
 * Context menu for unequipping items from equipment slots
 */
const UnequipContextMenu = ({ x, y, item, slotName, onClose, onUnequip }) => {
    if (!item) return null;

    return (
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
    );
};

export default UnequipContextMenu;
