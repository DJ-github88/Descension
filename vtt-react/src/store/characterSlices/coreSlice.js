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
import { getCustomBackgroundData } from '../../data/legacyDisciplineData';
import { getEncumbranceState, getCurrentUserId, isGuestUser, getCharactersStorageKey, shouldUseFirebase, characterAutoSaveTimer, CHARACTER_AUTO_SAVE_DELAY, setCharacterAutoSaveTimer } from '../characterHelpers';

export const createCoreSlice = (set, get) => ({
    // Character management for account system
    characters: [], // Array of all user's characters
    currentCharacterId: null, // ID of currently active character
    isLoading: false,
    error: null,

    // Character Management Functions for Account System
    loadCharacters: async () => {
        set({ isLoading: true, error: null });
        try {
            // CRITICAL FIX: Wait for auth to initialize to prevent race conditions with localStorage clearing
            // If we check userId before auth is done, we might think the user logged out and clear their data
            const authStore = getStore('authStore');
            if (!authStore.getState().isAuthInitialized) {
                // Wait up to 2 seconds for auth initialization (App.jsx also has initialization logic)
                let checks = 0;
                while (!authStore.getState().isAuthInitialized && checks < 20) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    checks++;
                }

                if (!authStore.getState().isAuthInitialized) {
                    console.warn('Ã¢Å¡Â Ã¯Â¸Â Auth initialization timeout in loadCharacters - proceeding with caution');
                }
            }
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
            // Clear characters ONLY IF we have a stable, different authenticated identity.
            // If switching account types, or if userId truly changed between stable sessions.
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

            // CRITICAL FIX: Don't clear storage if the user identity is still stabilizing
            // or if we're in a dev mode where we expect specific fallbacks.
            const lastAccountType = localStorage.getItem('mythrill-last-account-type');
            const lastUserId = localStorage.getItem('mythrill-last-user-id');

            // Only clear storage if we have a CLEAR switch between stable account types
            // and we're not in the middle of auth initialization.
            const isAuthInitialized = authStore.getState().isAuthInitialized;
            const isTempUser = (id) => !id || id === 'dev-user-localhost' || id === 'dev-user-fallback' || id.startsWith('dev-user-');

            if (isAuthInitialized && lastAccountType && lastAccountType !== currentAccountType) {
                // If we're moving TO an authenticated account FROM a guest account, we keep the guest data
                // but if we're moving BETWEEN different authenticated/dev accounts, we clean up.
                // CRITICAL: Don't clear if the current account is just the "dev" fallback.
                // We ONLY clear if we are moving between two STABLE, NON-TEMP identities.
                if (currentAccountType !== 'dev' && (lastAccountType === 'authenticated' || lastAccountType === 'dev') && !isTempUser(lastUserId)) {
                    console.log(`[CharacterStore] Account type change from ${lastAccountType} to ${currentAccountType}, clearing storage`);
                    localStorage.removeItem('mythrill-characters');
                    localStorage.removeItem('mythrill-active-character');
                }
            }

            // CRITICAL FIX: Only clear if the userId changed AND we are not in a temporary initialization state
            if (lastUserId && currentUserId && lastUserId !== currentUserId) {
                // Don't clear if it's just the dev fallback changing
                const isTempUser = (id) => !id || id === 'dev-user-localhost' || id === 'dev-user-fallback';
                
                if (!isTempUser(currentUserId) && !isTempUser(lastUserId)) {
                   console.log(`[CharacterStore] User ID change from ${lastUserId} to ${currentUserId}, clearing storage`);
                   localStorage.removeItem('mythrill-characters');
                   localStorage.removeItem('mythrill-active-character');
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
                                    // Format as "Subrace (Race)" e.g. "Skald (Human)"
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
                
                // IMPROVED: If no characters found in expected key, check the other key as fallback
                // This handles cases where account type detection might be wrong
                if (!characters || characters.length === 0) {
                    const alternateKey = storageKey === 'mythrill-characters' 
                        ? 'mythrill-guest-characters' 
                        : 'mythrill-characters';
                    const alternateCharacters = localStorage.getItem(alternateKey);
                    if (alternateCharacters) {
                        const parsed = JSON.parse(alternateCharacters);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            console.log(`[CharacterStore] Found ${parsed.length} characters in alternate storage key: ${alternateKey}`);
                            characters = parsed;
                        }
                    }
                }
                
                console.log(`[CharacterStore] Loaded ${characters?.length || 0} characters from ${storageKey}`);
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
                            // Format as "Subrace (Race)" e.g. "Skald (Human)"
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
                        console.warn('Ã¢Å¡Â Ã¯Â¸Â Failed to save characters to localStorage (quota exceeded):', result.error);
                        console.warn('Ã¢Å¡Â Ã¯Â¸Â Character is still available in this session but may not persist after refresh');
                        // Still continue with the operation - character is in memory
                    }
                } catch (error) {
                    console.warn('Ã¢Å¡Â Ã¯Â¸Â localStorage quota exceeded for guest character:', error);
                    console.warn('Ã¢Å¡Â Ã¯Â¸Â Character is still available in this session but may not persist after refresh');
                    // Don't fail the operation - character is still in memory
                }
            } else {
                // For authenticated users with Firebase, only save to localStorage as backup
                // Try to save but don't fail if it doesn't work (Firebase is primary)
                try {
                    localStorageManager.safeSetItem(storageKey, JSON.stringify(compressedCharacters));
                } catch (error) {
                    console.warn('Ã¢Å¡Â Ã¯Â¸Â Failed to save character backup to localStorage (Firebase is primary):', error);
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
                        console.warn('Ã¢Å¡Â Ã¯Â¸Â Failed to reload characters after creation:', error);
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
                class: character.class || '',
                background: character.background || '',
                backgroundDisplayName: character.backgroundDisplayName || '',
                path: character.path || '',
                pathDisplayName: character.pathDisplayName || '',
                pathPassives: character.pathPassives || [],
                selectedAbility: character.selectedAbility || '',
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
                talents: character.talents || {},
                // Ensure inventory is preserved in character state
                inventory: character.inventory || {
                    items: [],
                    currency: { platinum: 0, gold: 0, silver: 0, copper: 0 },
                    encumbranceState: 'normal'
                }
            });

            // Load character's inventory into the inventory store
            try {
                const inventoryStore = getStore('inventoryStore');
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
                const partyStore = getStore('partyStore');
                const partyState = partyStore.getState();

                if (partyState.isInParty) {
                    const currentMember = partyState.partyMembers.find(m => m.id === 'current-player');
                    if (currentMember) {
                        // Get proper race display name
                        let raceDisplayName = character.raceDisplayName;
                        if (!raceDisplayName && character.race && character.subrace) {
                            const raceData = getFullRaceData(character.race, character.subrace);
                            if (raceData) {
                                // Format as "Subrace (Race)" e.g. "Skald (Human)"
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
                                pathDisplayName: character.pathDisplayName,
                                selectedAbility: character.selectedAbility || ''
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
                    const presenceService = (await import('../../services/firebase/presenceService')).default;
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

    // Load active character from localStorage on app initialization
    loadActiveCharacter: async (preloadedCharacters = null) => {
        try {
            // First ensure characters are loaded
            const characters = preloadedCharacters || await get().loadCharacters();

            console.log(`[CharacterStore] loadActiveCharacter: Found ${characters?.length || 0} characters`);

            // Then check for active character
            let activeCharacterId = localStorage.getItem('mythrill-active-character');

            // IMPROVED: If no active character is set but characters exist, auto-select the first one
            if (!activeCharacterId && characters && characters.length > 0) {
                activeCharacterId = characters[0].id;
                console.log(`[CharacterStore] No active character set, auto-selecting first character: ${characters[0].name}`);
                localStorage.setItem('mythrill-active-character', activeCharacterId);
            }

            if (activeCharacterId) {
                const character = await get().setActiveCharacter(activeCharacterId);
                if (character) {
                    console.log(`[CharacterStore] Successfully loaded active character: ${character.name}`);
                    return character;
                } else {
                    // Character not found, clear the stored ID
                    localStorage.removeItem('mythrill-active-character');
                    console.warn('Stored active character not found, cleared selection');
                    
                    // IMPROVED: Try to select the first available character as fallback
                    if (characters && characters.length > 0) {
                        const fallbackCharacter = characters[0];
                        const fallbackResult = await get().setActiveCharacter(fallbackCharacter.id);
                        if (fallbackResult) {
                            console.log(`[CharacterStore] Selected fallback character: ${fallbackResult.name}`);
                            return fallbackResult;
                        }
                    }
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
                class: character.class || '',
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
            const inventoryStore = getStore('inventoryStore');
            const inventoryState = inventoryStore.getState();
            inventoryState.clearInventory();
            // Clear currency as well
            inventoryState.updateCurrency({ platinum: 0, gold: 0, silver: 0, copper: 0 });
        } catch (error) {
            console.warn('Could not clear inventory:', error);
        }
    },

    debouncedSave: () => {
        if (characterAutoSaveTimer) {
            clearTimeout(characterAutoSaveTimer);
        }
        characterAutoSaveTimer = setTimeout(() => {
            get().saveCurrentCharacter();
        }, CHARACTER_AUTO_SAVE_DELAY);
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
            const inventoryStore = getStore('inventoryStore');
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
            talents: state.talents, // Include talent tree selections
            inventory: inventoryData, // Include inventory data
            updatedAt: new Date().toISOString()
        };

        get().updateCharacter(state.currentCharacterId, characterData);
    },

    clearError: () => set({ error: null }),

    // System health check and initialization
    initializeCharacterSystem: async () => {
        try {
            // Load characters first
            const characters = await get().loadCharacters();
            set({ characters }); // Ensure they are in state

            // Check for active character - pass the already loaded characters to avoid double load
            const activeCharacter = await get().loadActiveCharacter(characters);

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
});
