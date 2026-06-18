import React from 'react';
import { BASE_STATS } from '../itemWizardConfig';
import { getIconUrl } from '../../../utils/assetManager';
import { getCustomIconUrl } from '../../../utils/assetManager';
import { CONDITIONS } from '../../../data/conditionsData';

const StepStats = ({ itemData, updateItemData }) => {
                if (itemData.type === 'currency') {
                    return (
                        <>
                            <h3 className="wow-heading quality-text">Currency Amount</h3>
                            <div className="currency-amount-section">
                                <div className="currency-amount-display">
                                    <img
                                        src={getIconUrl(itemData.iconId || 'Container/Coins/golden-coin-single-isometric', 'items')}
                                        alt={itemData.name}
                                        className="currency-icon-large"
                                    />
                                    <div className="currency-info">
                                        <h4>{itemData.name || 'Currency'}</h4>
                                        <p>{itemData.description || 'A currency item'}</p>
                                    </div>
                                </div>

                                <div className="currency-amount-config">
                                    <div className="currency-value-control">
                                        <label>Amount:</label>
                                        <div className="stat-input-group">
                                            <button
                                                className="stat-button"
                                                onClick={() => updateItemData({
                                                    currencyValue: Math.max(1, (itemData.currencyValue || 1) - 1)
                                                })}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={itemData.currencyValue || 1}
                                                onChange={(e) => updateItemData({
                                                    currencyValue: Math.max(1, parseInt(e.target.value) || 1)
                                                })}
                                                className="stat-input wow-input"
                                            />
                                            <button
                                                className="stat-button"
                                                onClick={() => updateItemData({
                                                    currencyValue: (itemData.currencyValue || 1) + 1
                                                })}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="currency-type-display">
                                        <p>When looted, this will add {itemData.currencyValue || 1} {itemData.currencyType || 'gold'} to the player's currency.</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    );
                } else if (itemData.type === 'miscellaneous' && itemData.subtype === 'QUEST') {
                    return (
                        <>
                            <h3 className="wow-heading">Quest Properties</h3>
                            <div className="misc-properties quest-properties">
                                {/* Quest Giver Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Armor/Chest/chest-bone-plated-vest', 'items')}
                                            alt="Quest Giver"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Quest Giver</label>
                                    </div>
                                    <input
                                        type="text"
                                        value={itemData.questGiver || ''}
                                        onChange={(e) => updateItemData({ questGiver: e.target.value })}
                                        className="wow-input"
                                        placeholder="Who gave this quest item?"
                                    />
                                </div>

                                {/* Required Level Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Misc/Books/book-golden-star-red-bookmark', 'items')}
                                            alt="Required Level"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Required Level</label>
                                    </div>
                                    <div className="level-input-group">
                                        <button
                                            className="level-button"
                                            onClick={() => {
                                                const newLevel = Math.max(0, (itemData.requiredLevel || 0) - 1);
                                                updateItemData({ requiredLevel: newLevel });
                                            }}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={itemData.requiredLevel || 0}
                                            onChange={(e) => updateItemData({ requiredLevel: Math.max(0, parseInt(e.target.value) || 0) })}
                                            className="wow-input"
                                            min="0"
                                        />
                                        <button
                                            className="level-button"
                                            onClick={() => {
                                                const newLevel = (itemData.requiredLevel || 0) + 1;
                                                updateItemData({ requiredLevel: newLevel });
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Quest Objectives Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Utility/Winding Path', 'abilities')}
                                            alt="Quest Objectives"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Quest Objectives</label>
                                    </div>
                                    <textarea
                                        value={itemData.questObjectives || ''}
                                        onChange={(e) => updateItemData({ questObjectives: e.target.value })}
                                        className="wow-input objectives-input"
                                        placeholder="What needs to be done with this item?"
                                        rows={3}
                                    />
                                </div>

                                {/* Quest Chain Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Utility/Metal Chain', 'abilities')}
                                            alt="Quest Chain"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Quest Chain</label>
                                    </div>
                                    <input
                                        type="text"
                                        value={itemData.questChain || ''}
                                        onChange={(e) => updateItemData({ questChain: e.target.value })}
                                        className="wow-input"
                                        placeholder="Part of which quest chain?"
                                    />
                                </div>

                                {/* Time Limit Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Utility/Slow Speed', 'abilities')}
                                            alt="Time Limit"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Time Limit</label>
                                    </div>
                                    <div className="time-limit-group">
                                        <div className="time-input-wrapper">
                                            <button
                                                className="time-button"
                                                onClick={() => {
                                                    const newTime = Math.max(0, (itemData.timeLimit || 0) - 5);
                                                    updateItemData({ timeLimit: newTime });
                                                }}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={itemData.timeLimit || 0}
                                                onChange={(e) => updateItemData({ timeLimit: Math.max(0, parseInt(e.target.value) || 0) })}
                                                className="wow-input"
                                                min="0"
                                            />
                                            <button
                                                className="time-button"
                                                onClick={() => {
                                                    const newTime = (itemData.timeLimit || 0) + 5;
                                                    updateItemData({ timeLimit: newTime });
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="time-unit">minutes (0 for no limit)</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    );
                } else if (itemData.type === 'miscellaneous' && itemData.subtype === 'REAGENT') {
                    // Define the magic types within the scope
                    const MAGIC_TYPES = {
                        fire: {
                            name: 'Fire Magic',
                            icon: 'Fire/Flame Burst',
                            description: 'Magic of flame and heat',
                            color: '#ff4400'
                        },
                        cold: {
                            name: 'Frost Magic',
                            icon: 'Frost/Dripping Ice',
                            description: 'Magic of ice and cold',
                            color: '#3399ff'
                        },
                        lightning: {
                            name: 'Lightning Magic',
                            icon: 'Lightning/Lightning Bolt',
                            description: 'Magic of storms and electricity',
                            color: '#ffff00'
                        },
                        acid: {
                            name: 'Acid Magic',
                            icon: 'Poison/Poison Venom',
                            description: 'Magic of corrosion and dissolution',
                            color: '#00ff00'
                        },
                        force: {
                            name: 'Force Magic',
                            icon: 'Force/Force Touch',
                            description: 'Pure magical energy',
                            color: '#ff66ff'
                        },
                        necrotic: {
                            name: 'Death Magic',
                            icon: 'Necrotic/Necrotic Skull',
                            description: 'Magic of death and decay',
                            color: '#4B0082'
                        },
                        radiant: {
                            name: 'Radiant Magic',
                            icon: 'Radiant/Radiant Sunburst',
                            description: 'Magic of light and divine energy',
                            color: '#FFFACD'
                        },
                        poison: {
                            name: 'Poison Magic',
                            icon: 'Poison/Poison Venom',
                            description: 'Magic of toxins and venom',
                            color: '#008000'
                        },
                        psychic: {
                            name: 'Mind Magic',
                            icon: 'Psychic/Brain Psionics',
                            description: 'Magic of thoughts and consciousness',
                            color: '#FF00FF'
                        },
                        thunder: {
                            name: 'Thunder Magic',
                            icon: 'Lightning/Lightning Storm',
                            description: 'Magic of sound and concussive force',
                            color: '#0066ff'
                        }
                    };

                    const PRESERVATION_METHODS = {
                        dried: {
                            name: 'Dried',
                            icon: 'Nature/Maple Leaf',
                            description: 'Preserved through careful drying process'
                        },
                        fresh: {
                            name: 'Fresh',
                            icon: 'Nature/Single Leaf',
                            description: 'Must be used while fresh'
                        },
                        powdered: {
                            name: 'Powdered',
                            icon: 'items/Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-mortar-pestle-beige-bowl-brown-pestle',
                            description: 'Ground into a fine powder'
                        },
                        distilled: {
                            name: 'Distilled',
                            icon: 'items/Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-bottle-skull-design-eye-sockets-nose-beige-upper',
                            description: 'Refined through distillation'
                        },
                        crystallized: {
                            name: 'Crystallized',
                            icon: 'Frost/Ice Shards',
                            description: 'Formed into magical crystals'
                        },
                        preserved: {
                            name: 'Magically Preserved',
                            icon: 'Arcane/Magical Cross Emblem 2',
                            description: 'Kept fresh through magical means'
                        }
                    };

                    return (
                        <>
                            <h3 className="wow-heading">Reagent Properties</h3>
                            <div className="misc-properties">
                                {/* Magic Type Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Radiant/Holy Cross', 'abilities')}
                                            alt="Magic Type"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Magic Type</label>
                                    </div>
                                    <div className="magic-type-grid">
                                        {Object.entries(MAGIC_TYPES).map(([type, info]) => (
                                            <button
                                                key={type}
                                                className={`magic-type-button ${itemData.magicType === type ? 'selected' : ''}`}
                                                onClick={() => updateItemData({ magicType: type })}
                                                style={{
                                                    '--magic-color': info.color
                                                }}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, info.icon?.startsWith('items/') ? 'items' : 'abilities')}
                                                    alt={info.name}
                                                    className="magic-icon"
                                                />
                                                <div className="magic-info">
                                                    <span className="magic-name">{info.name}</span>
                                                    <span className="magic-description">{info.description}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Required For Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Radiant/Holy Cross', 'abilities')}
                                            alt="Required For"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Required For</label>
                                    </div>
                                    <textarea
                                        value={itemData.requiredFor || ''}
                                        onChange={(e) => updateItemData({ requiredFor: e.target.value })}
                                        className="wow-input"
                                        placeholder="What spells require this reagent?"
                                        rows={3}
                                    />
                                </div>

                                {/* Quantity Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Container/Bag/brown-backpack-sleeping-bag', 'items')}
                                            alt="Quantity"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Quantity Per Cast</label>
                                    </div>
                                    <div className="quantity-input-group">
                                        <button
                                            className="quantity-button"
                                            onClick={() => updateItemData({
                                                quantityPerUse: Math.max(1, (itemData.quantityPerUse || 1) - 1)
                                            })}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={itemData.quantityPerUse || 1}
                                            onChange={(e) => updateItemData({
                                                quantityPerUse: Math.max(1, parseInt(e.target.value) || 1)
                                            })}
                                            className="wow-input"
                                            min="1"
                                        />
                                        <button
                                            className="quantity-button"
                                            onClick={() => updateItemData({
                                                quantityPerUse: (itemData.quantityPerUse || 1) + 1
                                            })}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Magical Properties Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Radiant/Holy Cross', 'abilities')}
                                            alt="Magical Properties"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Magical Properties</label>
                                    </div>
                                    <textarea
                                        value={itemData.magicalProperties || ''}
                                        onChange={(e) => updateItemData({ magicalProperties: e.target.value })}
                                        className="wow-input"
                                        placeholder="Describe the magical properties of this reagent..."
                                        rows={3}
                                    />
                                </div>

                                {/* Source Location Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Utility/Winding Path', 'abilities')}
                                            alt="Source"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Source Location</label>
                                    </div>
                                    <textarea
                                        value={itemData.source || ''}
                                        onChange={(e) => updateItemData({ source: e.target.value })}
                                        className="wow-input"
                                        placeholder="Where can this reagent be found?"
                                        rows={3}
                                    />
                                </div>

                                {/* Preservation Method Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Utility/Utility Tool', 'abilities')}
                                            alt="Preservation"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Preservation Method</label>
                                    </div>
                                    <div className="preservation-grid">
                                        {Object.entries(PRESERVATION_METHODS).map(([method, info]) => (
                                            <button
                                                key={method}
                                                className={`preservation-button ${itemData.preservationMethod === method ? 'selected' : ''}`}
                                                onClick={() => updateItemData({ preservationMethod: method })}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, 'abilities')}
                                                    alt={info.name}
                                                    className="preservation-icon"
                                                />
                                                <div className="preservation-info">
                                                    <span className="preservation-name">{info.name}</span>
                                                    <span className="preservation-description">{info.description}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    );

                } else if (itemData.type === 'miscellaneous' && itemData.subtype === 'CRAFTING') {
                    // Define material types with icons and descriptions
                    const MATERIAL_TYPES = {
                        metal: {
                            name: 'Metal',
                            icon: 'Misc/Profession Resources/Mining/resource-ore-chunk-teal-brown-patches',
                            description: 'Raw metals and ore for smithing'
                        },
                        wood: {
                            name: 'Wood',
                            icon: 'Misc/Profession Resources/Woodworking/resource-pile-logs-wooden',
                            description: 'Timber and wooden materials'
                        },
                        cloth: {
                            name: 'Cloth',
                            icon: 'Armor/Chest/chest-tattered-brown-robe',
                            description: 'Fabrics and textile materials'
                        },
                        leather: {
                            name: 'Leather',
                            icon: 'Misc/Profession Resources/Tailoring/resource-rolled-brown-leather-fabric',
                            description: 'Treated animal hides and skins'
                        },
                        stone: {
                            name: 'Stone',
                            icon: 'Misc/Profession Resources/Blacksmithing/resource-block-worn-cracked-brown',
                            description: 'Raw stone and minerals'
                        },
                        gem: {
                            name: 'Gem',
                            icon: 'Currency/blue-oval-crystal',
                            description: 'Precious and semi-precious stones'
                        },
                        bone: {
                            name: 'Bone',
                            icon: 'Misc/Monster Parts/Bones/bone-fragment-curved-jagged-grey',
                            description: 'Creature bones and ivory'
                        },
                        hide: {
                            name: 'Hide',
                            icon: 'Misc/Monster Parts/monster-part-shell-fragment-grey-segmented',
                            description: 'Untreated animal pelts'
                        },
                        herb: {
                            name: 'Herb',
                            icon: 'Nature/Single Leaf',
                            description: 'Medicinal and magical plants'
                        }
                    };

                    // Define professions with icons
                    const PROFESSIONS = {
                        Alchemy: {
                            icon: 'items/Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-bottle-skull-design-eye-sockets-nose-beige-upper',
                            description: 'Create potions and elixirs'
                        },
                        Blacksmithing: {
                            icon: 'items/Misc/Profession Resources/Blacksmithing/resource-anvil-blacksmith-brown-base',
                            description: 'Forge weapons and armor'
                        },
                        Leatherworking: {
                            icon: 'items/Misc/Profession Resources/Tailoring/resource-rolled-brown-leather-fabric',
                            description: 'Craft leather goods and armor'
                        },
                        Tailoring: {
                            icon: 'Utility/Utility Item',
                            description: 'Create cloth items and garments'
                        },
                        Engineering: {
                            icon: 'Utility/Golden Toothed Gear',
                            description: 'Build mechanical devices'
                        },
                        Enchanting: {
                            icon: 'Arcane/Magical Staff',
                            description: 'Enhance items with magic'
                        },
                        Jewelcrafting: {
                            icon: 'items/Currency/blue-oval-crystal',
                            description: 'Cut and socket precious gems'
                        },
                        Inscription: {
                            icon: 'Utility/Winding Path',
                            description: 'Create magical scrolls and glyphs'
                        },
                        Woodworking: {
                            icon: 'items/Misc/Profession Resources/Woodworking/resource-pile-logs-wooden',
                            description: 'Craft wooden items and tools'
                        }
                    };

                    // Define gathering methods with icons
                    const GATHERING_METHODS = {
                        mining: {
                            name: 'Mining',
                            icon: 'items/Misc/Profession Resources/Blacksmithing/resource-pickaxe-metallic-grey-brown-handle',
                            description: 'Extracted from mineral deposits'
                        },
                        herbalism: {
                            name: 'Herbalism',
                            icon: 'abilities/Nature/Single Leaf',
                            description: 'Gathered from wild plants'
                        },
                        skinning: {
                            name: 'Skinning',
                            icon: 'items/Misc/Monster Parts/monster-part-shell-fragment-grey-segmented',
                            description: 'Harvested from creatures'
                        },
                        logging: {
                            name: 'Logging',
                            icon: 'Utility/Spiral Shell',
                            description: 'Cut from trees and plants'
                        },
                        scavenging: {
                            name: 'Scavenging',
                            icon: 'Utility/Utility Item',
                            description: 'Found in the wilderness'
                        },
                        fishing: {
                            name: 'Fishing',
                            icon: 'Utility/Swirling Current',
                            description: 'Caught in waters'
                        },
                        quarrying: {
                            name: 'Quarrying',
                            icon: 'Utility/Scaled Armor General',
                            description: 'Extracted from stone deposits'
                        }
                    };

                    return (
                        <>
                            <h3 className="wow-heading">Crafting Material Properties</h3>
                            <div className="misc-properties">
                                {/* Material Type Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Container/Bag/brown-backpack-sleeping-bag', 'items')}
                                            alt="Material Type"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Material Type</label>
                                    </div>
                                    <div className="magic-type-grid">
                                        {Object.entries(MATERIAL_TYPES).map(([type, info]) => (
                                            <button
                                                key={type}
                                                className={`magic-type-button ${itemData.materialType === type ? 'selected' : ''}`}
                                                onClick={() => updateItemData({ materialType: type })}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon, info.icon?.startsWith('items/') || info.icon?.includes('/') && !info.icon?.startsWith('Nature/') && !info.icon?.startsWith('Fire/') && !info.icon?.startsWith('Frost/') && !info.icon?.startsWith('Lightning/') && !info.icon?.startsWith('Arcane/') && !info.icon?.startsWith('Necrotic/') ? 'items' : 'abilities')}
                                                    alt={info.name}
                                                    className="magic-icon"
                                                />
                                                <div className="magic-info">
                                                    <span className="magic-name">{info.name}</span>
                                                    <span className="magic-description">{info.description}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Professions Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Utility/Golden Toothed Gear', 'abilities')}
                                            alt="Required Professions"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Required Professions</label>
                                    </div>
                                    <div className="magic-type-grid">
                                        {Object.entries(PROFESSIONS).map(([profession, info]) => (
                                            <button
                                                key={profession}
                                                className={`magic-type-button ${itemData.professions?.includes(profession) ? 'selected' : ''}`}
                                                onClick={() => {
                                                    const professions = itemData.professions || [];
                                                    if (professions.includes(profession)) {
                                                        updateItemData({
                                                            professions: professions.filter(p => p !== profession)
                                                        });
                                                    } else {
                                                        updateItemData({
                                                            professions: [...professions, profession]
                                                        });
                                                    }
                                                }}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon.replace(/^items\//, '').replace(/^abilities\//, ''), info.icon?.startsWith('items/') ? 'items' : 'abilities')}
                                                    alt={profession}
                                                    className="magic-icon"
                                                />
                                                <div className="magic-info">
                                                    <span className="magic-name">{profession}</span>
                                                    <span className="magic-description">{info.description}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Gathering Method Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Utility/Jigsaw Saw Tool', 'abilities')}
                                            alt="Gathering Method"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Gathering Method</label>
                                    </div>
                                    <div className="magic-type-grid">
                                        {Object.entries(GATHERING_METHODS).map(([method, info]) => (
                                            <button
                                                key={method}
                                                className={`magic-type-button ${itemData.gatheringMethod === method ? 'selected' : ''}`}
                                                onClick={() => updateItemData({ gatheringMethod: method })}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon.replace(/^items\//, '').replace(/^abilities\//, ''), info.icon?.startsWith('items/') ? 'items' : 'abilities')}
                                                    alt={info.name}
                                                    className="magic-icon"
                                                />
                                                <div className="magic-info">
                                                    <span className="magic-name">{info.name}</span>
                                                    <span className="magic-description">{info.description}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Recipes Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Utility/Winding Path', 'abilities')}
                                            alt="Recipes"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Used in Recipes</label>
                                    </div>
                                    <textarea
                                        value={itemData.recipes || ''}
                                        onChange={(e) => updateItemData({ recipes: e.target.value })}
                                        className="wow-input"
                                        placeholder="List the items that can be crafted with this material..."
                                        rows={3}
                                    />
                                </div>

                                {/* Source Locations Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Utility/Winding Path', 'abilities')}
                                            alt="Source Locations"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Source Locations</label>
                                    </div>
                                    <textarea
                                        value={itemData.sourceLocations || ''}
                                        onChange={(e) => updateItemData({ sourceLocations: e.target.value })}
                                        className="wow-input"
                                        placeholder="Where can this material be found?"
                                        rows={3}
                                    />
                                </div>

                                {/* Special Properties Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Arcane/Magical Cross Emblem 2', 'abilities')}
                                            alt="Special Properties"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Special Properties</label>
                                    </div>
                                    <textarea
                                        value={itemData.specialProperties || ''}
                                        onChange={(e) => updateItemData({ specialProperties: e.target.value })}
                                        className="wow-input"
                                        placeholder="Any unique properties or characteristics of this material..."
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </>
                    );
                } else if (itemData.type === 'miscellaneous' && itemData.subtype === 'TRADE_GOODS') {
                    const TRADE_CATEGORIES = {
                        textiles: {
                            name: 'Textiles',
                            icon: 'items/Armor/Chest/chest-tattered-brown-robe',
                            description: 'Fine cloths and fabrics'
                        },
                        spices: {
                            name: 'Spices',
                            icon: 'items/Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-mortar-pestle-beige-bowl-brown-pestle',
                            description: 'Rare seasonings and flavors'
                        },
                        metals: {
                            name: 'Precious Metals',
                            icon: 'items/Misc/Profession Resources/Mining/Gold Ore',
                            description: 'Valuable metals and alloys'
                        },
                        gems: {
                            name: 'Gemstones',
                            icon: 'items/Currency/blue-oval-crystal',
                            description: 'Precious and semi-precious stones'
                        },
                        food: {
                            name: 'Food & Beverages',
                            icon: 'Utility/Strange Brew',
                            description: 'Exotic foods and drinks'
                        },
                        art: {
                            name: 'Art & Artifacts',
                            icon: 'Utility/Alchemical Symbol',
                            description: 'Cultural treasures and artwork'
                        },
                        exotic: {
                            name: 'Exotic Goods',
                            icon: 'Utility/Gem And Gold Chains',
                            description: 'Rare and unusual items'
                        },
                        luxury: {
                            name: 'Luxury Items',
                            icon: 'items/Armor/Finger/finger-golden-decorative-ring',
                            description: 'High-end merchandise'
                        }
                    };

                    const DEMAND_LEVELS = {
                        low: {
                            name: 'Low Demand',
                            icon: 'items/Currency/gold-coins-stack-seven',
                            description: 'Limited market interest'
                        },
                        moderate: {
                            name: 'Moderate Demand',
                            icon: 'items/Currency/gold-nugget-pile',
                            description: 'Steady market interest'
                        },
                        high: {
                            name: 'High Demand',
                            icon: 'items/Currency/gold-ingot-stack',
                            description: 'Strong market interest'
                        },
                        very_high: {
                            name: 'Very High Demand',
                            icon: 'Utility/Summit Victory',
                            description: 'Exceptional market demand'
                        },
                        extreme: {
                            name: 'Extreme Demand',
                            icon: 'Utility/Golden Shield',
                            description: 'Overwhelming market demand'
                        }
                    };

                    const QUALITY_GRADES = {
                        poor: {
                            name: 'Poor',
                            icon: 'Utility/Broken Shield',
                            description: 'Below market standard'
                        },
                        standard: {
                            name: 'Standard',
                            icon: 'items/Currency/blue-crystal-shard',
                            description: 'Meets market expectations'
                        },
                        fine: {
                            name: 'Fine',
                            icon: 'Utility/Melting Crystal Shard',
                            description: 'Above average quality'
                        },
                        superior: {
                            name: 'Superior',
                            icon: 'Utility/Golden Toothed Gear',
                            description: 'Exceptional quality'
                        },
                        masterwork: {
                            name: 'Masterwork',
                            icon: 'Frost/Ice Shards',
                            description: 'Finest possible quality'
                        }
                    };

                    return (
                        <>
                            <h3 className="wow-heading">Trade Goods Properties</h3>
                            <div className="misc-properties">
                                {/* Trade Category Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Utility/Golden Toothed Gear', 'abilities')}
                                            alt="Trade Category"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Trade Category</label>
                                    </div>
                                    <div className="magic-type-grid">
                                        {Object.entries(TRADE_CATEGORIES).map(([category, info]) => (
                                            <button
                                                key={category}
                                                className={`magic-type-button ${itemData.tradeCategory === category ? 'selected' : ''}`}
                                                onClick={() => updateItemData({ tradeCategory: category })}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon.replace(/^items\//, '').replace(/^abilities\//, ''), info.icon?.startsWith('items/') ? 'items' : 'abilities')}
                                                    alt={info.name}
                                                    className="magic-icon"
                                                />
                                                <div className="magic-info">
                                                    <span className="magic-name">{info.name}</span>
                                                    <span className="magic-description">{info.description}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>



                                {/* Origin Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Utility/Winding Path', 'abilities')}
                                            alt="Origin"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Origin</label>
                                    </div>
                                    <textarea
                                        value={itemData.origin || ''}
                                        onChange={(e) => updateItemData({ origin: e.target.value })}
                                        className="wow-input"
                                        placeholder="Where does this trade good come from?"
                                        rows={2}
                                    />
                                </div>

                                {/* Demand Level Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Utility/Golden Shield', 'abilities')}
                                            alt="Demand Level"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Demand Level</label>
                                    </div>
                                    <div className="magic-type-grid">
                                        {Object.entries(DEMAND_LEVELS).map(([level, info]) => (
                                            <button
                                                key={level}
                                                className={`magic-type-button ${itemData.demandLevel === level ? 'selected' : ''}`}
                                                onClick={() => updateItemData({ demandLevel: level })}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon.replace(/^items\//, '').replace(/^abilities\//, ''), info.icon?.startsWith('items/') ? 'items' : 'abilities')}
                                                    alt={info.name}
                                                    className="magic-icon"
                                                />
                                                <div className="magic-info">
                                                    <span className="magic-name">{info.name}</span>
                                                    <span className="magic-description">{info.description}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quality Grade Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Utility/Melting Crystal Shard', 'abilities')}
                                            alt="Quality Grade"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Quality Grade</label>
                                    </div>
                                    <div className="magic-type-grid">
                                        {Object.entries(QUALITY_GRADES).map(([grade, info]) => (
                                            <button
                                                key={grade}
                                                className={`magic-type-button ${itemData.qualityGrade === grade ? 'selected' : ''}`}
                                                onClick={() => updateItemData({ qualityGrade: grade })}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon.replace(/^items\//, '').replace(/^abilities\//, ''), info.icon?.startsWith('items/') ? 'items' : 'abilities')}
                                                    alt={info.name}
                                                    className="magic-icon"
                                                />
                                                <div className="magic-info">
                                                    <span className="magic-name">{info.name}</span>
                                                    <span className="magic-description">{info.description}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Merchant Notes Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Utility/Winding Path', 'abilities')}
                                            alt="Merchant Notes"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Merchant Notes</label>
                                    </div>
                                    <textarea
                                        value={itemData.merchantNotes || ''}
                                        onChange={(e) => updateItemData({ merchantNotes: e.target.value })}
                                        className="wow-input"
                                        placeholder="Special trading information, preferred merchants, market conditions..."
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </>
                    );
                } else if (itemData.type === 'miscellaneous' && itemData.subtype === 'KEY') {
                    const KEY_TYPES = {
                        door: {
                            name: 'Door Key',
                            icon: 'items/Misc/Profession Resources/Blacksmithing/resource-key-metallic-brown-beige',
                            description: 'Opens locked doors and passages'
                        },
                        chest: {
                            name: 'Chest Key',
                            icon: 'items/Misc/Profession Resources/Blacksmithing/resource-key-metallic-brown-beige',
                            description: 'Unlocks treasure chests and containers'
                        },
                        gate: {
                            name: 'Gate Key',
                            icon: 'items/Misc/Profession Resources/Blacksmithing/resource-key-metallic-brown-beige',
                            description: 'Opens large gates and barriers'
                        },
                        magical: {
                            name: 'Magical Key',
                            icon: 'Arcane/Magical Staff',
                            description: 'Opens magically sealed entrances'
                        },
                        puzzle: {
                            name: 'Puzzle Key',
                            icon: 'items/Misc/Profession Resources/Blacksmithing/resource-dark-metallic-ore-chunk-rust',
                            description: 'Solves mechanical puzzles and mechanisms'
                        },
                        portal: {
                            name: 'Portal Key',
                            icon: 'Arcane/Open Portal',
                            description: 'Activates magical portals and gateways'
                        }
                    };

                    const SECURITY_LEVELS = {
                        basic: {
                            name: 'Basic Security',
                            icon: 'items/Misc/Profession Resources/Blacksmithing/resource-key-metallic-brown-beige',
                            description: 'Simple mechanical lock'
                        },
                        advanced: {
                            name: 'Advanced Security',
                            icon: 'items/Misc/Profession Resources/Blacksmithing/resource-chain-metallic-bronze-links',
                            description: 'Complex locking mechanism'
                        },
                        master: {
                            name: 'Master Security',
                            icon: 'Utility/Golden Toothed Gear',
                            description: 'Highly sophisticated security'
                        },
                        magical: {
                            name: 'Magical Security',
                            icon: 'Arcane/Magical Cross Emblem 2',
                            description: 'Protected by magical wards'
                        },
                        artifact: {
                            name: 'Artifact Security',
                            icon: 'Arcane/Ornate Staff',
                            description: 'Ancient and powerful protection'
                        }
                    };

                    return (
                        <>
                            <h3 className="wow-heading">Key Properties</h3>
                            <div className="misc-properties">
                                {/* Key Type Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Utility/Blue Door', 'abilities')}
                                            alt="Key Type"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Key Type</label>
                                    </div>
                                    <div className="magic-type-grid">
                                        {Object.entries(KEY_TYPES).map(([type, info]) => (
                                            <button
                                                key={type}
                                                className={`magic-type-button ${itemData.keyType === type ? 'selected' : ''}`}
                                                onClick={() => updateItemData({ keyType: type })}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon.replace(/^items\//, '').replace(/^abilities\//, ''), info.icon?.startsWith('items/') ? 'items' : 'abilities')}
                                                    alt={info.name}
                                                    className="magic-icon"
                                                />
                                                <div className="magic-info">
                                                    <span className="magic-name">{info.name}</span>
                                                    <span className="magic-description">{info.description}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Unlocks Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Utility/Blue Door', 'abilities')}
                                            alt="Unlocks"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Unlocks</label>
                                    </div>
                                    <textarea
                                        value={itemData.unlocks || ''}
                                        onChange={(e) => updateItemData({ unlocks: e.target.value })}
                                        className="wow-input"
                                        placeholder="What does this key unlock?"
                                        rows={2}
                                    />
                                </div>

                                {/* Location Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Utility/Winding Path', 'abilities')}
                                            alt="Location"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Location</label>
                                    </div>
                                    <textarea
                                        value={itemData.location || ''}
                                        onChange={(e) => updateItemData({ location: e.target.value })}
                                        className="wow-input"
                                        placeholder="Where is this key used?"
                                        rows={2}
                                    />
                                </div>

                                {/* Security Level Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Misc/Profession Resources/Blacksmithing/resource-dark-metallic-ore-chunk-rust', 'items')}
                                            alt="Security Level"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Security Level</label>
                                    </div>
                                    <div className="magic-type-grid">
                                        {Object.entries(SECURITY_LEVELS).map(([level, info]) => (
                                            <button
                                                key={level}
                                                className={`magic-type-button ${itemData.securityLevel === level ? 'selected' : ''}`}
                                                onClick={() => updateItemData({ securityLevel: level })}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon.replace(/^items\//, '').replace(/^abilities\//, ''), info.icon?.startsWith('items/') ? 'items' : 'abilities')}
                                                    alt={info.name}
                                                    className="magic-icon"
                                                />
                                                <div className="magic-info">
                                                    <span className="magic-name">{info.name}</span>
                                                    <span className="magic-description">{info.description}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Key Usage Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Utility/Blue Door', 'abilities')}
                                            alt="Key Usage"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Key Usage</label>
                                    </div>
                                    <div className="key-usage-options">
                                        <div className="usage-option">
                                            <div className="checkbox-group wow-checkbox-container">
                                                <input
                                                    type="checkbox"
                                                    id="oneTimeUse"
                                                    checked={itemData.oneTimeUse || false}
                                                    onChange={(e) => updateItemData({ oneTimeUse: e.target.checked })}
                                                    className="wow-checkbox"
                                                />
                                                <label htmlFor="oneTimeUse" className="usage-label">
                                                    <span className="usage-title">Single Use Only</span>
                                                    <span className="usage-description">Key breaks or becomes unusable after one use</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="usage-note">
                                            <span className="note-text">
                                                {itemData.oneTimeUse
                                                    ? "This key will be destroyed after use"
                                                    : "This key can be used multiple times"
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Special Instructions Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Utility/Winding Path', 'abilities')}
                                            alt="Special Instructions"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Special Instructions</label>
                                    </div>
                                    <textarea
                                        value={itemData.specialInstructions || ''}
                                        onChange={(e) => updateItemData({ specialInstructions: e.target.value })}
                                        className="wow-input"
                                        placeholder="Any special instructions or notes about using this key..."
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </>
                    );
                } else if (itemData.type === 'miscellaneous' && itemData.subtype === 'JUNK') {
                    const JUNK_TYPES = {
                        bones: {
                            name: 'Creature Bones',
                            icon: 'items/Misc/Monster Parts/Bones/bone-fragment-curved-jagged-grey',
                            description: 'Skeletal remains and fragments',
                            examples: 'Large Bone, Cracked Skull, Ribcage'
                        },
                        parts: {
                            name: 'Creature Parts',
                            icon: 'items/Misc/Monster Parts/Organs/organ-eye-monster-green-yellow',
                            description: 'Various creature organs and parts',
                            examples: 'Murloc Eye, Wolf Heart, Spider Fang'
                        },
                        scraps: {
                            name: 'Metal Scraps',
                            icon: 'items/Misc/Profession Resources/Blacksmithing/resource-three-dark-nails-metallic',
                            description: 'Broken metal pieces and fragments',
                            examples: 'Scrap Metal, Bent Sprocket, Rusty Gear'
                        },
                        cloth: {
                            name: 'Tattered Cloth',
                            icon: 'items/Armor/Chest/chest-tattered-brown-robe',
                            description: 'Worn fabric and rags',
                            examples: 'Torn Cloth, Frayed Robe, Old Belt'
                        },
                        scales: {
                            name: 'Scales & Shells',
                            icon: 'items/Misc/Monster Parts/monster-part-shell-fragment-grey-segmented',
                            description: 'Creature scales and shell pieces',
                            examples: 'Cracked Shell, Small Scale, Carapace Fragment'
                        },
                        trinkets: {
                            name: 'Broken Trinkets',
                            icon: 'items/Armor/Finger/finger-golden-decorative-ring',
                            description: 'Damaged ornaments and baubles',
                            examples: 'Cracked Pendant, Bent Ring, Tarnished Locket'
                        },
                        remains: {
                            name: 'Creature Remains',
                            icon: 'items/Misc/Monster Parts/Bones/bone-hand-skeletal-reach-gesture',
                            description: 'Miscellaneous creature bits',
                            examples: 'Slime Sample, Zombie Dust, Bat Wing'
                        },
                        minerals: {
                            name: 'Poor Minerals',
                            icon: 'items/Misc/Profession Resources/Mining/resource-ore-chunk-teal-brown-patches',
                            description: 'Low-quality stone and minerals',
                            examples: 'Flawed Stone, Rock Shard, Mineral Fragment'
                        }
                    };

                    const CONDITIONS = {
                        intact: {
                            name: 'Intact',
                            icon: 'items/Currency/blue-crystal-shard',
                            description: 'Whole but worthless'
                        },
                        damaged: {
                            name: 'Damaged',
                            icon: 'items/Misc/Profession Resources/Blacksmithing/resource-three-dark-nails-metallic',
                            description: 'Cracked or broken'
                        },
                        partial: {
                            name: 'Partial',
                            icon: 'items/Misc/Monster Parts/Bones/bone-fragment-curved-jagged-grey',
                            description: 'Only a piece remains'
                        },
                        decaying: {
                            name: 'Decaying',
                            icon: 'Necrotic/Necrotic Skull',
                            description: 'Rotting or decomposing'
                        }
                    };

                    return (
                        <>
                            <h3 className="wow-heading">Junk Properties</h3>
                            <div className="misc-properties">
                                {/* Junk Type Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('Misc/Monster Parts/Bones/bone-fragment-curved-jagged-grey', 'items')}
                                            alt="Junk Type"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Junk Type</label>
                                    </div>
                                    <div className="magic-type-grid">
                                        {Object.entries(JUNK_TYPES).map(([type, info]) => (
                                            <button
                                                key={type}
                                                className={`magic-type-button ${itemData.junkType === type ? 'selected' : ''}`}
                                                onClick={() => updateItemData({ junkType: type })}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon.replace(/^items\//, '').replace(/^abilities\//, ''), info.icon?.startsWith('items/') ? 'items' : 'abilities')}
                                                    alt={info.name}
                                                    className="magic-icon"
                                                />
                                                <div className="magic-info">
                                                    <span className="magic-name">{info.name}</span>
                                                    <span className="magic-description">{info.description}</span>
                                                    <span className="magic-description" style={{ fontStyle: 'italic', fontSize: '0.8em' }}>
                                                        Examples: {info.examples}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Condition Section */}
                                <div className="property-section">
                                    <div className="property-header">
                                        <img
                                            src={getIconUrl('items/Misc/Profession Resources/Blacksmithing/resource-three-dark-nails-metallic', 'items')}
                                            alt="Condition"
                                            className="property-icon"
                                        />
                                        <label className="wow-text">Condition</label>
                                    </div>
                                    <div className="magic-type-grid">
                                        {Object.entries(CONDITIONS).map(([condition, info]) => (
                                            <button
                                                key={condition}
                                                className={`magic-type-button ${itemData.condition === condition ? 'selected' : ''}`}
                                                onClick={() => updateItemData({ condition: condition })}
                                            >
                                                <img
                                                    src={info.icon?.startsWith('http') ? info.icon : getCustomIconUrl(info.icon.replace(/^items\//, '').replace(/^abilities\//, ''), info.icon?.startsWith('items/') ? 'items' : 'abilities')}
                                                    alt={info.name}
                                                    className="magic-icon"
                                                />
                                                <div className="magic-info">
                                                    <span className="magic-name">{info.name}</span>
                                                    <span className="magic-description">{info.description}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    );
                }
                // Don't show base stats for miscellaneous items
                if (itemData.type === 'miscellaneous') {
                    return (
                        <>
                            <h3 className="wow-heading quality-text">Miscellaneous Details</h3>
                            <div className="spell-wizard-step-content" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                minHeight: '200px',
                                padding: '2rem'
                            }}>
                                <p className="wow-text" style={{
                                    fontSize: '1.2em',
                                    lineHeight: '1.6',
                                    color: '#d4af37',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                                    fontStyle: 'italic'
                                }}>
                                    Ah, a curious trinket of unknown origin and mysterious purpose. Choose a category above to imbue it with specific qualities, or proceed to determine its worth and visual splendor.
                                </p>
                            </div>
                        </>
                    );
                }
                return (
                    <>
                        <h3 className="wow-heading quality-text">Base Stats</h3>
                        <div className="stats-grid">
                            {Object.entries(BASE_STATS).map(([stat, info]) => (
                                <div key={stat} className="stat-item">
                                    <div className="stat-header">
                                        <img src={info.icon} alt={info.name} className="stat-icon" />
                                        <label className="stat-label wow-text">{info.name}</label>
                                    </div>
                                    <div className="stat-input-group">
                                        <button
                                            className="stat-button"
                                            onClick={() => {
                                                const newStats = { ...itemData.baseStats };
                                                newStats[stat] = {
                                                    ...newStats[stat],
                                                    value: newStats[stat].value - 1
                                                };
                                                updateItemData({ baseStats: newStats });
                                            }}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={itemData.baseStats[stat].value}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                const newStats = { ...itemData.baseStats };
                                                newStats[stat] = {
                                                    ...newStats[stat],
                                                    value: val
                                                };
                                                updateItemData({ baseStats: newStats });
                                            }}
                                            className="stat-input wow-input"
                                        />
                                        <button
                                            className="stat-button"
                                            onClick={() => {
                                                const newStats = { ...itemData.baseStats };
                                                newStats[stat] = {
                                                    ...newStats[stat],
                                                    value: newStats[stat].value + 1
                                                };
                                                updateItemData({ baseStats: newStats });
                                            }}
                                        >
                                            +
                                        </button>
                                        <button
                                            className={`type-toggle ${itemData.baseStats[stat].isPercentage ? 'active' : ''}`}
                                            onClick={() => {
                                                const newStats = { ...itemData.baseStats };
                                                newStats[stat] = {
                                                    ...newStats[stat],
                                                    isPercentage: !newStats[stat].isPercentage
                                                };
                                                updateItemData({ baseStats: newStats });
                                            }}
                                        >
                                            {itemData.baseStats[stat].isPercentage ? '%' : '#'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                );
};

export default StepStats;
