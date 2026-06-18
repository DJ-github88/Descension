import React from 'react';
import { ITEM_TYPES } from '../itemWizardConfig';
import { getIconUrl } from '../../../utils/assetManager';

const StepItemType = ({ itemData, updateItemData }) => {
                return (
                    <>
                        <h3 className="wow-heading quality-text">Choose Item Type</h3>
                        <div className="item-type-grid">
                            {Object.keys(ITEM_TYPES).map(type => (
                                <button
                                    key={type}
                                    className={`type-button ${itemData.type === type ? 'selected' : ''}`}
                                    onClick={() => updateItemData({
                                        type,
                                        subtype: type === 'consumable' ? 'potion' : '',
                                        slots: [],
                                        consumableType: type === 'consumable' ? 'POTION' : undefined,
                                        // Ensure weaponStats exists when selecting weapon type
                                        ...(type === 'weapon' && {
                                            weaponStats: itemData.weaponStats || {
                                                baseDamage: {
                                                    diceCount: 1,
                                                    diceType: 'd6',
                                                    damageType: 'slashing',
                                                    bonusDamage: 0,
                                                    bonusDamageType: ''
                                                }
                                            }
                                        }),
                                        // Clear combat/stats when switching to miscellaneous since they don't apply
                                        ...(type === 'miscellaneous' && {
                                            weaponStats: undefined,
                                            combatStats: {
                                                healthRestore: { value: 0, isPercentage: false },
                                                manaRestore: { value: 0, isPercentage: false },
                                                apRestore: { value: 0, isPercentage: false },
                                                piercingDamage: { value: 0, isPercentage: false },
                                                bludgeoningDamage: { value: 0, isPercentage: false },
                                                slashingDamage: { value: 0, isPercentage: false },
                                                healingReceived: { value: 0, isPercentage: false },
                                                healingPower: { value: 0, isPercentage: false },
                                                maxAP: { value: 0, isPercentage: false },
                                                maxHealth: { value: 0, isPercentage: false },
                                                healthRegen: { value: 0, isPercentage: false },
                                                maxMana: { value: 0, isPercentage: false },
                                                manaRegen: { value: 0, isPercentage: false },
                                                initiative: { value: 0, isPercentage: false },
                                                armor: { value: 0, isPercentage: false },
                                                spellDamage: { types: {} },
                                                resistances: {},
                                                onHitEffects: {
                                                    enabled: false,
                                                    procType: 'dice',
                                                    procChance: 15,
                                                    diceThreshold: 18,
                                                    cardProcRule: 'face_cards',
                                                    coinProcRule: 'all_heads',
                                                    coinCount: 3,
                                                    procSuit: 'hearts',
                                                    spellEffect: null,
                                                    customEffects: [],
                                                    useRollableTable: false
                                                }
                                            },
                                            utilityStats: undefined,
                                            effects: undefined,
                                            baseStats: {
                                                constitution: { value: 0, isPercentage: false },
                                                strength: { value: 0, isPercentage: false },
                                                agility: { value: 0, isPercentage: false },
                                                intelligence: { value: 0, isPercentage: false },
                                                spirit: { value: 0, isPercentage: false },
                                                charisma: { value: 0, isPercentage: false }
                                            }
                                        })
                                    })}
                                >
                                    <img src={getIconUrl(ITEM_TYPES[type].icon, 'items')} alt={ITEM_TYPES[type].name} />
                                    <span className="wow-text">{ITEM_TYPES[type].name}</span>
                                </button>
                            ))}
                        </div>
                    </>
                );
};

export default StepItemType;
