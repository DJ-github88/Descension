import React, { useState, useEffect, useRef } from 'react';
import useCharacterStore from '../../store/characterStore';
import useInventoryStore from '../../store/inventoryStore';
import { useInspectionCharacter } from '../../contexts/InspectionContext';
import useBuffStore from '../../store/buffStore';
import useDebuffStore from '../../store/debuffStore';
import useGameStore from '../../store/gameStore';
import { calculateEquipmentBonuses, calculateDerivedStats } from '../../utils/characterUtils';
import { getXPProgress, formatXP } from '../../utils/experienceUtils';
import { getRacialStatModifiers } from '../../utils/raceDisciplineSpellUtils';
import StatTooltip from '../tooltips/StatTooltip';
import GeneralStatTooltip from '../tooltips/GeneralStatTooltip';
import ResistanceTooltip from '../tooltips/ResistanceTooltip';
import ConditionTooltip from '../tooltips/ConditionTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import '../../styles/character-sheet.css';

// Condition icons mapping
const CONDITION_ICONS = {
    fear: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_psychicscream.jpg',
    charm: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_charm.jpg',
    stun: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_stun.jpg',
    paralyze: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_curseoftounges.jpg',
    poison: 'https://wow.zamimg.com/images/wow/icons/large/ability_creature_poison_02.jpg',
    disease: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_plaguecloud.jpg',
    sleep: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_sleep.jpg',
    petrify: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_impphaseshift.jpg',
    blinded: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_mindsteal.jpg',
    deafened: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_soulleech_2.jpg',
    prone: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
    restrained: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_chains ofice.jpg',
    grappled: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
    exhaustion: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_curseofsargeras.jpg',
    frightened: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_psychicscream.jpg',
    incapacitated: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_soulleech_3.jpg',
    unconscious: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_soulleech_3.jpg'
};

// Damage types for resistances and spell power
const DAMAGE_TYPES = {
    fire: {
        name: 'Fire',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_fire.jpg',
        color: '#FF4500'
    },
    cold: {
        name: 'Cold',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_frostbolt02.jpg',
        color: '#87CEEB'
    },
    lightning: {
        name: 'Lightning',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_lightning.jpg',
        color: '#b8860b'
    },
    acid: {
        name: 'Acid',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_creature_poison_02.jpg',
        color: '#32CD32'
    },
    force: {
        name: 'Force',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_blast.jpg',
        color: '#9370DB'
    },
    necrotic: {
        name: 'Necrotic',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowbolt.jpg',
        color: '#8B008B'
    },
    radiant: {
        name: 'Radiant',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_holybolt.jpg',
        color: '#b8860b'
    },
    poison: {
        name: 'Poison',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_dualweild.jpg',
        color: '#228B22'
    },
    psychic: {
        name: 'Psychic',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_mindtwisting.jpg',
        color: '#FF1493'
    },
    thunder: {
        name: 'Thunder',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_thunderclap.jpg',
        color: '#4169E1'
    },
    // Physical damage types
    bludgeoning: {
        name: 'Bludgeoning',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_punishingblow.jpg',
        color: '#8B4513'
    },
    piercing: {
        name: 'Piercing',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_impalingbolt.jpg',
        color: '#708090'
    },
    slashing: {
        name: 'Slashing',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_riposte.jpg',
        color: '#B22222'
    }
};

// Stat icons mapping
const STAT_ICONS = {
    'strength': 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_savageblow.jpg',
    'agility': 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_pet_cat.jpg',
    'constitution': 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_regeneration.jpg',
    'intelligence': 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
    'spirit': 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_spiritualguidence.jpg',
    'charisma': 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_holynova.jpg'
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
            totalStats.armor = storeDerivedStats.armor || calculatedDerivedStats.armor;
            // Always use calculated values for health and mana to ensure they reflect current constitution/intelligence
            totalStats.maxHealth = calculatedDerivedStats.maxHealth;
            totalStats.maxMana = calculatedDerivedStats.maxMana;
            // Always use calculated values for movement speeds to ensure they reflect exhaustion effects
            totalStats.movementSpeed = calculatedDerivedStats.moveSpeed || 0;
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
        }

        // Apply buff effects (positive)
        Object.entries(buffEffects).forEach(([effectType, effects]) => {
            effects.forEach(effect => {
                if (totalStats.hasOwnProperty(effectType)) {
                    totalStats[effectType] = (totalStats[effectType] || 0) + effect.value;
                }
            });
        });

        // Apply debuff effects (negative)
        Object.entries(debuffEffects).forEach(([effectType, effects]) => {
            effects.forEach(effect => {
                if (totalStats.hasOwnProperty(effectType)) {
                    totalStats[effectType] = (totalStats[effectType] || 0) + effect.value;
                }
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
    const getEquipmentBonusForStat = (statLabel) => {
        const equipmentBonuses = calculateEquipmentBonuses(equipment);

        if (statLabel.toLowerCase().includes('health') && statLabel.toLowerCase().includes('max')) {
            return equipmentBonuses.maxHealth || 0;
        } else if (statLabel.toLowerCase().includes('mana') && statLabel.toLowerCase().includes('max')) {
            return equipmentBonuses.maxMana || 0;
        } else if (statLabel.toLowerCase().includes('movement') && statLabel.toLowerCase().includes('speed')) {
            return equipmentBonuses.moveSpeed || 0;
        }

        // For other derived stats, return 0 for now (can be expanded later)
        return 0;
    };

    // Get buff and debuff effects for derived stats
    const getBuffDebuffEffectsForStat = (statLabel) => {
        const buffEffects = getActiveEffects();
        const debuffEffects = getActiveDebuffEffects();

        // Convert stat label to potential effect keys
        const statKey = statLabel.toLowerCase().replace(/\s+/g, '');
        const alternativeKeys = [
            statLabel.toLowerCase(),
            statKey,
            statLabel.toLowerCase().replace(' ', ''),
            statLabel.toLowerCase().replace(/\s+/g, '_')
        ];

        let buffEffect = 0;
        let debuffEffect = 0;

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

        return { buffEffect, debuffEffect };
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
    const baseArmor = Math.round(Math.floor((stats.agility || 10) / 2) || 0);
    const totalArmor = Math.round(totalStats.armor || baseArmor || 0);
    const passiveDR = Math.floor(totalArmor / 10);
    const basePassiveDR = Math.floor(baseArmor / 10);
    const soakDie = getSoakDieFromArmor(totalArmor);

    const statGroups = {
        summary: {
            title: 'Character Summary',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
            description: 'Quick overview of your character\'s most important statistics',
            stats: [
                {
                    label: 'Level',
                    value: level,
                    baseValue: level,
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/achievement_level_10.jpg',
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
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_01.jpg',
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
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_54.jpg',
                    color: '#ff4444',
                    description: 'Current and maximum hit points'
                },
                {
                    label: 'Mana',
                    value: `${mana.current}/${mana.max}`,
                    baseValue: mana.max,
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_72.jpg',
                    color: '#4444ff',
                    description: 'Current and maximum mana points'
                },
                {
                    label: 'Action Points',
                    value: `${actionPoints.current}/${actionPoints.max}`,
                    baseValue: actionPoints.max,
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_battleshout.jpg',
                    color: '#b8860b',
                    description: 'Current and maximum action points per turn'
                },
                {
                    label: 'Passive DR',
                    value: passiveDR,
                    baseValue: basePassiveDR,
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_shield_04.jpg',
                    color: '#4b6b6b',
                    description: 'Damage reduced automatically each hit (Armor ÷ 10, rounded down)'
                },
                {
                    label: 'Soak Die (Defend)',
                    value: soakDie,
                    baseValue: getSoakDieFromArmor(baseArmor),
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_shieldwall.jpg',
                    color: '#3b5b7b',
                    description: 'Bonus reduction you roll when you take the Defend action'
                },
                {
                    label: 'Movement Speed',
                    value: Math.round(totalStats.movementSpeed ?? 30),
                    baseValue: 30,
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
                    color: '#44ff44',
                    description: 'Base walking speed in feet per turn'
                },
                {
                    label: 'Passive Perception',
                    value: 10 + Math.floor(((typeof totalStats.spirit === 'object' ? totalStats.spirit.value : totalStats.spirit || 10) - 10) / 2),
                    baseValue: 10 + Math.floor(((typeof stats.spirit === 'object' ? stats.spirit.value : stats.spirit || 10) - 10) / 2),
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_sealofwisdom.jpg',
                    color: '#8b6914',
                    description: 'Passive awareness of surroundings (10 + Spirit modifier)'
                },
                {
                    label: 'Carrying Capacity',
                    value: Math.round(totalStats.carryingCapacity || 75),
                    baseValue: Math.round((stats.strength || 10) * 15),
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_08.jpg',
                    color: '#8B4513',
                    description: 'Total inventory slots available (base 75 + strength modifier rows + equipment bonuses)'
                }
            ]
        },
        base: {
            title: 'Core Attributes',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_spiritualguidence.jpg',
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
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_savageblow.jpg',
            description: 'Your character\'s combat capabilities and damage output',
            stats: [
                {
                    label: 'Slashing Damage',
                    value: Math.round(totalStats.slashingDamage || 0),
                    baseValue: 0, // Base damage is 0
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_cleave.jpg',
                    color: '#8B4513',
                    description: 'Damage with swords, axes, and slashing weapons'
                },
                {
                    label: 'Bludgeoning Damage',
                    value: Math.round(totalStats.bludgeoningDamage || 0),
                    baseValue: 0, // Base damage is 0
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_mace_02.jpg',
                    color: '#8B4513',
                    description: 'Damage with maces, clubs, and bludgeoning weapons'
                },
                {
                    label: 'Piercing Damage',
                    value: Math.round(totalStats.piercingDamage || 0),
                    baseValue: 0, // Base damage is 0
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_33.jpg',
                    color: '#8B4513',
                    description: 'Damage with spears, daggers, and piercing weapons'
                },
                {
                    label: 'Ranged Damage',
                    value: Math.round(totalStats.rangedDamage || 0),
                    baseValue: 0, // Base damage is 0
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_aimedshot.jpg',
                    color: '#228B22',
                    description: 'Damage with bows, crossbows, and thrown weapons'
                }
            ]
        },
        spellpower: {
            title: 'Spell Power',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
            description: 'Your character\'s magical damage capabilities',
            stats: Object.entries(DAMAGE_TYPES)
                .filter(([type]) => !['bludgeoning', 'piercing', 'slashing'].includes(type)) // Exclude physical damage types
                .map(([type, data]) => ({
                    label: `${data.name} Power`,
                    value: Math.round(totalStats[`${type}SpellPower`] || 0),
                    baseValue: 0, // Base spell power is 0
                    tooltip: true,
                    icon: data.icon,
                    color: data.color,
                    description: `Spell damage bonus for ${data.name.toLowerCase()} spells`
                }))
        },
        defensive: {
            title: 'Defensive Statistics',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_chest_plate02.jpg',
            description: 'Your character\'s defensive capabilities and survivability',
            stats: [
                {
                    label: 'Armor',
                    value: totalArmor,
                    baseValue: baseArmor,
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_chest_plate02.jpg',
                    color: '#6b6b6b',
                    description: 'Armor score used for passive DR and the Defend soak die'
                },
                {
                    label: 'Passive DR',
                    value: passiveDR,
                    baseValue: basePassiveDR,
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_shield_04.jpg',
                    color: '#4b6b6b',
                    description: 'Damage reduced automatically each hit (Armor ÷ 10, rounded down)'
                },
                {
                    label: 'Soak Die (Defend)',
                    value: soakDie,
                    baseValue: getSoakDieFromArmor(baseArmor),
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_shieldwall.jpg',
                    color: '#3b5b7b',
                    description: 'Bonus reduction you roll when you take the Defend action'
                },
                {
                    label: 'Dodge',
                    value: Math.round(Math.floor((totalStats.agility || 10) / 3) || 0),
                    baseValue: Math.round(Math.floor((stats.agility || 10) / 3) || 0),
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_evasion.jpg',
                    color: '#4b6b6b',
                    description: 'Chance to avoid attacks entirely'
                },
                {
                    label: 'Max Health',
                    value: Math.round(totalStats.maxHealth || health.max),
                    baseValue: Math.round((stats.constitution || 10) * 5), // Use original stats for base value
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_54.jpg',
                    color: '#ff4444',
                    description: 'Maximum hit points'
                },
                {
                    label: 'Max Mana',
                    value: Math.round(totalStats.maxMana || mana.max),
                    baseValue: Math.round((stats.intelligence || 10) * 5), // Use original stats for base value
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_72.jpg',
                    color: '#4444ff',
                    description: 'Maximum mana points'
                }
            ]
        },
        regeneration: {
            title: 'Regeneration & Healing',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_rejuvenation.jpg',
            description: 'Your character\'s recovery and healing capabilities',
            stats: [
                {
                    label: 'Health Regeneration',
                    value: Math.round(totalStats.healthRegen || 0),
                    baseValue: Math.round(Math.floor((stats.constitution || 10) / 2) || 0), // Use original stats
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_rejuvenation.jpg',
                    color: '#228b22',
                    description: 'Health recovered per turn'
                },
                {
                    label: 'Mana Regeneration',
                    value: Math.round(totalStats.manaRegen || 0),
                    baseValue: Math.round(Math.floor(((stats.intelligence || 10) + (stats.spirit || 10)) / 4) || 0), // Use original stats
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_magic_managain.jpg',
                    color: '#6666ff',
                    description: 'Mana recovered per turn'
                },
                {
                    label: 'Healing Power',
                    value: Math.round(totalStats.healingPower || 0),
                    baseValue: Math.round(Math.floor((stats.spirit || 10) / 2) || 0), // Use original stats
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
                    color: '#b8860b',
                    description: 'Bonus to healing spells and abilities'
                },
                {
                    label: 'Healing Received',
                    value: Math.round(totalStats.healingReceived || 0),
                    baseValue: 0,
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_sealofsacrifice.jpg',
                    color: '#b8860b',
                    description: 'Bonus to healing received from others'
                }
            ]
        },
        resistances: {
            title: 'Damage Resistances & Vulnerabilities',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_devotion.jpg',
            description: 'Your character\'s resistance to different damage types',
            stats: [] // We'll handle this with custom rendering
        },
        immunities: {
            title: 'Damage Immunities',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofprotection.jpg',
            description: 'Damage types your character is completely immune to',
            stats: [] // We'll handle this with custom rendering
        },
        movement: {
            title: 'Movement & Mobility',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
            description: 'Your character\'s movement capabilities and speeds',
            stats: [
                {
                    label: 'Movement Speed',
                    value: Math.round(totalStats.movementSpeed ?? 30),
                    baseValue: 30,
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
                    color: '#44ff44',
                    description: 'Base walking speed in feet per turn'
                },
                {
                    label: 'Initiative',
                    value: Math.round(totalStats.initiative || Math.floor((stats.agility || 10) / 5) || 0),
                    baseValue: Math.round(Math.floor((stats.agility || 10) / 5) || 0),
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
                    color: '#b8860b',
                    description: 'Initiative bonus for combat order'
                },
                {
                    label: 'Swim Speed',
                    value: Math.round(totalStats.swimSpeed || 0),
                    baseValue: Math.floor((totalStats.movementSpeed ?? 30) / 3),
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_druid_aquaticform.jpg',
                    color: '#8B4513',
                    description: 'Swimming speed in feet per turn'
                },
                {
                    label: 'Climb Speed',
                    value: Math.round(totalStats.climbSpeed || 0),
                    baseValue: Math.floor((totalStats.movementSpeed ?? 30) / 2),
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_aspectofthemonkey.jpg',
                    color: '#8B4513',
                    description: 'Climbing speed in feet per turn'
                },
                {
                    label: 'Fly Speed',
                    value: Math.round(totalStats.flySpeed || 0),
                    baseValue: totalStats.movementSpeed ?? 30,
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_druid_flightform.jpg',
                    color: '#8B4513',
                    description: 'Flying speed in feet per turn'
                }
            ].filter(stat => stat.value > 0)
        },
        utility: {
            title: 'Utility & Senses',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_sealofwisdom.jpg',
            description: 'Your character\'s sensory and utility capabilities',
            stats: [
                {
                    label: 'Vision Range',
                    value: Math.round(totalStats.visionRange || 60),
                    baseValue: 60,
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_sealofwisdom.jpg',
                    color: '#8B4513',
                    description: 'Normal vision range in feet'
                },
                {
                    label: 'Darkvision',
                    value: Math.round(totalStats.darkvision || 0),
                    baseValue: 0,
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_detectinvisibility.jpg',
                    color: '#8B4513',
                    description: 'Dark vision range in feet'
                },
                {
                    label: 'Carrying Capacity',
                    value: '5x5', // Show as grid size instead of weight
                    baseValue: '5x5',
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_08.jpg',
                    color: '#8B4513',
                    description: 'Inventory grid size'
                },
                {
                    label: 'Initiative',
                    value: Math.round(totalStats.initiative || Math.floor((stats.agility || 10) / 5) || 0),
                    baseValue: Math.round(Math.floor((stats.agility || 10) / 5) || 0),
                    tooltip: true,
                    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
                    color: '#8B4513',
                    description: 'Initiative bonus for combat order'
                }
            ]
        },
        conditions: {
            title: 'Condition Resistances',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_devotion.jpg',
            description: 'Your character\'s resistance to various conditions and status effects',
            stats: [] // We'll handle this with custom rendering
        },
        savingThrows: {
            title: 'Saving Throws',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofprotection.jpg',
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

    const renderStatBlock = () => {
        const currentGroup = statGroups[selectedStatGroup];

        // Special case for resistances section - new system
        if (selectedStatGroup === 'resistances') {
            const getResistanceValue = (level) => {
                switch (level?.toLowerCase()) {
                    case 'immune': return 'Immune (0 damage)';
                    case 'resistant': return 'Resistant (50% less)';
                    case 'exposed': return 'Exposed (150% damage)';
                    case 'vulnerable': return 'Vulnerable (200% damage)';
                    default: return 'Normal (100% damage)';
                }
            };

            const getResistanceColor = (level) => {
                return '#8B4513';
            };

            return (
                <div className="stats-content">
                    {Object.entries(DAMAGE_TYPES).map(([type, data]) => {
                        const resistanceLevel = resistances[type]?.level || 'normal';
                        return (
                            <div key={type} className="stat-row enhanced-stat-row">
                                <div className="level-experience-top-row">
                                    <div className="stat-label-container">
                                        <img
                                            src={data.icon}
                                            alt={data.name}
                                            className="stat-icon"
                                            style={{ borderColor: getResistanceColor(resistanceLevel) }}
                                        />
                                        <div className="stat-info">
                                            <span className="stat-label">{data.name} Resistance:</span>
                                        </div>
                                    </div>
                                    <div className="stat-value-container">
                                        <span className="stat-value">
                                            {getResistanceValue(resistanceLevel)}
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
                                    zIndex: 99999999
                                }}
                            >
                                <ResistanceTooltip
                                    type={hoveredStat.split(' ')[0].toLowerCase()}
                                    level={resistances[hoveredStat.split(' ')[0].toLowerCase()]?.level || 'normal'}
                                />
                            </div>
                        </TooltipPortal>
                    )}
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
                        const hasResistance = conditionResistances[condition] && conditionResistances[condition].length > 0;
                        const conditionName = condition.charAt(0).toUpperCase() + condition.slice(1);
                        
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
                                                style={{ borderColor: hasResistance ? '#4caf50' : '#8b7355' }}
                                            />
                                        )}
                                        <div className="stat-info">
                                            <span className="stat-label" style={{ textTransform: 'capitalize' }}>
                                                {conditionName}:
                                            </span>
                                        </div>
                                    </div>
                                    <div className="stat-value-container">
                                        {hasResistance ? (
                                            <span className="stat-value" style={{ 
                                                fontWeight: 'bold',
                                                backgroundColor: '#e8f5e9',
                                                padding: '4px 12px',
                                                borderRadius: '4px'
                                            }}>
                                                Advantage
                                            </span>
                                        ) : (
                                            <span className="stat-value" style={{ 
                                                fontStyle: 'italic'
                                            }}>
                                                Normal
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="tooltip-trigger" />
                                {hoveredStat === condition && (
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
                                            <ConditionTooltip condition={condition} hasResistance={hasResistance} />
                                        </div>
                                    </TooltipPortal>
                                )}
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
                                strength: 'ability_warrior_savageblow',
                                agility: 'ability_rogue_sprint',
                                constitution: 'spell_holy_blessingofstamina',
                                intelligence: 'spell_holy_magicalsentry',
                                spirit: 'spell_holy_sealofwisdom',
                                charisma: 'spell_holy_blessingofwisdom'
                            };
                            return `https://wow.zamimg.com/images/wow/icons/large/${iconMap[ability] || 'inv_misc_questionmark'}.jpg`;
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
