import React from 'react';
import '../../styles/item-tooltip.css';

const getQualityColor = (quality) => {
    switch (quality?.toLowerCase()) {
        case 'poor': return '#9d9d9d';
        case 'common': return '#ffffff';
        case 'uncommon': return '#1eff00';
        case 'rare': return '#0070dd';
        case 'epic': return '#a335ee';
        case 'legendary': return '#ff8000';
        case 'artifact': return '#e6cc80';
        default: return '#ffffff';
    }
};

const getMiscTypeInfo = (item) => {
    if (!item || !item.subtype) return null;

    switch (item.subtype) {
        case 'QUEST':
            return [
                {
                    component: 'quest-details',
                    items: [
                        item.questGiver && {
                            label: 'Quest Giver',
                            value: item.questGiver,
                            className: 'item-quest-detail'
                        },
                        item.questObjectives && {
                            label: 'Objectives',
                            value: item.questObjectives,
                            className: 'item-quest-detail'
                        },
                        item.questChain && {
                            label: 'Part of',
                            value: item.questChain,
                            className: 'item-quest-detail'
                        }
                    ].filter(Boolean)
                },
                item.requiredLevel > 0 && {
                    text: `Requires Level ${item.requiredLevel}`,
                    className: 'item-requirement',
                    color: '#ff4444'
                },
                item.timeLimit > 0 && {
                    text: `Time Limit: ${item.timeLimit} minutes`,
                    className: 'item-time-limit',
                    color: '#ff8000'
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
                            className: 'item-reagent-detail'
                        },
                        item.magicType && {
                            label: 'Magic',
                            value: getMagicTypeName(item.magicType),
                            className: 'item-reagent-detail magic-type',
                            color: getMagicTypeColor(item.magicType)
                        },
                        item.reagentState && {
                            label: 'State',
                            value: item.reagentState.charAt(0).toUpperCase() + item.reagentState.slice(1),
                            className: 'item-reagent-detail'
                        },
                        item.requiredFor && {
                            label: 'Required For',
                            value: item.requiredFor,
                            className: 'item-reagent-detail'
                        },
                        item.quantityPerUse && {
                            label: 'Quantity Per Cast',
                            value: item.quantityPerUse,
                            className: 'item-reagent-detail'
                        },
                        item.preservationMethod && {
                            label: 'Preservation',
                            value: getPreservationName(item.preservationMethod),
                            className: 'item-reagent-detail'
                        }
                    ].filter(Boolean)
                },
                item.magicalProperties && {
                    text: item.magicalProperties,
                    className: 'item-magical-properties',
                    color: '#a335ee'
                },
                item.source && {
                    text: `Source: ${item.source}`,
                    className: 'item-source-location',
                    color: '#1eff00'
                }
            ].filter(Boolean);

        case 'CRAFTING':
            return [
                {
                    component: 'crafting-details',
                    items: [
                        item.materialType && {
                            label: 'Material',
                            value: getMaterialTypeName(item.materialType),
                            className: 'item-crafting-detail'
                        },
                        item.professions?.length > 0 && {
                            label: 'Professions',
                            value: item.professions.join(', '),
                            className: 'item-crafting-detail'
                        },
                        item.gatheringMethod && {
                            label: 'Gathering',
                            value: getGatheringMethodName(item.gatheringMethod),
                            className: 'item-crafting-detail'
                        }
                    ].filter(Boolean)
                },
                item.recipes && {
                    text: `Used in: ${item.recipes}`,
                    className: 'item-recipes',
                    color: '#1eff00'
                },
                item.sourceLocations && {
                    text: `Found in: ${item.sourceLocations}`,
                    className: 'item-source-location',
                    color: '#0070dd'
                },
                item.specialProperties && {
                    text: item.specialProperties,
                    className: 'item-special-properties',
                    italic: true,
                    color: '#a335ee'
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
                            className: 'item-trade-detail'
                        },
                        item.origin && {
                            label: 'Origin',
                            value: item.origin.charAt(0).toUpperCase() + item.origin.slice(1),
                            className: 'item-trade-detail'
                        },
                        item.demandLevel && {
                            label: 'Demand',
                            value: getDemandLevel(item.demandLevel),
                            className: 'item-trade-detail'
                        },
                        item.qualityGrade && {
                            label: 'Quality',
                            value: getQualityGrade(item.qualityGrade),
                            className: 'item-trade-detail'
                        }
                    ].filter(Boolean)
                },
                item.merchantNotes && {
                    text: `"${item.merchantNotes}"`,
                    className: 'item-merchant-notes',
                    italic: true,
                    color: '#1eff00'
                }
            ].filter(Boolean);

        case 'KEY':
            return [
                {
                    component: 'key-details',
                    items: [
                        item.unlocks && {
                            label: 'Unlocks',
                            value: item.unlocks,
                            className: 'item-key-detail'
                        },
                        item.location && {
                            label: 'Location',
                            value: item.location,
                            className: 'item-key-detail'
                        },
                        item.securityLevel && {
                            label: 'Security Level',
                            value: item.securityLevel.charAt(0).toUpperCase() + item.securityLevel.slice(1),
                            className: 'item-key-detail'
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
                    className: 'item-description',
                    italic: true
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

        default:
            return null;
    }
};

const getMagicTypeName = (type) => {
    const MAGIC_TYPES = {
        fire: 'Fire Magic',
        cold: 'Frost Magic',
        lightning: 'Lightning Magic',
        acid: 'Acid Magic',
        force: 'Force Magic',
        necrotic: 'Death Magic',
        radiant: 'Holy Magic',
        poison: 'Poison Magic',
        psychic: 'Mind Magic',
        thunder: 'Thunder Magic'
    };
    return MAGIC_TYPES[type] || type;
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

const getStatDescription = (stat, value, isPercentage = false) => {
    // Format for percentage values
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
        armorClass: `Increases your armor class by ${formattedValue}.`,
        critChance: `Improves your chance to critically strike by ${formattedValue}%.`,
        hitChance: `Improves your chance to hit targets by ${formattedValue}%.`,

        // Healing
        healingPower: `Increases healing done by spells and effects by up to ${formattedValue}.`,
        healingReceived: `Increases all healing received by ${formattedValue}${isPercentage ? '' : '%'}.`,

        // Physical damage
        piercingDamage: `Increases piercing damage dealt by ${formattedValue}.`,
        bludgeoningDamage: `Increases bludgeoning damage dealt by ${formattedValue}.`,
        slashingDamage: `Increases slashing damage dealt by ${formattedValue}.`,
        
        // Utility stats
        swimSpeed: `Increases swim speed by ${formattedValue}${isPercentage ? '' : '%'}.`,
        movementSpeed: `Increases movement speed by ${formattedValue}${isPercentage ? '' : '%'}.`,
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
                            {detail.className === 'item-reagent-detail magic-type' ? (
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

        if (entry.component === 'crafting-details') {
            return (
                <div key={index} className="crafting-details-grid">
                    {entry.items.map((detail, detailIndex) => (
                        <div key={detailIndex} className="crafting-detail-row">
                            <span className="crafting-detail-label">{detail.label}:</span>
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
    if (!item) return null;

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

    // Debug log
    console.log('Item Data:', {
        type: item.type,
        subtype: item.subtype,
        weaponSlot: item.weaponSlot,
        slot: item.slot,
        slots: item.slots
    });

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

    // Get utility stats
    const utilityStats = Object.entries(item.utilityStats || {})
        .filter(([stat, data]) => 
            stat !== 'carryingCapacity' && 
            stat !== 'duration' && 
            getStatValue(data) !== 0
        )
        .map(([stat, data]) => ({
            name: stat,
            value: getStatValue(data),
            isPercentage: isPercentage(data),
            description: getStatDescription(stat, getStatValue(data), isPercentage(data))
        }));
        
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

    // Get resistances
    const resistances = [];
    if (item.immunities) {
        item.immunities.forEach(type => {
            resistances.push({
                type: type.toLowerCase(),
                text: `Immune to ${type}`
            });
        });
    }
    if (item.combatStats?.resistances) {
        Object.entries(item.combatStats.resistances)
            .filter(([_, data]) => data && data.resistant)
            .forEach(([type]) => {
                resistances.push({
                    type: type.toLowerCase(),
                    text: `Resistant to ${type}`
                });
            });
    }

    // Check if item has any effects
    const hasEffects = otherStats.length > 0 || utilityStats.length > 0 || spellDamageStats.length > 0 || hasCarryingCapacity;

    // Get consumable effects
    const hasImmediateEffects = item.type === 'consumable' && (
        getStatValue(item.combatStats?.healthRestore) > 0 ||
        getStatValue(item.combatStats?.manaRestore) > 0
    );

    const hasDurationEffects = item.type === 'consumable' && (
        baseStats.length > 0 ||
        otherStats.length > 0 ||
        utilityStats.length > 0 ||
        resistances.length > 0
    );

    const renderMiscInfo = (info) => {
        if (!info) return null;
        
        return info.map(renderTooltipEntry);
    };

    return (
        <div className="item-tooltip" data-quality={item.quality?.toLowerCase()}>
            {/* Item Name */}
            <div className={`item-name quality-${item.quality?.toLowerCase() || 'common'}`}>
    {item.name || 'Unknown Item'}
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
                         item.hand === 'OFF_HAND' ? 'Off Hand' :
                         item.hand === 'ONE_HAND' ? 'One Hand' :
                         item.hand === 'MAIN_HAND' ? 'Main Hand' :
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
                            (item.offHandType?.charAt(0).toUpperCase() + item.offHandType?.slice(1).toLowerCase()) :
                            (item.subtype?.charAt(0).toUpperCase() + item.subtype?.slice(1).toLowerCase())}
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
                        {item.slots?.[0]?.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                        ).join(' ')}
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
                            {item.weaponStats.baseDamage.display?.base || `${item.weaponStats.baseDamage.diceCount}d${item.weaponStats.baseDamage.diceType}`}
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
                </div>
            )}
            {/* Miscellaneous Properties */}
            {item.type === 'miscellaneous' && renderMiscInfo(getMiscTypeInfo(item))}
            {/* Armor Class */}
            {armorClassValue > 0 && item.type !== 'consumable' && (
                <div style={{ color: '#ffffff', marginBottom: '8px' }}>
                    Armor Class {armorClassValue}
                </div>
            )}

            {/* Consumable Immediate Effects */}
            {hasImmediateEffects && (
                <div style={{ marginTop: '8px' }}>
                    <div style={{ color: '#ffd100' }}>On Immediate Use:</div>
                    {getStatValue(item.combatStats?.healthRestore) > 0 && (
                        <div style={{ color: '#1eff00' }}>
                            Restore {getStatValue(item.combatStats.healthRestore)} Health
                        </div>
                    )}
                    {getStatValue(item.combatStats?.manaRestore) > 0 && (
                        <div style={{ color: '#1eff00' }}>
                            Restore {getStatValue(item.combatStats.manaRestore)} Mana
                        </div>
                    )}
                </div>
            )}

            {/* Consumable Duration Effects */}
            {hasDurationEffects && (
                <div style={{ marginTop: '8px' }}>
                    <div style={{ color: '#ffd100' }}>
                        For the duration of {getStatValue(item.utilityStats?.duration) || 1} {
                            (item.utilityStats?.duration?.type === 'ROUNDS' ? 'rounds' : 'minutes')
                        } you gain the following:
                    </div>
                    
                    {/* Base Stats */}
                    {baseStats.map(({ name, value, isPercentage }) => (
                        <div key={name} style={{ color: '#1eff00' }}>
                            {value >= 0 ? 'Increases' : 'Decreases'} your {name} by {Math.abs(value)}{isPercentage ? '%' : ''}
                        </div>
                    ))}

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

                    {/* Resistances */}
                    {resistances.map((resistance, index) => (
                        <div key={index} style={{ color: '#1eff00' }}>
                            {resistance.text.includes('Resistant') ? 'Resistant to ' : 'Immune to '}
                            <span style={{ 
                                color: damageTypeColors[resistance.type] || '#1eff00',
                                textShadow: `0 0 3px ${damageTypeColors[resistance.type] || '#1eff00'}40`
                            }}>
                                {resistance.type}
                            </span> Damage and Effects
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

                    {/* Resistances */}
                    {resistances.map((resistance, index) => (
                        <div key={index} style={{ color: '#ffffff' }}>
                            • <span style={{ 
                                color: damageTypeColors[resistance.type] || '#ffffff',
                                textShadow: `0 0 3px ${damageTypeColors[resistance.type] || '#ffffff'}40`
                            }}>
                                {resistance.text.includes('Resistant') ? 'Resistant to ' : 'Immune to '}
                                {resistance.type} Damage and Effects
                            </span>
                        </div>
                    ))}

                    {/* On Equip section */}
                    {hasEffects && (
                        <div style={{ 
                            color: '#ffd100',
                            borderBottom: '1px solid #ffffff40',
                            margin: '8px 0',
                            paddingBottom: '2px'
                        }}>
                            On Equip:
                        </div>
                    )}

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

                    {/* Carrying Capacity */}
                    {hasCarryingCapacity && (
                        <div style={{ color: '#1eff00' }}>
                            Adds {carryingCapacity.slots} additional inventory slot{carryingCapacity.slots !== 1 ? 's' : ''}.
                        </div>
                    )}

                    {/* Spell Damage */}
                    {spellDamageStats.map(({ description }) => (
                        <div key={description.type} style={{ color: '#1eff00' }}>
                            Increases <span style={{ 
                                color: damageTypeColors[description.type] || '#1eff00',
                                textShadow: `0 0 3px ${damageTypeColors[description.type] || '#1eff00'}40`
                            }}>
                                {description.type}
                            </span> damage dealt by spells and abilities by 
                            {description.isPercentage ? ` ${description.value}%` : ` up to ${description.value}`}.
                        </div>
                    ))}
                </>
            )}

            {/* Description */}
            {item.description && (
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
            
            {/* Value */}
            {item.value && (
                <div style={{ 
                    marginTop: '8px', 
                    color: '#ffd100',
                    textShadow: '1px 1px 1px rgba(0, 0, 0, 0.5)'
                }}>
                    Value: {' '}
                    {item.value.gold > 0 && `${item.value.gold}g `}
                    {item.value.silver > 0 && `${item.value.silver}s `}
                    {item.value.copper > 0 && `${item.value.copper}c`}
                    {(!item.value.gold && !item.value.silver && !item.value.copper) && '0c'}
                </div>
            )}
        </div>
    );
}
