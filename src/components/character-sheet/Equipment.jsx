import React, { useState, useEffect } from 'react';
import useCharacterStore from '../../store/characterStore';
import StatTooltip from '../tooltips/StatTooltip';
import ResistanceTooltip from '../tooltips/ResistanceTooltip';
import GeneralStatTooltip from '../tooltips/GeneralStatTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import '../../styles/character-sheet.css';
import '../../styles/resistance-styles.css';

const DAMAGE_TYPES = {
    fire: { 
        name: 'Fire', 
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_fire.jpg',
        color: '#ff4400'
    },
    cold: { 
        name: 'Cold', 
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_frostbolt02.jpg',
        color: '#3399ff'
    },
    lightning: { 
        name: 'Lightning', 
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_lightning.jpg',
        color: '#ffff00'
    },
    acid: { 
        name: 'Acid', 
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_creature_poison_02.jpg',
        color: '#00ff00'
    },
    force: { 
        name: 'Force', 
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_blast.jpg',
        color: '#ff66ff'
    },
    necrotic: { 
        name: 'Necrotic', 
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowbolt.jpg',
        color: '#660066'
    },
    radiant: { 
        name: 'Radiant', 
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_holybolt.jpg',
        color: '#ffff99'
    },
    poison: { 
        name: 'Poison', 
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_dualweild.jpg',
        color: '#00ff00'
    },
    psychic: { 
        name: 'Psychic', 
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_mindtwisting.jpg',
        color: '#ff00ff'
    },
    thunder: { 
        name: 'Thunder', 
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_thunderclap.jpg',
        color: '#0066ff'
    }
};

const STAT_ICONS = {
    // Base Stats
    strength: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_strengthofarms.jpg',
    agility: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_quickrecovery.jpg',
    intelligence: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
    wisdom: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_innerfire.jpg',
    charisma: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
    constitution: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_wordfortitude.jpg',
    spirit: 'https://wow.zamimg.com/images/wow/icons/large/inv_enchant_essenceeternallarge.jpg',
    'spell power': 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
    // Combat Stats
    'armor class': 'https://wow.zamimg.com/images/wow/icons/large/inv_shield_04.jpg',
    'initiative': 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
    'hit points': 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_54.jpg',
    'attack bonus': 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_savageblow.jpg',
    'damage bonus': 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_weaponmastery.jpg',
    'hit chance': 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_snipershot.jpg',
    'crit chance': 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_ambush.jpg',
    'piercing damage': 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
    'bludgeoning damage': 'https://wow.zamimg.com/images/wow/icons/large/inv_mace_02.jpg',
    'slashing damage': 'https://wow.zamimg.com/images/wow/icons/large/inv_axe_01.jpg',
    // Defensive Stats
    'max health': 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_54.jpg',
    'max mana': 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_72.jpg',
    'health regeneration': 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_rejuvenation.jpg',
    'mana regeneration': 'https://wow.zamimg.com/images/wow/icons/large/spell_magic_managain.jpg',
    'healing received': 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_sealofsacrifice.jpg',
    'healing power': 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
    'resistances': 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_dispelmagic.jpg',
    'immunities': 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_divineprotection.jpg',
    // Utility
    'movement speed': 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
    'swim speed': 'https://wow.zamimg.com/images/wow/icons/large/ability_druid_aquaticform.jpg',
    'carrying capacity': 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_08.jpg',
    'vision range': 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_sealofwisdom.jpg'
};

const ResourceBar = ({ current, max, className, label }) => {
    const percentage = (current / max) * 100;
    return (
        <div className="resource-container">
            <span className="resource-label">{label}</span>
            <div className="resource-wrapper">
                <div className="resource-numbers">
                    {current} / {max}
                </div>
                <div className={`resource-bar ${className}`}>
                    <div className="resource-fill" style={{ width: `${percentage}%` }} />
                </div>
            </div>
        </div>
    );
};

export default function CharacterPanel() {
    const { 
        equipment, 
        stats, 
        health, 
        mana, 
        actionPoints, 
        name,
        race,
        alignment,
        exhaustionLevel,
        updateEquipment,
        immunities = [] // Default to empty array if not provided
    } = useCharacterStore();
    const [hoveredSlot, setHoveredSlot] = useState(null);
    const [selectedStatGroup, setSelectedStatGroup] = useState('base');
    const [hoveredStat, setHoveredStat] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipDelay, setTooltipDelay] = useState(null);

    useEffect(() => {
        return () => {
            if (tooltipDelay) {
                clearTimeout(tooltipDelay);
            }
        };
    }, [tooltipDelay]);

    const handleStatHover = (e, label, isSubStat = false) => {
        e.stopPropagation();
        if (tooltipDelay) {
            clearTimeout(tooltipDelay);
        }
        
        // Set initial position
        updateTooltipPosition(e);
        
        const delay = setTimeout(() => {
            setHoveredStat(label);
        }, 100);
        setTooltipDelay(delay);
    };

    const updateTooltipPosition = (e) => {
        // Position tooltip near cursor but with a small offset
        setTooltipPosition({
            x: e.clientX + 15,
            y: e.clientY - 10
        });
    };

    const handleStatLeave = (e) => {
        e.stopPropagation();
        if (tooltipDelay) {
            clearTimeout(tooltipDelay);
        }
        setHoveredStat(null);
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

    const statGroups = {
        base: {
            title: 'Base Stats',
            stats: [
                { 
                    label: 'Strength', 
                    value: typeof stats.strength === 'object' ? stats.strength.value : stats.strength || 0,
                    modifier: Math.floor(((typeof stats.strength === 'object' ? stats.strength.value : stats.strength || 0) - 10) / 2),
                    tooltip: true 
                },
                { 
                    label: 'Agility', 
                    value: typeof stats.agility === 'object' ? stats.agility.value : stats.agility || 0,
                    modifier: Math.floor(((typeof stats.agility === 'object' ? stats.agility.value : stats.agility || 0) - 10) / 2),
                    tooltip: true 
                },
                { 
                    label: 'Constitution', 
                    value: typeof stats.constitution === 'object' ? stats.constitution.value : stats.constitution || 0,
                    modifier: Math.floor(((typeof stats.constitution === 'object' ? stats.constitution.value : stats.constitution || 0) - 10) / 2),
                    tooltip: true 
                },
                { 
                    label: 'Intelligence', 
                    value: typeof stats.intelligence === 'object' ? stats.intelligence.value : stats.intelligence || 0,
                    modifier: Math.floor(((typeof stats.intelligence === 'object' ? stats.intelligence.value : stats.intelligence || 0) - 10) / 2),
                    tooltip: true 
                },
                { 
                    label: 'Spirit', 
                    value: typeof stats.spirit === 'object' ? stats.spirit.value : stats.spirit || 0,
                    modifier: Math.floor(((typeof stats.spirit === 'object' ? stats.spirit.value : stats.spirit || 0) - 10) / 2),
                    tooltip: true 
                },
                { 
                    label: 'Charisma', 
                    value: typeof stats.charisma === 'object' ? stats.charisma.value : stats.charisma || 0,
                    modifier: Math.floor(((typeof stats.charisma === 'object' ? stats.charisma.value : stats.charisma || 0) - 10) / 2),
                    tooltip: true 
                }
            ]
        },
        offensive: {
            title: 'Offensive Stats',
            stats: [
                { label: 'Piercing Damage', value: typeof stats.piercingDamage === 'object' ? stats.piercingDamage.value : stats.piercingDamage || 0, tooltip: true },
                { label: 'Bludgeoning Damage', value: typeof stats.bludgeoningDamage === 'object' ? stats.bludgeoningDamage.value : stats.bludgeoningDamage || 0, tooltip: true },
                { label: 'Slashing Damage', value: typeof stats.slashingDamage === 'object' ? stats.slashingDamage.value : stats.slashingDamage || 0, tooltip: true },
                { label: 'Hit Chance', value: typeof stats.hitChance === 'object' ? stats.hitChance.value : stats.hitChance || 0, tooltip: true },
                { label: 'Crit Chance', value: typeof stats.critChance === 'object' ? stats.critChance.value : stats.critChance || 0, tooltip: true },
            ]
        },
        spellDamage: { // Add this new group
            title: 'Spell Damage',
            stats: [] // We'll handle this with custom rendering like resistances
        },
        defensive: {
            title: 'Defensive Stats',
            stats: [
                { label: 'Armor Class', value: typeof stats.armorClass === 'object' ? stats.armorClass.value : stats.armorClass || 0, tooltip: true },
                { label: 'Max Health', value: typeof stats.maxHealth === 'object' ? stats.maxHealth.value : stats.maxHealth || 0, tooltip: true },
                { label: 'Max Mana', value: typeof stats.maxMana === 'object' ? stats.maxMana.value : stats.maxMana || 0, tooltip: true },
                { label: 'Health Regeneration', value: typeof stats.healthRegen === 'object' ? stats.healthRegen.value : stats.healthRegen || 0, tooltip: true },
                { label: 'Mana Regeneration', value: typeof stats.manaRegen === 'object' ? stats.manaRegen.value : stats.manaRegen || 0, tooltip: true },
                { label: 'Healing Received', value: typeof stats.healingReceived === 'object' ? stats.healingReceived.value : stats.healingReceived || 0, tooltip: true },
                { label: 'Healing Power', value: typeof stats.healingPower === 'object' ? stats.healingPower.value : stats.healingPower || 0, tooltip: true }
            ]
        },
        resistances: {
            title: 'Resistances',
            stats: [] // We'll handle this with custom rendering
        },
        immunities: {
            title: 'Immunities',
            stats: [] // We'll handle this with custom rendering
        },
        utility: {
            title: 'Utility Stats',
            stats: [
                { 
                    label: 'Movement Speed', 
                    value: typeof stats.movementSpeed === 'object' ? stats.movementSpeed.value : stats.movementSpeed || 30, 
                    tooltip: true 
                },
                { 
                    label: 'Vision Range', 
                    value: typeof stats.visionRange === 'object' ? stats.visionRange.value : stats.visionRange || 60, 
                    tooltip: true 
                },
                { 
                    label: 'Swim Speed', 
                    value: typeof stats.swimSpeed === 'object' ? stats.swimSpeed.value : stats.swimSpeed || 10, 
                    tooltip: true 
                },
                { 
                    label: 'Carrying Capacity', 
                    value: typeof stats.carryingCapacity === 'object' ? stats.carryingCapacity.value : stats.carryingCapacity || '5x5',
                    tooltip: true
                },
                { label: 'Initiative', value: stats.initiative || 0, tooltip: true }
            ]
        }
    };

    const formatStatValue = (stat, value) => {
        if (typeof value !== 'number') return value;
        
        if (stat === 'Movement Speed') return `${value} ft`;
        if (stat === 'Swim Speed') return `${value} ft`;
        if (stat === 'Vision Range') return `${value} ft`;
        if (stat.includes('Resistance')) return `${value}%`;
        if (stat === 'Crit Chance') return `${value}%`;
        if (stat === 'Hit Chance') return `${value}%`;
        
        return value;
    };

    const isBaseStat = (stat) => {
        return ['strength', 'agility', 'intelligence', 'spirit', 'charisma', 'constitution'].includes(stat.toLowerCase());
    };

    const renderStatBlock = () => {
        const currentGroup = statGroups[selectedStatGroup];

        // Special case for resistances section
        if (selectedStatGroup === 'resistances') {
            return (
                <div className="character-stats">
                    <div className="stat-group-selector">
                        <select 
                            value={selectedStatGroup} 
                            onChange={(e) => setSelectedStatGroup(e.target.value)}
                            className="stat-group-dropdown"
                        >
                            {Object.entries(statGroups).map(([key, group]) => (
                                <option key={key} value={key}>{group.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="stats-content">
                        <div className="resistance-grid">
                            {Object.entries(DAMAGE_TYPES).map(([type, data]) => (
                                <div 
                                    key={type} 
                                    className="resistance-item" 
                                    onMouseEnter={(e) => handleStatHover(e, `${data.name} Resistance`, true)}
                                    onMouseMove={updateTooltipPosition}
                                    onMouseLeave={handleStatLeave}
                                >
                                    <img 
                                        src={data.icon} 
                                        alt={data.name} 
                                        className="resistance-icon" 
                                        style={{ borderColor: data.color }}
                                    />
                                    <div className="resistance-value" style={{ color: data.color }}>
                                        {stats[`${type.toLowerCase()}Resistance`] || 0}%
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Keep tooltip logic for resistances */}
                        {hoveredStat && hoveredStat.endsWith('Resistance') && (
                            <TooltipPortal>
                                <div 
                                    className="tooltip"
                                    style={{ 
                                        position: 'fixed',
                                        left: tooltipPosition.x,
                                        top: tooltipPosition.y,
                                        transform: 'translate(0, -50%)',
                                        pointerEvents: 'none',
                                        zIndex: 9999
                                    }}
                                >
                                    <ResistanceTooltip 
                                        type={hoveredStat.split(' ')[0].toLowerCase()} 
                                        value={stats[`${hoveredStat.split(' ')[0].toLowerCase()}Resistance`] || 0} 
                                    />
                                </div>
                            </TooltipPortal>
                        )}
                    </div>
                </div>
            );
        }
// Update the spellDamage case in the renderStatBlock function in Equipment.jsx
// to use your existing tooltip system

// Special case for spell damage section
if (selectedStatGroup === 'spellDamage') {
    return (
        <div className="character-stats">
            <div className="stat-group-selector">
                <select 
                    value={selectedStatGroup} 
                    onChange={(e) => setSelectedStatGroup(e.target.value)}
                    className="stat-group-dropdown"
                >
                    {Object.entries(statGroups).map(([key, group]) => (
                        <option key={key} value={key}>{group.title}</option>
                    ))}
                </select>
            </div>
            <div className="stats-content">
                <div className="spell-damage-grid">
                    {Object.entries(DAMAGE_TYPES).map(([type, data]) => (
                        <div 
                            key={type} 
                            className="spell-damage-item" 
                            onMouseEnter={(e) => handleStatHover(e, `${data.name} Damage`, true)}
                            onMouseMove={updateTooltipPosition}
                            onMouseLeave={handleStatLeave}
                        >
                            <img 
                                src={data.icon} 
                                alt={data.name} 
                                className="spell-damage-icon" 
                                style={{ borderColor: data.color }}
                            />
                            <div className="spell-damage-value" style={{ color: data.color }}>
                                {stats[`${type.toLowerCase()}SpellPower`] || 0}
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Use existing tooltip system */}
                {hoveredStat && hoveredStat.endsWith('Damage') && (
                    <TooltipPortal>
                        <div 
                            className="tooltip"
                            style={{ 
                                position: 'fixed',
                                left: tooltipPosition.x,
                                top: tooltipPosition.y,
                                transform: 'translate(0, -50%)',
                                pointerEvents: 'none',
                                zIndex: 9999
                            }}
                        >
                            <GeneralStatTooltip stat={hoveredStat} />
                        </div>
                    </TooltipPortal>
                )}
            </div>
        </div>
    );
}
        // Special case for immunities section
        if (selectedStatGroup === 'immunities') {
            return (
                <div className="character-stats">
                    <div className="stat-group-selector">
                        <select 
                            value={selectedStatGroup} 
                            onChange={(e) => setSelectedStatGroup(e.target.value)}
                            className="stat-group-dropdown"
                        >
                            {Object.entries(statGroups).map(([key, group]) => (
                                <option key={key} value={key}>{group.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="stats-content">
                        {immunities && immunities.length > 0 ? (
                            <div className="immunities-grid">
                                {immunities.map((immunity, index) => {
                                    const damageType = DAMAGE_TYPES[immunity.toLowerCase()];
                                    return damageType ? (
                                        <div 
                                            key={index} 
                                            className="immunity-item" 
                                            onMouseEnter={(e) => handleStatHover(e, `${damageType.name} Immunity`, true)}
                                            onMouseMove={updateTooltipPosition}
                                            onMouseLeave={handleStatLeave}
                                        >
                                            <img 
                                                src={damageType.icon} 
                                                alt={damageType.name} 
                                                className="resistance-icon immunity-icon" 
                                                style={{ borderColor: damageType.color }}
                                            />
                                            <div className="immunity-label" style={{ color: damageType.color }}>
                                                {damageType.name}
                                            </div>
                                        </div>
                                    ) : (
                                        <div key={index} className="immunity-item">
                                            <div className="immunity-label">
                                                {immunity}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="no-immunities">No immunities</div>
                        )}
                        
                        {/* Tooltip logic for immunities if needed */}
                        {hoveredStat && hoveredStat.endsWith('Immunity') && (
                            <TooltipPortal>
                                <div 
                                    className="tooltip"
                                    style={{ 
                                        position: 'fixed',
                                        left: tooltipPosition.x,
                                        top: tooltipPosition.y,
                                        transform: 'translate(0, -50%)',
                                        pointerEvents: 'none',
                                        zIndex: 9999
                                    }}
                                >
                                    <div className="tooltip-header" style={{ color: '#ffd100' }}>
                                        {hoveredStat}
                                    </div>
                                    <div className="tooltip-effects">
                                        <div className="tooltip-effect">
                                            Complete immunity to {hoveredStat.split(' ')[0]} damage
                                        </div>
                                        <div className="tooltip-effect">
                                            Immune to {hoveredStat.split(' ')[0]}-based status effects
                                        </div>
                                    </div>
                                </div>
                            </TooltipPortal>
                        )}
                    </div>
                </div>
            );
        }
        
        // Regular stat groups
        return (
            <div className="character-stats">
                <div className="stat-group-selector">
                    <select 
                        value={selectedStatGroup} 
                        onChange={(e) => setSelectedStatGroup(e.target.value)}
                        className="stat-group-dropdown"
                    >
                        {Object.entries(statGroups).map(([key, group]) => (
                            <option key={key} value={key}>{group.title}</option>
                        ))}
                    </select>
                </div>
                <div className="stats-content">
                    {currentGroup.stats.map((stat, index) => (
                        <div key={index} className="stat-row">
                            <div className="stat-label-container">
                                {STAT_ICONS[stat.label.toLowerCase()] && (
                                    <img 
                                        src={STAT_ICONS[stat.label.toLowerCase()]} 
                                        alt={stat.label}
                                        className="stat-icon"
                                    />
                                )}
                                <span className="stat-label">{stat.label}:</span>
                            </div>
                            <span className="stat-value">
                                {formatStatValue(stat.label, stat.value)}
                                {typeof stat.modifier === 'number' && (
                                    <span className="stat-modifier">
                                        ({stat.modifier >= 0 ? '+' : ''}{stat.modifier})
                                    </span>
                                )}
                            </span>
                            {stat.tooltip && (
                                <div 
                                    className="tooltip-trigger"
                                    onMouseEnter={(e) => handleStatHover(e, stat.label)}
                                    onMouseMove={updateTooltipPosition}
                                    onMouseLeave={handleStatLeave}
                                />
                            )}
                            {stat.subStats && (
                                <div className="sub-stats-row">
                                    <div className="sub-stats-grid">
                                        {stat.subStats.map((subStat, i) => (
                                            <div 
                                                key={i} 
                                                className="sub-stat-item" 
                                                style={{ borderColor: subStat.color }}
                                                onMouseEnter={(e) => {
                                                    const tooltipType = stat.label === 'Resistances' ? 'Resistance' : 'Damage';
                                                    const label = `${subStat.label} ${tooltipType}`;
                                                    handleStatHover(e, label, true);
                                                }}
                                                onMouseMove={updateTooltipPosition}
                                                onMouseLeave={handleStatLeave}
                                            >
                                                <img src={subStat.icon} alt={subStat.label} className="sub-stat-icon" />
                                                {subStat.showValue && (
                                                    <div className="sub-stat-value" style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: subStat.color, border: `1px solid ${subStat.color}` }}>
                                                        {stat.label === 'Resistances' ? 
                                                            (stats[`${subStat.label.toLowerCase()}Resistance`] || 0) : 
                                                            (stats[`${subStat.label.toLowerCase()}SpellPower`] || 0)
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {hoveredStat && (hoveredStat.endsWith('Damage') || hoveredStat.endsWith('Resistance')) && (
                                <TooltipPortal>
                                    <div 
                                        className="tooltip"
                                        style={{ 
                                            position: 'fixed',
                                            left: tooltipPosition.x,
                                            top: tooltipPosition.y,
                                            transform: 'translate(0, -50%)',
                                            pointerEvents: 'none',
                                            zIndex: 9999
                                        }}
                                    >
                                        {hoveredStat.endsWith('Resistance') ? (
                                            <ResistanceTooltip 
                                                type={hoveredStat.split(' ')[0].toLowerCase()} 
                                                value={stats[`${hoveredStat.split(' ')[0].toLowerCase()}Resistance`] || 0} 
                                            />
                                        ) : (
                                            <GeneralStatTooltip stat={hoveredStat} />
                                        )}
                                    </div>
                                </TooltipPortal>
                            )}
                            {hoveredStat === stat.label && (
                                <TooltipPortal>
                                    <div 
                                        className="tooltip"
                                        style={{ 
                                            position: 'fixed',
                                            left: tooltipPosition.x,
                                            top: tooltipPosition.y,
                                            transform: 'translate(0, 0)',
                                            pointerEvents: 'none'
                                        }}
                                    >
                                        {stat.label.toLowerCase().includes('resistance') ? (
                                            <ResistanceTooltip type={stat.label.toLowerCase().replace(' resistance', '')} value={stat.value} />
                                        ) : isBaseStat(stat.label.toLowerCase()) ? (
                                            <StatTooltip stat={stat.label.toLowerCase()} value={stat.value} />
                                        ) : (
                                            <GeneralStatTooltip stat={stat.label} />
                                        )}
                                    </div>
                                </TooltipPortal>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderSlot = (slotName, slotConfig) => {
        const item = equipment[slotName];
        const isEmpty = !item;
        
        return (
            <div
                key={slotName}
                className={`gear-slot ${isEmpty ? 'empty' : ''}`}
                style={slotConfig.position}
                onMouseEnter={() => setHoveredSlot(slotName)}
                onMouseLeave={() => setHoveredSlot(null)}
            >
                <img 
                    src={item ? item.icon : slotConfig.icon} 
                    alt={slotName}
                    title={isEmpty ? slotConfig.info : ''}
                />
                {hoveredSlot === slotName && item && renderTooltip(item)}
            </div>
        );
    };

    const renderTooltip = (item) => {
        if (!item) return null;
        
        return (
            <div className="item-tooltip">
                <div className="item-name" style={{ color: '#fff' }}>
                    {item.name}
                </div>
                <div className="item-type">
                    {item.type} {item.subtype ? `• ${item.subtype}` : ''}
                </div>
                {(item.stats || item.resistances) && (
                    <div className="item-stats">
                        {item.stats && Object.entries(item.stats).map(([stat, value]) => (
                            <div key={stat} style={{ color: value > 0 ? '#1eff00' : '#ff1e1e' }}>
                                {value > 0 ? '+' : ''}{value} {stat}
                            </div>
                        ))}
                        {item.resistances && Object.entries(item.resistances).map(([type, value]) => (
                            <div key={type} style={{ color: '#fff' }}>
                                +{value} {type.charAt(0).toUpperCase() + type.slice(1)} Resistance
                            </div>
                        ))}
                    </div>
                )}
                {item.description && (
                    <div className="item-description">
                        "{item.description}"
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="equipment-panel">
            <div className="character-header">
                <div className="character-info">
                    <div className="character-name">{name}</div>
                    <div className="character-race">{race}</div>
                </div>
                
                <div className="resource-bars">
                    <ResourceBar
                        current={health.current}
                        max={health.max}
                        className="health"
                        label="HP"
                    />
                    <ResourceBar
                        current={mana.current}
                        max={mana.max}
                        className="mana"
                        label="MP"
                    />
                    <ResourceBar
                        current={actionPoints.current}
                        max={actionPoints.max}
                        className="action-points"
                        label="AP"
                    />
                </div>

                <div className="character-status">
                    <div className="alignment">
                        <span className="status-label">Alignment:</span>
                        <span className="status-value">{alignment}</span>
                    </div>
                    <div className="exhaustion">
                        <span className="status-label">Exhaustion:</span>
                        <span className="status-value">Level {exhaustionLevel}</span>
                    </div>
                </div>
            </div>
            <div className="character-model">
                <div className="character-image-container">
                    <img 
                        src="https://wow.zamimg.com/uploads/screenshots/normal/1046017-human-priest.jpg" 
                        alt="Character Portrait" 
                        className="character-portrait"
                    />
                    {Object.entries(slots).map(([slotName, config]) => renderSlot(slotName, config))}
                </div>
                {renderStatBlock()}
            </div>
            <div className="weapon-slots">
                {Object.entries(weaponSlots).map(([slotName, config]) => {
                    const item = equipment[slotName];
                    const isEmpty = !item;
                    
                    return (
                        <div
                            key={slotName}
                            className={`weapon-slot ${isEmpty ? 'empty' : ''}`}
                            onMouseEnter={() => setHoveredSlot(slotName)}
                            onMouseLeave={() => setHoveredSlot(null)}
                        >
                            <img 
                                src={item ? item.icon : config.icon} 
                                alt={slotName}
                                title={isEmpty ? config.info : ''}
                            />
                            {hoveredSlot === slotName && item && renderTooltip(item)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}