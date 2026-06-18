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

export const createMultiplayerSlice = (set, get) => ({
    // Helper to sync character with multiplayer
    syncWithMultiplayer: () => {
        const state = get();
        const gameStore = useGameStore.getState();
        const userId = getCurrentUserId(); // Get Firebase UID once

        if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
            // CRITICAL: Use socket.id as the playerId so receiving clients can identify which party member to update
            const socketId = gameStore.multiplayerSocket.id;
            const serverPlayerId = gameStore.currentPlayer?.id; // Server-assigned UUID
            const characterId = state.currentCharacterId || state.id || userId || 'player-character';
            const roomId = gameStore.multiplayerRoom?.id;

            if (!roomId) {
                console.warn('âš ï¸ syncWithMultiplayer: No roomId available. Sync aborted.', {
                    socketId: socketId,
                    userId: userId,
                    gameIsInMultiplayer: gameStore.isInMultiplayer,
                    hasSocket: !!gameStore.multiplayerSocket
                });
                return;
            }

            console.log('ðŸ“¤ Syncing character with multiplayer:', {
                characterId: characterId,
                name: state.name,
                class: state.class,
                race: state.race,
                subrace: state.subrace,
                userId: userId,
                roomId: roomId,
                socketConnected: gameStore.multiplayerSocket.connected,
                socketId: gameStore.multiplayerSocket.id
            });

            gameStore.multiplayerSocket.emit('character_updated', {
                roomId: roomId,
                characterId,
                character: {
                    playerId: socketId, // CRITICAL: Socket.io ID for socket-based lookups
                    serverPlayerId: serverPlayerId, // CRITICAL: Server UUID for UUID-based lookups
                    userId: userId, // CRITICAL: Firebase UID - MOST RELIABLE IDENTIFIER
                    name: state.name,
                    baseName: state.baseName,
                    race: state.race,
                    subrace: state.subrace,
                    raceDisplayName: state.raceDisplayName,
                    class: state.class,
                    level: state.level,
                    experience: state.experience,
                    alignment: state.alignment,
                    stats: state.stats,
                    health: state.health,
                    mana: state.mana,
                    actionPoints: state.actionPoints,
                    tempHealth: state.tempHealth || 0,
                    tempMana: state.tempMana || 0,
                    tempActionPoints: state.tempActionPoints || 0,
                    classResource: state.classResource,
                    equipment: state.equipment,
                    resistances: state.resistances,
                    spellPower: state.spellPower,
                    lore: state.lore,
                    tokenSettings: state.tokenSettings,
                    skillRanks: state.skillRanks,
                    skillProgress: state.skillProgress,
                    class_spells: state.class_spells,
                    path: state.path,
                    pathDisplayName: state.pathDisplayName,
                    selectedAbility: state.selectedAbility,
                    background: state.background,
                    backgroundDisplayName: state.backgroundDisplayName,
                    talents: state.talents
                },
                senderSocketId: socketId,
                userId: userId, // Also at top level for convenience
                syncSource: 'characterStore'
            });
        }
    },

    // Helper to sync resources with multiplayer
    // FIXED: Now emits 'character_resource_updated' with absolute values instead of deltas
    // This matches the format that MultiplayerApp.jsx handler expects
    syncResourcesWithMultiplayer: (deltas) => {
        const state = get();
        const gameStore = useGameStore.getState();
        const stableUserId = getCurrentUserId();

        if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
            const socketId = gameStore.multiplayerSocket.id;
            const serverPlayerId = gameStore.currentPlayer?.id;
            const roomId = gameStore.multiplayerRoom?.id;

            if (!roomId) {
                console.warn('syncResourcesWithMultiplayer: No roomId available');
                return;
            }

            // Emit each resource change as a separate event with absolute values
            // This matches the format PartyHUD uses, which MultiplayerApp.jsx handles correctly
            if (deltas && Object.keys(deltas).length > 0) {
                Object.entries(deltas).forEach(([resourceType, delta]) => {
                    const resourceData = state[resourceType] || { current: 0, max: 0 };

                    const eventData = {
                        roomId: roomId,
                        playerId: serverPlayerId || socketId,
                        userId: stableUserId, // CRITICAL: Use stable Firebase UID for reliable identification
                        socketId: socketId,
                        playerName: state.name,
                        resource: resourceType,
                        current: resourceData.current,
                        max: resourceData.max,
                        temp: state[`temp${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}`] || 0,
                        adjustment: delta,
                        senderSocketId: socketId,
                        characterId: state.currentCharacterId || state.id,
                        timestamp: Date.now()
                    };

                    // CRITICAL: For classResource, send the full object to preserve stacks, charges, etc.
                    if (resourceType === 'classResource') {
                        eventData.classResource = state.classResource;
                        console.log('ðŸ“¤ characterStore.syncResourcesWithMultiplayer - classResource:', {
                            resourceType,
                            classResource: state.classResource,
                            eventData: {
                                ...eventData,
                                classResource: 'included above'
                            }
                        });
                    }

                    gameStore.multiplayerSocket.emit('character_resource_updated', eventData);
                });
            }
        }
    },
});
