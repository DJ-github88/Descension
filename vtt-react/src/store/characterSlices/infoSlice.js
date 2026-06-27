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
import { getEncumbranceState, getCurrentUserId, isGuestUser, getCharactersStorageKey, shouldUseFirebase, characterAutoSaveTimer, CHARACTER_AUTO_SAVE_DELAY, setCharacterAutoSaveTimer } from '../characterHelpers';
import { ALL_CLASSES_DATA } from '../../data/classes';
import { ALL_CLASS_SPELLS } from '../../data/classSpellGenerator';
import { getXPForLevel } from '../../utils/experienceUtils';

// Info Slice: Character identity, lore, talents, and skills.
// State properties and action bodies are copied verbatim from characterStore.js.

export const createInfoSlice = (set, get) => ({
    // Base character info (for current character)
    name: 'Character Name',
    baseName: 'Character Name', // Store the original name without room formatting
    roomName: '', // Current room name for multiplayer
    race: '', // Race ID (e.g., 'human')
    subrace: '', // Subrace ID (e.g., 'skald_human')
    class: '', // Character class
    background: '', // Background ID (e.g., 'acolyte', 'sage')
    backgroundDisplayName: '', // Display name for background
    path: '', // Character path ID (e.g., 'mystic', 'zealot')
    pathDisplayName: '', // Display name for path (e.g., 'Mystic', 'Zealot')
    pathPassives: [], // Passive abilities from the selected path/discipline
    selectedAbility: '', // ID of the chosen discipline ability
    level: 1,
    experience: 0, // Current XP
    alignment: 'Neutral Good',
    exhaustionLevel: 0,

    // Level-up modal state
    showLevelUpModal: false,
    pendingLevelUpInfo: null, // { newLevel, oldLevel }
    levelUpHistory: {}, // { level: { statChoice, spellId?, attribute?, timestamp } }

    // Talent tree selections { talentId: rank }
    talents: {},

    // Class-specific spell tracking (for Arcanoneer and other spell-learning classes)
    class_spells: {
        known_spells: [] // Array of spell IDs the character knows
    },

    // Racial traits and information
    racialTraits: [],
    racialLanguages: [],
    racialSpeed: 30,
    raceDisplayName: '', // Full display name like "Skald Human"

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
        imageTransformations: null,
        characterIcon: null,
        iconBackgroundColor: '#f8f5eb',
        iconBorderColor: '#d4af37',
        iconBackgroundImage: null,
        iconScale: 1,
        iconOffsetX: 0,
        iconOffsetY: 0,
        iconBackgroundScale: 2.5,
        iconBackgroundOffsetX: 0,
        iconBackgroundOffsetY: 0
    },

    // Token appearance settings
    tokenSettings: {
        borderColor: '#506e30',
        customIcon: null // Custom icon URL if different from character image
    },

    // Quest-based skill system
    skillProgress: {},
    skillRanks: {}, // Skill proficiency ranks from character creation

    // Helper function to update race display name
    updateRaceDisplayName: () => {
        const state = get();
        if (state.race && state.subrace) {
            const raceData = getFullRaceData(state.race, state.subrace);
            if (raceData) {
                // Standard format: "Subrace Race" e.g. "Skald Human"
                // This matches what most users expect for a display name
                set({ raceDisplayName: `${raceData.subrace.name} ${raceData.race.name}` });
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

        // Sync with multiplayer
        get().syncWithMultiplayer();
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
                    // Reverse bonuses for each level being lost (in descending order).
                    // reverseLevelUpBonus no longer calls initializeCharacter itself;
                    // we do a single pass below after all reversals are complete.
                    for (let level = oldLevel; level > newLevel; level--) {
                        get().reverseLevelUpBonus(level);
                    }

                    // Recalculate derived stats once after all reversals
                    // (health, mana, AP will reflect the pruned levelUpHistory)
                    setTimeout(() => get().initializeCharacter(), 0);

                    // Update XP to match new level
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
                const getClassData = (className) => (ALL_CLASSES_DATA[className] || null);

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
                                console.warn(`Ã¢Å¡Â Ã¯Â¸Â No level 1 spells found in ALL_CLASS_SPELLS for ${value}`);
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
                            console.error(`Ã¢ÂÅ’ Failed to assign any starter spells for ${value}`, {
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
                const damageTypes = ['physical', 'ember', 'rime', 'storm', 'arcane', 'primal', 'blight', 'wyrd', 'divine'];
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
                    // Format as "Subrace (Race)" e.g. "Skald (Human)"
                    newState.raceDisplayName = `${raceData.subrace.name} (${raceData.race.name})`;

                    // Apply passive stat modifiers (resistances, vulnerabilities, immunities) to character stats
                    const passiveModifiers = getRacialStatModifiers(state.race, value);

                    // Start with current resistances and immunities, or initialize if they don't exist
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
                                        'physical_resistance': 'physical',
                                        'bludgeoning_resistance': 'physical',
                                        'piercing_resistance': 'physical',
                                        'slashing_resistance': 'physical',
                                        'ember_resistance': 'ember',
                                        'fire_resistance': 'ember',
                                        'radiant_resistance': 'ember',
                                        'rime_resistance': 'rime',
                                        'frost_resistance': 'rime',
                                        'cold_resistance': 'rime',
                                        'storm_resistance': 'storm',
                                        'lightning_resistance': 'storm',
                                        'force_resistance': 'storm',
                                        'thunder_resistance': 'storm',
                                        'arcane_resistance': 'arcane',
                                        'primal_resistance': 'primal',
                                        'nature_resistance': 'primal',
                                        'blight_resistance': 'blight',
                                        'necrotic_resistance': 'blight',
                                        'void_resistance': 'blight',
                                        'poison_resistance': 'blight',
                                        'acid_resistance': 'blight',
                                        'wyrd_resistance': 'wyrd',
                                        'psychic_resistance': 'wyrd',
                                        'chaos_resistance': 'wyrd'
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
                                            'physical': 'physical',
                                            'bludgeoning': 'physical',
                                            'piercing': 'physical',
                                            'slashing': 'physical',
                                            'ember': 'ember',
                                            'fire': 'ember',
                                            'radiant': 'ember',
                                            'rime': 'rime',
                                            'frost': 'rime',
                                            'cold': 'rime',
                                            'storm': 'storm',
                                            'lightning': 'storm',
                                            'force': 'storm',
                                            'thunder': 'storm',
                                            'arcane': 'arcane',
                                            'primal': 'primal',
                                            'nature': 'primal',
                                            'blight': 'blight',
                                            'necrotic': 'blight',
                                            'void': 'blight',
                                            'poison': 'blight',
                                            'acid': 'blight',
                                            'wyrd': 'wyrd',
                                            'psychic': 'wyrd',
                                            'chaos': 'wyrd',
                                            'disease': 'disease',
                                            'exhaustion': 'exhaustion'
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

                                    // Map legacy damage type names to new types for vulnerabilities
                                    const vulnerabilityLegacyMap = {
                                        'cold': 'rime', 'frost': 'rime',
                                        'fire': 'ember', 'radiant': 'ember',
                                        'lightning': 'storm', 'force': 'storm', 'thunder': 'storm',
                                        'acid': 'blight', 'poison': 'blight', 'necrotic': 'blight', 'void': 'blight',
                                        'nature': 'primal',
                                        'psychic': 'wyrd', 'chaos': 'wyrd',
                                        'bludgeoning': 'physical', 'piercing': 'physical', 'slashing': 'physical'
                                    };
                                    if (vulnerabilityLegacyMap[vulnerabilityType]) {
                                        vulnerabilityType = vulnerabilityLegacyMap[vulnerabilityType];
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
                const damageTypes = ['physical', 'ember', 'rime', 'storm', 'arcane', 'primal', 'blight', 'wyrd', 'divine'];
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
                                    'acid_resistance': 'poison',
                                    'force_resistance': 'force',
                                    'necrotic_resistance': 'necrotic',
                                    'radiant_resistance': 'radiant',
                                    'poison_resistance': 'poison',
                                    'psychic_resistance': 'psychic',
                                    'thunder_resistance': 'force'
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

        // Sync with multiplayer
        get().syncWithMultiplayer();
    },

    setTalents: (newTalents) => {
        set({ talents: newTalents });

        if (get().currentCharacterId) {
            const userId = getCurrentUserId();
            if (userId) {
                updateCharacterData(get().currentCharacterId, { talents: newTalents }, userId).catch(error => {
                    console.error('Failed to store talent update offline:', error);
                });
            }
        }

        if (characterAutoSaveTimer) {
            clearTimeout(characterAutoSaveTimer);
        }

        if (get().currentCharacterId) {
            characterAutoSaveTimer = setTimeout(() => {
                try {
                    get().saveCurrentCharacter();
                } catch (error) {
                    console.warn('Failed to auto-save character after setTalents:', error);
                }
            }, CHARACTER_AUTO_SAVE_DELAY);
        }

        get().syncWithMultiplayer();
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

        // Sync with multiplayer
        get().syncWithMultiplayer();
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
    updateSkillProgress: (skillId, progress) => {
        set((state) => ({
            skillProgress: { ...state.skillProgress, [skillId]: progress }
        }));

        // Sync with multiplayer
        get().syncWithMultiplayer();
    },

    setSkillRank: (skillId, rankKey) => {
        set((state) => ({
            skillRanks: { ...state.skillRanks, [skillId]: rankKey }
        }));

        // Sync with multiplayer
        get().syncWithMultiplayer();
    },

    // Update lore information
    updateLore: (field, value) => {
        set(state => ({
            lore: {
                ...state.lore,
                [field]: value
            }
        }));

        // Sync with multiplayer
        get().syncWithMultiplayer();
    },

    // Update background (syncs both background ID and backgroundDisplayName)
    updateBackground: (backgroundId, backgroundDisplayName) => {
        set(state => ({
            background: backgroundId || '',
            backgroundDisplayName: backgroundDisplayName || ''
        }));

        // Sync with multiplayer
        get().syncWithMultiplayer();
    },

    // Update token settings
    updateTokenSettings: (field, value) => {
        set(state => ({
            tokenSettings: {
                ...state.tokenSettings,
                [field]: value
            }
        }));

        // Sync with multiplayer
        get().syncWithMultiplayer();
    },
});
