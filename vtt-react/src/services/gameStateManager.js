import { saveCompleteGameState, loadCompleteGameState, updateGameStateSection } from './roomService';

class GameStateManager {
  constructor() {
    this.currentRoomId = null;
    this.isAutoSaveEnabled = true;
    this.autoSaveInterval = 30000;
    this.autoSaveTimer = null;
    this.lastSaveTime = 0;
    this.pendingChanges = new Set();
    this.isLoading = false;
    this.isSaving = false;
  }

  async initialize(roomId, enableAutoSave = true) {
    this.currentRoomId = roomId;
    this.isAutoSaveEnabled = enableAutoSave;

    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }

    if (enableAutoSave) {
      await this.loadGameState();
      this.setupStoreListeners();
      this.startAutoSave();
    }
  }

  setupStoreListeners() {
    const useCreatureStore = require('../store/creatureStore').default;
    const useLevelEditorStore = require('../store/levelEditorStore').default;
    const useGameStore = require('../store/gameStore').default;
    const useCombatStore = require('../store/combatStore').default;
    const useGridItemStore = require('../store/gridItemStore').default;
    const useTravelStore = require('../store/travelStore').default;
    const useBuffStore = require('../store/buffStore').default;
    const useDebuffStore = require('../store/debuffStore').default;
    const useContainerStore = require('../store/containerStore').default;
    const useCharacterTokenStore = require('../store/characterTokenStore').default;

    this.unsubscribeCreatures = useCreatureStore.subscribe((state, prevState) => {
      if (state.tokens !== prevState.tokens || state.creatures !== prevState.creatures) {
        this.markChanged('tokens');
      }
    });

    this.unsubscribeLevelEditor = useLevelEditorStore.subscribe((state, prevState) => {
      if (state.terrainData !== prevState.terrainData ||
        state.environmentalObjects !== prevState.environmentalObjects ||
        state.wallData !== prevState.wallData ||
        state.fogOfWarData !== prevState.fogOfWarData ||
        state.fogOfWarPaths !== prevState.fogOfWarPaths ||
        state.fogErasePaths !== prevState.fogErasePaths ||
        state.windowOverlays !== prevState.windowOverlays ||
        state.drawingPaths !== prevState.drawingPaths ||
        state.drawingLayers !== prevState.drawingLayers ||
        state.lightSources !== prevState.lightSources ||
        state.dndElements !== prevState.dndElements ||
        state.weatherEffects !== prevState.weatherEffects ||
        state.tokenVisionRanges !== prevState.tokenVisionRanges ||
        state.dynamicFogEnabled !== prevState.dynamicFogEnabled ||
        state.respectLineOfSight !== prevState.respectLineOfSight ||
        state.playerMemories !== prevState.playerMemories ||
        state.exploredAreas !== prevState.exploredAreas ||
        state.exploredCircles !== prevState.exploredCircles ||
        state.exploredPolygons !== prevState.exploredPolygons) {
        this.markChanged('levelEditor');
      }
    });

    this.unsubscribeGame = useGameStore.subscribe((state, prevState) => {
      if (state.cameraX !== prevState.cameraX ||
        state.cameraY !== prevState.cameraY ||
        state.zoomLevel !== prevState.zoomLevel ||
        state.backgrounds !== prevState.backgrounds ||
        state.activeBackgroundId !== prevState.activeBackgroundId ||
        state.gridSize !== prevState.gridSize ||
        state.gridOffsetX !== prevState.gridOffsetX ||
        state.gridOffsetY !== prevState.gridOffsetY ||
        state.gridType !== prevState.gridType ||
        state.gridLineColor !== prevState.gridLineColor ||
        state.gridLineThickness !== prevState.gridLineThickness) {
        this.markChanged('mapData');
      }
    });

    this.unsubscribeCombat = useCombatStore.subscribe((state, prevState) => {
      if (state.isInCombat !== prevState.isInCombat ||
        state.turnOrder !== prevState.turnOrder ||
        state.currentTurn !== prevState.currentTurn ||
        state.round !== prevState.round) {
        this.markChanged('combat');
      }
    });

    this.unsubscribeGridItems = useGridItemStore.subscribe((state, prevState) => {
      if (state.gridItems !== prevState.gridItems) {
        this.markChanged('inventory');
      }
    });

    this.unsubscribeTravel = useTravelStore.subscribe((state, prevState) => {
      const travelKeys = [
        'currentBiome', 'weather', 'weatherRoll', 'weatherDuration', 'weatherRemaining',
        'transportMode', 'terrainType', 'partyExhaustion', 'clock', 'activeHour',
        'navStatus', 'journeyGoal', 'hourLog', 'encounterLog', 'lastEncounter'
      ];
      const changed = travelKeys.some(k => state[k] !== prevState[k]);
      if (changed) {
        this.markChanged('travel');
      }
    });

    this.unsubscribeBuffs = useBuffStore.subscribe((state, prevState) => {
      if (state.activeBuffs !== prevState.activeBuffs) {
        this.markChanged('buffs');
      }
    });

    this.unsubscribeDebuffs = useDebuffStore.subscribe((state, prevState) => {
      if (state.activeDebuffs !== prevState.activeDebuffs) {
        this.markChanged('debuffs');
      }
    });

    this.unsubscribeContainers = useContainerStore.subscribe((state, prevState) => {
      if (state.containers !== prevState.containers) {
        this.markChanged('containers');
      }
    });

    this.unsubscribeCharacterTokens = useCharacterTokenStore.subscribe((state, prevState) => {
      if (state.characterTokens !== prevState.characterTokens) {
        this.markChanged('characterTokens');
      }
    });
  }

  async loadGameState() {
    if (!this.currentRoomId || this.isLoading) return;

    this.isLoading = true;

    try {
      const gameState = await loadCompleteGameState(this.currentRoomId);

      if (gameState && Object.keys(gameState).length > 0) {
        await this.applyGameStateToStores(gameState);
      }
    } catch (error) {
      if (error.code === 'permission-denied' || error.message.includes('Missing or insufficient permissions')) {
        console.warn('[GameStateManager] Firebase permission denied for loading. Continuing with empty state.');
        return;
      }

      console.error('[GameStateManager] Error loading game state:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async applyGameStateToStores(gameState) {
    try {
      if (gameState.tokens && Object.keys(gameState.tokens).length > 0) {
        const useCreatureStore = require('../store/creatureStore').default;
        const creatureStore = useCreatureStore.getState();
        Object.values(gameState.tokens).forEach(tokenData => {
          const normalizedToken = {
            ...tokenData,
            id: tokenData.id || tokenData.creatureId
          };
          creatureStore.loadToken(normalizedToken);
        });
      }

      if (gameState.levelEditor) {
        const useLevelEditorStore = require('../store/levelEditorStore').default;
        const levelEditorStore = useLevelEditorStore.getState();
        const { levelEditor } = gameState;

        if (levelEditor.terrainData) levelEditorStore.setTerrainData(levelEditor.terrainData);
        if (levelEditor.environmentalObjects) levelEditorStore.setEnvironmentalObjects(levelEditor.environmentalObjects);
        if (levelEditor.wallData) levelEditorStore.setWallData(levelEditor.wallData);
        if (levelEditor.fogOfWarData) levelEditorStore.setFogOfWarData(levelEditor.fogOfWarData);
        if (levelEditor.drawingPaths) levelEditorStore.setDrawingPaths(levelEditor.drawingPaths);
        if (levelEditor.drawingLayers) levelEditorStore.setDrawingLayers(levelEditor.drawingLayers);
        if (levelEditor.lightSources) levelEditorStore.setLightSources(levelEditor.lightSources);
        if (levelEditor.fogOfWarPaths) levelEditorStore.setFogOfWarPaths(levelEditor.fogOfWarPaths);
        if (levelEditor.fogErasePaths) levelEditorStore.setFogErasePaths(levelEditor.fogErasePaths);
        if (levelEditor.windowOverlays) levelEditorStore.setWindowOverlays(levelEditor.windowOverlays);
        if (levelEditor.dndElements) levelEditorStore.setDndElements(levelEditor.dndElements);
        if (levelEditor.dynamicFogEnabled !== undefined) levelEditorStore.setDynamicFogEnabled(levelEditor.dynamicFogEnabled);
        if (levelEditor.respectLineOfSight !== undefined) levelEditorStore.setRespectLineOfSight(levelEditor.respectLineOfSight);
      }

      if (gameState.weatherEffects) {
        const useLevelEditorStore = require('../store/levelEditorStore').default;
        const levelEditorStore = useLevelEditorStore.getState();
        if (levelEditorStore.setWeatherEffect) {
          levelEditorStore.setWeatherEffect(
            gameState.weatherEffects.type || 'none',
            gameState.weatherEffects.intensity ?? 0.5,
            gameState.weatherEffects.enabled ?? false
          );
        }
      }

      if (gameState.tokenVisionRanges) {
        const useLevelEditorStore = require('../store/levelEditorStore').default;
        useLevelEditorStore.setState({ tokenVisionRanges: gameState.tokenVisionRanges });
      }

      if (gameState.mapData) {
        const useGameStore = require('../store/gameStore').default;
        const gameStore = useGameStore.getState();
        const { mapData } = gameState;

        if (mapData.cameraPosition) {
          gameStore.setCameraPosition(mapData.cameraPosition.x, mapData.cameraPosition.y);
        }
        if (mapData.zoomLevel) {
          gameStore.setZoomLevel(mapData.zoomLevel);
        }
        if (mapData.backgrounds) {
          gameStore.setBackgrounds(mapData.backgrounds);
        }
        if (mapData.activeBackgroundId) {
          gameStore.setActiveBackground(mapData.activeBackgroundId);
        }
      }

      if (gameState.combat) {
        const useCombatStore = require('../store/combatStore').default;
        const combatStore = useCombatStore.getState();
        if (gameState.combat.isActive) {
          combatStore.setIsInCombat(gameState.combat.isActive);
          if (gameState.combat.turnOrder) {
            combatStore.setTurnOrder(gameState.combat.turnOrder);
          }
          if (gameState.combat.currentTurn !== null) {
            combatStore.setCurrentTurn(gameState.combat.currentTurn);
          }
          if (gameState.combat.round) {
            combatStore.setRound(gameState.combat.round);
          }
        }
      }

      if (gameState.inventory) {
        const useGridItemStore = require('../store/gridItemStore').default;
        const gridItemStore = useGridItemStore.getState();
        if (gameState.inventory.droppedItems) {
          const gridItems = Object.values(gameState.inventory.droppedItems);
          gridItemStore.setGridItems(gridItems);
        }
      }

      if (gameState.buffs && Array.isArray(gameState.buffs) && gameState.buffs.length > 0) {
        const useBuffStore = require('../store/buffStore').default;
        useBuffStore.setState({ activeBuffs: gameState.buffs });
      }

      if (gameState.debuffs && Array.isArray(gameState.debuffs) && gameState.debuffs.length > 0) {
        const useDebuffStore = require('../store/debuffStore').default;
        useDebuffStore.setState({ activeDebuffs: gameState.debuffs });
      }

      if (gameState.containers && Array.isArray(gameState.containers) && gameState.containers.length > 0) {
        const useContainerStore = require('../store/containerStore').default;
        useContainerStore.setState({ containers: gameState.containers });
      }

      if (gameState.characterTokens && Object.keys(gameState.characterTokens).length > 0) {
        const useCharacterTokenStore = require('../store/characterTokenStore').default;
        const characterTokenStore = useCharacterTokenStore.getState();
        const tokens = Array.isArray(gameState.characterTokens)
          ? gameState.characterTokens
          : Object.values(gameState.characterTokens);
        tokens.forEach(token => {
          if (characterTokenStore.addCharacterTokenFromServer) {
            characterTokenStore.addCharacterTokenFromServer(token.id, token.position, token.playerId);
          }
        });
      }

      if (gameState.characters && Object.keys(gameState.characters).length > 0) {
        const useCreatureStore = require('../store/creatureStore').default;
        const creatureStore = useCreatureStore.getState();
        if (creatureStore.setCreatures) {
          creatureStore.setCreatures(Object.values(gameState.characters));
        }
      }

      if (gameState.playerMemories) {
        const useLevelEditorStore = require('../store/levelEditorStore').default;
        const levelEditorStore = useLevelEditorStore.getState();
        levelEditorStore.setPlayerMemories(gameState.playerMemories);
      }

      if (gameState.exploredAreas || gameState.exploredCircles || gameState.exploredPolygons) {
        const useLevelEditorStore = require('../store/levelEditorStore').default;
        const levelEditorStore = useLevelEditorStore.getState();
        if (gameState.exploredAreas) levelEditorStore.setExploredAreas(gameState.exploredAreas);
      }

      if (gameState.travel) {
        const useTravelStore = require('../store/travelStore').default;
        const travelStore = useTravelStore.getState();
        travelStore.importState(gameState.travel);
      }

    } catch (error) {
      console.error('[GameStateManager] Error applying game state to stores:', error);
    }
  }

  collectGameStateFromStores() {
    try {
      const useCreatureStore = require('../store/creatureStore').default;
      const useLevelEditorStore = require('../store/levelEditorStore').default;
      const useGameStore = require('../store/gameStore').default;
      const useCombatStore = require('../store/combatStore').default;
      const useGridItemStore = require('../store/gridItemStore').default;
      const useTravelStore = require('../store/travelStore').default;
      const useBuffStore = require('../store/buffStore').default;
      const useDebuffStore = require('../store/debuffStore').default;
      const useContainerStore = require('../store/containerStore').default;
      const useCharacterTokenStore = require('../store/characterTokenStore').default;

      const creatureStore = useCreatureStore.getState();
      const levelEditorStore = useLevelEditorStore.getState();
      const gameStore = useGameStore.getState();
      const combatStore = useCombatStore.getState();
      const gridItemStore = useGridItemStore.getState();
      const travelStore = useTravelStore.getState();
      const buffStore = useBuffStore.getState();
      const debuffStore = useDebuffStore.getState();
      const containerStore = useContainerStore.getState();
      const characterTokenStore = useCharacterTokenStore.getState();

      const gameState = {
        tokens: creatureStore.tokens.reduce((acc, token) => {
          acc[token.id] = token;
          return acc;
        }, {}),

        characterTokens: characterTokenStore.characterTokens.reduce((acc, token) => {
          acc[token.id] = token;
          return acc;
        }, {}),

        levelEditor: {
          terrainData: levelEditorStore.terrainData || {},
          environmentalObjects: levelEditorStore.environmentalObjects || [],
          wallData: levelEditorStore.wallData || {},
          dndElements: levelEditorStore.dndElements || [],
          fogOfWarData: levelEditorStore.fogOfWarData || {},
          fogOfWarPaths: levelEditorStore.fogOfWarPaths || [],
          fogErasePaths: levelEditorStore.fogErasePaths || [],
          windowOverlays: levelEditorStore.windowOverlays || {},
          drawingPaths: levelEditorStore.drawingPaths || [],
          drawingLayers: levelEditorStore.drawingLayers || [],
          lightSources: levelEditorStore.lightSources || {},
          dynamicFogEnabled: levelEditorStore.dynamicFogEnabled,
          respectLineOfSight: levelEditorStore.respectLineOfSight
        },

        mapData: {
          backgrounds: gameStore.backgrounds || [],
          activeBackgroundId: gameStore.activeBackgroundId,
          cameraPosition: {
            x: gameStore.cameraX || 0,
            y: gameStore.cameraY || 0
          },
          zoomLevel: gameStore.zoomLevel || 1.0,
          gridSettings: {
            size: gameStore.gridSize || 50,
            offsetX: gameStore.gridOffsetX || 0,
            offsetY: gameStore.gridOffsetY || 0,
            type: gameStore.gridType || 'square',
            color: gameStore.gridLineColor || '#000000',
            thickness: gameStore.gridLineThickness || 2
          }
        },

        combat: {
          isActive: combatStore.isInCombat || false,
          currentTurn: combatStore.currentTurn || null,
          turnOrder: combatStore.turnOrder || [],
          round: combatStore.round || 0
        },

        inventory: {
          droppedItems: gridItemStore.gridItems.reduce((acc, item) => {
            acc[item.id] = item;
            return acc;
          }, {}),
          lootBags: {}
        },

        characters: creatureStore.creatures.reduce((acc, creature) => {
          acc[creature.id] = creature;
          return acc;
        }, {}),

        buffs: (buffStore.activeBuffs || []).map(b => ({
          ...b,
          duration: Math.max(0, Math.ceil((b.endTime - Date.now()) / 1000))
        })),

        debuffs: (debuffStore.activeDebuffs || []).map(d => ({
          ...d,
          duration: Math.max(0, Math.ceil((d.endTime - Date.now()) / 1000))
        })),

        containers: containerStore.containers || [],

        fogOfWar: levelEditorStore.fogOfWarData || {},

        lighting: {
          globalIllumination: 0.3,
          lightSources: levelEditorStore.lightSources || {}
        },

        playerMemories: levelEditorStore.playerMemories || {},
        currentPlayerId: levelEditorStore.currentPlayerId || null,

        exploredAreas: levelEditorStore.exploredAreas || {},
        exploredCircles: levelEditorStore.exploredCircles || [],
        exploredPolygons: levelEditorStore.exploredPolygons || [],

        weatherEffects: levelEditorStore.weatherEffects || {
          type: 'none',
          intensity: 0.5,
          enabled: false
        },

        tokenVisionRanges: levelEditorStore.tokenVisionRanges || {},

        travel: travelStore.getExportState()
      };

      return gameState;
    } catch (error) {
      console.error('[GameStateManager] Error collecting game state from stores:', error);
      return {};
    }
  }

  async saveGameState(force = false) {
    if (!this.isAutoSaveEnabled || !this.currentRoomId || this.isSaving) return;

    if (!force && this.pendingChanges.size === 0) {
      return;
    }

    this.isSaving = true;

    try {
      const gameState = this.collectGameStateFromStores();
      await saveCompleteGameState(this.currentRoomId, gameState);

      this.lastSaveTime = Date.now();
      this.pendingChanges.clear();
    } catch (error) {
      if (error.code === 'permission-denied' || error.message.includes('Missing or insufficient permissions')) {
        console.warn('[GameStateManager] Firebase permission denied for saving. Disabling auto-save.');
        this.isAutoSaveEnabled = false;
        this.stopAutoSave();
        return;
      }

      console.error('[GameStateManager] Error saving game state:', error);
    } finally {
      this.isSaving = false;
    }
  }

  markChanged(section = 'general') {
    this.pendingChanges.add(section);
  }

  startAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }

    this.autoSaveTimer = setInterval(() => {
      this.saveGameState();
    }, this.autoSaveInterval);
  }

  stopAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  async cleanup() {
    if (this.currentRoomId && this.pendingChanges.size > 0) {
      await this.saveGameState(true);
    }

    const unsubscribes = [
      'unsubscribeCreatures', 'unsubscribeLevelEditor', 'unsubscribeGame',
      'unsubscribeCombat', 'unsubscribeGridItems', 'unsubscribeTravel',
      'unsubscribeBuffs', 'unsubscribeDebuffs', 'unsubscribeContainers',
      'unsubscribeCharacterTokens'
    ];
    unsubscribes.forEach(key => {
      if (this[key]) {
        this[key]();
        this[key] = null;
      }
    });

    this.stopAutoSave();
    this.currentRoomId = null;
    this.pendingChanges.clear();
  }

  getStatus() {
    return {
      roomId: this.currentRoomId,
      isAutoSaveEnabled: this.isAutoSaveEnabled,
      pendingChanges: Array.from(this.pendingChanges),
      lastSaveTime: this.lastSaveTime,
      isLoading: this.isLoading,
      isSaving: this.isSaving
    };
  }
}

const gameStateManager = new GameStateManager();

export default gameStateManager;
