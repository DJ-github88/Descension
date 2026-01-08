import React, { useState, useEffect, useRef } from 'react';
import useCharacterStore from '../../store/characterStore';
import useInventoryStore from '../../store/inventoryStore';
import { useInspectionCharacter } from '../../contexts/InspectionContext';
import useBuffStore from '../../store/buffStore';
import useDebuffStore from '../../store/debuffStore';
import useGameStore from '../../store/gameStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import { calculateEquipmentBonuses, calculateDerivedStats } from '../../utils/characterUtils';
import { calculateEffectiveMovementSpeed } from '../../utils/conditionUtils';
import { getXPProgress, formatXP } from '../../utils/experienceUtils';
import { getRacialStatModifiers } from '../../utils/raceDisciplineSpellUtils';
import { getRacialSavingThrowModifiers } from '../../data/raceData';
import StatTooltip from '../tooltips/StatTooltip';
import GeneralStatTooltip from '../tooltips/GeneralStatTooltip';
import ResistanceTooltip from '../tooltips/ResistanceTooltip';
import ConditionTooltip from '../tooltips/ConditionTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import { getCustomIconUrl } from '../../utils/assetManager';
import '../../styles/character-sheet.css';

// Condition icons mapping
const CONDITION_ICONS = {
    fear: getCustomIconUrl('Fire/Fiery Skull', 'abilities'),
    charm: getCustomIconUrl('Psychic/Hypnotic Eye', 'abilities'),
    stun: getCustomIconUrl('Utility/Stun', 'abilities'),
    paralyze: getCustomIconUrl('Lightning/Lightning Bolt', 'abilities'),
    poison: getCustomIconUrl('Poison/Poison Venom', 'abilities'),
    disease: getCustomIconUrl('Necrotic/Decayed Skull', 'abilities'),
    sleep: getCustomIconUrl('Utility/Sleep', 'abilities'),
    petrify: getCustomIconUrl('Necrotic/Shattering Crystal', 'abilities'),
    blinded: getCustomIconUrl('Utility/Bloodshot Eye', 'abilities'),
    deafened: getCustomIconUrl('Lightning/Lightning Storm', 'abilities'),
    prone: getCustomIconUrl('Utility/Dynamic Lunge', 'abilities'),
    restrained: getCustomIconUrl('Utility/Chained', 'abilities'),
    grappled: getCustomIconUrl('General/Grab', 'abilities'),
    exhaustion: getCustomIconUrl('Fire/Dripping Lava', 'abilities'),
    frightened: getCustomIconUrl('Necrotic/Screaming Skull', 'abilities'),
    incapacitated: getCustomIconUrl('Utility/Paralyzed', 'abilities'),
    unconscious: getCustomIconUrl('Utility/Sleep', 'abilities')
};

// Damage types for resistances and spell power (alphabetically ordered)
const DAMAGE_TYPES = {
    // Magical damage types (alphabetical)
    arcane: {
        name: 'Arcane',
        icon: getCustomIconUrl('Arcane/Orb Manipulation', 'abilities'),
        color: '#9370DB'
    },
    chaos: {
        name: 'Chaos',
        icon: getCustomIconUrl('Chaos/Chaotic Shuffle', 'abilities'),
        color: '#ec4899'
    },
    fire: {
        name: 'Fire',
        icon: getCustomIconUrl('Fire/Flame Burst', 'abilities'),
        color: '#FF4500'
    },
    force: {
        name: 'Force',
        icon: getCustomIconUrl('Force/Force Touch', 'abilities'),
        color: '#9370DB'
    },
    frost: {
        name: 'Frost',
        icon: getCustomIconUrl('Frost/Dripping Ice', 'abilities'),
        color: '#87CEEB'
    },
    lightning: {
        name: 'Lightning',
        icon: getCustomIconUrl('Lightning/Lightning Bolt', 'abilities'),
        color: '#b8860b'
    },
    nature: {
        name: 'Nature',
        icon: getCustomIconUrl('Nature/Nature Natural', 'abilities'),
        color: '#228B22'
    },
    necrotic: {
        name: 'Necrotic',
        icon: getCustomIconUrl('Necrotic/Necrotic Skull', 'abilities'),
        color: '#8B008B'
    },
    poison: {
        name: 'Poison',
        icon: getCustomIconUrl('Poison/Poison Venom', 'abilities'),
        color: '#228B22'
    },
    psychic: {
        name: 'Psychic',
        icon: getCustomIconUrl('Psychic/Brain Psionics', 'abilities'),
        color: '#FF1493'
    },
    radiant: {
        name: 'Radiant',
        icon: getCustomIconUrl('Radiant/Radiant Sunburst', 'abilities'),
        color: '#b8860b'
    },
    void: {
        name: 'Void',
        icon: getCustomIconUrl('Void/Black Hole', 'abilities'),
        color: '#1a1a2e'
    },
    // Physical damage types (alphabetical)
    bludgeoning: {
        name: 'Bludgeoning',
        icon: getCustomIconUrl('Bludgeoning/Hammer', 'abilities'),
        color: '#8B4513'
    },
    piercing: {
        name: 'Piercing',
        icon: getCustomIconUrl('Piercing/Scatter Shot', 'abilities'),
        color: '#708090'
    },
    slashing: {
        name: 'Slashing',
        icon: getCustomIconUrl('Slashing/Bloody Meat Cleaver', 'abilities'),
        color: '#B22222'
    }
};

// Stat icons mapping
const STAT_ICONS = {
    'strength': getCustomIconUrl('General/Strength', 'abilities'),
    'agility': getCustomIconUrl('Piercing/Scatter Shot', 'abilities'),
    'constitution': getCustomIconUrl('Healing/Heart Shield', 'abilities'),
    'intelligence': getCustomIconUrl('Psychic/Brain Psionics', 'abilities'),
    'spirit': getCustomIconUrl('Radiant/Radiant Aura', 'abilities'),
    'charisma': getCustomIconUrl('Radiant/Radiant Aura', 'abilities')
};

const getSoakDieFromArmor = (armorValue = 0) => {
    const armor = Math.max(0, Math.floor(armorValue));
    if (armor < 5) return '—';
    if (armor <= 9) return '1d4';
    if (armor <= 14) return '1d6';
    if (armor <= 19) return '1d8';
    if (armor <= 24) return '1d10';
    if (armor <= 29) return '1d12';
    if (armor <= 34) return '1d12 + 1d4';
    if (armor <= 39) return '1d12 + 1d6';
    if (armor <= 44) return '2d12';
    if (armor <= 49) return '2d12 + 1d4';
    return '2d12 + 1d6';
};

// Stat Edit Modal Component
function StatEditModal({ stat, initialValue, position, onSubmit, onCancel }) {
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef(null);
    const modalRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onCancel();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onCancel]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= 1) {
            onSubmit(numValue);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onCancel();
        } else if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    // Use the pre-calculated position (already adjusted for viewport)
    const modalStyle = {
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 99999999,
        background: 'linear-gradient(135deg, #d4c4a0 0%, #c4b490 50%, #b4a480 100%)',
        border: '2px solid #8b7355',
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        minWidth: '180px'
    };

    return (
        <div ref={modalRef} style={modalStyle}>
            <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#5a1e12' }}>
                Edit {stat.label}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    ref={inputRef}
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    min="1"
                    max="30"
                    style={{
                        width: '100%',
                        padding: '4px 8px',
                        border: '1px solid #8b7355',
                        borderRadius: '4px',
                        fontSize: '14px',
                        marginBottom: '8px'
                    }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        type="submit"
                        style={{
                            flex: 1,
                            padding: '4px 8px',
                            background: '#7a3b2e',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        Set
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            flex: 1,
                            padding: '4px 8px',
                            background: '#666',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function CharacterStats() {
    // Use inspection context if available, otherwise use regular character store
    const inspectionData = useInspectionCharacter();
    const characterStore = useCharacterStore();

    // Choose data source based on whether we're in inspection mode
    const dataSource = inspectionData || characterStore;



    const {
        stats = { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 },
        equipment = {},
        health = { current: 50, max: 50 },
        mana = { current: 50, max: 50 },
        actionPoints = { current: 3, max: 3 },
        level = 1,
        experience = 0,
        resistances = {},
        immunities = [],
        exhaustionLevel = 0,
        pathPassives = [],
        race,
        subrace,
        updateStat
    } = dataSource || {};

    const { getActiveEffects } = useBuffStore();
    const { getActiveDebuffEffects } = useDebuffStore();
    const { isGMMode } = useGameStore();
    const { encumbranceState } = useInventoryStore();
    const { characterTokens } = useCharacterTokenStore();

    // Get derived stats and exhaustion level from character store (includes encumbrance effects)
    const { derivedStats, exhaustionLevel: storeExhaustionLevel } = useCharacterStore();

    const [selectedStatGroup, setSelectedStatGroup] = useState('summary');
    const [showLabels, setShowLabels] = useState(false); // Start with icons only
    const [hoveredStat, setHoveredStat] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [statEditModal, setStatEditModal] = useState({ visible: false, stat: null, value: 0, position: { x: 0, y: 0 } });
    // Track exhaustion level for movement speed updates

    // Show loading state while character data is unavailable
    if (!dataSource) {
        return (
            <div className="stats-container">
                <div className="stats-navigation">
                    <div style={{ padding: '20px', color: '#5a1e12' }}>
                        Loading character stats...
                    </div>
                </div>
            </div>
        );
    }

    // Calculate total stats including equipment and buff/debuff effects
    const getTotalStats = () => {
        const equipmentBonuses = calculateEquipmentBonuses(equipment);
        const buffEffects = getActiveEffects();
        const debuffEffects = getActiveDebuffEffects();

        // Use encumbrance state from inventory store hook
        const currentEncumbranceState = encumbranceState || 'normal';

        const totalStats = { ...stats };

        // Apply equipment bonuses
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

            Object.entries(statMapping).forEach(([shortName, fullName]) => {
                if (equipmentBonuses[shortName]) {
                    totalStats[fullName] = (totalStats[fullName] || 0) + equipmentBonuses[shortName];
                }
            });

            // Calculate derived stats with equipment bonuses and encumbrance
            // Use store exhaustion level if available, otherwise use dataSource exhaustion level
            const finalExhaustionLevel = storeExhaustionLevel !== undefined ? storeExhaustionLevel : (exhaustionLevel !== undefined ? exhaustionLevel : (dataSource?.exhaustionLevel || 0));
            const calculatedDerivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, currentEncumbranceState, finalExhaustionLevel, health, race, subrace);

            // Use derived stats from character store (already includes encumbrance effects) or fallback to calculated
            const storeDerivedStats = derivedStats || {};
            totalStats.healthRegen = storeDerivedStats.healthRegen || calculatedDerivedStats.healthRegen;
            totalStats.manaRegen = storeDerivedStats.manaRegen || calculatedDerivedStats.manaRegen;
            totalStats.healingPower = storeDerivedStats.healingPower || calculatedDerivedStats.healingPower;
            totalStats.spellDamage = storeDerivedStats.spellDamage || calculatedDerivedStats.spellDamage;
            totalStats.damage = storeDerivedStats.damage || calculatedDerivedStats.damage;
            totalStats.rangedDamage = storeDerivedStats.rangedDamage || calculatedDerivedStats.rangedDamage;
            totalStats.slashingDamage = storeDerivedStats.slashingDamage || calculatedDerivedStats.slashingDamage || 0;
            totalStats.bludgeoningDamage = storeDerivedStats.bludgeoningDamage || calculatedDerivedStats.bludgeoningDamage || 0;
            totalStats.piercingDamage = storeDerivedStats.piercingDamage || calculatedDerivedStats.piercingDamage || 0;
            // Always use calculated values for armor, health, and mana to ensure they reflect current stats and equipment
            totalStats.armor = calculatedDerivedStats.armor;
            totalStats.maxHealth = calculatedDerivedStats.maxHealth;
            totalStats.maxMana = calculatedDerivedStats.maxMana;
            // Always use calculated values for movement speeds to ensure they reflect exhaustion effects
            const baseMovementSpeed = calculatedDerivedStats.moveSpeed || 0;
            
            // Apply condition-based modifiers to movement speed
            // Get character token conditions
            const playerToken = characterTokens.find(t => t.isPlayerToken) || characterTokens[0];
            const conditions = playerToken?.state?.conditions || [];
            
            // Apply condition modifiers using the utility function
            totalStats.movementSpeed = calculateEffectiveMovementSpeed(baseMovementSpeed, conditions);
            totalStats.swimSpeed = calculatedDerivedStats.swimSpeed || 0;
            totalStats.climbSpeed = calculatedDerivedStats.climbSpeed || 0;

            // Apply encumbrance effects to base stats for display purposes
            const encumbranceEffects = storeDerivedStats.encumbranceEffects || calculatedDerivedStats.encumbranceEffects;
            if (encumbranceEffects) {
                const effects = encumbranceEffects;

                // Apply base stat multiplier to most stats for display
                totalStats.agility = Math.floor(totalStats.agility * effects.baseStatMultiplier);
                totalStats.intelligence = Math.floor(totalStats.intelligence * effects.baseStatMultiplier);
                totalStats.spirit = Math.floor(totalStats.spirit * effects.baseStatMultiplier);
                totalStats.charisma = Math.floor(totalStats.charisma * effects.baseStatMultiplier);

                // Strength gets special treatment - it gets bonuses from encumbrance
                if (currentEncumbranceState === 'encumbered') {
                    totalStats.strength = Math.floor(totalStats.strength * 1.05);
                } else if (currentEncumbranceState === 'overencumbered') {
                    totalStats.strength = Math.floor(totalStats.strength * 1.15);
                }

                // Apply special constitution multiplier
                totalStats.constitution = Math.floor(totalStats.constitution * effects.constitutionMultiplier);

                // Store disadvantage info for UI
                totalStats.hasEncumbranceDisadvantage = effects.hasDisadvantage;
                totalStats.encumbranceState = currentEncumbranceState;
            }

            // Add spell damage types from equipment
            if (equipmentBonuses.spellDamageTypes) {
                Object.entries(equipmentBonuses.spellDamageTypes).forEach(([spellType, value]) => {
                    const spellPowerKey = `${spellType}SpellPower`;
                    // Base spell power is 0, only equipment bonuses
                    const baseSpellPower = 0;
                    totalStats[spellPowerKey] = Math.round(baseSpellPower + value);
                });
            }

            // Add immunities from equipment
            if (equipmentBonuses.immunities && equipmentBonuses.immunities.length > 0) {
                totalStats.immunities = [...(totalStats.immunities || []), ...equipmentBonuses.immunities];
                // Remove duplicates
                totalStats.immunities = [...new Set(totalStats.immunities)];
            }

            // Add condition modifiers from equipment
            if (equipmentBonuses.conditionModifiers) {
                totalStats.conditionModifiers = { ...(totalStats.conditionModifiers || {}), ...equipmentBonuses.conditionModifiers };
            }
        }

        // Initialize spell power types if they don't exist (needed for buff effects)
        const spellDamageTypes = ['fire', 'frost', 'arcane', 'nature', 'lightning', 'acid', 'force', 'thunder', 'chaos', 'necrotic', 'radiant'];
        spellDamageTypes.forEach(type => {
            const spellPowerKey = `${type}SpellPower`;
            if (!totalStats.hasOwnProperty(spellPowerKey)) {
                totalStats[spellPowerKey] = 0;
            }
        });

        // Apply buff effects (positive)
        Object.entries(buffEffects).forEach(([effectType, effects]) => {
            effects.forEach(effect => {
                // Initialize stat if it doesn't exist (for spell power types)
                if (!totalStats.hasOwnProperty(effectType)) {
                    totalStats[effectType] = 0;
                }
                totalStats[effectType] = (totalStats[effectType] || 0) + effect.value;
            });
        });

        // Apply debuff effects (negative)
        Object.entries(debuffEffects).forEach(([effectType, effects]) => {
            effects.forEach(effect => {
                // Initialize stat if it doesn't exist (for spell power types)
                if (!totalStats.hasOwnProperty(effectType)) {
                    totalStats[effectType] = 0;
                }
                totalStats[effectType] = (totalStats[effectType] || 0) + effect.value;
            });
        });

        return totalStats;
    };

    // Calculate individual stat components for tooltips
    const getStatComponents = (statName) => {
        const equipmentBonuses = calculateEquipmentBonuses(equipment);
        const buffEffects = getActiveEffects();
        const debuffEffects = getActiveDebuffEffects();
        const currentEncumbranceState = encumbranceState || 'normal';

        const statMapping = {
            str: 'strength',
            con: 'constitution',
            agi: 'agility',
            int: 'intelligence',
            spir: 'spirit',
            cha: 'charisma'
        };

        // Find the short name for equipment bonuses
        const shortName = Object.keys(statMapping).find(key => statMapping[key] === statName);

        // Calculate encumbrance effects
        let encumbranceMultiplier = 1.0;
        let encumbranceDescription = '';

        if (currentEncumbranceState === 'encumbered') {
            if (statName === 'strength' || statName === 'constitution') {
                encumbranceMultiplier = 1.05; // +5% for Strength and Constitution
                encumbranceDescription = 'Encumbered (+5%)';
            } else {
                encumbranceMultiplier = 0.95; // -5% for other stats
                encumbranceDescription = 'Encumbered (-5%)';
            }
        } else if (currentEncumbranceState === 'overencumbered') {
            if (statName === 'strength' || statName === 'constitution') {
                encumbranceMultiplier = 1.15; // +15% for Strength and Constitution
                encumbranceDescription = 'Overencumbered (+15%)';
            } else {
                encumbranceMultiplier = 0.85; // -15% for other stats
                encumbranceDescription = 'Overencumbered (-15%)';
            }
        }

        const baseStat = stats[statName] || 0;
        const equipmentBonus = (equipmentBonuses && shortName) ? (equipmentBonuses[shortName] || 0) : 0;

        // Calculate encumbrance effect on the final stat (base + equipment)
        const preEncumbranceStat = baseStat + equipmentBonus;
        const encumbranceEffect = Math.floor(preEncumbranceStat * encumbranceMultiplier) - preEncumbranceStat;

        const components = {
            base: baseStat,
            equipment: equipmentBonus,
            encumbrance: encumbranceEffect,
            encumbranceDescription: encumbranceDescription,
            buffs: 0,
            debuffs: 0
        };

        // Calculate buff effects for this stat
        if (buffEffects[statName]) {
            buffEffects[statName].forEach(effect => {
                components.buffs += effect.value;
            });
        }

        // Calculate debuff effects for this stat
        if (debuffEffects[statName]) {
            debuffEffects[statName].forEach(effect => {
                components.debuffs += effect.value;
            });
        }

        return components;
    };

    // Get encumbrance effects for derived stats
    const getEncumbranceEffectForStat = (statLabel, currentValue, baseValue) => {
        const currentEncumbranceState = encumbranceState || 'normal';

        if (currentEncumbranceState === 'normal') {
            return { effect: 0, description: '' };
        }

        // For derived stats like Max Health and Max Mana, encumbrance affects them indirectly
        // through changes to the underlying stats (constitution/intelligence)

        if (statLabel.toLowerCase().includes('health') && statLabel.toLowerCase().includes('max')) {
            // Max Health is based on constitution
            const baseStat = stats.constitution || 10;
            let encumbranceMultiplier = 1.0;
            let description = '';

            if (currentEncumbranceState === 'encumbered') {
                encumbranceMultiplier = 1.05; // +5%
                description = 'Constitution affected by encumbrance (+5%)';
            } else if (currentEncumbranceState === 'overencumbered') {
                encumbranceMultiplier = 1.15; // +15% for constitution when overencumbered
                description = 'Constitution affected by overencumbrance (+15%)';
            }

            // Calculate the difference in max health due to constitution change
            const originalConstitution = baseStat;
            const modifiedConstitution = Math.floor(originalConstitution * encumbranceMultiplier);
            const healthDifference = (modifiedConstitution - originalConstitution) * 5; // 5 HP per constitution point

            return {
                effect: healthDifference,
                description: description
            };

        } else if (statLabel.toLowerCase().includes('mana') && statLabel.toLowerCase().includes('max')) {
            // Max Mana is based on intelligence
            const baseStat = stats.intelligence || 10;
            let encumbranceMultiplier = 1.0;
            let description = '';

            if (currentEncumbranceState === 'encumbered') {
                encumbranceMultiplier = 0.95; // -5%
                description = 'Intelligence affected by encumbrance (-5%)';
            } else if (currentEncumbranceState === 'overencumbered') {
                encumbranceMultiplier = 0.85; // -15% for intelligence when overencumbered
                description = 'Intelligence affected by overencumbrance (-15%)';
            }

            // Calculate the difference in max mana due to intelligence change
            const originalIntelligence = baseStat;
            const modifiedIntelligence = Math.floor(originalIntelligence * encumbranceMultiplier);
            const manaDifference = (modifiedIntelligence - originalIntelligence) * 5; // 5 MP per intelligence point

            return {
                effect: manaDifference,
                description: description
            };
        } else if (statLabel.toLowerCase().includes('movement') && statLabel.toLowerCase().includes('speed')) {
            // Movement Speed has specific encumbrance penalties
            let encumbranceMultiplier = 1.0;
            let description = '';

            if (currentEncumbranceState === 'encumbered') {
                encumbranceMultiplier = 0.75; // -25% for movement speed when encumbered
                description = 'Movement speed reduced by encumbrance (-25%)';
            } else if (currentEncumbranceState === 'overencumbered') {
                encumbranceMultiplier = 0.25; // -75% for movement speed when overencumbered
                description = 'Movement speed severely reduced by overencumbrance (-75%)';
            }

            // Calculate the effect on movement speed based on the base value provided
            // The baseValue should be the speed before encumbrance is applied
            const speedWithEncumbrance = Math.floor(baseValue * encumbranceMultiplier);
            const effect = speedWithEncumbrance - baseValue;

            return {
                effect: effect,
                description: description
            };
        }

        // For armor, encumbrance affects it indirectly through agility changes
        // The agility modifier already includes encumbrance effects, so we return 0 here
        // to avoid double-counting
        if (statLabel.toLowerCase() === 'armor') {
            return { effect: 0, description: 'Encumbrance affects armor indirectly through agility' };
        }

        // For other derived stats, use the old logic
        let encumbranceMultiplier = 1.0;
        let description = '';

        if (currentEncumbranceState === 'encumbered') {
            encumbranceMultiplier = 0.95; // -5%
            description = 'Encumbered (-5%)';
        } else if (currentEncumbranceState === 'overencumbered') {
            encumbranceMultiplier = 0.85; // -15%
            description = 'Overencumbered (-15%)';
        }

        let preEncumbranceValue = baseValue;

        // Calculate what the value would be with encumbrance applied
        const valueWithEncumbrance = Math.floor(preEncumbranceValue * encumbranceMultiplier);
        const effect = valueWithEncumbrance - preEncumbranceValue;

        return { effect, description };
    };

    // Get equipment bonus for derived stats
    // Returns either a number or an object with detailed breakdown for armor
    const getEquipmentBonusForStat = (statLabel) => {
        const equipmentBonuses = calculateEquipmentBonuses(equipment);

        if (statLabel.toLowerCase().includes('health') && statLabel.toLowerCase().includes('max')) {
            return equipmentBonuses.maxHealth || 0;
        } else if (statLabel.toLowerCase().includes('mana') && statLabel.toLowerCase().includes('max')) {
            return equipmentBonuses.maxMana || 0;
        } else if (statLabel.toLowerCase().includes('movement') && statLabel.toLowerCase().includes('speed')) {
            return equipmentBonuses.moveSpeed || 0;
        } else if (statLabel.toLowerCase() === 'armor') {
            // For armor, we need to match calculateDerivedStats exactly:
            // baseArmor = racial + Math.floor((totalAgility - 10) / 2) where totalAgility = base + equipment
            // armor = baseArmor + equipmentBonuses.armor
            //
            // But for display, we want to show:
            // - Base: racial + baseAgilityModifier
            // - Equipment: directArmor + equipmentAgilityModifier
            //
            // The key insight: calculateDerivedStats uses totalAgility for the modifier, but we split it
            const directArmorBonus = equipmentBonuses.armor || 0;
            const agilityEquipmentBonus = equipmentBonuses.agi || 0;
            
            // Calculate total agility (base + equipment) - this is what calculateDerivedStats uses
            const baseAgilityStat = stats.agility || 0;
            let totalAgility = baseAgilityStat + agilityEquipmentBonus;
            
            // Apply encumbrance effects (matching calculateDerivedStats logic exactly)
            const currentEncumbranceState = encumbranceState || 'normal';
            if (currentEncumbranceState === 'encumbered') {
                totalAgility = Math.floor(totalAgility * 0.95);
            } else if (currentEncumbranceState === 'overencumbered') {
                totalAgility = Math.floor(totalAgility * 0.85);
            }
            
            // This is what calculateDerivedStats uses for the agility modifier
            const totalAgilityModifier = Math.floor((totalAgility - 10) / 2);
            
            // For display, calculate base agility modifier separately
            let modifiedBaseAgility = baseAgilityStat;
            if (currentEncumbranceState === 'encumbered') {
                modifiedBaseAgility = Math.floor(modifiedBaseAgility * 0.95);
            } else if (currentEncumbranceState === 'overencumbered') {
                modifiedBaseAgility = Math.floor(modifiedBaseAgility * 0.85);
            }
            const baseAgilityModifier = Math.floor((modifiedBaseAgility - 10) / 2);
            
            // Equipment agility modifier is the difference (how much equipment agility adds)
            const equipmentAgilityModifier = totalAgilityModifier - baseAgilityModifier;
            
            // Return breakdown - note that baseValue already includes baseAgilityModifier
            // So equipment should only show directArmor + equipmentAgilityModifier
            return {
                total: directArmorBonus + equipmentAgilityModifier,
                directArmor: directArmorBonus,
                fromAgility: equipmentAgilityModifier, // Only the equipment portion
                agilityEquipmentBonus: agilityEquipmentBonus,
                totalAgility: totalAgility,
                totalAgilityModifier: totalAgilityModifier,
                baseAgilityModifier: baseAgilityModifier // For reference
            };
        } else if (statLabel.toLowerCase().includes('power')) {
            // For spell power types like "Arcane Power", extract the type and check equipment
            const powerMatch = statLabel.toLowerCase().match(/(\w+)\s+power/);
            if (powerMatch && equipmentBonuses.spellDamageTypes) {
                const spellType = powerMatch[1];
                return equipmentBonuses.spellDamageTypes[spellType] || 0;
            }
        }

        // For other derived stats, return 0 for now (can be expanded later)
        return 0;
    };

    // Get buff and debuff effects for derived stats
    const getBuffDebuffEffectsForStat = (statLabel) => {
        const buffEffects = getActiveEffects();
        const debuffEffects = getActiveDebuffEffects();

        // Convert stat label to potential effect keys
        // For spell power types like "Arcane Power", we need to match "arcaneSpellPower"
        const statKey = statLabel.toLowerCase().replace(/\s+/g, '');
        
        // Extract the spell type from labels like "Arcane Power" -> "arcane"
        let spellType = null;
        if (statLabel.toLowerCase().includes('power')) {
            const powerMatch = statLabel.toLowerCase().match(/(\w+)\s+power/);
            if (powerMatch) {
                spellType = powerMatch[1];
            }
        }
        
        const alternativeKeys = [
            statLabel.toLowerCase(),
            statKey,
            statLabel.toLowerCase().replace(' ', ''),
            statLabel.toLowerCase().replace(/\s+/g, '_'),
            // For spell power: "Arcane Power" -> "arcaneSpellPower"
            spellType ? `${spellType}SpellPower` : null,
            spellType ? `${spellType}spellpower` : null,
            spellType ? `${spellType}_spell_power` : null
        ].filter(Boolean); // Remove null values

        let buffEffect = 0;
        let debuffEffect = 0;
        let conditionEffect = 0;

        // Check for buff effects
        alternativeKeys.forEach(key => {
            if (buffEffects[key]) {
                buffEffects[key].forEach(effect => {
                    buffEffect += effect.value;
                });
            }
        });

        // Check for debuff effects
        alternativeKeys.forEach(key => {
            if (debuffEffects[key]) {
                debuffEffects[key].forEach(effect => {
                    debuffEffect += effect.value;
                });
            }
        });

        // For armor, check for condition effects (like "defending" which adds +2 armor)
        if (statLabel.toLowerCase() === 'armor') {
            const playerToken = characterTokens.find(t => t.isPlayerToken) || characterTokens[0];
            const conditions = playerToken?.state?.conditions || [];
            const conditionIds = conditions.map(c => c.id || c.name?.toLowerCase());
            
            // Defending condition adds +2 armor
            if (conditionIds.includes('defending')) {
                conditionEffect += 2;
            }
            
            // Check for other conditions that might affect armor
            // (This can be extended as needed)
        }

        // For Movement Speed, also check conditions
        if (statLabel.toLowerCase().includes('movement') && statLabel.toLowerCase().includes('speed')) {
            const playerToken = characterTokens.find(t => t.isPlayerToken) || characterTokens[0];
            const conditions = playerToken?.state?.conditions || [];
            
            if (conditions.length > 0) {
                // Get the base speed before conditions (after equipment and encumbrance)
                const equipmentBonuses = calculateEquipmentBonuses(equipment);
                const currentEncumbranceState = encumbranceState || 'normal';
                const baseSpeed = 30; // Base movement speed
                const equipmentSpeed = equipmentBonuses.moveSpeed || 0;
                const speedAfterEquipment = baseSpeed + equipmentSpeed;
                
                // Calculate speed after encumbrance
                let speedAfterEncumbrance = speedAfterEquipment;
                if (currentEncumbranceState === 'encumbered') {
                    speedAfterEncumbrance = Math.floor(speedAfterEquipment * 0.75);
                } else if (currentEncumbranceState === 'overencumbered') {
                    speedAfterEncumbrance = Math.floor(speedAfterEquipment * 0.25);
                }
                
                // Calculate speed after conditions
                const speedAfterConditions = calculateEffectiveMovementSpeed(speedAfterEncumbrance, conditions);
                
                // Calculate the condition effect (difference from speed after encumbrance)
                const conditionEffect = speedAfterConditions - speedAfterEncumbrance;
                
                // Add condition effect to buff or debuff based on whether it's positive or negative
                // This represents the net effect of all conditions (hasted, slowed, restrained, etc.)
                if (conditionEffect > 0) {
                    buffEffect += conditionEffect;
                } else if (conditionEffect < 0) {
                    debuffEffect += conditionEffect; // Already negative
                }
            }
        }

        return { buffEffect, debuffEffect, conditionEffect };
    };

    const totalStats = getTotalStats();

    const handleStatChange = (statName, value) => {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
            // Calculate what the base stat should be to achieve the desired total
            // Get all current components
            const components = getStatComponents(statName);
            const nonBaseBonus = components.equipment + components.buffs + components.debuffs;

            // Calculate new base stat to achieve desired total
            const newBaseStat = numValue - nonBaseBonus;
            updateStat(statName, Math.max(1, newBaseStat)); // Ensure minimum of 1
        }
    };

    // Handle right-click on stat for editing
    const handleStatRightClick = (e, stat) => {
        e.preventDefault();
        e.stopPropagation();

        // Only allow editing in GM mode and for base stats
        if (!isGMMode || !stat.statName) return;

        // Get the element's position to place modal above it
        const rect = e.currentTarget.getBoundingClientRect();
        const modalWidth = 180; // Approximate modal width
        const modalHeight = 100; // Approximate modal height

        // Position above the element, centered horizontally
        let x = rect.left + (rect.width / 2) - (modalWidth / 2);
        let y = rect.top - modalHeight - 10; // 10px gap above the element

        // Ensure modal stays within viewport
        x = Math.max(10, Math.min(x, window.innerWidth - modalWidth - 10));
        y = Math.max(10, y);

        // If there's not enough space above, position below instead
        if (y < 10) {
            y = rect.bottom + 10;
        }

        setStatEditModal({
            visible: true,
            stat: stat,
            value: Math.round(stat.value),
            position: { x, y }
        });
    };

    // Handle stat edit modal submission
    const handleStatEditSubmit = (newValue) => {
        if (statEditModal.stat && statEditModal.stat.statName) {
            handleStatChange(statEditModal.stat.statName, newValue);
        }
        setStatEditModal({ visible: false, stat: null, value: 0, position: { x: 0, y: 0 } });
    };

    // Handle stat edit modal cancel
    const handleStatEditCancel = () => {
        setStatEditModal({ visible: false, stat: null, value: 0, position: { x: 0, y: 0 } });
    };

    // Calculate XP progress for display
    const xpProgress = getXPProgress(experience);
    
    // Calculate base armor for display purposes
    // Note: calculateDerivedStats actually calculates baseArmor using totalAgility (base + equipment),
    // but for display we want to show what base contributes separately
    let racialBaseArmor = 0;
    if (race && subrace) {
        try {
            const { getRacialBaseStats } = require('../../data/raceData');
            const racialBaseStats = getRacialBaseStats(race, subrace);
            racialBaseArmor = racialBaseStats.armor || 0;
        } catch (e) {
            // If we can't load racial stats, default to 0
            racialBaseArmor = 0;
        }
    }
    // Base agility modifier from base agility stat (without equipment bonuses)
    // This is for display purposes to show what base agility contributes
    const baseAgilityStat = stats.agility || 0;
    // Apply encumbrance to base agility for consistency with calculateDerivedStats
    const currentEncumbranceState = encumbranceState || 'normal';
    let modifiedBaseAgility = baseAgilityStat;
    if (currentEncumbranceState === 'encumbered') {
        modifiedBaseAgility = Math.floor(modifiedBaseAgility * 0.95);
    } else if (currentEncumbranceState === 'overencumbered') {
        modifiedBaseAgility = Math.floor(modifiedBaseAgility * 0.85);
    }
    const baseAgilityModifier = Math.floor((modifiedBaseAgility - 10) / 2);
    
    // Base armor = racial base armor + base agility modifier (for display)
    // Note: The actual calculateDerivedStats uses totalAgility, but we show base separately
    const baseArmor = Math.round(racialBaseArmor + baseAgilityModifier);
    // Use the calculated armor from totalStats which includes all modifiers
    const totalArmor = Math.round(totalStats.armor || baseArmor || 0);
    const passiveDR = Math.floor(totalArmor / 10);
    const basePassiveDR = Math.floor(baseArmor / 10);
    const soakDie = getSoakDieFromArmor(totalArmor);

    const statGroups = {
        summary: {
            title: 'Character Summary',
            icon: getCustomIconUrl('Social/Golden Crown', 'abilities'),
            description: 'Quick overview of your character\'s most important statistics',
            stats: [
                {
                    label: 'Level',
                    value: level,
                    baseValue: level,
                    tooltip: true,
                    icon: getCustomIconUrl('Social/Golden Crown', 'abilities'),
                    color: '#D4AF37',
                    description: 'Current character level',
                    isLevel: true // Custom flag for level styling
                },
                {
                    label: 'Experience',
                    value: xpProgress.isMaxLevel
                        ? 'MAX LEVEL'
                        : `${formatXP(xpProgress.xpIntoLevel)} / ${formatXP(xpProgress.xpNeededForLevel)}`,
                    baseValue: experience,
                    tooltip: true,
                    icon: getCustomIconUrl('Radiant/Glowing Star', 'abilities'),
                    color: '#8b6914',
                    description: xpProgress.isMaxLevel
                        ? 'You have reached maximum level!'
                        : `Progress to level ${level + 1}: ${Math.round(xpProgress.percentage)}%`,
                    isExperience: true // Custom flag for experience styling
                },
                {
                    label: 'Health',
                    value: `${health.current}/${health.max}`,
                    baseValue: health.max,
                    tooltip: true,
                    icon: getCustomIconUrl('Healing/Red Heart', 'abilities'),
                    color: '#ff4444',
                    description: 'Current and maximum hit points'
                },
                {
                    label: 'Mana',
                    value: `${mana.current}/${mana.max}`,
                    baseValue: mana.max,
                    tooltip: true,
                    icon: getCustomIconUrl('Utility/Glowing Orb', 'abilities'),
                    color: '#4444ff',
                    description: 'Current and maximum mana points'
                },
                {
                    label: 'Action Points',
                    value: `${actionPoints.current}/${actionPoints.max}`,
                    baseValue: actionPoints.max,
                    tooltip: true,
                    icon: getCustomIconUrl('Arcane/Enchanted Sword 2', 'abilities'),
                    color: '#b8860b',
                    description: 'Current and maximum action points per turn'
                },
                {
                    label: 'Passive DR',
                    value: passiveDR,
                    baseValue: basePassiveDR,
                    tooltip: true,
                    icon: getCustomIconUrl('Utility/Golden Shield', 'abilities'),
                    color: '#4b6b6b',
                    description: 'Damage reduced automatically each hit (Armor ÷ 10, rounded down)'
                },
                {
                    label: 'Soak Die (Defend)',
                    value: soakDie,
                    baseValue: getSoakDieFromArmor(baseArmor),
                    tooltip: true,
                    icon: getCustomIconUrl('Utility/Golden Shield', 'abilities'),
                    color: '#3b5b7b',
                    description: 'Bonus reduction you roll when you take the Defend action'
                },
                {
                    label: 'Movement Speed',
                    value: Math.round(totalStats.movementSpeed ?? 30),
                    baseValue: 30,
                    tooltip: true,
                    icon: getCustomIconUrl('Arcane/Swift Boot', 'abilities'),
                    color: '#44ff44',
                    description: 'Base walking speed in feet per turn'
                },
                {
                    label: 'Passive Perception',
                    value: 10 + Math.floor(((typeof totalStats.spirit === 'object' ? totalStats.spirit.value : totalStats.spirit || 10) - 10) / 2),
                    baseValue: 10 + Math.floor(((typeof stats.spirit === 'object' ? stats.spirit.value : stats.spirit || 10) - 10) / 2),
                    tooltip: true,
                    icon: getCustomIconUrl('Utility/Watchful Eye', 'abilities'),
                    color: '#8b6914',
                    description: 'Passive awareness of surroundings (10 + Spirit modifier)'
                },
                {
                    label: 'Carrying Capacity',
                    value: Math.round(totalStats.carryingCapacity || 75),
                    baseValue: Math.round((stats.strength || 10) * 15),
                    tooltip: true,
                    icon: getCustomIconUrl('Social/Weight', 'abilities'),
                    color: '#8B4513',
                    description: 'Total inventory slots available (base 75 + strength modifier rows + equipment bonuses)'
                }
            ]
        },
        base: {
            title: 'Core Attributes',
            icon: getCustomIconUrl('General/Strength', 'abilities'),
            description: 'Your character\'s fundamental ability scores',
            stats: [
                {
                    label: 'Strength',
                    value: typeof totalStats.strength === 'object' ? totalStats.strength.value : totalStats.strength || 0,
                    baseValue: typeof stats.strength === 'object' ? stats.strength.value : stats.strength || 0,
                    modifier: Math.floor(((typeof totalStats.strength === 'object' ? totalStats.strength.value : totalStats.strength || 0) - 10) / 2),
                    tooltip: true,
                    statName: 'strength',
                    description: 'Physical power and muscle'
                },
                {
                    label: 'Agility',
                    value: typeof totalStats.agility === 'object' ? totalStats.agility.value : totalStats.agility || 0,
                    baseValue: typeof stats.agility === 'object' ? stats.agility.value : stats.agility || 0,
                    modifier: Math.floor(((typeof totalStats.agility === 'object' ? totalStats.agility.value : totalStats.agility || 0) - 10) / 2),
                    tooltip: true,
                    statName: 'agility',
                    description: 'Dexterity and reflexes'
                },
                {
                    label: 'Constitution',
                    value: typeof totalStats.constitution === 'object' ? totalStats.constitution.value : totalStats.constitution || 0,
                    baseValue: typeof stats.constitution === 'object' ? stats.constitution.value : stats.constitution || 0,
                    modifier: Math.floor(((typeof totalStats.constitution === 'object' ? totalStats.constitution.value : totalStats.constitution || 0) - 10) / 2),
                    tooltip: true,
                    statName: 'constitution',
                    description: 'Health and stamina'
                },
                {
                    label: 'Intelligence',
                    value: typeof totalStats.intelligence === 'object' ? totalStats.intelligence.value : totalStats.intelligence || 0,
                    baseValue: typeof stats.intelligence === 'object' ? stats.intelligence.value : stats.intelligence || 0,
                    modifier: Math.floor(((typeof totalStats.intelligence === 'object' ? totalStats.intelligence.value : totalStats.intelligence || 0) - 10) / 2),
                    tooltip: true,
                    statName: 'intelligence',
                    description: 'Reasoning and memory'
                },
                {
                    label: 'Spirit',
                    value: typeof totalStats.spirit === 'object' ? totalStats.spirit.value : totalStats.spirit || 0,
                    baseValue: typeof stats.spirit === 'object' ? stats.spirit.value : stats.spirit || 0,
                    modifier: Math.floor(((typeof totalStats.spirit === 'object' ? totalStats.spirit.value : totalStats.spirit || 0) - 10) / 2),
                    tooltip: true,
                    statName: 'spirit',
                    description: 'Awareness and insight'
                },
                {
                    label: 'Charisma',
                    value: typeof totalStats.charisma === 'object' ? totalStats.charisma.value : totalStats.charisma || 0,
                    baseValue: typeof stats.charisma === 'object' ? stats.charisma.value : stats.charisma || 0,
                    modifier: Math.floor(((typeof totalStats.charisma === 'object' ? totalStats.charisma.value : totalStats.charisma || 0) - 10) / 2),
                    tooltip: true,
                    statName: 'charisma',
                    description: 'Force of personality'
                }
            ]
        },
        combat: {
            title: 'Combat Statistics',
            icon: getCustomIconUrl('General/Sword', 'abilities'),
            description: 'Your character\'s combat capabilities and damage output',
            stats: [
                {
                    label: 'Slashing Damage',
                    value: Math.round(totalStats.slashingDamage || 0),
                    baseValue: 0, // Base damage is 0
                    tooltip: true,
                    icon: getCustomIconUrl('Slashing/Bloody Meat Cleaver', 'abilities'),
                    color: '#8B4513',
                    description: 'Damage with swords, axes, and slashing weapons'
                },
                {
                    label: 'Bludgeoning Damage',
                    value: Math.round(totalStats.bludgeoningDamage || 0),
                    baseValue: 0, // Base damage is 0
                    tooltip: true,
                    icon: getCustomIconUrl('Bludgeoning/Hammer', 'abilities'),
                    color: '#8B4513',
                    description: 'Damage with maces, clubs, and bludgeoning weapons'
                },
                {
                    label: 'Piercing Damage',
                    value: Math.round(totalStats.piercingDamage || 0),
                    baseValue: 0, // Base damage is 0
                    tooltip: true,
                    icon: getCustomIconUrl('Arcane/Enchanted Sword', 'abilities'),
                    color: '#8B4513',
                    description: 'Damage with spears, daggers, and piercing weapons'
                },
                {
                    label: 'Ranged Damage',
                    value: Math.round(totalStats.rangedDamage || 0),
                    baseValue: 0, // Base damage is 0
                    tooltip: true,
                    icon: getCustomIconUrl('Utility/Projectile Weapon', 'abilities'),
                    color: '#228B22',
                    description: 'Damage with bows, crossbows, and thrown weapons'
                }
            ]
        },
        spellpower: {
            title: 'Spell Power',
            icon: getCustomIconUrl('Arcane/Magical Staff', 'abilities'),
            description: 'Your character\'s magical damage capabilities',
            stats: Object.entries(DAMAGE_TYPES)
                .filter(([type]) => {
                    // Exclude physical damage types - they don't have spell power
                    const physicalTypes = ['bludgeoning', 'piercing', 'slashing'];
                    return !physicalTypes.includes(type);
                })
                .map(([type, data]) => ({
                    label: `${data.name} Power`,
                    value: Math.round(totalStats[`${type}SpellPower`] || 0),
                    baseValue: 0, // Base spell power is 0
                    tooltip: true,
                    icon: data.icon,
                    color: data.color,
                    description: `Spell damage bonus for ${data.name.toLowerCase()} spells`
                }))
                .filter(stat => stat !== null && stat !== undefined) // Additional safety filter
        },
        defensive: {
            title: 'Defensive Statistics',
            icon: getCustomIconUrl('Utility/Scaled Armor', 'abilities'),
            description: 'Your character\'s defensive capabilities and survivability',
            stats: [
                {
                    label: 'Armor',
                    value: totalArmor,
                    baseValue: baseArmor,
                    tooltip: true,
                    icon: getCustomIconUrl('Utility/Scaled Armor', 'abilities'),
                    color: '#6b6b6b',
                    description: 'Armor score used for passive DR and the Defend soak die'
                },
                {
                    label: 'Passive DR',
                    value: passiveDR,
                    baseValue: basePassiveDR,
                    tooltip: true,
                    icon: getCustomIconUrl('Utility/Golden Shield', 'abilities'),
                    color: '#4b6b6b',
                    description: 'Damage reduced automatically each hit (Armor ÷ 10, rounded down)'
                },
                {
                    label: 'Soak Die (Defend)',
                    value: soakDie,
                    baseValue: getSoakDieFromArmor(baseArmor),
                    tooltip: true,
                    icon: getCustomIconUrl('Utility/Golden Shield', 'abilities'),
                    color: '#3b5b7b',
                    description: 'Bonus reduction you roll when you take the Defend action'
                },
                {
                    label: 'Dodge Rating',
                    value: Math.floor((totalStats.agility || 10) / 15),
                    baseValue: Math.floor((stats.agility || 10) / 15),
                    tooltip: true,
                    icon: getCustomIconUrl('Utility/Speed Dash', 'abilities'),
                    color: '#4b6b6b',
                    description: `${Math.floor((totalStats.agility || 10) / 15)} Dodge Rating (15 Agility = 1 Rating)`
                },
                {
                    label: 'Max Health',
                    value: Math.round(totalStats.maxHealth || health.max),
                    baseValue: Math.round((stats.constitution || 10) * 5), // Use original stats for base value
                    tooltip: true,
                    icon: getCustomIconUrl('Healing/Red Heart', 'abilities'),
                    color: '#ff4444',
                    description: 'Maximum hit points'
                },
                {
                    label: 'Max Mana',
                    value: Math.round(totalStats.maxMana || mana.max),
                    baseValue: Math.round((stats.intelligence || 10) * 5), // Use original stats for base value
                    tooltip: true,
                    icon: getCustomIconUrl('Utility/Glowing Orb', 'abilities'),
                    color: '#4444ff',
                    description: 'Maximum mana points'
                }
            ]
        },
        regeneration: {
            title: 'Regeneration & Healing',
            icon: getCustomIconUrl('Healing/Golden Heart', 'abilities'),
            description: 'Your character\'s recovery and healing capabilities',
            stats: [
                {
                    label: 'Health Regeneration',
                    value: Math.round(totalStats.healthRegen || 0),
                    baseValue: Math.round(Math.floor((stats.constitution || 10) / 2) || 0), // Use original stats
                    tooltip: true,
                    icon: getCustomIconUrl('Healing/Armored Healing', 'abilities'),
                    color: '#228b22',
                    description: 'Health recovered per turn'
                },
                {
                    label: 'Mana Regeneration',
                    value: Math.round(totalStats.manaRegen || 0),
                    baseValue: Math.round(Math.floor(((stats.intelligence || 10) + (stats.spirit || 10)) / 4) || 0), // Use original stats
                    tooltip: true,
                    icon: getCustomIconUrl('Arcane/Spellcasting Aura', 'abilities'),
                    color: '#6666ff',
                    description: 'Mana recovered per turn'
                },
                {
                    label: 'Healing Power',
                    value: Math.round(totalStats.healingPower || 0),
                    baseValue: Math.round(Math.floor((stats.spirit || 10) / 2) || 0), // Use original stats
                    tooltip: true,
                    icon: getCustomIconUrl('Healing/Healing Compass', 'abilities'),
                    color: '#b8860b',
                    description: 'Bonus to healing spells and abilities'
                },
                {
                    label: 'Healing Received',
                    value: Math.round(totalStats.healingReceived || 0),
                    baseValue: 0,
                    tooltip: true,
                    icon: getCustomIconUrl('Healing/Golden Heart', 'abilities'),
                    color: '#b8860b',
                    description: 'Bonus to healing received from others'
                }
            ]
        },
        resistances: {
            title: 'Damage Resistances & Vulnerabilities',
            icon: getCustomIconUrl('Utility/Barred Shield', 'abilities'),
            description: 'Your character\'s resistance to different damage types',
            stats: [] // We'll handle this with custom rendering
        },
        immunities: {
            title: 'Damage Immunities',
            icon: getCustomIconUrl('Utility/Deflecting Shield', 'abilities'),
            description: 'Damage types your character is completely immune to',
            stats: [] // We'll handle this with custom rendering
        },
        movement: {
            title: 'Movement & Mobility',
            icon: getCustomIconUrl('Arcane/Swift Boot', 'abilities'),
            description: 'Your character\'s movement capabilities and speeds',
            stats: [
                {
                    label: 'Movement Speed',
                    value: Math.round(totalStats.movementSpeed ?? 30),
                    baseValue: 30,
                    tooltip: true,
                    icon: getCustomIconUrl('Arcane/Swift Boot', 'abilities'),
                    color: '#44ff44',
                    description: 'Base walking speed in feet per turn'
                },
                {
                    label: 'Initiative',
                    value: Math.round(totalStats.initiative || Math.floor((stats.agility || 10) / 5) || 0),
                    baseValue: Math.round(Math.floor((stats.agility || 10) / 5) || 0),
                    tooltip: true,
                    icon: getCustomIconUrl('Piercing/Dash Arrow', 'abilities'),
                    color: '#b8860b',
                    description: 'Initiative bonus for combat order'
                },
                {
                    label: 'Swim Speed',
                    value: Math.round(totalStats.swimSpeed || 0),
                    baseValue: Math.floor((totalStats.movementSpeed ?? 30) / 3),
                    tooltip: true,
                    icon: getCustomIconUrl('Utility/Swirling Current', 'abilities'),
                    color: '#8B4513',
                    description: 'Swimming speed in feet per turn'
                },
                {
                    label: 'Climb Speed',
                    value: Math.round(totalStats.climbSpeed || 0),
                    baseValue: Math.floor((totalStats.movementSpeed ?? 30) / 2),
                    tooltip: true,
                    icon: getCustomIconUrl('Utility/Upward Jump', 'abilities'),
                    color: '#8B4513',
                    description: 'Climbing speed in feet per turn'
                },
                {
                    label: 'Fly Speed',
                    value: Math.round(totalStats.flySpeed || 0),
                    baseValue: totalStats.movementSpeed ?? 30,
                    tooltip: true,
                    icon: getCustomIconUrl('Utility/Winged Creature', 'abilities'),
                    color: '#8B4513',
                    description: 'Flying speed in feet per turn'
                }
            ].filter(stat => {
                // Always show Movement Speed even if it's 0 (stunned/paralyzed)
                if (stat.label === 'Movement Speed') {
                    return true;
                }
                // Filter out other stats with 0 value
                return stat.value > 0;
            })
        },
        utility: {
            title: 'Utility & Senses',
            icon: getCustomIconUrl('Utility/All Seeing Eye', 'abilities'),
            description: 'Your character\'s sensory and utility capabilities',
            stats: [
                {
                    label: 'Vision Range',
                    value: Math.round(totalStats.visionRange || 60),
                    baseValue: 60,
                    tooltip: true,
                    icon: getCustomIconUrl('Utility/All Seeing Eye', 'abilities'),
                    color: '#8B4513',
                    description: 'Normal vision range in feet'
                },
                {
                    label: 'Darkvision',
                    value: Math.round(totalStats.darkvision || 0),
                    baseValue: 0,
                    tooltip: true,
                    icon: getCustomIconUrl('Utility/All Seeing Eye', 'abilities'),
                    color: '#8B4513',
                    description: 'Dark vision range in feet'
                },
                {
                    label: 'Carrying Capacity',
                    value: '5x5', // Show as grid size instead of weight
                    baseValue: '5x5',
                    tooltip: true,
                    icon: getCustomIconUrl('Social/Weight', 'abilities'),
                    color: '#8B4513',
                    description: 'Inventory grid size'
                },
                {
                    label: 'Initiative',
                    value: Math.round(totalStats.initiative || Math.floor((stats.agility || 10) / 5) || 0),
                    baseValue: Math.round(Math.floor((stats.agility || 10) / 5) || 0),
                    tooltip: true,
                    icon: getCustomIconUrl('Piercing/Dash Arrow', 'abilities'),
                    color: '#8B4513',
                    description: 'Initiative bonus for combat order'
                }
            ]
        },
        conditions: {
            title: 'Condition Resistances',
            icon: getCustomIconUrl('Arcane/Magical Cross Emblem 2', 'abilities'),
            description: 'Your character\'s resistance to various conditions and status effects',
            stats: [] // We'll handle this with custom rendering
        },
        savingThrows: {
            title: 'Saving Throws',
            icon: getCustomIconUrl('Utility/Bound Shield', 'abilities'),
            description: 'Your character\'s proficiency in saving throws',
            stats: [] // We'll handle this with custom rendering
        }
    };

    const formatStatValue = (stat, value) => {
        if (typeof value !== 'number') return value;

        // Round all numeric values
        const roundedValue = Math.round(value);

        if (stat === 'Movement Speed') return `${roundedValue} ft`;
        if (stat === 'Swim Speed') return `${roundedValue} ft`;
        if (stat === 'Vision Range') return `${roundedValue} ft`;
        if (stat.includes('Resistance')) return `${roundedValue}%`;

        return roundedValue;
    };

    const isBaseStat = (stat) => {
        return ['strength', 'agility', 'intelligence', 'spirit', 'charisma', 'constitution'].includes(stat.toLowerCase());
    };

    const handleStatHover = (e, statName, isSubStat = false) => {
        setHoveredStat(statName);
        updateTooltipPosition(e);
    };

    const handleStatLeave = () => {
        setHoveredStat(null);
    };

    const updateTooltipPosition = (e) => {
        setTooltipPosition({ x: e.clientX, y: e.clientY });
    };

    // Get sources of resistance modifications (passives, equipment, etc.)
    const getResistanceSources = (damageType) => {
        const sources = [];
        
        // Get passive modifiers from race/subrace
        if (race && subrace) {
            const passiveModifiers = getRacialStatModifiers(race, subrace);
            const healthPercentage = health ? (health.current / health.max) * 100 : 100;
            
            passiveModifiers.forEach(modifier => {
                // Check if this passive affects this damage type
                let shouldApply = true;
                
                // Check conditional triggers
                if (modifier.triggerConfig?.global?.compoundTriggers && health) {
                    const healthTrigger = modifier.triggerConfig.global.compoundTriggers.find(t => t.id === 'health_threshold');
                    if (healthTrigger?.parameters) {
                        const threshold = healthTrigger.parameters.percentage;
                        const comparison = healthTrigger.parameters.comparison;
                        
                        if (comparison === 'less_than' || comparison === 'below') {
                            shouldApply = healthPercentage <= threshold;
                        } else if (comparison === 'greater_than' || comparison === 'above') {
                            shouldApply = healthPercentage >= threshold;
                        } else if (comparison === 'equal' || comparison === 'exactly') {
                            shouldApply = Math.abs(healthPercentage - threshold) < 1;
                        }
                    }
                }
                
                if (shouldApply) {
                    // Check buff config for resistances and immunities
                    if (modifier.buffConfig?.effects) {
                        modifier.buffConfig.effects.forEach(effect => {
                            // Handle stat modifiers (resistances)
                            if (effect.statModifier) {
                                const statName = effect.statModifier.stat;
                                const magnitude = effect.statModifier.magnitude;
                                const magnitudeType = effect.statModifier.magnitudeType;
                                
                                const resistanceMap = {
                                    'frost_resistance': 'frost',
                                    'cold_resistance': 'frost',
                                    'fire_resistance': 'fire',
                                    'lightning_resistance': 'lightning',
                                    'acid_resistance': 'acid',
                                    'force_resistance': 'force',
                                    'necrotic_resistance': 'necrotic',
                                    'radiant_resistance': 'radiant',
                                    'poison_resistance': 'poison',
                                    'psychic_resistance': 'psychic',
                                    'thunder_resistance': 'thunder'
                                };
                                
                                const resistanceType = resistanceMap[statName];
                                if (resistanceType === damageType && magnitudeType === 'percentage') {
                                    const conditionText = modifier.triggerConfig?.global?.compoundTriggers?.find(t => t.id === 'health_threshold') 
                                        ? ` (at ${healthPercentage.toFixed(0)}% HP)` 
                                        : '';
                                    const passiveName = modifier.name || 'Racial Passive';
                                    sources.push({
                                        name: `${passiveName} (Racial Passive)`,
                                        value: magnitude,
                                        type: magnitude >= 100 ? 'immunity' : 'resistance',
                                        condition: conditionText
                                    });
                                }
                            }
                            
                            // Handle statusEffect immunities (like Deep Frost)
                            if (effect.statusEffect && effect.statusEffect.level === 'extreme') {
                                const effectName = (effect.name || '').toLowerCase();
                                const effectDesc = (effect.description || '').toLowerCase();
                                
                                // Check if this is an immunity effect
                                if (effectName.includes('immunity') || effectName.includes('immune') || 
                                    effectDesc.includes('immune') || effectDesc.includes('immunity')) {
                                    
                                    // Map immunity names to damage types
                                    const immunityMap = {
                                        'frost': 'frost',
                                        'cold': 'frost',
                                        'fire': 'fire',
                                        'lightning': 'lightning',
                                        'acid': 'acid',
                                        'force': 'force',
                                        'necrotic': 'necrotic',
                                        'radiant': 'radiant',
                                        'psychic': 'psychic',
                                        'thunder': 'thunder',
                                        'chaos': 'chaos',
                                        'void': 'void',
                                        'nature': 'nature',
                                        'arcane': 'arcane',
                                        'bludgeoning': 'bludgeoning',
                                        'piercing': 'piercing',
                                        'slashing': 'slashing'
                                    };
                                    
                                    // Check if this immunity matches the damage type
                                    let matchesDamageType = false;
                                    for (const [key, value] of Object.entries(immunityMap)) {
                                        if ((effectName.includes(key) || effectDesc.includes(key)) && value === damageType) {
                                            matchesDamageType = true;
                                            break;
                                        }
                                    }
                                    
                                    if (matchesDamageType) {
                                        const conditionText = modifier.triggerConfig?.global?.compoundTriggers?.find(t => t.id === 'health_threshold') 
                                            ? ` (at ${healthPercentage.toFixed(0)}% HP)` 
                                            : '';
                                        const passiveName = modifier.name || 'Racial Passive';
                                        sources.push({
                                            name: `${passiveName} (Racial Passive)`,
                                            value: 100,
                                            type: 'immunity',
                                            condition: conditionText
                                        });
                                    }
                                }
                            }
                        });
                    }
                    
                    // Check debuff config for vulnerabilities
                    if (modifier.debuffConfig?.effects) {
                        modifier.debuffConfig.effects.forEach(effect => {
                            let vulnerabilityType = effect.statusEffect?.vulnerabilityType;
                            // Map legacy 'cold' to 'frost' for vulnerabilities
                            if (vulnerabilityType === 'cold') {
                                vulnerabilityType = 'frost';
                            }
                            if (vulnerabilityType === damageType) {
                                const vulnerabilityPercent = effect.statusEffect.vulnerabilityPercent || 0;
                                const conditionText = modifier.triggerConfig?.global?.compoundTriggers?.find(t => t.id === 'health_threshold') 
                                    ? ` (at ${healthPercentage.toFixed(0)}% HP)` 
                                    : '';
                                const passiveName = modifier.name || 'Racial Passive';
                                sources.push({
                                    name: `${passiveName} (Racial Passive)`,
                                    value: vulnerabilityPercent,
                                    type: 'vulnerability',
                                    condition: conditionText
                                });
                            }
                        });
                    }
                }
            });
        }
        
        // Check equipment resistances
        const equipmentBonuses = calculateEquipmentBonuses(equipment);
        const equipmentResistances = equipmentBonuses?.resistances || {};
        if (equipmentResistances[damageType]) {
            const eqRes = equipmentResistances[damageType];
            if (eqRes.level !== undefined && eqRes.level !== 100) {
                const multiplier = eqRes.multiplier || 1.0;
                const percent = multiplier < 1.0 
                    ? `${Math.round((1 - multiplier) * 100)}% resistance`
                    : `${Math.round((multiplier - 1) * 100)}% vulnerability`;
                sources.push({
                    name: 'Equipment',
                    value: percent,
                    type: multiplier < 1.0 ? 'resistance' : 'vulnerability'
                });
            }
        }
        
        return sources;
    };

    // Get sources of stat modifications (passives, equipment, etc.)
    const getStatSources = (statLabel) => {
        const sources = [];
        
        // Get passive modifiers from race/subrace
        if (race && subrace) {
            const passiveModifiers = getRacialStatModifiers(race, subrace);
            const healthPercentage = health ? (health.current / health.max) * 100 : 100;
            
            passiveModifiers.forEach(modifier => {
                // Check if this passive affects this stat
                let shouldApply = true;
                
                // Check conditional triggers
                if (modifier.triggerConfig?.global?.compoundTriggers && health) {
                    const healthTrigger = modifier.triggerConfig.global.compoundTriggers.find(t => t.id === 'health_threshold');
                    if (healthTrigger?.parameters) {
                        const threshold = healthTrigger.parameters.percentage;
                        const comparison = healthTrigger.parameters.comparison;
                        
                        if (comparison === 'less_than' || comparison === 'below') {
                            shouldApply = healthPercentage <= threshold;
                        } else if (comparison === 'greater_than' || comparison === 'above') {
                            shouldApply = healthPercentage >= threshold;
                        } else if (comparison === 'equal' || comparison === 'exactly') {
                            shouldApply = Math.abs(healthPercentage - threshold) < 1;
                        }
                    }
                }
                
                if (shouldApply) {
                    // Check buff config for stat modifiers
                    if (modifier.buffConfig?.effects) {
                        modifier.buffConfig.effects.forEach(effect => {
                            if (effect.statModifier) {
                                const statName = effect.statModifier.stat;
                                const magnitude = effect.statModifier.magnitude;
                                const magnitudeType = effect.statModifier.magnitudeType;
                                
                                // Map stat names to stat labels
                                const statMap = {
                                    'strength': 'Strength',
                                    'agility': 'Agility',
                                    'constitution': 'Constitution',
                                    'intelligence': 'Intelligence',
                                    'spirit': 'Spirit',
                                    'charisma': 'Charisma',
                                    'movement_speed': 'Movement Speed',
                                    'moveSpeed': 'Movement Speed',
                                    'speed': 'Movement Speed',
                                    'damage_taken': 'Damage Taken',
                                    'weapon_damage': 'Weapon Damage',
                                    'armor': 'Armor'
                                };
                                
                                if (statMap[statName] === statLabel || statName === statLabel.toLowerCase()) {
                                    const conditionText = modifier.triggerConfig?.global?.compoundTriggers?.find(t => t.id === 'health_threshold') 
                                        ? ` (at ${healthPercentage.toFixed(0)}% HP)` 
                                        : '';
                                    const valueText = magnitudeType === 'percentage' 
                                        ? `${magnitude > 0 ? '+' : ''}${magnitude}%`
                                        : `${magnitude > 0 ? '+' : ''}${magnitude}`;
                                    const passiveName = modifier.name || 'Racial Passive';
                                    sources.push({
                                        name: `${passiveName} (Racial Passive)`,
                                        value: valueText,
                                        type: 'passive',
                                        condition: conditionText
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
        
        return sources;
    };

    const renderStatBlock = () => {
        const currentGroup = statGroups[selectedStatGroup];

        // Special case for resistances section - new system
        if (selectedStatGroup === 'resistances') {
            const equipmentBonuses = calculateEquipmentBonuses(equipment);
            const equipmentResistances = equipmentBonuses?.resistances || {};
            const flatDamageReductions = equipmentBonuses?.flatDamageReductions || {};
            
            const getResistanceValue = (resistanceData, damageType) => {
                // Check for flat damage reduction first
                const flatReduction = flatDamageReductions[damageType] || 0;
                
                if (flatReduction > 0) {
                    // If there's a flat reduction, show it as "Normal (100% Damage) - {flatValue}"
                    return `Normal (100% Damage) - ${flatReduction}`;
                }
                
                if (!resistanceData) return 'Normal (100% damage)';
                
                // Handle new resistance level system
                if (resistanceData.level !== undefined) {
                    const level = resistanceData.level;
                    const multiplier = resistanceData.multiplier || 1.0;
                    
                    if (multiplier < 0) {
                        return `Heals ${Math.abs(multiplier)}× damage`;
                    } else if (multiplier === 0 || level === 0) {
                        return 'Immune (0% damage)';
                    } else if (multiplier < 1.0) {
                        // Resistance levels
                        if (level === 50 || (multiplier <= 0.5)) {
                            return `Resistant (${Math.round(multiplier * 100)}% damage)`;
                        } else if (level === 75 || (multiplier > 0.5 && multiplier < 1.0)) {
                            return `Guarded (${Math.round(multiplier * 100)}% damage)`;
                        } else {
                            return `Resistant (${Math.round(multiplier * 100)}% damage)`;
                        }
                    } else if (multiplier > 1.0) {
                        // Vulnerability levels - match ItemWizard progression
                        if (level === 200 || multiplier >= 2.0) {
                            return `Vulnerable (${Math.round(multiplier * 100)}% damage)`;
                        } else if (level === 150 || (multiplier >= 1.5 && multiplier < 2.0)) {
                            return `Exposed (${Math.round(multiplier * 100)}% damage)`;
                        } else if (level === 125 || (multiplier >= 1.25 && multiplier < 1.5)) {
                            return `Susceptible (${Math.round(multiplier * 100)}% damage)`;
                        } else {
                            return `Exposed (${Math.round(multiplier * 100)}% damage)`;
                        }
                    } else {
                        return 'Normal (100% damage)';
                    }
                }
                
                // Legacy system
                if (typeof resistanceData === 'number') {
                    return `${resistanceData}% Resistance`;
                }
                
                // Legacy string level
                switch (resistanceData?.toLowerCase?.() || resistanceData) {
                    case 'immune': return 'Immune (0 damage)';
                    case 'resistant': return 'Resistant (50% less)';
                    case 'exposed': return 'Exposed (150% damage)';
                    case 'vulnerable': return 'Vulnerable (200% damage)';
                    default: return 'Normal (100% damage)';
                }
            };

            const getResistanceColor = (resistanceData) => {
                if (!resistanceData) return '#8B4513';
                
                if (resistanceData.level !== undefined) {
                    const level = resistanceData.level;
                    const multiplier = resistanceData.multiplier || 1.0;
                    if (multiplier < 0) return '#ff0080';
                    if (multiplier === 0 || level === 0) return '#4caf50';
                    if (multiplier < 1.0) {
                        if (level === 50) return '#8bc34a'; // Resistant
                        if (level === 75) return '#cddc39'; // Guarded
                        return '#8bc34a';
                    }
                    if (multiplier > 1.0) {
                        if (level === 200 || multiplier >= 2.0) return '#f44336'; // Vulnerable
                        if (level === 150 || multiplier >= 1.5) return '#ff5722'; // Exposed
                        if (level === 125 || multiplier >= 1.25) return '#ff9800'; // Susceptible
                        return '#ff5722';
                    }
                }
                
                return '#8B4513';
            };

            return (
                <div className="stats-content">
                    {Object.entries(DAMAGE_TYPES).map(([type, data]) => {
                        // Merge base resistances with equipment resistances
                        const baseResistance = resistances[type];
                        const equipmentResistance = equipmentResistances[type];
                        
                        // Use equipment resistance if available, otherwise use base
                        const resistanceData = equipmentResistance || baseResistance;
                        return (
                            <div key={type} className="stat-row enhanced-stat-row">
                                <div className="level-experience-top-row">
                                    <div className="stat-label-container">
                                        <img
                                            src={data.icon}
                                            alt={data.name}
                                            className="stat-icon"
                                            style={{ borderColor: getResistanceColor(resistanceData) }}
                                        />
                                        <div className="stat-info">
                                            <span className="stat-label">{data.name} Resistance:</span>
                                        </div>
                                    </div>
                                    <div className="stat-value-container">
                                        <span className="stat-value">
                                            {getResistanceValue(resistanceData, type)}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className="tooltip-trigger"
                                    onMouseEnter={(e) => handleStatHover(e, `${data.name} Resistance`)}
                                    onMouseMove={updateTooltipPosition}
                                    onMouseLeave={handleStatLeave}
                                />
                            </div>
                        );
                    })}

                    {/* Tooltip logic for resistances */}
                    {hoveredStat && hoveredStat.endsWith('Resistance') && (() => {
                        const damageType = hoveredStat.split(' ')[0].toLowerCase();
                        const baseResistance = resistances[damageType];
                        const equipmentResistance = equipmentResistances[damageType];
                        // Use equipment resistance if available, otherwise use base (same logic as display)
                        const mergedResistanceData = equipmentResistance || baseResistance || { level: 100, multiplier: 1.0 };
                        const flatReduction = flatDamageReductions[damageType] || 0;
                        
                        // Build sources array for tooltip - start with existing sources
                        const sources = getResistanceSources(damageType);
                        
                        // Add flat reduction sources from equipment
                        if (flatReduction > 0) {
                            // Find which items provide this flat reduction
                            // Check both normalized and original damage type (e.g., necrotic and shadow)
                            const checkDamageTypes = damageType === 'necrotic' ? ['necrotic', 'shadow'] : 
                                                   damageType === 'radiant' ? ['radiant', 'holy'] : 
                                                   [damageType];
                            
                            Object.values(equipment).filter(Boolean).forEach(item => {
                                let resData = null;
                                for (const checkType of checkDamageTypes) {
                                    if (item.combatStats?.resistances?.[checkType]) {
                                        resData = item.combatStats.resistances[checkType];
                                        break;
                                    }
                                }
                                
                                if (resData) {
                                    if (resData && typeof resData === 'object' && 
                                        resData.value !== undefined && 
                                        typeof resData.value === 'number' && 
                                        resData.isPercentage !== true) {
                                        sources.push({
                                            type: 'flat_reduction',
                                            name: item.name || 'Unknown Item',
                                            value: resData.value
                                        });
                                    }
                                }
                            });
                        }
                        
                        return (
                            <TooltipPortal>
                                <div
                                    className="tooltip"
                                    style={{
                                        position: 'fixed',
                                        left: tooltipPosition.x,
                                        top: tooltipPosition.y,
                                        transform: 'translate(0, -50%)',
                                        pointerEvents: 'none',
                                        zIndex: 99999999
                                    }}
                                >
                                    <ResistanceTooltip
                                        type={damageType}
                                        resistanceData={mergedResistanceData}
                                        sources={sources}
                                    />
                                </div>
                            </TooltipPortal>
                        );
                    })()}
                </div>
            );
        }

        // Special case for immunities section
        if (selectedStatGroup === 'immunities') {
            return (
                <div className="stats-content">
                    {immunities && immunities.length > 0 ? (
                        immunities.map((immunity, index) => {
                            const damageType = DAMAGE_TYPES[immunity.toLowerCase()];
                            return damageType ? (
                                <div key={index} className="stat-row enhanced-stat-row">
                                    <div className="level-experience-top-row">
                                        <div className="stat-label-container">
                                            <img
                                                src={damageType.icon}
                                                alt={damageType.name}
                                                className="stat-icon"
                                                style={{ borderColor: damageType.color }}
                                            />
                                            <div className="stat-info">
                                                <span className="stat-label">{damageType.name} Immunity:</span>
                                            </div>
                                        </div>
                                        <div className="stat-value-container">
                                            <span className="stat-value">
                                                Immune
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div key={index} className="stat-row enhanced-stat-row">
                                    <div className="level-experience-top-row">
                                        <div className="stat-label-container">
                                            <div className="stat-info">
                                                <span className="stat-label">{immunity} Immunity:</span>
                                            </div>
                                        </div>
                                        <div className="stat-value-container">
                                            <span className="stat-value">
                                                Immune
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="stat-row enhanced-stat-row">
                            <div className="level-experience-top-row">
                                <div className="stat-label-container">
                                    <div className="stat-info">
                                        <span className="stat-label">No immunities</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // Special case for conditions section
        if (selectedStatGroup === 'conditions') {
            // Define all possible conditions
            const allConditions = [
                'fear',
                'charm',
                'stun',
                'paralyze',
                'poison',
                'disease',
                'sleep',
                'petrify',
                'blinded',
                'deafened',
                'prone',
                'restrained',
                'grappled',
                'exhaustion',
                'frightened',
                'incapacitated',
                'unconscious'
            ];
            
            // Parse passives to extract condition resistances
            const conditionResistances = {};
            
            // Get condition modifiers from equipment
            const equipmentBonuses = calculateEquipmentBonuses(equipment);
            const rawEquipmentConditionModifiers = equipmentBonuses?.conditionModifiers || {};
            
            // Map condition names from items to display names
            const conditionNameMapping = {
                'charmed': 'charm',
                'frightened': 'fear',
                'confused': 'stun',
                'poisoned': 'poison',
                'diseased': 'disease',
                'asleep': 'sleep',
                'petrified': 'petrify',
                'blinded': 'blinded',
                'deafened': 'deafened',
                'prone': 'prone',
                'restrained': 'restrained',
                'grappled': 'grappled',
                'exhausted': 'exhaustion',
                'incapacitated': 'incapacitated',
                'unconscious': 'unconscious',
                'stunned': 'stun',
                'paralyzed': 'paralyze'
            };
            
            // Map equipment condition modifiers to display condition names
            const equipmentConditionModifiers = {};
            Object.entries(rawEquipmentConditionModifiers).forEach(([itemConditionName, modifierData]) => {
                const displayConditionName = conditionNameMapping[itemConditionName] || itemConditionName;
                if (allConditions.includes(displayConditionName)) {
                    equipmentConditionModifiers[displayConditionName] = modifierData;
                }
            });
            
            // Get saving throw modifiers from race/subrace (special modifiers)
            const savingThrowMods = race && subrace ? getRacialSavingThrowModifiers(race, subrace) : null;
            
            // Map saving throw modifier names to condition names
            const conditionNameMap = {
                'fear': 'fear',
                'frightened': 'fear', // Map frightened to fear for consistency
                'charm': 'charm',
                'charmed': 'charm',
                'stun': 'stun',
                'stunned': 'stun',
                'paralyze': 'paralyze',
                'paralyzed': 'paralyze',
                'paralysis': 'paralyze',
                'poison': 'poison',
                'poisoned': 'poison',
                'disease': 'disease',
                'sleep': 'sleep',
                'petrify': 'petrify',
                'petrified': 'petrify',
                'petrification': 'petrify',
                'blinded': 'blinded',
                'blind': 'blinded',
                'deafened': 'deafened',
                'deaf': 'deafened',
                'prone': 'prone',
                'restrained': 'restrained',
                'restrain': 'restrained',
                'grappled': 'grappled',
                'grapple': 'grappled',
                'exhaustion': 'exhaustion',
                'exhaust': 'exhaustion',
                'incapacitated': 'incapacitated',
                'incapacitate': 'incapacitated',
                'unconscious': 'unconscious',
                'confused': 'stun', // Map confused to stun as it's a mental condition
                'invisible': null, // Invisible is not a condition, it's a status
                'iron': null, // Not a condition
                'radiant': null, // Not a condition (damage type)
                'dominated': 'charm', // Map dominated to charm
                'metal': null, // Not a condition
                'water': null, // Not a condition
                'cold': null, // Not a condition (damage type)
                'psychic': null, // Not a condition (damage type)
                'constitution': null, // Not a condition (ability score)
                'agility': null, // Not a condition (ability score)
                'intimidated': 'fear' // Map intimidated to fear
            };
            
            // Apply saving throw modifiers to condition resistances
            if (savingThrowMods) {
                // Advantage on saves = resistance (advantage)
                if (savingThrowMods.advantage && Array.isArray(savingThrowMods.advantage)) {
                    savingThrowMods.advantage.forEach(modifierName => {
                        const conditionName = conditionNameMap[modifierName.toLowerCase()];
                        if (conditionName && allConditions.includes(conditionName)) {
                            if (!conditionResistances[conditionName]) {
                                conditionResistances[conditionName] = [];
                            }
                            conditionResistances[conditionName].push('Racial Advantage');
                        }
                    });
                }
                
                // Disadvantage on saves = vulnerability (disadvantage) - store separately for display
                if (savingThrowMods.disadvantage && Array.isArray(savingThrowMods.disadvantage)) {
                    savingThrowMods.disadvantage.forEach(modifierName => {
                        const conditionName = conditionNameMap[modifierName.toLowerCase()];
                        if (conditionName && allConditions.includes(conditionName)) {
                            // Mark as disadvantage - we'll handle this in the display logic
                            if (!conditionResistances[conditionName]) {
                                conditionResistances[conditionName] = [];
                            }
                            // Use a special marker to indicate disadvantage
                            conditionResistances[conditionName].push('Racial Disadvantage');
                        }
                    });
                }
            }
            
            // Get racial passives
            const racialPassives = race && subrace ? getRacialStatModifiers(race, subrace) : [];
            
            // Combine all passives (racial + path)
            const allPassives = [...racialPassives, ...pathPassives];
            
            // Helper function to extract conditions from a passive
            const extractConditions = (passive) => {
                const conditions = [];
                const desc = (passive.description || '').toLowerCase();
                const name = (passive.name || '').toLowerCase();
                const searchText = desc + ' ' + name;
                
                if (searchText.includes('fear') || searchText.includes('frightened')) {
                    conditions.push('fear');
                }
                if (searchText.includes('charm')) {
                    conditions.push('charm');
                }
                if (searchText.includes('stun')) {
                    conditions.push('stun');
                }
                if (searchText.includes('paralyze') || searchText.includes('paralysis')) {
                    conditions.push('paralyze');
                }
                if (searchText.includes('poison')) {
                    conditions.push('poison');
                }
                if (searchText.includes('disease')) {
                    conditions.push('disease');
                }
                if (searchText.includes('sleep')) {
                    conditions.push('sleep');
                }
                if (searchText.includes('petrify') || searchText.includes('petrification')) {
                    conditions.push('petrify');
                }
                if (searchText.includes('blind')) {
                    conditions.push('blinded');
                }
                if (searchText.includes('deaf')) {
                    conditions.push('deafened');
                }
                if (searchText.includes('prone')) {
                    conditions.push('prone');
                }
                if (searchText.includes('restrain')) {
                    conditions.push('restrained');
                }
                if (searchText.includes('grapple')) {
                    conditions.push('grappled');
                }
                if (searchText.includes('exhaust')) {
                    conditions.push('exhaustion');
                }
                if (searchText.includes('incapacitat')) {
                    conditions.push('incapacitated');
                }
                if (searchText.includes('unconscious')) {
                    conditions.push('unconscious');
                }
                
                return conditions;
            };
            
            allPassives.forEach(passive => {
                // Skip stat bonuses - they're applied automatically
                if (passive.type === 'stat') {
                    return;
                }
                
                // Check for condition resistances in description or name
                const conditions = extractConditions(passive);
                
                // If this passive grants condition resistances, add them
                if (conditions.length > 0) {
                    const passiveName = passive.name || 'Unknown Passive';
                    conditions.forEach(condition => {
                        if (!conditionResistances[condition]) {
                            conditionResistances[condition] = [];
                        }
                        conditionResistances[condition].push(passiveName);
                    });
                }
            });

            return (
                <div className="stats-content">
                    {allConditions.map(condition => {
                        const conditionResistanceList = conditionResistances[condition] || [];
                        const hasAdvantage = conditionResistanceList.some(r => r !== 'Racial Disadvantage');
                        const hasDisadvantage = conditionResistanceList.includes('Racial Disadvantage');
                        const hasResistance = conditionResistanceList.length > 0;
                        const equipmentModifier = equipmentConditionModifiers[condition];
                        const hasEquipmentModifier = equipmentModifier && equipmentModifier.modifier && equipmentModifier.modifier !== 'none';
                        const conditionName = condition.charAt(0).toUpperCase() + condition.slice(1);
                        
                        // Determine the display value and style
                        let displayValue = 'Normal';
                        let displayStyle = { fontStyle: 'italic' };
                        let borderColor = '#8b7355';
                        
                        if (hasEquipmentModifier) {
                            // Format the modifier display value
                            const modifierMap = {
                                'immune': 'Immune',
                                'double_advantage': 'Double Advantage',
                                'advantage': 'Advantage',
                                'double_disadvantage': 'Double Disadvantage',
                                'disadvantage': 'Disadvantage'
                            };
                            displayValue = equipmentModifier.label || modifierMap[equipmentModifier.modifier] || equipmentModifier.modifier;
                            displayStyle = {
                                fontWeight: 'bold',
                                backgroundColor: equipmentModifier.modifier === 'immune' ? '#c8e6c9' :
                                                 equipmentModifier.modifier === 'double_advantage' ? '#a5d6a7' :
                                                 equipmentModifier.modifier === 'advantage' ? '#e8f5e9' :
                                                 equipmentModifier.modifier === 'double_disadvantage' ? '#ffcdd2' :
                                                 equipmentModifier.modifier === 'disadvantage' ? '#ffcdd2' : '#e8f5e9',
                                color: equipmentModifier.modifier === 'immune' ? '#2e7d32' :
                                       equipmentModifier.modifier === 'double_advantage' ? '#1b5e20' :
                                       equipmentModifier.modifier === 'advantage' ? '#4caf50' :
                                       equipmentModifier.modifier === 'double_disadvantage' ? '#c62828' :
                                       equipmentModifier.modifier === 'disadvantage' ? '#f44336' : '#4caf50',
                                padding: '4px 12px',
                                borderRadius: '4px'
                            };
                            borderColor = equipmentModifier.modifier === 'immune' ? '#4caf50' : 
                                         equipmentModifier.modifier === 'double_advantage' ? '#2e7d32' :
                                         equipmentModifier.modifier === 'advantage' ? '#4caf50' :
                                         equipmentModifier.modifier === 'double_disadvantage' ? '#f44336' :
                                         equipmentModifier.modifier === 'disadvantage' ? '#f44336' : '#4caf50';
                        } else if (hasDisadvantage && !hasAdvantage) {
                            displayValue = 'Disadvantage';
                            displayStyle = {
                                fontWeight: 'bold',
                                backgroundColor: '#ffcdd2',
                                color: '#f44336',
                                padding: '4px 12px',
                                borderRadius: '4px'
                            };
                            borderColor = '#f44336';
                        } else if (hasAdvantage) {
                            displayValue = 'Advantage';
                            displayStyle = {
                                fontWeight: 'bold',
                                backgroundColor: '#e8f5e9',
                                color: '#4caf50',
                                padding: '4px 12px',
                                borderRadius: '4px'
                            };
                            borderColor = '#4caf50';
                        }
                        
                        return (
                            <div 
                                key={condition} 
                                className="stat-row enhanced-stat-row" 
                                style={{ cursor: 'help' }}
                                onMouseEnter={(e) => handleStatHover(e, condition)}
                                onMouseMove={updateTooltipPosition}
                                onMouseLeave={handleStatLeave}
                            >
                                <div className="level-experience-top-row">
                                    <div className="stat-label-container">
                                        {CONDITION_ICONS[condition] && (
                                            <img
                                                src={CONDITION_ICONS[condition]}
                                                alt={conditionName}
                                                className="stat-icon"
                                                style={{ 
                                                    borderColor: borderColor
                                                }}
                                            />
                                        )}
                                        <div className="stat-info">
                                            <span className="stat-label" style={{ textTransform: 'capitalize' }}>
                                                {conditionName}:
                                            </span>
                                        </div>
                                    </div>
                                    <div className="stat-value-container">
                                        <span className="stat-value" style={displayStyle}>
                                            {displayValue}
                                        </span>
                                    </div>
                                </div>
                                <div className="tooltip-trigger" />
                                {hoveredStat === condition && (() => {
                                    // Build sources array for tooltip
                                    const sources = [];
                                    
                                    // Reverse mapping: display condition name -> item condition names
                                    const reverseConditionMapping = {
                                        'charm': ['charm', 'charmed'],
                                        'fear': ['fear', 'frightened'],
                                        'stun': ['stun', 'stunned', 'confused'],
                                        'poison': ['poison', 'poisoned'],
                                        'disease': ['disease', 'diseased'],
                                        'sleep': ['sleep', 'asleep'],
                                        'petrify': ['petrify', 'petrified'],
                                        'blinded': ['blinded', 'blind'],
                                        'deafened': ['deafened', 'deaf'],
                                        'prone': ['prone'],
                                        'restrained': ['restrained', 'restrain'],
                                        'grappled': ['grappled', 'grapple'],
                                        'exhaustion': ['exhaustion', 'exhausted'],
                                        'incapacitated': ['incapacitated', 'incapacitate'],
                                        'unconscious': ['unconscious'],
                                        'paralyze': ['paralyze', 'paralyzed', 'paralysis']
                                    };
                                    
                                    // Add equipment modifier sources
                                    if (hasEquipmentModifier) {
                                        const itemConditionNames = reverseConditionMapping[condition] || [condition];
                                        Object.values(equipment).filter(Boolean).forEach(item => {
                                            if (item.combatStats?.conditionModifiers) {
                                                // Check all possible condition name variations
                                                itemConditionNames.forEach(itemConditionName => {
                                                    const modData = item.combatStats.conditionModifiers[itemConditionName];
                                                    if (modData && modData.modifier && modData.modifier !== 'none') {
                                                        sources.push({
                                                            modifier: modData.modifier,
                                                            name: item.name || 'Unknown Item'
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    
                                    // Add racial sources
                                    if (hasAdvantage && !hasEquipmentModifier) {
                                        sources.push({
                                            modifier: 'advantage',
                                            name: 'Racial Trait'
                                        });
                                    }
                                    
                                    return (
                                        <TooltipPortal>
                                            <div
                                                className="equipment-slot-tooltip"
                                                style={{
                                                    position: 'fixed',
                                                    left: tooltipPosition.x,
                                                    top: tooltipPosition.y,
                                                    transform: 'translate(10px, -50%)',
                                                    pointerEvents: 'none',
                                                    zIndex: 99999999
                                                }}
                                            >
                                                <ConditionTooltip 
                                                    condition={condition} 
                                                    hasResistance={hasAdvantage && !hasEquipmentModifier}
                                                    equipmentModifier={equipmentModifier}
                                                    sources={sources}
                                                />
                                            </div>
                                        </TooltipPortal>
                                    );
                                })()}
                            </div>
                        );
                    })}
                </div>
            );
        }

        // Special case for saving throws section
        if (selectedStatGroup === 'savingThrows') {
            const abilities = ['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma'];
            const proficiencyBonus = Math.floor((level - 1) / 4) + 2; // Standard proficiency calculation

            return (
                <div className="stats-content">
                    {abilities.map((ability) => {
                        const abilityScore = typeof totalStats[ability] === 'object' ? totalStats[ability].value : totalStats[ability] || 0;
                        const modifier = Math.floor((abilityScore - 10) / 2);
                        const isProficient = stats.savingThrows && stats.savingThrows[ability];
                        const totalBonus = isProficient ? modifier + proficiencyBonus : modifier;

                        const getAbilityIcon = (ability) => {
                            const iconMap = {
                                strength: 'General/Strength',
                                agility: 'Piercing/Scatter Shot',
                                constitution: 'Healing/Heart Shield',
                                intelligence: 'Psychic/Brain Psionics',
                                spirit: 'Radiant/Radiant Aura',
                                charisma: 'Radiant/Radiant Aura'
                            };
                            return getCustomIconUrl(iconMap[ability] || 'Utility/Utility', 'abilities');
                        };

                        return (
                            <div key={ability} className="stat-row enhanced-stat-row">
                                <div className="level-experience-top-row">
                                    <div className="stat-label-container">
                                        <img
                                            src={getAbilityIcon(ability)}
                                            alt={ability}
                                            className="stat-icon"
                                            style={{
                                                borderColor: isProficient ? '#D4AF37' : '#666',
                                                opacity: isProficient ? 1 : 0.6
                                            }}
                                        />
                                        <div className="stat-info">
                                            <span className="stat-label">
                                                {ability.charAt(0).toUpperCase() + ability.slice(1)} Save:
                                                {isProficient && <span style={{ color: '#D4AF37', marginLeft: '8px' }}>●</span>}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="stat-value-container">
                                        <span className="stat-value" style={{
                                            color: isProficient ? '#D4AF37' : '#666',
                                            fontWeight: isProficient ? 'bold' : 'normal'
                                        }}>
                                            {totalBonus >= 0 ? '+' : ''}{totalBonus}
                                        </span>
                                        {isProficient && (
                                            <span className="stat-modifier" style={{ fontSize: '0.8em', color: '#666' }}>
                                                ({modifier >= 0 ? '+' : ''}{modifier} + {proficiencyBonus})
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div
                                    className="tooltip-trigger"
                                    onMouseEnter={(e) => handleStatHover(e, `${ability.charAt(0).toUpperCase() + ability.slice(1)} Save`)}
                                    onMouseMove={updateTooltipPosition}
                                    onMouseLeave={handleStatLeave}
                                />
                                {hoveredStat === `${ability.charAt(0).toUpperCase() + ability.slice(1)} Save` && (
                                    <TooltipPortal>
                                        <div
                                            className="equipment-slot-tooltip"
                                            style={{
                                                position: 'fixed',
                                                left: tooltipPosition.x,
                                                top: tooltipPosition.y,
                                                transform: 'translate(10px, -50%)',
                                                pointerEvents: 'none',
                                                zIndex: 99999999
                                            }}
                                        >
                                            <div className="equipment-slot-name">
                                                {ability.charAt(0).toUpperCase() + ability.slice(1)} Saving Throw
                                            </div>
                                            <div className="equipment-slot-description">
                                                {isProficient
                                                    ? `Proficient saving throw. Modifier: ${modifier >= 0 ? '+' : ''}${modifier} (ability) + ${proficiencyBonus} (proficiency) = ${totalBonus >= 0 ? '+' : ''}${totalBonus}`
                                                    : `Untrained saving throw. Modifier: ${modifier >= 0 ? '+' : ''}${modifier}`
                                                }
                                            </div>
                                        </div>
                                    </TooltipPortal>
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        }

        // Regular stat groups
        return (
            <div className="stats-content">
                {currentGroup.stats.map((stat, index) => (
                    <div
                        key={index}
                        className={`stat-row ${stat.isExperience ? 'experience-stat-row' : ''} ${stat.isLevel ? 'level-stat-row' : ''} enhanced-stat-row`}
                        onContextMenu={(e) => handleStatRightClick(e, stat)}
                        style={{ cursor: isGMMode && stat.statName ? 'context-menu' : 'default' }}
                    >
                        {/* Apply same layout to all stats: icon/label on left, value on right, description footer */}
                        <>
                            <div className="level-experience-top-row">
                                <div className="stat-label-container">
                                    {(stat.icon || STAT_ICONS[stat.label.toLowerCase()]) && (
                                        <img
                                            src={stat.icon || STAT_ICONS[stat.label.toLowerCase()]}
                                            alt={stat.label}
                                            className="stat-icon"
                                            style={stat.color ? { borderColor: stat.color } : {}}
                                        />
                                    )}
                                    <div className="stat-info">
                                        <span className="stat-label">{stat.label}:</span>
                                    </div>
                                </div>
                                <div className="stat-value-container">
                                    <span className="stat-value">
                                        {formatStatValue(stat.label, stat.value)}
                                    </span>
                                    {stat.modifier !== undefined && (
                                        <span className="stat-modifier">
                                            ({stat.modifier >= 0 ? '+' : ''}{stat.modifier})
                                        </span>
                                    )}
                                </div>
                            </div>
                            {stat.description && (
                                <div className="stat-description-footer">
                                    <span className="stat-description">{stat.description}</span>
                                </div>
                            )}
                        </>
                        {stat.tooltip && (
                            <div
                                className="tooltip-trigger"
                                onMouseEnter={(e) => handleStatHover(e, stat.label)}
                                onMouseMove={updateTooltipPosition}
                                onMouseLeave={handleStatLeave}
                            />
                        )}
                        {hoveredStat === stat.label && (
                            <TooltipPortal>
                                <div
                                    className="equipment-slot-tooltip"
                                    style={{
                                        position: 'fixed',
                                        left: tooltipPosition.x,
                                        top: tooltipPosition.y,
                                        transform: 'translate(10px, -50%)',
                                        pointerEvents: 'none',
                                        zIndex: 99999999
                                    }}
                                >
                                    {isBaseStat(stat.label.toLowerCase()) ? (
                                        <StatTooltip
                                            stat={stat.label.toLowerCase()}
                                            value={stat.value}
                                            components={getStatComponents(stat.statName)}
                                        />
                                    ) : (
                                        (() => {
                                            const encumbranceInfo = getEncumbranceEffectForStat(stat.label, stat.value, stat.baseValue);
                                            const buffDebuffInfo = getBuffDebuffEffectsForStat(stat.label);
                                            const equipmentBonus = getEquipmentBonusForStat(stat.label);
                                            return (
                                                <GeneralStatTooltip
                                                    stat={stat.label}
                                                    value={stat.value}
                                                    baseValue={stat.baseValue}
                                                    equipmentBonus={equipmentBonus}
                                                    encumbranceEffect={encumbranceInfo.effect}
                                                    encumbranceDescription={encumbranceInfo.description}
                                                    buffEffect={buffDebuffInfo.buffEffect}
                                                    debuffEffect={buffDebuffInfo.debuffEffect}
                                                    conditionEffect={buffDebuffInfo.conditionEffect}
                                                    sources={getStatSources(stat.label)}
                                                />
                                            );
                                        })()
                                    )}
                                </div>
                            </TooltipPortal>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="stats-container">
            <div className={`stats-navigation ${showLabels ? 'with-labels' : 'icons-only'}`}>
                <button
                    className="stats-label-toggle-button"
                    onClick={() => setShowLabels(!showLabels)}
                    title={showLabels ? 'Hide Labels' : 'Show Labels'}
                >
                    <span className="stats-toggle-icon">{showLabels ? '◀' : '▶'}</span>
                </button>
                {Object.entries(statGroups).map(([key, group]) => (
                    <button
                        key={key}
                        className={`stats-nav-button ${selectedStatGroup === key ? 'active' : ''}`}
                        onClick={() => setSelectedStatGroup(key)}
                        title={group.title}
                    >
                        <img src={group.icon} alt="" className="stats-nav-icon" />
                        {showLabels && <span className="stats-nav-text">{group.title}</span>}
                    </button>
                ))}
            </div>

            <div className="stats-content-area">
                <div className="stats-section-header">
                    <img
                        src={statGroups[selectedStatGroup].icon}
                        alt=""
                        className="stats-section-icon"
                    />
                    <h2 className="stats-section-title">{statGroups[selectedStatGroup].title}</h2>
                </div>

                <div className="stats-fields">
                    {renderStatBlock()}
                </div>
            </div>

            {/* Stat Edit Modal */}
            {statEditModal.visible && (
                <StatEditModal
                    stat={statEditModal.stat}
                    initialValue={statEditModal.value}
                    position={statEditModal.position}
                    onSubmit={handleStatEditSubmit}
                    onCancel={handleStatEditCancel}
                />
            )}
        </div>
    );
}
