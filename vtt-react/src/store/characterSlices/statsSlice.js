import { getStore } from '../storeRegistry';
import { calculateEquipmentBonuses, calculateDerivedStats, flattenEffects } from '../../utils/characterUtils';
import { isTwoHandedWeapon, getSlotsToCleanForTwoHanded } from '../../utils/equipmentUtils';
import { initializeClassResource, updateClassResourceMax } from '../../data/classResources';
import { applyRacialModifiers, getFullRaceData, getRaceData } from '../../data/raceData';
import { getRacialSpells, getRacialStatModifiers } from '../../utils/raceDisciplineSpellUtils';
import useGameStore from '../gameStore';
import characterPersistenceService from '../../services/firebase/characterPersistenceService';
import characterSessionService from '../../services/firebase/characterSessionService';
import characterMigrationService from '../../services/firebase/characterMigrationService';
import localStorageManager from '../../utils/localStorageManager';
import { getCharacterData, updateCharacterData, storeCharacterOffline } from '../../services/offlineService';
import { getEncumbranceState, getCurrentUserId, isGuestUser, getCharactersStorageKey, shouldUseFirebase } from '../characterHelpers';

// Stats Slice: Stats, equipment, derived calculations, resistances, spell power.
// State properties and action bodies are copied verbatim from characterStore.js.

export const createStatsSlice = (set, get) => ({
    // Base Stats
    stats: {
        constitution: 10,
        strength: 10, // Default strength = 10 (0 modifier)
        agility: 10,
        intelligence: 10,
        spirit: 10,
        charisma: 10
    },

    // Resistances - New system: level (0=immune, 50=resistant, 100=normal, 150=exposed, 200=vulnerable) and multiplier
    resistances: {
        fire: {
            level: 100,
            multiplier: 1.0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_fire.jpg'
        },
        frost: {
            level: 100,
            multiplier: 1.0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_frostbolt02.jpg'
        },
        lightning: {
            level: 100,
            multiplier: 1.0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_lightning.jpg'
        },
        force: {
            level: 100,
            multiplier: 1.0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_blast.jpg'
        },
        necrotic: {
            level: 100,
            multiplier: 1.0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowbolt.jpg'
        },
        radiant: {
            level: 100,
            multiplier: 1.0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_holybolt.jpg'
        },
        poison: {
            level: 100,
            multiplier: 1.0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_dualweild.jpg'
        },
        psychic: {
            level: 100,
            multiplier: 1.0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_mindtwisting.jpg'
        },
        // Add missing damage types to match creature system
        bludgeoning: {
            level: 100,
            multiplier: 1.0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_punishingblow.jpg'
        },
        piercing: {
            level: 100,
            multiplier: 1.0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_impalingbolt.jpg'
        },
        slashing: {
            level: 100,
            multiplier: 1.0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_riposte.jpg'
        }
    },

    // Spell Power
    spellPower: {
        fire: {
            value: 0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_fire.jpg'
        },
        frost: {
            value: 0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_frostbolt02.jpg'
        },
        lightning: {
            value: 0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_lightning.jpg'
        },
        force: {
            value: 0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_blast.jpg'
        },
        necrotic: {
            value: 0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowbolt.jpg'
        },
        radiant: {
            value: 0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_holybolt.jpg'
        },
        poison: {
            value: 0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_dualweild.jpg'
        },
        psychic: {
            value: 0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_mindtwisting.jpg'
        }
    },

    // Equipment slots
    equipment: {
        head: null,
        neck: null,
        shoulders: null,
        back: null,
        chest: null,
        shirt: null,
        wrists: null,
        mainHand: null,
        offHand: null,
        ranged: null,
        trinket1: null,
        trinket2: null,
        ring1: null,
        ring2: null,
        feet: null,
        legs: null,
        waist: null,
        gloves: null
    },

    // Equipment bonuses (calculated)
    equipmentBonuses: {
        stats: {},
        skills: {},
        resistances: {}
    },

    // Derived stats (calculated)
    // CRITICAL FIX: Use moveSpeed (not movementSpeed) to match characterUtils.js
    derivedStats: {
        moveSpeed: 30,
        swimSpeed: 15,
        climbSpeed: 15,
        carryingCapacity: 0,
        visionRange: 0
    },

    // Helper function to get effective stats (base + racial modifiers)
    getEffectiveStats: () => {
        const state = get();
        if (!state.race || !state.subrace) {
            return state.stats;
        }
        return applyRacialModifiers(state.stats, state.race, state.subrace);
    },

    // Actions
    updateStat: (statName, value) => {
        set(state => {
            const newStats = { ...state.stats, [statName]: value };
            // Apply racial modifiers to get effective stats for calculations
            const effectiveStats = state.race && state.subrace
                ? applyRacialModifiers(newStats, state.race, state.subrace)
                : newStats;
            const equipmentBonuses = calculateEquipmentBonuses(state.equipment);

            // Fetch buff/debuff effects for derived stats
            const useConditionStore = getStore('conditionStore');
            const conditionState = useConditionStore.getState();
            const buffModifiersRaw = conditionState.getActiveEffects('buff');
            const debuffModifiersRaw = conditionState.getActiveEffects('debuff');
            
            // Flatten effects from array format to simple numeric values
            const buffModifiers = flattenEffects(buffModifiersRaw);
            const debuffModifiers = flattenEffects(debuffModifiersRaw);

            // Merge modifiers (debuffs should already be negative)
            const combinedModifiers = { ...buffModifiers };
            Object.entries(debuffModifiers).forEach(([stat, value]) => {
                combinedModifiers[stat] = (combinedModifiers[stat] || 0) + value;
            });

            // Apply equipment bonuses to stats before calculating derived stats
            const totalStats = { ...effectiveStats };
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
            
            // Apply buff/debuff modifiers to base stats as well
            ['strength', 'constitution', 'agility', 'intelligence', 'spirit', 'charisma'].forEach(stat => {
                if (combinedModifiers[stat]) {
                    totalStats[stat] = (totalStats[stat] || 0) + combinedModifiers[stat];
                }
            });

            const encumbranceState = getEncumbranceState();
            const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState, state.exhaustionLevel || 0, state.health, state.race, state.subrace, combinedModifiers);

            // Update health and mana max values from derivedStats
            let newHealth = { ...state.health };
            let newMana = { ...state.mana };

            // ALWAYS update health and mana max values from derivedStats to ensure 
            // buffs and equipment changes are reflected immediately
            const newMaxHealth = Math.round(derivedStats.maxHealth);
            newHealth.max = newMaxHealth;
            // Ensure current health doesn't exceed new max
            newHealth.current = Math.min(newHealth.current, newMaxHealth);

            const newMaxMana = Math.round(derivedStats.maxMana);
            newMana.max = newMaxMana;
            // Ensure current mana doesn't exceed new max
            newMana.current = Math.min(newMana.current, newMaxMana);

            let newActionPoints = { ...state.actionPoints };
            const newMaxAP = Math.round(derivedStats.actionPoints);
            newActionPoints.max = newMaxAP;
            newActionPoints.current = Math.min(newActionPoints.current, newMaxAP);

            // Update class resource max if it depends on stats
            let newClassResource = state.classResource;
            if (state.classResource && state.class) {
                newClassResource = updateClassResourceMax(
                    state.classResource,
                    state.class,
                    { ...effectiveStats, level: state.level }
                );
            }

            return {
                stats: newStats,
                equipmentBonuses,
                derivedStats,
                health: newHealth,
                mana: newMana,
                actionPoints: newActionPoints,
                classResource: newClassResource
            };
        });

        // Sync with multiplayer
        get().syncWithMultiplayer();

        // Record character change for persistence
        const state = get();
        if (state.currentCharacterId && statName !== 'level') {
            get().recordCharacterChange(state.currentCharacterId, 'stat_change', {
                stat: statName,
                value: value,
                timestamp: new Date()
            });
        }
    },

    updateEquipment: (slot, item) => {
        set(state => {
            const newEquipment = { ...state.equipment, [slot]: item };
            const oldEquipmentBonuses = calculateEquipmentBonuses(state.equipment);
            const equipmentBonuses = calculateEquipmentBonuses(newEquipment);

            // Fetch buff/debuff effects for derived stats
            const useConditionStore = getStore('conditionStore');
            const conditionState = useConditionStore.getState();
            const buffModifiersRaw = conditionState.getActiveEffects('buff');
            const debuffModifiersRaw = conditionState.getActiveEffects('debuff');
            
            // Flatten effects from array format to simple numeric values
            const buffModifiers = flattenEffects(buffModifiersRaw);
            const debuffModifiers = flattenEffects(debuffModifiersRaw);

            // Merge modifiers (debuffs should already be negative)
            const combinedModifiers = { ...buffModifiers };
            Object.entries(debuffModifiers).forEach(([stat, value]) => {
                combinedModifiers[stat] = (combinedModifiers[stat] || 0) + value;
            });
            // Apply racial modifiers to get effective stats for calculations
            const effectiveStats = state.race && state.subrace
                ? applyRacialModifiers(state.stats, state.race, state.subrace)
                : state.stats;

            // Apply equipment bonuses to stats before calculating derived stats
            const totalStats = { ...effectiveStats };
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
            
            // Apply buff/debuff modifiers to base stats as well
            ['strength', 'constitution', 'agility', 'intelligence', 'spirit', 'charisma'].forEach(stat => {
                if (combinedModifiers[stat]) {
                    totalStats[stat] = (totalStats[stat] || 0) + combinedModifiers[stat];
                }
            });

            const encumbranceState = getEncumbranceState();
            const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState, state.exhaustionLevel || 0, state.health, state.race, state.subrace, combinedModifiers);

            // Send equipment update to multiplayer if connected
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
                gameStore.multiplayerSocket.emit('character_equipment_updated', {
                    characterId: state.id || 'player-character',
                    slot: slot,
                    item: item,
                    equipment: newEquipment,
                    stats: {
                        equipmentBonuses,
                        derivedStats,
                        health: newHealth,
                        mana: newMana,
                        actionPoints: newActionPoints,
                        classResource: state.classResource
                    }
                });
            }

            let newHealth = { ...state.health };
            let newMana = { ...state.mana };

            // Update health and mana max values from derivedStats to ensure 
            // equipment changes are reflected immediately regardless of which slot changed
            const newMaxHealth = Math.round(derivedStats.maxHealth);
            newHealth.max = newMaxHealth;
            newHealth.current = Math.min(newHealth.current, newMaxHealth);

            const newMaxMana = Math.round(derivedStats.maxMana);
            newMana.max = newMaxMana;
            newMana.current = Math.min(newMana.current, newMaxMana);

            let newActionPoints = { ...state.actionPoints };
            const newMaxAP = Math.round(derivedStats.actionPoints);
            newActionPoints.max = newMaxAP;
            newActionPoints.current = Math.min(newActionPoints.current, newMaxAP);

            // Update resistances from equipment
            let newResistances = { ...state.resistances };
            if (equipmentBonuses.resistances) {
                Object.entries(equipmentBonuses.resistances).forEach(([resistanceType, value]) => {
                    if (newResistances[resistanceType]) {
                        // Convert numeric resistance values to resistance levels
                        let level = 'normal';
                        if (value >= 100) {
                            level = 'immune';
                        } else if (value >= 50) {
                            level = 'resistant';
                        } else if (value > 0) {
                            level = 'resistant';
                        }

                        newResistances[resistanceType] = {
                            ...newResistances[resistanceType],
                            level: level
                        };
                    }
                });
            }

            return {
                equipment: newEquipment,
                equipmentBonuses,
                derivedStats,
                health: newHealth,
                mana: newMana,
                actionPoints: newActionPoints,
                resistances: newResistances
            };
        });

        // CRITICAL: Sync with multiplayer after state is fully updated
        get().syncWithMultiplayer();
        get().syncResourcesWithMultiplayer({ health: 0, mana: 0, actionPoints: 0 });
    },

    // Equip an item from inventory to a specific slot
    equipItem: (item, slotName) => {
        const { updateEquipment } = get();
        const state = get();

        // Use imported utility functions

        // Create equipment-ready version of the item
        const equipmentItem = {
            ...item,
            // Preserve original dimensions for when item is unequipped
            originalWidth: item.width,
            originalHeight: item.height,
            originalRotation: item.rotation,
            // Set equipment display size to 1x1
            width: 1,
            height: 1,
            rotation: 0,
            // Mark as equipped
            isEquipped: true,
            // Preserve inventory position for potential return
            inventoryPosition: item.position
        };

        // Handle existing item in target slot and two-handed weapon logic
        const itemsToReturn = [];

        // First, handle existing item in the target slot
        const existingItem = state.equipment[slotName];
        if (existingItem) {
            // Create inventory-ready version of existing item
            const inventoryItem = {
                ...existingItem,
                // Restore original dimensions
                width: existingItem.originalWidth || existingItem.width || 1,
                height: existingItem.originalHeight || existingItem.height || 1,
                rotation: existingItem.originalRotation || existingItem.rotation || 0,
                // Remove equipment-specific properties
                isEquipped: false,
                originalWidth: undefined,
                originalHeight: undefined,
                originalRotation: undefined,
                inventoryPosition: undefined
            };

            itemsToReturn.push(inventoryItem);
        }

        // Handle two-handed weapon logic (clear off-hand if equipping to main hand)
        if (isTwoHandedWeapon(item)) {
            const slotsToClean = getSlotsToCleanForTwoHanded(slotName);

            // Unequip items from conflicting slots and prepare them for return to inventory
            slotsToClean.forEach(conflictSlot => {
                const conflictItem = state.equipment[conflictSlot];
                if (conflictItem) {
                    // Create inventory-ready version
                    const inventoryItem = {
                        ...conflictItem,
                        // Restore original dimensions
                        width: conflictItem.originalWidth || conflictItem.width || 1,
                        height: conflictItem.originalHeight || conflictItem.height || 1,
                        rotation: conflictItem.originalRotation || conflictItem.rotation || 0,
                        // Remove equipment-specific properties
                        isEquipped: false,
                        originalWidth: undefined,
                        originalHeight: undefined,
                        originalRotation: undefined,
                        inventoryPosition: undefined
                    };

                    itemsToReturn.push(inventoryItem);

                    // Clear the conflicting slot
                    updateEquipment(conflictSlot, null);
                }
            });
        }

        // Update the equipment slot
        updateEquipment(slotName, equipmentItem);

        // Record character change for persistence
        if (state.currentCharacterId) {
            get().recordCharacterChange(state.currentCharacterId, 'equipment_equip', {
                slot: slotName,
                itemId: equipmentItem.id,
                itemName: equipmentItem.name,
                timestamp: new Date()
            });

            // Save the character with updated equipment
            setTimeout(() => {
                get().saveCurrentCharacter();
            }, 100); // Small delay to ensure state is updated
        }

        return { equipmentItem, itemsToReturn };
    },

    // Unequip an item from a slot and prepare it for inventory
    unequipItem: (slotName) => {
        const state = get();
        const item = state.equipment[slotName];

        if (!item) return null;

        // Create inventory-ready version of the item
        const inventoryItem = {
            ...item,
            // Restore original dimensions
            width: item.originalWidth || item.width || 1,
            height: item.originalHeight || item.height || 1,
            rotation: item.originalRotation || item.rotation || 0,
            // Remove equipment-specific properties
            isEquipped: false,
            originalWidth: undefined,
            originalHeight: undefined,
            originalRotation: undefined,
            inventoryPosition: undefined
        };

        // Clear the equipment slot
        const { updateEquipment } = get();
        updateEquipment(slotName, null);

        // Record character change for persistence
        if (state.currentCharacterId) {
            get().recordCharacterChange(state.currentCharacterId, 'equipment_unequip', {
                slot: slotName,
                itemId: item.id,
                timestamp: new Date()
            });

            // Save the character with updated equipment
            setTimeout(() => {
                get().saveCurrentCharacter();
            }, 100); // Small delay to ensure state is updated
        }

        return inventoryItem;
    },

    // Check if a slot is currently occupied
    isSlotOccupied: (slotName) => {
        const state = get();
        return !!state.equipment[slotName];
    },

    // Get the item currently equipped in a slot
    getEquippedItem: (slotName) => {
        const state = get();
        return state.equipment[slotName];
    },

    updateResistance: (type, level) => {
        set(state => ({
            resistances: {
                ...state.resistances,
                [type]: {
                    ...state.resistances[type],
                    level
                }
            }
        }));
    },

    updateSpellPower: (type, value) => {
        set(state => ({
            spellPower: {
                ...state.spellPower,
                [type]: {
                    ...state.spellPower[type],
                    value
                }
            }
        }));
    },

    // Calculate total stats including equipment, buffs, and debuffs
    getTotalStatsWithEffects: (buffEffects = {}, debuffEffects = {}) => {
        const state = get();
        const equipmentBonuses = calculateEquipmentBonuses(state.equipment);
        // Start with effective stats (base + racial modifiers)
        const totalStats = state.race && state.subrace
            ? applyRacialModifiers(state.stats, state.race, state.subrace)
            : { ...state.stats };

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

            // Add other equipment bonuses
            Object.keys(equipmentBonuses).forEach(stat => {
                if (!statMapping[stat] && equipmentBonuses[stat]) {
                    totalStats[stat] = (totalStats[stat] || 0) + equipmentBonuses[stat];
                }
            });
        }

        // Initialize spell power types if they don't exist (needed for buff effects)
        const spellDamageTypes = ['ember', 'rime', 'storm', 'arcane', 'primal', 'blight', 'wyrd', 'divine'];
        spellDamageTypes.forEach(type => {
            const spellPowerKey = `${type}SpellPower`;
            if (!totalStats.hasOwnProperty(spellPowerKey)) {
                totalStats[spellPowerKey] = 0;
            }
        });

        // Apply buff effects (positive)
        Object.entries(buffEffects).forEach(([effectType, effects]) => {
            effects.forEach(effect => {
                // Initialize stat if it doesn't exist (for spell power types and other stats)
                if (!totalStats.hasOwnProperty(effectType)) {
                    totalStats[effectType] = 0;
                }
                totalStats[effectType] = (totalStats[effectType] || 0) + effect.value;
            });
        });

        // Apply debuff effects (negative)
        Object.entries(debuffEffects).forEach(([effectType, effects]) => {
            effects.forEach(effect => {
                // Initialize stat if it doesn't exist (for spell power types and other stats)
                if (!totalStats.hasOwnProperty(effectType)) {
                    totalStats[effectType] = 0;
                }
                totalStats[effectType] = (totalStats[effectType] || 0) + effect.value;
            });
        });

        // Calculate derived stats with all effects
        const encumbranceState = getEncumbranceState();
        const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState, state.exhaustionLevel || 0, state.health, state.race, state.subrace);

        // Add derived stats to total stats
        totalStats.maxHealth = Math.round(derivedStats.maxHealth || state.health.max);
        totalStats.maxMana = Math.round(derivedStats.maxMana || state.mana.max);
        totalStats.healthRegen = Math.round(derivedStats.healthRegen || 0);
        totalStats.manaRegen = Math.round(derivedStats.manaRegen || 0);
        totalStats.armor = Math.round(derivedStats.armor || 0);
        totalStats.movementSpeed = Math.round(derivedStats.moveSpeed || 30);
        totalStats.carryingCapacity = Math.round(derivedStats.carryingCapacity || 0);
        totalStats.damage = Math.round(derivedStats.damage || 0);
        totalStats.spellDamage = Math.round(derivedStats.spellDamage || 0);
        totalStats.healingPower = Math.round(derivedStats.healingPower || 0);
        totalStats.rangedDamage = Math.round(derivedStats.rangedDamage || 0);
        totalStats.slashingDamage = Math.round(derivedStats.slashingDamage || 0);
        totalStats.bludgeoningDamage = Math.round(derivedStats.bludgeoningDamage || 0);
        totalStats.piercingDamage = Math.round(derivedStats.piercingDamage || 0);

        // Add resistances from equipment
        if (equipmentBonuses.resistances) {
            Object.entries(equipmentBonuses.resistances).forEach(([resistanceType, value]) => {
                const resistanceKey = `${resistanceType}Resistance`;
                totalStats[resistanceKey] = Math.round((totalStats[resistanceKey] || 0) + value);
            });
        }

        // Add spell damage types from equipment (base spell power is 0)
        if (equipmentBonuses.spellDamageTypes) {
            Object.entries(equipmentBonuses.spellDamageTypes).forEach(([spellType, value]) => {
                const spellPowerKey = `${spellType}SpellPower`;
                // Base spell power is 0, only equipment bonuses
                totalStats[spellPowerKey] = Math.round(0 + value);
            });
        }

        // Add immunities from equipment
        if (equipmentBonuses.immunities && equipmentBonuses.immunities.length > 0) {
            totalStats.immunities = [...(totalStats.immunities || []), ...equipmentBonuses.immunities];
            // Remove duplicates
            totalStats.immunities = [...new Set(totalStats.immunities)];
        }

        return totalStats;
    },

    // Recalculate stats when encumbrance changes
    recalculateStatsWithEncumbrance: () => {
        const state = get();
        const equipmentBonuses = calculateEquipmentBonuses(state.equipment);
        const encumbranceState = getEncumbranceState();
        // Apply racial modifiers to get effective stats for calculations
        const effectiveStats = state.race && state.subrace
            ? applyRacialModifiers(state.stats, state.race, state.subrace)
            : state.stats;

        // Apply equipment bonuses to stats before calculating derived stats
        const totalStats = { ...effectiveStats };
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

        const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState, state.exhaustionLevel || 0);

        // Update health and mana max values based on new derived stats
        const newMaxHealth = Math.round(derivedStats.maxHealth);
        const newMaxMana = Math.round(derivedStats.maxMana);

        const newHealth = {
            current: Math.min(state.health.current, newMaxHealth),
            max: newMaxHealth
        };

        const newMana = {
            current: Math.min(state.mana.current, newMaxMana),
            max: newMaxMana
        };

        set({
            equipmentBonuses,
            derivedStats,
            health: newHealth,
            mana: newMana
        });
    },

    // Resource management with character persistence
    // Recalculate resistances based on current health and passive conditions
    recalculateResistancesFromPassives: () => {
        const state = get();
        if (!state.race || !state.subrace) return;
        const passiveModifiers = getRacialStatModifiers(state.race, state.subrace);

        let updatedResistances = { ...state.resistances };
        let updatedImmunities = [...(state.immunities || [])];

        // Initialize all damage type resistances if they don't exist
        const damageTypes = ['physical', 'ember', 'rime', 'storm', 'arcane', 'primal', 'blight', 'wyrd', 'divine'];
        damageTypes.forEach(type => {
            if (!updatedResistances[type]) {
                updatedResistances[type] = { level: 100, multiplier: 1.0 };
            }
        });

        // Apply each passive modifier
        passiveModifiers.forEach(modifier => {
            // Handle buff config (resistances and immunities)
            if (modifier.buffConfig?.effects) {
                modifier.buffConfig.effects.forEach(effect => {
                    if (effect.statModifier) {
                        const statName = effect.statModifier.stat;
                        const magnitude = effect.statModifier.magnitude;
                        const magnitudeType = effect.statModifier.magnitudeType;

                        // Check if this passive has conditional triggers
                        let shouldApplyBuff = true;
                        if (modifier.triggerConfig?.global?.compoundTriggers && state.health) {
                            const healthTrigger = modifier.triggerConfig.global.compoundTriggers.find(t => t.id === 'health_threshold');
                            if (healthTrigger?.parameters) {
                                const healthPercentage = (state.health.current / state.health.max) * 100;
                                const threshold = healthTrigger.parameters.percentage;
                                const comparison = healthTrigger.parameters.comparison;

                                if (comparison === 'less_than' || comparison === 'below') {
                                    shouldApplyBuff = healthPercentage <= threshold;
                                } else if (comparison === 'greater_than' || comparison === 'above') {
                                    shouldApplyBuff = healthPercentage >= threshold;
                                } else if (comparison === 'equal' || comparison === 'exactly') {
                                    shouldApplyBuff = Math.abs(healthPercentage - threshold) < 1;
                                }
                            }
                        }

                        if (shouldApplyBuff) {
                            const resistanceMap = {
                                'frost_resistance': 'frost',
                                'cold_resistance': 'frost',
                                'fire_resistance': 'fire',
                                'lightning_resistance': 'lightning',
                                'acid_resistance': 'poison',
                                'force_resistance': 'force',
                                'necrotic_resistance': 'necrotic',
                                'radiant_resistance': 'radiant',
                                'poison_resistance': 'poison',
                                'psychic_resistance': 'psychic',
                                'thunder_resistance': 'force'
                            };

                            const resistanceType = resistanceMap[statName];
                            if (resistanceType && updatedResistances[resistanceType] && magnitudeType === 'percentage') {
                                const multiplier = Math.max(0, 1 - (magnitude / 100));
                                if (magnitude >= 100) {
                                    updatedResistances[resistanceType].level = 0;
                                    updatedResistances[resistanceType].multiplier = 0.0;
                                    if (!updatedImmunities.includes(resistanceType)) {
                                        updatedImmunities.push(resistanceType);
                                    }
                                } else if (magnitude >= 50) {
                                    updatedResistances[resistanceType].level = 50;
                                    updatedResistances[resistanceType].multiplier = multiplier;
                                } else if (magnitude >= 25) {
                                    updatedResistances[resistanceType].level = 75;
                                    updatedResistances[resistanceType].multiplier = multiplier;
                                } else {
                                    updatedResistances[resistanceType].level = 100;
                                    updatedResistances[resistanceType].multiplier = multiplier;
                                }
                            }
                        }
                    }
                });
            }

            // Handle debuff config (vulnerabilities)
            let shouldApplyDebuff = true;
            if (modifier.triggerConfig?.global?.compoundTriggers && state.health) {
                const healthTrigger = modifier.triggerConfig.global.compoundTriggers.find(t => t.id === 'health_threshold');
                if (healthTrigger?.parameters) {
                    const healthPercentage = (state.health.current / state.health.max) * 100;
                    const threshold = healthTrigger.parameters.percentage;
                    const comparison = healthTrigger.parameters.comparison;

                    if (comparison === 'less_than' || comparison === 'below') {
                        shouldApplyDebuff = healthPercentage <= threshold;
                    } else if (comparison === 'greater_than' || comparison === 'above') {
                        shouldApplyDebuff = healthPercentage >= threshold;
                    } else if (comparison === 'equal' || comparison === 'exactly') {
                        shouldApplyDebuff = Math.abs(healthPercentage - threshold) < 1;
                    }
                }
            }

            if (shouldApplyDebuff && modifier.debuffConfig?.effects) {
                modifier.debuffConfig.effects.forEach(effect => {
                    if (effect.statusEffect?.vulnerabilityType) {
                        const vulnerabilityType = effect.statusEffect.vulnerabilityType;
                        const vulnerabilityPercent = effect.statusEffect.vulnerabilityPercent || 0;

                        if (!updatedResistances[vulnerabilityType]) {
                            updatedResistances[vulnerabilityType] = { level: 100, multiplier: 1.0 };
                        }

                        const multiplier = 1 + (vulnerabilityPercent / 100);
                        if (vulnerabilityPercent >= 100) {
                            updatedResistances[vulnerabilityType].level = 200;
                            updatedResistances[vulnerabilityType].multiplier = multiplier;
                        } else if (vulnerabilityPercent >= 50) {
                            updatedResistances[vulnerabilityType].level = 150;
                            updatedResistances[vulnerabilityType].multiplier = multiplier;
                        } else if (vulnerabilityPercent >= 25) {
                            updatedResistances[vulnerabilityType].level = 125;
                            updatedResistances[vulnerabilityType].multiplier = multiplier;
                        } else {
                            updatedResistances[vulnerabilityType].level = 100;
                            updatedResistances[vulnerabilityType].multiplier = multiplier;
                        }
                    }
                });
            }
        });

        set({
            resistances: updatedResistances,
            immunities: [...new Set(updatedImmunities)]
        });
    },
});
