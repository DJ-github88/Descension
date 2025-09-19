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

// Helper function to get current user ID
const getCurrentUserId = () => {
    try {
        // Import auth store dynamically to avoid circular dependencies
        const authStore = require('./authStore').default;
        const state = authStore.getState();
        return state.user?.uid || null;
    } catch (error) {
        console.warn('Could not get current user ID:', error);
        return null;
    }
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
    class: 'Class',
    level: 1,
    alignment: 'Neutral Good',
    exhaustionLevel: 0,

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
        current: 0,
        max: 5, // Default max value
        // Additional properties for complex resource types
        stacks: [], // For multi-stack systems like Chaos Weaver dice
        phase: null, // For phase-based systems like Lunarch
        threshold: 0, // For threshold-based systems like Berserker
        slots: [], // For slot-based systems like Inscriptor glyphs
        charges: 0, // For charge-based systems
        volatility: 0, // For volatility systems like Arcanoneer
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
    derivedStats: {
        movementSpeed: 30,
        swimSpeed: 15,
        carryingCapacity: 0,
        visionRange: 0
    },

    // Quest-based skill system
    skillProgress: {},

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

            // If name is being changed, update baseName and format with room if needed
            if (field === 'name') {
                // Extract base name by removing any existing room formatting
                const cleanName = value.replace(/\s*\([^)]*\)\s*$/, '');
                newState.baseName = cleanName;
                // If we're in a room, format the name with room name
                if (state.roomName) {
                    newState.name = `${cleanName} (${state.roomName})`;
                } else {
                    newState.name = cleanName;
                }
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

                // Save updated characters to localStorage
                try {
                    localStorage.setItem('mythrill-characters', JSON.stringify(updatedCharacters));
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
            // Update displayed name with room formatting if in a room
            if (state.roomName) {
                newState.name = `${newBaseName} (${state.roomName})`;
            } else {
                newState.name = newBaseName;
            }
            return newState;
        });
    },

    // Room name management for multiplayer
    setRoomName: (roomName) => {
        set(state => {
            const newState = { roomName };
            // Update displayed name to include room name
            if (roomName && state.baseName) {
                newState.name = `${state.baseName} (${roomName})`;
            } else if (state.baseName) {
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

        const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses);

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

            if (userId) {
                // Check if migration is needed
                if (characterMigrationService.isMigrationNeeded()) {
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
                }

                // Load from Firebase if user is authenticated
                try {
                    const characters = await characterPersistenceService.loadUserCharacters(userId);
                    set({ characters, isLoading: false });
                    console.log(`✅ Loaded ${characters.length} characters from Firebase`);
                    return characters;
                } catch (firebaseError) {
                    console.warn('Failed to load from Firebase, falling back to localStorage:', firebaseError);
                    // Fall back to localStorage if Firebase fails
                }
            }

            // Fallback to localStorage (for offline mode or when Firebase fails)
            const savedCharacters = localStorage.getItem('mythrill-characters');
            const characters = savedCharacters ? JSON.parse(savedCharacters) : [];
            set({ characters, isLoading: false });
            console.log(`✅ Loaded ${characters.length} characters from localStorage`);
            return characters;
        } catch (error) {
            console.error('Error loading characters:', error);
            set({ error: 'Failed to load characters', isLoading: false });
            throw error;
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
                // Ensure required fields exist
                resources: characterData.resources || {
                    health: { current: 100, max: 100 },
                    mana: { current: 50, max: 50 },
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

            if (userId) {
                // Save to Firebase if user is authenticated
                try {
                    const characterId = await characterPersistenceService.createCharacter(newCharacter, userId);
                    newCharacter.id = characterId;
                    console.log(`✅ Character created in Firebase: ${newCharacter.name} (${characterId})`);
                } catch (firebaseError) {
                    console.warn('Failed to save to Firebase, saving locally:', firebaseError);
                    // Continue with local save if Firebase fails
                }
            }

            const state = get();
            const updatedCharacters = [...state.characters, newCharacter];

            // Always save to localStorage as backup
            localStorage.setItem('mythrill-characters', JSON.stringify(updatedCharacters));

            set({
                characters: updatedCharacters,
                isLoading: false
            });

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

            // Always save to localStorage as backup
            localStorage.setItem('mythrill-characters', JSON.stringify(updatedCharacters));

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

            // Save to localStorage
            localStorage.setItem('mythrill-characters', JSON.stringify(updatedCharacters));

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
                class: character.class || 'Class',
                level: character.level || 1,
                alignment: character.alignment || 'Neutral Good',
                stats: character.stats || {
                    constitution: 10,
                    strength: 10,
                    agility: 10,
                    intelligence: 10,
                    spirit: 10,
                    charisma: 10
                },
                health: character.health || { current: 45, max: 50 },
                mana: character.mana || { current: 45, max: 50 },
                actionPoints: character.actionPoints || { current: 1, max: 3 },
                equipment: character.equipment || {},
                resistances: character.resistances || get().resistances,
                spellPower: character.spellPower || get().spellPower,
                lore: character.lore || get().lore,
                tokenSettings: character.tokenSettings || get().tokenSettings
            });

            // Recalculate derived stats
            get().initializeCharacter();
            return character;
        }

        return null;
    },

    // Set active character and persist the selection
    setActiveCharacter: (characterId) => {
        const state = get();
        const character = state.characters.find(char => char.id === characterId);

        if (character) {
            // Load the character data
            get().loadCharacter(characterId);

            // Persist active character selection
            localStorage.setItem('mythrill-active-character', characterId);

            console.log(`✅ Active character set to: ${character.name} (${characterId})`);
            return character;
        } else {
            console.error(`❌ Character not found: ${characterId}`);
            return null;
        }
    },

    // Get the currently active character
    getActiveCharacter: () => {
        const state = get();
        if (state.currentCharacterId) {
            return state.characters.find(char => char.id === state.currentCharacterId);
        }
        return null;
    },

    // Load active character from localStorage on app initialization
    loadActiveCharacter: async () => {
        try {
            // First ensure characters are loaded
            await get().loadCharacters();

            // Then check for active character
            const activeCharacterId = localStorage.getItem('mythrill-active-character');
            if (activeCharacterId) {
                const character = get().setActiveCharacter(activeCharacterId);
                if (character) {
                    console.log(`🔄 Restored active character: ${character.name}`);
                    return character;
                } else {
                    // Character not found, clear the stored ID
                    localStorage.removeItem('mythrill-active-character');
                    console.warn('⚠️ Stored active character not found, cleared selection');
                }
            }
        } catch (error) {
            console.error('Error loading active character:', error);
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

        const characterData = {
            name: state.name,
            baseName: state.baseName,
            race: state.race,
            subrace: state.subrace,
            class: state.class,
            level: state.level,
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
            updatedAt: new Date().toISOString()
        };

        get().updateCharacter(state.currentCharacterId, characterData);
    },

    clearError: () => set({ error: null }),

    // Character Session Management for Multiplayer
    startCharacterSession: async (characterId, roomId = null) => {
        try {
            const userId = getCurrentUserId();
            if (!userId) {
                console.warn('No user authenticated, cannot start character session');
                return null;
            }

            const sessionId = await characterSessionService.startSession(characterId, userId, roomId);
            console.log(`✅ Character session started: ${sessionId} for character ${characterId}`);
            return sessionId;
        } catch (error) {
            console.error('Error starting character session:', error);
            return null;
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
        set(state => {
            const experienceGained = newExperience - (state.experience || 0);

            // Record character change for persistence
            if (state.currentCharacterId && experienceGained > 0) {
                get().recordCharacterChange(state.currentCharacterId, 'experience_gain', {
                    amount: experienceGained,
                    newTotal: newExperience,
                    timestamp: new Date()
                });
            }

            return { experience: newExperience };
        });
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
