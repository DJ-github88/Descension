import React from 'react';
import '../../styles/item-tooltip.css';
import { RARITY_COLORS } from '../../constants/itemConstants';
import useCraftingStore, { SKILL_LEVELS } from '../../store/craftingStore';
import useItemStore from '../../store/itemStore';

const getQualityColor = (quality) => {
    // Check for null or undefined and provide a default
    const qualityValue = quality || 'common';
    const qualityLower = qualityValue.toLowerCase();
    return RARITY_COLORS[qualityLower]?.text || RARITY_COLORS.common.text;
};

const formatCurrency = (value) => {
    if (!value) return '0c';

    const { gold = 0, silver = 0, copper = 0 } = value;
    const parts = [];

    if (gold > 0) parts.push(`${gold}g`);
    if (silver > 0) parts.push(`${silver}s`);
    if (copper > 0) parts.push(`${copper}c`);

    return parts.join(' ') || '0c';
};

const getMiscTypeInfo = (item) => {
    if (!item || !item.subtype) {
        // Fallback for miscellaneous items without subtype
        return [
            item.description && {
                text: `"${item.description}"`,
                className: 'item-description',
                italic: true,
                color: '#9d9d9d'
            }
        ].filter(Boolean);
    }

    switch (item.subtype) {
        case 'QUEST':
            return [
                {
                    component: 'quest-details',
                    items: [
                        item.questGiver && {
                            label: 'Quest Giver',
                            value: item.questGiver,
                            className: 'quest-detail-value'
                        },
                        (item.questObjectives || item.questObjective) && {
                            label: 'Objectives',
                            value: item.questObjectives || item.questObjective,
                            className: 'quest-detail-value'
                        },
                        item.questReward && {
                            label: 'Reward',
                            value: item.questReward,
                            className: 'quest-detail-value'
                        },
                        item.questChain && {
                            label: 'Part of',
                            value: item.questChain,
                            className: 'quest-detail-value'
                        },
                        item.timeLimit > 0 && {
                            label: 'Time Limit',
                            value: `${item.timeLimit} minutes`,
                            className: 'quest-detail-value'
                        }
                    ].filter(Boolean)
                },
                item.description && {
                    text: `"${item.description}"`,
                    className: 'item-description',
                    italic: true,
                    color: '#9d9d9d'
                }
            ].filter(Boolean);









        case 'REAGENT':
            return [
                {
                    component: 'reagent-details',
                    items: [
                        item.reagentType && {
                            label: 'Type',
                            value: item.reagentType.charAt(0).toUpperCase() + item.reagentType.slice(1),
                            className: 'reagent-detail-value'
                        },
                        item.magicType && {
                            label: 'Magic',
                            value: getMagicTypeName(item.magicType),
                            className: 'reagent-detail-value magic-type',
                            color: getMagicTypeColor(item.magicType)
                        },
                        item.reagentState && {
                            label: 'State',
                            value: item.reagentState.charAt(0).toUpperCase() + item.reagentState.slice(1),
                            className: 'reagent-detail-value'
                        },
                        item.requiredFor && {
                            label: 'Required For',
                            value: item.requiredFor,
                            className: 'reagent-detail-value'
                        },
                        item.quantityPerUse && {
                            label: 'Quantity Per Cast',
                            value: item.quantityPerUse,
                            className: 'reagent-detail-value'
                        },
                        item.preservationMethod && {
                            label: 'Preservation',
                            value: getPreservationName(item.preservationMethod),
                            className: 'reagent-detail-value'
                        },
                        item.magicalProperties && {
                            label: 'Properties',
                            value: item.magicalProperties,
                            className: 'reagent-detail-value'
                        },
                        item.source && {
                            label: 'Source',
                            value: item.source,
                            className: 'reagent-detail-value'
                        }
                    ].filter(Boolean)
                },
                item.description && {
                    text: `"${item.description}"`,
                    className: 'item-description',
                    italic: true,
                    color: '#9d9d9d'
                }
            ].filter(Boolean);

        case 'CRAFTING':
            console.log('CRAFTING tooltip data:', item);
            const craftingItems = [
                item.materialType && {
                    label: 'Material',
                    value: getMaterialTypeName(item.materialType),
                    className: 'crafting-detail-value'
                },
                item.professions?.length > 0 && {
                    label: 'Professions',
                    value: item.professions.join(', '),
                    className: 'crafting-detail-value'
                },
                item.gatheringMethod && {
                    label: 'Gathering',
                    value: getGatheringMethodName(item.gatheringMethod),
                    className: 'crafting-detail-value'
                },
                item.recipes && {
                    label: 'Used In',
                    value: item.recipes,
                    className: 'crafting-detail-value'
                },
                item.sourceLocations && {
                    label: 'Source',
                    value: item.sourceLocations,
                    className: 'crafting-detail-value'
                },
                item.specialProperties && {
                    label: 'Properties',
                    value: item.specialProperties,
                    className: 'crafting-detail-value'
                }
            ].filter(Boolean);
            console.log('CRAFTING items for grid:', craftingItems);
            return [
                {
                    component: 'crafting-details',
                    items: craftingItems
                },
                item.description && {
                    text: `"${item.description}"`,
                    className: 'item-description',
                    italic: true,
                    color: '#9d9d9d'
                }
            ].filter(Boolean);

        case 'TRADE_GOODS':
            return [
                {
                    component: 'trade-details',
                    items: [
                        item.tradeCategory && {
                            label: 'Category',
                            value: getTradeCategory(item.tradeCategory),
                            className: 'trade-detail-value'
                        },
                        item.origin && {
                            label: 'Origin',
                            value: item.origin.charAt(0).toUpperCase() + item.origin.slice(1),
                            className: 'trade-detail-value'
                        },
                        item.demandLevel && {
                            label: 'Demand',
                            value: getDemandLevel(item.demandLevel),
                            className: 'trade-detail-value'
                        },
                        item.qualityGrade && {
                            label: 'Quality',
                            value: getQualityGrade(item.qualityGrade),
                            className: 'trade-detail-value'
                        }
                    ].filter(Boolean)
                },
                item.merchantNotes && {
                    text: `"${item.merchantNotes}"`,
                    className: 'item-merchant-notes',
                    italic: true
                },
                item.description && {
                    text: `"${item.description}"`,
                    className: 'item-description',
                    italic: true,
                    color: '#9d9d9d'
                }
            ].filter(Boolean);

        case 'KEY':
            return [
                {
                    component: 'key-details',
                    items: [
                        item.keyType && {
                            label: 'Type',
                            value: getKeyTypeName(item.keyType),
                            className: 'key-detail-value'
                        },
                        item.unlocks && {
                            label: 'Unlocks',
                            value: item.unlocks,
                            className: 'key-detail-value'
                        },
                        item.location && {
                            label: 'Location',
                            value: item.location,
                            className: 'key-detail-value'
                        },
                        item.securityLevel && {
                            label: 'Security',
                            value: getSecurityLevelName(item.securityLevel),
                            className: 'key-detail-value'
                        }
                    ].filter(Boolean)
                },
                item.oneTimeUse && {
                    text: 'Single Use Only',
                    className: 'item-warning',
                    color: '#ff4444'
                },
                item.specialInstructions && {
                    text: `"${item.specialInstructions}"`,
                    className: 'item-special-instructions',
                    italic: true
                },
                item.description && {
                    text: `"${item.description}"`,
                    className: 'item-description',
                    italic: true,
                    color: '#9d9d9d'
                }
            ].filter(Boolean);

        case 'JUNK':
            return [
                {
                    component: 'junk-details',
                    items: [
                        item.junkType && {
                            label: 'Type',
                            value: item.junkType.charAt(0).toUpperCase() + item.junkType.slice(1),
                            className: 'item-junk-detail'
                        },
                        item.condition && {
                            label: 'Condition',
                            value: item.condition.charAt(0).toUpperCase() + item.condition.slice(1),
                            className: 'item-junk-detail'
                        },
                        item.origin && {
                            label: 'Origin',
                            value: item.origin.charAt(0).toUpperCase() + item.origin.slice(1),
                            className: 'item-junk-detail'
                        },
                        item.estimatedValue && {
                            label: 'Est. Value',
                            value: item.estimatedValue,
                            className: 'item-junk-detail'
                        }
                    ].filter(Boolean)
                },
                item.description && {
                    text: `"${item.description}"`,
                    className: 'item-description',
                    italic: true,
                    color: '#9d9d9d'
                }
            ].filter(Boolean);

        case 'recipe':
            // This will be handled in the main component where hooks can be used
            return [];


        default:
            // Fallback for any unhandled subtypes
            return [
                item.description && {
                    text: `"${item.description}"`,
                    className: 'item-description',
                    italic: true,
                    color: '#9d9d9d'
                }
            ].filter(Boolean);
    }
};

const getMagicTypeName = (type) => {
    const MAGIC_TYPES = {
        fire: 'Fire Magic',
        cold: 'Cold Magic',
        lightning: 'Lightning Magic',
        acid: 'Acid Magic',
        force: 'Force Magic',
        necrotic: 'Necrotic Magic',
        radiant: 'Radiant Magic',
        poison: 'Poison Magic',
        psychic: 'Psychic Magic',
        thunder: 'Thunder Magic'
    };
    return MAGIC_TYPES[type] || (type.charAt(0).toUpperCase() + type.slice(1) + ' Magic');
};

const getMagicTypeColor = (type) => {
    const MAGIC_COLORS = {
        fire: '#ff4400',
        cold: '#3399ff',
        lightning: '#ffff00',
        acid: '#00ff00',
        force: '#ff66ff',
        necrotic: '#4B0082',
        radiant: '#FFFACD',
        poison: '#008000',
        psychic: '#FF00FF',
        thunder: '#0066ff'
    };
    return MAGIC_COLORS[type] || '#ffffff';
};

const getPreservationName = (method) => {
    const PRESERVATION_METHODS = {
        dried: 'Dried',
        fresh: 'Fresh',
        powdered: 'Powdered',
        distilled: 'Distilled',
        crystallized: 'Crystallized',
        preserved: 'Magically Preserved'
    };
    return PRESERVATION_METHODS[method] || method;
};

const getMaterialTypeName = (type) => {
    const MATERIAL_TYPES = {
        metal: 'Metal',
        wood: 'Wood',
        cloth: 'Cloth',
        leather: 'Leather',
        stone: 'Stone',
        gem: 'Gem',
        bone: 'Bone',
        hide: 'Hide',
        herb: 'Herb'
    };
    return MATERIAL_TYPES[type] || type;
};

const getGatheringMethodName = (method) => {
    const GATHERING_METHODS = {
        mining: 'Mining',
        herbalism: 'Herbalism',
        skinning: 'Skinning',
        logging: 'Logging',
        scavenging: 'Scavenging',
        fishing: 'Fishing',
        quarrying: 'Quarrying'
    };
    return GATHERING_METHODS[method] || method;
};

const getTradeCategory = (category) => {
    const TRADE_CATEGORIES = {
        textiles: 'Textiles',
        spices: 'Spices',
        metals: 'Precious Metals',
        gems: 'Gemstones',
        food: 'Food & Beverages',
        art: 'Art & Artifacts',
        exotic: 'Exotic Goods',
        luxury: 'Luxury Items'
    };
    return TRADE_CATEGORIES[category] || category;
};

const getDemandLevel = (level) => {
    const DEMAND_LEVELS = {
        low: 'Low Demand',
        moderate: 'Moderate Demand',
        high: 'High Demand',
        very_high: 'Very High Demand',
        extreme: 'Extreme Demand'
    };
    return DEMAND_LEVELS[level] || level;
};

const getQualityGrade = (grade) => {
    const QUALITY_GRADES = {
        poor: 'Poor',
        standard: 'Standard',
        fine: 'Fine',
        superior: 'Superior',
        exquisite: 'Exquisite',
        masterwork: 'Masterwork'
    };
    return QUALITY_GRADES[grade] || grade;
};

const getKeyTypeName = (keyType) => {
    const KEY_TYPES = {
        door: 'Door Key',
        chest: 'Chest Key',
        gate: 'Gate Key',
        magical: 'Magical Key',
        puzzle: 'Puzzle Key',
        portal: 'Portal Key'
    };
    return KEY_TYPES[keyType] || keyType?.charAt(0).toUpperCase() + keyType?.slice(1) || 'Unknown';
};

const getSecurityLevelName = (level) => {
    const SECURITY_LEVELS = {
        low: 'Low Security',
        moderate: 'Moderate Security',
        high: 'High Security',
        maximum: 'Maximum Security',
        magical: 'Magical Security'
    };
    return SECURITY_LEVELS[level] || level?.charAt(0).toUpperCase() + level?.slice(1) || 'Unknown';
};

const getStatDescription = (stat, value, isPercentage = false) => {
    // Format for percentage values - only add % if isPercentage is true
    const formattedValue = isPercentage ? `${value}%` : value;

    const descriptions = {
        // Resource stats
        maxHealth: `Increases your maximum health by ${formattedValue}.`,
        healthRegen: `Restores ${formattedValue} health at the end of each round.`,
        maxMana: `Increases your maximum mana by ${formattedValue}.`,
        manaRegen: `Restores ${formattedValue} mana at the end of each round.`,
        maxAP: `Increases your maximum action points by ${formattedValue}.`,

        // Combat effectiveness
        initiative: `Increases your initiative by ${formattedValue}.`,
        armorClass: `Increases your armor by ${formattedValue}.`,

        range: `Increases attack range by ${formattedValue} feet.`,

        // Healing
        healingPower: `Increases healing done by spells and effects by up to ${isPercentage ? value + '%' : formattedValue}.`,
        healingReceived: `Increases all healing received by ${value}${isPercentage ? '%' : '%'}.`,

        // Physical damage
        piercingDamage: `Increases piercing damage dealt by ${formattedValue}.`,
        bludgeoningDamage: `Increases bludgeoning damage dealt by ${formattedValue}.`,
        slashingDamage: `Increases slashing damage dealt by ${formattedValue}.`,

        // Utility stats
        swimSpeed: `Increases swim speed by ${value}${isPercentage ? '%' : ' units'}.`,
        movementSpeed: `Increases movement speed by ${value}${isPercentage ? '%' : ' units'}.`,
    };

    // For base stats, use different format
    if (['constitution', 'strength', 'agility', 'intelligence', 'spirit', 'charisma'].includes(stat)) {
        return isPercentage
            ? `Increases your ${stat} by ${value}%.`
            : `${value > 0 ? '+' : ''}${value} ${stat.charAt(0).toUpperCase() + stat.slice(1)}`;
    }

    return descriptions[stat] || `${value > 0 ? '+' : ''}${value} ${stat.replace(/([A-Z])/g, ' $1').trim()}`;
};

const getSpellDamageDescription = (type, value, isPercentage = false) => {
    // The actual text generation will be handled in the component to allow for styling
    return {
        type: type.toLowerCase(),
        value: value,
        isPercentage: isPercentage
    };
};

const renderTooltipEntry = (entry, index) => {
    if (entry.component) {
        if (entry.component === 'reagent-details') {
            return (
                <div key={index} className="reagent-details-grid">
                    {entry.items.map((detail, detailIndex) => (
                        <div key={detailIndex} className="reagent-detail-row">
                            <span className="reagent-detail-label">{detail.label}:</span>
                            {detail.className === 'reagent-detail-value magic-type' ? (
                                <span
                                    className={detail.className}
                                    style={{ color: detail.color }}
                                >
                                    {detail.value}
                                </span>
                            ) : (
                                <span className={detail.className}>{detail.value}</span>
                            )}
                        </div>
                    ))}
                </div>
            );
        }

        if (entry.component === 'quest-details') {
            return (
                <div key={index} className="quest-details-grid">
                    {entry.items.map((detail, detailIndex) => (
                        <div key={detailIndex} className="quest-detail-row">
                            <span className="quest-detail-label">{detail.label}:</span>
                            <span className={detail.className}>{detail.value}</span>
                        </div>
                    ))}
                </div>
            );
        }

        if (entry.component === 'crafting-details') {
            console.log('Rendering crafting-details with items:', entry.items);
            return (
                <div key={index} className="crafting-details-grid">
                    {entry.items.map((detail, detailIndex) => (
                        <div key={detailIndex} className="crafting-detail-row">
                            <span className="crafting-detail-label">{detail.label}:</span>
                            {detail.valueColor ? (
                                <span
                                    className={detail.className}
                                    style={{ color: detail.valueColor }}
                                >
                                    {detail.value}
                                </span>
                            ) : (
                                <span className={detail.className}>{detail.value}</span>
                            )}
                        </div>
                    ))}
                </div>
            );
        }

        if (entry.component === 'key-details') {
            return (
                <div key={index} className="key-details-grid">
                    {entry.items.map((detail, detailIndex) => (
                        <div key={detailIndex} className="key-detail-row">
                            <span className="key-detail-label">{detail.label}:</span>
                            <span className={detail.className}>{detail.value}</span>
                        </div>
                    ))}
                </div>
            );
        }



        if (entry.component === 'trade-details') {
            return (
                <div key={index} className="trade-details-grid">
                    {entry.items.map((detail, detailIndex) => (
                        <div key={detailIndex} className="trade-detail-row">
                            <span className="trade-detail-label">{detail.label}:</span>
                            <span className={detail.className}>{detail.value}</span>
                        </div>
                    ))}
                </div>
            );
        }

        if (entry.component === 'junk-details') {
            return (
                <div key={index} className="junk-details-grid">
                    {entry.items.map((detail, detailIndex) => (
                        <div key={detailIndex} className="junk-detail-row">
                            <span className="junk-detail-label">{detail.label}:</span>
                            <span className={detail.className}>{detail.value}</span>
                        </div>
                    ))}
                </div>
            );
        }

        if (entry.component === 'recipe-details') {
            return (
                <div key={index} className="recipe-details-grid">
                    {entry.items.map((detail, detailIndex) => (
                        <div key={detailIndex} className="recipe-detail-row">
                            <span className="recipe-detail-label">{detail.label}:</span>
                            <span className={detail.className} style={{ color: detail.color }}>{detail.value}</span>
                        </div>
                    ))}
                </div>
            );
        }

        if (entry.component === 'recipe-result') {
            return (
                <div key={index} className="recipe-result-section">
                    <div className="recipe-section-divider"></div>
                    {entry.items.map((detail, detailIndex) => (
                        <div key={detailIndex} className="recipe-result-row">
                            <span className="recipe-result-label">{detail.label}:</span>
                            <span className={detail.className} style={{ color: detail.color }}>{detail.value}</span>
                        </div>
                    ))}
                </div>
            );
        }

        if (entry.component === 'recipe-materials') {
            return (
                <div key={index} className="recipe-materials-section">
                    <div className="recipe-section-divider"></div>
                    <div className="recipe-materials-header">Requires</div>
                    {entry.items.map((material, materialIndex) => (
                        <div key={materialIndex} className="recipe-material-row">
                            <span className="recipe-material-name" style={{ color: material.color }}>{material.label}</span>
                            <span className="recipe-material-quantity">{material.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
    }

    return (
        <div
            key={index}
            className={entry.className}
            style={{
                color: entry.color,
                fontStyle: entry.italic ? 'italic' : 'normal'
            }}
        >
            {entry.text}
        </div>
    );
};

export default function ItemTooltip({ item }) {
    // Use hooks to get store data (hooks must be called before early returns)
    const { availableRecipes } = useCraftingStore();
    const { items: itemLibrary } = useItemStore();

    if (!item) {
        return null;
    }

    // Special handling for recipe items
    if (item.subtype === 'recipe' && item.recipeId) {
        const recipeData = availableRecipes.find(recipe => recipe.id === item.recipeId);
        const resultItem = recipeData ? itemLibrary.find(i => i.id === recipeData.resultItemId) : null;
        const skillLevel = recipeData ? Object.values(SKILL_LEVELS).find(s => s.level === recipeData.requiredLevel) : null;

        return (
            <div className="item-tooltip" data-quality={item.quality?.toLowerCase() || 'common'}>
                {/* Recipe Name */}
                <div className="item-name" style={{
                    color: getQualityColor(resultItem?.quality || item.quality),
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '8px'
                }}>
                    {item.name}
                </div>

                {/* Profession and Skill Requirements */}
                {item.requiredProfession && (
                    <div style={{ color: '#ff6b6b', fontSize: '12px', marginBottom: '8px' }}>
                        Requires {item.requiredProfession.charAt(0).toUpperCase() + item.requiredProfession.slice(1)}
                        {skillLevel && ` (${skillLevel.name})`}
                    </div>
                )}

                {/* Item Type */}
                <div style={{ color: '#ffffff', fontSize: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Miscellaneous</span>
                    <span>Recipe</span>
                </div>

                {/* Divider */}
                <div className="recipe-section-divider"></div>

                {/* Result Item Information */}
                {recipeData && resultItem && (
                    <div style={{ marginBottom: '8px' }}>
                        <div style={{
                            color: getQualityColor(resultItem.quality),
                            fontWeight: 'bold',
                            fontSize: '15px',
                            marginBottom: '4px'
                        }}>
                            {resultItem.name}
                        </div>

                        {/* Show actual item properties */}
                        {resultItem.combatStats?.healthRestore && (
                            <div style={{ color: '#00ff00', fontSize: '12px', marginBottom: '2px' }}>
                                Use: Restores {resultItem.combatStats.healthRestore.value} Health
                            </div>
                        )}

                        {resultItem.combatStats?.manaRestore && (
                            <div style={{ color: '#00ff00', fontSize: '12px', marginBottom: '2px' }}>
                                Use: Restores {resultItem.combatStats.manaRestore.value} Mana
                            </div>
                        )}

                        {/* Show buff effects */}
                        {resultItem.combatStats?.maxHealth && (
                            <div style={{ color: '#00ff00', fontSize: '12px', marginBottom: '2px' }}>
                                Use: Increases Health by {resultItem.combatStats.maxHealth.value} for{' '}
                                {resultItem.combatStats.maxHealth.duration ?
                                    `${Math.floor(resultItem.combatStats.maxHealth.duration / 60)} min` :
                                    '1 hour'
                                }
                            </div>
                        )}

                        {/* Show base stat bonuses */}
                        {resultItem.baseStats && Object.keys(resultItem.baseStats).length > 0 && (
                            <div style={{ color: '#00ff00', fontSize: '12px', marginBottom: '2px' }}>
                                Use: {Object.entries(resultItem.baseStats).map(([stat, statData]) => {
                                    const value = typeof statData === 'object' ? statData.value : statData;
                                    const duration = typeof statData === 'object' && statData.duration ?
                                        ` for ${Math.floor(statData.duration / 60)} min` : '';
                                    return `+${value} ${stat.charAt(0).toUpperCase() + stat.slice(1)}${duration}`;
                                }).join(', ')}
                            </div>
                        )}

                        {/* Stack size */}
                        {resultItem.maxStackSize && resultItem.maxStackSize > 1 && (
                            <div style={{ color: '#ffffff', fontSize: '11px', marginBottom: '2px' }}>
                                Max Stack: {resultItem.maxStackSize}
                            </div>
                        )}

                        {/* Sell price */}
                        {resultItem.value && (
                            <div style={{ color: '#ffffff', fontSize: '11px' }}>
                                Sell Price: {formatCurrency(resultItem.value)}
                            </div>
                        )}
                    </div>
                )}

                {/* Required Materials */}
                {recipeData && recipeData.materials && recipeData.materials.length > 0 && (
                    <div>
                        <div className="recipe-section-divider"></div>
                        <div style={{
                            color: '#ffd100',
                            fontWeight: 'bold',
                            fontSize: '13px',
                            marginBottom: '6px',
                            textAlign: 'left'
                        }}>
                            Requires
                        </div>
                        <div style={{ marginLeft: '8px', fontSize: '12px' }}>
                            {recipeData.materials.map((material, index) => {
                                const materialItem = itemLibrary.find(i => i.id === material.itemId);
                                return (
                                    <span key={index}>
                                        <span style={{
                                            color: getQualityColor(materialItem?.quality),
                                            fontWeight: 'normal'
                                        }}>
                                            {materialItem?.name || 'Unknown Material'} ({material.quantity})
                                        </span>
                                        {index < recipeData.materials.length - 1 && ', '}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Description - moved to bottom */}
                <div className="recipe-section-divider"></div>
                <div style={{ color: '#ffd100', fontStyle: 'italic', margin: '8px 0' }}>
                    {item.description}
                </div>

            </div>
        );
    }

    // Special handling for currency items
    if (item.isCurrency) {
        return (
            <div className="item-tooltip" style={{ padding: '12px', minWidth: '200px' }}>
                {/* Item Name */}
                <div style={{
                    color: getQualityColor(item.quality || 'common'),
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    textShadow: '1px 1px 1px rgba(0, 0, 0, 0.5)'
                }}>
                    {item.name || 'Currency'}
                </div>

                {/* Item Type */}
                <div style={{
                    color: '#9d9d9d',
                    fontSize: '14px',
                    marginBottom: '12px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                    paddingBottom: '8px'
                }}>
                    Currency
                </div>

                {/* Currency Value */}
                <div style={{ marginBottom: '12px' }}>
                    {typeof item.currencyValue === 'object' ? (
                        <>
                            {item.currencyValue.gold > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                                    <img
                                        src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_01.jpg"
                                        alt="Gold"
                                        style={{ width: '20px', height: '20px', marginRight: '8px', borderRadius: '50%', border: '1px solid rgba(255, 215, 0, 0.5)' }}
                                    />
                                    <span style={{ color: '#ffd700' }}>{item.currencyValue.gold} Gold</span>
                                </div>
                            )}
                            {item.currencyValue.silver > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                                    <img
                                        src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_03.jpg"
                                        alt="Silver"
                                        style={{ width: '20px', height: '20px', marginRight: '8px', borderRadius: '50%', border: '1px solid rgba(192, 192, 192, 0.5)' }}
                                    />
                                    <span style={{ color: '#c0c0c0' }}>{item.currencyValue.silver} Silver</span>
                                </div>
                            )}
                            {item.currencyValue.copper > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                                    <img
                                        src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_05.jpg"
                                        alt="Copper"
                                        style={{ width: '20px', height: '20px', marginRight: '8px', borderRadius: '50%', border: '1px solid rgba(205, 127, 50, 0.5)' }}
                                    />
                                    <span style={{ color: '#cd7f32' }}>{item.currencyValue.copper} Copper</span>
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                                src={`https://wow.zamimg.com/images/wow/icons/large/${item.iconId || 'inv_misc_coin_01'}.jpg`}
                                alt="Currency"
                                style={{ width: '20px', height: '20px', marginRight: '8px', borderRadius: '50%' }}
                            />
                            <span style={{ color: '#ffd700' }}>{item.currencyValue} {item.currencyType}</span>
                        </div>
                    )}
                </div>

                {/* Description - only for currency items, not miscellaneous items */}
                {item.description && (
                    <div style={{
                        color: '#1eff00',
                        fontFamily: 'Times New Roman, serif',
                        fontStyle: 'italic',
                        textShadow: '1px 1px 0 #000',
                        padding: '8px 0',
                        borderTop: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        "{item.description}"
                    </div>
                )}
            </div>
        );
    }

    // Helper to get numeric value from stat object
    const getStatValue = (stat) => {
        if (!stat) return 0;
        if (typeof stat === 'number') return stat;
        return typeof stat.value === 'number' ? stat.value : 0;
    };

    // Helper to check if a stat is percentage
    const isPercentage = (stat) => {
        if (!stat) return false;
        return stat.isPercentage === true;
    };



    // Get armor class value
    const armorClassValue = getStatValue(item.armorClass) || getStatValue(item.combatStats?.armorClass) || 0;

    // Get base stats
    const baseStats = Object.entries(item.baseStats || item.stats || {})
        .filter(([_, data]) => getStatValue(data) !== 0)
        .map(([stat, data]) => ({
            name: stat.charAt(0).toUpperCase() + stat.slice(1),
            value: getStatValue(data),
            isPercentage: isPercentage(data)
        }));

    // Get other combat stats
    const otherStats = Object.entries(item.combatStats || {})
        .filter(([stat, data]) =>
            stat !== 'resistances' &&
            stat !== 'spellDamage' &&
            stat !== 'armorClass' &&
            stat !== 'healthRestore' &&
            stat !== 'manaRestore' &&
            getStatValue(data) !== 0
        )
        .map(([stat, data]) => ({
            name: stat,
            value: getStatValue(data),
            isPercentage: isPercentage(data),
            description: getStatDescription(stat, getStatValue(data), isPercentage(data))
        }));

    // Get resistances with enhanced system
    const resistances = [];
    if (item.immunities) {
        item.immunities.forEach(type => {
            resistances.push({
                type: type.toLowerCase(),
                text: `Immune to ${type}`,
                value: 0,
                resistanceType: 'immune',
                formatted: `Immune to ${type.toLowerCase()} damage and effects.`,
                color: '#4caf50'
            });
        });
    }
    if (item.combatStats?.resistances) {
        Object.entries(item.combatStats.resistances)
            .filter(([_, data]) => data && (data.level !== undefined || data.resistant || data.immune || data.value > 0))
            .forEach(([type, data]) => {
                // Handle new resistance level system
                if (data.level !== undefined && data.level !== 100) {
                    const level = data.level;
                    const multiplier = data.multiplier || 1.0;
                    let formatted = '';
                    let resistanceType = '';

                    if (multiplier < 0) {
                        // Healing from damage
                        const healMultiplier = Math.abs(multiplier);
                        formatted = `${type.charAt(0).toUpperCase() + type.slice(1)} damage heals you for ${healMultiplier}× the damage taken, instead of damaging you.`;
                        resistanceType = 'vampiric';
                    } else if (multiplier === 0.0 || level === 0) {
                        // Immune
                        formatted = `Immune to ${type.toLowerCase()} damage and effects.`;
                        resistanceType = 'immune';
                    } else if (multiplier < 1.0) {
                        // Resistant
                        if (multiplier <= 0.5) {
                            formatted = `Highly resistant to ${type.toLowerCase()} damage, taking only ${multiplier}× the damage taken.`;
                        } else {
                            formatted = `Resistant to ${type.toLowerCase()} damage, taking ${multiplier}× the damage taken.`;
                        }
                        resistanceType = 'resistant';
                    } else if (multiplier > 1.0) {
                        // Vulnerable
                        if (multiplier >= 2.0) {
                            formatted = `Extremely vulnerable to ${type.toLowerCase()} damage, taking ${multiplier}× the damage taken.`;
                        } else if (multiplier >= 1.5) {
                            formatted = `Exposed to ${type.toLowerCase()} damage, taking ${multiplier}× the damage taken.`;
                        } else {
                            formatted = `Susceptible to ${type.toLowerCase()} damage, taking ${multiplier}× the damage taken.`;
                        }
                        resistanceType = 'vulnerable';
                    }

                    resistances.push({
                        type: type.toLowerCase(),
                        text: data.label || 'Resistance',
                        value: level,
                        resistanceType: resistanceType,
                        formatted: formatted,
                        color: data.color || '#9e9e9e'
                    });
                }
                // Handle legacy system for backwards compatibility
                else if (data.immune) {
                    resistances.push({
                        type: type.toLowerCase(),
                        text: `Immune to ${type}`,
                        value: 0,
                        resistanceType: 'immune',
                        formatted: `Immune to ${type.toLowerCase()} damage and effects.`,
                        color: '#4caf50'
                    });
                } else if (data.resistant) {
                    resistances.push({
                        type: type.toLowerCase(),
                        text: `Resistant to ${type}`,
                        value: data.value || 50,
                        resistanceType: 'resistant',
                        formatted: `Resistant to ${type.toLowerCase()} damage and effects.`,
                        color: '#8bc34a'
                    });
                } else if (data.value > 0) {
                    resistances.push({
                        type: type.toLowerCase(),
                        text: `+${data.value} ${type} Resistance`,
                        value: data.value,
                        resistanceType: 'value',
                        formatted: `Decreases ${type.toLowerCase()} damage taken by ${data.value}%.`,
                        color: '#8bc34a'
                    });
                }
            });
    }

    // Get utility stats
    const utilityStats = Object.entries(item.utilityStats || {})
        .filter(([stat, data]) =>
            stat !== 'carryingCapacity' &&
            stat !== 'duration' &&
            stat !== 'range' &&
            stat !== 'areaOfEffect' &&
            getStatValue(data) !== 0
        )
        .map(([stat, data]) => ({
            name: stat,
            value: getStatValue(data),
            isPercentage: isPercentage(data),
            description: getStatDescription(stat, getStatValue(data), isPercentage(data))
        }));

    // Special handling for range
    const range = item.utilityStats?.range;
    const hasRange = range && range.value > 0;

    // Special handling for carrying capacity
    const carryingCapacity = item.utilityStats?.carryingCapacity;
    const hasCarryingCapacity = carryingCapacity && carryingCapacity.enabled && carryingCapacity.slots > 0;

    // Get spell damage stats
    const spellDamageStats = item.combatStats?.spellDamage?.types
        ? Object.entries(item.combatStats.spellDamage.types)
            .filter(([_, data]) => getStatValue(data) !== 0)
            .map(([type, data]) => ({
                name: type,
                value: getStatValue(data),
                isPercentage: isPercentage(data),
                description: getSpellDamageDescription(type, getStatValue(data), isPercentage(data))
            }))
        : [];

    // Define damage type colors
    const damageTypeColors = {
        acid: '#32CD32',
        bludgeoning: '#8B4513',
        cold: '#87CEEB',
        fire: '#FF4500',
        force: '#ff66ff',
        lightning: '#FFD700',
        necrotic: '#4B0082',
        piercing: '#C0C0C0',
        poison: '#008000',
        psychic: '#FF69B4',
        radiant: '#FFFACD',
        slashing: '#A52A2A',
        thunder: '#0066ff'
    };

    // Check for chance-on-being-hit effects
    const hasOnHitEffects = item.combatStats?.onHitEffects?.enabled;
    const onHitEffectsConfig = item.combatStats?.onHitEffects;

    // Check if item has any effects
    const hasEffects = otherStats.length > 0 || utilityStats.length > 0 || spellDamageStats.length > 0 || hasCarryingCapacity || hasOnHitEffects;

    // Get consumable effects
    const hasImmediateEffects = item.type === 'consumable' && (
        getStatValue(item.combatStats?.healthRestore) > 0 ||
        getStatValue(item.combatStats?.manaRestore) > 0
    );

    const hasDurationEffects = item.type === 'consumable' && (
        baseStats.length > 0 ||
        otherStats.length > 0 ||
        utilityStats.length > 0 ||
        spellDamageStats.length > 0 ||
        hasCarryingCapacity ||
        armorClassValue > 0 ||
        (item.immunities && item.immunities.length > 0) ||
        (item.combatStats?.resistances && Object.keys(item.combatStats.resistances).length > 0)
    );

    const renderMiscInfo = (info) => {
        if (!info) return null;

        return info.map(renderTooltipEntry);
    };

    // Get the quality color for border and text
    // Check for both quality and rarity properties to ensure consistent coloring
    const itemQuality = item.quality || item.rarity || 'common';
    const qualityLower = itemQuality.toLowerCase();
    const qualityColor = getQualityColor(itemQuality);
    const borderColor = RARITY_COLORS[qualityLower]?.border || RARITY_COLORS.common.border;

    return (
        <div
            className="item-tooltip"
            data-quality={qualityLower}
            style={{
                borderColor: borderColor,
                boxShadow: `0 4px 12px rgba(0, 0, 0, 0.4), 0 0 16px ${borderColor}80`
            }}
        >
            {/* Item Header with Icon and Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: `2px solid ${borderColor}`,
                    boxShadow: `0 0 8px ${borderColor}60`,
                    flexShrink: 0
                }}>
                    <img
                        src={item.imageUrl || (item.iconId ? `https://wow.zamimg.com/images/wow/icons/large/${item.iconId}.jpg` : 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg')}
                        alt={item.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                        onError={(e) => {
                            e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                        }}
                    />
                </div>
                <div
                    className={`item-name quality-${qualityLower}`}
                    style={{
                        fontSize: item.name && item.name.length > 20 ? '18px' : '22px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%',
                        color: qualityColor, // Apply rarity color directly to the name
                        textShadow: `0 0 5px ${qualityColor}80`, // Add glow effect
                        flex: 1
                    }}
                    // Removed title attribute to prevent browser tooltip conflict
                >
                    {item.name || 'Unknown Item'}
                </div>
            </div>

            {/* Level Requirement - moved here from below */}
                {item.requiredLevel > 0 && (
    <div style={{
        color: '#ff4444',
        fontWeight: '500',
        fontSize: '14px',
        margin: '4px 0',
        borderRadius: '3px',
        display: 'inline-block'
    }}>
        Requires Level {item.requiredLevel}
    </div>
)}

            {/* Item Type and Subtype */}
            {item.type === 'miscellaneous' ? (
                <div style={{
                    color: '#ffffff',
                    marginBottom: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>Miscellaneous</span>
                    <span>
                        {(() => {
                            switch(item.subtype) {
                                case 'REAGENT': return 'Reagent';
                                case 'KEY': return 'Key';
                                case 'QUEST': return 'Quest';
                                case 'CRAFTING': return 'Crafting';
                                case 'TRADE_GOODS': return 'Trade';
                                case 'JUNK': return 'Junk';
                                case 'recipe': return 'Recipe';
                                default: return 'Item';
                            }
                        })()}
                    </span>
                </div>
            ) : item.type === 'weapon' ? (
                <div style={{
                    color: '#ffffff',
                    marginBottom: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>
                        {item.weaponSlot === 'TWO_HANDED' ? 'Two-Handed' :
                         item.weaponSlot === 'RANGED' ? 'Ranged' :
                         item.weaponSlot === 'ONE_HANDED' && item.hand === 'OFF_HAND' ? 'Off Hand' :
                         item.weaponSlot === 'ONE_HANDED' && item.hand === 'ONE_HAND' ? 'One Hand' :
                         item.weaponSlot === 'ONE_HANDED' && item.hand === 'MAIN_HAND' ? 'Main Hand' :
                         'Main Hand'}
                    </span>
                    <span>
                        {item.subtype?.charAt(0).toUpperCase() + item.subtype?.slice(1).toLowerCase()}
                    </span>
                </div>
            ) : item.type === 'armor' ? (
                <div style={{
                    color: '#ffffff',
                    marginBottom: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>
                        {item.slots?.[0] === 'off_hand' ? 'Off Hand' :
                         item.slots?.[0]?.split('_').map(word =>
                            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                        ).join(' ')}
                    </span>
                    <span>
                        {item.slots?.[0] === 'off_hand' ?
                            (() => {
                                if (!item.offHandType) return 'Shield';
                                // Map off-hand types properly
                                const offHandMap = {
                                    SHIELD: 'Shield',
                                    SPHERE: 'Sphere',
                                    TOME: 'Tome',
                                    TOTEM: 'Totem',
                                    IDOL: 'Idol'
                                };
                                return offHandMap[item.offHandType] ||
                                       (item.offHandType.charAt(0).toUpperCase() + item.offHandType.slice(1).toLowerCase());
                            })() :
                            (item.subtype ?
                                (item.subtype.charAt(0).toUpperCase() + item.subtype.slice(1).toLowerCase()) :
                                ''
                            )}
                    </span>
                </div>
            ) : item.type === 'accessory' ? (
                <div style={{
                    color: '#ffffff',
                    marginBottom: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>
                        {(() => {
                            const slot = item.slots?.[0];
                            if (!slot) return 'Accessory';

                            // Handle specific accessory slots
                            const slotMap = {
                                'ring1': 'Ring',
                                'ring2': 'Ring',
                                'neck': 'Neck',
                                'trinket1': 'Trinket',
                                'trinket2': 'Trinket',
                                'head': 'Head',
                                'back': 'Back'
                            };

                            return slotMap[slot] || slot.split('_').map(word =>
                                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                            ).join(' ');
                        })()}
                    </span>
                    <span>Accessory</span>
                </div>
            ) : item.type === 'consumable' ? (
                <div style={{
                    color: '#ffffff',
                    marginBottom: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>Consumable</span>
                    <span>
                        {item.subtype?.charAt(0).toUpperCase() + item.subtype?.slice(1).toLowerCase() || 'Potion'}
                    </span>
                </div>
            ) : item.type === 'clothing' ? (
                <div style={{
                    color: '#ffffff',
                    marginBottom: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>
                        {item.slots?.[0]?.split('_').map(word =>
                            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                        ).join(' ')}
                    </span>
                    <span>Clothing</span>
                </div>
            ) : item.type === 'currency' ? (
                <div style={{
                    color: '#ffffff',
                    marginBottom: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>Currency</span>
                    <span>
                        {item.currencyType?.charAt(0).toUpperCase() + item.currencyType?.slice(1).toLowerCase() || 'Coins'}
                    </span>
                </div>
            ) : item.type === 'container' ? (
                <div style={{
                    color: '#ffffff',
                    marginBottom: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>Container</span>
                    <span>
                        {item.subtype?.charAt(0).toUpperCase() + item.subtype?.slice(1).toLowerCase() || 'Chest'}
                    </span>
                </div>
            ) : (
                <div style={{ color: '#888', marginBottom: '4px' }}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    {item.subtype && ` - ${item.subtype.charAt(0).toUpperCase() + item.subtype.slice(1)}`}
                </div>
            )}

            {/* Weapon Damage */}
            {item.type === 'weapon' && item.weaponStats && (
                <div style={{ marginBottom: '8px' }}>
                    {item.weaponStats.baseDamage && (
                        <div style={{ color: '#ffffff' }}>
                            {item.weaponStats.baseDamage.display?.base || `${item.weaponStats.baseDamage.diceCount}d${item.weaponStats.baseDamage.diceType}`.replace('dd', 'd')}
                            {item.weaponStats.baseDamage.damageType && (
                                <span style={{
                                    color: damageTypeColors[item.weaponStats.baseDamage.damageType.toLowerCase()] || '#ffffff'
                                }}> {item.weaponStats.baseDamage.damageType.toLowerCase()} damage</span>
                            )}
                            {item.weaponStats.baseDamage.bonusDamage > 0 && (
                                <>
                                    <span> +{item.weaponStats.baseDamage.bonusDamage}</span>
                                    <span style={{
                                        color: damageTypeColors[item.weaponStats.baseDamage.bonusDamageType?.toLowerCase()] || '#ffffff'
                                    }}> {item.weaponStats.baseDamage.bonusDamageType?.toLowerCase()} damage</span>
                                </>
                            )}
                        </div>
                    )}
                    {/* Display range for weapons */}
                    {item.combatStats?.range && (
                        <div style={{ color: '#ffffff', marginTop: '4px' }}>
                            Range: {item.combatStats.range.display || `${item.combatStats.range.value} ft`}
                        </div>
                    )}
                </div>
            )}
            {/* Miscellaneous Properties */}
            {item.type === 'miscellaneous' && renderMiscInfo(getMiscTypeInfo(item))}
            {/* Armor */}
            {armorClassValue > 0 && item.type !== 'consumable' && (
                <div style={{ color: '#ffffff', marginBottom: '8px' }}>
                    Armor {armorClassValue}
                </div>
            )}



            {/* Consumable Immediate Effects */}
            {hasImmediateEffects && (
                <div style={{ marginTop: '8px' }}>
                    <div style={{ color: '#ffd100' }}>On Immediate Use:</div>
                    {getStatValue(item.combatStats?.healthRestore) > 0 && (
                        <div style={{ color: '#1eff00' }}>
                            Restore {getStatValue(item.combatStats.healthRestore)}{isPercentage(item.combatStats.healthRestore) ? '%' : ''} Health
                        </div>
                    )}
                    {getStatValue(item.combatStats?.manaRestore) > 0 && (
                        <div style={{ color: '#1eff00' }}>
                            Restore {getStatValue(item.combatStats.manaRestore)}{isPercentage(item.combatStats.manaRestore) ? '%' : ''} Mana
                        </div>
                    )}
                    {hasRange && (
                        <div style={{ color: '#1eff00' }}>
                            Range: {range.display || `${range.value} ft`}
                        </div>
                    )}
                </div>
            )}

            {/* Consumable Duration Effects */}
            {hasDurationEffects && (
                <div style={{ marginTop: '8px' }}>
                    <div style={{ color: '#ffd100' }}>
                        For the duration of <span style={{ color: '#ffffff' }}>{getStatValue(item.utilityStats?.duration) || 1}</span> <span style={{ color: '#ffffff' }}>{
                            (item.utilityStats?.duration?.type === 'ROUNDS' ? 'rounds' : 'minutes')
                        }</span> you gain the following:
                    </div>

                    {/* Base Stats */}
                    {baseStats.map(({ name, value, isPercentage }) => (
                        <div key={name} style={{ color: '#1eff00' }}>
                            {value >= 0 ? 'Increases' : 'Decreases'} your {name} by {Math.abs(value)}{isPercentage ? '%' : ''}
                        </div>
                    ))}

                    {/* Armor for consumables */}
                    {armorClassValue > 0 && (
                        <div style={{ color: '#1eff00' }}>
                            Increases your Armor by {armorClassValue}
                        </div>
                    )}

                    {/* Other Effects */}
                    {otherStats.map(({ description }) => (
                        <div key={description} style={{ color: '#1eff00' }}>
                            {description}
                        </div>
                    ))}

                    {/* Utility Effects */}
                    {utilityStats.map(({ description }) => (
                        <div key={description} style={{ color: '#1eff00' }}>
                            {description}
                        </div>
                    ))}

                    {/* Spell Damage for consumables */}
                    {spellDamageStats.map(({ name, value, isPercentage }) => (
                        <div key={name} style={{ color: '#1eff00' }}>
                            Increases <span style={{
                                color: damageTypeColors[name.toLowerCase()] || '#1eff00',
                                textShadow: `0 0 3px ${damageTypeColors[name.toLowerCase()] || '#1eff00'}40`
                            }}>
                                {name.toLowerCase()}
                            </span> damage dealt by spells and abilities by
                            {isPercentage ? ` ${value}%` : ` up to ${value}`}
                        </div>
                    ))}

                    {/* Carrying Capacity for consumables */}
                    {hasCarryingCapacity && (
                        <div style={{ color: '#1eff00' }}>
                            Adds {carryingCapacity.slots} additional inventory slot{carryingCapacity.slots !== 1 ? 's' : ''}
                        </div>
                    )}

                    {/* Resistances */}
                    {resistances.map((resistance, index) => (
                        <div key={index} style={{ color: '#1eff00' }}>
                            <span style={{
                                color: damageTypeColors[resistance.type] || '#1eff00',
                                textShadow: `0 0 3px ${damageTypeColors[resistance.type] || '#1eff00'}40`
                            }}>
                                {resistance.formatted || (resistance.text.includes('Resistant')
                                    ? `Increases your resistance against ${resistance.type} damage by ${resistance.value || 4}.`
                                    : `Immune to ${resistance.type} damage and effects.`)}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Non-Consumable Effects */}
            {item.type !== 'consumable' && (
                <>
                    {/* Base Stats */}
                    {baseStats.map(({ name, value, isPercentage }) => (
                        <div key={name} style={{ color: '#ffffff' }}>
                            {isPercentage
                                ? `+${value}% ${name}`
                                : `${value >= 0 ? '+' : ''}${value} ${name}`}
                        </div>
                    ))}

                    {/* On Equip section - show if there are any effects including resistances */}
                    {(resistances.length > 0 || otherStats.length > 0 || utilityStats.length > 0 || spellDamageStats.length > 0 || hasCarryingCapacity) && (
                        <div style={{
                            color: '#ffd100',
                            borderBottom: '1px solid #ffffff40',
                            margin: '8px 0',
                            paddingBottom: '2px'
                        }}>
                            On Equip:
                        </div>
                    )}

                    {/* Resistances - enhanced display */}
                    {resistances.map((resistance, index) => (
                        <div key={index} style={{
                            color: resistance.color || '#1eff00',
                            textShadow: `0 0 3px ${resistance.color || '#1eff00'}40`
                        }}>
                            {resistance.formatted}
                        </div>
                    ))}

                    {/* Other Stats */}
                    {otherStats.map(({ description }) => (
                        <div key={description} style={{ color: '#1eff00' }}>
                            {description}
                        </div>
                    ))}

                    {/* Utility Stats */}
                    {utilityStats.map(({ description }) => (
                        <div key={description} style={{ color: '#1eff00' }}>
                            {description}
                        </div>
                    ))}

                    {/* Spell Damage */}
                    {spellDamageStats.map(({ name, value, isPercentage }) => (
                        <div key={name} style={{ color: '#1eff00' }}>
                            Increases <span style={{
                                color: damageTypeColors[name.toLowerCase()] || '#1eff00',
                                textShadow: `0 0 3px ${damageTypeColors[name.toLowerCase()] || '#1eff00'}40`
                            }}>
                                {name.toLowerCase()}
                            </span> damage dealt by spells and abilities by
                            {isPercentage ? ` ${value}%` : ` up to ${value}`}.
                        </div>
                    ))}

                    {/* Carrying Capacity */}
                    {hasCarryingCapacity && (
                        <div style={{ color: '#1eff00' }}>
                            Adds {carryingCapacity.slots} additional inventory slot{carryingCapacity.slots !== 1 ? 's' : ''}.
                        </div>
                    )}

                    {/* Chance on Being Hit Effects */}
                    {hasOnHitEffects && (
                        <div style={{ marginTop: '8px' }}>
                            <div style={{
                                color: '#ffd100',
                                borderBottom: '1px solid #ffffff40',
                                margin: '4px 0',
                                paddingBottom: '2px'
                            }}>
                                Chance on Being Hit:
                            </div>
                            <div style={{ color: '#a335ee' }}>
                                {(() => {
                                    // Format the proc chance based on the proc type
                                    let procChanceText = '';
                                    if (onHitEffectsConfig.procType === 'dice') {
                                        const chance = Math.round(((21 - onHitEffectsConfig.diceThreshold) / 20) * 100);
                                        procChanceText = `${chance}% chance (${onHitEffectsConfig.diceThreshold}+ on d20)`;
                                    } else if (onHitEffectsConfig.procType === 'cards') {
                                        if (onHitEffectsConfig.cardProcRule === 'face_cards') {
                                            procChanceText = '23% chance (on face cards)';
                                        } else if (onHitEffectsConfig.cardProcRule === 'aces') {
                                            procChanceText = '8% chance (on aces)';
                                        } else if (onHitEffectsConfig.cardProcRule === 'specific_suit') {
                                            procChanceText = `25% chance (on ${onHitEffectsConfig.procSuit})`;
                                        }
                                    } else if (onHitEffectsConfig.procType === 'coins') {
                                        const chance = Math.round((1 / Math.pow(2, onHitEffectsConfig.coinCount)) * 100);
                                        procChanceText = `${chance}% chance (${onHitEffectsConfig.coinCount} coin${onHitEffectsConfig.coinCount !== 1 ? 's' : ''}, all heads)`;
                                    }

                                    return `${procChanceText} to trigger`;
                                })()}
                                {onHitEffectsConfig.spellEffect ? (
                                    <>
                                        {' '}
                                        <span style={{ color: '#a335ee' }}>
                                            {onHitEffectsConfig.spellName || 'a spell effect'}
                                        </span>
                                        {onHitEffectsConfig.spellDescription && (
                                            <>: {onHitEffectsConfig.spellDescription}</>
                                        )}
                                        {' when hit.'}
                                    </>
                                ) : ' an effect when hit.'}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Description - exclude miscellaneous items as they have their own description handling */}
            {item.description && item.type !== 'miscellaneous' && (
                <>
                    <div style={{ margin: '8px 0' }} />
                    <div style={{
                        color: '#1eff00',
                        fontFamily: 'Times New Roman, serif',
                        fontStyle: 'italic',
                        textShadow: '1px 1px 0 #000'
                    }}>
                        "{item.description}"
                    </div>
                </>
            )}

            {/* Drop Chance - Display if provided */}
            {item.dropChanceDisplay !== undefined && (
                <div style={{
                    marginTop: '8px',
                    color: '#ffd100',
                    textShadow: '1px 1px 1px rgba(0, 0, 0, 0.5)',
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    Drop Chance: <span style={{ color: '#ffffff' }}>{item.dropChanceDisplay}%</span>
                </div>
            )}

            {/* Shop Price - Show if this is a shop item */}
            {item.isShopItem && item.shopPrice && (
                <div style={{
                    marginTop: '8px',
                    color: '#ffd100',
                    textShadow: '1px 1px 1px rgba(0, 0, 0, 0.5)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                    paddingTop: '8px'
                }}>
                    Price: {' '}
                    {(parseInt(item.shopPrice.gold) || 0) > 0 && (
                        <span>
                            <span style={{ color: '#ffffff' }}>{parseInt(item.shopPrice.gold) || 0}</span>
                            <span style={{ color: '#ffd700' }}>g </span>
                        </span>
                    )}
                    {(parseInt(item.shopPrice.silver) || 0) > 0 && (
                        <span>
                            <span style={{ color: '#ffffff' }}>{parseInt(item.shopPrice.silver) || 0}</span>
                            <span style={{ color: '#c0c0c0' }}>s </span>
                        </span>
                    )}
                    {(parseInt(item.shopPrice.copper) || 0) > 0 && (
                        <span>
                            <span style={{ color: '#ffffff' }}>{parseInt(item.shopPrice.copper) || 0}</span>
                            <span style={{ color: '#cd7f32' }}>c</span>
                        </span>
                    )}
                    {(!(parseInt(item.shopPrice.gold) || 0) && !(parseInt(item.shopPrice.silver) || 0) && !(parseInt(item.shopPrice.copper) || 0)) && (
                        <span>
                            <span style={{ color: '#ffffff' }}>0</span>
                            <span style={{ color: '#cd7f32' }}>c</span>
                        </span>
                    )}
                </div>
            )}

            {/* Value - Don't show for containers or shop items */}
            {item.value && item.type !== 'container' && !item.isShopItem && (
                <div style={{
                    marginTop: '8px',
                    color: '#ffd100',
                    textShadow: '1px 1px 1px rgba(0, 0, 0, 0.5)'
                }}>
                    Value: {' '}
                    {typeof item.value === 'object' ? (
                        <>
                            {(parseInt(item.value.gold) || 0) > 0 && (
                                <span>
                                    <span style={{ color: '#ffffff' }}>{parseInt(item.value.gold) || 0}</span>
                                    <span style={{ color: '#ffd700' }}>g </span>
                                </span>
                            )}
                            {(parseInt(item.value.silver) || 0) > 0 && (
                                <span>
                                    <span style={{ color: '#ffffff' }}>{parseInt(item.value.silver) || 0}</span>
                                    <span style={{ color: '#c0c0c0' }}>s </span>
                                </span>
                            )}
                            {(parseInt(item.value.copper) || 0) > 0 && (
                                <span>
                                    <span style={{ color: '#ffffff' }}>{parseInt(item.value.copper) || 0}</span>
                                    <span style={{ color: '#cd7f32' }}>c</span>
                                </span>
                            )}
                            {(!(parseInt(item.value.gold) || 0) && !(parseInt(item.value.silver) || 0) && !(parseInt(item.value.copper) || 0)) && (
                                <span>
                                    <span style={{ color: '#ffffff' }}>0</span>
                                    <span style={{ color: '#cd7f32' }}>c</span>
                                </span>
                            )}
                        </>
                    ) : (
                        // Handle case where value is a string or number
                        typeof item.value === 'string' || typeof item.value === 'number' ? item.value : '0c'
                    )}
                </div>
            )}
        </div>
    );
}
