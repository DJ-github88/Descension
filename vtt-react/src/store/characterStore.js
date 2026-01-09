import { create } from 'zustand';
import { calculateEquipmentBonuses, calculateDerivedStats } from '../utils/characterUtils';
import { isTwoHandedWeapon, getSlotsToCleanForTwoHanded } from '../utils/equipmentUtils';
import { initializeClassResource, updateClassResourceMax } from '../data/classResources';
import { applyRacialModifiers, getFullRaceData, getRaceData } from '../data/raceData';
import { getRacialSpells, getRacialStatModifiers } from '../utils/raceDisciplineSpellUtils';
import useGameStore from './gameStore';

// Import Firebase services for character persistence
import characterPersistenceService from '../services/firebase/characterPersistenceService';
import characterSessionService from '../services/firebase/characterSessionService';
import characterMigrationService from '../services/firebase/characterMigrationService';
import localStorageManager from '../utils/localStorageManager';

// Import offline support
import { getCharacterData, updateCharacterData, storeCharacterOffline } from '../services/offlineService';

// Import test utilities for development
if (process.env.NODE_ENV === 'development') {
    import('../utils/classResourceUtils').then(module => {
        window.classResourceUtils = module.default;
    });
}

// Helper function to get encumbrance state from inventory store
const getEncumbranceState = () => {
    try {
        // Import inventory store dynamically to avoid circular dependencies
        const inventoryStore = require('./inventoryStore').default;
        const state = inventoryStore.getState();
        return state.encumbranceState || 'normal';
    } catch (error) {
        console.warn('Could not get encumbrance state, using normal:', error);
        return 'normal';
    }
};

// Helper function to get current user ID with enhanced debugging
const getCurrentUserId = () => {
    try {
        // Import auth store dynamically to avoid circular dependencies
        const authStore = require('./authStore').default;
        const state = authStore.getState();

        // In development mode, always return a user ID to prevent Firebase permission issues
        if (process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost') {
            const devUserId = state.user?.uid || 'dev-user-localhost';
            return devUserId;
        }

        return state.user?.uid || null;
    } catch (error) {
        console.warn('Could not get current user ID:', error);
        // In development, provide a fallback user ID
        if (process.env.NODE_ENV === 'development') {
            return 'dev-user-fallback';
        }
        return null;
    }
};

// Helper function to check if current user is a guest
const isGuestUser = () => {
    try {
        const authStore = require('./authStore').default;
        const state = authStore.getState();
        return state.user?.isGuest || false;
    } catch (error) {
        return false;
    }
};

// Helper function to get the appropriate localStorage key for characters
const getCharactersStorageKey = () => {
    return isGuestUser() ? 'mythrill-guest-characters' : 'mythrill-characters';
};

// Helper function to check if we should use Firebase or localStorage only
const shouldUseFirebase = () => {
    // In development on localhost, disable Firebase to avoid permission issues
    if (process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost') {
        return false;
    }

    // Check for demo mode - always use localStorage in demo mode
    try {
        const { isDemoMode } = require('../config/firebase');
        if (isDemoMode) {
            return false;
        }
    } catch (error) {
        console.warn('Could not check demo mode:', error);
    }

    // Check if Firebase is properly configured and user is authenticated
    const userId = getCurrentUserId();
    return !!(userId && characterPersistenceService.isConfigured);
};

// Debounced auto-save timer for character changes
let characterAutoSaveTimer = null;
const CHARACTER_AUTO_SAVE_DELAY = 2000; // 2 seconds debounce

const useCharacterStore = create((set, get) => ({
    // Character management for account system
    characters: [], // Array of all user's characters
    currentCharacterId: null, // ID of currently active character
    isLoading: false,
    error: null,

    // Base character info (for current character)
    name: 'Character Name',
    baseName: 'Character Name', // Store the original name without room formatting
    roomName: '', // Current room name for multiplayer
    race: '', // Race ID (e.g., 'nordmark')
    subrace: '', // Subrace ID (e.g., 'berserker_nordmark')
    class: '', // Character class
    background: '', // Background ID (e.g., 'acolyte', 'sage')
    backgroundDisplayName: '', // Display name for background
    path: '', // Character path ID (e.g., 'mystic', 'zealot')
    pathDisplayName: '', // Display name for path (e.g., 'Mystic', 'Zealot')
    pathPassives: [], // Passive abilities from the selected path/discipline
    level: 1,
    experience: 0, // Current XP
    alignment: 'Neutral Good',
    exhaustionLevel: 0,

    // Level-up modal state
    showLevelUpModal: false,
    pendingLevelUpInfo: null, // { newLevel, oldLevel }
    levelUpHistory: {}, // { level: { statChoice, spellId?, attribute?, timestamp } }

    // Class-specific spell tracking (for Arcanoneer and other spell-learning classes)
    class_spells: {
        known_spells: [] // Array of spell IDs the character knows
    },

    // Racial traits and information
    racialTraits: [],
    racialLanguages: [],
    racialSpeed: 30,
    raceDisplayName: '', // Full display name like "Berserker Nordmark"

    // Character Lore and RP Information
    lore: {
        background: '',
        personalityTraits: '',
        ideals: '',
        bonds: '',
        flaws: '',
        appearance: '',
        backstory: '',
        goals: '',
        fears: '',
        allies: '',
        enemies: '',
        organizations: '',
        notes: '',
        characterImage: null,
        imageTransformations: null
    },

    // Token appearance settings
    tokenSettings: {
        borderColor: '#4CAF50', // Default green border
        customIcon: null // Custom icon URL if different from character image
    },

    // Base Stats
    stats: {
        constitution: 10,
        strength: 10, // Default strength = 10 (0 modifier)
        agility: 10,
        intelligence: 10,
        spirit: 10,
        charisma: 10
    },

    // Resources
    health: {
        current: 45,
        max: 50
    },
    mana: {
        current: 45,
        max: 50
    },
    actionPoints: {
        current: 1,
        max: 3
    },
    // Temporary resources (overheal/overmana/overap)
    tempHealth: 0,
    tempMana: 0,
    tempActionPoints: 0,

    // Class-specific resource system
    classResource: {
        type: 'classResource', // Default type for unknown classes
        current: 3, // Set to 3 to test the bar fill
        max: 5, // Default max value
        // Additional properties for complex resource types
        stacks: [], // For multi-stack systems like Chaos Weaver dice
        phase: null, // For phase-based systems like Lunarch
        threshold: 0, // For threshold-based systems like Berserker
        slots: [], // For slot-based systems like Inscriptor glyphs
        charges: 0, // For charge-based systems
        spheres: [], // For sphere systems like Arcanoneer (array of element IDs)
        strain: 0, // For strain systems like Titan
        risk: 0, // For risk systems like Gambler
        // Visual state tracking
        activeEffects: [], // For tracking active visual effects
        lastUpdate: Date.now()
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
        acid: {
            level: 100,
            multiplier: 1.0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_creature_poison_02.jpg'
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
        thunder: {
            level: 100,
            multiplier: 1.0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_thunderclap.jpg'
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
        cold: {
            value: 0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_frostbolt02.jpg'
        },
        lightning: {
            value: 0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_lightning.jpg'
        },
        acid: {
            value: 0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_creature_poison_02.jpg'
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
        },
        thunder: {
            value: 0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_thunderclap.jpg'
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

    // Quest-based skill system
    skillProgress: {},
    skillRanks: {}, // Skill proficiency ranks from character creation

    // Helper function to get effective stats (base + racial modifiers)
    getEffectiveStats: () => {
        const state = get();
        if (!state.race || !state.subrace) {
            return state.stats;
        }
        return applyRacialModifiers(state.stats, state.race, state.subrace);
    },

    // Helper function to update race display name
    updateRaceDisplayName: () => {
        const state = get();
        if (state.race && state.subrace) {
            const raceData = getFullRaceData(state.race, state.subrace);
            if (raceData) {
                // Format as "Subrace (Race)" e.g. "Face Thief (Mimir)"
                set({ raceDisplayName: `${raceData.subrace.name} (${raceData.race.name})` });
            }
        } else if (state.race) {
            // If only race is selected, use the race's proper name
            const raceData = getRaceData(state.race);
            if (raceData) {
                set({ raceDisplayName: raceData.name });
            }
        } else {
            // Clear display name if no race selected
            set({ raceDisplayName: '' });
        }
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

            const encumbranceState = getEncumbranceState();
            const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState, state.exhaustionLevel || 0, state.health, state.race, state.subrace);

            // Update health and mana max values when constitution or intelligence change
            let newHealth = { ...state.health };
            let newMana = { ...state.mana };

            if (statName === 'constitution') {
                const newMaxHealth = Math.round(derivedStats.maxHealth);
                newHealth.max = newMaxHealth;
                // Ensure current health doesn't exceed new max
                newHealth.current = Math.min(newHealth.current, newMaxHealth);


            }

            if (statName === 'intelligence') {
                const newMaxMana = Math.round(derivedStats.maxMana);
                newMana.max = newMaxMana;
                // Ensure current mana doesn't exceed new max
                newMana.current = Math.min(newMana.current, newMaxMana);


            }

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
                classResource: newClassResource
            };
        });
    },

    updateEquipment: (slot, item) => {
        set(state => {
            const newEquipment = { ...state.equipment, [slot]: item };
            const oldEquipmentBonuses = calculateEquipmentBonuses(state.equipment);
            const equipmentBonuses = calculateEquipmentBonuses(newEquipment);
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

            const encumbranceState = getEncumbranceState();
            const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState, state.exhaustionLevel || 0, state.health, state.race, state.subrace);

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
                        health: state.health,
                        mana: state.mana,
                        actionPoints: state.actionPoints,
                        classResource: state.classResource
                    }
                });
            }

            // Check if any health/mana affecting bonuses changed
            const oldConBonus = oldEquipmentBonuses.con || 0;
            const newConBonus = equipmentBonuses.con || 0;
            const oldIntBonus = oldEquipmentBonuses.int || 0;
            const newIntBonus = equipmentBonuses.int || 0;
            const oldMaxHealthBonus = oldEquipmentBonuses.maxHealth || 0;
            const newMaxHealthBonus = equipmentBonuses.maxHealth || 0;
            const oldMaxHealthPercent = oldEquipmentBonuses.maxHealthPercent || 0;
            const newMaxHealthPercent = equipmentBonuses.maxHealthPercent || 0;
            const oldMaxManaBonus = oldEquipmentBonuses.maxMana || 0;
            const newMaxManaBonus = equipmentBonuses.maxMana || 0;
            const oldMaxManaPercent = oldEquipmentBonuses.maxManaPercent || 0;
            const newMaxManaPercent = equipmentBonuses.maxManaPercent || 0;

            let newHealth = { ...state.health };
            let newMana = { ...state.mana };

            // Update health if any health-affecting bonus changed
            if (oldConBonus !== newConBonus || oldMaxHealthBonus !== newMaxHealthBonus || oldMaxHealthPercent !== newMaxHealthPercent) {
                const newMaxHealth = Math.round(derivedStats.maxHealth);
                newHealth.max = newMaxHealth;
                // Ensure current health doesn't exceed new max
                newHealth.current = Math.min(newHealth.current, newMaxHealth);


            }

            // Update mana if any mana-affecting bonus changed
            if (oldIntBonus !== newIntBonus || oldMaxManaBonus !== newMaxManaBonus || oldMaxManaPercent !== newMaxManaPercent) {
                const newMaxMana = Math.round(derivedStats.maxMana);
                newMana.max = newMaxMana;
                // Ensure current mana doesn't exceed new max
                newMana.current = Math.min(newMana.current, newMaxMana);


            }

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
                resistances: newResistances
            };
        });
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

    updateCharacterInfo: (field, value) => {
        set(state => {
            // Special handling for exhaustion level - use the dedicated function
            if (field === 'exhaustionLevel') {
                get().updateExhaustionLevel(parseInt(value) || 0);
                return {}; // updateExhaustionLevel handles the state update
            }

            const newState = { [field]: value };

            // Store offline changes for sync when back online
            if (state.currentCharacterId) {
                const userId = getCurrentUserId();
                if (userId) {
                    updateCharacterData(state.currentCharacterId, newState, userId).catch(error => {
                        console.error('Failed to store character update offline:', error);
                    });
                }
            }

            // If level is being changed, handle level-up/down logic
            if (field === 'level') {
                const oldLevel = state.level || 1;
                const newLevel = Math.max(1, Math.min(20, parseInt(value) || 1));

                // If no actual change, just return
                if (newLevel === oldLevel) {
                    return newState;
                }

                // Record character change for persistence
                if (state.currentCharacterId && newLevel !== oldLevel) {
                    get().recordCharacterChange(state.currentCharacterId, 'stat_change', {
                        stat: 'level',
                        value: newLevel,
                        previousValue: oldLevel,
                        timestamp: new Date()
                    });
                }

                // If leveling down, reverse bonuses from lost levels
                if (newLevel < oldLevel) {
                    // Reverse bonuses for each level being lost (in descending order)
                    for (let level = oldLevel; level > newLevel; level--) {
                        get().reverseLevelUpBonus(level);
                    }

                    // Update XP to match new level
                    const { getXPForLevel } = require('../utils/experienceUtils');
                    const newXP = getXPForLevel(newLevel);
                    newState.experience = newXP;
                }
                // If leveling up, check if we need to show level-up modal
                else if (newLevel > oldLevel) {
                    // Find the first level that doesn't have a history entry
                    const levelUpHistory = state.levelUpHistory || {};
                    let levelToPrompt = null;

                    // Check each level from oldLevel+1 to newLevel
                    for (let level = oldLevel + 1; level <= newLevel; level++) {
                        if (!levelUpHistory[level]) {
                            levelToPrompt = level;
                            break;
                        }
                    }

                    // If we found a level that needs a choice, show the modal
                    if (levelToPrompt) {
                        newState.showLevelUpModal = true;
                        newState.pendingLevelUpInfo = {
                            newLevel: levelToPrompt,
                            oldLevel: levelToPrompt - 1
                        };
                    }

                    // Update XP to match new level
                    const { getXPForLevel } = require('../utils/experienceUtils');
                    const newXP = getXPForLevel(newLevel);
                    newState.experience = newXP;
                }
            }

            // If name is being changed, update baseName and keep name clean
            if (field === 'name') {
                // Extract base name by removing any existing room formatting
                const cleanName = value.replace(/\s*\([^)]*\)\s*$/, '');
                newState.baseName = cleanName;
                // Keep character name unchanged - room name is for context only
                // Character name should always remain just the character name
                newState.name = cleanName;
            }

            // If class is being changed, initialize the class resource
            if (field === 'class' && value && value !== state.class) {
                const classResource = initializeClassResource(value, {
                    ...state.stats,
                    level: state.level
                });

                // If no specific class resource config exists, provide a default
                if (classResource) {
                    newState.classResource = classResource;
                } else {
                    // Default class resource for unknown classes
                    newState.classResource = {
                        type: 'classResource',
                        current: 0,
                        max: 5,
                        stacks: [],
                        phase: null,
                        threshold: 0,
                        slots: [],
                        charges: 0,
                        volatility: 0,
                        strain: 0,
                        risk: 0,
                        flourish: 0,
                        stance: null,
                        wardTokens: 0,
                        precision: 0,
                        activeEffects: [],
                        lastUpdate: Date.now()
                    };
                }

                // Auto-assign starting spells for ALL classes
                const previousClass = state.class;

                // Helper function to get class data by name
                const getClassData = (className) => {
                    const classDataMap = {
                        'Arcanoneer': () => require('../data/classes/arcanoneerData').ARCANONEER_DATA,
                        'Berserker': () => require('../data/classes/berserkerData').BERSERKER_DATA,
                        'Bladedancer': () => require('../data/classes/bladedancerData').BLADEDANCER_DATA,
                        'Chaos Weaver': () => require('../data/classes/chaosWeaverData').CHAOS_WEAVER_DATA,
                        'Chronarch': () => require('../data/classes/chronarchData').CHRONARCH_DATA,
                        'Covenbane': () => require('../data/classes/covenbaneData').COVENBANE_DATA,
                        'Deathcaller': () => require('../data/classes/deathcallerData').DEATHCALLER_DATA,
                        'Dreadnaught': () => require('../data/classes/dreadnaughtData').DREADNAUGHT_DATA,
                        'Exorcist': () => require('../data/classes/exorcistData').EXORCIST_DATA,
                        'False Prophet': () => require('../data/classes/falseProphetData').FALSE_PROPHET_DATA,
                        'Fate Weaver': () => require('../data/classes/fateWeaverData').FATE_WEAVER_DATA,
                        'Formbender': () => require('../data/classes/formbenderData').FORMBENDER_DATA,
                        'Gambler': () => require('../data/classes/gamblerData').GAMBLER_DATA,
                        'Huntress': () => require('../data/classes/huntressData').HUNTRESS_DATA,
                        'Inscriptor': () => require('../data/classes/inscriptorData').INSCRIPTOR_DATA,
                        'Lichborne': () => require('../data/classes/lichborneData').LICHBORNE_DATA,
                        'Lunarch': () => require('../data/classes/lunarchData').LUNARCH_DATA,
                        'Martyr': () => require('../data/classes/martyrData').MARTYR_DATA,
                        'Minstrel': () => require('../data/classes/minstrelData').MINSTREL_DATA,
                        'Oracle': () => require('../data/classes/oracleData').ORACLE_DATA,
                        'Plaguebringer': () => require('../data/classes/plaguebringerData').PLAGUEBRINGER_DATA,
                        'Primalist': () => require('../data/classes/primalistData').PRIMALIST_DATA,
                        'Pyrofiend': () => require('../data/classes/pyrofiendData').PYROFIEND_DATA,
                        'Spellguard': () => require('../data/classes/spellguardData').SPELLGUARD_DATA,
                        'Titan': () => require('../data/classes/titanData').TITAN_DATA,
                        'Toxicologist': () => require('../data/classes/toxicologistData').TOXICOLOGIST_DATA,
                        'Warden': () => require('../data/classes/wardenData').WARDEN_DATA,
                        'Witch Doctor': () => require('../data/classes/witchDoctorData').WITCH_DOCTOR_DATA
                    };
                    const loader = classDataMap[className];
                    if (loader) {
                        try {
                            return loader();
                        } catch (e) {
                            console.warn(`Failed to load class data for ${className}:`, e);
                            return null;
                        }
                    }
                    return null;
                };

                // Helper function to get level 1 spell IDs from class data
                const getLevel1SpellIds = (classData) => {
                    if (!classData) return [];

                    // First try spellPools[1]
                    if (classData.spellPools && classData.spellPools[1]) {
                        return classData.spellPools[1];
                    }

                    // Fallback: filter spells/exampleSpells array for level 1 spells
                    const spellsArray = classData.spells || classData.exampleSpells || [];
                    if (Array.isArray(spellsArray) && spellsArray.length > 0) {
                        return spellsArray
                            .filter(spell => spell.level === 1 || !spell.level) // Include spells without level (default to 1)
                            .map(spell => spell.id)
                            .filter(id => id); // Remove any undefined/null IDs
                    }

                    return [];
                };

                // Try to get class data and assign starter spells
                const classData = getClassData(value);
                if (classData) {
                    // Always reassign spells when switching to a different class
                    const shouldReassignSpells = previousClass !== value;

                    if (shouldReassignSpells) {
                        // Clear old spells first when switching classes
                        newState.class_spells = {
                            ...(state.class_spells || {}),
                            known_spells: []
                        };

                        // Try to get spells from ALL_CLASS_SPELLS first (to ensure IDs match)
                        let selectedSpells = [];
                        try {
                            const { ALL_CLASS_SPELLS } = require('../data/classSpellGenerator');
                            const available = ALL_CLASS_SPELLS[value] || [];


                            const level1Spells = available.filter(s => {
                                const spellLevel = s.level || 1;
                                const isLevel1 = spellLevel === 1;
                                // Also exclude universal spells and unwanted spells
                                const id = s.id?.toLowerCase() || '';
                                const name = s.name?.toLowerCase() || '';
                                const isUnwanted = (
                                    id.startsWith('universal_') ||
                                    name === 'attack (melee or ranged)' ||
                                    id.includes('cast_minor') ||
                                    id.includes('cast_major') ||
                                    name.includes('cast minor') ||
                                    name.includes('cast major')
                                );
                                return isLevel1 && !isUnwanted && s.id; // Ensure spell has an ID
                            });


                            if (level1Spells.length > 0) {
                                const shuffled = [...level1Spells].sort(() => Math.random() - 0.5);
                                selectedSpells = shuffled.slice(0, Math.min(3, level1Spells.length)).map(s => s.id).filter(id => id);
                            } else {
                                console.warn(`⚠️ No level 1 spells found in ALL_CLASS_SPELLS for ${value}`);
                            }
                        } catch (e) {
                            console.warn('Could not load from ALL_CLASS_SPELLS, using classData:', e);
                        }

                        // Fallback to classData if ALL_CLASS_SPELLS didn't work
                        if (selectedSpells.length === 0) {
                            const level1SpellIds = getLevel1SpellIds(classData);
                            if (level1SpellIds.length > 0) {
                                const shuffled = [...level1SpellIds].sort(() => Math.random() - 0.5);
                                selectedSpells = shuffled.slice(0, Math.min(3, level1SpellIds.length));
                            }
                        }

                        if (selectedSpells.length > 0) {
                            newState.class_spells = {
                                ...(state.class_spells || {}),
                                known_spells: selectedSpells
                            };


                            // After setting state, ensure spells are assigned for current level
                            // This handles cases where character is already level 2+ when class is selected
                            setTimeout(() => {
                                const currentState = get();
                                const currentLevel = currentState.level || 1;
                                if (currentLevel > 1) {
                                    get().assignSpellsForLevel(currentLevel, value);
                                }
                            }, 100);
                        } else {
                            console.error(`❌ Failed to assign any starter spells for ${value}`, {
                                hasClassData: !!classData,
                                classDataSpells: classData?.spells?.length || classData?.exampleSpells?.length || 0
                            });
                        }
                    }
                }
            }

            // If we have an active character and we're updating a field that should sync,
            // also update the active character in the characters array
            if (state.currentCharacterId) {
                const updatedCharacters = state.characters.map(char => {
                    if (char.id === state.currentCharacterId) {
                        const updatedChar = {
                            ...char,
                            [field]: value,
                            updatedAt: new Date().toISOString()
                        };
                        // If class_spells was updated, sync that too
                        if (newState.class_spells) {
                            updatedChar.class_spells = newState.class_spells;
                        }
                        return updatedChar;
                    }
                    return char;
                });

                // Save updated characters to localStorage with quota management
                try {
                    const storageKey = getCharactersStorageKey();
                    const result = localStorageManager.safeSetItem(storageKey, JSON.stringify(updatedCharacters));
                    if (!result.success) {
                        console.error('Error saving characters to localStorage:', result.error);
                    }
                } catch (error) {
                    console.error('Error saving characters to localStorage:', error);
                }

                newState.characters = updatedCharacters;
            }

            // If race is being changed, clear subrace and update display name
            if (field === 'race' && value !== state.race) {
                newState.subrace = '';
                newState.racialTraits = [];
                newState.racialLanguages = [];
                newState.racialSpeed = 30;

                // Clear old passives and resistances when race changes
                // Reset all resistances to normal
                const damageTypes = ['fire', 'frost', 'lightning', 'acid', 'force', 'necrotic', 'radiant', 'poison', 'psychic', 'thunder', 'chaos', 'bludgeoning', 'piercing', 'slashing'];
                const resetResistances = {};
                damageTypes.forEach(type => {
                    resetResistances[type] = { level: 100, multiplier: 1.0 };
                });
                newState.resistances = resetResistances;
                newState.immunities = [];

                // Set race display name to the proper race name
                if (value) {
                    const raceData = getRaceData(value);
                    newState.raceDisplayName = raceData ? raceData.name : '';
                } else {
                    newState.raceDisplayName = '';
                }
            }

            // If subrace is being changed, update racial traits
            if (field === 'subrace' && value && value !== state.subrace) {
                const raceData = getFullRaceData(state.race, value);
                if (raceData) {
                    // Only include actual spells in racialTraits (filter out passive stat modifiers)
                    // Passive stat modifiers are handled separately and applied directly to stats
                    newState.racialTraits = getRacialSpells(state.race, value);
                    newState.racialLanguages = raceData.combinedTraits.languages;
                    newState.racialSpeed = raceData.combinedTraits.speed;
                    // Format as "Subrace (Race)" e.g. "Face Thief (Mimir)"
                    newState.raceDisplayName = `${raceData.subrace.name} (${raceData.race.name})`;

                    // Apply passive stat modifiers (resistances, vulnerabilities, immunities) to character stats
                    const passiveModifiers = getRacialStatModifiers(state.race, value);

                    // Start with current resistances and immunities, or initialize if they don't exist
                    let updatedResistances = { ...state.resistances };
                    let updatedImmunities = [...(state.immunities || [])];

                    // Initialize all damage type resistances if they don't exist
                    const damageTypes = ['fire', 'frost', 'lightning', 'acid', 'force', 'necrotic', 'radiant', 'poison', 'psychic', 'thunder', 'chaos', 'bludgeoning', 'piercing', 'slashing'];
                    damageTypes.forEach(type => {
                        if (!updatedResistances[type]) {
                            updatedResistances[type] = { level: 100, multiplier: 1.0 };
                        }
                    });

                    // Apply each passive modifier
                    passiveModifiers.forEach(modifier => {
                        // Check if this passive has conditional triggers (like health threshold)
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

                        // Handle buff config (resistances and immunities)
                        if (shouldApplyBuff && modifier.buffConfig?.effects) {
                            modifier.buffConfig.effects.forEach(effect => {
                                // Handle stat modifiers (resistances)
                                if (effect.statModifier) {
                                    const statName = effect.statModifier.stat;
                                    const magnitude = effect.statModifier.magnitude;
                                    const magnitudeType = effect.statModifier.magnitudeType;

                                    // Map resistance stat names to resistance types
                                    const resistanceMap = {
                                        'frost_resistance': 'frost',
                                        'cold_resistance': 'frost', // Legacy support
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
                                    if (resistanceType && updatedResistances[resistanceType]) {
                                        // Convert percentage to resistance level and multiplier
                                        if (magnitudeType === 'percentage') {
                                            // Calculate multiplier: 50% resistance = 0.5 multiplier (takes 50% damage)
                                            const multiplier = Math.max(0, 1 - (magnitude / 100));

                                            if (magnitude >= 100) {
                                                updatedResistances[resistanceType].level = 0;
                                                updatedResistances[resistanceType].multiplier = 0.0;
                                                // Add to immunities array if not already there
                                                if (!updatedImmunities.includes(resistanceType)) {
                                                    updatedImmunities.push(resistanceType);
                                                }
                                            } else if (magnitude >= 50) {
                                                updatedResistances[resistanceType].level = 50;
                                                updatedResistances[resistanceType].multiplier = multiplier;
                                            } else if (magnitude >= 25) {
                                                updatedResistances[resistanceType].level = 75;
                                                updatedResistances[resistanceType].multiplier = multiplier;
                                            } else if (magnitude <= -50) {
                                                updatedResistances[resistanceType].level = 200;
                                                updatedResistances[resistanceType].multiplier = multiplier;
                                            } else if (magnitude <= -25) {
                                                updatedResistances[resistanceType].level = 150;
                                                updatedResistances[resistanceType].multiplier = multiplier;
                                            } else {
                                                // Normal resistance, but still set multiplier
                                                updatedResistances[resistanceType].level = 100;
                                                updatedResistances[resistanceType].multiplier = multiplier;
                                            }
                                        }
                                    }
                                }

                                // Handle statusEffect immunities (like Undead Resilience)
                                if (effect.statusEffect && effect.statusEffect.level === 'extreme') {
                                    const effectName = (effect.name || '').toLowerCase();
                                    const effectDesc = (effect.description || '').toLowerCase();

                                    // Check if this is an immunity effect
                                    if (effectName.includes('immunity') || effectName.includes('immune') ||
                                        effectDesc.includes('immune') || effectDesc.includes('immunity')) {

                                        // Map immunity names to damage types or conditions
                                        const immunityMap = {
                                            'poison': 'poison',
                                            'disease': 'disease',
                                            'exhaustion': 'exhaustion',
                                            'frost': 'frost',
                                            'cold': 'frost', // Legacy support
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

                                        // Try to match by name
                                        let immunityType = null;
                                        for (const [key, value] of Object.entries(immunityMap)) {
                                            if (effectName.includes(key) || effectDesc.includes(key)) {
                                                immunityType = value;
                                                break;
                                            }
                                        }

                                        // If it's a damage type immunity, add to both resistances and immunities
                                        if (immunityType && damageTypes.includes(immunityType)) {
                                            if (!updatedResistances[immunityType]) {
                                                updatedResistances[immunityType] = { level: 100, multiplier: 1.0 };
                                            }
                                            updatedResistances[immunityType].level = 0;
                                            updatedResistances[immunityType].multiplier = 0.0;
                                            if (!updatedImmunities.includes(immunityType)) {
                                                updatedImmunities.push(immunityType);
                                            }
                                        } else if (immunityType) {
                                            // For condition immunities (like exhaustion), just add to immunities
                                            if (!updatedImmunities.includes(immunityType)) {
                                                updatedImmunities.push(immunityType);
                                            }
                                        }
                                    }
                                }
                            });
                        }

                        // Handle debuff config (vulnerabilities)
                        // Check if this passive has conditional triggers (like health threshold)
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
                                    let vulnerabilityType = effect.statusEffect.vulnerabilityType;
                                    const vulnerabilityPercent = effect.statusEffect.vulnerabilityPercent || 0;

                                    // Map legacy 'cold' to 'frost' for vulnerabilities
                                    if (vulnerabilityType === 'cold') {
                                        vulnerabilityType = 'frost';
                                    }

                                    // Initialize resistance if it doesn't exist
                                    if (!updatedResistances[vulnerabilityType]) {
                                        updatedResistances[vulnerabilityType] = { level: 100, multiplier: 1.0 };
                                    }

                                    // Convert vulnerability percentage to resistance level and multiplier
                                    // 50% vulnerability = 1.5x damage = 150 level
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
                                        // Small vulnerability
                                        updatedResistances[vulnerabilityType].level = 100;
                                        updatedResistances[vulnerabilityType].multiplier = multiplier;
                                    }
                                }
                            });
                        }
                    });

                    newState.resistances = updatedResistances;
                    newState.immunities = [...new Set(updatedImmunities)]; // Remove duplicates
                }
            }

            // If pathPassives is being changed, also update resistances and immunities
            if (field === 'pathPassives' && Array.isArray(value)) {
                // Start with current resistances, or initialize if they don't exist
                let updatedResistances = { ...state.resistances };
                let updatedImmunities = [...(state.immunities || [])];

                // Initialize all damage type resistances if they don't exist
                const damageTypes = ['fire', 'frost', 'lightning', 'acid', 'force', 'necrotic', 'radiant', 'poison', 'psychic', 'thunder', 'chaos', 'bludgeoning', 'piercing', 'slashing'];
                damageTypes.forEach(type => {
                    if (!updatedResistances[type]) {
                        updatedResistances[type] = { level: 100, multiplier: 1.0 };
                    }
                });

                // Apply each path passive modifier
                value.forEach(modifier => {
                    // Handle buff config (resistances)
                    if (modifier.buffConfig?.effects) {
                        modifier.buffConfig.effects.forEach(effect => {
                            if (effect.statModifier) {
                                const statName = effect.statModifier.stat;
                                const magnitude = effect.statModifier.magnitude;
                                const magnitudeType = effect.statModifier.magnitudeType;

                                // Map resistance stat names to resistance types
                                const resistanceMap = {
                                    'frost_resistance': 'frost',
                                    'cold_resistance': 'frost', // Legacy support
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
                                if (resistanceType) {
                                    // Initialize resistance if it doesn't exist
                                    if (!updatedResistances[resistanceType]) {
                                        updatedResistances[resistanceType] = { level: 100, multiplier: 1.0 };
                                    }

                                    // Convert percentage to resistance level and multiplier
                                    if (magnitudeType === 'percentage') {
                                        // Calculate multiplier: 50% resistance = 0.5 multiplier (takes 50% damage)
                                        const multiplier = Math.max(0, 1 - (magnitude / 100));

                                        if (magnitude >= 100) {
                                            updatedResistances[resistanceType].level = 0;
                                            updatedResistances[resistanceType].multiplier = 0.0;
                                            // Add to immunities array if not already there
                                            if (!updatedImmunities.includes(resistanceType)) {
                                                updatedImmunities.push(resistanceType);
                                            }
                                        } else if (magnitude >= 50) {
                                            updatedResistances[resistanceType].level = 50;
                                            updatedResistances[resistanceType].multiplier = multiplier;
                                        } else if (magnitude >= 25) {
                                            updatedResistances[resistanceType].level = 75;
                                            updatedResistances[resistanceType].multiplier = multiplier;
                                        } else if (magnitude <= -50) {
                                            updatedResistances[resistanceType].level = 200;
                                            updatedResistances[resistanceType].multiplier = multiplier;
                                        } else if (magnitude <= -25) {
                                            updatedResistances[resistanceType].level = 150;
                                            updatedResistances[resistanceType].multiplier = multiplier;
                                        } else {
                                            // Normal resistance, but still set multiplier
                                            updatedResistances[resistanceType].level = 100;
                                            updatedResistances[resistanceType].multiplier = multiplier;
                                        }
                                    }
                                }
                            }
                        });
                    }

                    // Handle debuff config (vulnerabilities)
                    // Check if this passive has conditional triggers (like health threshold)
                    let shouldApplyDebuff = true;
                    if (modifier.triggerConfig?.global?.compoundTriggers) {
                        const healthTrigger = modifier.triggerConfig.global.compoundTriggers.find(t => t.id === 'health_threshold');
                        if (healthTrigger?.parameters && get().health) {
                            const health = get().health;
                            const healthPercentage = (health.current / health.max) * 100;
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
                                let vulnerabilityType = effect.statusEffect.vulnerabilityType;
                                const vulnerabilityPercent = effect.statusEffect.vulnerabilityPercent || 0;

                                // Map legacy 'cold' to 'frost' for vulnerabilities
                                if (vulnerabilityType === 'cold') {
                                    vulnerabilityType = 'frost';
                                }

                                // Initialize resistance if it doesn't exist
                                if (!updatedResistances[vulnerabilityType]) {
                                    updatedResistances[vulnerabilityType] = { level: 100, multiplier: 1.0 };
                                }

                                // Convert vulnerability percentage to resistance level and multiplier
                                // 50% vulnerability = 1.5x damage = 150 level
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
                                    // Small vulnerability
                                    updatedResistances[vulnerabilityType].level = 100;
                                    updatedResistances[vulnerabilityType].multiplier = multiplier;
                                }
                            }
                        });
                    }
                });

                newState.resistances = updatedResistances;
                newState.immunities = [...new Set(updatedImmunities)]; // Remove duplicates
            }

            // CRITICAL FIX: Debounced auto-save to Firebase for character changes during gameplay
            // Clear existing timer
            if (characterAutoSaveTimer) {
                clearTimeout(characterAutoSaveTimer);
            }

            // Schedule auto-save if we have an active character
            if (state.currentCharacterId) {
                characterAutoSaveTimer = setTimeout(() => {
                    try {
                        // Save current character to Firebase and localStorage
                        get().saveCurrentCharacter();

                        // Also record the change for session tracking
                        get().recordCharacterChange(state.currentCharacterId, 'stat_change', {
                            stat: field,
                            value: value,
                            timestamp: new Date()
                        });
                    } catch (error) {
                        console.warn('Failed to auto-save character after updateCharacterInfo:', error);
                    }
                }, CHARACTER_AUTO_SAVE_DELAY);
            }

            return newState;
        });
    },

    // Update just the base name without room formatting (for character sheet input)
    updateBaseName: (newBaseName) => {
        set(state => {
            const newState = { baseName: newBaseName };
            // Keep character name unchanged - room name is for context only
            // Character name should always remain just the character name
            newState.name = newBaseName;
            return newState;
        });
    },

    // Room name management for multiplayer
    setRoomName: (roomName) => {
        set(state => {
            const newState = { roomName };
            // Keep character name unchanged - room name is for context only
            // Character name should always remain just the character name
            if (state.baseName) {
                newState.name = state.baseName;
            }
            return newState;
        });
    },

    clearRoomName: () => {
        set(state => ({
            roomName: '',
            name: state.baseName || state.name.replace(/\s*\([^)]*\)\s*$/, '') // Remove room name from display
        }));
    },

    // Quest-based skill progress
    updateSkillProgress: (skillId, progress) =>
        set((state) => ({
            skillProgress: { ...state.skillProgress, [skillId]: progress }
        })),

    updateResource: (resource, current, max) => {
        set(state => {
            const oldResource = state[resource] || { current: 0, max: 0 };
            const newResource = {
                current: current !== undefined ? Math.min(max || oldResource.max, Math.max(0, current)) : oldResource.current,
                max: max !== undefined ? Math.max(0, max) : oldResource.max
            };

            // If health changed, recalculate derived stats to apply conditional passives (like Battle Fury)
            let newDerivedStats = state.derivedStats;
            if (resource === 'health') {
                // Apply racial modifiers to get effective stats for calculations
                const effectiveStats = state.race && state.subrace
                    ? applyRacialModifiers(state.stats, state.race, state.subrace)
                    : state.stats;
                const equipmentBonuses = calculateEquipmentBonuses(state.equipment);

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

                const encumbranceState = getEncumbranceState();
                newDerivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState, state.exhaustionLevel || 0, newResource, state.race, state.subrace);
            }

            // CRITICAL FIX: Debounced auto-save to Firebase/Multiplayer for resource changes
            if (state.currentCharacterId) {
                if (characterAutoSaveTimer) clearTimeout(characterAutoSaveTimer);
                characterAutoSaveTimer = setTimeout(() => {
                    try {
                        get().saveCurrentCharacter();
                    } catch (error) {
                        console.warn('Failed to auto-save character after updateResource:', error);
                    }
                }, CHARACTER_AUTO_SAVE_DELAY);
            }

            return {
                [resource]: newResource,
                ...(resource === 'health' ? { derivedStats: newDerivedStats } : {})
            };
        });
    },

    // Temporary resource management
    updateTempResource: (resourceType, amount) => {
        set(state => {
            const tempField = `temp${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}`;
            if (resourceType === 'health') {
                return { tempHealth: Math.max(0, amount) };
            } else if (resourceType === 'mana') {
                return { tempMana: Math.max(0, amount) };
            } else if (resourceType === 'actionPoints') {
                return { tempActionPoints: Math.max(0, amount) };
            }
            return state;
        });
    },

    // Class resource management functions
    updateClassResource: (field, value) => {
        set(state => {
            if (!state.classResource) return state;

            const updatedResource = {
                ...state.classResource,
                [field]: value,
                lastUpdate: Date.now()
            };

            // CRITICAL FIX: Debounced auto-save for class resource changes
            if (state.currentCharacterId) {
                if (characterAutoSaveTimer) clearTimeout(characterAutoSaveTimer);
                characterAutoSaveTimer = setTimeout(() => {
                    try {
                        get().saveCurrentCharacter();
                    } catch (error) {
                        console.warn('Failed to auto-save character after updateClassResource:', error);
                    }
                }, CHARACTER_AUTO_SAVE_DELAY);
            }

            return {
                classResource: updatedResource
            };
        });
    },

    // Consume class resource (spend points/charges/etc.)
    consumeClassResource: (amount = 1) => {
        set(state => {
            if (!state.classResource || state.classResource.current < amount) {
                return state;
            }

            const newCurrent = Math.max(0, state.classResource.current - amount);



            return {
                classResource: {
                    ...state.classResource,
                    current: newCurrent,
                    lastUpdate: Date.now()
                }
            };
        });
    },

    // Gain class resource (earn points/charges/etc.)
    gainClassResource: (amount = 1) => {
        set(state => {
            if (!state.classResource) return state;

            const newCurrent = Math.min(state.classResource.max, state.classResource.current + amount);



            return {
                classResource: {
                    ...state.classResource,
                    current: newCurrent,
                    lastUpdate: Date.now()
                }
            };
        });
    },

    // Refresh class resource max when stats change
    refreshClassResourceMax: () => {
        set(state => {
            if (!state.classResource || !state.class) return state;

            const updatedResource = updateClassResourceMax(
                state.classResource,
                state.class,
                { ...state.stats, level: state.level }
            );



            return {
                classResource: updatedResource
            };
        });
    },

    // Update lore information
    updateLore: (field, value) => {
        set(state => ({
            lore: {
                ...state.lore,
                [field]: value
            }
        }));
    },

    // Update background (syncs both background ID and backgroundDisplayName)
    updateBackground: (backgroundId, backgroundDisplayName) => {
        set(state => ({
            background: backgroundId || '',
            backgroundDisplayName: backgroundDisplayName || ''
        }));
    },

    // Update token settings
    updateTokenSettings: (field, value) => {
        set(state => ({
            tokenSettings: {
                ...state.tokenSettings,
                [field]: value
            }
        }));
    },

    // Initialize character
    initializeCharacter: () => {
        const state = get();

        // Auto-assign spells if character has a class and level but missing spells
        if (state.characterClass && state.level && state.level > 1) {
            const knownSpells = state.class_spells?.known_spells || [];
            const expectedSpellCount = 3 + (state.level - 1); // 3 level 1 + 1 per level after

            if (knownSpells.length < expectedSpellCount) {
                get().assignSpellsForLevel(state.level, state.characterClass);
            }
        }

        // Update race display name if race and subrace are set
        // Also update if the raceDisplayName doesn't contain parentheses (old format)
        if (state.race && state.subrace && (!state.raceDisplayName || !state.raceDisplayName.includes('('))) {
            get().updateRaceDisplayName();
        }

        const equipmentBonuses = calculateEquipmentBonuses(state.equipment);
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

        const encumbranceState = getEncumbranceState();
        const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState, state.exhaustionLevel || 0, state.health, state.race, state.subrace);

        // Calculate total level-up bonuses from history
        let totalHealthBonus = 0;
        let totalManaBonus = 0;

        if (state.levelUpHistory) {
            Object.values(state.levelUpHistory).forEach(entry => {
                totalHealthBonus += entry.healthIncrease || 0;
                totalManaBonus += entry.manaIncrease || 0;
            });
        }

        // Update health and mana max values based on derived stats + level-up bonuses
        const newMaxHealth = Math.round(derivedStats.maxHealth) + totalHealthBonus;
        const newMaxMana = Math.round(derivedStats.maxMana) + totalManaBonus;

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

    // Character Management Functions for Account System
    loadCharacters: async () => {
        set({ isLoading: true, error: null });
        try {
            const userId = getCurrentUserId();
            const useFirebase = shouldUseFirebase();

            // Check for offline characters first
            const offlineCharacters = {};
            if (userId) {
                // Load any offline character data
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('offline_characters_')) {
                        try {
                            const data = JSON.parse(localStorage.getItem(key));
                            Object.assign(offlineCharacters, data);
                        } catch (error) {
                            console.warn('Failed to load offline character data:', error);
                        }
                    }
                });
            }

            // CRITICAL FIX: Ensure character isolation between guest, dev, and authenticated users
            // Clear characters if switching between account types or users
            const isGuest = isGuestUser();
            const storageKey = getCharactersStorageKey();

            // Get current user ID to determine account type
            const currentUserId = getCurrentUserId();
            const isDevUser = currentUserId?.startsWith('dev-user-') || currentUserId === 'dev-user-123';

            // Determine current account type
            let currentAccountType = 'guest';
            if (isDevUser) {
                currentAccountType = 'dev';
            } else if (!isGuest && userId) {
                currentAccountType = 'authenticated';
            }

            // If switching account types, clear the old storage
            const lastAccountType = localStorage.getItem('mythrill-last-account-type');
            const lastUserId = localStorage.getItem('mythrill-last-user-id');

            if (lastAccountType && lastAccountType !== currentAccountType) {
                if (lastAccountType === 'guest') {
                    localStorage.removeItem('mythrill-guest-characters');
                } else {
                    localStorage.removeItem('mythrill-characters');
                }
            }

            // CRITICAL FIX: Also check if userId changed (dev vs Google login)
            // This ensures dev preview and Google login have separate character storage
            if (lastUserId && lastUserId !== currentUserId) {
                // Clear characters when switching between different users (dev vs Google login)
                if (lastAccountType === 'guest') {
                    localStorage.removeItem('mythrill-guest-characters');
                } else {
                    localStorage.removeItem('mythrill-characters');
                }
            }

            localStorage.setItem('mythrill-last-account-type', currentAccountType);
            if (currentUserId) {
                localStorage.setItem('mythrill-last-user-id', currentUserId);
            }

            // If guest user or not using Firebase, skip Firebase loading
            if (userId && useFirebase && !isGuest) {
                // Skip migration in development mode to avoid Firebase permission issues
                if (process.env.NODE_ENV !== 'development' && characterMigrationService.isMigrationNeeded()) {
                    try {
                        // Create backup before migration
                        characterMigrationService.createBackup();

                        // Perform migration
                        const migrationResult = await characterMigrationService.migrateAllCharacters(userId);

                        if (!migrationResult.success) {
                            console.warn(`Migration completed with errors: ${migrationResult.failed} failed`);
                        }
                    } catch (migrationError) {
                        console.error('Migration failed:', migrationError);
                        // Continue loading even if migration fails
                    }
                }

                // Load from Firebase if user is authenticated
                try {
                    const characters = await characterPersistenceService.loadUserCharacters(userId);

                    // Compute missing display names for loaded characters
                    const enrichedCharacters = characters.map(char => {
                        const enriched = { ...char };

                        // Compute backgroundDisplayName if missing
                        if (char.background && !char.backgroundDisplayName) {
                            const { getCustomBackgroundData } = require('../data/customBackgroundData');
                            const customBgData = getCustomBackgroundData(char.background.toLowerCase());
                            if (customBgData) {
                                enriched.backgroundDisplayName = customBgData.name;
                            }
                        }

                        // Compute raceDisplayName if missing
                        if ((char.race || char.subrace) && !char.raceDisplayName) {
                            if (char.race && char.subrace) {
                                const fullRaceData = getFullRaceData(char.race, char.subrace);
                                if (fullRaceData?.subrace?.name) {
                                    // Format as "Subrace (Race)" e.g. "Face Thief (Mimir)"
                                    enriched.raceDisplayName = `${fullRaceData.subrace.name} (${fullRaceData.race.name})`;
                                }
                            } else if (char.race) {
                                const raceData = getRaceData(char.race);
                                if (raceData?.name) {
                                    enriched.raceDisplayName = raceData.name;
                                }
                            }
                        }

                        return enriched;
                    });

                    set({ characters: enrichedCharacters, isLoading: false });
                    return enrichedCharacters;
                } catch (firebaseError) {
                    console.error('Error loading user characters:', firebaseError);
                    console.warn('Failed to load from Firebase, falling back to localStorage:', firebaseError);
                    // Fall back to localStorage if Firebase fails
                }
            }

            // Fallback to localStorage (for offline mode, guest users, or when Firebase fails)
            let characters = [];
            try {
                const storageKey = getCharactersStorageKey();
                const savedCharacters = localStorage.getItem(storageKey);
                characters = savedCharacters ? JSON.parse(savedCharacters) : [];
            } catch (localStorageError) {
                console.error('Error loading from localStorage:', localStorageError);
                characters = [];
            }

            // Ensure characters array is valid
            if (!Array.isArray(characters)) {
                console.warn('Characters data is not an array, resetting to empty array');
                characters = [];
            }

            // Compute missing display names for loaded characters
            characters = characters.map(char => {
                const enriched = { ...char };

                // Compute backgroundDisplayName if missing
                if (char.background && !char.backgroundDisplayName) {
                    const { getCustomBackgroundData } = require('../data/customBackgroundData');
                    const customBgData = getCustomBackgroundData(char.background.toLowerCase());
                    if (customBgData) {
                        enriched.backgroundDisplayName = customBgData.name;
                    }
                }

                // Compute raceDisplayName if missing
                if ((char.race || char.subrace) && !char.raceDisplayName) {
                    if (char.race && char.subrace) {
                        const fullRaceData = getFullRaceData(char.race, char.subrace);
                        if (fullRaceData?.subrace?.name) {
                            // Format as "Subrace (Race)" e.g. "Face Thief (Mimir)"
                            enriched.raceDisplayName = `${fullRaceData.subrace.name} (${fullRaceData.race.name})`;
                        }
                    } else if (char.race) {
                        const raceData = getRaceData(char.race);
                        if (raceData?.name) {
                            enriched.raceDisplayName = raceData.name;
                        }
                    }
                }

                return enriched;
            });

            set({ characters, isLoading: false });

            // If there's an active character, recalculate its resources
            const activeCharacterId = localStorage.getItem('mythrill-active-character');
            if (activeCharacterId && characters.length > 0) {
                const activeCharacter = characters.find(char => char.id === activeCharacterId);
                if (activeCharacter) {
                    get().loadCharacter(activeCharacterId);
                }
            }

            return characters;
        } catch (error) {
            console.error('Critical error loading characters:', error);
            set({ error: 'Failed to load characters', isLoading: false, characters: [] });
            return [];
        }
    },

    createCharacter: async (characterData) => {
        set({ isLoading: true, error: null });
        try {
            const userId = getCurrentUserId();

            // Prepare character data with proper structure
            const newCharacter = {
                id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                ...characterData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                // Ensure required fields exist - health/mana will be calculated based on stats
                resources: characterData.resources || {
                    health: { current: 50, max: 50 }, // Temporary values, will be recalculated
                    mana: { current: 25, max: 25 }, // Temporary values, will be recalculated
                    actionPoints: { current: 3, max: 3 }
                },
                inventory: characterData.inventory || {
                    items: [],
                    currency: { platinum: 0, gold: 0, silver: 0, copper: 0 },
                    encumbranceState: 'normal'
                },
                equipment: characterData.equipment || {
                    weapon: null,
                    armor: null,
                    shield: null,
                    accessories: []
                },
                spells: characterData.spells || [],
                experience: characterData.experience || 0
            };

            const useFirebase = shouldUseFirebase();
            const isGuest = isGuestUser();

            // CRITICAL FIX: For authenticated/dev users, try Firebase first
            // For guest users, only use localStorage
            if (userId && useFirebase && !isGuest) {
                // Save to Firebase if user is authenticated and Firebase is enabled
                try {
                    const characterId = await characterPersistenceService.createCharacter(newCharacter, userId);
                    newCharacter.id = characterId;
                } catch (firebaseError) {
                    console.error('Error creating character in Firebase:', firebaseError);
                    console.warn('Failed to save to Firebase, saving locally:', firebaseError);
                    // Continue with local save if Firebase fails
                }
            }

            const state = get();
            const updatedCharacters = [...state.characters, newCharacter];

            // CRITICAL FIX: Only save to localStorage if:
            // 1. Guest user (always use localStorage, but handle quota issues)
            // 2. Firebase save failed or Firebase not enabled
            // 3. As a backup for authenticated users
            const storageKey = getCharactersStorageKey();

            // Helper function to compress character data before saving
            const compressCharacterData = (char) => {
                const compressed = { ...char };

                // CRITICAL FIX: Remove or compress large image data
                // Base64 images can be hundreds of KB to MB in size
                if (compressed.lore?.characterImage) {
                    // Check if image is base64 and larger than 50KB
                    const imageData = compressed.lore.characterImage;
                    if (typeof imageData === 'string' && imageData.startsWith('data:image')) {
                        const sizeInBytes = (imageData.length * 3) / 4; // Approximate base64 size
                        if (sizeInBytes > 50 * 1024) { // Larger than 50KB
                            // Remove image for localStorage (keep URL reference if exists)
                            compressed.lore = {
                                ...compressed.lore,
                                characterImage: null,
                                imageTransformations: null
                            };
                        }
                    }
                }

                // Remove custom icons that might be large
                if (compressed.tokenSettings?.customIcon) {
                    const iconData = compressed.tokenSettings.customIcon;
                    if (typeof iconData === 'string' && iconData.startsWith('data:image')) {
                        compressed.tokenSettings = {
                            ...compressed.tokenSettings,
                            customIcon: null
                        };
                    }
                }

                return compressed;
            };

            // Compress characters before saving to reduce storage size
            const compressedCharacters = updatedCharacters.map(compressCharacterData);

            // For authenticated/dev users, only save to localStorage if Firebase failed
            // For guest users, always save to localStorage (but handle quota gracefully)
            if (isGuest || !useFirebase || !userId) {
                // CRITICAL FIX: For guest users, try to save but don't fail if quota exceeded
                // The character is still created in memory and will be available in the session
                try {
                    const result = localStorageManager.safeSetItem(storageKey, JSON.stringify(compressedCharacters));
                    if (!result.success) {
                        console.warn('⚠️ Failed to save characters to localStorage (quota exceeded):', result.error);
                        console.warn('⚠️ Character is still available in this session but may not persist after refresh');
                        // Still continue with the operation - character is in memory
                    }
                } catch (error) {
                    console.warn('⚠️ localStorage quota exceeded for guest character:', error);
                    console.warn('⚠️ Character is still available in this session but may not persist after refresh');
                    // Don't fail the operation - character is still in memory
                }
            } else {
                // For authenticated users with Firebase, only save to localStorage as backup
                // Try to save but don't fail if it doesn't work (Firebase is primary)
                try {
                    localStorageManager.safeSetItem(storageKey, JSON.stringify(compressedCharacters));
                } catch (error) {
                    console.warn('⚠️ Failed to save character backup to localStorage (Firebase is primary):', error);
                    // Don't fail the operation - Firebase is the primary storage
                }
            }

            // CRITICAL FIX: Ensure character is in the store even if localStorage save failed
            // This ensures the character appears in character management immediately
            set({
                characters: updatedCharacters,
                isLoading: false
            });

            // CRITICAL FIX: Don't reload characters immediately - it might overwrite the in-memory character
            // Instead, the character is already in the store and will appear in character management
            // Only reload if we successfully saved to localStorage/Firebase
            if (!isGuest && useFirebase && userId) {
                // For authenticated users with Firebase, reload to sync with Firebase
                setTimeout(async () => {
                    try {
                        await get().loadCharacters();
                    } catch (error) {
                        console.warn('⚠️ Failed to reload characters after creation:', error);
                    }
                }, 100);
            }

            // If this is the active character, recalculate stats to ensure proper health/mana
            if (newCharacter.id === get().currentCharacterId) {
                get().initializeCharacter();
            }

            return newCharacter;
        } catch (error) {
            console.error('Error creating character:', error);
            set({ error: 'Failed to create character', isLoading: false });
            throw error;
        }
    },

    updateCharacter: async (characterId, updates) => {
        set({ isLoading: true, error: null });
        try {
            const userId = getCurrentUserId();
            const state = get();

            const updatedCharacters = state.characters.map(char =>
                char.id === characterId
                    ? { ...char, ...updates, updatedAt: new Date().toISOString() }
                    : char
            );

            const updatedCharacter = updatedCharacters.find(char => char.id === characterId);

            if (userId && updatedCharacter) {
                // Store offline for sync when back online
                storeCharacterOffline(characterId, updatedCharacter);

                // Save to Firebase if user is authenticated
                try {
                    await characterPersistenceService.saveCharacter(updatedCharacter, userId);
                } catch (firebaseError) {
                    console.warn('Failed to save to Firebase, saving locally:', firebaseError);
                    // Continue with local save if Firebase fails
                }
            }

            // Always save to localStorage as backup with quota management
            const storageKey = getCharactersStorageKey();
            const result = localStorageManager.safeSetItem(storageKey, JSON.stringify(updatedCharacters));
            if (!result.success) {
                console.error('Failed to save characters to localStorage:', result.error);
                // Still continue with the operation, just log the error
            }

            set({
                characters: updatedCharacters,
                isLoading: false
            });

            return updatedCharacter;
        } catch (error) {
            console.error('Error updating character:', error);
            set({ error: 'Failed to update character', isLoading: false });
            throw error;
        }
    },

    deleteCharacter: async (characterId) => {
        set({ isLoading: true, error: null });
        try {
            const userId = getCurrentUserId();
            const state = get();

            if (userId) {
                // Delete from Firebase if user is authenticated
                try {
                    await characterPersistenceService.deleteCharacter(characterId, userId);
                } catch (firebaseError) {
                    console.warn('Failed to delete from Firebase, deleting locally:', firebaseError);
                    // Continue with local delete if Firebase fails
                }
            }

            const updatedCharacters = state.characters.filter(char => char.id !== characterId);

            // Save to localStorage with quota management
            const storageKey = getCharactersStorageKey();
            const result = localStorageManager.safeSetItem(storageKey, JSON.stringify(updatedCharacters));
            if (!result.success) {
                console.error('Failed to save characters to localStorage:', result.error);
                // Still continue with the operation, just log the error
            }

            set({
                characters: updatedCharacters,
                isLoading: false,
                // Clear current character if it was deleted
                currentCharacterId: state.currentCharacterId === characterId ? null : state.currentCharacterId
            });

            return true;
        } catch (error) {
            console.error('Error deleting character:', error);
            set({ error: 'Failed to delete character', isLoading: false });
            throw error;
        }
    },

    loadCharacter: (characterId) => {
        const state = get();
        const character = state.characters.find(char => char.id === characterId);

        if (character) {
            // Load character data into current character state
            set({
                currentCharacterId: characterId,
                name: character.name || 'Character Name',
                baseName: character.baseName || character.name || 'Character Name',
                race: character.race || '',
                subrace: character.subrace || '',
                raceDisplayName: character.raceDisplayName || '',
                class: character.class || 'Class',
                background: character.background || '',
                backgroundDisplayName: character.backgroundDisplayName || '',
                path: character.path || '',
                pathDisplayName: character.pathDisplayName || '',
                pathPassives: character.pathPassives || [],
                level: character.level || 1,
                experience: character.experience || 0,
                alignment: character.alignment || 'Neutral Good',
                stats: character.stats || {
                    constitution: 10,
                    strength: 10,
                    agility: 10,
                    intelligence: 10,
                    spirit: 10,
                    charisma: 10
                },
                // Store the current values from the character data, but max values will be recalculated
                health: {
                    current: (character.health?.current || character.resources?.health?.current || 45),
                    max: 50 // Temporary value, will be recalculated
                },
                mana: {
                    current: (character.mana?.current || character.resources?.mana?.current || 45),
                    max: 50 // Temporary value, will be recalculated
                },
                actionPoints: character.actionPoints || character.resources?.actionPoints || { current: 1, max: 3 },
                equipment: character.equipment || {},
                resistances: character.resistances || get().resistances,
                spellPower: character.spellPower || get().spellPower,
                lore: character.lore || get().lore,
                tokenSettings: character.tokenSettings || get().tokenSettings,
                skillRanks: character.skillRanks || {},
                class_spells: character.class_spells || { known_spells: [] },
                levelUpHistory: character.levelUpHistory || {},
                // Ensure inventory is preserved in character state
                inventory: character.inventory || {
                    items: [],
                    currency: { platinum: 0, gold: 0, silver: 0, copper: 0 },
                    encumbranceState: 'normal'
                }
            });

            // Load character's inventory into the inventory store
            try {
                const inventoryStore = require('./inventoryStore').default;
                const inventoryState = inventoryStore.getState();


                // Clear current inventory
                inventoryState.clearInventory();

                // Load character's items
                if (character.inventory?.items && Array.isArray(character.inventory.items)) {
                    character.inventory.items.forEach(item => {
                        inventoryState.addItem(item);
                    });
                }

                // Load character's currency
                if (character.inventory?.currency) {
                    inventoryState.updateCurrency(character.inventory.currency);
                }
            } catch (error) {
                console.error('Error loading character inventory:', error);
            }

            // Apply racial traits and resistances after loading
            if (character.race && character.subrace) {
                const raceData = getFullRaceData(character.race, character.subrace);
                if (raceData) {
                    // Only include actual spells in racialTraits (filter out passive stat modifiers)
                    const updatedRacialTraits = getRacialSpells(character.race, character.subrace);

                    // Apply passive stat modifiers (resistances, vulnerabilities, immunities) to character stats
                    const passiveModifiers = getRacialStatModifiers(character.race, character.subrace);

                    // Start with current resistances and immunities
                    let updatedResistances = { ...get().resistances };
                    let updatedImmunities = [...(get().immunities || [])];

                    // Initialize all damage type resistances if they don't exist
                    const damageTypes = ['fire', 'frost', 'lightning', 'acid', 'force', 'necrotic', 'radiant', 'poison', 'psychic', 'thunder', 'chaos', 'bludgeoning', 'piercing', 'slashing'];
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
                                // Handle stat modifiers (resistances)
                                if (effect.statModifier) {
                                    const statName = effect.statModifier.stat;
                                    const magnitude = effect.statModifier.magnitude;
                                    const magnitudeType = effect.statModifier.magnitudeType;

                                    // Map resistance stat names to resistance types
                                    const resistanceMap = {
                                        'frost_resistance': 'frost',
                                        'cold_resistance': 'frost', // Legacy support
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
                                    if (resistanceType && updatedResistances[resistanceType]) {
                                        // Convert percentage to resistance level and multiplier
                                        if (magnitudeType === 'percentage') {
                                            // Calculate multiplier: 50% resistance = 0.5 multiplier (takes 50% damage)
                                            const multiplier = Math.max(0, 1 - (magnitude / 100));

                                            if (magnitude >= 100) {
                                                updatedResistances[resistanceType].level = 0;
                                                updatedResistances[resistanceType].multiplier = 0.0;
                                                // Add to immunities array if not already there
                                                if (!updatedImmunities.includes(resistanceType)) {
                                                    updatedImmunities.push(resistanceType);
                                                }
                                            } else if (magnitude >= 50) {
                                                updatedResistances[resistanceType].level = 50;
                                                updatedResistances[resistanceType].multiplier = multiplier;
                                            } else if (magnitude >= 25) {
                                                updatedResistances[resistanceType].level = 75;
                                                updatedResistances[resistanceType].multiplier = multiplier;
                                            } else if (magnitude <= -50) {
                                                updatedResistances[resistanceType].level = 200;
                                                updatedResistances[resistanceType].multiplier = multiplier;
                                            } else if (magnitude <= -25) {
                                                updatedResistances[resistanceType].level = 150;
                                                updatedResistances[resistanceType].multiplier = multiplier;
                                            } else {
                                                // Normal resistance, but still set multiplier
                                                updatedResistances[resistanceType].level = 100;
                                                updatedResistances[resistanceType].multiplier = multiplier;
                                            }
                                        }
                                    }
                                }

                                // Handle statusEffect immunities (like Undead Resilience)
                                if (effect.statusEffect && effect.statusEffect.level === 'extreme') {
                                    const effectName = (effect.name || '').toLowerCase();
                                    const effectDesc = (effect.description || '').toLowerCase();

                                    // Check if this is an immunity effect
                                    if (effectName.includes('immunity') || effectName.includes('immune') ||
                                        effectDesc.includes('immune') || effectDesc.includes('immunity')) {

                                        // Map immunity names to damage types or conditions
                                        const immunityMap = {
                                            'poison': 'poison',
                                            'disease': 'disease',
                                            'exhaustion': 'exhaustion',
                                            'frost': 'frost',
                                            'cold': 'frost', // Legacy support
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

                                        // Try to match by name
                                        let immunityType = null;
                                        for (const [key, value] of Object.entries(immunityMap)) {
                                            if (effectName.includes(key) || effectDesc.includes(key)) {
                                                immunityType = value;
                                                break;
                                            }
                                        }

                                        // If it's a damage type immunity, add to both resistances and immunities
                                        if (immunityType && damageTypes.includes(immunityType)) {
                                            if (!updatedResistances[immunityType]) {
                                                updatedResistances[immunityType] = { level: 100, multiplier: 1.0 };
                                            }
                                            updatedResistances[immunityType].level = 0;
                                            updatedResistances[immunityType].multiplier = 0.0;
                                            if (!updatedImmunities.includes(immunityType)) {
                                                updatedImmunities.push(immunityType);
                                            }
                                        } else if (immunityType) {
                                            // For condition immunities (like exhaustion), just add to immunities
                                            if (!updatedImmunities.includes(immunityType)) {
                                                updatedImmunities.push(immunityType);
                                            }
                                        }
                                    }
                                }
                            });
                        }

                        // Handle debuff config (vulnerabilities)
                        if (modifier.debuffConfig?.effects) {
                            modifier.debuffConfig.effects.forEach(effect => {
                                if (effect.statusEffect?.vulnerabilityType) {
                                    const vulnerabilityType = effect.statusEffect.vulnerabilityType;
                                    const vulnerabilityPercent = effect.statusEffect.vulnerabilityPercent || 0;

                                    if (updatedResistances[vulnerabilityType]) {
                                        // Convert vulnerability percentage to resistance level
                                        if (vulnerabilityPercent >= 100) {
                                            updatedResistances[vulnerabilityType].level = 'vulnerable';
                                        } else if (vulnerabilityPercent >= 50) {
                                            updatedResistances[vulnerabilityType].level = 'exposed';
                                        }
                                    }
                                }
                            });
                        }
                    });

                    // Update state with racial traits, resistances, and immunities
                    set({
                        racialTraits: updatedRacialTraits,
                        racialLanguages: raceData.combinedTraits.languages,
                        racialSpeed: raceData.combinedTraits.speed,
                        resistances: updatedResistances,
                        immunities: [...new Set(updatedImmunities)] // Remove duplicates
                    });
                }
            }

            // Recalculate derived stats
            get().initializeCharacter();

            // Force recalculation of HP/MP based on current stats
            get().recalculateResources();


            return character;
        }

        return null;
    },

    // Set active character and persist the selection
    setActiveCharacter: async (characterId) => {
        const state = get();
        const character = state.characters.find(char => char.id === characterId);

        if (character) {
            // Load the character data
            get().loadCharacter(characterId);

            // Persist active character selection
            localStorage.setItem('mythrill-active-character', characterId);

            // Update party member if in a party
            try {
                const partyStore = require('./partyStore').default;
                const partyState = partyStore.getState();

                if (partyState.isInParty) {
                    const currentMember = partyState.partyMembers.find(m => m.id === 'current-player');
                    if (currentMember) {
                        // Get proper race display name
                        let raceDisplayName = character.raceDisplayName;
                        if (!raceDisplayName && character.race && character.subrace) {
                            const raceData = getFullRaceData(character.race, character.subrace);
                            if (raceData) {
                                // Format as "Subrace (Race)" e.g. "Face Thief (Mimir)"
                                raceDisplayName = `${raceData.subrace.name} (${raceData.race.name})`;
                            }
                        } else if (!raceDisplayName && character.race) {
                            const raceData = getRaceData(character.race);
                            if (raceData) {
                                raceDisplayName = raceData.name;
                            }
                        }

                        // Get proper background display name - ONLY custom backgrounds are valid
                        let backgroundDisplayName = '';
                        if (character.background) {
                            // Only check custom backgrounds (Mystic, Zealot, Trickster, Harrow, Arcanist, Hexer, Reaver, Mercenary, Sentinel)
                            const { getCustomBackgroundData } = require('../data/customBackgroundData');
                            const customBgData = getCustomBackgroundData(character.background.toLowerCase());
                            if (customBgData) {
                                backgroundDisplayName = customBgData.name;
                            }
                            // If not found, leave empty (invalid background)
                        }

                        partyStore.getState().updatePartyMember('current-player', {
                            name: character.name,
                            character: {
                                ...currentMember.character,
                                race: character.race,
                                subrace: character.subrace,
                                raceDisplayName: raceDisplayName,
                                class: character.class,
                                level: character.level,
                                background: character.background,
                                backgroundDisplayName: backgroundDisplayName,
                                path: character.path,
                                pathDisplayName: character.pathDisplayName
                            }
                        });
                    }
                }
            } catch (error) {
                console.warn('Could not update party member:', error);
            }

            // Update presence data if user is online
            try {
                const userId = getCurrentUserId();
                if (userId && shouldUseFirebase()) {
                    const presenceService = (await import('../services/firebase/presenceService')).default;
                    await presenceService.updateCharacterData(userId, {
                        id: character.id,
                        name: character.name,
                        level: character.level,
                        class: character.class,
                        background: character.background,
                        race: character.race,
                        subrace: character.subrace
                    });
                }
            } catch (error) {
                console.warn('Could not update presence data:', error);
            }

            return character;
        } else {
            console.error(`Character not found: ${characterId}`);

            // Clear active character and inventory when character not found
            get().clearActiveCharacter();
            return null;
        }
    },

    // Force recalculation of health and mana based on current stats
    recalculateResources: () => {
        const state = get();

        // Apply racial modifiers to get effective stats
        const effectiveStats = state.race && state.subrace
            ? applyRacialModifiers(state.stats, state.race, state.subrace)
            : state.stats;

        // Calculate equipment bonuses
        const equipmentBonuses = calculateEquipmentBonuses(state.equipment || {});

        // Apply equipment bonuses to stats
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

        // Get encumbrance state
        const encumbranceState = state.inventory?.encumbranceState || 'normal';

        // Calculate derived stats
        const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState, state.exhaustionLevel || 0);

        // Calculate correct max values
        const newMaxHealth = Math.round(derivedStats.maxHealth);
        const newMaxMana = Math.round(derivedStats.maxMana);

        // Update health and mana with recalculated max values
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

    // Get the currently active character
    getActiveCharacter: () => {
        const state = get();


        if (state.currentCharacterId) {
            const character = state.characters.find(char => char.id === state.currentCharacterId);
            if (character) {
                return character;
            } else {
                console.warn(`Active character ID ${state.currentCharacterId} not found in characters array`);
                // Clear invalid active character ID
                localStorage.removeItem('mythrill-active-character');
                set({ currentCharacterId: null });
            }
        }
        return null;
    },

    // Load active character from localStorage on app initialization
    loadActiveCharacter: async () => {
        try {
            // First ensure characters are loaded
            const characters = await get().loadCharacters();

            // Then check for active character
            const activeCharacterId = localStorage.getItem('mythrill-active-character');

            if (activeCharacterId) {
                const character = await get().setActiveCharacter(activeCharacterId);
                if (character) {
                    return character;
                } else {
                    // Character not found, clear the stored ID
                    localStorage.removeItem('mythrill-active-character');
                    console.warn('Stored active character not found, cleared selection');
                }
            }

        } catch (error) {
            console.error('Error loading active character:', error);
            // Try to provide a fallback by checking localStorage directly
            try {
                const storageKey = getCharactersStorageKey();
                const savedCharacters = localStorage.getItem(storageKey);
                const activeCharacterId = localStorage.getItem('mythrill-active-character');

                if (savedCharacters && activeCharacterId) {
                    const characters = JSON.parse(savedCharacters);
                    const character = characters.find(char => char.id === activeCharacterId);

                    if (character) {
                        // Manually set the character data without going through the full loading process
                        set({
                            currentCharacterId: character.id,
                            characters: characters,
                            name: character.name || 'Character Name',
                            baseName: character.baseName || character.name || 'Character Name',
                            race: character.race || '',
                            subrace: character.subrace || '',
                            class: character.class || 'Class',
                            level: character.level || 1
                        });
                        return character;
                    }
                }
            } catch (fallbackError) {
                console.error('Fallback character loading also failed:', fallbackError);
            }
        }
        return null;
    },

    // Clear active character selection
    clearActiveCharacter: () => {
        localStorage.removeItem('mythrill-active-character');
        set({ currentCharacterId: null });

        // Clear inventory when no character is active
        try {
            const inventoryStore = require('./inventoryStore').default;
            const inventoryState = inventoryStore.getState();
            inventoryState.clearInventory();
            // Clear currency as well
            inventoryState.updateCurrency({ platinum: 0, gold: 0, silver: 0, copper: 0 });
        } catch (error) {
            console.warn('Could not clear inventory:', error);
        }
    },

    saveCurrentCharacter: () => {
        const state = get();
        if (!state.currentCharacterId) return;

        // Get current inventory from inventory store
        let inventoryData = {
            items: [],
            currency: { platinum: 0, gold: 0, silver: 0, copper: 0 },
            encumbranceState: 'normal'
        };

        try {
            const inventoryStore = require('./inventoryStore').default;
            const inventoryState = inventoryStore.getState();
            inventoryData = {
                items: inventoryState.items || [],
                currency: inventoryState.currency || { platinum: 0, gold: 0, silver: 0, copper: 0 },
                encumbranceState: inventoryState.encumbranceState || 'normal'
            };
        } catch (error) {
            console.warn('Could not get inventory data:', error);
        }

        const characterData = {
            name: state.name,
            baseName: state.baseName,
            race: state.race,
            subrace: state.subrace,
            class: state.class,
            level: state.level,
            experience: state.experience,
            alignment: state.alignment,
            stats: state.stats,
            health: state.health,
            mana: state.mana,
            actionPoints: state.actionPoints,
            equipment: state.equipment,
            resistances: state.resistances,
            spellPower: state.spellPower,
            lore: state.lore,
            tokenSettings: state.tokenSettings,
            skillRanks: state.skillRanks,
            class_spells: state.class_spells, // Include class spells
            levelUpHistory: state.levelUpHistory, // Include level-up history
            inventory: inventoryData, // Include inventory data
            updatedAt: new Date().toISOString()
        };

        get().updateCharacter(state.currentCharacterId, characterData);
    },

    // Ensure starter spells are assigned for the given class when none are known
    ensureClassStarterSpells: async (className) => {
        const state = get();
        try {
            if (!className) return false;
            const known = state.class_spells?.known_spells || [];
            // Only assign if no spells are known OR if we have fewer than 3 level 1 spells
            // This allows us to fill in missing spells
            if (known.length >= 3) {
                // Check if we have at least 3 level 1 spells
                try {
                    const { ALL_CLASS_SPELLS } = require('../data/classSpellGenerator');
                    const available = ALL_CLASS_SPELLS[className] || [];
                    const level1SpellIds = new Set(available.filter(s => (s.level || 1) === 1).map(s => s.id));
                    const knownLevel1Count = known.filter(id => level1SpellIds.has(id)).length;
                    if (knownLevel1Count >= 3) {
                        return false; // Already have 3+ level 1 spells
                    }
                } catch (e) {
                    // If we can't check, proceed with assignment
                }
            }

            // Ensure character is level 1 if not set
            if (!state.level || state.level < 1) {
                set({ level: 1 });
            }

            // Prefer selecting from the actually loaded/generated class spells
            try {
                const { ALL_CLASS_SPELLS } = require('../data/classSpellGenerator');
                const available = ALL_CLASS_SPELLS[className] || [];

                // Filter to level 1 spells only (or spells without level, which default to 1)
                const level1Spells = available.filter(s => {
                    const spellLevel = s.level || 1;
                    return spellLevel === 1;
                });


                if (level1Spells.length > 0) {
                    // Get currently known level 1 spells
                    const knownLevel1SpellIds = new Set(known.filter(id =>
                        level1Spells.some(s => s.id === id)
                    ));

                    // If we already have 3+ level 1 spells, don't reassign
                    if (knownLevel1SpellIds.size >= 3) {
                        return false;
                    }

                    // Filter out already known spells
                    const availableLevel1Spells = level1Spells.filter(s => !known.includes(s.id));

                    let starter = [];
                    if (className === 'Chaos Weaver') {
                        // Prefer spells that showcase chaos rollable tables
                        const withTables = availableLevel1Spells.filter(s => (s.rollableTable && s.rollableTable.enabled) || (s.mechanicsConfig && s.mechanicsConfig.rollableTable && s.mechanicsConfig.rollableTable.enabled));
                        const ec = availableLevel1Spells.filter(s => s.specialization === 'entropy_control');
                        const rb = availableLevel1Spells.filter(s => s.specialization === 'reality_bending');
                        const cd = availableLevel1Spells.filter(s => s.specialization === 'chaos_dice');
                        starter = (withTables.slice(0, 3).length === 3
                            ? withTables.slice(0, 3)
                            : [...cd, ...ec, ...rb].filter(s => withTables.includes(s) || s.rollableTable?.enabled).slice(0, 3));
                    } else if (className === 'Fate Weaver') {
                        // Prefer card-based spells with rollable tables
                        const withCards = availableLevel1Spells.filter(s => (s.resolution === 'CARDS') || (s.mechanicsConfig?.cards) || (s.rollableTable?.resolutionType === 'CARDS'));
                        const withTables = withCards.filter(s => s.rollableTable?.enabled);
                        starter = (withTables.slice(0, 3).length === 3 ? withTables.slice(0, 3) : withCards.slice(0, 3));
                    } else {
                        // For all other classes, randomly select from available level 1 spells
                        const needed = Math.min(3 - knownLevel1SpellIds.size, availableLevel1Spells.length);
                        if (needed > 0) {
                            const shuffled = [...availableLevel1Spells].sort(() => Math.random() - 0.5);
                            starter = shuffled.slice(0, needed);
                        }
                    }

                    if (starter.length > 0) {
                        const starterIds = starter.map(s => s.id).filter(id => id);
                        // Merge with existing known spells (keep non-level-1 spells)
                        const existingNonLevel1 = known.filter(id =>
                            !level1Spells.some(s => s.id === id)
                        );
                        const updatedKnownSpells = [...existingNonLevel1, ...starterIds];

                        set({
                            class_spells: {
                                ...state.class_spells,
                                known_spells: updatedKnownSpells
                            }
                        });
                        return true;
                    } else if (knownLevel1SpellIds.size < 3) {
                        console.warn(`⚠️ Could not assign enough level 1 spells for ${className}. Have ${knownLevel1SpellIds.size}, need 3, but only ${availableLevel1Spells.length} available.`);
                    }
                } else {
                    console.warn(`⚠️ No level 1 spells found in ALL_CLASS_SPELLS for ${className}`);
                }
            } catch (e) {
                console.warn('Could not load from ALL_CLASS_SPELLS, falling back to spellPools:', e);
            }

            // Fall back to classData spell pools if generator unavailable or no spells found
            try {
                // Helper function to get class data by name
                const getClassData = (name) => {
                    const classDataMap = {
                        'Arcanoneer': () => require('../data/classes/arcanoneerData').ARCANONEER_DATA,
                        'Berserker': () => require('../data/classes/berserkerData').BERSERKER_DATA,
                        'Bladedancer': () => require('../data/classes/bladedancerData').BLADEDANCER_DATA,
                        'Chaos Weaver': () => require('../data/classes/chaosWeaverData').CHAOS_WEAVER_DATA,
                        'Chronarch': () => require('../data/classes/chronarchData').CHRONARCH_DATA,
                        'Covenbane': () => require('../data/classes/covenbaneData').COVENBANE_DATA,
                        'Deathcaller': () => require('../data/classes/deathcallerData').DEATHCALLER_DATA,
                        'Dreadnaught': () => require('../data/classes/dreadnaughtData').DREADNAUGHT_DATA,
                        'Exorcist': () => require('../data/classes/exorcistData').EXORCIST_DATA,
                        'False Prophet': () => require('../data/classes/falseProphetData').FALSE_PROPHET_DATA,
                        'Fate Weaver': () => require('../data/classes/fateWeaverData').FATE_WEAVER_DATA,
                        'Formbender': () => require('../data/classes/formbenderData').FORMBENDER_DATA,
                        'Gambler': () => require('../data/classes/gamblerData').GAMBLER_DATA,
                        'Huntress': () => require('../data/classes/huntressData').HUNTRESS_DATA,
                        'Inscriptor': () => require('../data/classes/inscriptorData').INSCRIPTOR_DATA,
                        'Lichborne': () => require('../data/classes/lichborneData').LICHBORNE_DATA,
                        'Lunarch': () => require('../data/classes/lunarchData').LUNARCH_DATA,
                        'Martyr': () => require('../data/classes/martyrData').MARTYR_DATA,
                        'Minstrel': () => require('../data/classes/minstrelData').MINSTREL_DATA,
                        'Oracle': () => require('../data/classes/oracleData').ORACLE_DATA,
                        'Plaguebringer': () => require('../data/classes/plaguebringerData').PLAGUEBRINGER_DATA,
                        'Primalist': () => require('../data/classes/primalistData').PRIMALIST_DATA,
                        'Pyrofiend': () => require('../data/classes/pyrofiendData').PYROFIEND_DATA,
                        'Spellguard': () => require('../data/classes/spellguardData').SPELLGUARD_DATA,
                        'Titan': () => require('../data/classes/titanData').TITAN_DATA,
                        'Toxicologist': () => require('../data/classes/toxicologistData').TOXICOLOGIST_DATA,
                        'Warden': () => require('../data/classes/wardenData').WARDEN_DATA,
                        'Witch Doctor': () => require('../data/classes/witchDoctorData').WITCH_DOCTOR_DATA
                    };
                    const loader = classDataMap[name];
                    if (loader) {
                        try {
                            return loader();
                        } catch (err) {
                            console.warn(`Failed to load class data for ${name}:`, err);
                            return null;
                        }
                    }
                    return null;
                };

                // Helper function to get level 1 spell IDs from class data
                const getLevel1SpellIds = (classData) => {
                    if (!classData) return [];

                    // First try spellPools[1]
                    if (classData.spellPools && classData.spellPools[1]) {
                        return classData.spellPools[1];
                    }

                    // Fallback: filter spells/exampleSpells array for level 1 spells
                    const spellsArray = classData.spells || classData.exampleSpells || [];
                    if (Array.isArray(spellsArray) && spellsArray.length > 0) {
                        return spellsArray
                            .filter(spell => spell.level === 1 || !spell.level) // Include spells without level (default to 1)
                            .map(spell => spell.id)
                            .filter(id => id); // Remove any undefined/null IDs
                    }

                    return [];
                };

                const classData = getClassData(className);
                const level1SpellIds = getLevel1SpellIds(classData);

                if (level1SpellIds.length > 0) {
                    // Try to match spell IDs with ALL_CLASS_SPELLS to ensure they exist
                    let validSpellIds = level1SpellIds;
                    try {
                        const { ALL_CLASS_SPELLS } = require('../data/classSpellGenerator');
                        const available = ALL_CLASS_SPELLS[className] || [];
                        const availableIds = new Set(available.map(s => s.id));
                        validSpellIds = level1SpellIds.filter(id => availableIds.has(id));

                        // If no matches found, use original IDs (might be a new class or different format)
                        if (validSpellIds.length === 0) {
                            console.warn(`⚠️ No matching spell IDs found in ALL_CLASS_SPELLS for ${className}, using classData IDs directly`);
                            validSpellIds = level1SpellIds;
                        }
                    } catch (e) {
                        console.warn('Could not cross-reference with ALL_CLASS_SPELLS in fallback:', e);
                    }

                    const shuffled = [...validSpellIds].sort(() => Math.random() - 0.5);
                    const selectionFallback = shuffled.slice(0, Math.min(3, validSpellIds.length));
                    set({
                        class_spells: {
                            ...state.class_spells,
                            known_spells: selectionFallback
                        }
                    });
                    return true;
                }
            } catch (e) {
                console.warn('Fallback to spellPools also failed:', e);
            }
        } catch (e) {
            console.warn('ensureClassStarterSpells failed:', e);
        }
        return false;
    },

    clearError: () => set({ error: null }),

    // System health check and initialization
    initializeCharacterSystem: async () => {
        try {
            // Load characters first
            const characters = await get().loadCharacters();

            // Check for active character
            const activeCharacter = await get().loadActiveCharacter();

            // Provide helpful feedback
            if (characters.length === 0) {
                set({ error: 'Welcome! Create your first character to get started.' });
            } else if (!activeCharacter) {
                const characterNames = characters.map(c => c.name).join(', ');
                set({ error: `Please activate a character to continue. Available: ${characterNames}` });
            } else {
                set({ error: null });
            }

            return {
                charactersCount: characters.length,
                activeCharacter,
                isReady: !!activeCharacter
            };
        } catch (error) {
            console.error('Character system initialization failed:', error);
            set({ error: 'Failed to initialize character system. Please refresh and try again.' });
            return {
                charactersCount: 0,
                activeCharacter: null,
                isReady: false,
                error: error.message
            };
        }
    },

    // Debug function for troubleshooting (available in console)
    debugCharacterSystem: () => {
        const state = get();
        const userId = getCurrentUserId();
        const useFirebase = shouldUseFirebase();

        const debugInfo = {
            // Character data
            charactersCount: state.characters.length,
            currentCharacterId: state.currentCharacterId,
            activeCharacterName: state.currentCharacterId ?
                state.characters.find(c => c.id === state.currentCharacterId)?.name : 'None',

            // Authentication
            userId: userId || 'None',
            useFirebase,

            // Storage
            localStorageCharacters: (() => {
                try {
                    const storageKey = getCharactersStorageKey();
                    const saved = localStorage.getItem(storageKey);
                    return saved ? JSON.parse(saved).length : 0;
                } catch { return 'Error reading'; }
            })(),
            localStorageActiveId: localStorage.getItem('mythrill-active-character'),

            // Environment
            hostname: window.location.hostname,
            nodeEnv: process.env.NODE_ENV,

            // State
            isLoading: state.isLoading,
            error: state.error
        };

        // Debug info available via return value


        return debugInfo;
    },

    // Character Session Management for Multiplayer
    startCharacterSession: async (characterId, roomId = null) => {
        try {
            const userId = getCurrentUserId();
            if (!userId) {
                // Still create a local session for offline mode
                const localSessionId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                return localSessionId;
            }

            const sessionId = await characterSessionService.startSession(characterId, userId, roomId);
            return sessionId;
        } catch (error) {
            console.error('Error starting character session:', error);
            // Create a fallback local session
            const fallbackSessionId = `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            return fallbackSessionId;
        }
    },

    endCharacterSession: async (characterId) => {
        try {
            const userId = getCurrentUserId();
            if (!userId) {
                console.warn('No user authenticated, cannot end character session');
                return false;
            }

            const success = await characterSessionService.endSession(characterId, userId);
            if (success) {
                // Reload character data to reflect session changes
                await get().loadCharacters();
            }
            return success;
        } catch (error) {
            console.error('Error ending character session:', error);
            return false;
        }
    },

    recordCharacterChange: async (characterId, changeType, changeData) => {
        try {
            const success = await characterSessionService.recordChange(characterId, changeType, changeData);
            return success;
        } catch (error) {
            console.error('Error recording character change:', error);
            return false;
        }
    },

    // Resource management with character persistence
    // Recalculate resistances based on current health and passive conditions
    recalculateResistancesFromPassives: () => {
        const state = get();
        if (!state.race || !state.subrace) return;

        const { getRacialStatModifiers } = require('../utils/raceDisciplineSpellUtils');
        const passiveModifiers = getRacialStatModifiers(state.race, state.subrace);

        let updatedResistances = { ...state.resistances };
        let updatedImmunities = [...(state.immunities || [])];

        // Initialize all damage type resistances if they don't exist
        const damageTypes = ['fire', 'frost', 'lightning', 'acid', 'force', 'necrotic', 'radiant', 'poison', 'psychic', 'thunder', 'chaos', 'bludgeoning', 'piercing', 'slashing'];
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
                                'acid_resistance': 'acid',
                                'force_resistance': 'force',
                                'necrotic_resistance': 'necrotic',
                                'radiant_resistance': 'radiant',
                                'poison_resistance': 'poison',
                                'psychic_resistance': 'psychic',
                                'thunder_resistance': 'thunder'
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

    updateHealth: (newHealth) => {
        set(state => {
            const updatedHealth = { ...state.health, ...newHealth };

            // Record character change for persistence
            if (state.currentCharacterId) {
                get().recordCharacterChange(state.currentCharacterId, 'resource_change', {
                    type: 'health',
                    value: updatedHealth,
                    timestamp: new Date()
                });

                // Save the character with updated health
                setTimeout(() => {
                    get().saveCurrentCharacter();
                }, 100); // Small delay to ensure state is updated
            }

            // Recalculate resistances if health changed (for conditional passives)
            setTimeout(() => {
                get().recalculateResistancesFromPassives();
            }, 0);

            return { health: updatedHealth };
        });
    },

    updateMana: (newMana) => {
        set(state => {
            const updatedMana = { ...state.mana, ...newMana };

            // Record character change for persistence
            if (state.currentCharacterId) {
                get().recordCharacterChange(state.currentCharacterId, 'resource_change', {
                    type: 'mana',
                    value: updatedMana,
                    timestamp: new Date()
                });

                // Save the character with updated mana
                setTimeout(() => {
                    get().saveCurrentCharacter();
                }, 100); // Small delay to ensure state is updated
            }

            return { mana: updatedMana };
        });
    },

    updateActionPoints: (newActionPoints) => {
        set(state => {
            const updatedActionPoints = { ...state.actionPoints, ...newActionPoints };

            // Record character change for persistence
            if (state.currentCharacterId) {
                get().recordCharacterChange(state.currentCharacterId, 'resource_change', {
                    type: 'actionPoints',
                    value: updatedActionPoints,
                    timestamp: new Date()
                });
            }

            return { actionPoints: updatedActionPoints };
        });
    },

    // Level and experience management with persistence
    updateExperience: (newExperience) => {
        const { getLevelFromXP, checkLevelUp, calculateLevelUpHP } = require('../utils/experienceUtils');

        set(state => {
            const oldXP = state.experience || 0;
            const experienceGained = newExperience - oldXP;

            // Record character change for persistence
            if (state.currentCharacterId && experienceGained > 0) {
                get().recordCharacterChange(state.currentCharacterId, 'experience_gain', {
                    amount: experienceGained,
                    newTotal: newExperience,
                    timestamp: new Date()
                });
            }

            // Check for level up
            const levelUpInfo = checkLevelUp(oldXP, newExperience);

            if (levelUpInfo.didLevelUp) {

                // Record level up
                if (state.currentCharacterId) {
                    get().recordCharacterChange(state.currentCharacterId, 'level_up', {
                        oldLevel: levelUpInfo.oldLevel,
                        newLevel: levelUpInfo.newLevel,
                        timestamp: new Date()
                    });
                }

                // Trigger level-up modal instead of auto-applying bonuses
                return {
                    experience: newExperience,
                    level: levelUpInfo.newLevel,
                    showLevelUpModal: true,
                    pendingLevelUpInfo: {
                        newLevel: levelUpInfo.newLevel,
                        oldLevel: levelUpInfo.oldLevel
                    }
                };
            }

            return { experience: newExperience };
        });
    },

    // Award experience (adds to current XP, can be negative to remove XP)
    awardExperience: (xpAmount) => {
        const state = get();
        const currentXP = state.experience || 0;
        const newXP = Math.max(0, currentXP + xpAmount); // Don't allow negative XP

        get().updateExperience(newXP);
    },

    // Helper function to get spell IDs for a specific level from class data
    getSpellIdsForLevel: (classData, level) => {
        if (!classData) return [];

        // First try spellPools (if class has spellPools structure)
        if (classData.spellPools && classData.spellPools[level]) {
            return classData.spellPools[level];
        }

        // Fallback: filter spells/exampleSpells array for spells of this level
        const spellsArray = classData.spells || classData.exampleSpells || [];
        if (Array.isArray(spellsArray) && spellsArray.length > 0) {
            return spellsArray
                .filter(spell => (spell.level === level || (level === 1 && !spell.level)))
                .map(spell => spell.id)
                .filter(id => id); // Remove any undefined/null IDs
        }

        return [];
    },

    // Helper function to assign spells based on character level
    assignSpellsForLevel: (targetLevel, characterClass) => {
        const state = get();
        if (!characterClass) return;

        // Helper function to get class data by name
        const getClassData = (name) => {
            const classDataMap = {
                'Arcanoneer': () => require('../data/classes/arcanoneerData').ARCANONEER_DATA,
                'Berserker': () => require('../data/classes/berserkerData').BERSERKER_DATA,
                'Bladedancer': () => require('../data/classes/bladedancerData').BLADEDANCER_DATA,
                'Chaos Weaver': () => require('../data/classes/chaosWeaverData').CHAOS_WEAVER_DATA,
                'Chronarch': () => require('../data/classes/chronarchData').CHRONARCH_DATA,
                'Covenbane': () => require('../data/classes/covenbaneData').COVENBANE_DATA,
                'Deathcaller': () => require('../data/classes/deathcallerData').DEATHCALLER_DATA,
                'Dreadnaught': () => require('../data/classes/dreadnaughtData').DREADNAUGHT_DATA,
                'Exorcist': () => require('../data/classes/exorcistData').EXORCIST_DATA,
                'False Prophet': () => require('../data/classes/falseProphetData').FALSE_PROPHET_DATA,
                'Fate Weaver': () => require('../data/classes/fateWeaverData').FATE_WEAVER_DATA,
                'Formbender': () => require('../data/classes/formbenderData').FORMBENDER_DATA,
                'Gambler': () => require('../data/classes/gamblerData').GAMBLER_DATA,
                'Huntress': () => require('../data/classes/huntressData').HUNTRESS_DATA,
                'Inscriptor': () => require('../data/classes/inscriptorData').INSCRIPTOR_DATA,
                'Lichborne': () => require('../data/classes/lichborneData').LICHBORNE_DATA,
                'Lunarch': () => require('../data/classes/lunarchData').LUNARCH_DATA,
                'Martyr': () => require('../data/classes/martyrData').MARTYR_DATA,
                'Minstrel': () => require('../data/classes/minstrelData').MINSTREL_DATA,
                'Oracle': () => require('../data/classes/oracleData').ORACLE_DATA,
                'Plaguebringer': () => require('../data/classes/plaguebringerData').PLAGUEBRINGER_DATA,
                'Primalist': () => require('../data/classes/primalistData').PRIMALIST_DATA,
                'Pyrofiend': () => require('../data/classes/pyrofiendData').PYROFIEND_DATA,
                'Spellguard': () => require('../data/classes/spellguardData').SPELLGUARD_DATA,
                'Titan': () => require('../data/classes/titanData').TITAN_DATA,
                'Toxicologist': () => require('../data/classes/toxicologistData').TOXICOLOGIST_DATA,
                'Warden': () => require('../data/classes/wardenData').WARDEN_DATA,
                'Witch Doctor': () => require('../data/classes/witchDoctorData').WITCH_DOCTOR_DATA
            };
            const loader = classDataMap[name];
            if (loader) {
                try {
                    return loader();
                } catch (e) {
                    console.warn(`Failed to load class data for ${name}:`, e);
                    return null;
                }
            }
            return null;
        };

        // Import class data dynamically
        const classData = getClassData(characterClass);
        if (!classData) return;

        // Try to get spells from ALL_CLASS_SPELLS first (to ensure IDs match)
        let allClassSpells = [];
        try {
            const { ALL_CLASS_SPELLS } = require('../data/classSpellGenerator');
            allClassSpells = ALL_CLASS_SPELLS[characterClass] || [];
        } catch (e) {
            console.warn('Could not load ALL_CLASS_SPELLS, using classData directly:', e);
        }

        const currentKnownSpells = state.class_spells?.known_spells || [];
        let spellsToAdd = [];

        // Always ensure 3 level 1 spells
        if (targetLevel >= 1) {
            // Get level 1 spell IDs from class data
            const level1SpellIds = get().getSpellIdsForLevel(classData, 1);

            // If we have ALL_CLASS_SPELLS, filter to only use IDs that exist there
            const validLevel1SpellIds = allClassSpells.length > 0
                ? level1SpellIds.filter(id => allClassSpells.some(s => s.id === id))
                : level1SpellIds;

            const currentLevel1Spells = currentKnownSpells.filter(spellId =>
                validLevel1SpellIds.includes(spellId)
            );

            if (currentLevel1Spells.length < 3) {
                const availableLevel1Spells = validLevel1SpellIds.filter(id =>
                    !currentKnownSpells.includes(id)
                );
                const shuffled = [...availableLevel1Spells].sort(() => Math.random() - 0.5);
                const needed = Math.min(3 - currentLevel1Spells.length, shuffled.length);
                spellsToAdd.push(...shuffled.slice(0, needed));
            }
        }

        // Add 1 spell from each level 2 to targetLevel
        for (let level = 2; level <= targetLevel; level++) {
            // Get spell IDs for this level
            const levelSpellIds = get().getSpellIdsForLevel(classData, level);

            // If we have ALL_CLASS_SPELLS, filter to only use IDs that exist there
            const validLevelSpellIds = allClassSpells.length > 0
                ? levelSpellIds.filter(id => allClassSpells.some(s => s.id === id))
                : levelSpellIds;

            const currentLevelSpells = currentKnownSpells.filter(spellId =>
                validLevelSpellIds.includes(spellId)
            );

            if (currentLevelSpells.length === 0 && validLevelSpellIds.length > 0) {
                // No spells from this level yet, add one randomly
                const availableSpells = validLevelSpellIds.filter(id =>
                    !currentKnownSpells.includes(id)
                );
                if (availableSpells.length > 0) {
                    const randomSpell = availableSpells[Math.floor(Math.random() * availableSpells.length)];
                    spellsToAdd.push(randomSpell);
                }
            }
        }

        // Add the new spells to known_spells
        if (spellsToAdd.length > 0) {
            const updatedKnownSpells = [...currentKnownSpells, ...spellsToAdd];

            set({
                class_spells: {
                    ...state.class_spells,
                    known_spells: updatedKnownSpells
                }
            });

        }
    },

    // Adjust level directly (adds or removes levels)
    adjustLevel: (levelChange) => {
        const { getXPForLevel } = require('../utils/experienceUtils');
        const state = get();
        const currentLevel = state.level || 1;
        const newLevel = Math.max(1, Math.min(20, currentLevel + levelChange)); // Clamp between 1-20

        if (newLevel === currentLevel) {
            return;
        }

        // If leveling down, reverse bonuses from lost levels
        if (newLevel < currentLevel) {
            for (let level = currentLevel; level > newLevel; level--) {
                get().reverseLevelUpBonus(level);
            }
        }

        // Get the XP required for the new level
        const newXP = getXPForLevel(newLevel);

        // Update both level and XP
        set({ level: newLevel });

        // Only trigger updateExperience if leveling up (to avoid triggering modal when manually adjusting)
        if (levelChange > 0) {
            get().updateExperience(newXP);
        } else {
            // Just set XP without triggering level-up check
            set({ experience: newXP });
        }

        // Auto-assign spells based on new level
        const characterClass = state.characterClass;
        if (characterClass) {
            get().assignSpellsForLevel(newLevel, characterClass);
        }

        // Record character change for persistence
        if (state.currentCharacterId && newLevel !== currentLevel) {
            get().recordCharacterChange(state.currentCharacterId, 'stat_change', {
                stat: 'level',
                value: newLevel,
                previousValue: currentLevel,
                timestamp: new Date()
            });
        }

        // Save character after level adjustment
        setTimeout(() => {
            get().saveCurrentCharacter();
        }, 100); // Small delay to ensure state is updated
    },

    updateLevel: (newLevel) => {
        set(state => {
            const oldLevel = state.level;

            // Record character change for persistence
            if (state.currentCharacterId && newLevel !== oldLevel) {
                get().recordCharacterChange(state.currentCharacterId, 'stat_change', {
                    stat: 'level',
                    value: newLevel,
                    previousValue: oldLevel,
                    timestamp: new Date()
                });
            }

            return { level: newLevel };
        });

        // Auto-assign spells based on new level
        const state = get();
        const characterClass = state.characterClass;
        if (characterClass) {
            get().assignSpellsForLevel(newLevel, characterClass);
        }
    },

    updateExhaustionLevel: (newExhaustionLevel) => {
        set(state => {
            // Record character change for persistence
            if (state.currentCharacterId && newExhaustionLevel !== state.exhaustionLevel) {
                get().recordCharacterChange(state.currentCharacterId, 'stat_change', {
                    stat: 'exhaustionLevel',
                    value: newExhaustionLevel,
                    previousValue: state.exhaustionLevel,
                    timestamp: new Date()
                });
            }

            // Recalculate derived stats with new exhaustion level
            const effectiveStats = state.race && state.subrace
                ? applyRacialModifiers(state.stats, state.race, state.subrace)
                : state.stats;
            const equipmentBonuses = calculateEquipmentBonuses(state.equipment);

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

            const encumbranceState = getEncumbranceState();
            const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState, newExhaustionLevel, state.health, state.race, state.subrace);

            // Update health and mana max values based on new derived stats
            const newMaxHealth = Math.round(derivedStats.maxHealth);
            const newMaxMana = Math.round(derivedStats.maxMana);

            let newHealth = { ...state.health };
            let newMana = { ...state.mana };

            // Level 4: HP maximum halved (handled in calculateDerivedStats)
            // But we need to ensure current health doesn't exceed new max
            newHealth.max = newMaxHealth;
            newHealth.current = Math.min(newHealth.current, newMaxHealth);

            // Level 6: Death - set HP to 0
            if (newExhaustionLevel >= 6) {
                newHealth.current = 0;
            }

            // Update mana max
            newMana.max = newMaxMana;
            newMana.current = Math.min(newMana.current, newMaxMana);

            return {
                exhaustionLevel: newExhaustionLevel,
                derivedStats,
                health: newHealth,
                mana: newMana
            };
        });
    },

    // Handle level-up choice from modal
    handleLevelUpChoice: (choice) => {
        const state = get();
        const newLevel = state.pendingLevelUpInfo?.newLevel || state.level;

        // Build the level-up history entry
        const historyEntry = {
            healthIncrease: choice.healthIncrease || 0,
            manaIncrease: choice.manaIncrease || 0,
            attributes: choice.attributes || [],
            timestamp: new Date().toISOString()
        };

        // Handle spell learning (all spell-casting classes)
        if (choice.spellId) {
            const currentSpells = state.class_spells?.known_spells || [];
            // Check if spell is already known (shouldn't happen, but be safe)
            if (!currentSpells.includes(choice.spellId)) {
                const updatedSpells = [...currentSpells, choice.spellId];
                set({
                    class_spells: {
                        ...state.class_spells,
                        known_spells: updatedSpells
                    }
                });
            } else {
                console.warn(`⚠️ Attempted to learn spell ${choice.spellId} that is already known`);
            }
            historyEntry.spellId = choice.spellId;
        }

        // Handle attribute increases first (before health/mana)
        if (choice.attributes && choice.attributes.length > 0) {
            const newStats = { ...state.stats };
            choice.attributes.forEach(attr => {
                if (attr) {
                    newStats[attr] = (newStats[attr] || 0) + 1;
                }
            });

            set({ stats: newStats });
        }

        // Record the level-up choice in history BEFORE recalculating
        set({
            levelUpHistory: {
                ...state.levelUpHistory,
                [newLevel]: historyEntry
            }
        });

        // Recalculate derived stats (this will now include level-up bonuses from history)
        get().initializeCharacter();

        // Check if there are more levels that need choices
        const updatedState = get();
        const currentLevel = updatedState.level;
        const updatedLevelUpHistory = updatedState.levelUpHistory || {};

        // Find the next level that doesn't have a history entry
        let nextLevelToPrompt = null;
        for (let level = newLevel + 1; level <= currentLevel; level++) {
            if (!updatedLevelUpHistory[level]) {
                nextLevelToPrompt = level;
                break;
            }
        }

        // If we found another level that needs a choice, show the modal for it
        if (nextLevelToPrompt) {
            set({
                showLevelUpModal: true,
                pendingLevelUpInfo: {
                    newLevel: nextLevelToPrompt,
                    oldLevel: nextLevelToPrompt - 1
                }
            });
        } else {
            // No more levels need choices, close the modal
            set({
                showLevelUpModal: false,
                pendingLevelUpInfo: null
            });
        }

        // Save character after choice
        if (state.currentCharacterId) {
            get().saveCurrentCharacter();
        }

    },

    // Reverse level-up bonuses when leveling down
    reverseLevelUpBonus: (level) => {
        const state = get();
        const choice = state.levelUpHistory[level];

        if (!choice) {
            return;
        }


        // Reverse spell if present
        if (choice.spellId) {
            const currentSpells = state.class_spells?.known_spells || [];
            const updatedSpells = currentSpells.filter(id => id !== choice.spellId);
            set({
                class_spells: {
                    ...state.class_spells,
                    known_spells: updatedSpells
                }
            });
        }

        // Reverse attribute increases (handle both old and new format)
        const attributes = choice.attributes || (choice.attribute ? [choice.attribute] : []);

        if (attributes.length > 0) {
            const newStats = { ...state.stats };
            attributes.forEach(attr => {
                if (attr) {
                    newStats[attr] = Math.max(1, (newStats[attr] || 1) - 1);
                }
            });

            set({ stats: newStats });
        }

        // Remove from history BEFORE recalculating
        const updatedHistory = { ...state.levelUpHistory };
        delete updatedHistory[level];
        set({ levelUpHistory: updatedHistory });

        // Recalculate derived stats (this will now exclude the removed level-up bonuses)
        get().initializeCharacter();

    }
}));

// Initialize the character store with derived stats
const initializeCharacterStore = () => {
    const state = useCharacterStore.getState();

    // Force recalculation of derived stats
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

    // Update health and mana max values based on derived stats
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


    // Update the store with calculated values
    useCharacterStore.setState({
        equipmentBonuses,
        derivedStats,
        health: newHealth,
        mana: newMana
    });


};

// Run initialization
initializeCharacterStore();

// Make debug functions available globally for troubleshooting
if (typeof window !== 'undefined') {
    window.debugCharacterSystem = () => {
        const store = useCharacterStore.getState();
        return store.debugCharacterSystem();
    };

    // Also provide quick access to character system status
    window.getCharacterSystemStatus = () => {
        const store = useCharacterStore.getState();
        const activeCharacter = store.getActiveCharacter();

        return {
            charactersCount: store.characters.length,
            activeCharacter: activeCharacter ? {
                id: activeCharacter.id,
                name: activeCharacter.name,
                class: activeCharacter.class,
                level: activeCharacter.level
            } : null,
            isReady: !!activeCharacter
        };
    };

    // Debug functions available via window.debugCharacterSystem() and window.getCharacterSystemStatus()
}

// Debug function to manually recalculate stats (can be called from browser console)
window.recalculateCharacterStats = () => {
    const state = useCharacterStore.getState();
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

    // Update health and mana max values based on derived stats
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

    useCharacterStore.setState({
        equipmentBonuses,
        derivedStats,
        health: newHealth,
        mana: newMana
    });



    return derivedStats;
};

export default useCharacterStore;
