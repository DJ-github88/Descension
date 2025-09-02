// Game State Manager - Handles automatic saving and loading of persistent room state
import { saveCompleteGameState, loadCompleteGameState, updateGameStateSection } from './roomService';
import useCreatureStore from '../store/creatureStore';
import useLevelEditorStore from '../store/levelEditorStore';
import useGameStore from '../store/gameStore';
import useCombatStore from '../store/combatStore';
import useGridItemStore from '../store/gridItemStore';

class GameStateManager {
  constructor() {
    this.currentRoomId = null;
    this.isAutoSaveEnabled = true;
    this.autoSaveInterval = 30000; // 30 seconds
    this.autoSaveTimer = null;
    this.lastSaveTime = 0;
    this.pendingChanges = new Set();
    this.isLoading = false;
    this.isSaving = false;
  }

  /**
   * Initialize game state manager for a room
   * @param {string} roomId - Room ID
   * @param {boolean} enableAutoSave - Whether to enable auto-save
   */
  async initialize(roomId, enableAutoSave = true) {
    console.log('🎮 Initializing GameStateManager for room:', roomId);

    this.currentRoomId = roomId;
    this.isAutoSaveEnabled = enableAutoSave;

    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }

    // Load existing game state
    await this.loadGameState();

    // Set up store change listeners for auto-save triggers
    if (this.isAutoSaveEnabled) {
      this.setupStoreListeners();
      this.startAutoSave();
    }
  }

  /**
   * Set up listeners for store changes to trigger saves
   */
  setupStoreListeners() {
    // Listen for token changes
    const creatureStore = useCreatureStore.getState();
    this.unsubscribeCreatures = useCreatureStore.subscribe((state, prevState) => {
      if (state.tokens !== prevState.tokens) {
        this.markChanged('tokens');
      }
    });

    // Listen for level editor changes
    const levelEditorStore = useLevelEditorStore.getState();
    this.unsubscribeLevelEditor = useLevelEditorStore.subscribe((state, prevState) => {
      if (state.terrainData !== prevState.terrainData ||
          state.environmentalObjects !== prevState.environmentalObjects ||
          state.wallData !== prevState.wallData ||
          state.fogOfWarData !== prevState.fogOfWarData ||
          state.drawingPaths !== prevState.drawingPaths ||
          state.lightSources !== prevState.lightSources) {
        this.markChanged('levelEditor');
      }
    });

    // Listen for game state changes (camera, backgrounds)
    const gameStore = useGameStore.getState();
    this.unsubscribeGame = useGameStore.subscribe((state, prevState) => {
      if (state.cameraX !== prevState.cameraX ||
          state.cameraY !== prevState.cameraY ||
          state.zoomLevel !== prevState.zoomLevel ||
          state.backgrounds !== prevState.backgrounds ||
          state.activeBackgroundId !== prevState.activeBackgroundId) {
        this.markChanged('mapData');
      }
    });

    // Listen for combat changes
    const combatStore = useCombatStore.getState();
    this.unsubscribeCombat = useCombatStore.subscribe((state, prevState) => {
      if (state.isInCombat !== prevState.isInCombat ||
          state.turnOrder !== prevState.turnOrder ||
          state.currentTurn !== prevState.currentTurn ||
          state.round !== prevState.round) {
        this.markChanged('combat');
      }
    });

    // Listen for inventory changes
    const gridItemStore = useGridItemStore.getState();
    this.unsubscribeGridItems = useGridItemStore.subscribe((state, prevState) => {
      if (state.gridItems !== prevState.gridItems) {
        this.markChanged('inventory');
      }
    });

    console.log('📡 Store listeners set up for auto-save');
  }

  /**
   * Load complete game state from Firebase and apply to stores
   */
  async loadGameState() {
    if (!this.currentRoomId || this.isLoading) return;

    this.isLoading = true;
    console.log('📥 Loading game state for room:', this.currentRoomId);

    try {
      const gameState = await loadCompleteGameState(this.currentRoomId);

      if (gameState && Object.keys(gameState).length > 0) {
        await this.applyGameStateToStores(gameState);
        console.log('✅ Game state loaded and applied successfully');
      } else {
        console.log('📝 No existing game state found, starting fresh');
      }
    } catch (error) {
      // Check if this is a permission error
      if (error.code === 'permission-denied' || error.message.includes('Missing or insufficient permissions')) {
        console.warn('⚠️ Firebase permission denied for game state loading. This is expected for socket-only room joins. Continuing with empty state.');
        // Don't retry permission errors to prevent spam
        return;
      }

      console.error('❌ Error loading game state:', error);
      // Continue with empty state rather than failing
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Apply loaded game state to all relevant stores
   * @param {Object} gameState - Complete game state object
   */
  async applyGameStateToStores(gameState) {
    try {
      // Apply creature/token data
      if (gameState.tokens && Object.keys(gameState.tokens).length > 0) {
        const creatureStore = useCreatureStore.getState();
        const tokens = Object.values(gameState.tokens).map(token => ({
          ...token,
          id: token.id || token.creatureId
        }));
        creatureStore.setTokens(tokens);
      }

      // Apply level editor data
      if (gameState.levelEditor) {
        const levelEditorStore = useLevelEditorStore.getState();
        const { levelEditor } = gameState;
        
        if (levelEditor.terrainData) levelEditorStore.setTerrainData(levelEditor.terrainData);
        if (levelEditor.environmentalObjects) levelEditorStore.setEnvironmentalObjects(levelEditor.environmentalObjects);
        if (levelEditor.wallData) levelEditorStore.setWallData(levelEditor.wallData);
        if (levelEditor.fogOfWarData) levelEditorStore.setFogOfWarData(levelEditor.fogOfWarData);
        if (levelEditor.drawingPaths) levelEditorStore.setDrawingPaths(levelEditor.drawingPaths);
        if (levelEditor.drawingLayers) levelEditorStore.setDrawingLayers(levelEditor.drawingLayers);
        if (levelEditor.lightSources) levelEditorStore.setLightSources(levelEditor.lightSources);
      }

      // Apply game data (camera, backgrounds, etc.)
      if (gameState.mapData) {
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

      // Apply combat state
      if (gameState.combat) {
        const combatStore = useCombatStore.getState();
        if (gameState.combat.isActive) {
          // Restore combat state carefully
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

      // Apply inventory/grid items
      if (gameState.inventory) {
        const gridItemStore = useGridItemStore.getState();
        if (gameState.inventory.droppedItems) {
          // Convert dropped items back to grid items
          const gridItems = Object.values(gameState.inventory.droppedItems);
          gridItemStore.setGridItems(gridItems);
        }
      }

    } catch (error) {
      console.error('❌ Error applying game state to stores:', error);
    }
  }

  /**
   * Collect current game state from all stores
   * @returns {Object} - Complete game state object
   */
  collectGameStateFromStores() {
    try {
      const creatureStore = useCreatureStore.getState();
      const levelEditorStore = useLevelEditorStore.getState();
      const gameStore = useGameStore.getState();
      const combatStore = useCombatStore.getState();
      const gridItemStore = useGridItemStore.getState();

      const gameState = {
        // Tokens and creatures
        tokens: creatureStore.tokens.reduce((acc, token) => {
          acc[token.id] = token;
          return acc;
        }, {}),

        // Level editor data
        levelEditor: {
          terrainData: levelEditorStore.terrainData || [],
          environmentalObjects: levelEditorStore.environmentalObjects || [],
          wallData: levelEditorStore.wallData || [],
          dndElements: levelEditorStore.dndElements || [],
          fogOfWarData: levelEditorStore.fogOfWarData || [],
          drawingPaths: levelEditorStore.drawingPaths || [],
          drawingLayers: levelEditorStore.drawingLayers || [],
          lightSources: levelEditorStore.lightSources || []
        },

        // Map and camera data
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
            color: 'rgba(212, 175, 55, 0.8)',
            thickness: 2
          }
        },

        // Combat state
        combat: {
          isActive: combatStore.isInCombat || false,
          currentTurn: combatStore.currentTurn,
          turnOrder: combatStore.turnOrder || [],
          round: combatStore.round || 0
        },

        // Inventory and dropped items
        inventory: {
          droppedItems: gridItemStore.gridItems.reduce((acc, item) => {
            acc[item.id] = item;
            return acc;
          }, {}),
          lootBags: {} // TODO: Implement loot bags
        },

        // Character data
        characters: creatureStore.creatures.reduce((acc, creature) => {
          acc[creature.id] = creature;
          return acc;
        }, {}),

        // Fog of war
        fogOfWar: levelEditorStore.fogOfWarData || {},

        // Lighting
        lighting: {
          globalIllumination: 0.3,
          lightSources: levelEditorStore.lightSources || []
        },

        // Notes (placeholder for future implementation)
        notes: {
          gmNotes: [],
          playerNotes: [],
          sharedNotes: []
        }
      };

      return gameState;
    } catch (error) {
      console.error('❌ Error collecting game state from stores:', error);
      return {};
    }
  }

  /**
   * Save current game state to Firebase
   * @param {boolean} force - Force save even if no changes detected
   */
  async saveGameState(force = false) {
    if (!this.currentRoomId || this.isSaving) return;

    if (!force && this.pendingChanges.size === 0) {
      return; // No changes to save
    }

    this.isSaving = true;
    console.log('💾 Saving game state for room:', this.currentRoomId);

    try {
      const gameState = this.collectGameStateFromStores();
      await saveCompleteGameState(this.currentRoomId, gameState);
      
      this.lastSaveTime = Date.now();
      this.pendingChanges.clear();
      console.log('✅ Game state saved successfully');
    } catch (error) {
      console.error('❌ Error saving game state:', error);
    } finally {
      this.isSaving = false;
    }
  }

  /**
   * Mark that changes have been made and need saving
   * @param {string} section - Section that changed
   */
  markChanged(section = 'general') {
    this.pendingChanges.add(section);
  }

  /**
   * Start auto-save timer
   */
  startAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }

    this.autoSaveTimer = setInterval(() => {
      this.saveGameState();
    }, this.autoSaveInterval);

    console.log('🔄 Auto-save started with interval:', this.autoSaveInterval / 1000, 'seconds');
  }

  /**
   * Stop auto-save timer
   */
  stopAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
    console.log('⏹️ Auto-save stopped');
  }

  /**
   * Cleanup when leaving room
   */
  async cleanup() {
    console.log('🧹 Cleaning up GameStateManager');

    // Save final state
    if (this.currentRoomId && this.pendingChanges.size > 0) {
      await this.saveGameState(true);
    }

    // Unsubscribe from store listeners
    if (this.unsubscribeCreatures) {
      this.unsubscribeCreatures();
      this.unsubscribeCreatures = null;
    }
    if (this.unsubscribeLevelEditor) {
      this.unsubscribeLevelEditor();
      this.unsubscribeLevelEditor = null;
    }
    if (this.unsubscribeGame) {
      this.unsubscribeGame();
      this.unsubscribeGame = null;
    }
    if (this.unsubscribeCombat) {
      this.unsubscribeCombat();
      this.unsubscribeCombat = null;
    }
    if (this.unsubscribeGridItems) {
      this.unsubscribeGridItems();
      this.unsubscribeGridItems = null;
    }

    this.stopAutoSave();
    this.currentRoomId = null;
    this.pendingChanges.clear();
  }

  /**
   * Get current status
   */
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

// Create singleton instance
const gameStateManager = new GameStateManager();

export default gameStateManager;
