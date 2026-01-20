import React, { memo, useState, useRef, useEffect } from 'react';
import '../../styles/item-tooltip.css';
import { RARITY_COLORS } from '../../constants/itemConstants';
import useCraftingStore, { SKILL_LEVELS } from '../../store/craftingStore';
import useItemStore from '../../store/itemStore';
import { getIconUrl } from '../../utils/assetManager';
import { CONDITIONS } from '../../data/conditionsData';

const getQualityColor = (quality) => {
    // Check for null or undefined and provide a default
    const qualityValue = quality || 'common';
    const qualityLower = qualityValue.toLowerCase();
    return RARITY_COLORS[qualityLower]?.text || RARITY_COLORS.common.text;
};

const formatCurrency = (value) => {
    if (!value) return '0c';

    const { platinum = 0, gold = 0, silver = 0, copper = 0 } = value;
    const parts = [];

    if (platinum > 0) parts.push(`${platinum}p`);
    if (gold > 0) parts.push(`${gold}g`);
    if (silver > 0) parts.push(`${silver}s`);
    if (copper > 0) parts.push(`${copper}c`);

    return parts.join(' ') || '0c';
};

// Helper function to get display name (custom name or original name)
const getDisplayName = (item) => {
    return item.customName || item.name;
};

// Helper function to safely capitalize a string
const safeCapitalize = (str) => {
    if (!str || typeof str !== 'string' || str.length === 0) {
        return str || '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const getMiscTypeInfo = (item) => {
    if (!item || !item.subtype) {
        // Fallback for miscellaneous items without subtype
        return [
            item.description && {
                text: `"${item.description}"`,
                className: 'item-description',
                italic: true,
                color: '#4a3728'
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
                    color: '#4a3728'
                }
            ].filter(Boolean);









        case 'REAGENT':
            return [
                {
                    component: 'reagent-details',
                    items: [
                        item.reagentType && typeof item.reagentType === 'string' && item.reagentType.trim() !== '' && {
                            label: 'Type',
                            value: safeCapitalize(item.reagentType),
                            className: 'reagent-detail-value'
                        },
                        item.magicType && {
                            label: 'Magic',
                            value: getMagicTypeName(item.magicType),
                            className: 'reagent-detail-value magic-type',
                            color: getMagicTypeColor(item.magicType)
                        },
                        item.reagentState && typeof item.reagentState === 'string' && item.reagentState.trim() !== '' && {
                            label: 'State',
                            value: safeCapitalize(item.reagentState),
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
                    color: '#4a3728'
                }
            ].filter(Boolean);

        case 'CRAFTING':
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
            return [
                {
                    component: 'crafting-details',
                    items: craftingItems
                },
                item.description && {
                    text: `"${item.description}"`,
                    className: 'item-description',
                    italic: true,
                    color: '#4a3728'
                }
            ].filter(Boolean);

        case 'TRADE_GOODS':
            return [
                {
                    component: 'trade-details',
                    items: [
                        item.tradeCategory && typeof item.tradeCategory === 'string' && item.tradeCategory.trim() !== '' && {
                            label: 'Category',
                            value: getTradeCategory(item.tradeCategory),
                            className: 'trade-detail-value'
                        },
                        item.origin && typeof item.origin === 'string' && item.origin.trim() !== '' && {
                            label: 'Origin',
                            value: safeCapitalize(item.origin),
                            className: 'trade-detail-value'
                        },
                        item.demandLevel && (typeof item.demandLevel === 'string' || typeof item.demandLevel === 'number') && {
                            label: 'Demand',
                            value: getDemandLevel(item.demandLevel),
                            className: 'trade-detail-value'
                        },
                        item.qualityGrade && typeof item.qualityGrade === 'string' && item.qualityGrade.trim() !== '' && {
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
                    color: '#4a3728'
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
                    color: '#4a3728'
                }
            ].filter(Boolean);

        case 'JUNK':
            return [
                {
                    component: 'junk-details',
                    items: [
                        item.junkType && typeof item.junkType === 'string' && item.junkType.trim() !== '' && {
                            label: 'Type',
                            value: safeCapitalize(item.junkType),
                            className: 'item-junk-detail'
                        },
                        item.condition && typeof item.condition === 'string' && item.condition.trim() !== '' && {
                            label: 'Condition',
                            value: safeCapitalize(item.condition),
                            className: 'item-junk-detail'
                        },
                        item.origin && typeof item.origin === 'string' && item.origin.trim() !== '' && {
                            label: 'Origin',
                            value: safeCapitalize(item.origin),
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
                    color: '#4a3728'
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
                    color: '#4a3728'
                }
            ].filter(Boolean);
    }
};

const getMagicTypeName = (type) => {
    if (!type || typeof type !== 'string') {
        return String(type || '') + ' Magic';
    }
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
    return MAGIC_TYPES[type.toLowerCase()] || (safeCapitalize(type) + ' Magic');
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
    if (!method || typeof method !== 'string') {
        return String(method || '');
    }
    const PRESERVATION_METHODS = {
        dried: 'Dried',
        fresh: 'Fresh',
        powdered: 'Powdered',
        distilled: 'Distilled',
        crystallized: 'Crystallized',
        preserved: 'Magically Preserved'
    };
    return PRESERVATION_METHODS[method.toLowerCase()] || safeCapitalize(method);
};

const getMaterialTypeName = (type) => {
    if (!type || typeof type !== 'string') {
        return String(type || '');
    }
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
    return MATERIAL_TYPES[type.toLowerCase()] || safeCapitalize(type);
};

const getGatheringMethodName = (method) => {
    if (!method || typeof method !== 'string') {
        return String(method || '');
    }
    const GATHERING_METHODS = {
        mining: 'Mining',
        herbalism: 'Herbalism',
        skinning: 'Skinning',
        logging: 'Logging',
        scavenging: 'Scavenging',
        fishing: 'Fishing',
        quarrying: 'Quarrying'
    };
    return GATHERING_METHODS[method.toLowerCase()] || safeCapitalize(method);
};

const getTradeCategory = (category) => {
    if (!category || typeof category !== 'string') {
        return String(category || '');
    }
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
    return TRADE_CATEGORIES[category.toLowerCase()] || safeCapitalize(category);
};

const getDemandLevel = (level) => {
    if (!level) {
        return String(level || '');
    }
    const levelStr = String(level).toLowerCase();
    const DEMAND_LEVELS = {
        low: 'Low Demand',
        moderate: 'Moderate Demand',
        high: 'High Demand',
        very_high: 'Very High Demand',
        extreme: 'Extreme Demand'
    };
    return DEMAND_LEVELS[levelStr] || safeCapitalize(String(level));
};

const getQualityGrade = (grade) => {
    if (!grade || typeof grade !== 'string') {
        return String(grade || '');
    }
    const QUALITY_GRADES = {
        poor: 'Poor',
        standard: 'Standard',
        fine: 'Fine',
        superior: 'Superior',
        exquisite: 'Exquisite',
        masterwork: 'Masterwork'
    };
    return QUALITY_GRADES[grade.toLowerCase()] || safeCapitalize(grade);
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
    return KEY_TYPES[keyType] || safeCapitalize(keyType) || 'Unknown';
};

const getSecurityLevelName = (level) => {
    const SECURITY_LEVELS = {
        low: 'Low Security',
        moderate: 'Moderate Security',
        high: 'High Security',
        maximum: 'Maximum Security',
        magical: 'Magical Security'
    };
    return SECURITY_LEVELS[level] || safeCapitalize(level) || 'Unknown';
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

function ItemTooltip({ item }) {
    // Use hooks to get store data (hooks must be called before early returns)
    const { availableRecipes } = useCraftingStore();
    const { items: itemLibrary } = useItemStore();

    // All hooks must be called unconditionally at the top level
    const [titleStyle, setTitleStyle] = useState({ fontSize: '22px', needsScrolling: false, scrollDistance: 0 });
    const titleRef = useRef(null);
    const titleContainerRef = useRef(null);

    // useEffect must be called before any early returns to ensure consistent hook count
    useEffect(() => {
        // Always return a cleanup function to ensure consistent hook count
        if (!titleRef.current || !titleContainerRef.current || !item) {
            return () => {
                // No cleanup needed if refs or item aren't available
            };
        }

        const measureText = () => {
            const container = titleContainerRef.current;
            const textElement = titleRef.current;

            if (!container || !textElement) return;

            // Get available width (container width minus icon and gap)
            const containerWidth = container.offsetWidth;
            const iconWidth = 36; // Icon width
            const gap = 12; // Gap between icon and text
            const padding = 32; // Padding on both sides (16px each)
            const availableWidth = containerWidth - iconWidth - gap - padding;

            // Create a temporary element to measure text width at different font sizes
            const tempElement = document.createElement('span');
            tempElement.style.visibility = 'hidden';
            tempElement.style.position = 'absolute';
            tempElement.style.whiteSpace = 'nowrap';
            tempElement.style.fontSize = '22px';
            tempElement.style.fontFamily = window.getComputedStyle(textElement).fontFamily;
            tempElement.style.fontWeight = window.getComputedStyle(textElement).fontWeight;
            tempElement.textContent = getDisplayName(item) || 'Unknown Item';
            document.body.appendChild(tempElement);

            const textWidth22 = tempElement.offsetWidth;
            tempElement.style.fontSize = '18px';
            const textWidth18 = tempElement.offsetWidth;
            tempElement.style.fontSize = '16px';
            const textWidth16 = tempElement.offsetWidth;
            tempElement.style.fontSize = '14px';
            const textWidth14 = tempElement.offsetWidth;

            document.body.removeChild(tempElement);

            // Determine if scrolling is needed (if even at 14px it doesn't fit)
            if (textWidth14 > availableWidth) {
                // Text is very long - use scrolling animation
                // Calculate scroll distance: how much we need to scroll to show the end
                // We start showing the beginning, then scroll left to show the rest
                // Scroll distance = textWidth - availableWidth (negative value to scroll left)
                const scrollDistance = textWidth22 - availableWidth;
                setTitleStyle({
                    fontSize: '22px',
                    needsScrolling: true,
                    scrollDistance: scrollDistance
                });
            } else if (textWidth22 > availableWidth) {
                // Text is slightly too long - reduce font size dynamically
                let fontSize = '22px';
                if (textWidth18 <= availableWidth) {
                    fontSize = '18px';
                } else if (textWidth16 <= availableWidth) {
                    fontSize = '16px';
                } else {
                    fontSize = '14px';
                }
                setTitleStyle({
                    fontSize: fontSize,
                    needsScrolling: false
                });
            } else {
                // Text fits - use default size
                setTitleStyle({
                    fontSize: item.name && item.name.length > 20 ? '18px' : '22px',
                    needsScrolling: false
                });
            }
        };

        // Measure after a short delay to ensure DOM is ready
        const timeoutId = setTimeout(measureText, 10);

        // Also measure on window resize
        window.addEventListener('resize', measureText);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', measureText);
        };
    }, [item?.name, item?.customName]);

    if (!item) {
        return null;
    }

    // Special handling for recipe items
    if (item.type === 'recipe' && item.recipeId) {
        const recipeData = availableRecipes.find(recipe => recipe.id === item.recipeId);
        const resultItem = recipeData ? itemLibrary.find(i => i.id === recipeData.resultItemId) : null;
        const skillLevel = recipeData ? Object.values(SKILL_LEVELS).find(s => s.level === recipeData.requiredLevel) : null;

        // Get quality for recipe (use recipe quality, not result item quality)
        const recipeQuality = item.quality || 'common';
        const qualityLower = recipeQuality.toLowerCase();
        const qualityColor = getQualityColor(recipeQuality);

        // Quality border colors for recipe tooltip
        const qualityBorderColors = {
            poor: '#9d9d9d',
            common: '#ffffff',
            uncommon: '#1eff00',
            rare: '#0070dd',
            epic: '#a335ee',
            legendary: '#ff8000',
            artifact: '#e6cc80'
        };
        const borderColor = qualityBorderColors[qualityLower] || qualityBorderColors.common;

        // useEffect is declared at bottom level to avoid conditional hook calls

        return (
            <div
                className="item-tooltip"
                data-quality={qualityLower}
                style={{
                    borderColor: borderColor,
                    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.4), 0 0 16px ${borderColor}80`
                }}
            >
                {/* Recipe Header with Icon and Name */}
                <div
                    ref={titleContainerRef}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', minWidth: 0 }}
                >
                    <div
                        className="item-icon-magical-bg"
                        data-quality={qualityLower}
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            border: `1px solid ${borderColor}`,
                            boxShadow: `0 0 6px ${borderColor}50`,
                            flexShrink: 0
                        }}>
                        <img
                            src={item.iconId ? getIconUrl(item.iconId, 'items', true) : getIconUrl('Misc/Books/book-scroll-rolled-red-wax-seal', 'items', true)}
                            alt={getDisplayName(item)}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = getIconUrl('Misc/Books/book-scroll-rolled-red-wax-seal', 'items', true);
                            }}
                        />
                    </div>
                    <div
                        ref={titleRef}
                        className={`item-name quality-${qualityLower} ${titleStyle.needsScrolling ? 'item-name-scrolling' : ''}`}
                        style={{
                            fontSize: titleStyle.fontSize,
                            fontWeight: '700',
                            color: qualityColor,
                            textShadow: `0 2px 4px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.7), 0 0 8px ${qualityColor}50`,
                            flex: 1,
                            fontFamily: 'Cinzel, Trajan Pro, serif',
                            whiteSpace: 'nowrap',
                            overflow: titleStyle.needsScrolling ? 'visible' : 'hidden',
                            textOverflow: titleStyle.needsScrolling ? 'clip' : 'ellipsis',
                            maxWidth: '100%',
                            minWidth: 0
                        }}
                    >
                        {titleStyle.needsScrolling ? (
                            <span
                                className="item-name-scroll-text"
                                style={{
                                    '--scroll-distance': `-${titleStyle.scrollDistance}px`
                                }}
                            >
                                {getDisplayName(item)}
                            </span>
                        ) : (
                            getDisplayName(item)
                        )}
                    </div>
                </div>

                {/* Profession and Skill Requirements */}
                {item.requiredProfession && (
                    <div style={{
                        color: '#8b0000',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '10px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(139, 0, 0, 0.1)',
                        border: '1px solid rgba(139, 0, 0, 0.2)',
                        display: 'inline-block',
                        fontFamily: 'Bookman Old Style, Garamond, serif'
                    }}>
                        Requires {item.requiredProfession.charAt(0).toUpperCase() + item.requiredProfession.slice(1)}
                        {skillLevel && ` (${skillLevel.name})`}
                    </div>
                )}

                {/* Item Type - Combined Recipe and Quality */}
                <div style={{
                    color: '#5a1e12',
                    fontSize: '13px',
                    marginBottom: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily: 'Bookman Old Style, Garamond, serif'
                }}>
                    <span style={{ fontWeight: '600' }}>Recipe</span>
                    <span style={{
                        color: '#8b7355',
                        fontWeight: '500',
                        textTransform: 'capitalize'
                    }}>{qualityLower}</span>
                </div>

                {/* Divider */}
                <div style={{
                    borderTop: '1px solid rgba(139, 69, 19, 0.3)',
                    margin: '6px 0'
                }}></div>

                {/* Result Item Information */}
                {recipeData && resultItem && (
                    <div style={{ marginBottom: '8px' }}>
                        <div style={{
                            color: '#b8860b',
                            fontWeight: '600',
                            fontSize: '11px',
                            marginBottom: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontFamily: 'Cinzel, Trajan Pro, serif',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                        }}>
                            Creates
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '4px 6px',
                            backgroundColor: 'rgba(139, 69, 19, 0.08)',
                            borderRadius: '3px',
                            border: '1px solid rgba(139, 69, 19, 0.15)'
                        }}>
                            {/* Item Icon */}
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '3px',
                                overflow: 'hidden',
                                border: `1px solid ${getQualityColor(resultItem.quality)}`,
                                boxShadow: `0 0 4px ${getQualityColor(resultItem.quality)}50`,
                                flexShrink: 0
                            }}>
                                <img
                                    src={resultItem.iconId ? getIconUrl(resultItem.iconId, 'items', true) :
                                        (resultItem.imageUrl && !resultItem.imageUrl.includes('wow.zamimg.com')) ? resultItem.imageUrl :
                                            getIconUrl('inv_misc_questionmark', 'items', true)}
                                    alt={resultItem.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = getIconUrl('inv_misc_questionmark', 'items', true);
                                    }}
                                />
                            </div>
                            {/* Item Name and Quantity */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    color: '#5a1e12',
                                    fontWeight: '700',
                                    fontSize: '13px',
                                    textShadow: 'none',
                                    fontFamily: 'Bookman Old Style, Garamond, serif',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {recipeData.resultQuantity > 1 ? `${recipeData.resultQuantity}x ` : ''}{resultItem.name}
                                </div>
                            </div>
                        </div>

                        {/* Show item details based on type */}
                        <div style={{ marginTop: '4px', fontSize: '11px', fontFamily: 'Crimson Text, serif' }}>
                            {/* Weapon Details */}
                            {resultItem.type === 'weapon' && resultItem.weaponStats && (
                                <>
                                    {resultItem.weaponStats.baseDamage && (
                                        <div style={{ color: '#5a1e12', marginBottom: '2px', fontWeight: '500' }}>
                                            Damage: <span style={{ fontWeight: '700', color: '#8b4513', textShadow: 'none' }}>
                                                {resultItem.weaponStats.baseDamage.display?.base ||
                                                    `${resultItem.weaponStats.baseDamage.diceCount}d${resultItem.weaponStats.baseDamage.diceType}`}
                                            </span>
                                            {resultItem.weaponStats.baseDamage.damageType && (
                                                <span style={{ color: '#8b4513', marginLeft: '4px', fontWeight: '600' }}>
                                                    {resultItem.weaponStats.baseDamage.damageType.toLowerCase()}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    {resultItem.combatStats?.range && (
                                        <div style={{ color: '#5a1e12', marginBottom: '2px', fontWeight: '500' }}>
                                            Range: <span style={{ color: '#8b4513', fontWeight: '600' }}>{resultItem.combatStats.range.display || `${resultItem.combatStats.range.value} ft`}</span>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Armor Details */}
                            {resultItem.type === 'armor' && (
                                <>
                                    {resultItem.combatStats?.armorClass && (
                                        <div style={{ color: '#5a1e12', marginBottom: '2px', fontWeight: '500' }}>
                                            Armor: <span style={{ fontWeight: '700', color: '#8b4513', textShadow: 'none' }}>{resultItem.combatStats.armorClass.value || resultItem.combatStats.armorClass}</span>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Consumable Effects */}
                            {resultItem.type === 'consumable' && (
                                <>
                                    {resultItem.combatStats?.healthRestore && (
                                        <div style={{ color: '#5a1e12', marginBottom: '2px', fontWeight: '500' }}>
                                            Restores <span style={{ fontWeight: '700', color: '#2d5016', textShadow: 'none' }}>{resultItem.combatStats.healthRestore.value}</span> Health
                                        </div>
                                    )}
                                    {resultItem.combatStats?.manaRestore && (
                                        <div style={{ color: '#5a1e12', marginBottom: '2px', fontWeight: '500' }}>
                                            Restores <span style={{ fontWeight: '700', color: '#2d5016', textShadow: 'none' }}>{resultItem.combatStats.manaRestore.value}</span> Mana
                                        </div>
                                    )}
                                    {resultItem.combatStats?.maxHealth && (
                                        <div style={{ color: '#5a1e12', marginBottom: '2px', fontWeight: '500' }}>
                                            +<span style={{ fontWeight: '700', color: '#2d5016', textShadow: 'none' }}>{resultItem.combatStats.maxHealth.value}</span> Health{' '}
                                            {resultItem.combatStats.maxHealth.duration ?
                                                <span style={{ color: '#8b4513', fontSize: '10px' }}>({Math.floor(resultItem.combatStats.maxHealth.duration / 60)}m)</span> :
                                                <span style={{ color: '#8b4513', fontSize: '10px' }}>(1h)</span>
                                            }
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Base Stat Bonuses (for all item types) */}
                            {resultItem.baseStats && Object.keys(resultItem.baseStats).length > 0 && (
                                <div style={{ color: '#5a1e12', marginBottom: '2px', fontWeight: '500' }}>
                                    {Object.entries(resultItem.baseStats).map(([stat, statData]) => {
                                        const value = typeof statData === 'object' ? statData.value : statData;
                                        const duration = typeof statData === 'object' && statData.duration ?
                                            <span style={{ color: '#8b4513', fontSize: '10px' }}> ({Math.floor(statData.duration / 60)}m)</span> : '';
                                        return <span key={stat}><span style={{ fontWeight: '700', color: '#2d5016', textShadow: 'none' }}>+{value}</span> {stat.charAt(0).toUpperCase() + stat.slice(1)}{duration}</span>;
                                    }).reduce((prev, curr, idx) => idx === 0 ? [curr] : [...prev, ', ', curr], [])}
                                </div>
                            )}

                            {/* Resistances */}
                            {resultItem.combatStats?.resistances && Object.keys(resultItem.combatStats.resistances).length > 0 && (
                                <div style={{ color: '#5a1e12', marginBottom: '2px', fontSize: '10px', fontWeight: '500' }}>
                                    Resist: {Object.entries(resultItem.combatStats.resistances).map(([type, value]) => {
                                        const resValue = typeof value === 'object' ? value.value : value;
                                        const isPercentage = typeof value === 'object' ? value.isPercentage === true : false;
                                        return <span key={type} style={{ marginRight: '4px', color: '#8b4513', fontWeight: '600' }}>{type}: {resValue}{isPercentage ? '%' : ''}</span>;
                                    })}
                                </div>
                            )}

                            {/* Immunities */}
                            {resultItem.immunities && resultItem.immunities.length > 0 && (
                                <div style={{ color: '#5a1e12', marginBottom: '2px', fontSize: '10px', fontWeight: '500' }}>
                                    Immune: <span style={{ color: '#8b4513', fontWeight: '600' }}>{resultItem.immunities.join(', ')}</span>
                                </div>
                            )}

                            {/* Reagent/Material Properties */}
                            {resultItem.type === 'miscellaneous' && resultItem.subtype === 'REAGENT' && (
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '6px',
                                    marginTop: '2px',
                                    padding: '3px 6px',
                                    backgroundColor: 'rgba(139, 69, 19, 0.12)',
                                    borderRadius: '3px',
                                    border: '1px solid rgba(139, 69, 19, 0.3)'
                                }}>
                                    {resultItem.reagentType && (
                                        <div style={{ color: '#5a1e12', fontSize: '10px', fontWeight: '600' }}>
                                            Type: <span style={{ color: '#8b4513', fontWeight: '700', textShadow: 'none' }}>{safeCapitalize(resultItem.reagentType)}</span>
                                        </div>
                                    )}
                                    {resultItem.magicType && (
                                        <div style={{ color: '#5a1e12', fontSize: '10px', fontWeight: '600' }}>
                                            Magic: <span style={{ color: getMagicTypeColor(resultItem.magicType), fontWeight: '700', textShadow: '0 1px 1px rgba(0, 0, 0, 0.5)' }}>{getMagicTypeName(resultItem.magicType)}</span>
                                        </div>
                                    )}
                                    {resultItem.reagentState && (
                                        <div style={{ color: '#5a1e12', fontSize: '10px', fontWeight: '600' }}>
                                            State: <span style={{ color: '#8b4513', fontWeight: '700', textShadow: 'none' }}>{safeCapitalize(resultItem.reagentState)}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Crafting Material Properties */}
                            {resultItem.type === 'miscellaneous' && resultItem.subtype === 'CRAFTING' && (
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '6px',
                                    marginTop: '2px',
                                    padding: '3px 6px',
                                    backgroundColor: 'rgba(139, 69, 19, 0.15)',
                                    borderRadius: '3px',
                                    border: '1px solid rgba(139, 69, 19, 0.4)'
                                }}>
                                    {resultItem.materialType && (
                                        <div style={{ color: '#5a1e12', fontSize: '10px', fontWeight: '600' }}>
                                            Material: <span style={{ color: '#8b4513', fontWeight: '700', textShadow: 'none' }}>{safeCapitalize(resultItem.materialType)}</span>
                                        </div>
                                    )}
                                    {resultItem.professions && resultItem.professions.length > 0 && (
                                        <div style={{ color: '#5a1e12', fontSize: '10px', fontWeight: '600' }}>
                                            Used by: <span style={{ color: '#8b4513', fontWeight: '700', textShadow: 'none' }}>{resultItem.professions.join(', ')}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Stack size and Sell price in a row */}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '10px' }}>
                                {resultItem.maxStackSize && resultItem.maxStackSize > 1 && (
                                    <div style={{ color: '#5a1e12', fontWeight: '600' }}>
                                        Stack: <span style={{ color: '#8b4513', fontWeight: '700', textShadow: 'none' }}>{resultItem.maxStackSize}</span>
                                    </div>
                                )}
                                {resultItem.value && (
                                    <div style={{ color: '#5a1e12', fontWeight: '600' }}>
                                        Sell: <span style={{ color: '#8b4513', fontWeight: '700', textShadow: 'none' }}>{formatCurrency(resultItem.value)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Required Materials */}
                {recipeData && recipeData.materials && recipeData.materials.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                        {/* Only show divider if there was a "Creates" section above */}
                        {(recipeData && resultItem) && (
                            <div style={{
                                borderTop: '1px solid rgba(139, 69, 19, 0.3)',
                                margin: '6px 0'
                            }}></div>
                        )}
                        <div style={{
                            color: '#b8860b',
                            fontWeight: '600',
                            fontSize: '11px',
                            marginBottom: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontFamily: 'Cinzel, Trajan Pro, serif',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                        }}>
                            Required Materials
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '3px',
                            fontSize: '11px',
                            fontFamily: 'Crimson Text, serif'
                        }}>
                            {recipeData.materials.map((material, index) => {
                                const materialItem = itemLibrary.find(i => i.id === material.itemId);

                                return (
                                    <div
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '3px 6px',
                                            backgroundColor: 'rgba(139, 69, 19, 0.12)',
                                            borderRadius: '3px',
                                            border: '1px solid rgba(139, 69, 19, 0.3)'
                                        }}
                                    >
                                        <span style={{
                                            color: '#5a1e12',
                                            minWidth: '24px',
                                            fontWeight: '700',
                                            fontFamily: 'Bookman Old Style, Garamond, serif',
                                            fontSize: '11px'
                                        }}>
                                            {material.quantity}x
                                        </span>
                                        <span style={{
                                            color: '#5a1e12',
                                            fontWeight: '700',
                                            fontFamily: 'Bookman Old Style, Garamond, serif',
                                            fontSize: '11px'
                                        }}>
                                            {materialItem?.name || material.itemId || 'Unknown Material'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Crafting Time and Experience - Compact inline */}
                {(recipeData?.craftingTime || recipeData?.experienceGained) && (
                    <div style={{ marginTop: '6px' }}>
                        <div style={{
                            borderTop: '1px solid rgba(139, 69, 19, 0.3)',
                            margin: '4px 0'
                        }}></div>
                        <div style={{
                            display: 'flex',
                            gap: '16px',
                            fontSize: '11px',
                            fontFamily: 'Crimson Text, serif',
                            padding: '2px 0'
                        }}>
                            {recipeData.craftingTime && recipeData.craftingTime > 0 && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <span style={{
                                        color: '#8b7355',
                                        fontWeight: '500'
                                    }}>Time:</span>
                                    <span style={{
                                        color: '#2d5016',
                                        fontWeight: '600',
                                        fontFamily: 'Bookman Old Style, Garamond, serif'
                                    }}>
                                        {(() => {
                                            const seconds = recipeData.craftingTime / 1000;
                                            const minutes = Math.floor(seconds / 60);
                                            const hours = Math.floor(minutes / 60);
                                            const days = Math.floor(hours / 24);

                                            if (days > 0) {
                                                const remainingHours = hours % 24;
                                                if (remainingHours > 0) {
                                                    return `${days}d ${remainingHours}h`;
                                                }
                                                return `${days}d`;
                                            }

                                            if (hours > 0) {
                                                const remainingMinutes = minutes % 60;
                                                if (remainingMinutes > 0) {
                                                    return `${hours}h ${remainingMinutes}m`;
                                                }
                                                return `${hours}h`;
                                            }

                                            if (minutes > 0) {
                                                const remainingSeconds = Math.floor(seconds % 60);
                                                if (remainingSeconds > 0) {
                                                    return `${minutes}m ${remainingSeconds}s`;
                                                }
                                                return `${minutes}m`;
                                            }

                                            return `${Math.floor(seconds)} sec`;
                                        })()}
                                    </span>
                                </div>
                            )}
                            {recipeData.experienceGained && recipeData.experienceGained > 0 && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <span style={{
                                        color: '#8b7355',
                                        fontWeight: '500'
                                    }}>XP:</span>
                                    <span style={{
                                        color: '#2d5016',
                                        fontWeight: '600',
                                        fontFamily: 'Bookman Old Style, Garamond, serif'
                                    }}>
                                        {recipeData.experienceGained}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Description - formatted like regular items */}
                {recipeData?.description && (
                    <div style={{ marginTop: '8px' }}>
                        <div style={{
                            borderTop: '1px solid rgba(139, 69, 19, 0.3)',
                            margin: '6px 0',
                            paddingTop: '6px'
                        }}></div>
                        <div className="item-description" style={{
                            color: '#4a3728',
                            fontSize: '14px',
                            fontStyle: 'italic',
                            lineHeight: '1.5',
                            fontFamily: 'Times New Roman, serif',
                            textShadow: '0 1px 1px rgba(255, 255, 255, 0.3)'
                        }}>
                            {recipeData.description}
                        </div>
                    </div>
                )}

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
                    {getDisplayName(item) || 'Currency'}
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
                            {item.currencyValue.platinum > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                                    <img
                                        src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
                                        alt="Platinum"
                                        className="coin-platinum"
                                        style={{ width: '20px', height: '20px', marginRight: '8px', borderRadius: '50%', border: '1px solid rgba(184, 197, 209, 0.5)' }}
                                    />
                                    <span style={{ color: '#e5e4e2' }}>{item.currencyValue.platinum} Platinum</span>
                                </div>
                            )}
                            {item.currencyValue.gold > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                                    <img
                                        src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
                                        alt="Gold"
                                        className="coin-gold"
                                        style={{ width: '20px', height: '20px', marginRight: '8px', borderRadius: '50%', border: '1px solid rgba(255, 215, 0, 0.5)' }}
                                    />
                                    <span style={{ color: '#ffd700' }}>{item.currencyValue.gold} Gold</span>
                                </div>
                            )}
                            {item.currencyValue.silver > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                                    <img
                                        src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
                                        alt="Silver"
                                        className="coin-silver"
                                        style={{ width: '20px', height: '20px', marginRight: '8px', borderRadius: '50%', border: '1px solid rgba(136, 136, 136, 0.5)' }}
                                    />
                                    <span style={{ color: '#c0c0c0' }}>{item.currencyValue.silver} Silver</span>
                                </div>
                            )}
                            {item.currencyValue.copper > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                                    <img
                                        src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
                                        alt="Copper"
                                        className="coin-copper"
                                        style={{ width: '20px', height: '20px', marginRight: '8px', borderRadius: '50%', border: '1px solid rgba(184, 115, 51, 0.5)' }}
                                    />
                                    <span style={{ color: '#cd7f32' }}>{item.currencyValue.copper} Copper</span>
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                                src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
                                alt="Currency"
                                className={`coin-${item.currencyType || 'gold'}`}
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



    // Get armor class value - check multiple possible locations
    const armorClassValue = getStatValue(item.armorClass) ||
        getStatValue(item.combatStats?.armorClass) ||
        getStatValue(item.combatStats?.armor) || 0;

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
            stat !== 'armor' &&
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
                    const isPercentage = data.isPercentage === true;
                    resistances.push({
                        type: type.toLowerCase(),
                        text: `+${data.value} ${type} Resistance`,
                        value: data.value,
                        resistanceType: 'value',
                        formatted: isPercentage
                            ? `Decreases ${type.toLowerCase()} damage taken by ${data.value}%.`
                            : `Decreases ${type.toLowerCase()} damage taken by ${data.value}.`,
                        color: '#8bc34a'
                    });
                }
            });
    }

    // Get condition modifiers
    const conditionModifiers = [];
    if (item.combatStats?.conditionModifiers) {
        Object.entries(item.combatStats.conditionModifiers)
            .filter(([_, data]) => data && data.modifier && data.modifier !== 'none')
            .forEach(([conditionId, data]) => {
                const condition = CONDITIONS[conditionId];
                const modifier = data.modifier;
                let formatted = '';
                let color = data.color || '#9e9e9e';

                switch (modifier) {
                    case 'advantage':
                        formatted = `Advantage on saves against ${condition?.name || conditionId}.`;
                        color = '#4caf50';
                        break;
                    case 'double_advantage':
                        formatted = `Double advantage on saves against ${condition?.name || conditionId}.`;
                        color = '#2e7d32';
                        break;
                    case 'disadvantage':
                        formatted = `Disadvantage on saves against ${condition?.name || conditionId}.`;
                        color = '#f44336';
                        break;
                    case 'double_disadvantage':
                        formatted = `Double disadvantage on saves against ${condition?.name || conditionId}.`;
                        color = '#c62828';
                        break;
                    case 'immune':
                        formatted = `Immune to ${condition?.name || conditionId}.`;
                        color = '#4caf50';
                        break;
                    default:
                        formatted = `No modifier for ${condition?.name || conditionId}.`;
                }

                conditionModifiers.push({
                    conditionId: conditionId,
                    conditionName: condition?.name || conditionId,
                    modifier: modifier,
                    formatted: formatted,
                    color: color
                });
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
    // Damage type colors matching character sheet - using frost not cold
    const damageTypeColors = {
        arcane: '#9370DB', // Purple - matches character sheet
        bludgeoning: '#8B4513', // Brown - matches character sheet
        chaos: '#ec4899', // Pink - matches character sheet
        fire: '#FF4500', // Orange-red - matches character sheet
        force: '#9370DB', // Purple - matches character sheet
        frost: '#87CEEB', // Light blue - matches character sheet (using frost, not cold)
        lightning: '#b8860b', // Gold - matches character sheet
        nature: '#228B22', // Forest green - matches character sheet
        necrotic: '#8B008B', // Dark magenta - matches character sheet
        piercing: '#708090', // Slate grey - matches character sheet
        poison: '#228B22', // Forest green - matches character sheet
        psychic: '#FF1493', // Deep pink - matches character sheet
        radiant: '#b8860b', // Gold - matches character sheet
        slashing: '#B22222', // Fire brick red - matches character sheet
        thunder: '#2563eb', // Bright blue
        void: '#1a1a2e' // Very dark blue - matches character sheet
    };

    // Check for chance-on-being-hit effects
    const hasOnHitEffects = item.combatStats?.onHitEffects?.enabled;
    const onHitEffectsConfig = item.combatStats?.onHitEffects;

    // Check if item has any effects
    const hasEffects = otherStats.length > 0 || utilityStats.length > 0 || spellDamageStats.length > 0 || hasCarryingCapacity || hasOnHitEffects || conditionModifiers.length > 0;

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
        (item.combatStats?.resistances && Object.keys(item.combatStats.resistances).length > 0) ||
        conditionModifiers.length > 0
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

    // WoW-style quality border colors
    const qualityBorderColors = {
        poor: '#9d9d9d',
        common: '#ffffff',
        uncommon: '#4a934a',
        rare: '#0070dd',
        epic: '#a335ee',
        legendary: '#ff8000',
        artifact: '#e6cc80'
    };
    const borderColor = qualityBorderColors[qualityLower] || qualityBorderColors.common;

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
            <div
                ref={titleContainerRef}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', minWidth: 0 }}
            >
                <div
                    className="item-icon-magical-bg"
                    data-quality={qualityLower}
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        border: `1px solid ${borderColor}`,
                        boxShadow: `0 0 6px ${borderColor}50`,
                        flexShrink: 0,
                        position: 'relative'
                    }}>
                    <img
                        src={(item.imageUrl && !item.imageUrl.includes('wow.zamimg.com')) ? item.imageUrl : (
                            (item.type === 'currency' || item.isCurrency)
                                ? getIconUrl('Container/Coins/golden-coin-single-isometric', 'items', true)
                                : (item.iconId ? getIconUrl(item.iconId, 'items', true) : getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items', true))
                        )}
                        alt={getDisplayName(item)}
                        className={(item.type === 'currency' || item.isCurrency) ? `coin-${item.currencyType || 'gold'}` : ''}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            position: 'relative',
                            zIndex: 1
                        }}
                        onError={(e) => {
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items', true);
                        }}
                    />
                </div>
                <div
                    ref={titleRef}
                    className={`item-name quality-${qualityLower} ${titleStyle.needsScrolling ? 'item-name-scrolling' : ''}`}
                    style={{
                        fontSize: titleStyle.fontSize,
                        whiteSpace: 'nowrap',
                        overflow: titleStyle.needsScrolling ? 'visible' : 'hidden',
                        textOverflow: titleStyle.needsScrolling ? 'clip' : 'ellipsis',
                        maxWidth: '100%',
                        minWidth: 0,
                        color: qualityColor, // Apply rarity color directly to the name
                        textShadow: qualityLower === 'uncommon'
                            ? '0 0 8px rgba(74, 147, 74, 0.6), 0 1px 2px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6)'
                            : `0 0 5px ${qualityColor}80, 0 1px 2px rgba(0, 0, 0, 0.8)`, // Add glow effect with better contrast
                        flex: 1
                    }}
                >
                    {titleStyle.needsScrolling ? (
                        <span
                            className="item-name-scroll-text"
                            style={{
                                '--scroll-distance': `-${titleStyle.scrollDistance}px`
                            }}
                        >
                            {getDisplayName(item) || 'Unknown Item'}
                        </span>
                    ) : (
                        getDisplayName(item) || 'Unknown Item'
                    )}
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
                <div className="item-type" style={{
                    marginBottom: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>Miscellaneous</span>
                    <span>
                        {(() => {
                            switch (item.subtype) {
                                case 'REAGENT': return 'Reagent';
                                case 'KEY': return 'Key';
                                case 'QUEST': return 'Quest';
                                case 'CRAFTING': return 'Crafting';
                                case 'TRADE_GOODS': return 'Trade';
                                case 'JUNK': return 'Junk';
                                case 'CONTAINER': return 'Container';
                                case 'recipe': return 'Recipe';
                                default: return 'Item';
                            }
                        })()}
                    </span>
                </div>
            ) : item.type === 'weapon' ? (
                <div className="item-type" style={{
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
                        {item.subtype ? (() => {
                            // Format subtype: split by underscore, capitalize each word
                            return item.subtype.split('_').map(word =>
                                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                            ).join(' ');
                        })() : ''}
                    </span>
                </div>
            ) : item.type === 'armor' ? (
                <div className="item-type" style={{
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
                                (item.subtype.split('_').map(word =>
                                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                                ).join(' ')) :
                                ''
                            )}
                    </span>
                </div>
            ) : item.type === 'accessory' ? (
                <div className="item-type" style={{
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
                <div className="item-type" style={{
                    marginBottom: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>Consumable</span>
                    <span>
                        {item.subtype ? item.subtype.split('_').map(word =>
                            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                        ).join(' ') : 'Potion'}
                    </span>
                </div>
            ) : item.type === 'clothing' ? (
                <div className="item-type" style={{
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
                <div className="item-type" style={{
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
                <div className="item-type" style={{
                    marginBottom: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>Container</span>
                    <span>
                        {item.subtype ? item.subtype.split('_').map(word =>
                            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                        ).join(' ') : 'Chest'}
                    </span>
                </div>
            ) : (
                <div style={{ color: '#888', marginBottom: '4px' }}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    {item.subtype && ` - ${item.subtype.split('_').map(word =>
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    ).join(' ')}`}
                </div>
            )}

            {/* Weapon Damage */}
            {item.type === 'weapon' && item.weaponStats && (
                <div style={{ marginBottom: '8px' }}>
                    {item.weaponStats.baseDamage && (
                        <div className="base-stat" style={{ display: 'inline' }}>
                            {item.weaponStats.baseDamage.display?.base || `${item.weaponStats.baseDamage.diceCount}d${item.weaponStats.baseDamage.diceType}`.replace('dd', 'd')}
                            {' '}
                            {item.weaponStats.baseDamage.damageType && (
                                <span style={{
                                    color: damageTypeColors[item.weaponStats.baseDamage.damageType.toLowerCase()] || '#dc2626',
                                    fontSize: 'inherit', // Match the font size of the dice roll
                                    fontWeight: '600'
                                }}>{item.weaponStats.baseDamage.damageType.charAt(0).toUpperCase() + item.weaponStats.baseDamage.damageType.slice(1).toLowerCase()} Damage</span>
                            )}
                            {item.weaponStats.baseDamage.bonusDamage > 0 && (
                                <>
                                    {' '}+{item.weaponStats.baseDamage.bonusDamage}
                                    {item.weaponStats.baseDamage.bonusDamageType && (
                                        <span style={{
                                            color: damageTypeColors[item.weaponStats.baseDamage.bonusDamageType?.toLowerCase()] || '#dc2626',
                                            fontSize: 'inherit', // Match the font size of the dice roll
                                            fontWeight: '600'
                                        }}> {item.weaponStats.baseDamage.bonusDamageType.charAt(0).toUpperCase() + item.weaponStats.baseDamage.bonusDamageType.slice(1).toLowerCase()} Damage</span>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                    {/* Display range for weapons */}
                    {item.combatStats?.range && (
                        <div className="combat-stat" style={{ marginTop: '4px' }}>
                            Range: {item.combatStats.range.display || `${item.combatStats.range.value} ft`}
                        </div>
                    )}
                </div>
            )}
            {/* Miscellaneous Properties */}
            {item.type === 'miscellaneous' && renderMiscInfo(getMiscTypeInfo(item))}



            {/* Consumable Immediate Effects */}
            {hasImmediateEffects && (
                <div style={{ marginTop: '8px', textAlign: 'left' }}>
                    <div style={{
                        color: '#8B4513',
                        fontWeight: '600',
                        fontSize: '15px',
                        marginBottom: '6px',
                        fontFamily: 'Bookman Old Style, Garamond, serif',
                        textAlign: 'left'
                    }}>On Immediate Use:</div>
                    {getStatValue(item.combatStats?.healthRestore) > 0 && (
                        <div className="base-stat" style={{ marginLeft: '0', paddingLeft: '0', textAlign: 'left' }}>
                            Restore <span style={{ fontWeight: 'normal' }}>{getStatValue(item.combatStats.healthRestore)}{isPercentage(item.combatStats.healthRestore) ? '%' : ''}</span> Health
                        </div>
                    )}
                    {getStatValue(item.combatStats?.manaRestore) > 0 && (
                        <div className="base-stat" style={{ marginLeft: '0', paddingLeft: '0', textAlign: 'left' }}>
                            Restore <span style={{ fontWeight: 'normal' }}>{getStatValue(item.combatStats.manaRestore)}{isPercentage(item.combatStats.manaRestore) ? '%' : ''}</span> Mana
                        </div>
                    )}
                    {hasRange && (
                        <div className="combat-stat" style={{ marginLeft: '0', paddingLeft: '0', textAlign: 'left' }}>
                            Range: <span style={{ fontWeight: 'normal' }}>{range.display || `${range.value} ft`}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Consumable Duration Effects */}
            {hasDurationEffects && (
                <div style={{ marginTop: '8px', textAlign: 'left' }}>
                    <div style={{
                        color: '#8B4513',
                        fontWeight: '600',
                        fontSize: '15px',
                        marginBottom: '6px',
                        fontFamily: 'Bookman Old Style, Garamond, serif',
                        textAlign: 'left'
                    }}>
                        For the duration of <span style={{ color: '#5a1e12', fontWeight: 'normal' }}>{getStatValue(item.utilityStats?.duration) || 1}</span> <span style={{ color: '#5a1e12', fontWeight: 'normal' }}>{
                            (item.utilityStats?.duration?.type === 'ROUNDS' ? 'rounds' : 'minutes')
                        }</span> you gain the following:
                    </div>

                    {/* Base Stats */}
                    {baseStats.map(({ name, value, isPercentage }) => (
                        <div key={name} className="base-stat" style={{ marginLeft: '0', paddingLeft: '0' }}>
                            {value >= 0 ? 'Increases' : 'Decreases'} your {name} by <span style={{ fontWeight: 'normal' }}>{Math.abs(value)}{isPercentage ? '%' : ''}</span>
                        </div>
                    ))}

                    {/* Armor for consumables */}
                    {armorClassValue > 0 && (
                        <div className="base-stat" style={{ marginLeft: '0', paddingLeft: '0' }}>
                            Increases your Armor by <span style={{ fontWeight: 'normal' }}>{armorClassValue}</span>
                        </div>
                    )}

                    {/* Other Effects */}
                    {otherStats.map(({ description }) => (
                        <div key={description} className="base-stat" style={{ marginLeft: '0', paddingLeft: '0' }}>
                            {description}
                        </div>
                    ))}

                    {/* Utility Effects */}
                    {utilityStats.map(({ description }) => (
                        <div key={description} className="base-stat" style={{ marginLeft: '0', paddingLeft: '0' }}>
                            {description}
                        </div>
                    ))}

                    {/* Spell Damage for consumables */}
                    {spellDamageStats.map(({ name, value, isPercentage }) => (
                        <div key={name} className="base-stat" style={{ marginLeft: '0', paddingLeft: '0' }}>
                            Increases <span style={{
                                color: damageTypeColors[name.toLowerCase()] || '#5a1e12',
                                fontWeight: '600'
                            }}>
                                {name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}
                            </span> damage dealt by spells and abilities by <span style={{ fontWeight: 'normal' }}>{isPercentage ? `${value}%` : `up to ${value}`}</span>
                        </div>
                    ))}

                    {/* Carrying Capacity for consumables */}
                    {hasCarryingCapacity && (
                        <div className="base-stat" style={{ marginLeft: '0', paddingLeft: '0' }}>
                            Adds <span style={{ fontWeight: 'normal' }}>{carryingCapacity.slots}</span> additional inventory slot{carryingCapacity.slots !== 1 ? 's' : ''}
                        </div>
                    )}

                    {/* Resistances */}
                    {resistances.map((resistance, index) => (
                        <div key={index} className="base-stat" style={{ marginLeft: '0', paddingLeft: '0' }}>
                            <span style={{
                                color: damageTypeColors[resistance.type] || '#5a1e12',
                                fontWeight: '600'
                            }}>
                                {resistance.formatted || (resistance.text.includes('Resistant')
                                    ? `Increases your resistance against ${resistance.type.charAt(0).toUpperCase() + resistance.type.slice(1)} damage by ${resistance.value || 4}.`
                                    : `Immune to ${resistance.type.charAt(0).toUpperCase() + resistance.type.slice(1)} damage and effects.`)}
                            </span>
                        </div>
                    ))}

                    {/* Condition Modifiers */}
                    {conditionModifiers.map((modifier, index) => {
                        const condition = CONDITIONS[modifier.conditionId];
                        return (
                            <div key={index} className="base-stat" style={{ marginLeft: '0', paddingLeft: '0' }}>
                                <span style={{
                                    color: modifier.color,
                                    fontWeight: '600'
                                }}>
                                    {modifier.formatted}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Non-Consumable Effects */}
            {item.type !== 'consumable' && (
                <>
                    {/* Armor - Display before base stats */}
                    {armorClassValue > 0 && (
                        <div style={{ color: '#ffffff', marginBottom: '8px', fontSize: '0.95em' }}>
                            <strong>Armor {armorClassValue}</strong>
                        </div>
                    )}

                    {/* Base Stats */}
                    {baseStats.map(({ name, value, isPercentage }) => (
                        <div key={name} style={{ color: '#ffffff' }}>
                            {isPercentage
                                ? `+${value}% ${name}`
                                : `${value >= 0 ? '+' : ''}${value} ${name}`}
                        </div>
                    ))}

                    {/* On Equip section - show if there are any effects including resistances */}
                    {(resistances.length > 0 || conditionModifiers.length > 0 || otherStats.length > 0 || utilityStats.length > 0 || spellDamageStats.length > 0 || hasCarryingCapacity) && (
                        <div style={{
                            color: '#8B4513',
                            fontWeight: '600',
                            fontSize: '15px',
                            borderBottom: '1px solid rgba(139, 69, 19, 0.3)',
                            margin: '8px 0',
                            paddingBottom: '2px',
                            fontFamily: 'Bookman Old Style, Garamond, serif'
                        }}>
                            On Equip:
                        </div>
                    )}

                    {/* Resistances - enhanced display */}
                    {resistances.map((resistance, index) => (
                        <div key={index} className="base-stat" style={{}}>
                            <span style={{
                                color: damageTypeColors[resistance.type] || '#5a1e12',
                                fontWeight: '600'
                            }}>
                                {resistance.formatted}
                            </span>
                        </div>
                    ))}

                    {/* Condition Modifiers */}
                    {conditionModifiers.map((modifier, index) => {
                        const condition = CONDITIONS[modifier.conditionId];
                        return (
                            <div key={index} className="base-stat" style={{}}>
                                <span style={{
                                    color: modifier.color,
                                    fontWeight: '600'
                                }}>
                                    {modifier.formatted}
                                </span>
                            </div>
                        );
                    })}

                    {/* Other Stats */}
                    {otherStats.map(({ description }) => (
                        <div key={description} className="base-stat" style={{}}>
                            {description}
                        </div>
                    ))}

                    {/* Utility Stats */}
                    {utilityStats.map(({ description }) => (
                        <div key={description} className="base-stat" style={{}}>
                            {description}
                        </div>
                    ))}

                    {/* Spell Damage */}
                    {spellDamageStats.map(({ name, value, isPercentage }) => (
                        <div key={name} className="base-stat" style={{}}>
                            Increases <span style={{
                                color: damageTypeColors[name.toLowerCase()] || '#5a1e12',
                                fontWeight: '600'
                            }}>
                                {name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}
                            </span> damage dealt by spells and abilities by
                            {isPercentage ? ` ${value}%` : ` up to ${value}`}.
                        </div>
                    ))}

                    {/* Carrying Capacity */}
                    {hasCarryingCapacity && (
                        <div className="base-stat" style={{}}>
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
                                {/* New inline effect structure */}
                                {onHitEffectsConfig.effect?.effectConfig ? (
                                    <>
                                        {' '}
                                        <span style={{ color: '#a335ee' }}>
                                            {onHitEffectsConfig.effect.effectConfig.description || (() => {
                                                // Helper to format names
                                                const formatName = (name) => {
                                                    if (!name) return '';
                                                    return name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                                                };
                                                // Generate description from effect config
                                                const eff = onHitEffectsConfig.effect;
                                                const cfg = eff.effectConfig;
                                                const target = cfg.targetType === 'self' ? 'yourself' : cfg.targetType === 'area' ? `all within ${cfg.areaRadius || 10}ft` : 'the attacker';

                                                switch (eff.effectType) {
                                                    case 'damage':
                                                        if (cfg.isDot) {
                                                            return `Deal ${cfg.formula || '1d6'} ${formatName(cfg.damageType || 'fire')} damage to ${target} each ${cfg.dotTickFrequency || 'round'} for ${cfg.dotDuration || 3} rounds`;
                                                        }
                                                        return `Deal ${cfg.formula || '1d6'} ${formatName(cfg.damageType || 'fire')} damage to ${target}`;
                                                    case 'healing':
                                                        if (cfg.isHot) {
                                                            return `Heal ${target} for ${cfg.healingFormula || '1d8'} each ${cfg.hotTickFrequency || 'round'} for ${cfg.hotDuration || 3} rounds`;
                                                        }
                                                        if (cfg.grantsTempHP) {
                                                            return `Grant ${target} ${cfg.healingFormula || '1d8'} temporary hit points`;
                                                        }
                                                        return `Heal ${target} for ${cfg.healingFormula || '1d8'}`;
                                                    case 'buff':
                                                        return `Grant ${target} +${cfg.statModifier?.magnitude || 2} ${formatName(cfg.statModifier?.stat || 'armor')} for ${cfg.durationValue || 2} ${cfg.durationType || 'rounds'}`;
                                                    case 'debuff':
                                                        return `Reduce ${target}'s ${formatName(cfg.statModifier?.stat || 'speed')} by ${cfg.statModifier?.magnitude || 2} (DC ${cfg.saveDC || 14} ${formatName(cfg.saveType || 'constitution')})`;
                                                    case 'control':
                                                        return `${formatName(cfg.controlType || 'stun')} ${target} for ${cfg.controlDuration || 1} round${cfg.controlDuration !== 1 ? 's' : ''} (DC ${cfg.saveDC || 14})`;
                                                    default:
                                                        return 'an effect';
                                                }
                                            })()}
                                        </span>
                                        {' when hit.'}
                                    </>
                                ) : onHitEffectsConfig.spellEffect ? (
                                    /* Legacy spell library reference */
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
                <div className="item-merchant-notes" style={{ marginTop: '12px' }}>
                    {item.description}
                </div>
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
                    fontSize: '14px',
                    fontFamily: 'Bookman Old Style, Garamond, serif'
                }}>
                    {typeof item.value === 'object' ? (
                        <>
                            {(parseInt(item.value.platinum) || 0) > 0 && (
                                <span style={{ marginRight: '4px' }}>
                                    <span className="currency-number">{parseInt(item.value.platinum) || 0}</span>
                                    <span style={{
                                        color: '#d4d4d4',
                                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
                                        fontWeight: '600'
                                    }}> Platinum</span>
                                </span>
                            )}
                            {(parseInt(item.value.gold) || 0) > 0 && (
                                <span style={{ marginRight: '4px' }}>
                                    <span className="currency-number">{parseInt(item.value.gold) || 0}</span>
                                    <span style={{
                                        color: '#ffed4e',
                                        textShadow: '0 0 4px rgba(255, 237, 78, 0.5), 0 1px 2px rgba(0, 0, 0, 0.6)',
                                        fontWeight: '600'
                                    }}> Gold</span>
                                </span>
                            )}
                            {(parseInt(item.value.silver) || 0) > 0 && (
                                <span style={{ marginRight: '4px' }}>
                                    <span className="currency-number">{parseInt(item.value.silver) || 0}</span>
                                    <span style={{
                                        color: '#e8e8e8',
                                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
                                        fontWeight: '600'
                                    }}> Silver</span>
                                </span>
                            )}
                            {(parseInt(item.value.copper) || 0) > 0 && (
                                <span style={{ marginRight: '4px' }}>
                                    <span className="currency-number">{parseInt(item.value.copper) || 0}</span>
                                    <span style={{
                                        color: '#d4a574',
                                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
                                        fontWeight: '600'
                                    }}> Copper</span>
                                </span>
                            )}
                            {(!(parseInt(item.value.platinum) || 0) && !(parseInt(item.value.gold) || 0) && !(parseInt(item.value.silver) || 0) && !(parseInt(item.value.copper) || 0)) && (
                                <span>
                                    <span className="currency-number">0</span>
                                    <span style={{
                                        color: '#d4a574',
                                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
                                        fontWeight: '600'
                                    }}> Copper</span>
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

export default memo(ItemTooltip);
