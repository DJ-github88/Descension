import React, { useEffect, useRef, useState } from 'react';
import { getCompatibleSlots, getEquipSlotDisplayName, validateEquipment } from '../../utils/equipmentUtils';
import useCharacterStore from '../../store/characterStore';
import useItemStore from '../../store/itemStore';
import DurabilityAdjustModal from '../item-generation/DurabilityAdjustModal';
import '../../styles/unified-context-menu.css';

const EquipmentContextMenu = ({ x, y, item, onClose, onEquip }) => {
    const menuRef = useRef(null);
    const [showDurabilityModal, setShowDurabilityModal] = useState(false);
    const updateItemDurability = useItemStore(state => state.updateItemDurability);

    const { equipment } = useCharacterStore(state => ({
        equipment: state.equipment
    }));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [onClose]);

    if (!item) return null;
    const compatibleSlots = getCompatibleSlots(item);

    const validSlots = compatibleSlots.filter(slotName => {
        const validation = validateEquipment(item, slotName, equipment);
        return validation.isValid;
    });

    let content = null;

    const durabilityButton = item && ['weapon', 'armor', 'accessory'].includes(item.type) && item.maxDurability != null ? (
        <button
            key="durability-btn"
            className="context-menu-button"
            onClick={() => setShowDurabilityModal(true)}
            style={{ color: item.durability === 0 ? '#ff4444' : (item.durability ?? item.maxDurability) / item.maxDurability <= 0.25 ? '#ff8844' : (item.durability ?? item.maxDurability) / item.maxDurability <= 0.50 ? '#ffaa00' : 'inherit' }}
        >
            <i className="fas fa-shield-alt"></i>
            Durability: {item.durability ?? item.maxDurability}/{item.maxDurability}
        </button>
    ) : null;

    const cancelButton = (
        <button
            key="cancel-btn"
            className="context-menu-button"
            onClick={onClose}
        >
            <i className="fas fa-times"></i>
            Cancel
        </button>
    );

    if (validSlots.length === 0) {
        const hasBlockedSlots = compatibleSlots.length > 0;
        const blockedReason = hasBlockedSlots ?
            validateEquipment(item, compatibleSlots[0], equipment).reason :
            'This item cannot be equipped to any slot.';

        content = (
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
                {durabilityButton}
                {cancelButton}
            </div>
        );
    } else if (validSlots.length === 1) {
        const slotName = validSlots[0];
        content = (
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
                        {durabilityButton}
                        {cancelButton}
                    </div>
                </div>
            </div>
        );
    } else {
        content = (
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
                        {durabilityButton}
                        {cancelButton}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div
                ref={menuRef}
                className="unified-context-menu"
                style={{
                    position: 'fixed',
                    left: x,
                    top: y,
                    zIndex: 10001
                }}
                onClick={e => e.stopPropagation()}
            >
                {content}
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

export default EquipmentContextMenu;
