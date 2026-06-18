import React from 'react';
import { WEAPON_SLOTS, HAND_OPTIONS, WEAPON_SUBTYPES, OFF_HAND_TYPES, ARMOR_QUALITIES, EQUIPMENT_SLOTS, CONSUMABLE_TYPES, MISC_TYPES } from '../itemWizardConfig';
import { getIconUrl } from '../../../utils/assetManager';
import { CURRENCY_TYPES } from '../itemConstants';

const StepSlotAndSize = ({ itemData, updateItemData }) => {
                return (
                    <>
                        <h3>Equipment Slot</h3>

                        {itemData.type === 'weapon' && (
                            <>
                                <div className="slot-selection">
                                    <h4>Weapon Type</h4>
                                    <div className="slot-options">
                                        {Object.entries(WEAPON_SLOTS).map(([slot, data]) => (
                                            <div
                                                key={slot}
                                                className={`slot-option ${itemData.weaponSlot === slot ? 'selected' : ''}`}
                                                onClick={() => updateItemData({
                                                    weaponSlot: slot,
                                                    hand: null,
                                                    subtype: null
                                                })}
                                            >
                                                <img
                                                    src={getIconUrl(data.icon, 'items')}
                                                    alt={data.name}
                                                    onError={(e) => {
                                                        e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                                                    }}
                                                />
                                                <span>{data.name}</span>
                                                <p className="slot-description">{data.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {itemData.weaponSlot === 'ONE_HANDED' && (
                                    <div className="hand-selection">
                                        <h4>Hand Selection</h4>
                                        <div className="hand-options">
                                            {Object.entries(HAND_OPTIONS).map(([hand, data]) => (
                                                <div
                                                    key={hand}
                                                    className={`hand-option ${itemData.hand === hand ? 'selected' : ''}`}
                                                    onClick={() => updateItemData({ hand })}
                                                >
                                                    <img
                                                        src={getIconUrl(data.icon, 'items')}
                                                        alt={data.name}
                                                        onError={(e) => {
                                                            e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                                                        }}
                                                    />
                                                    <span>{data.name}</span>
                                                    <p className="hand-description">{data.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {itemData.weaponSlot && (itemData.weaponSlot === 'MAIN_HAND' || itemData.weaponSlot === 'OFF_HAND' || itemData.weaponSlot === 'TWO_HANDED' || itemData.weaponSlot === 'RANGED' || (itemData.weaponSlot === 'ONE_HANDED' && itemData.hand)) && (
                                    <div className="subtype-selection">
                                        <h4>Weapon Subtype</h4>
                                        <div className="subtype-options">
                                            {Object.entries(WEAPON_SUBTYPES)
                                                .filter(([_, data]) => data.slot === itemData.weaponSlot)
                                                .map(([type, data]) => (
                                                    <div
                                                        key={type}
                                                        className={`subtype-option ${itemData.subtype === type ? 'selected' : ''}`}
                                                        onClick={() => updateItemData({ subtype: type })}
                                                    >
                                                        <img
                                                            src={getIconUrl(data.icon, 'items')}
                                                            alt={data.name}
                                                            onError={(e) => {
                                                                e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                                                            }}
                                                        />
                                                        <span>{data.name}</span>
                                                        <p className="subtype-description">{data.description}</p>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Other item types slot selection */}
                        {itemData.type !== 'weapon' && (
                            <>
                                <div className="slot-selection">
                                    <div className="slot-options">
                                        {Object.entries(EQUIPMENT_SLOTS)
                                            .filter(([_, data]) => {
                                                switch (itemData.type) {
                                                    case 'armor':
                                                        return data.type === 'armor';
                                                    case 'accessory':
                                                        return data.type === 'accessory';
                                                    case 'clothing':
                                                        return data.type === 'clothing';
                                                    default:
                                                        return false;
                                                }
                                            })
                                            .map(([slot, data]) => (
                                                <div
                                                    key={slot}
                                                    className={`slot-option ${itemData.slots?.includes(slot) ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        const quality = itemData.quality;
                                                        const updates = {
                                                            slots: [slot],
                                                            quality
                                                        };

                                                        // Set default off-hand type if selecting off_hand slot
                                                        if (slot === 'off_hand') {
                                                            updates.offHandType = 'SHIELD';
                                                        }

                                                        updateItemData(updates);
                                                    }}
                                                >
                                                    <img
                                                        src={getIconUrl(data.icon, 'items')}
                                                        alt={data.info}
                                                        onError={(e) => {
                                                            e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                                                        }}
                                                    />
                                                    <span>{data.info}</span>
                                                    <p className="slot-description">{data.description}</p>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {itemData.type === 'armor' && itemData.slots && itemData.slots.length > 0 && !itemData.slots.includes('off_hand') && (
                                    <div className="quality-selection">
                                        <h4>Armor Type</h4>
                                        <div className="quality-options">
                                            {Object.entries(ARMOR_QUALITIES).map(([quality, data]) => (
                                                <div
                                                    key={quality}
                                                    className={`quality-option ${itemData.subtype === quality ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        updateItemData({
                                                            subtype: quality
                                                        });
                                                    }}
                                                >
                                                    <img
                                                        src={getIconUrl(data.icon, 'items')}
                                                        alt={data.name}
                                                        onError={(e) => {
                                                            e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                                                        }}
                                                    />
                                                    <span>{data.name}</span>
                                                    <p className="quality-description">{data.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {itemData.type === 'armor' && itemData.slots && itemData.slots.includes('off_hand') && (
                                    <div className="quality-selection">
                                        <h4>Off-hand Type</h4>
                                        <div className="quality-options">
                                            {Object.entries(OFF_HAND_TYPES).map(([type, data]) => (
                                                <div
                                                    key={type}
                                                    className={`quality-option ${itemData.offHandType === type ? 'selected' : ''}`}
                                                    onClick={() => updateItemData({ offHandType: type })}
                                                >
                                                    <img
                                                        src={getIconUrl(data.icon, 'items')}
                                                        alt={data.name}
                                                        onError={(e) => {
                                                            e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                                                        }}
                                                    />
                                                    <span>{data.name}</span>
                                                    <p className="quality-description">{data.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {itemData.type === 'consumable' && (
                                    <div className="quality-selection">
                                        <h4>Consumable Type</h4>
                                        <div className="quality-options">
                                            {Object.entries(CONSUMABLE_TYPES).map(([type, data]) => (
                                                <div
                                                    key={type}
                                                    className={`quality-option ${itemData.consumableType === type ? 'selected' : ''}`}
                                                    onClick={() => updateItemData({
                                                        consumableType: type,
                                                        subtype: data.name.toLowerCase()
                                                    })}
                                                >
                                                    <img
                                                        src={getIconUrl(data.icon, 'items')}
                                                        alt={data.name}
                                                        onError={(e) => {
                                                            e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                                                        }}
                                                    />
                                                    <span>{data.name}</span>
                                                    <p className="quality-description">{data.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {itemData.type === 'miscellaneous' && (
                                    <div className="quality-selection">
                                        <h4>Item Category</h4>
                                        <div className="quality-options">
                                            {Object.entries(MISC_TYPES).map(([type, data]) => (
                                                <div
                                                    key={type}
                                                    className={`quality-option ${itemData.subtype === type ? 'selected' : ''}`}
                                                    onClick={() => updateItemData({ subtype: type })}
                                                >
                                                    <img
                                                        src={getIconUrl(data.icon, 'items')}
                                                        alt={data.name}
                                                        onError={(e) => {
                                                            e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                                                        }}
                                                    />
                                                    <span>{data.name}</span>
                                                    <p className="quality-description">{data.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {itemData.type === 'currency' && (
                                    <div className="quality-selection">
                                        <h4>Currency Type</h4>
                                        <div className="quality-options">
                                            {Object.entries(CURRENCY_TYPES).map(([type, data]) => (
                                                <div
                                                    key={type}
                                                    className={`quality-option ${itemData.subtype === type ? 'selected' : ''}`}
                                                    onClick={() => updateItemData({
                                                        subtype: type,
                                                        name: data.name,
                                                        description: data.description,
                                                        iconId: data.icon,
                                                        currencyType: data.type,
                                                        currencyValue: data.value
                                                    })}
                                                >
                                                    <img
                                                        src={getIconUrl(data.icon, 'items')}
                                                        alt={data.name}
                                                        onError={(e) => {
                                                            e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                                                        }}
                                                    />
                                                    <span>{data.name}</span>
                                                    <p className="quality-description">{data.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                );
};

export default StepSlotAndSize;
