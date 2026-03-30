import React from 'react';
import { getCompatibleSlots, getSlotDisplayName, getEquipSlotDisplayName, validateEquipment } from '../../utils/equipmentUtils';
import useCharacterStore from '../../store/characterStore';
import '../../styles/unified-context-menu.css';

/**
 * Context menu for equipping items from inventory
 */
const EquipmentContextMenu = ({ x, y, item, onClose, onEquip }) => {
    // Get current equipment state for validation (hook must be called before early return)
    const { equipment } = useCharacterStore(state => ({
        equipment: state.equipment
    }));

    if (!item) return null;
    const compatibleSlots = getCompatibleSlots(item);

    // Filter slots based on current equipment state (e.g., two-handed weapon conflicts)
    const validSlots = compatibleSlots.filter(slotName => {
        const validation = validateEquipment(item, slotName, equipment);
        return validation.isValid;
    });

    // If no valid slots, show appropriate message
    if (validSlots.length === 0) {
        // Check if there are compatible slots but they're blocked
        const hasBlockedSlots = compatibleSlots.length > 0;
        const blockedReason = hasBlockedSlots ?
            validateEquipment(item, compatibleSlots[0], equipment).reason :
            'This item cannot be equipped to any slot.';

        return (
            <div
                className="unified-context-menu"
                style={{
                    position: 'fixed',
                    left: x,
                    top: y,
                    zIndex: 10001
                }}
                onClick={e => e.stopPropagation()}
            >
                <div className="context-menu-main">
                    <div className="context-menu-group">
                        <div className="group-header">
                            <i className="fas fa-exclamation-triangle"></i>
                            <span>Cannot Equip</span>
                        </div>
                        <div style={{ padding: '8px 16px', color: '#666', fontSize: '12px', fontStyle: 'italic' }}>
                            {blockedReason}
                        </div>
                    </div>
                    <button
                        className="context-menu-button"
                        onClick={onClose}
                    >
                        <i className="fas fa-times"></i>
                        Close
                    </button>
                </div>
            </div>
        );
    }

    // If only one valid slot, show direct equip option
    if (validSlots.length === 1) {
        const slotName = validSlots[0];
        return (
            <div
                className="unified-context-menu"
                style={{
                    position: 'fixed',
                    left: x,
                    top: y,
                    zIndex: 10001
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
                            <button
                                className="context-menu-button"
                                onClick={() => {
                                    onEquip(slotName);
                                    onClose();
                                }}
                            >
                                <i className="fas fa-arrow-right"></i>
                                Equip to {getEquipSlotDisplayName(slotName, item)}
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
    }

    // Multiple compatible slots - show selection menu
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
                        <span>Equipment Slots</span>
                        <i className="fas fa-chevron-right"></i>
                    </div>
                    <div className="submenu">
                        {validSlots.map(slotName => (
                            <button
                                key={slotName}
                                className="context-menu-button"
                                onClick={() => {
                                    onEquip(slotName);
                                    onClose();
                                }}
                            >
                                <i className="fas fa-arrow-right"></i>
                                Equip to {getEquipSlotDisplayName(slotName, item)}
                            </button>
                        ))}
                        <div className="context-menu-separator"></div>
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

export default EquipmentContextMenu;
