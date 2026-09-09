import React from 'react';
import PropTypes from 'prop-types';
import { getIconUrl } from '../../utils/assetManager';
import { RARITY_COLORS } from '../../constants/itemConstants';
import ActionFanOutMenu from './ActionFanOutMenu';
import './EquipmentActionSlot.css';

const DEFAULT_SLOT_ICONS = {
    mainHand: getIconUrl('Armor/Neck/magical-sword-pendant', 'items'),
    offHand: getIconUrl('Weapons/Shields/shield-heater-wooden-brown-worn-cracks-beige-boss', 'items'),
    ranged: getIconUrl('Weapons/Bows/bow-simple-brown-tan-grip', 'items')
};

const SLOT_LABELS = {
    mainHand: 'MH',
    offHand: 'OH',
    ranged: 'RNG'
};

const EquipmentActionSlot = ({
    slotName,
    item,
    actions = [],
    isOpen = false,
    isDisabled = false,
    onToggleOpen,
    onActionClick,
    onActionMouseEnter,
    onActionMouseLeave,
    onActionMouseMove,
    onSlotMouseEnter,
    onSlotMouseLeave,
    onSlotMouseMove
}) => {
    const isEmpty = !item;
    const slotLabel = SLOT_LABELS[slotName] || slotName;

    // Determine rarity border
    const quality = item?.quality || item?.rarity || 'common';
    const rarityBorderColor = item ? (RARITY_COLORS[quality.toLowerCase()]?.border || '#8B4513') : null;

    // Check if shield and get durability
    const isShield = item && (
        item.subtype?.toLowerCase().includes('shield') ||
        item.subtype?.toLowerCase().includes('buckler') ||
        item.name?.toLowerCase().includes('shield')
    );

    const durability = isShield ? (item.durability?.current ?? item.currentDurability ?? item.stats?.durability ?? 5) : null;
    const maxDurability = isShield ? (item.durability?.max ?? item.maxDurability ?? 5) : null;

    const getItemImageSrc = () => {
        if (!item) {
            return DEFAULT_SLOT_ICONS[slotName] || getIconUrl('inv_misc_questionmark', 'items', true);
        }
        if (item.imageUrl) return item.imageUrl;
        if (item.icon) return getIconUrl(item.icon, 'items');
        if (item.iconId) return getIconUrl(item.iconId, 'items');
        return DEFAULT_SLOT_ICONS[slotName];
    };

    return (
        <div className={`equipment-action-slot-wrapper slot-${slotName}`}>
            {/* Elevated Equipment Slot */}
            <div
                className={`equipment-action-slot ${isEmpty ? 'empty' : 'equipped'} ${isDisabled ? 'disabled' : ''} ${isOpen ? 'active-open' : ''}`}
                style={rarityBorderColor && !isEmpty ? { borderColor: rarityBorderColor } : undefined}
                onClick={(e) => {
                    e.stopPropagation();
                    if (!isDisabled && onToggleOpen) {
                        onToggleOpen(slotName);
                    }
                }}
                onMouseEnter={(e) => {
                    if (onSlotMouseEnter) {
                        onSlotMouseEnter(e, item, slotName);
                    }
                }}
                onMouseMove={(e) => {
                    if (onSlotMouseMove) {
                        onSlotMouseMove(e);
                    }
                }}
                onMouseLeave={(e) => {
                    if (onSlotMouseLeave) {
                        onSlotMouseLeave();
                    }
                }}
            >
                <div className="equipment-slot-img-wrap">
                    <img
                        src={getItemImageSrc()}
                        alt={item?.name || slotName}
                        style={{ opacity: isEmpty ? 0.45 : isDisabled ? 0.3 : 1 }}
                        onError={(e) => {
                            e.target.src = DEFAULT_SLOT_ICONS[slotName] || getIconUrl('inv_misc_questionmark', 'items', true);
                        }}
                    />
                </div>

                {/* Disabled Overlay (e.g. 2-Handed weapon equipped in MH) */}
                {isDisabled && (
                    <div className="disabled-cross-overlay">
                        <div className="cross-bar bar-1" />
                        <div className="cross-bar bar-2" />
                    </div>
                )}

                {/* Shield Durability Badge */}
                {isShield && durability !== null && !isDisabled && (
                    <div className="shield-durability-pill">
                        🛡️ {durability}/{maxDurability}
                    </div>
                )}

                {/* Action Count Pip */}
                {!isDisabled && actions.length > 0 && (
                    <div className="action-count-indicator">
                        {actions.length}
                    </div>
                )}
            </div>

            {/* Radial Fan-Out Popout Menu */}
            <ActionFanOutMenu
                actions={actions}
                isOpen={isOpen && !isDisabled}
                slotType={slotName}
                onActionClick={onActionClick}
                onActionMouseEnter={onActionMouseEnter}
                onActionMouseLeave={onActionMouseLeave}
                onActionMouseMove={onActionMouseMove}
            />
        </div>
    );
};

EquipmentActionSlot.propTypes = {
    slotName: PropTypes.string.isRequired,
    item: PropTypes.object,
    actions: PropTypes.array,
    isOpen: PropTypes.bool,
    isDisabled: PropTypes.bool,
    onToggleOpen: PropTypes.func,
    onActionClick: PropTypes.func,
    onActionMouseEnter: PropTypes.func,
    onActionMouseLeave: PropTypes.func,
    onActionMouseMove: PropTypes.func,
    onSlotMouseEnter: PropTypes.func,
    onSlotMouseLeave: PropTypes.func,
    onSlotMouseMove: PropTypes.func
};

export default EquipmentActionSlot;
