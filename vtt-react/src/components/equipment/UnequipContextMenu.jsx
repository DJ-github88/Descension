import React from 'react';
import { getSlotDisplayName } from '../../utils/equipmentUtils';
import '../../styles/context-menu.css';

/**
 * Context menu for unequipping items from equipment slots
 */
const UnequipContextMenu = ({ x, y, item, slotName, onClose, onUnequip }) => {
    if (!item) return null;

    return (
        <div
            className="equipment-context-menu"
            style={{
                position: 'fixed',
                left: x,
                top: y,
                zIndex: 10001
            }}
            onClick={e => e.stopPropagation()}
        >
            <div className="context-menu-header">
                <i className="fas fa-shield-alt"></i>
                {item.name}
            </div>
            <div className="context-menu-info">
                Currently equipped in {getSlotDisplayName(slotName)}
            </div>
            <button 
                className="context-menu-item primary-action"
                onClick={() => {
                    onUnequip(slotName);
                    onClose();
                }}
            >
                <i className="fas fa-arrow-left"></i>
                Unequip to Inventory
            </button>
            <button 
                className="context-menu-item"
                onClick={onClose}
            >
                <i className="fas fa-times"></i>
                Cancel
            </button>
        </div>
    );
};

export default UnequipContextMenu;
