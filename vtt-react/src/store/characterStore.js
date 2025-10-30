import { create } from 'zustand';
import { calculateEquipmentBonuses, calculateDerivedStats } from '../utils/characterUtils';
import { isTwoHandedWeapon, getSlotsToCleanForTwoHanded } from '../utils/equipmentUtils';
import { initializeClassResource, updateClassResourceMax } from '../data/classResources';
import { applyRacialModifiers, getFullRaceData, getRaceData } from '../data/raceData';
import useGameStore from './gameStore';

// Import Firebase services for character persistence
import characterPersistenceService from '../services/firebase/characterPersistenceService';
import characterSessionService from '../services/firebase/characterSessionService';
import characterMigrationService from '../services/firebase/characterMigrationService';
import localStorageManager from '../utils/localStorageManager';

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

        console.log('🔍 Auth Debug Info:', {
            hasUser: !!state.user,
            userId: state.user?.uid || 'none',
            isAuthenticated: state.isAuthenticated,
            isDevelopmentBypass: state.isDevelopmentBypass,
            isGuest: state.user?.isGuest || false,
            userEmail: state.user?.email || 'none',
            hostname: window.location.hostname,
            nodeEnv: process.env.NODE_ENV
        });

        // In development mode, always return a user ID to prevent Firebase permission issues
        if (process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost') {
            const devUserId = state.user?.uid || 'dev-user-localhost';
            console.log(`🔧 Development mode: Using user ID: ${devUserId}`);
            return devUserId;
        }

        return state.user?.uid || null;
    } catch (error) {
        console.warn('Could not get current user ID:', error);
        // In development, provide a fallback user ID
        if (process.env.NODE_ENV === 'development') {
            console.log('🔧 Development fallback: Using dev-user-fallback');
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
        console.log('🔧 Development mode detected - using localStorage only');
        return false;
    }

    // Check for demo mode - always use localStorage in demo mode
    try {
        const { isDemoMode } = require('../config/firebase');
        if (isDemoMode) {
            console.log('🔧 Demo mode detected - using localStorage only');
            return false;
        }
    } catch (error) {
        console.warn('Could not check demo mode:', error);
    }

    // Check if Firebase is properly configured and user is authenticated
    const userId = getCurrentUserId();
    return !!(userId && characterPersistenceService.isConfigured);
};

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

    // Resistances - New system: immune, resistant, normal, exposed, vulnerable
    resistances: {
        fire: {
            level: 'normal', // immune, resistant, normal, exposed, vulnerable
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_fire.jpg'
        },
        cold: {
            level: 'normal',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_frostbolt02.jpg'
        },
        lightning: {
            level: 'normal',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_lightning.jpg'
        },
        acid: {
            level: 'normal',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_creature_poison_02.jpg'
        },
        force: {
            level: 'normal',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_blast.jpg'
        },
        necrotic: {
            level: 'normal',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowbolt.jpg'
        },
        radiant: {
            level: 'normal',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_holybolt.jpg'
        },
        poison: {
            level: 'normal',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_dualweild.jpg'
        },
        psychic: {
            level: 'normal',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_mindtwisting.jpg'
        },
        thunder: {
            level: 'normal',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_thunderclap.jpg'
        },
        // Add missing damage types to match creature system
        bludgeoning: {
            level: 'normal',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_punishingblow.jpg'
        },
        piercing: {
            level: 'normal',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_impalingbolt.jpg'
        },
        slashing: {
            level: 'normal',
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
                set({ raceDisplayName: raceData.subrace.name });
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
            const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState);

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
            const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState);

            // Send equipment update to multiplayer if connected
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
                console.log('📦 Sending equipment update to multiplayer server');
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
            const newState = { [field]: value };

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

                // Auto-assign starting spells for spell-casting classes
                const SPELL_CLASSES = ['Arcanoneer', 'Pyrofiend', 'Minstrel', 'Chronarch'];
                const previousClass = state.class;

                // Check if we're switching TO a spell-casting class
                if (SPELL_CLASSES.includes(value)) {
                    // Import class data dynamically
                    let classData = null;
                    if (value === 'Arcanoneer') {
                        const { ARCANONEER_DATA } = require('../data/classes/arcanoneerData');
                        classData = ARCANONEER_DATA;
                    } else if (value === 'Pyrofiend') {
                        const { PYROFIEND_DATA } = require('../data/classes/pyrofiendData');
                        classData = PYROFIEND_DATA;
                    } else if (value === 'Minstrel') {
                        const { MINSTREL_DATA } = require('../data/classes/minstrelData');
                        classData = MINSTREL_DATA;
                    } else if (value === 'Chronarch') {
                        const { CHRONARCH_DATA } = require('../data/classes/chronarchData');
                        classData = CHRONARCH_DATA;
                    }

                    if (classData && classData.spellPools && classData.spellPools[1]) {
                        const level1SpellIds = classData.spellPools[1];

                        // If switching from a different spell class, or if no spells assigned yet
                        const shouldReassignSpells = previousClass !== value &&
                            (SPELL_CLASSES.includes(previousClass) || !state.class_spells?.known_spells || state.class_spells.known_spells.length === 0);

                        if (shouldReassignSpells || !state.class_spells?.known_spells || state.class_spells.known_spells.length === 0) {
                            // Randomly select 3 spells from the pool
                            const shuffled = [...level1SpellIds].sort(() => Math.random() - 0.5);
                            const selectedSpells = shuffled.slice(0, 3);

                            newState.class_spells = {
                                ...state.class_spells,
                                known_spells: selectedSpells
                            };

                            console.log(`🎓 Auto-assigned 3 random starting spells for ${value}:`, selectedSpells);
                        }
                    }
                }
            }

            // If we have an active character and we're updating a field that should sync,
            // also update the active character in the characters array
            if (state.currentCharacterId) {
                const updatedCharacters = state.characters.map(char => {
                    if (char.id === state.currentCharacterId) {
                        return {
                            ...char,
                            [field]: value,
                            updatedAt: new Date().toISOString()
                        };
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
                    newState.racialTraits = raceData.combinedTraits.traits;
                    newState.racialLanguages = raceData.combinedTraits.languages;
                    newState.racialSpeed = raceData.combinedTraits.speed;
                    newState.raceDisplayName = raceData.subrace.name; // Set the full display name
                }
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

            return {
                [resource]: newResource
            };
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

        // Update race display name if race and subrace are set
        if (state.race && state.subrace && !state.raceDisplayName) {
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
        const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState);

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

        // Calculate derived stats with all effects
        const encumbranceState = getEncumbranceState();
        const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState);

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

        const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState);

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
            console.log('🔄 Loading characters...', {
                userId: userId || 'none',
                useFirebase,
                hostname: window.location.hostname
            });

            if (userId && useFirebase) {
                console.log('👤 User authenticated, attempting Firebase load...');
                // Skip migration in development mode to avoid Firebase permission issues
                if (process.env.NODE_ENV !== 'development' && characterMigrationService.isMigrationNeeded()) {
                    console.log('🔄 Character migration needed, starting migration...');

                    try {
                        // Create backup before migration
                        characterMigrationService.createBackup();

                        // Perform migration
                        const migrationResult = await characterMigrationService.migrateAllCharacters(userId);

                        if (migrationResult.success) {
                            console.log(`✅ Migration completed: ${migrationResult.migrated} characters migrated`);
                        } else {
                            console.warn(`⚠️ Migration completed with errors: ${migrationResult.failed} failed`);
                        }
                    } catch (migrationError) {
                        console.error('Migration failed:', migrationError);
                        // Continue loading even if migration fails
                    }
                } else if (process.env.NODE_ENV === 'development') {
                    console.log('🔧 Skipping migration in development mode');
                }

                // Load from Firebase if user is authenticated
                try {
                    console.log('🔥 Attempting to load characters from Firebase...');
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
                                    enriched.raceDisplayName = fullRaceData.subrace.name;
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
                    console.log(`✅ Loaded ${enrichedCharacters.length} characters from Firebase`);
                    return enrichedCharacters;
                } catch (firebaseError) {
                    console.error('❌ Error loading user characters:', firebaseError);
                    console.warn('Failed to load from Firebase, falling back to localStorage:', firebaseError);
                    // Fall back to localStorage if Firebase fails
                }
            } else {
                console.log('👤 Using localStorage only (development mode or no auth)');
            }

            // Fallback to localStorage (for offline mode, guest users, or when Firebase fails)
            let characters = [];
            try {
                const storageKey = getCharactersStorageKey();
                const savedCharacters = localStorage.getItem(storageKey);
                characters = savedCharacters ? JSON.parse(savedCharacters) : [];
                console.log(`✅ Loaded ${characters.length} characters from localStorage (${storageKey})`);
            } catch (localStorageError) {
                console.error('❌ Error loading from localStorage:', localStorageError);
                characters = [];
            }

            // Ensure characters array is valid
            if (!Array.isArray(characters)) {
                console.warn('⚠️ Characters data is not an array, resetting to empty array');
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
                            enriched.raceDisplayName = fullRaceData.subrace.name;
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
                    console.log(`🔄 Recalculating resources for active character: ${activeCharacter.name}`);
                    get().loadCharacter(activeCharacterId);
                }
            }

            console.log(`📋 Final character count: ${characters.length}`);
            return characters;
        } catch (error) {
            console.error('❌ Critical error loading characters:', error);
            set({ error: 'Failed to load characters', isLoading: false, characters: [] });
            return [];
        }
    },

    createCharacter: async (characterData) => {
        set({ isLoading: true, error: null });
        try {
            const userId = getCurrentUserId();
            console.log('🔄 Creating character...', {
                characterName: characterData.name,
                userId: userId || 'none'
            });

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

            if (userId && useFirebase) {
                // Save to Firebase if user is authenticated and Firebase is enabled
                try {
                    console.log('🔥 Attempting to create character in Firebase...');
                    const characterId = await characterPersistenceService.createCharacter(newCharacter, userId);
                    newCharacter.id = characterId;
                    console.log(`✅ Character created in Firebase: ${newCharacter.name} (${characterId})`);
                } catch (firebaseError) {
                    console.error('❌ Error creating character:', firebaseError);
                    console.warn('Failed to save to Firebase, saving locally:', firebaseError);
                    // Continue with local save if Firebase fails
                }
            } else {
                console.log('👤 Saving character locally only (development mode or no auth)');
            }

            const state = get();
            const updatedCharacters = [...state.characters, newCharacter];

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
                // Save to Firebase if user is authenticated
                try {
                    await characterPersistenceService.saveCharacter(updatedCharacter, userId);
                    console.log(`✅ Character updated in Firebase: ${updatedCharacter.name} (${characterId})`);
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
                    console.log(`✅ Character deleted from Firebase: ${characterId}`);
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
                levelUpHistory: character.levelUpHistory || {}
            });

            // Load character's inventory into the inventory store
            try {
                const inventoryStore = require('./inventoryStore').default;
                const inventoryState = inventoryStore.getState();

                console.log(`📦 Loading inventory for character: ${character.name}`);

                // Clear current inventory
                inventoryState.clearInventory();

                // Load character's items
                if (character.inventory?.items && Array.isArray(character.inventory.items)) {
                    character.inventory.items.forEach(item => {
                        inventoryState.addItem(item);
                    });
                    console.log(`✅ Loaded ${character.inventory.items.length} items into inventory`);
                }

                // Load character's currency
                if (character.inventory?.currency) {
                    inventoryState.updateCurrency(character.inventory.currency);
                    console.log(`💰 Loaded currency:`, character.inventory.currency);
                }
            } catch (error) {
                console.error('❌ Error loading character inventory:', error);
            }

            // Recalculate derived stats
            get().initializeCharacter();

            // Force recalculation of HP/MP based on current stats
            get().recalculateResources();

            // Debug logging for character loading
            if (character.name === 'YAD') {
                const state = get();
                console.log('🔍 Character store after loading:', {
                    characterName: character.name,
                    constitution: state.stats?.constitution,
                    intelligence: state.stats?.intelligence,
                    finalHealth: state.health,
                    finalMana: state.mana,
                    derivedStats: state.derivedStats
                });
            }

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

            console.log(`✅ Active character set to: ${character.name} (${characterId})`);

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
                                raceDisplayName = raceData.subrace.name;
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
                                backgroundDisplayName: backgroundDisplayName
                            }
                        });
                        console.log(`✅ Updated party member name to: ${character.name}`);
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
                    console.log(`✅ Updated presence data for: ${character.name}`);
                }
            } catch (error) {
                console.warn('Could not update presence data:', error);
            }

            return character;
        } else {
            console.error(`❌ Character not found: ${characterId}`);
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
        const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState);

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

        // Debug logging for resource recalculation
        if (state.name === 'YAD') {
            console.log('🔄 Recalculating resources for YAD:', {
                constitution: totalStats.constitution,
                intelligence: totalStats.intelligence,
                oldHealth: state.health,
                oldMana: state.mana,
                newHealth,
                newMana,
                derivedStats
            });
        }

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

        // Only log in development mode and throttle the logging
        if (process.env.NODE_ENV === 'development') {
            const now = Date.now();
            if (!state._lastActiveCharacterLog || now - state._lastActiveCharacterLog > 5000) {
                console.log('🔍 Getting active character...', {
                    currentCharacterId: state.currentCharacterId,
                    charactersCount: state.characters.length
                });
                set({ _lastActiveCharacterLog: now });
            }
        }

        if (state.currentCharacterId) {
            const character = state.characters.find(char => char.id === state.currentCharacterId);
            if (character) {
                return character;
            } else {
                console.warn(`⚠️ Active character ID ${state.currentCharacterId} not found in characters array`);
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
            console.log('🔄 Starting active character loading process...');

            // First ensure characters are loaded
            const characters = await get().loadCharacters();
            console.log(`📋 Characters loaded: ${characters.length} found`);

            // Then check for active character
            const activeCharacterId = localStorage.getItem('mythrill-active-character');
            console.log(`🔍 Checking for stored active character: ${activeCharacterId || 'none'}`);

            if (activeCharacterId) {
                const character = await get().setActiveCharacter(activeCharacterId);
                if (character) {
                    console.log(`✅ Restored active character: ${character.name} (${character.id})`);
                    return character;
                } else {
                    // Character not found, clear the stored ID
                    localStorage.removeItem('mythrill-active-character');
                    console.warn('⚠️ Stored active character not found, cleared selection');
                }
            }

            // If no active character is set but characters exist, suggest the first one
            if (characters.length > 0 && !activeCharacterId) {
                console.log(`💡 No active character set, but ${characters.length} characters available`);
                console.log('💡 Consider setting an active character using the character management interface');
            }

        } catch (error) {
            console.error('❌ Error loading active character:', error);
            // Try to provide a fallback by checking localStorage directly
            try {
                const storageKey = getCharactersStorageKey();
                const savedCharacters = localStorage.getItem(storageKey);
                const activeCharacterId = localStorage.getItem('mythrill-active-character');

                if (savedCharacters && activeCharacterId) {
                    const characters = JSON.parse(savedCharacters);
                    const character = characters.find(char => char.id === activeCharacterId);

                    if (character) {
                        console.log(`🔄 Fallback: Found character in localStorage: ${character.name}`);
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
                console.error('❌ Fallback character loading also failed:', fallbackError);
            }
        }
        return null;
    },

    // Clear active character selection
    clearActiveCharacter: () => {
        localStorage.removeItem('mythrill-active-character');
        set({ currentCharacterId: null });
        console.log('🗑️ Active character cleared');
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

    clearError: () => set({ error: null }),

    // System health check and initialization
    initializeCharacterSystem: async () => {
        console.log('🔄 Initializing character system...');

        try {
            // Load characters first
            const characters = await get().loadCharacters();

            // Check for active character
            const activeCharacter = await get().loadActiveCharacter();

            // Provide helpful feedback
            if (characters.length === 0) {
                console.log('ℹ️ No characters found. User should create their first character.');
                set({ error: 'Welcome! Create your first character to get started.' });
            } else if (!activeCharacter) {
                console.log(`💡 Found ${characters.length} characters but none are active. User should activate one.`);
                const characterNames = characters.map(c => c.name).join(', ');
                set({ error: `Please activate a character to continue. Available: ${characterNames}` });
            } else {
                console.log(`✅ Character system ready. Active character: ${activeCharacter.name}`);
                set({ error: null });
            }

            return {
                charactersCount: characters.length,
                activeCharacter,
                isReady: !!activeCharacter
            };
        } catch (error) {
            console.error('❌ Character system initialization failed:', error);
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

        console.log('🔍 Character System Debug Info:');
        console.table(debugInfo);

        // Provide recommendations
        if (debugInfo.charactersCount === 0) {
            console.log('💡 Recommendation: Create your first character');
        } else if (!debugInfo.currentCharacterId) {
            console.log('💡 Recommendation: Activate a character using the character management interface');
        } else {
            console.log('✅ Character system appears to be working correctly');
        }

        return debugInfo;
    },

    // Character Session Management for Multiplayer
    startCharacterSession: async (characterId, roomId = null) => {
        try {
            const userId = getCurrentUserId();
            if (!userId) {
                console.warn('⚠️ No user authenticated, using local session tracking');
                // Still create a local session for offline mode
                const localSessionId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                console.log(`✅ Local character session created: ${localSessionId} for character ${characterId}`);
                return localSessionId;
            }

            const sessionId = await characterSessionService.startSession(characterId, userId, roomId);
            console.log(`✅ Character session started: ${sessionId} for character ${characterId}`);
            return sessionId;
        } catch (error) {
            console.error('❌ Error starting character session:', error);
            // Create a fallback local session
            const fallbackSessionId = `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            console.log(`🔄 Created fallback session: ${fallbackSessionId} for character ${characterId}`);
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
                console.log(`✅ Character session ended for character ${characterId}`);
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
            if (success) {
                console.log(`📝 Recorded ${changeType} change for character ${characterId}`);
            }
            return success;
        } catch (error) {
            console.error('Error recording character change:', error);
            return false;
        }
    },

    // Resource management with character persistence
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
                console.log(`🎉 LEVEL UP! ${levelUpInfo.oldLevel} → ${levelUpInfo.newLevel}`);

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

        console.log(`💰 ${xpAmount > 0 ? 'Awarding' : 'Removing'} ${Math.abs(xpAmount)} XP (${currentXP} → ${newXP})`);
        get().updateExperience(newXP);
    },

    // Adjust level directly (adds or removes levels)
    adjustLevel: (levelChange) => {
        const { getXPForLevel } = require('../utils/experienceUtils');
        const state = get();
        const currentLevel = state.level || 1;
        const newLevel = Math.max(1, Math.min(20, currentLevel + levelChange)); // Clamp between 1-20

        if (newLevel === currentLevel) {
            console.log(`📊 Level unchanged (already at ${currentLevel})`);
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

        console.log(`📊 ${levelChange > 0 ? 'Adding' : 'Removing'} ${Math.abs(levelChange)} level(s) (${currentLevel} → ${newLevel})`);

        // Update both level and XP
        set({ level: newLevel });

        // Only trigger updateExperience if leveling up (to avoid triggering modal when manually adjusting)
        if (levelChange > 0) {
            get().updateExperience(newXP);
        } else {
            // Just set XP without triggering level-up check
            set({ experience: newXP });
        }

        // Save character after level adjustment
        get().saveCharacter();
    },

    updateLevel: (newLevel) => {
        set(state => {
            // Record character change for persistence
            if (state.currentCharacterId && newLevel !== state.level) {
                get().recordCharacterChange(state.currentCharacterId, 'stat_change', {
                    stat: 'level',
                    value: newLevel,
                    previousValue: state.level,
                    timestamp: new Date()
                });
            }

            return { level: newLevel };
        });
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

            return { exhaustionLevel: newExhaustionLevel };
        });
    },

    // Handle level-up choice from modal
    handleLevelUpChoice: (choice) => {
        const state = get();
        const newLevel = state.pendingLevelUpInfo?.newLevel || state.level;

        console.log(`📊 Processing level-up choice for level ${newLevel}:`, choice);

        // Build the level-up history entry
        const historyEntry = {
            healthIncrease: choice.healthIncrease || 0,
            manaIncrease: choice.manaIncrease || 0,
            attributes: choice.attributes || [],
            timestamp: new Date().toISOString()
        };

        // Handle spell learning (Arcanoneer only)
        if (choice.spellId) {
            const currentSpells = state.class_spells?.known_spells || [];
            set({
                class_spells: {
                    ...state.class_spells,
                    known_spells: [...currentSpells, choice.spellId]
                }
            });
            historyEntry.spellId = choice.spellId;
            console.log(`📚 Learned new spell: ${choice.spellId}`);
        }

        // Handle attribute increases first (before health/mana)
        if (choice.attributes && choice.attributes.length > 0) {
            const newStats = { ...state.stats };
            choice.attributes.forEach(attr => {
                if (attr) {
                    newStats[attr] = (newStats[attr] || 0) + 1;
                    console.log(`📊 Increased ${attr} by 1`);
                }
            });

            set({ stats: newStats });
        }

        // Record the level-up choice in history BEFORE recalculating
        set({
            levelUpHistory: {
                ...state.levelUpHistory,
                [newLevel]: historyEntry
            },
            showLevelUpModal: false,
            pendingLevelUpInfo: null
        });

        // Recalculate derived stats (this will now include level-up bonuses from history)
        get().initializeCharacter();

        // Save character after choice
        if (state.currentCharacterId) {
            get().saveCurrentCharacter();
        }

        console.log(`✅ Level-up complete for level ${newLevel}`);
    },

    // Reverse level-up bonuses when leveling down
    reverseLevelUpBonus: (level) => {
        const state = get();
        const choice = state.levelUpHistory[level];

        if (!choice) {
            console.log(`⚠️ No level-up history found for level ${level}`);
            return;
        }

        console.log(`🔄 Reversing level-up bonuses for level ${level}:`, choice);

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
            console.log(`📚 Removed spell: ${choice.spellId}`);
        }

        // Reverse attribute increases (handle both old and new format)
        const attributes = choice.attributes || (choice.attribute ? [choice.attribute] : []);

        if (attributes.length > 0) {
            const newStats = { ...state.stats };
            attributes.forEach(attr => {
                if (attr) {
                    newStats[attr] = Math.max(1, (newStats[attr] || 1) - 1);
                    console.log(`📊 Decreased ${attr} by 1`);
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

        console.log(`✅ Reversed bonuses for level ${level}`);
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

    const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState);

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

    // Debug logging for character store resource calculation
    if (state.name === 'YAD') {
        console.log('🔍 CharacterStore resource calculation:', {
            characterName: state.name,
            constitution: totalStats.constitution,
            intelligence: totalStats.intelligence,
            derivedMaxHealth: newMaxHealth,
            derivedMaxMana: newMaxMana,
            currentHealth: state.health.current,
            currentMana: state.mana.current,
            newHealth,
            newMana
        });
    }

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

    console.log('🔧 Debug functions available:');
    console.log('- window.debugCharacterSystem() - Full system debug info');
    console.log('- window.getCharacterSystemStatus() - Quick status check');
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

    const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState);

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
