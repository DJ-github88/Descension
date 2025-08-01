import { create } from 'zustand';
import { calculateEquipmentBonuses, calculateDerivedStats } from '../utils/characterUtils';
import { isTwoHandedWeapon, getSlotsToCleanForTwoHanded } from '../utils/equipmentUtils';
import { initializeClassResource, updateClassResourceMax } from '../data/classResources';
import { applyRacialModifiers, getFullRaceData, getRaceData } from '../data/raceData';

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

const useCharacterStore = create((set, get) => ({
    // Base character info
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
        characterImage: null
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
        type: null, // Will be set based on selected class
        current: 0,
        max: 0,
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
            const encumbranceState = getEncumbranceState();
            const derivedStats = calculateDerivedStats(effectiveStats, equipmentBonuses, {}, encumbranceState);

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
            const encumbranceState = getEncumbranceState();
            const derivedStats = calculateDerivedStats(effectiveStats, equipmentBonuses, {}, encumbranceState);

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

                if (classResource) {
                    newState.classResource = classResource;
                }
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
            const oldResource = state[resource];
            const newResource = {
                current: current !== undefined ? Math.min(max || state[resource].max, Math.max(0, current)) : state[resource].current,
                max: max !== undefined ? Math.max(0, max) : state[resource].max
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
        const derivedStats = calculateDerivedStats(effectiveStats, equipmentBonuses);

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
        const derivedStats = calculateDerivedStats(effectiveStats, equipmentBonuses, {}, encumbranceState);

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
    const derivedStats = calculateDerivedStats(effectiveStats, equipmentBonuses, {}, encumbranceState);

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
    const derivedStats = calculateDerivedStats(effectiveStats, equipmentBonuses, {}, encumbranceState);

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
