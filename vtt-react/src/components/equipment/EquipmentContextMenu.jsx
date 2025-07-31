import React from 'react';
import { getCompatibleSlots, getSlotDisplayName, validateEquipment } from '../../utils/equipmentUtils';
import useCharacterStore from '../../store/characterStore';
import '../../styles/context-menu.css';

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
                    <i className="fas fa-exclamation-triangle"></i>
                    Cannot Equip
                </div>
                <div className="context-menu-message">
                    {blockedReason}
                </div>
                <button
                    className="context-menu-item"
                    onClick={onClose}
                >
                    <i className="fas fa-times"></i>
                    Close
                </button>
            </div>
        );
    }

    // If only one valid slot, show direct equip option
    if (validSlots.length === 1) {
        const slotName = validSlots[0];
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
                    <i className="fas fa-exclamation-triangle"></i>
                    Cannot Equip
                </div>
                <div className="context-menu-message">
                    This item cannot be equipped to any slot.
                </div>
                <button 
                    className="context-menu-item"
                    onClick={onClose}
                >
                    <i className="fas fa-times"></i>
                    Close
                </button>
            </div>
        );
    }

    // If only one compatible slot, show direct equip option
    if (compatibleSlots.length === 1) {
        const slotName = compatibleSlots[0];
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
                    Equip Item
                </div>
                <button 
                    className="context-menu-item primary-action"
                    onClick={() => {
                        onEquip(slotName);
                        onClose();
                    }}
                >
                    <i className="fas fa-arrow-right"></i>
                    Equip to {getSlotDisplayName(slotName)}
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
    }

    // Multiple compatible slots - show selection menu
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
                Choose Equipment Slot
            </div>
            <div className="context-menu-section">
                {validSlots.map(slotName => (
                    <button 
                        key={slotName}
                        className="context-menu-item"
                        onClick={() => {
                            onEquip(slotName);
                            onClose();
                        }}
                    >
                        <i className="fas fa-arrow-right"></i>
                        Equip to {getSlotDisplayName(slotName)}
                    </button>
                ))}
            </div>
            <div className="context-menu-section">
                <button 
                    className="context-menu-item"
                    onClick={onClose}
                >
                    <i className="fas fa-times"></i>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default EquipmentContextMenu;
