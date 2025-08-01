import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useCharacterStore from '../../store/characterStore';
import useInventoryStore from '../../store/inventoryStore';
import { useInspectionCharacter } from '../../contexts/InspectionContext';
import StatTooltip from '../tooltips/StatTooltip';
import ResistanceTooltip from '../tooltips/ResistanceTooltip';
import GeneralStatTooltip from '../tooltips/GeneralStatTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import ItemTooltip from '../item-generation/ItemTooltip';
import UnequipContextMenu from '../equipment/UnequipContextMenu';
import ClassResourceBar from '../hud/ClassResourceBar';
import { createInventoryItem, isOffHandDisabled } from '../../utils/equipmentUtils';
import { calculateDerivedStats } from '../../utils/characterUtils';
import { getClassResourceConfig, getResourceDisplayText } from '../../data/classResources';
import { getRaceList, getSubraceList } from '../../data/raceData';
import '../../styles/character-sheet.css';
import '../../styles/resistance-styles.css';
import '../../styles/racial-traits.css';



const ResourceBar = ({ current, max, className, label, resourceType, onUpdate, tooltipPosition, setTooltipPosition }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [controlsPosition, setControlsPosition] = useState({ x: 0, y: 0 });
    const percentage = (current / max) * 100;

    const handleMouseEnter = (e) => {
        setIsHovered(true);
        setTooltipPosition({
            x: e.clientX + 15,
            y: e.clientY - 10
        });
    };

    const handleMouseMove = (e) => {
        setTooltipPosition({
            x: e.clientX + 15,
            y: e.clientY - 10
        });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleBarClick = (e) => {
        if (!showControls) {
            // Calculate position for the controls popup
            const rect = e.currentTarget.getBoundingClientRect();
            const x = rect.left;
            const y = rect.bottom + 8; // Position below the bar with some spacing

            // Ensure the popup stays within viewport
            const popupWidth = 200; // Approximate width of controls
            const popupHeight = 100; // Approximate height of controls

            const adjustedX = Math.min(x, window.innerWidth - popupWidth - 20);
            const adjustedY = Math.min(y, window.innerHeight - popupHeight - 20);

            setControlsPosition({ x: adjustedX, y: adjustedY });
        }
        setShowControls(!showControls);
    };

    const handleAdjustment = (amount) => {
        const newValue = Math.max(0, Math.min(max, current + amount));
        onUpdate(resourceType, newValue, max);
    };

    const handleInputSubmit = () => {
        const value = parseInt(inputValue);
        if (!isNaN(value)) {
            const newValue = Math.max(0, Math.min(max, value));
            onUpdate(resourceType, newValue, max);
        }
        setInputValue('');
        setShowControls(false);
    };

    const handleInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleInputSubmit();
        } else if (e.key === 'Escape') {
            setInputValue('');
            setShowControls(false);
        }
    };

    const getTooltipContent = () => {
        switch(resourceType) {
            case 'health':
                return {
                    title: 'Health Points',
                    description: 'Your life force. When reduced to 0, you fall unconscious and must make death saving throws. Click to adjust.'
                };
            case 'mana':
                return {
                    title: 'Mana Points',
                    description: 'Your magical energy used to cast spells and activate magical abilities. Click to adjust.'
                };
            case 'actionPoints':
                return {
                    title: 'Action Points',
                    description: 'Points used to perform actions in combat. Refreshes at the start of your turn. Click to adjust.'
                };
            default:
                return null;
        }
    };

    const tooltipContent = getTooltipContent();

    return (
        <div className="resource-bar-container">
            <div className="resource-bar-header">
                <span className="resource-bar-label">{label}</span>
                <span className="resource-bar-values">{current} / {max}</span>
            </div>

            <div
                className="resource-bar-wrapper"
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleBarClick}
            >
                <div className={`resource-bar-track ${className}`}>
                    <div className="resource-bar-fill" style={{ width: `${percentage}%` }} />
                </div>
            </div>

            {showControls && ReactDOM.createPortal(
                <div
                    className="resource-controls"
                    style={{
                        left: controlsPosition.x,
                        top: controlsPosition.y,
                        pointerEvents: 'auto'
                    }}
                >
                        <div className="resource-controls-header">
                            <span className="resource-controls-title">Adjust {label}</span>
                            <button
                                className="resource-controls-close"
                                onClick={() => setShowControls(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="resource-adjustment-buttons">
                            <button onClick={() => handleAdjustment(-10)} className="adjust-btn">-10</button>
                            <button onClick={() => handleAdjustment(-5)} className="adjust-btn">-5</button>
                            <button onClick={() => handleAdjustment(-1)} className="adjust-btn">-1</button>
                            <button onClick={() => handleAdjustment(1)} className="adjust-btn">+1</button>
                            <button onClick={() => handleAdjustment(5)} className="adjust-btn">+5</button>
                            <button onClick={() => handleAdjustment(10)} className="adjust-btn">+10</button>
                        </div>
                        <div className="resource-input-section">
                            <input
                                type="number"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleInputKeyPress}
                                placeholder={`Set to...`}
                                className="resource-input"
                                min="0"
                                max={max}
                            />
                            <button onClick={handleInputSubmit} className="set-btn">Set</button>
                        </div>
                    </div>,
                document.body
            )}

            {isHovered && tooltipContent && (
                <TooltipPortal>
                    <div
                        className="equipment-slot-tooltip"
                        style={{
                            position: 'fixed',
                            left: tooltipPosition.x,
                            top: tooltipPosition.y,
                            transform: 'translate(10px, -50%)',
                            pointerEvents: 'none',
                            zIndex: 999999999
                        }}
                    >
                        <div className="equipment-slot-name">
                            {tooltipContent.title}
                        </div>
                        <div className="equipment-slot-description">
                            {tooltipContent.description}
                        </div>
                    </div>
                </TooltipPortal>
            )}
        </div>
    );
};

export default function CharacterPanel() {
    // Use inspection context if available, otherwise use regular character store
    const inspectionData = useInspectionCharacter();
    const characterStore = useCharacterStore();

    // Choose data source based on whether we're in inspection mode
    const dataSource = inspectionData || characterStore;

    const {
        equipment,
        stats,
        equipmentBonuses,
        derivedStats,
        health,
        mana,
        actionPoints,
        classResource,
        name,
        race,
        subrace,
        racialTraits = [],
        racialLanguages = [],
        racialSpeed,
        class: characterClass,
        level,
        alignment,
        exhaustionLevel,
        updateEquipment,
        updateCharacterInfo,
        updateResource,
        unequipItem,
        immunities = [] // Default to empty array if not provided
    } = dataSource;

    // State for navigation
    const [activeSection, setActiveSection] = useState('character');

    // Define sections for navigation
    const sections = {
        character: {
            title: 'Character Info',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg'
        },
        equipment: {
            title: 'Equipment',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_chest_plate06.jpg'
        },
        resources: {
            title: 'Resources',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_54.jpg'
        }
    };

    // Inventory store for adding unequipped items back to inventory
    const { addItem } = useInventoryStore(state => ({
        addItem: state.addItem
    }));

    const [hoveredSlot, setHoveredSlot] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipDelay, setTooltipDelay] = useState(null);
    const [unequipContextMenu, setUnequipContextMenu] = useState({ visible: false, x: 0, y: 0, item: null, slotName: null });

    useEffect(() => {
        return () => {
            if (tooltipDelay) {
                clearTimeout(tooltipDelay);
            }
        };
    }, [tooltipDelay]);

    const updateTooltipPosition = (e) => {
        // Position tooltip near cursor but with a small offset
        setTooltipPosition({
            x: e.clientX + 15,
            y: e.clientY - 10
        });
    };

    // Render character info section
    const renderCharacterInfo = () => (
        <div className="character-info-content">
            <div className="character-identity-section">
                <div className="character-name-section">
                    <label className="character-field-label">Character Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => updateCharacterInfo('name', e.target.value)}
                        className="character-field-input"
                        placeholder="Enter character name"
                        maxLength={30}
                    />
                </div>

                <div className="character-details-grid">
                    <div className="character-field">
                        <label className="character-field-label">Race</label>
                        <select
                            value={race}
                            onChange={(e) => updateCharacterInfo('race', e.target.value)}
                            className="character-field-input"
                        >
                            <option value="">Select a race</option>
                            {getRaceList().map(raceOption => (
                                <option key={raceOption.id} value={raceOption.id}>
                                    {raceOption.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="character-field">
                        <label className="character-field-label">Subrace</label>
                        <select
                            value={subrace}
                            onChange={(e) => updateCharacterInfo('subrace', e.target.value)}
                            className="character-field-input"
                            disabled={!race}
                        >
                            <option value="">Select a subrace</option>
                            {race && getSubraceList(race).map(subraceOption => (
                                <option key={subraceOption.id} value={subraceOption.id}>
                                    {subraceOption.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="character-field">
                        <label className="character-field-label">Class</label>
                        <select
                            value={characterClass}
                            onChange={(e) => updateCharacterInfo('class', e.target.value)}
                            className="character-field-input"
                        >
                            <option value="">Select a class</option>
                            <option value="Pyrofiend">Pyrofiend</option>
                            <option value="Minstrel">Minstrel</option>
                            <option value="Chronarch">Chronarch</option>
                            <option value="Chaos Weaver">Chaos Weaver</option>
                            <option value="Fate Weaver">Fate Weaver</option>
                            <option value="Gambler">Gambler</option>
                            <option value="Martyr">Martyr</option>
                            <option value="False Prophet">False Prophet</option>
                            <option value="Exorcist">Exorcist</option>
                            <option value="Plaguebringer">Plaguebringer</option>
                            <option value="Lichborne">Lichborne</option>
                            <option value="Deathcaller">Deathcaller</option>
                            <option value="Spellguard">Spellguard</option>
                            <option value="Inscriptor">Inscriptor</option>
                            <option value="Arcanoneer">Arcanoneer</option>
                            <option value="Witch Doctor">Witch Doctor</option>
                            <option value="Formbender">Formbender</option>
                            <option value="Primalist">Primalist</option>
                            <option value="Berserker">Berserker</option>
                            <option value="Dreadnaught">Dreadnaught</option>
                            <option value="Titan">Titan</option>
                            <option value="Toxicologist">Toxicologist</option>
                            <option value="Covenbane">Covenbane</option>
                            <option value="Bladedancer">Bladedancer</option>
                            <option value="Lunarch">Lunarch</option>
                            <option value="Huntress">Huntress</option>
                            <option value="Warden">Warden</option>
                        </select>
                    </div>

                    <div className="character-field">
                        <label className="character-field-label">Level</label>
                        <input
                            type="number"
                            min="1"
                            max="20"
                            value={level}
                            onChange={(e) => updateCharacterInfo('level', parseInt(e.target.value) || 1)}
                            className="character-field-input"
                        />
                    </div>

                    <div className="character-field">
                        <label className="character-field-label">Alignment</label>
                        <select
                            value={alignment}
                            onChange={(e) => updateCharacterInfo('alignment', e.target.value)}
                            className="character-field-select"
                        >
                            <option value="Lawful Good">Lawful Good</option>
                            <option value="Neutral Good">Neutral Good</option>
                            <option value="Chaotic Good">Chaotic Good</option>
                            <option value="Lawful Neutral">Lawful Neutral</option>
                            <option value="True Neutral">True Neutral</option>
                            <option value="Chaotic Neutral">Chaotic Neutral</option>
                            <option value="Lawful Evil">Lawful Evil</option>
                            <option value="Neutral Evil">Neutral Evil</option>
                            <option value="Chaotic Evil">Chaotic Evil</option>
                        </select>
                    </div>

                    <div className="character-field">
                        <label className="character-field-label">Exhaustion Level</label>
                        <select
                            value={exhaustionLevel}
                            onChange={(e) => updateCharacterInfo('exhaustionLevel', parseInt(e.target.value))}
                            className="character-field-select"
                        >
                            <option value={0}>None</option>
                            <option value={1}>Level 1</option>
                            <option value={2}>Level 2</option>
                            <option value={3}>Level 3</option>
                            <option value={4}>Level 4</option>
                            <option value={5}>Level 5</option>
                            <option value={6}>Level 6</option>
                        </select>
                    </div>
                </div>

                {/* Racial Traits Section */}
                {racialTraits.length > 0 && (
                    <div className="racial-traits-section">
                        <h3 className="racial-traits-title">Racial Traits</h3>
                        <div className="racial-traits-grid">
                            {racialTraits.map((trait, index) => (
                                <div key={index} className="racial-trait-card">
                                    <div className="racial-trait-header">
                                        <h4 className="racial-trait-name">{trait.name}</h4>
                                        <span className="racial-trait-type" data-type={trait.type}>{trait.type}</span>
                                    </div>
                                    <p className="racial-trait-description">{trait.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Additional Racial Information */}
                        <div className="racial-info-grid">
                            {racialLanguages.length > 0 && (
                                <div className="racial-info-item">
                                    <label className="racial-info-label">Languages:</label>
                                    <span className="racial-info-value">{racialLanguages.join(', ')}</span>
                                </div>
                            )}
                            {racialSpeed && (
                                <div className="racial-info-item">
                                    <label className="racial-info-label">Speed:</label>
                                    <span className="racial-info-value">{racialSpeed} feet</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Render equipment section
    const renderEquipment = () => (
        <div className="equipment-content">
            <div className="equipment-layout">
                {/* Left Equipment Column */}
                <div className="left-equipment">
                    {Object.entries(slots).filter(([slotName]) =>
                        ['head', 'neck', 'shoulders', 'back', 'chest', 'shirt', 'tabard', 'wrists'].includes(slotName)
                    ).map(([slotName, config]) => renderSlot(slotName, config))}
                </div>

                {/* Character Portrait Section with Weapons Below */}
                <div className="character-center-section">
                    <div className="character-image-container">
                        <img
                            src="https://wow.zamimg.com/uploads/screenshots/normal/1046017-human-priest.jpg"
                            alt="Character Portrait"
                            className="character-portrait"
                        />
                    </div>

                    {/* Weapon Slots Below Character */}
                    <div className="weapon-slots">
                        <div className="weapon-slots-row">
                            {Object.entries(weaponSlots).map(([slotName, config]) => {
                                const item = equipment[slotName];
                                const isEmpty = !item;
                                const isDisabled = slotName === 'offHand' && isOffHandDisabled(equipment);

                                // Weapon slot descriptions
                                const slotDescriptions = {
                                    mainHand: "Your primary weapon used for attacking. Choose based on your combat style and training.",
                                    offHand: isDisabled ?
                                        "Off-hand is disabled while wielding a two-handed weapon." :
                                        "Secondary weapons, shields, or magical focuses held in your off-hand.",
                                    ranged: "Bows, crossbows, wands, or thrown weapons used to attack from a distance."
                                };

                                return (
                                    <div
                                        key={slotName}
                                        className={`weapon-slot ${isEmpty ? 'empty' : ''} ${isDisabled ? 'disabled' : ''}`}
                                        onMouseEnter={(e) => {
                                            setHoveredSlot(slotName);
                                            updateTooltipPosition(e);
                                        }}
                                        onMouseMove={updateTooltipPosition}
                                        onMouseLeave={() => setHoveredSlot(null)}
                                        onContextMenu={(e) => {
                                            if (item && !isDisabled) {
                                                handleUnequipContextMenu(e, item, slotName);
                                            }
                                        }}
                                    >
                                        <img
                                            src={item ? (item.imageUrl || (item.iconId ? `https://wow.zamimg.com/images/wow/icons/large/${item.iconId}.jpg` : 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg')) : config.icon}
                                            alt={slotName}
                                            style={{ opacity: isDisabled ? 0.3 : 1 }}
                                            onError={(e) => {
                                                e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                                            }}
                                        />

                                        {/* Red cross overlay for disabled off-hand */}
                                        {isDisabled && (
                                            <div className="disabled-overlay">
                                                <div className="red-cross">
                                                    <div className="cross-line cross-line-1"></div>
                                                    <div className="cross-line cross-line-2"></div>
                                                </div>
                                            </div>
                                        )}

                                        {hoveredSlot === slotName && item && !isDisabled && renderTooltip(item)}
                                        {hoveredSlot === slotName && (isEmpty || isDisabled) && (
                                            <TooltipPortal>
                                                <div
                                                    className="equipment-slot-tooltip"
                                                    style={{
                                                        position: 'fixed',
                                                        left: tooltipPosition.x,
                                                        top: tooltipPosition.y,
                                                        transform: 'translate(10px, -50%)',
                                                        pointerEvents: 'none',
                                                        zIndex: 999999999 /* Maximum z-index to ensure it appears above all windows */
                                                    }}
                                                >
                                                    <div className="equipment-slot-name">{config.info}</div>
                                                    <div className="equipment-slot-description">{slotDescriptions[slotName] || `Slot for ${config.info} equipment`}</div>
                                                </div>
                                            </TooltipPortal>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Equipment Column */}
                <div className="right-equipment">
                    {Object.entries(slots).filter(([slotName]) =>
                        ['hands', 'waist', 'legs', 'feet', 'ring1', 'ring2', 'trinket1', 'trinket2'].includes(slotName)
                    ).map(([slotName, config]) => renderSlot(slotName, config))}
                </div>
            </div>
        </div>
    );

    // Render resources section
    const renderResources = () => {
        // Get class resource configuration
        const classResourceConfig = characterClass ? getClassResourceConfig(characterClass) : null;

        return (
            <div className="resources-content">
                <div className="resource-bars-section">
                    <ResourceBar
                        current={health.current}
                        max={health.max}
                        className="health"
                        label="Health"
                        resourceType="health"
                        onUpdate={updateResource}
                        tooltipPosition={tooltipPosition}
                        setTooltipPosition={setTooltipPosition}
                    />
                    <ResourceBar
                        current={mana.current}
                        max={mana.max}
                        className="mana"
                        label="Mana"
                        resourceType="mana"
                        onUpdate={updateResource}
                        tooltipPosition={tooltipPosition}
                        setTooltipPosition={setTooltipPosition}
                    />
                    <ResourceBar
                        current={actionPoints.current}
                        max={actionPoints.max}
                        className="action-points"
                        label="Action Points"
                        resourceType="actionPoints"
                        onUpdate={updateResource}
                        tooltipPosition={tooltipPosition}
                        setTooltipPosition={setTooltipPosition}
                    />

                    {/* Class Resource - Show if character has a class and class resource */}
                    {characterClass && classResource && classResourceConfig && (
                        <div className="class-resource-section">
                            <h4 className="resource-section-title">{classResourceConfig.name}</h4>
                            <div className="class-resource-display">
                                <ClassResourceBar
                                    characterClass={characterClass}
                                    classResource={classResource}
                                    size="large"
                                />
                            </div>
                            <div className="class-resource-details">
                                <div className="resource-description">
                                    {classResourceConfig.description}
                                </div>
                                <div className="resource-mechanics">
                                    <div className="resource-stat">
                                        <span className="stat-label">Current:</span>
                                        <span className="stat-value">{classResource.current}</span>
                                    </div>
                                    <div className="resource-stat">
                                        <span className="stat-label">Maximum:</span>
                                        <span className="stat-value">{classResource.max}</span>
                                    </div>
                                    {classResource.stacks && classResource.stacks.length > 0 && (
                                        <div className="resource-stat">
                                            <span className="stat-label">Stacks:</span>
                                            <span className="stat-value">{classResource.stacks.length}</span>
                                        </div>
                                    )}
                                    {classResource.risk !== undefined && classResource.risk > 0 && (
                                        <div className="resource-stat">
                                            <span className="stat-label">Risk:</span>
                                            <span className="stat-value">{classResource.risk}</span>
                                        </div>
                                    )}
                                    {classResource.volatility !== undefined && classResource.volatility > 0 && (
                                        <div className="resource-stat">
                                            <span className="stat-label">Volatility:</span>
                                            <span className="stat-value">{classResource.volatility}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Render content based on active section
    const renderSectionContent = () => {
        switch (activeSection) {
            case 'character':
                return renderCharacterInfo();
            case 'equipment':
                return renderEquipment();
            case 'resources':
                return renderResources();
            default:
                return renderCharacterInfo();
        }
    };

    // Handle unequip context menu
    const handleUnequipContextMenu = (e, item, slotName) => {
        e.preventDefault();
        e.stopPropagation();

        // Calculate position to ensure menu stays within viewport
        const x = Math.min(e.clientX, window.innerWidth - 250);
        const y = Math.min(e.clientY, window.innerHeight - 150);

        setUnequipContextMenu({
            visible: true,
            x,
            y,
            item,
            slotName
        });
    };

    // Handle unequipping an item
    const handleUnequipItem = (slotName) => {
        try {
            // Unequip the item from the character
            const unequippedItem = unequipItem(slotName);

            if (unequippedItem) {
                // Add the item back to inventory
                addItem(unequippedItem);
                console.log(`Unequipped ${unequippedItem.name} from ${slotName}`);
            }
        } catch (error) {
            console.error('Error unequipping item:', error);
        }
    };

    const slots = {
        head: {
            position: { top: 0, left: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_helmet_01.jpg',
            info: 'Head'
        },
        neck: {
            position: { top: 50, left: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_necklace_01.jpg',
            info: 'Neck'
        },
        shoulders: {
            position: { top: 100, left: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_shoulder_01.jpg',
            info: 'Shoulders'
        },
        back: {
            position: { top: 150, left: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_cape_01.jpg',
            info: 'Back'
        },
        chest: {
            position: { top: 200, left: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_chest_cloth_01.jpg',
            info: 'Chest'
        },
        shirt: {
            position: { top: 250, left: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_shirt_white_01.jpg',
            info: 'Shirt'
        },
        tabard: {
            position: { top: 300, left: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_shirt_guildtabard_01.jpg',
            info: 'Tabard'
        },
        wrists: {
            position: { top: 350, left: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_bracer_02.jpg',
            info: 'Wrists'
        },
        hands: {
            position: { top: 0, right: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_gauntlets_01.jpg',
            info: 'Hands'
        },
        waist: {
            position: { top: 50, right: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_belt_01.jpg',
            info: 'Waist'
        },
        legs: {
            position: { top: 100, right: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_pants_01.jpg',
            info: 'Legs'
        },
        feet: {
            position: { top: 150, right: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_boots_01.jpg',
            info: 'Feet'
        },
        ring1: {
            position: { top: 200, right: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_ring_01.jpg',
            info: 'Ring'
        },
        ring2: {
            position: { top: 250, right: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_ring_02.jpg',
            info: 'Ring'
        },
        trinket1: {
            position: { top: 300, right: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_talisman_01.jpg',
            info: 'Trinket'
        },
        trinket2: {
            position: { top: 350, right: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_talisman_02.jpg',
            info: 'Trinket'
        }
    };

    const weaponSlots = {
        mainHand: {
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_01.jpg',
            info: 'Main Hand'
        },
        offHand: {
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_shield_01.jpg',
            info: 'Off Hand'
        },
        ranged: {
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_weapon_bow_01.jpg',
            info: 'Ranged'
        }
    };

    // Calculate total stats (base + equipment bonuses)
    const getTotalStats = () => {
        const totalStats = { ...stats };

        if (equipmentBonuses) {
            // Add equipment bonuses to base stats
            const statMapping = {
                str: 'strength',
                con: 'constitution',
                agi: 'agility',
                int: 'intelligence',
                spir: 'spirit',
                cha: 'charisma'
            };

            Object.entries(statMapping).forEach(([bonusKey, statKey]) => {
                if (equipmentBonuses[bonusKey]) {
                    totalStats[statKey] = Math.round((totalStats[statKey] || 0) + equipmentBonuses[bonusKey]);
                }
            });

            // Calculate fresh derived stats with current equipment bonuses
            const freshDerivedStats = calculateDerivedStats(totalStats, equipmentBonuses);

            // Add derived stats (all rounded)
            totalStats.maxHealth = Math.round(freshDerivedStats.maxHealth || health.max);
            totalStats.maxMana = Math.round(freshDerivedStats.maxMana || mana.max);
            totalStats.healthRegen = Math.round(freshDerivedStats.healthRegen || 0);
            totalStats.manaRegen = Math.round(freshDerivedStats.manaRegen || 0);
            totalStats.armor = Math.round(freshDerivedStats.armor || 0);
            totalStats.movementSpeed = Math.round(freshDerivedStats.moveSpeed || 30);
            totalStats.carryingCapacity = Math.round(freshDerivedStats.carryingCapacity || 0);
            totalStats.damage = Math.round(freshDerivedStats.damage || 0);
            totalStats.spellDamage = Math.round(freshDerivedStats.spellDamage || 0);
            totalStats.healingPower = Math.round(freshDerivedStats.healingPower || 0);
            totalStats.rangedDamage = Math.round(freshDerivedStats.rangedDamage || 0);

            // Add resistances from equipment
            if (equipmentBonuses.resistances) {
                Object.entries(equipmentBonuses.resistances).forEach(([resistanceType, value]) => {
                    const resistanceKey = `${resistanceType}Resistance`;
                    totalStats[resistanceKey] = Math.round((totalStats[resistanceKey] || 0) + value);
                });
            }

            // Add spell damage types from equipment
            if (equipmentBonuses.spellDamageTypes) {
                Object.entries(equipmentBonuses.spellDamageTypes).forEach(([spellType, value]) => {
                    const spellPowerKey = `${spellType}SpellPower`;
                    totalStats[spellPowerKey] = Math.round((totalStats[spellPowerKey] || 0) + value);
                });
            }

            // Add immunities from equipment
            if (equipmentBonuses.immunities && equipmentBonuses.immunities.length > 0) {
                totalStats.immunities = [...(totalStats.immunities || []), ...equipmentBonuses.immunities];
                // Remove duplicates
                totalStats.immunities = [...new Set(totalStats.immunities)];
            }
        }

        return totalStats;
    };

    const totalStats = getTotalStats();





    const renderSlot = (slotName, slotConfig) => {
        const item = equipment[slotName];
        const isEmpty = !item;

        // Equipment slot descriptions
        const slotDescriptions = {
            head: "Protects your head from blows and the elements. Helmets often enhance perception, intelligence, or provide magical protection.",
            neck: "Amulets and necklaces that grant magical properties, protection, or enhance your natural abilities.",
            shoulders: "Pauldrons and spaulders that provide additional protection and can enhance strength or intimidation.",
            back: "Cloaks and capes that offer protection from the elements and can grant stealth or movement bonuses.",
            chest: "Your primary armor piece, offering the most protection and often enhancing your core attributes.",
            shirt: "Primarily decorative, but some magical shirts can provide comfort in harsh environments.",
            tabard: "Displays your allegiance or achievements. Some magical tabards grant special abilities.",
            wrists: "Bracers that protect your forearms and can enhance spellcasting or physical abilities.",
            hands: "Gauntlets and gloves that protect your hands and can enhance dexterity or attack power.",
            waist: "Belts and girdles that can hold items and sometimes enhance strength or constitution.",
            legs: "Greaves and leggings that protect your lower body and can enhance mobility or endurance.",
            feet: "Boots that protect your feet and can enhance speed, stealth, or provide stability.",
            ring1: "Magical rings that can enhance attributes, grant special abilities, or provide protection.",
            ring2: "A second magical ring. Wearing too many powerful rings can be dangerous.",
            trinket1: "Magical devices with unique effects that can be activated in times of need.",
            trinket2: "A second magical trinket. Choose wisely to complement your abilities.",
            mainHand: "Your primary weapon used for attacking. Choose based on your combat style and training.",
            offHand: "Secondary weapons, shields, or magical focuses held in your off-hand.",
            ranged: "Bows, crossbows, wands, or thrown weapons used to attack from a distance."
        };

        return (
            <div
                key={slotName}
                className={`gear-slot ${isEmpty ? 'empty' : ''}`}
                onMouseEnter={(e) => {
                    setHoveredSlot(slotName);
                    updateTooltipPosition(e);
                }}
                onMouseMove={updateTooltipPosition}
                onMouseLeave={() => setHoveredSlot(null)}
                onContextMenu={(e) => {
                    if (item) {
                        handleUnequipContextMenu(e, item, slotName);
                    }
                }}
            >
                <img
                    src={item ? (item.imageUrl || (item.iconId ? `https://wow.zamimg.com/images/wow/icons/large/${item.iconId}.jpg` : 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg')) : slotConfig.icon}
                    alt={slotName}
                    onError={(e) => {
                        e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                    }}
                />
                {hoveredSlot === slotName && item && renderTooltip(item)}
                {hoveredSlot === slotName && isEmpty && (
                    <TooltipPortal>
                        <div
                            className="equipment-slot-tooltip"
                            style={{
                                position: 'fixed',
                                left: tooltipPosition.x,
                                top: tooltipPosition.y,
                                transform: 'translate(10px, -50%)',
                                pointerEvents: 'none',
                                zIndex: 999999999 /* Maximum z-index to ensure it appears above all windows */
                            }}
                        >
                            <div className="equipment-slot-name">{slotConfig.info}</div>
                            <div className="equipment-slot-description">{slotDescriptions[slotName] || `Slot for ${slotConfig.info} equipment`}</div>
                        </div>
                    </TooltipPortal>
                )}
            </div>
        );
    };

    const renderTooltip = (item) => {
        if (!item) return null;

        return (
            <TooltipPortal>
                <div
                    style={{
                        position: 'fixed',
                        left: tooltipPosition.x,
                        top: tooltipPosition.y,
                        transform: 'translate(10px, -50%)',
                        pointerEvents: 'none',
                        zIndex: 999999999 /* Maximum z-index to ensure it appears above all windows */
                    }}
                >
                    <ItemTooltip item={item} />
                </div>
            </TooltipPortal>
        );
    };

    return (
        <div className="character-container">
            <div className="character-navigation">
                {Object.entries(sections).map(([key, section]) => (
                    <button
                        key={key}
                        className={`character-nav-button ${activeSection === key ? 'active' : ''}`}
                        onClick={() => setActiveSection(key)}
                    >
                        <img src={section.icon} alt="" className="character-nav-icon" />
                        <span className="character-nav-text">{section.title}</span>
                    </button>
                ))}
            </div>

            <div className="character-content-area">
                <div className="character-section-header">
                    <img
                        src={sections[activeSection].icon}
                        alt=""
                        className="character-section-icon"
                    />
                    <h2 className="character-section-title">{sections[activeSection].title}</h2>
                </div>

                <div className="character-fields">
                    {renderSectionContent()}
                </div>
            </div>

            {/* Unequip Context Menu - Render at document level for proper positioning */}
            {unequipContextMenu.visible && ReactDOM.createPortal(
                <UnequipContextMenu
                    x={unequipContextMenu.x}
                    y={unequipContextMenu.y}
                    item={unequipContextMenu.item}
                    slotName={unequipContextMenu.slotName}
                    onClose={() => setUnequipContextMenu({ visible: false })}
                    onUnequip={handleUnequipItem}
                />,
                document.body
            )}
        </div>
    );
}