import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import useCharacterStore from '../../store/characterStore';
import useInventoryStore from '../../store/inventoryStore';
import usePartyStore from '../../store/partyStore';
import useGameStore from '../../store/gameStore';
import useChatStore from '../../store/chatStore';
import { useInspectionCharacter } from '../../contexts/InspectionContext';
import TooltipPortal from '../tooltips/TooltipPortal';
import { useTooltipPosition } from '../common/useTooltipPosition';
import ItemTooltip from '../item-generation/ItemTooltip';
import UnequipContextMenu from '../equipment/UnequipContextMenu';
import { isOffHandDisabled, normalizeEquipment } from '../../utils/equipmentUtils';
import { calculateDerivedStats } from '../../utils/characterUtils';
import { getClassResourceConfig } from '../../data/classResources';
import { getRaceList, getSubraceList, getRacialSavingThrowModifiers } from '../../data/raceData';
import { useSpellLibrary, useSpellLibraryDispatch, libraryActionCreators } from '../spellcrafting-wizard/context/SpellLibraryContext';
import {   getRacialSpells, getRacialStatModifiers, addSpellsToLibrary, removeSpellsByCategory } from '../../utils/raceDisciplineSpellUtils';
import { getPassiveAbilities } from '../../data/backgroundAbilities';
import { getBackgroundData } from '../../data/backgroundData';
import '../../styles/character-sheet.css';
import '../../styles/resistance-styles.css';
import '../../styles/racial-traits.css';
import { getIconUrl, getCustomIconUrl, getWowIconUrl } from '../../utils/assetManager';
import useItemStore from '../../store/itemStore';
import Languages from './Languages';
import StatTooltip from '../tooltips/StatTooltip';
import GeneralStatTooltip from '../tooltips/GeneralStatTooltip';
import { getAttributeBreakdown, getDerivedStatBreakdown } from '../../utils/statCalculationBreakdown';

const ClassResourceBar = React.lazy(() => import('../hud/ClassResourceBar'));

const SECTIONS = {
    equipment: {
        title: 'Equipment & Vitals',
        icon: getCustomIconUrl('Utility/Brown Shield', 'abilities')
    },
    passives: {
        title: 'Passives',
        icon: getIconUrl('Utility/Glowing Orb', 'abilities')
    },
    languages: {
        title: 'Languages',
        icon: getIconUrl('Social/Party Gathering', 'abilities')
    }
};

// Spell power types for the cycler - 8 magic damage elements
// Color = canonical Mythrill damage type color so the chip matches the type's identity
const SPELL_POWER_TYPES = [
    { id: 'fire',     name: 'Ember',     color: '#D4380D' },
    { id: 'frost',    name: 'Rime',      color: '#2C5F7C' },
    { id: 'lightning',name: 'Storm',     color: '#8B7328' },
    { id: 'force',    name: 'Arcane',    color: '#5B3A8C' },
    { id: 'necrotic', name: 'Blight',    color: '#3D1F4E' },
    { id: 'radiant',  name: 'Sacred',    color: '#DAA520' },
    { id: 'poison',   name: 'Blight',    color: '#3D1F4E' },
    { id: 'psychic',  name: 'Wyrd',      color: '#7A2040' }
];

// Resistance type display names (legacy id -> canonical Mythrill name)
// Used for the modified-resistances strip
const RESISTANCE_DISPLAY_NAMES = {
    fire: 'Ember',
    frost: 'Rime',
    lightning: 'Storm',
    force: 'Arcane',
    necrotic: 'Blight',
    radiant: 'Sacred',
    poison: 'Blight',
    psychic: 'Wyrd',
    bludgeoning: 'Smashing',
    piercing: 'Stabbing',
    slashing: 'Slicing'
};

// Convert numeric resistance level + multiplier to a human label + color
// Returns { name, color, percentLabel, description } for the chip
const getResistanceLevelInfo = (level, multiplier) => {
    const pct = Math.round(multiplier * 100);
    if (level === 0 || multiplier === 0) {
        return { name: 'Immune', color: '#506e30', percentLabel: '0%', description: 'Takes no damage from this type' };
    }
    if (level === 50 || (multiplier > 0 && multiplier <= 0.5)) {
        return { name: 'Resistant', color: '#4a6a8a', percentLabel: `${pct}%`, description: 'Takes reduced damage from this type' };
    }
    if (level === 75 || (multiplier > 0.5 && multiplier < 1.0)) {
        return { name: 'Guarded', color: '#4a6a2e', percentLabel: `${pct}%`, description: 'Takes reduced damage from this type' };
    }
    if (level === 150 || (multiplier > 1.0 && multiplier < 2.0)) {
        return { name: 'Exposed', color: '#9a5e15', percentLabel: `${pct}%`, description: 'Takes more damage from this type' };
    }
    if (level === 200 || multiplier >= 2.0) {
        return { name: 'Vulnerable', color: '#8b3a2a', percentLabel: `${pct}%`, description: 'Takes double damage from this type' };
    }
    return { name: 'Normal', color: '#8b7d6b', percentLabel: `${pct}%`, description: 'Takes normal damage' };
};

const resistanceTypeDisplayName = (typeId) => {
    if (!typeId) return '';
    return RESISTANCE_DISPLAY_NAMES[typeId.toLowerCase()] ||
        (typeId.charAt(0).toUpperCase() + typeId.slice(1));
};

// Format a D&D-style modifier (+3, -1, +0)
const formatModifier = (value) => {
    const v = Math.floor(value || 0);
    if (v >= 0) return `+${v}`;
    return `${v}`;
};

// Compute the damage modifier for a given damage type using the canonical mapping
// from characterUtils.js. Smashing <- STR*2, Stabbing <- AGI*2, Slicing <- STR+AGI.
const computeDamageModifier = (damageType, strMod, agiMod) => {
    switch ((damageType || '').toLowerCase()) {
        case 'smashing':
        case 'bludgeoning':
            return strMod * 2;
        case 'stabbing':
        case 'piercing':
            return agiMod * 2;
        case 'slicing':
        case 'slashing':
            return strMod + agiMod;
        default:
            return 0;
    }
};

// Try to resolve a race/subrace id into a display name by inspecting the raceData module
// Avoids a hard import cycle and gracefully handles missing ids
const raceDisplay = (id) => {
    if (!id) return '';
    try {
        const list = getRaceList();
        const found = list.find(r => r.id === id);
        if (found) return found.name;
    } catch (_) { /* fall through */ }
    return id.charAt(0).toUpperCase() + id.slice(1);
};

const subraceDisplay = (id) => {
    if (!id) return '';
    try {
        // Walk all races to find the subrace (subraces are race-scoped in raceData)
        const raceList = getRaceList();
        for (const r of raceList) {
            const subs = getSubraceList(r.id);
            const found = subs && subs.find(s => s.id === id);
            if (found) return found.name;
        }
    } catch (_) { /* fall through */ }
    return id.charAt(0).toUpperCase() + id.slice(1);
};

// Compute a single "race" pill for the identity header.
// Deduplicates: if subrace name equals race name, return just one ("Mimir" not "Mimir Mimir").
// Otherwise, prefer the subrace name (e.g. "Arch Mimir" not "Arch Mimir (Mimir)").
const buildRacePill = (raceId, subraceId) => {
    const sub = subraceDisplay(subraceId);
    const race = raceDisplay(raceId);
    if (!sub) return race;
    if (!race) return sub;
    if (sub === race) return sub;
    return sub;
};

const EQUIPMENT_SLOTS = {
    head: {
        position: { top: 0, left: -50 },
        icon: getIconUrl('Armor/Head/head-brown-tan-banded-helmet', 'items'),
        info: 'Head'
    },
    neck: {
        position: { top: 50, left: -50 },
        icon: getIconUrl('Armor/Waist/brown-beaded-necklace-belt', 'items'),
        info: 'Neck'
    },
    shoulders: {
        position: { top: 100, left: -50 },
        icon: getIconUrl('Armor/Shoulder/shoulder-pauldron-segmented-brown-tan-cream-layered', 'items'),
        info: 'Shoulders'
    },
    back: {
        position: { top: 150, left: -50 },
        icon: getIconUrl('Armor/Cloak/cloak-autumn-leaf-trim-cape', 'items'),
        info: 'Back'
    },
    chest: {
        position: { top: 200, left: -50 },
        icon: getIconUrl('Armor/Chest/chest-barbarian-leather-tunic', 'items'),
        info: 'Chest'
    },
    shirt: {
        position: { top: 250, left: -50 },
        icon: getIconUrl('Armor/Chest/chest-flowing-sleeve-tunic', 'items'),
        info: 'Shirt'
    },
    tabard: {
        position: { top: 300, left: -50 },
        icon: getIconUrl('Armor/Chest/chest-harlequin-split-tunic', 'items'),
        info: 'Tabard'
    },
    wrists: {
        position: { top: 350, left: -50 },
        icon: getIconUrl('Armor/Wrist/worn-leather-bracer', 'items'),
        info: 'Wrists'
    },
    gloves: {
        position: { top: 0, right: -50 },
        icon: getIconUrl('Armor/Hands/hands-orange-cream-banded-glove', 'items'),
        info: 'Hands'
    },
    waist: {
        position: { top: 50, right: -50 },
        icon: getIconUrl('Armor/Chest/chest-belted-brown-robe', 'items'),
        info: 'Waist'
    },
    legs: {
        position: { top: 100, right: -50 },
        icon: getIconUrl('Armor/Leggings/leggings-blood-stained-teal-pants', 'items'),
        info: 'Legs'
    },
    feet: {
        position: { top: 150, right: -50 },
        icon: getIconUrl('Armor/Feet/feet-tan-beige-boots-pair', 'items'),
        info: 'Feet'
    },
    ring1: {
        position: { top: 200, right: -50 },
        icon: getIconUrl('Armor/Finger/finger-ancient-bronze-ring', 'items'),
        info: 'Ring'
    },
    ring2: {
        position: { top: 250, right: -50 },
        icon: getIconUrl('Armor/Finger/finger-ancient-bronze-ring', 'items'),
        info: 'Ring'
    },
    trinket1: {
        position: { top: 300, right: -50 },
        icon: getIconUrl('Armor/Neck/glowing-orb-pendant', 'items'),
        info: 'Trinket'
    },
    trinket2: {
        position: { top: 350, right: -50 },
        icon: getIconUrl('Armor/Neck/fiery-orb-amulet', 'items'),
        info: 'Trinket'
    }
};

const WEAPON_SLOTS = {
    mainHand: {
        icon: getIconUrl('Armor/Neck/magical-sword-pendant', 'items'),
        info: 'Main Hand'
    },
    offHand: {
        icon: getIconUrl('Weapons/Shields/shield-heater-wooden-brown-worn-cracks-beige-boss', 'items'),
        info: 'Off Hand'
    },
    ranged: {
        icon: getIconUrl('Weapons/Bows/bow-simple-brown-tan-grip', 'items'),
        info: 'Ranged'
    }
};

const SLOT_DESCRIPTIONS = {
    head: "Protects your head from blows and the elements. Helmets often enhance perception, intelligence, or provide magical protection.",
    neck: "Amulets and necklaces that grant magical properties, protection, or enhance your natural abilities.",
    shoulders: "Pauldrons and spaulders that provide additional protection and can enhance strength or intimidation.",
    back: "Cloaks and capes that offer protection from the elements and can grant stealth or movement bonuses.",
    chest: "Your primary armor piece, offering the most protection and often enhancing your core attributes.",
    shirt: "Primarily decorative, but some magical shirts can provide comfort in harsh environments.",
    tabard: "Displays your allegiance or achievements. Some magical tabards grant special abilities.",
    wrists: "Bracers that protect your forearms and can enhance spellcasting or physical abilities.",
    gloves: "Gauntlets and gloves that protect your hands and can enhance agility or attack power.",
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

// Derive concise passive summaries: 1 line flavor text, then game mechanics
const getPassiveSummary = (passive = {}) => {
    const parts = [];

    // Handle background passives (they have description and details fields)
    if (passive.type === 'Passive' && passive.details) {
        // For background passives, use description as summary and details for full text
        if (passive.description) {
            parts.push(passive.description);
        }
        if (passive.usage && passive.usage !== 'Always Active' && passive.usage !== 'FEATURE') {
            parts.push(`(${passive.usage})`);
        }
        return parts.join(' ');
    }

    // Handle background features (they have name and description, usage is 'FEATURE')
    if (passive.type === 'Passive' && passive.usage === 'FEATURE') {
        if (passive.description) {
            return passive.description;
        }
        return 'Background feature';
    }

    // Extract first sentence of description as flavor text
    if (passive.description) {
        const firstSentence = passive.description.split(/[.!?]+/)[0].trim();
        if (firstSentence) parts.push(firstSentence + '.');
    }

    // Extract condition from triggerConfig if present
    let conditionText = '';
    if (passive.triggerConfig?.global?.compoundTriggers) {
        const healthTrigger = passive.triggerConfig.global.compoundTriggers.find(t => t.id === 'health_threshold');
        if (healthTrigger?.parameters) {
            const percentage = healthTrigger.parameters.percentage;
            const comparison = healthTrigger.parameters.comparison;
            if (percentage && comparison) {
                if (comparison === 'less_than' || comparison === 'below') {
                    conditionText = `when below ${percentage}% HP`;
                } else if (comparison === 'greater_than' || comparison === 'above') {
                    conditionText = `when above ${percentage}% HP`;
                }
            }
        }
    }

    const formatStatMod = (mod = {}) => {
        const stat = (mod.stat || 'stat').replace(/_/g, ' ');
        let mag;
        if (mod.magnitudeType === 'dice' && mod.formula) {
            mag = mod.formula;
        } else if (mod.magnitudeType === 'percentage') {
            mag = `${mod.magnitude}%`;
        } else {
            mag = `${mod.magnitude > 0 ? '+' : ''}${mod.magnitude}`;
        }
        return `${stat} ${mag}`;
    };

    const getEffectLabel = (effect = {}) => {
        if (effect.statModifier) return formatStatMod(effect.statModifier);
        if (effect.mechanicsText) return effect.mechanicsText.replace(/\.$/, '');
        if (effect.statusEffect?.description) return effect.statusEffect.description.replace(/\.$/, '');
        return effect.name || effect.statusEffect?.type || 'Status effect';
    };

    // Group stat modifiers together
    const statMods = [];
    const otherEffects = [];

    // Process buff effects
    if (passive.buffConfig?.effects) {
        passive.buffConfig.effects.forEach(effect => {
            if (effect.statModifier || effect.statusEffect) {
                statMods.push(getEffectLabel(effect));
            }
        });
    }

    // Process debuff effects
    if (passive.debuffConfig?.effects) {
        passive.debuffConfig.effects.forEach(effect => {
            if (effect.statModifier || effect.statusEffect) {
                otherEffects.push(getEffectLabel(effect));
            }
        });
    }

    // Add healing config
    if (passive.healingConfig) {
        const { formula = 'healing', hotTickInterval, hotDuration, durationType } = passive.healingConfig;
        const intervalText = hotTickInterval
            ? ` every ${hotTickInterval} round${hotTickInterval > 1 ? 's' : ''}`
            : '';
        const durationText = hotDuration
            ? ` while ${hotDuration}`
            : durationType === 'permanent'
                ? ' continuously'
                : '';
        parts.push(`Regenerates ${formula}${intervalText}${durationText}`.trim() + '.');
    }

    // Add stat modifiers (grouped together)
    if (statMods.length > 0) {
        const modText = statMods.join(', ');
        parts.push(conditionText ? `${modText} ${conditionText}` : modText);
    }

    // Add other effects
    if (otherEffects.length > 0) {
        parts.push(otherEffects.join(', '));
    }

    return parts.length ? parts.join(' ') : 'No description available';
};



/* Potion Bottle Resource - replaces bars with tilted fillable bottles */
const BottleResource = ({ current, max, temp = 0, label, resourceType, onUpdate, mousePosition, setMousePosition }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [controlsPosition, setControlsPosition] = useState({ x: 0, y: 0 });
    const percentage = Math.min((current / max) * 100, 100);

    const handleMouseEnter = (e) => {
        setIsHovered(true);
        setMousePosition({
            x: e.clientX,
            y: e.clientY
        });
    };

    const handleMouseMove = (e) => {
        setMousePosition({
            x: e.clientX,
            y: e.clientY
        });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleClick = (e) => {
        if (!showControls) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = rect.left;
            const y = rect.bottom + 8;
            const popupWidth = 200;
            const popupHeight = 100;
            const adjustedX = Math.min(x, window.innerWidth - popupWidth - 20);
            const adjustedY = Math.min(y, window.innerHeight - popupHeight - 20);
            setControlsPosition({ x: adjustedX, y: adjustedY });
        }
        setShowControls(!showControls);
    };

    const handleAdjustment = (amount) => {
        const newValue = current + amount;
        const cappedValue = amount < 0 ? Math.max(0, newValue) : newValue;
        onUpdate(resourceType, cappedValue, max);
    };

    const handleInputSubmit = () => {
        const value = parseInt(inputValue);
        if (!isNaN(value)) {
            const newValue = Math.max(0, value);
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
        switch (resourceType) {
            case 'health':
                return {
                    title: 'Health Points',
                    description: 'Your life force. When reduced to 0, you enter the Dying state. Click to adjust.'
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

    const { adjustedPosition, tooltipRef } = useTooltipPosition(mousePosition, isHovered && !!tooltipContent);

    const bottleClass = resourceType === 'health' ? 'health-bottle' :
                        resourceType === 'mana' ? 'mana-bottle' : 'ap-bottle';

    return (
        <>
            <div
                className="potion-bottle-wrapper"
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <div className={`potion-bottle ${bottleClass}`}>
                    <div className="bottle-neck"></div>
                    <div className="bottle-cork"></div>
                    <div className="bottle-shape">
                        <div className="bottle-liquid" style={{ height: `${percentage}%` }}>
                            <div className="bottle-bubbles">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="potion-info">
                    <span className="potion-name">{label}</span>
                    <span className="potion-values">
                        {current} / {max}
                        {temp > 0 && <span className="potion-temp"> +{temp}</span>}
                    </span>
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
                            � - 
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
                        ref={tooltipRef} className="equipment-slot-tooltip"
                        style={{
                            position: 'fixed',
                            left: adjustedPosition.x,
                            top: adjustedPosition.y,
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
        </>
    );
};

export default function CharacterPanel({ activeSubSection: propSubSection, setActiveSubSection: propSetSubSection } = {}) {
    // Use inspection context if available, otherwise use regular character store
    const inspectionData = useInspectionCharacter();
    // PERFORMANCE OPTIMIZATION: Use selector to only subscribe to needed values
    const characterStore = useCharacterStore((state) => ({
        equipment: state.equipment,
        stats: state.stats,
        equipmentBonuses: state.equipmentBonuses,
        derivedStats: state.derivedStats,
        resistances: state.resistances,
        spellPower: state.spellPower,
        health: state.health,
        mana: state.mana,
        actionPoints: state.actionPoints,
        tempHealth: state.tempHealth || 0,
        tempMana: state.tempMana || 0,
        tempActionPoints: state.tempActionPoints || 0,
        classResource: state.classResource,
        name: state.name,
        baseName: state.baseName,
        race: state.race,
        subrace: state.subrace,
        pathPassives: state.pathPassives,
        background: state.background,
        class: state.class,
        path: state.path,
        pathDisplayName: state.pathDisplayName,
        selectedAbility: state.selectedAbility,
        level: state.level,
        alignment: state.alignment,
        exhaustionLevel: state.exhaustionLevel,
        updateEquipment: state.updateEquipment,
        updateCharacterInfo: state.updateCharacterInfo,
        updateBaseName: state.updateBaseName,
        updateResource: state.updateResource,
        unequipItem: state.unequipItem,
        immunities: state.immunities,
        lore: state.lore
    }));

    // Choose data source based on whether we're in inspection mode
    const dataSource = inspectionData || characterStore;

    const {
        equipment: rawEquipment,
        stats,
        equipmentBonuses,
        derivedStats,
        resistances = {},
        spellPower = {},
        health,
        mana,
        actionPoints,
        tempHealth = 0,
        tempMana = 0,
        tempActionPoints = 0,
        classResource,
        name,
        baseName,
        race,
        subrace,
        pathPassives = [],
        background,
        class: characterClass,
        path,
        pathDisplayName,
        selectedAbility = '',
        level,
        alignment,
        exhaustionLevel,
        characterIcon,
        updateEquipment,
        updateCharacterInfo,
        updateBaseName,
        updateResource,
        unequipItem,
        immunities = [], // Default to empty array if not provided
        lore = {} // Get lore data for character image
    } = dataSource;

    const equipment = useMemo(() => normalizeEquipment(rawEquipment), [rawEquipment]);

    // Get spell library dispatch and state for adding spells
    const libraryDispatch = useSpellLibraryDispatch();
    const spellLibrary = useSpellLibrary();

    // State for navigation
    const [internalSection, setInternalSection] = useState('equipment');
    const activeSection = propSubSection !== undefined ? propSubSection : internalSection;
    const setActiveSection = propSetSubSection || setInternalSection;
    const [showLabels, setShowLabels] = useState(false);

    // Inventory store for adding unequipped items back to inventory
    const { addItem } = useInventoryStore(state => ({
        addItem: state.addItem
    }));

    // Get chat store for combat notifications
    const addCombatNotification = useChatStore(state => state.addCombatNotification);

    // Get GM mode status
    const isGMMode = useGameStore(state => state.isGMMode);

    // Get current player name for actor name in logs
    const currentPlayerName = useCharacterStore(state => state.name || 'Player');
    const [hoveredSlot, setHoveredSlot] = useState(null);
    const [hoveredStat, setHoveredStat] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { adjustedPosition, tooltipRef } = useTooltipPosition(mousePosition, !!hoveredSlot || !!hoveredStat);
    const [tooltipDelay, setTooltipDelay] = useState(null);
    const [unequipContextMenu, setUnequipContextMenu] = useState({ visible: false, x: 0, y: 0, item: null, slotName: null });
    const [lastRaceSubracePath, setLastRaceSubracePath] = useState({ race: '', subrace: '', path: '' });
    const [lastCharacterId, setLastCharacterId] = useState(null);
    const [showOverhealModal, setShowOverhealModal] = useState(false);
    const [overhealData, setOverhealData] = useState(null); // { resourceType, adjustment, currentValue, maxValue }
    const [showLevelControls, setShowLevelControls] = useState(false);
    const [spellPowerTypeIndex, setSpellPowerTypeIndex] = useState(0);

    const characterContext = useMemo(() => ({
        stats,
        equipment,
        race,
        subrace,
        level,
        levelUpHistory: dataSource.levelUpHistory || {},
        activeEffects: dataSource.activeEffects || {},
        encumbranceState: dataSource.encumbranceState || 'normal',
        exhaustionLevel: exhaustionLevel || 0,
        health,
        mana,
        talents: dataSource.talents || []
    }), [stats, equipment, race, subrace, level, dataSource.levelUpHistory, dataSource.activeEffects, dataSource.encumbranceState, exhaustionLevel, health, mana, dataSource.talents]);

    // Class resource config (shared across render functions)
    const classResourceConfig = characterClass ? getClassResourceConfig(characterClass) : null;

    // Get current character ID from store
    const currentCharacterId = characterStore?.currentCharacterId || null;

    useEffect(() => {
        return () => {
            if (tooltipDelay) {
                clearTimeout(tooltipDelay);
            }
        };
    }, [tooltipDelay]);

    // Prevent the browser's default right-click context menu and text
    // selection anywhere in the character sheet so they don't break
    // immersion. Our custom context menus (UnequipContextMenu, stat
    // right-click handlers, etc.) still work because they use React's
    // onContextMenu + their own portaled UI - those handlers fire on the
    // bubble phase, and React's synthetic events still see the right-click.
    useEffect(() => {
        const suppressContextMenu = (e) => {
            // Only suppress when the right-click happens inside the character sheet.
            if (e.target && e.target.closest && e.target.closest('.character-sheet-container')) {
                e.preventDefault();
            }
        };
        // Capture phase so we run before any element's own handler that
        // might rely on e.preventDefault not being called.
        document.addEventListener('contextmenu', suppressContextMenu, true);
        return () => {
            document.removeEventListener('contextmenu', suppressContextMenu, true);
        };
    }, []);

    // Clean up all character-specific spells when character changes
    useEffect(() => {
        // Only run if we're not in inspection mode
        if (inspectionData) return;

        // Skip if character hasn't actually changed
        if (currentCharacterId === lastCharacterId) {
            return;
        }

        // If we had a previous character, clean up their spells
        if (lastCharacterId !== null) {
            // console.log('🧹 [Equipment] Cleaning up spells for previous character:', lastCharacterId);
            // Remove all character-specific spell categories
            removeSpellsByCategory(libraryDispatch, 'Racial Abilities', spellLibrary.spells);
            removeSpellsByCategory(libraryDispatch, 'Discipline Abilities', spellLibrary.spells);
            removeSpellsByCategory(libraryDispatch, 'Discipline Passives', spellLibrary.spells);

            // Also remove any passives that might have been added as spell cards
            const oldPassives = spellLibrary.spells.filter(spell =>
                spell.spellType === 'PASSIVE' &&
                (spell.tags?.includes('discipline') || spell.typeConfig?.tags?.includes('discipline') ||
                    spell.categoryIds?.includes('Discipline Passives'))
            );
            oldPassives.forEach(spell => {
                if (spell && spell.id) {
                    libraryDispatch(libraryActionCreators.deleteSpell(spell.id));
                }
            });
        }

        // Update last character ID
        setLastCharacterId(currentCharacterId);

        // Reset race/subrace/path tracking so new character's spells will be added
        // This ensures the spell addition effect runs even if race/subrace/path are the same
        setLastRaceSubracePath({ race: '', subrace: '', path: '' });
    }, [currentCharacterId, lastCharacterId, inspectionData, libraryDispatch, spellLibrary.spells]);

    // Handle spell addition and passives when race/subrace/path changes
    useEffect(() => {
        // Only run if we're not in inspection mode and if something actually changed
        if (inspectionData) return; // Skip in inspection mode

        const current = { race: race || '', subrace: subrace || '', path: path || '' };
        const last = lastRaceSubracePath;

        // Check if anything changed (including if last was reset to empty by character change)
        const hasChanges = current.race !== last.race || current.subrace !== last.subrace || current.path !== last.path;

        // Also check if character changed (if lastRaceSubracePath was reset, we need to add spells)
        const characterChanged = last.race === '' && last.subrace === '' && last.path === '' &&
            (current.race !== '' || current.subrace !== '' || current.path !== '');

        if (!hasChanges && !characterChanged) {
            return; // No changes
        }

        // Track which spells we're removing so we can exclude them from the existing spells list when adding
        let removedSpellIds = [];

        // IMPORTANT: Remove old spells BEFORE updating lastRaceSubracePath
        // This ensures we always remove spells when race/subrace changes, even if the effect re-runs
        if (current.race !== last.race || current.subrace !== last.subrace) {
            if (!characterChanged) {
                // Get the latest spells from the library
                const currentSpells = spellLibrary.spells;

                // Get the old racial spells by ID to ensure we remove the exact spells
                // Only remove if we had a previous race/subrace selection
                let oldRacialSpellIds = [];
                if (last.race && last.subrace) {
                    const oldRacialSpells = getRacialSpells(last.race, last.subrace);
                    oldRacialSpellIds = oldRacialSpells.map(s => s.id);
                }

                // Always remove all racial spells when race/subrace changes to ensure clean state
                // This prevents old spells from different subraces from persisting
                if (current.race !== last.race || current.subrace !== last.subrace) {
                    // Always remove ALL racial spells when race/subrace changes
                    // This ensures we don't have leftover spells from previous selections
                    const allRacialSpellsToRemove = currentSpells.filter(s =>
                        s.categoryIds && s.categoryIds.includes('Racial Abilities')
                    );

                    // Remove duplicates by ID
                    const uniqueSpellsToRemove = Array.from(
                        new Map(allRacialSpellsToRemove.map(s => [s.id, s])).values()
                    );

                    // Track the IDs we're removing
                    removedSpellIds = uniqueSpellsToRemove.map(s => s.id);

                    /* console.log('🧹 [Equipment] Removing old racial spells:', {
                        lastRace: last.race,
                        lastSubrace: last.subrace,
                        currentRace: current.race,
                        currentSubrace: current.subrace,
                        totalSpells: currentSpells.length,
                        oldRacialSpellIds,
                        spellsToRemove: uniqueSpellsToRemove.length,
                        spellIds: removedSpellIds,
                        spellNames: uniqueSpellsToRemove.map(s => s.name)
                    }); */

                    // Remove each racial spell individually to ensure they're deleted
                    uniqueSpellsToRemove.forEach(spell => {
                        if (spell && spell.id) {
                            // console.log('� - �️ [Equipment] Deleting racial spell:', spell.id, spell.name);
                            libraryDispatch(libraryActionCreators.deleteSpell(spell.id));
                        }
                    });
                } else {
                    // console.log('🧹 [Equipment] No old racial spells to remove (first selection)');
                }
            }
        }

        // Update last state AFTER removal
        setLastRaceSubracePath(current);

        // Handle racial spells - add new ones if race/subrace changed OR if character changed
        if (current.race !== last.race || current.subrace !== last.subrace || characterChanged) {
            // Add new racial spells (only if both race and subrace are set)
            // Note: Old spells were already removed above before updating lastRaceSubracePath
            if (current.race && current.subrace) {
                const racialSpells = getRacialSpells(current.race, current.subrace);

                // Filter out the spells we just removed from the existing spells list
                // This prevents them from being filtered out as "already existing" when we try to add them
                const existingSpellsWithoutRemoved = spellLibrary.spells.filter(
                    s => !removedSpellIds.includes(s.id)
                );

                // Also filter out any existing racial spells that don't match the current race/subrace
                // This ensures we can add new racial spells even if there are old ones in the library
                const currentRacialSpellIds = new Set(racialSpells.map(s => s.id));
                const existingSpellsFiltered = existingSpellsWithoutRemoved.filter(spell => {
                    // Keep spells that are not in the "Racial Abilities" category
                    if (!spell.categoryIds || !spell.categoryIds.includes('Racial Abilities')) {
                        return true;
                    }
                    // For racial spells, only keep them if they match the current race/subrace
                    return currentRacialSpellIds.has(spell.id);
                });

                console.log('🔍 [Equipment] Adding racial spells:', {
                    race: current.race,
                    subrace: current.subrace,
                    spellCount: racialSpells.length,
                    spellIds: racialSpells.map(s => s.id),
                    spellNames: racialSpells.map(s => s.name),
                    characterChanged,
                    existingSpellCount: spellLibrary.spells.length,
                    existingSpellCountAfterFilter: existingSpellsWithoutRemoved.length,
                    existingSpellCountAfterRacialFilter: existingSpellsFiltered.length,
                    removedSpellIds,
                    newSpellIds: racialSpells.map(s => s.id)
                });
                if (racialSpells.length > 0) {
                    // Pass filtered existing spells to prevent duplicates, but exclude the ones we just removed
                    // Also filter out any other racial spells that don't match current race/subrace
                    addSpellsToLibrary(libraryDispatch, racialSpells, 'Racial Abilities', existingSpellsFiltered);
                }
            }
        }

        // Handle discipline/path spells
        // Add spells if path changed OR if character changed (last was reset to empty)
        if (current.path !== last.path || characterChanged) {
            // Remove old discipline spells (both abilities and passives) - only if not a character change
            if (!characterChanged) {
                removeSpellsByCategory(libraryDispatch, 'Discipline Abilities', spellLibrary.spells);
                removeSpellsByCategory(libraryDispatch, 'Discipline Passives', spellLibrary.spells);
            }
            // Also remove old passives by checking for spells with 'discipline' tag and passive type (fallback)
            const oldPassives = spellLibrary.spells.filter(spell =>
                spell.spellType === 'PASSIVE' &&
                (spell.tags?.includes('discipline') || spell.typeConfig?.tags?.includes('discipline')) &&
                !spell.categoryIds?.includes('Discipline Passives') // Don't double-remove
            );
            oldPassives.forEach(spell => {
                if (spell && spell.id) {
                    libraryDispatch(libraryActionCreators.deleteSpell(spell.id));
                }
            });

            // Clear path passives since disciplines are removed from the system
            updateCharacterInfo('pathPassives', []);
        }
    }, [race, subrace, path, inspectionData, libraryDispatch, updateCharacterInfo, lastRaceSubracePath]);

    const updateTooltipPosition = (e) => {
        // Position tooltip near cursor but with a small offset
        setMousePosition({
            x: e.clientX,
            y: e.clientY
        });
    };

    const handleSlotTap = (e, slotName) => {
        e.stopPropagation();
        const rect = e.currentTarget ? e.currentTarget.getBoundingClientRect() : { left: 0, top: 0, width: 0 };
        const x = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : rect.left + rect.width / 2);
        const y = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : rect.top);
        setMousePosition({ x, y });
        setHoveredSlot(prev => prev === slotName ? null : slotName);
    };

    // Render character info section with side-by-side layout
    const renderCharacterInfo = () => (
        <div className="character-info-content">
            {/* Character Info and Model Layout */}
            <div className="character-summary-layout">
                {/* Left Side - Character Model and Info */}
                <div className="character-summary-portrait">
                    <div className="character-identity-section">
                        <div className="character-name-section">
                            <label className="character-field-label">Character Name</label>
                            <input
                                type="text"
                                value={baseName || name}
                                onChange={(e) => updateBaseName ? updateBaseName(e.target.value) : updateCharacterInfo('name', e.target.value)}
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
                                     <option value="Harbinger">Harbinger</option>
                                    <option value="Gambit">Gambit</option>
                                    <option value="Martyr">Martyr</option>
                                    <option value="False Prophet">False Prophet</option>
                                     <option value="Inquisitor">Inquisitor</option>

                                    <option value="Augur">Augur</option>
                                    <option value="Plaguebringer">Plaguebringer</option>
                                    <option value="Revenant">Revenant</option>
                                    <option value="Spellguard">Spellguard</option>
                                    <option value="Animist">Animist</option>
                                    <option value="Arcanoneer">Arcanoneer</option>
                                    <option value="Shaper">Shaper</option>
                                    <option value="Berserker">Berserker</option>
                                    {/* 'Dreadnaught' removed (absorbed into Martyr as Ironclad specialization) */}
                                    {/* Titan removed (absorbed into Warden) */}
                                    <option value="Toxicologist">Toxicologist</option>

                                    <option value="Lunarch">Lunarch</option>
                                    <option value="Apex">Apex</option>
                                    <option value="Warden">Warden</option>
                                    <option value="Augur">Augur</option>
                                 </select>
                            </div>

                            {/* Discipline selection removed */}

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

                        {/* Special Modifiers Section */}
                        {race && subrace && (() => {
                            const savingThrowMods = getRacialSavingThrowModifiers(race, subrace);
                            const hasSpecialModifiers = savingThrowMods && (
                                (savingThrowMods.advantage && Array.isArray(savingThrowMods.advantage) && savingThrowMods.advantage.length > 0) ||
                                (savingThrowMods.disadvantage && Array.isArray(savingThrowMods.disadvantage) && savingThrowMods.disadvantage.length > 0)
                            );

                            if (!hasSpecialModifiers) return null;

                            return (
                                <div className="character-details-grid" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #8b7355' }}>
                                    <div className="character-field" style={{ gridColumn: '1 / -1' }}>
                                        <label className="character-field-label" style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                                            Special Modifiers
                                        </label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {savingThrowMods.advantage && Array.isArray(savingThrowMods.advantage) && savingThrowMods.advantage.length > 0 && (
                                                <div style={{ padding: '8px', backgroundColor: '#e8f5e9', borderRadius: '4px', border: '1px solid #4caf50' }}>
                                                    <span style={{ fontWeight: 'bold', color: '#4caf50' }}>Advantage on saves against: </span>
                                                    <span>{savingThrowMods.advantage.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}</span>
                                                </div>
                                            )}
                                            {savingThrowMods.disadvantage && Array.isArray(savingThrowMods.disadvantage) && savingThrowMods.disadvantage.length > 0 && (
                                                <div style={{ padding: '8px', backgroundColor: '#ffebee', borderRadius: '4px', border: '1px solid #f44336' }}>
                                                    <span style={{ fontWeight: 'bold', color: '#f44336' }}>Disadvantage on saves against: </span>
                                                    <span>{savingThrowMods.disadvantage.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                    </div>
                </div>


            </div>
        </div>
    );

    // Render the centered identity header (Name, Race, Class) in TTRPG font
    const renderIdentityHeader = () => {
        const displayName = baseName || name;
        if (!displayName) return null;

        const pills = [];
        if (level) pills.push({ key: 'level', label: `Level ${level}` });
        const racePill = buildRacePill(race, subrace);
        if (racePill) pills.push({ key: 'race', label: racePill });
        if (characterClass) pills.push({ key: 'class', label: characterClass });
        if (pathDisplayName) pills.push({ key: 'path', label: pathDisplayName });
        else if (path) pills.push({ key: 'path', label: path });

        return (
            <div className="equipment-identity-header">
                <div className="equipment-identity-name">{displayName}</div>
                {pills.length > 0 && (
                    <div className="equipment-identity-subtitle">
                        {pills.map(p => (
                            <span key={p.key} className="identity-pill">{p.label}</span>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Render the WoW-Classic-style base stats grid (6 cards: STR/AGI/CON/INT/SPI/CHA).
    // Each card shows the modifier prominently with the base value below.
    const renderBaseStatsPanel = () => {
        const cards = [
            { key: 'strength',     label: 'STR', value: totalStats.strength },
            { key: 'agility',      label: 'AGI', value: totalStats.agility },
            { key: 'constitution', label: 'CON', value: totalStats.constitution },
            { key: 'intelligence', label: 'INT', value: totalStats.intelligence },
            { key: 'spirit',       label: 'SPI', value: totalStats.spirit },
            { key: 'charisma',     label: 'CHA', value: totalStats.charisma }
        ];

        return (
            <div className="wow-base-stats-panel">
                <h4 className="vitals-column-title">Base Stats</h4>
                <div className="wow-base-stats-grid">
                    {cards.map(c => {
                        const v = c.value ?? 10;
                        const mod = Math.floor((v - 10) / 2);
                        return (
                            <div
                                key={c.key}
                                className="wow-base-stat-card"
                                onMouseEnter={(e) => {
                                    setHoveredStat({
                                        type: 'attribute',
                                        key: c.key,
                                        value: v,
                                        breakdown: getAttributeBreakdown(c.key, characterContext)
                                    });
                                    setMousePosition({ x: e.clientX, y: e.clientY });
                                }}
                                onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                                onMouseLeave={() => setHoveredStat(null)}
                            >
                                <div className="wow-base-stat-label">{c.label}</div>
                                <div className={`wow-base-stat-mod ${mod > 0 ? 'pos' : mod < 0 ? 'neg' : ''}`}>
                                    {mod > 0 ? `+${mod}` : mod}
                                </div>
                                <div className="wow-base-stat-value">{v}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Render the melee/physical derived stats panel (below the base stats on the left).
    const renderMeleeStatsPanel = () => {
        const strVal = totalStats.strength ?? 10;
        const agiVal = totalStats.agility ?? 10;
        const strMod = Math.floor((strVal - 10) / 2);
        const agiMod = Math.floor((agiVal - 10) / 2);

        const mainHand = equipment?.mainHand;
        const ranged = equipment?.ranged;

        let meleeFormula = '1d4';
        let meleeMod = strMod;
        if (mainHand && mainHand.weaponStats?.baseDamage) {
            const { diceCount = 1, diceType = 4, damageType = 'smashing' } = mainHand.weaponStats.baseDamage;
            meleeFormula = `${diceCount}d${diceType}`;
            meleeMod = computeDamageModifier(damageType, strMod, agiMod);
        }

        let rangedFormula = '—';
        let rangedMod = agiMod;
        if (ranged && ranged.weaponStats?.baseDamage) {
            const { diceCount = 1, diceType = 4, damageType = 'stabbing' } = ranged.weaponStats.baseDamage;
            rangedFormula = `${diceCount}d${diceType}`;
            rangedMod = computeDamageModifier(damageType, strMod, agiMod);
        }

        const meleeSign = meleeMod >= 0 ? `+ ${meleeMod}` : `- ${Math.abs(meleeMod)}`;
        const rangedSign = rangedFormula === '—' ? '' : (rangedMod >= 0 ? `+ ${rangedMod}` : `- ${Math.abs(rangedMod)}`);

        return (
            <div className="vitals-stats-column">
                <h4 className="vitals-column-title">Melee & Physical</h4>
                <div
                    className="vitals-stat-tile"
                    onMouseEnter={(e) => {
                        setHoveredStat({
                            type: 'derived',
                            key: 'Melee Damage',
                            breakdown: {
                                stat: 'Melee Damage',
                                description: 'Physical weapon attack power. Derived from weapon dice + physical attribute modifier (STR for Smashing, AGI for Stabbing, STR/AGI for Slicing).',
                                baseLabel: `Weapon (${meleeFormula})`,
                                equipment: meleeMod,
                                finalValue: `${meleeFormula} ${meleeSign}`
                            }
                        });
                        setMousePosition({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setHoveredStat(null)}
                >
                    <span className="vitals-stat-label">Melee Damage</span>
                    <span className="vitals-stat-value vitals-stat-value--damage">
                        {meleeFormula} {meleeSign}
                    </span>
                </div>
                <div
                    className="vitals-stat-tile"
                    onMouseEnter={(e) => {
                        setHoveredStat({
                            type: 'derived',
                            key: 'Ranged Damage',
                            breakdown: {
                                stat: 'Ranged Damage',
                                description: 'Ranged weapon attack power. Derived from ranged weapon base dice + Agility modifier.',
                                baseLabel: rangedFormula === '—' ? 'None equipped' : `Weapon (${rangedFormula})`,
                                equipment: rangedFormula === '—' ? 0 : rangedMod,
                                finalValue: rangedFormula === '—' ? '—' : `${rangedFormula} ${rangedSign}`
                            }
                        });
                        setMousePosition({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setHoveredStat(null)}
                >
                    <span className="vitals-stat-label">Ranged Damage</span>
                    <span className="vitals-stat-value vitals-stat-value--damage">
                        {rangedFormula === '—' ? '—' : `${rangedFormula} ${rangedSign}`}
                    </span>
                </div>
                <div
                    className="vitals-stat-tile"
                    onMouseEnter={(e) => {
                        setHoveredStat({
                            type: 'derived',
                            key: 'initiative',
                            breakdown: getDerivedStatBreakdown('initiative', characterContext)
                        });
                        setMousePosition({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setHoveredStat(null)}
                >
                    <span className="vitals-stat-label">Initiative</span>
                    <span className="vitals-stat-value">
                        {totalStats.initiative ?? Math.floor((agiVal - 10) / 5)}
                    </span>
                </div>
                <div
                    className="vitals-stat-tile"
                    onMouseEnter={(e) => {
                        setHoveredStat({
                            type: 'derived',
                            key: 'maxHealth',
                            breakdown: getDerivedStatBreakdown('maxHealth', characterContext)
                        });
                        setMousePosition({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setHoveredStat(null)}
                >
                    <span className="vitals-stat-label">Max Health</span>
                    <span className="vitals-stat-value">
                        {health.current}/{health.max}
                    </span>
                </div>
                <div
                    className="vitals-stat-tile"
                    onMouseEnter={(e) => {
                        setHoveredStat({
                            type: 'derived',
                            key: 'movement',
                            breakdown: getDerivedStatBreakdown('movement', characterContext)
                        });
                        setMousePosition({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setHoveredStat(null)}
                >
                    <span className="vitals-stat-label">Movement</span>
                    <span className="vitals-stat-value">
                        {totalStats.movementSpeed ?? 30} ft
                    </span>
                </div>
            </div>
        );
    };

    // Render the spell/magic stats panel (right side).
    const renderSpellStatsPanel = () => {
        const types = SPELL_POWER_TYPES;
        const safeIndex = spellPowerTypeIndex % types.length;
        const current = types[safeIndex];
        const currentValue = getSpellPowerForType(current.id);

        const cycleSpellPower = (delta) => {
            setSpellPowerTypeIndex((prev) => (prev + delta + types.length) % types.length);
        };

        // Reddish color for the type name in the label
        const typeNameColor = '#B22222';

        return (
            <div className="vitals-stats-column">
                <h4 className="vitals-column-title">Spell & Magic</h4>
                <div
                    className="vitals-stat-tile vitals-stat-tile--clickable"
                    onClick={() => cycleSpellPower(1)}
                    onMouseEnter={(e) => {
                        const intB = getAttributeBreakdown('intelligence', characterContext);
                        const intSpBonus = intB.modifier * 2;
                        const baseVal = spellPower?.[current.id]?.value || 0;
                        const eqVal = equipmentBonuses?.spellDamageTypes?.[current.id] || 0;
                        setHoveredStat({
                            type: 'derived',
                            key: `Spell Power (${current.name})`,
                            breakdown: {
                                stat: `Spell Power (${current.name})`,
                                description: `Increases the damage and effectiveness of ${current.name} spells. Scaled by Intelligence (INT Mod × 2) and school-specific gear.`,
                                baseLabel: `INT Mod (${intB.modifier}) × 2`,
                                baseValue: intSpBonus,
                                equipment: eqVal,
                                racial: baseVal,
                                racialLabel: 'school base',
                                finalValue: currentValue
                            }
                        });
                        setMousePosition({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setHoveredStat(null)}
                    title={`Click to cycle through spell power types. Currently: ${current.name}`}
                >
                    <span className="vitals-stat-label">
                        Spell Power <span className="vitals-sp-type-inline" style={{ color: typeNameColor }}>({current.name})</span>
                    </span>
                    <span className="vitals-stat-value">{currentValue}</span>
                </div>
                <div
                    className="vitals-stat-tile"
                    onMouseEnter={(e) => {
                        setHoveredStat({
                            type: 'derived',
                            key: 'healingPower',
                            breakdown: getDerivedStatBreakdown('healingPower', characterContext)
                        });
                        setMousePosition({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setHoveredStat(null)}
                >
                    <span className="vitals-stat-label">Healing Power</span>
                    <span className="vitals-stat-value">{totalStats.healingPower || 0}</span>
                </div>
                <div
                    className="vitals-stat-tile"
                    onMouseEnter={(e) => {
                        setHoveredStat({
                            type: 'derived',
                            key: 'manaRegen',
                            breakdown: getDerivedStatBreakdown('manaRegen', characterContext)
                        });
                        setMousePosition({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setHoveredStat(null)}
                >
                    <span className="vitals-stat-label">Mana Regen</span>
                    <span className="vitals-stat-value">{totalStats.manaRegen || 0}/turn</span>
                </div>
                <div
                    className="vitals-stat-tile"
                    onMouseEnter={(e) => {
                        setHoveredStat({
                            type: 'derived',
                            key: 'maxMana',
                            breakdown: getDerivedStatBreakdown('maxMana', characterContext)
                        });
                        setMousePosition({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setHoveredStat(null)}
                >
                    <span className="vitals-stat-label">Max Mana</span>
                    <span className="vitals-stat-value">
                        {mana.current}/{mana.max}
                    </span>
                </div>
                <div
                    className="vitals-stat-tile"
                    onMouseEnter={(e) => {
                        setHoveredStat({
                            type: 'derived',
                            key: 'passivePerception',
                            breakdown: getDerivedStatBreakdown('passivePerception', characterContext)
                        });
                        setMousePosition({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setHoveredStat(null)}
                >
                    <span className="vitals-stat-label">Passive Perception</span>
                    <span className="vitals-stat-value">
                        {totalStats.passivePerception ?? 10}
                    </span>
                </div>
            </div>
        );
    };

    // Compute the effective spell power for a given legacy damage-type id
    // by combining the per-element value from store + the equipment bonus for that type.
    const getSpellPowerForType = (typeId) => {
        const baseVal = spellPower?.[typeId]?.value || 0;
        const eqVal = equipmentBonuses?.spellDamageTypes?.[typeId] || 0;
        const totalStatsBonus = totalStats?.[`${typeId}SpellPower`] || 0;
        return Math.round(baseVal + eqVal + totalStatsBonus);
    };

    // Render the modified-resistances strip (only non-100% entries) - shown on the right side
    const renderModifiedResistances = () => {
        const merged = totalStats.mergedResistances || {};
        const entries = Object.entries(merged)
            .filter(([type, data]) => data && data.level !== undefined && data.level !== 100)
            .map(([type, data]) => ({
                type,
                level: data.level,
                multiplier: data.multiplier ?? 1.0,
                info: getResistanceLevelInfo(data.level, data.multiplier ?? 1.0)
            }));

        return (
            <div className="vitals-resistance-strip">
                <span className="vitals-resistance-strip-label">Resistances</span>
                {entries.length === 0 ? (
                    <span
                        className="vitals-resistance-empty"
                        onMouseEnter={(e) => {
                            setHoveredStat({
                                type: 'derived',
                                key: 'Resistances',
                                breakdown: {
                                    stat: 'Damage Resistances',
                                    description: 'Reduces or amplifies incoming damage types. Normal (100%) takes full standard damage. Resistant (50%) halves damage, Immune (0%) cancels damage.',
                                    baseLabel: 'All Normal (100%)',
                                    finalValue: '100% Normal'
                                }
                            });
                            setMousePosition({ x: e.clientX, y: e.clientY });
                        }}
                        onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                        onMouseLeave={() => setHoveredStat(null)}
                    >
                        All normal (100%)
                    </span>
                ) : (
                    entries.map(({ type, info, multiplier }) => (
                        <span
                            key={type}
                            className="vitals-resistance-chip"
                            style={{ color: info.color }}
                            onMouseEnter={(e) => {
                                setHoveredStat({
                                    type: 'derived',
                                    key: `${resistanceTypeDisplayName(type)} Resistance`,
                                    breakdown: {
                                        stat: `${resistanceTypeDisplayName(type)} Resistance`,
                                        description: info.description,
                                        baseLabel: 'Base (100%)',
                                        finalValue: info.percentLabel
                                    }
                                });
                                setMousePosition({ x: e.clientX, y: e.clientY });
                            }}
                            onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                            onMouseLeave={() => setHoveredStat(null)}
                            title={`${info.name} - ${info.description}`}
                        >
                            <span className="vitals-resistance-chip-name">{resistanceTypeDisplayName(type)}</span>
                            <span className="vitals-resistance-chip-mult">{info.percentLabel}</span>
                        </span>
                    ))
                )}
            </div>
        );
    };

    // Render equipment section
    const renderEquipment = () => (
        <div className="equipment-content">

            {/* Identity Header - centered name / race / class card */}
            {renderIdentityHeader()}

            <div className="equipment-with-sides">
                {/* LEFT SIDE: base stats + melee/physical stats */}
                <aside className="equipment-side equipment-side--left" data-column-label="Attributes">
                    {renderBaseStatsPanel()}
                    {renderMeleeStatsPanel()}
                </aside>

                {/* CENTER: gear columns flanking the portrait */}
                <div className="equipment-center">
                    <div className="equipment-layout">
                        {/* LEFT EQUIPMENT COLUMN */}
                        <div className="left-equipment">
                            {Object.entries(EQUIPMENT_SLOTS).filter(([slotName]) =>
                                ['head', 'neck', 'shoulders', 'back', 'chest', 'shirt', 'tabard', 'wrists'].includes(slotName)
                            ).map(([slotName, config]) => renderSlot(slotName, config))}
                        </div>

                        {/* CHARACTER PORTRAIT CENTER */}
                        <div className="character-center-section">
                            {(() => {
                                const bgImage = lore?.iconBackgroundImage;
                                const bgColor = lore?.iconBackgroundColor || 'transparent';
                                const imageContainerStyle = bgImage
                                  ? {
                                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.25)), url(/assets/Backgrounds/${encodeURIComponent(bgImage)}))`,
                                      backgroundSize: 'cover',
                                      backgroundPosition: 'center',
                                      backgroundRepeat: 'no-repeat',
                                      backgroundColor: bgColor
                                    }
                                  : { backgroundColor: bgColor };

                                return (
                                    <div className="character-image-container" style={imageContainerStyle}>
                                        {lore?.characterImage ? (
                                            <img
                                                src={lore.characterImage}
                                                alt="Character Portrait"
                                                className="character-portrait"
                                            />
                                        ) : (characterIcon || lore?.characterIcon) ? (
                                            <div className="character-portrait-icon-wrapper">
                                                <img
                                                    src={(() => {
                                                        const icon = characterIcon || lore?.characterIcon;
                                                        if (icon.includes('/')) {
                                                            return getCustomIconUrl(icon, 'creatures');
                                                        }
                                                        return getWowIconUrl(icon);
                                                    })()}
                                                    alt="Character Icon"
                                                    className="character-portrait-icon"
                                                />
                                            </div>
                                        ) : (
                                            <div className="character-portrait-placeholder">
                                                <i className="fas fa-user"></i>
                                                <span>No Image</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {/* Weapon Slots Below Image */}
                            <div className="weapon-slots-bottom">
                                {Object.entries(WEAPON_SLOTS).map(([slotName, config]) => {
                                    let item = equipment[slotName];
                                    if (!item && slotName === 'offHand') {
                                        item = equipment['off_hand'] || equipment['offHand'];
                                    }
                                    const isEmpty = !item;
                                    const isDisabled = slotName === 'offHand' && isOffHandDisabled(equipment);

                                    const getItemImageSrc = () => {
                                        if (!item) return config.icon;
                                        if (item.imageUrl && !item.imageUrl.includes('wow.zamimg.com')) {
                                            return item.imageUrl;
                                        }
                                        if (item.iconId) {
                                            return getIconUrl(item.iconId, 'items', true);
                                        }
                                        if (item.id) {
                                            try {
                                                const itemStore = useItemStore.getState();
                                                const originalItem = itemStore.items.find(i => i.id === item.id);
                                                if (originalItem && originalItem.iconId) {
                                                    return getIconUrl(originalItem.iconId, 'items', true);
                                                }
                                            } catch (e) {
                                                console.warn('Could not look up item from store:', e);
                                            }
                                        }
                                        return getIconUrl('inv_misc_questionmark', 'items', true);
                                    };

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
                                            onClick={(e) => handleSlotTap(e, slotName)}
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
                                                src={getItemImageSrc()}
                                                alt={slotName}
                                                style={{ opacity: isDisabled ? 0.3 : 1 }}
                                            onError={(e) => {
                                                console.error('❌ Image load error for off-hand item:', {
                                                    slotName,
                                                    itemName: item?.name,
                                                    iconId: item?.iconId,
                                                    imageUrl: item?.imageUrl,
                                                    attemptedSrc: e.target.src
                                                });
                                                e.target.src = getIconUrl('inv_misc_questionmark', 'items', true);
                                            }}
                                        />

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
                                                    ref={tooltipRef} className="equipment-slot-tooltip"
                                                    style={{
                                                        position: 'fixed',
                                                        left: adjustedPosition.x,
                                                        top: adjustedPosition.y,
                                                        pointerEvents: 'none',
                                                        zIndex: 999999999,
                                                        maxHeight: 'calc(100vh - 24px)',
                                                        overflowY: 'auto'
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

                    {/* RIGHT EQUIPMENT COLUMN */}
                    <div className="right-equipment">
                        {Object.entries(EQUIPMENT_SLOTS).filter(([slotName]) =>
                            ['gloves', 'waist', 'legs', 'feet', 'ring1', 'ring2', 'trinket1', 'trinket2'].includes(slotName)
                        ).map(([slotName, config]) => renderSlot(slotName, config))}
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: spell/magic stats + resistance chips */}
            <aside className="equipment-side equipment-side--right" data-column-label="Magic & Defense">
                {renderSpellStatsPanel()}
                {renderModifiedResistances()}
            </aside>
        </div>
    </div>
);


    // Helper function to get the actor name (current player, with GM suffix if in GM mode)
    const getActorName = () => {
        const actorName = currentPlayerName || 'Player';
        return isGMMode ? `${actorName} (GM)` : actorName;
    };

    // Helper function to generate varied log messages for resource changes
    const logResourceChange = (characterName, resourceType, amount, isPositive) => {
        const absAmount = Math.abs(amount);
        const actorName = getActorName();

        if (resourceType === 'health') {
            // Use existing combat_heal and combat_hit types for health
            if (isPositive) {
                const messages = [
                    `Healed ${characterName} for ${absAmount} health`,
                    `${characterName} regained ${absAmount} health`,
                    `${characterName} recovered ${absAmount} health`,
                    `Restored ${absAmount} health to ${characterName}`
                ];
                const message = messages[Math.floor(Math.random() * messages.length)];
                addCombatNotification({
                    type: 'combat_heal',
                    healer: actorName,
                    target: characterName,
                    healing: absAmount,
                    customMessage: message
                });
            } else {
                const messages = [
                    `Hit ${characterName} for ${absAmount} damage`,
                    `${characterName} took ${absAmount} damage`,
                    `Dealt ${absAmount} damage to ${characterName}`,
                    `${characterName} suffered ${absAmount} damage`
                ];
                const message = messages[Math.floor(Math.random() * messages.length)];
                addCombatNotification({
                    type: 'combat_hit',
                    attacker: actorName,
                    target: characterName,
                    damage: absAmount,
                    customMessage: message
                });
            }
        } else {
            // For mana and action points, create custom messages
            const resourceNames = {
                'mana': { positive: ['mana'], negative: ['mana'] },
                'actionPoints': { positive: ['action points', 'AP'], negative: ['action points', 'AP'] }
            };
            const resource = resourceNames[resourceType] || { positive: [resourceType], negative: [resourceType] };
            const variants = isPositive ? resource.positive : resource.negative;
            const resourceName = variants[Math.floor(Math.random() * variants.length)];

            let message = '';
            if (isPositive) {
                const messages = [
                    `Restored ${absAmount} ${resourceName} to ${characterName}`,
                    `${characterName} regained ${absAmount} ${resourceName}`,
                    `${characterName} recovered ${absAmount} ${resourceName}`,
                    `Replenished ${absAmount} ${resourceName} for ${characterName}`
                ];
                message = messages[Math.floor(Math.random() * messages.length)];
            } else {
                const messages = [
                    `${characterName} lost ${absAmount} ${resourceName}`,
                    `Drained ${absAmount} ${resourceName} from ${characterName}`,
                    `${characterName} expended ${absAmount} ${resourceName}`,
                    `${absAmount} ${resourceName} was drained from ${characterName}`
                ];
                message = messages[Math.floor(Math.random() * messages.length)];
            }

            // For non-health resources, use combat_hit format but with custom message
            addCombatNotification({
                type: 'combat_hit',
                attacker: actorName,
                target: characterName,
                damage: absAmount,
                resourceType: resourceType,
                customMessage: message
            });
        }
    };

    // Handler for resource updates with overheal detection
    const handleResourceUpdate = (resourceType, newValue, maxValue) => {
        // Get current resource values
        const currentResource = dataSource[resourceType] || { current: 0, max: 0 };
        const currentValue = currentResource.current || 0;
        const actualMax = maxValue || currentResource.max || 0;

        // Calculate the adjustment amount
        const adjustment = newValue - currentValue;

        // Check for overheal (positive adjustment that would exceed max)
        if (adjustment > 0 && newValue > actualMax) {
            const overhealAmount = newValue - actualMax;
            setOverhealData({
                resourceType,
                adjustment,
                overhealAmount,
                currentValue,
                maxValue: actualMax
            });
            setShowOverhealModal(true);
            return; // Don't apply yet, wait for user confirmation
        }

        // Normal update (no overheal or negative adjustment)
        // Log the resource change if there's an actual adjustment
        if (adjustment !== 0) {
            const characterName = dataSource.name || name || 'Character';
            logResourceChange(characterName, resourceType, adjustment, adjustment > 0);
        }
        updateResource(resourceType, Math.max(0, Math.min(actualMax, newValue)), actualMax);
    };

    // Apply resource adjustment with optional temporary resource
    const applyResourceAdjustment = (asTemporary = false) => {
        if (!overhealData) return;

        const { resourceType, adjustment, currentValue, maxValue } = overhealData;
        const tempFieldMap = {
            'health': 'tempHealth',
            'mana': 'tempMana',
            'actionPoints': 'tempActionPoints'
        };
        const tempField = tempFieldMap[resourceType];
        const currentTemp = dataSource[tempField] || 0;

        // Get character name for logging
        const characterName = dataSource.name || name || 'Character';

        if (asTemporary) {
            // Add as temporary resource
            const overhealAmount = (currentValue + adjustment) - maxValue;

            // Log the main resource change (up to max)
            const mainAdjustment = maxValue - currentValue;
            if (mainAdjustment > 0) {
                logResourceChange(characterName, resourceType, mainAdjustment, true);
            }

            // Set resource to max
            updateResource(resourceType, maxValue, maxValue, undefined, true);

            // Update temporary resource
            if (inspectionData) {
                // For inspected characters, update through party store
                const partyState = usePartyStore.getState();
                // Find member by name (inspection context provides name)
                const member = partyState.partyMembers.find(m => m.name === inspectionData.name);

                if (member) {
                    usePartyStore.getState().updatePartyMember(member.id, {
                        character: {
                            ...member.character,
                            [tempField]: currentTemp + overhealAmount
                        }
                    });
                } else {
                    // If not found in party, might be current player being inspected
                    // In that case, update character store directly
                    useCharacterStore.getState().updateTempResource(resourceType, currentTemp + overhealAmount);
                }
            } else {
                // Update current player's temporary resource
                useCharacterStore.getState().updateTempResource(resourceType, currentTemp + overhealAmount);
            }
        } else {
            // Just cap at max, don't add temporary
            // Log the resource change
            const mainAdjustment = maxValue - currentValue;
            if (mainAdjustment > 0) {
                logResourceChange(characterName, resourceType, mainAdjustment, true);
            }
            updateResource(resourceType, maxValue, maxValue);
        }

        setShowOverhealModal(false);
        setOverhealData(null);
    };

    // Render resources section
    const renderResources = () => {
        return (
            <div className="resources-content">
                {/* Vitals & Progression Section */}
                <div className="vitals-progression-panel">
                    <h3 className="vitals-progression-title">
                        <i className="fas fa-heart-pulse"></i> Vitals & Progression
                    </h3>
                    <div className="vitals-grid">
                        <div className="vital-item level-item">
                            <label className="vital-label">Character Level</label>
                            <div className="level-input-wrapper">
                                <button 
                                    type="button" 
                                    className="level-adjust-btn"
                                    onClick={() => updateCharacterInfo('level', Math.max(1, (level || 1) - 1))}
                                    disabled={(level || 1) <= 1}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={level || 1}
                                    onChange={(e) => updateCharacterInfo('level', Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                                    className="level-number-input"
                                />
                                <button 
                                    type="button" 
                                    className="level-adjust-btn"
                                    onClick={() => updateCharacterInfo('level', Math.min(20, (level || 1) + 1))}
                                    disabled={(level || 1) >= 20}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="vital-item exhaustion-item">
                            <label className="vital-label">Exhaustion Level</label>
                            <select
                                value={exhaustionLevel || 0}
                                onChange={(e) => updateCharacterInfo('exhaustionLevel', parseInt(e.target.value) || 0)}
                                className="exhaustion-select"
                            >
                                <option value="0">Level 0: Normal</option>
                                <option value="1">Level 1: Disadvantage on checks</option>
                                <option value="2">Level 2: Speed halved</option>
                                <option value="3">Level 3: Disadvantage on attacks/saves</option>
                                <option value="4">Level 4: Max HP halved</option>
                                <option value="5">Level 5: Speed reduced to 0</option>
                                <option value="6">Level 6: Death</option>
                            </select>
                        </div>
                    </div>

                    {/* Exhaustion Warning Panel */}
                    <div className={`exhaustion-effect-panel severity-${exhaustionLevel || 0}`}>
                        <div className="panel-header">
                            <i className={(exhaustionLevel || 0) >= 5 ? "fas fa-skull" : ((exhaustionLevel || 0) >= 1 ? "fas fa-exclamation-triangle" : "fas fa-heart")}></i>
                            <span>Active Exhaustion Effect</span>
                        </div>
                        <div className="effect-description">
                            {(exhaustionLevel || 0) === 0 && "Active and healthy. You suffer no exhaustion penalties."}
                            {(exhaustionLevel || 0) === 1 && "Level 1: You have disadvantage on all ability checks."}
                            {(exhaustionLevel || 0) === 2 && "Level 2: Your movement speed is halved (and disadvantage on checks)."}
                            {(exhaustionLevel || 0) === 3 && "Level 3: You have disadvantage on attack rolls and saving throws."}
                            {(exhaustionLevel || 0) === 4 && "Level 4: Your maximum hit points are halved."}
                            {(exhaustionLevel || 0) === 5 && "Level 5: Your movement speed is reduced to 0."}
                            {(exhaustionLevel || 0) === 6 && "Level 6: Instantaneous death (Death)."}
                        </div>
                    </div>
                </div>

                <div className="resource-bars-section">
                    <div className="potion-resource-row">
                        <BottleResource
                            current={health.current}
                            max={health.max}
                            temp={tempHealth}
                            label="Health"
                            resourceType="health"
                            onUpdate={handleResourceUpdate}
                            mousePosition={mousePosition}
                            setMousePosition={setMousePosition}
                        />
                        <BottleResource
                            current={mana.current}
                            max={mana.max}
                            temp={tempMana}
                            label="Mana"
                            resourceType="mana"
                            onUpdate={handleResourceUpdate}
                            mousePosition={mousePosition}
                            setMousePosition={setMousePosition}
                        />
                        <BottleResource
                            current={actionPoints.current}
                            max={actionPoints.max}
                            temp={tempActionPoints}
                            label="Action Points"
                            resourceType="actionPoints"
                            onUpdate={handleResourceUpdate}
                            mousePosition={mousePosition}
                            setMousePosition={setMousePosition}
                        />
                    </div>

                    {/* Class Resource - Show if character has a class and class resource */}
                    {characterClass && classResource && classResourceConfig && (
                        <div className="class-resource-section">
                            <h4 className="resource-section-title">{classResourceConfig.name}</h4>
                            <div className="class-resource-display">
                                <React.Suspense fallback={<div className="class-resource-loading">Loading...</div>}>
                                    <ClassResourceBar
                                        characterClass={characterClass}
                                        classResource={classResource}
                                        character={{ health, mana, actionPoints }}
                                        size="large"
                                        onClassResourceUpdate={dataSource.updateClassResource || null}
                                    />
                                </React.Suspense>
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
    // Render passives summary section
    const renderPassives = () => {
        // Get all passive abilities from racial stat modifiers, path passives, and background passives
        const racialPassives = race && subrace ? getRacialStatModifiers(race, subrace) : [];

        // Get background passives (abilities) and features
        let backgroundPassives = [];
        if (background) {
            // Get passive abilities from backgroundAbilities.js
            const backgroundAbilities = getPassiveAbilities(background);
            backgroundPassives = [...backgroundAbilities];

            // Get background feature from backgroundData.js
            const backgroundData = getBackgroundData(background);
            if (backgroundData && backgroundData.feature) {
                // Format the feature as a passive ability
                backgroundPassives.push({
                    name: backgroundData.feature.name,
                    description: backgroundData.feature.description,
                    type: 'Passive',
                    usage: 'FEATURE'
                });
            }
        }

        const allPassives = [...racialPassives, ...(pathPassives || []), ...backgroundPassives];

        if (allPassives.length === 0) {
            return (
                <div className="passive-summary-container">
                    <div className="passive-summary-empty">
                        <p>No passive abilities available.</p>
                        <p>Select a race, subrace, or background to see passive abilities here.</p>
                    </div>
                </div>
            );
        }

        // Group passives by source
        const racialGroup = racialPassives.length > 0 ? {
            name: 'Racial Passives',
            passives: racialPassives
        } : null;

        const pathGroup = pathPassives && pathPassives.length > 0 ? {
            name: 'Path Passives',
            passives: pathPassives
        } : null;

        const backgroundGroup = backgroundPassives.length > 0 ? {
            name: 'Background Passives',
            passives: backgroundPassives
        } : null;

        const groups = [racialGroup, pathGroup, backgroundGroup].filter(Boolean);

        // Get saving throw modifiers (special modifiers) for race/subrace
        const savingThrowMods = race && subrace ? getRacialSavingThrowModifiers(race, subrace) : null;
        const hasSpecialModifiers = savingThrowMods && (
            (savingThrowMods.advantage && Array.isArray(savingThrowMods.advantage) && savingThrowMods.advantage.length > 0) ||
            (savingThrowMods.disadvantage && Array.isArray(savingThrowMods.disadvantage) && savingThrowMods.disadvantage.length > 0)
        );

        return (
            <div className="passive-summary-container">
                {groups.map((group, groupIndex) => (
                    <div key={groupIndex} className="passive-summary-group">
                        <div className="passive-summary-group-header">
                            <h3>{group.name}</h3>
                        </div>
                        <div className="passive-summary-list">
                            {group.passives.map((passive, idx) => {
                                const icon = passive?.icon || 'Radiant/Divine Blessing';
                                const name = passive?.name || 'Passive Ability';
                                const description = getPassiveSummary(passive);
                                // Use 'abilities' category for all passives (racial, discipline, background) since they're all abilities
                                const iconCategory = 'abilities';

                                return (
                                    <div key={idx} className="passive-summary-item">
                                        <div className="passive-summary-icon-wrapper">
                                            <img
                                                src={getIconUrl(icon, iconCategory)}
                                                alt={name}
                                                className="passive-summary-icon"
                                                onError={(e) => e.target.src = getIconUrl('ui_icon_questionmark', 'ui')}
                                            />
                                        </div>
                                        <div className="passive-summary-details">
                                            <div className="passive-summary-name">{name}</div>
                                            <div className="passive-summary-description">{description}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Special Modifiers Section */}
                {hasSpecialModifiers && (
                    <div className="passive-summary-group">
                        <div className="passive-summary-group-header">
                            <h3>Special Modifiers</h3>
                        </div>
                        <div className="passive-summary-list">
                            {savingThrowMods.advantage && Array.isArray(savingThrowMods.advantage) && savingThrowMods.advantage.length > 0 && (
                                <div className="passive-summary-item">
                                    <div className="passive-summary-details">
                                        <div className="passive-summary-name" style={{ color: '#4caf50', fontWeight: 'bold' }}>
                                            Advantage on saves against:
                                        </div>
                                        <div className="passive-summary-description">
                                            {savingThrowMods.advantage.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {savingThrowMods.disadvantage && Array.isArray(savingThrowMods.disadvantage) && savingThrowMods.disadvantage.length > 0 && (
                                <div className="passive-summary-item">
                                    <div className="passive-summary-details">
                                        <div className="passive-summary-name" style={{ color: '#f44336', fontWeight: 'bold' }}>
                                            Disadvantage on saves against:
                                        </div>
                                        <div className="passive-summary-description">
                                            {savingThrowMods.disadvantage.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'resources':
            case 'equipment':
                return renderEquipment();
            case 'passives':
                return renderPassives();
            case 'languages':
                return <Languages />;
            default:
                return renderEquipment();
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
            const unequippedItem = unequipItem(slotName);

            if (unequippedItem) {
                addItem(unequippedItem);
            }
        } catch (error) {
            console.error('Error unequipping item:', error);
        }
    };

    // Calculate total stats (base + equipment bonuses) - memoized to prevent recalculation on every render
    const totalStats = useMemo(() => {
        const totalStats = { ...stats };

        if (equipmentBonuses) {
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

            const encumbranceState = useInventoryStore.getState().encumbranceState || 'normal';
            const freshDerivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState, exhaustionLevel || 0, health, race, subrace);

            totalStats.maxHealth = Math.round(freshDerivedStats.maxHealth || health.max);
            totalStats.maxMana = Math.round(freshDerivedStats.maxMana || mana.max);
            totalStats.healthRegen = Math.round(freshDerivedStats.healthRegen || 0);
            totalStats.manaRegen = Math.round(freshDerivedStats.manaRegen || 0);
            totalStats.movementSpeed = Math.round(freshDerivedStats.moveSpeed ?? 30);
            totalStats.swimSpeed = Math.round(freshDerivedStats.swimSpeed || 0);
            totalStats.climbSpeed = Math.round(freshDerivedStats.climbSpeed || 0);
            totalStats.passivePerception = Math.round(freshDerivedStats.passivePerception || 0);
            totalStats.visionRange = Math.round(freshDerivedStats.visionRange || 0);
            totalStats.darkvision = Math.round(freshDerivedStats.darkvision || 0);
            totalStats.flySpeed = Math.round(freshDerivedStats.flySpeed || 0);
            totalStats.initiative = Math.round(freshDerivedStats.initiative || 0);
            totalStats.carryingCapacity = Math.round(freshDerivedStats.carryingCapacity || 0);
            totalStats.damage = Math.round(freshDerivedStats.damage || 0);
            totalStats.spellDamage = Math.round(freshDerivedStats.spellDamage || 0);
            totalStats.healingPower = Math.round(freshDerivedStats.healingPower || 0);
            totalStats.rangedDamage = Math.round(freshDerivedStats.rangedDamage || 0);
            totalStats.slashingDamage = Math.round(freshDerivedStats.slashingDamage || 0);
            totalStats.bludgeoningDamage = Math.round(freshDerivedStats.bludgeoningDamage || 0);
            totalStats.piercingDamage = Math.round(freshDerivedStats.piercingDamage || 0);

            // Merge resistances: base (from store) wins for explicit user setting, equipment bonuses layer on top.
            // Final resistance for each type is whichever has a non-100 level, or the equipment bonus if both are 100.
            const mergedResistances = {};
            const allTypes = new Set([
                ...Object.keys(resistances || {}),
                ...Object.keys(equipmentBonuses.resistances || {})
            ]);
            allTypes.forEach(type => {
                const base = (resistances || {})[type];
                const eq = (equipmentBonuses.resistances || {})[type];
                if (base && typeof base === 'object' && base.level !== undefined) {
                    mergedResistances[type] = { ...base };
                }
                if (eq && typeof eq === 'object' && eq.level !== undefined) {
                    const cur = mergedResistances[type] || { level: 100, multiplier: 1.0 };
                    const curMult = cur.multiplier ?? 1.0;
                    const eqMult = eq.multiplier ?? 1.0;
                    // If base is 100 (normal), equipment bonus replaces it.
                    // If base is non-100, keep the more severe (lower multiplier for negatives, higher for positives).
                    if (cur.level === 100) {
                        mergedResistances[type] = { ...eq };
                    } else if (eqMult < curMult || (eqMult > 1 && eqMult > curMult)) {
                        mergedResistances[type] = { ...eq };
                    } else {
                        mergedResistances[type] = cur;
                    }
                }
            });
            totalStats.mergedResistances = mergedResistances;

            if (equipmentBonuses.resistances) {
                Object.entries(equipmentBonuses.resistances).forEach(([resistanceType, resistanceData]) => {
                    const resistanceKey = `${resistanceType}Resistance`;
                    if (resistanceData && typeof resistanceData === 'object' && resistanceData.level !== undefined) {
                        totalStats[resistanceKey] = resistanceData;
                    } else if (typeof resistanceData === 'number') {
                        totalStats[resistanceKey] = Math.round((totalStats[resistanceKey] || 0) + resistanceData);
                    }
                });
            }

            if (equipmentBonuses.spellDamageTypes) {
                Object.entries(equipmentBonuses.spellDamageTypes).forEach(([spellType, value]) => {
                    const spellPowerKey = `${spellType}SpellPower`;
                    totalStats[spellPowerKey] = Math.round(0 + value);
                });
            }

            if (equipmentBonuses.immunities && equipmentBonuses.immunities.length > 0) {
                totalStats.immunities = [...(totalStats.immunities || []), ...equipmentBonuses.immunities];
                totalStats.immunities = [...new Set(totalStats.immunities)];
            }
        }

        return totalStats;
    }, [stats, equipmentBonuses, exhaustionLevel, health, mana, race, subrace, resistances]);





    const renderSlot = (slotName, slotConfig) => {
        const item = equipment[slotName];
        const isEmpty = !item;

        return (
            <div
                key={slotName}
                className={`gear-slot ${isEmpty ? 'empty' : ''}`}
                onClick={(e) => handleSlotTap(e, slotName)}
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
                    src={item ? ((item.imageUrl && !item.imageUrl.includes('wow.zamimg.com')) ? item.imageUrl : (item.iconId ? getIconUrl(item.iconId, 'items', true) : getIconUrl('inv_misc_questionmark', 'items', true))) : slotConfig.icon}
                    alt={slotName}
                    onError={(e) => {
                        e.target.src = getIconUrl('inv_misc_questionmark', 'items', true);
                    }}
                />
                {hoveredSlot === slotName && item && renderTooltip(item)}
                {hoveredSlot === slotName && isEmpty && (
                    <TooltipPortal>
                        <div
                            ref={tooltipRef} className="equipment-slot-tooltip"
                            style={{
                                position: 'fixed',
                                left: adjustedPosition.x,
                                top: adjustedPosition.y,
                                pointerEvents: 'none',
                                zIndex: 999999999 /* Maximum z-index to ensure it appears above all windows */
                            }}
                        >
                            <div className="equipment-slot-name">{slotConfig.info}</div>
                            <div className="equipment-slot-description">{SLOT_DESCRIPTIONS[slotName] || `Slot for ${slotConfig.info} equipment`}</div>
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
                    ref={tooltipRef}
                    style={{
                        position: 'fixed',
                        left: adjustedPosition.x,
                        top: adjustedPosition.y,
                        pointerEvents: 'none',
                        zIndex: 999999999
                    }}
                >
                    <ItemTooltip item={item} />
                </div>
            </TooltipPortal>
        );
    };

    return (
        <div className="character-container" onClick={(e) => {
            if (!e.target.closest('.gear-slot') && !e.target.closest('.weapon-slot') && !e.target.closest('.equipment-slot-tooltip') && !e.target.closest('.tooltip')) {
                setHoveredSlot(null);
            }
        }}>
            {propSubSection === undefined && (
                <div className={`character-navigation ${showLabels ? 'with-labels' : 'icons-only'}`}>
                    <button
                        className="stats-label-toggle-button"
                        onClick={() => setShowLabels(!showLabels)}
                        title={showLabels ? 'Hide Labels' : 'Show Labels'}
                    >
                        <span className="stats-toggle-icon">{showLabels ? ' - ' : '▶'}</span>
                    </button>
                    {Object.entries(SECTIONS).map(([key, section]) => (
                        <button
                            key={key}
                            className={`character-nav-button ${activeSection === key ? 'active' : ''}`}
                            onClick={() => setActiveSection(key)}
                            title={section.title}
                        >
                            <img src={section.icon} alt="" className="character-nav-icon" />
                            {showLabels && <span className="character-nav-text">{section.title}</span>}
                        </button>
                    ))}
                </div>
            )}

            <div
                className={`character-content-area ${activeSection === 'equipment' ? 'equipment-backdrop' :
                    activeSection === 'passives' ? 'passives-backdrop' :
                        activeSection === 'languages' ? 'languages-backdrop' :
                            activeSection === 'resources' ? 'resources-backdrop' :
                                ''
                    }`}
                style={{
                    ...(activeSection === 'passives' && {
                        backgroundImage: 'url(/assets/Backgrounds/Embers.png)'
                    }),
                    ...(activeSection === 'languages' && {
                        backgroundImage: 'url(/assets/Backgrounds/Temple.png)'
                    })
                }}
            >
                {propSubSection === undefined && (
                <div className="character-section-header">
                    <img
                        src={SECTIONS[activeSection].icon}
                        alt=""
                        className="character-section-icon"
                    />
                    <h2 className="character-section-title">{SECTIONS[activeSection].title}</h2>

                    {/* Interactive Vials in the header bar */}
                    {activeSection === 'equipment' && (
                        <div className="header-potion-strip">
                            <BottleResource
                                current={health.current}
                                max={health.max}
                                temp={tempHealth}
                                label="Health"
                                resourceType="health"
                                onUpdate={handleResourceUpdate}
                                mousePosition={mousePosition}
                                setMousePosition={setMousePosition}
                            />
                            <BottleResource
                                current={mana.current}
                                max={mana.max}
                                temp={tempMana}
                                label="Mana"
                                resourceType="mana"
                                onUpdate={handleResourceUpdate}
                                mousePosition={mousePosition}
                                setMousePosition={setMousePosition}
                            />
                            <BottleResource
                                current={actionPoints.current}
                                max={actionPoints.max}
                                temp={tempActionPoints}
                                label="Action Points"
                                resourceType="actionPoints"
                                onUpdate={handleResourceUpdate}
                                mousePosition={mousePosition}
                                setMousePosition={setMousePosition}
                            />
                        </div>
                    )}

                    {/* Compact Level & Exhaustion indicators */}
                    {activeSection === 'equipment' && (
                        <div className="header-vitals">
                            {/* Level square */}
                            <div className="header-level" title="Click to adjust level">
                                <span className="header-level-num" onClick={() => setShowLevelControls(!showLevelControls)}>{level || 1}</span>
                                {showLevelControls && (
                                    <div className="header-level-popup">
                                        <button onClick={(e) => { e.stopPropagation(); updateCharacterInfo('level', Math.max(1, (level || 1) - 1)); }} disabled={(level || 1) <= 1}>−</button>
                                        <span>{level || 1}</span>
                                        <button onClick={(e) => { e.stopPropagation(); updateCharacterInfo('level', Math.min(20, (level || 1) + 1)); }} disabled={(level || 1) >= 20}>+</button>
                                    </div>
                                )}
                            </div>

                            {/* Exhaustion: icon + dot + dropdown with hover tooltip */}
                            <div className={`header-exhaustion severity-${exhaustionLevel || 0}`}>
                                <i className="fas fa-heart-pulse header-exhaustion-icon"></i>
                                <span className="header-exhaustion-dot"></span>
                                <select
                                    value={exhaustionLevel || 0}
                                    onChange={(e) => updateCharacterInfo('exhaustionLevel', parseInt(e.target.value) || 0)}
                                    className="header-exhaustion-select"
                                >
                                    <option value="0">Healthy</option>
                                    <option value="1">Tired</option>
                                    <option value="2">Weary</option>
                                    <option value="3">Drained</option>
                                    <option value="4">Debilitated</option>
                                    <option value="5">Broken</option>
                                    <option value="6">Dead</option>
                                </select>

                                {/* Hover tooltip with full effect description */}
                                <div className="exhaustion-hover-tooltip">
                                    <div className="exhaustion-tooltip-title">Exhaustion Effect</div>
                                    <div className="exhaustion-tooltip-text">
                                        {(exhaustionLevel || 0) === 0 && "You are active and healthy. No exhaustion penalties apply."}
                                        {(exhaustionLevel || 0) === 1 && "Level 1: Disadvantage on all ability checks."}
                                        {(exhaustionLevel || 0) === 2 && "Level 2: Speed halved, disadvantage on ability checks."}
                                        {(exhaustionLevel || 0) === 3 && "Level 3: Disadvantage on attack rolls and saving throws."}
                                        {(exhaustionLevel || 0) === 4 && "Level 4: Maximum hit points are halved."}
                                        {(exhaustionLevel || 0) === 5 && "Level 5: Movement speed reduced to 0."}
                                        {(exhaustionLevel || 0) === 6 && "Level 6: Instant death."}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                )}

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

            {/* Overheal Confirmation Modal */}
            {showOverhealModal && overhealData && ReactDOM.createPortal(
                <div
                    className="modal-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10001,
                        margin: 0,
                        padding: 0
                    }}
                    onClick={() => {
                        setShowOverhealModal(false);
                        setOverhealData(null);
                    }}
                >
                    <div
                        className="overheal-modal"
                        style={{
                            backgroundColor: '#f0e6d2',
                            border: '2px solid #a08c70',
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            fontFamily: "'Bookman Old Style', 'Garamond', serif",
                            color: '#7a3b2e',
                            minWidth: '350px',
                            textAlign: 'center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
                            Overheal Detected
                        </h3>
                        <p style={{ margin: '0 0 20px 0', fontSize: '14px' }}>
                            This would restore {overhealData.adjustment} {overhealData.resourceType === 'health' ? 'HP' : overhealData.resourceType === 'mana' ? 'Mana' : 'AP'},
                            but the current value is {overhealData.currentValue}/{overhealData.maxValue}.
                            <br />
                            <strong>{overhealData.overhealAmount}</strong> would exceed the maximum.
                        </p>
                        <p style={{ margin: '0 0 20px 0', fontSize: '13px', fontStyle: 'italic' }}>
                            Would you like to add the excess as temporary {overhealData.resourceType === 'health' ? 'HP' : overhealData.resourceType === 'mana' ? 'Mana' : 'AP'}?
                        </p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #a08c70',
                                    borderRadius: '4px',
                                    backgroundColor: '#d4c4a8',
                                    color: '#7a3b2e',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                                onClick={() => applyResourceAdjustment(true)}
                            >
                                Add as Temporary
                            </button>
                            <button
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #a08c70',
                                    borderRadius: '4px',
                                    backgroundColor: '#d4c4a8',
                                    color: '#7a3b2e',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                                onClick={() => applyResourceAdjustment(false)}
                            >
                                Cap at Maximum
                            </button>
                            <button
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #a08c70',
                                    borderRadius: '4px',
                                    backgroundColor: '#e8dcc0',
                                    color: '#7a3b2e',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                                onClick={() => {
                                    setShowOverhealModal(false);
                                    setOverhealData(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {hoveredStat && (
                <TooltipPortal>
                    <div
                        ref={tooltipRef}
                        className="equipment-slot-tooltip"
                        style={{
                            position: 'fixed',
                            left: adjustedPosition.x,
                            top: adjustedPosition.y,
                            pointerEvents: 'none',
                            zIndex: 999999999
                        }}
                    >
                        {hoveredStat.type === 'attribute' ? (
                            <StatTooltip
                                stat={hoveredStat.key}
                                value={hoveredStat.value}
                                components={hoveredStat.breakdown}
                            />
                        ) : (
                            <GeneralStatTooltip
                                stat={hoveredStat.breakdown?.stat || hoveredStat.key}
                                value={typeof hoveredStat.breakdown?.finalValue === 'number' ? hoveredStat.breakdown.finalValue : undefined}
                                displayValue={typeof hoveredStat.breakdown?.finalValue === 'string' ? hoveredStat.breakdown.finalValue : undefined}
                                breakdown={hoveredStat.breakdown}
                                description={hoveredStat.breakdown?.description}
                            />
                        )}
                    </div>
                </TooltipPortal>
            )}
        </div>
    );
}
