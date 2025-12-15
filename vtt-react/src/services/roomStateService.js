// Room State Service - Manages per-room and per-player state persistence
import { v4 as uuidv4 } from 'uuid';
import campaignService from './campaignService';

const ROOM_STATE_PREFIX = 'mythrill-room-state-';
const PLAYER_STATE_PREFIX = 'mythrill-player-state-';

/**
 * Room State Service
 * Manages comprehensive state persistence for rooms and players
 */
class RoomStateService {
  /**
   * Generate unique room ID
   */
  generateRoomId() {
    return `room_${Date.now()}_${uuidv4()}`;
  }

  /**
   * Save room state (GM-controlled, shared across all players)
   */
  saveRoomState(roomId, campaignId, roomState) {
    try {
      const stateKey = `${ROOM_STATE_PREFIX}${roomId}`;
      const stateToSave = {
        roomId,
        campaignId,
        ...roomState,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(stateKey, JSON.stringify(stateToSave));

      // Associate room with campaign
      if (campaignId) {
        campaignService.addRoomToCampaign(campaignId, roomId);
      }
    } catch (error) {
      console.error('Error saving room state:', error);
    }
  }

  /**
   * Load room state
   */
  loadRoomState(roomId) {
    try {
      const stateKey = `${ROOM_STATE_PREFIX}${roomId}`;
      const stored = localStorage.getItem(stateKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading room state:', error);
      return null;
    }
  }

  /**
   * Save player-specific state for a room
   */
  savePlayerState(roomId, characterId, playerState) {
    try {
      const stateKey = `${PLAYER_STATE_PREFIX}${roomId}_${characterId}`;
      const stateToSave = {
        roomId,
        characterId,
        ...playerState,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(stateKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Error saving player state:', error);
    }
  }

  /**
   * Load player-specific state for a room
   */
  loadPlayerState(roomId, characterId) {
    try {
      const stateKey = `${PLAYER_STATE_PREFIX}${roomId}_${characterId}`;
      const stored = localStorage.getItem(stateKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading player state:', error);
      return null;
    }
  }

  /**
   * Collect complete room state from all stores
   */
  async collectRoomState() {
    try {
      const [
        gameStoreModule,
        creatureStoreModule,
        gridItemStoreModule,
        levelEditorStoreModule,
        combatStoreModule,
        inventoryStoreModule,
        questStoreModule
      ] = await Promise.all([
        import('../store/gameStore'),
        import('../store/creatureStore'),
        import('../store/gridItemStore'),
        import('../store/levelEditorStore'),
        import('../store/combatStore'),
        import('../store/inventoryStore'),
        import('../store/questStore')
      ]);

      const gameStore = gameStoreModule.default.getState();
      const creatureStore = creatureStoreModule.default.getState();
      const gridItemStore = gridItemStoreModule.default.getState();
      const levelEditorStore = levelEditorStoreModule.default.getState();
      const combatStore = combatStoreModule.default.getState();
      const inventoryStore = inventoryStoreModule.default.getState();
      const questStore = questStoreModule.default.getState();

      return {
        // Map and camera
        mapData: {
          backgrounds: gameStore.backgrounds || [],
          activeBackgroundId: gameStore.activeBackgroundId || null,
          backgroundImage: gameStore.backgroundImage || null,
          backgroundImageUrl: gameStore.backgroundImageUrl || '',
          cameraX: gameStore.cameraX || 0,
          cameraY: gameStore.cameraY || 0,
          zoomLevel: gameStore.zoomLevel || 1.0,
          gridSize: gameStore.gridSize || 50,
          gridOffsetX: gameStore.gridOffsetX || 0,
          gridOffsetY: gameStore.gridOffsetY || 0
        },

        // Level editor data
        levelEditor: {
          terrainData: levelEditorStore.terrainData || {},
          environmentalObjects: levelEditorStore.environmentalObjects || [],
          wallData: levelEditorStore.wallData || {},
          dndElements: levelEditorStore.dndElements || [],
          fogOfWarData: levelEditorStore.fogOfWarData || {},
          fogOfWarPaths: levelEditorStore.fogOfWarPaths || [],
          fogErasePaths: levelEditorStore.fogErasePaths || [],
          exploredAreas: levelEditorStore.exploredAreas || {},
          drawingPaths: levelEditorStore.drawingPaths || [],
          drawingLayers: levelEditorStore.drawingLayers || [],
          lightSources: levelEditorStore.lightSources || {},
          dynamicFogEnabled: levelEditorStore.dynamicFogEnabled !== false,
          respectLineOfSight: levelEditorStore.respectLineOfSight !== false
        },

        // Tokens and creatures
        tokens: creatureStore.tokens || [],

        // Items on grid
        gridItems: gridItemStore.gridItems || [],

        // Combat state
        combat: {
          isActive: combatStore.isInCombat || false,
          currentTurn: combatStore.currentTurn,
          turnOrder: combatStore.turnOrder || [],
          round: combatStore.round || 0
        },

        // Notes (GM notes, player notes, shared notes)
        notes: {
          gmNotes: levelEditorStore.environmentalObjects?.filter(obj => obj.type === 'gmNotes') || [],
          playerNotes: [],
          sharedNotes: []
        }
      };
    } catch (error) {
      console.error('Error collecting room state:', error);
      return {};
    }
  }

  /**
   * Collect player-specific state
   */
  async collectPlayerState(characterId) {
    try {
      const [
        inventoryStoreModule,
        questStoreModule,
        actionBarModule,
        characterStoreModule,
        levelEditorStoreModule
      ] = await Promise.all([
        import('../store/inventoryStore'),
        import('../store/questStore'),
        import('../hooks/useActionBarPersistence'),
        import('../store/characterStore'),
        import('../store/levelEditorStore')
      ]);

      const inventoryStore = inventoryStoreModule.default.getState();
      const questStore = questStoreModule.default.getState();
      const characterStore = characterStoreModule.default.getState();
      const levelEditorStore = levelEditorStoreModule.default.getState();

      // Load action bar state
      let actionBarState = null;
      try {
        const actionBarKey = `mythrill-actionbar-${characterId}`;
        const stored = localStorage.getItem(actionBarKey);
        actionBarState = stored ? JSON.parse(stored) : null;
      } catch (error) {
        console.warn('Could not load action bar state:', error);
      }

      // Get character data
      const character = characterStore.characters.find(c => c.id === characterId);

      return {
        // Inventory state (per character, per room)
        inventory: {
          items: inventoryStore.items || [],
          currency: inventoryStore.currency || { platinum: 0, gold: 0, silver: 0, copper: 0 },
          encumbranceState: inventoryStore.encumbranceState || 'normal'
        },

        // Quest progress
        quests: questStore.quests || [],
        questProgress: questStore.questProgress || {},

        // Action bar configuration
        actionBar: actionBarState,

        // Character level
        level: character?.level || 1,

        // Explored areas (player-specific)
        exploredAreas: levelEditorStore.exploredAreas || {},

        // Chat history (per player, per room)
        chatHistory: [] // Will be populated from room chat filtered by player

      };
    } catch (error) {
      console.error('Error collecting player state:', error);
      return {};
    }
  }

  /**
   * Apply room state to stores
   */
  async applyRoomState(roomState) {
    try {
      const [
        gameStoreModule,
        creatureStoreModule,
        gridItemStoreModule,
        levelEditorStoreModule,
        combatStoreModule
      ] = await Promise.all([
        import('../store/gameStore'),
        import('../store/creatureStore'),
        import('../store/gridItemStore'),
        import('../store/levelEditorStore'),
        import('../store/combatStore')
      ]);

      const gameStore = gameStoreModule.default.getState();
      const creatureStore = creatureStoreModule.default.getState();
      const gridItemStore = gridItemStoreModule.default.getState();
      const levelEditorStore = levelEditorStoreModule.default.getState();
      const combatStore = combatStoreModule.default.getState();

      // Apply map data
      if (roomState.mapData) {
        if (roomState.mapData.backgrounds) gameStore.setBackgrounds(roomState.mapData.backgrounds);
        if (roomState.mapData.activeBackgroundId) gameStore.setActiveBackground(roomState.mapData.activeBackgroundId);
        if (roomState.mapData.cameraX !== undefined && roomState.mapData.cameraY !== undefined) {
          gameStore.setCameraPosition(roomState.mapData.cameraX, roomState.mapData.cameraY);
        }
        if (roomState.mapData.zoomLevel) gameStore.setZoomLevel(roomState.mapData.zoomLevel);
      }

      // Apply level editor data
      if (roomState.levelEditor) {
        const { levelEditor } = roomState;
        if (levelEditor.terrainData) levelEditorStore.setTerrainData(levelEditor.terrainData);
        if (levelEditor.environmentalObjects) levelEditorStore.setEnvironmentalObjects(levelEditor.environmentalObjects);
        if (levelEditor.wallData) levelEditorStore.setWallData(levelEditor.wallData);
        if (levelEditor.fogOfWarData) levelEditorStore.setFogOfWarData(levelEditor.fogOfWarData);
        if (levelEditor.exploredAreas) levelEditorStore.setExploredAreas(levelEditor.exploredAreas);
        if (levelEditor.drawingPaths) levelEditorStore.setDrawingPaths(levelEditor.drawingPaths);
        if (levelEditor.drawingLayers) levelEditorStore.setDrawingLayers(levelEditor.drawingLayers);
        if (levelEditor.lightSources) levelEditorStore.setLightSources(levelEditor.lightSources);
        if (levelEditor.dynamicFogEnabled !== undefined) {
          levelEditorStore.setDynamicFogEnabled(levelEditor.dynamicFogEnabled);
        }
        if (levelEditor.respectLineOfSight !== undefined) {
          levelEditorStore.setRespectLineOfSight(levelEditor.respectLineOfSight);
        }
      }

      // Apply tokens
      if (roomState.tokens) {
        creatureStore.setTokens(roomState.tokens);
      }

      // Apply grid items
      if (roomState.gridItems) {
        gridItemStore.setGridItems(roomState.gridItems);
      }

      // Apply combat state
      if (roomState.combat) {
        if (roomState.combat.isActive) {
          combatStore.setIsInCombat(true);
          if (roomState.combat.turnOrder) combatStore.setTurnOrder(roomState.combat.turnOrder);
          if (roomState.combat.currentTurn !== null) combatStore.setCurrentTurn(roomState.combat.currentTurn);
          if (roomState.combat.round) combatStore.setRound(roomState.combat.round);
        }
      }
    } catch (error) {
      console.error('Error applying room state:', error);
    }
  }

  /**
   * Apply player state to stores
   */
  async applyPlayerState(playerState, characterId) {
    try {
      const [
        inventoryStoreModule,
        questStoreModule,
        characterStoreModule,
        levelEditorStoreModule
      ] = await Promise.all([
        import('../store/inventoryStore'),
        import('../store/questStore'),
        import('../store/characterStore'),
        import('../store/levelEditorStore')
      ]);

      const inventoryStore = inventoryStoreModule.default.getState();
      const questStore = questStoreModule.default.getState();
      const levelEditorStore = levelEditorStoreModule.default.getState();

      // Apply inventory
      if (playerState.inventory) {
        inventoryStore.clearInventory();
        if (playerState.inventory.items) {
          playerState.inventory.items.forEach(item => {
            try {
              inventoryStore.addItem(item);
            } catch (error) {
              console.warn('Failed to add item to inventory:', error);
            }
          });
        }
        if (playerState.inventory.currency) {
          inventoryStore.updateCurrency(playerState.inventory.currency);
        }
      }

      // Apply quests
      if (playerState.quests) {
        questStore.setQuests(playerState.quests);
      }
      if (playerState.questProgress) {
        questStore.setQuestProgress(playerState.questProgress);
      }

      // Apply action bar
      if (playerState.actionBar) {
        try {
          const actionBarKey = `mythrill-actionbar-${characterId}`;
          localStorage.setItem(actionBarKey, JSON.stringify(playerState.actionBar));
        } catch (error) {
          console.warn('Could not save action bar state:', error);
        }
      }

      // Apply explored areas (player-specific)
      if (playerState.exploredAreas) {
        // Merge with room explored areas (player sees what they've explored)
        const currentExplored = levelEditorStore.exploredAreas || {};
        const mergedExplored = { ...currentExplored, ...playerState.exploredAreas };
        levelEditorStore.setExploredAreas(mergedExplored);
      }
    } catch (error) {
      console.error('Error applying player state:', error);
    }
  }

  /**
   * Clear room state (for world builder mode)
   */
  clearRoomStateForWorldBuilder() {
    try {
      const [
        creatureStoreModule,
        gridItemStoreModule,
        levelEditorStoreModule,
        characterTokenStoreModule,
        gameStoreModule
      ] = [
        require('../store/creatureStore').default,
        require('../store/gridItemStore').default,
        require('../store/levelEditorStore').default,
        require('../store/characterTokenStore').default,
        require('../store/gameStore').default
      ];

      // Clear tokens (but keep creature library) - force clear
      const creatureStore = creatureStoreModule.getState();
      if (creatureStore.clearTokens) {
        creatureStore.clearTokens();
      } else if (creatureStore.setTokens) {
        creatureStore.setTokens([]);
      }
      // Force update by setting empty array directly
      creatureStoreModule.setState({ tokens: [] });

      // Clear character tokens - force clear
      const characterTokenStore = characterTokenStoreModule.getState();
      if (characterTokenStore.clearCharacterTokens) {
        characterTokenStore.clearCharacterTokens();
      } else if (characterTokenStore.setCharacterTokens) {
        characterTokenStore.setCharacterTokens([]);
      }
      // Force update by setting empty array directly
      characterTokenStoreModule.setState({ characterTokens: [] });

      // Clear grid items - force clear
      const gridItemStore = gridItemStoreModule.getState();
      if (gridItemStore.clearGrid) {
        gridItemStore.clearGrid();
      } else if (gridItemStore.setGridItems) {
        gridItemStore.setGridItems([]);
      }
      // Force update by setting empty array directly
      gridItemStoreModule.setState({ gridItems: [] });

      // Clear level editor placed items (walls, objects, terrain, fog, etc.)
      // Complete reset for fresh world builder canvas
      const levelEditorStore = levelEditorStoreModule.getState();
      
      // Default drawing layers - must be preserved so terrain can render
      const defaultDrawingLayers = [
        { id: 'background', name: 'Background', visible: true, locked: false },
        { id: 'terrain', name: 'Terrain', visible: true, locked: false },
        { id: 'drawings', name: 'Drawings', visible: true, locked: false },
        { id: 'walls', name: 'Walls', visible: true, locked: false },
        { id: 'objects', name: 'Objects', visible: true, locked: false },
        { id: 'lighting', name: 'Lighting', visible: true, locked: false },
        { id: 'fog', name: 'Fog of War', visible: true, locked: false },
        { id: 'grid', name: 'Grid', visible: true, locked: false },
        { id: 'overlay', name: 'Overlay', visible: true, locked: false }
      ];
      
      if (levelEditorStore.setEnvironmentalObjects) {
        levelEditorStore.setEnvironmentalObjects([]);
      }
      if (levelEditorStore.setWallData) {
        levelEditorStore.setWallData({});
      }
      if (levelEditorStore.setDndElements) {
        levelEditorStore.setDndElements([]);
      }
      if (levelEditorStore.setDrawingPaths) {
        levelEditorStore.setDrawingPaths([]);
      }
      if (levelEditorStore.setDrawingLayers) {
        // Reset to default layers instead of clearing - terrain layer must exist for rendering
        levelEditorStore.setDrawingLayers(defaultDrawingLayers);
      }
      if (levelEditorStore.setLightSources) {
        levelEditorStore.setLightSources({});
      }
      // Clear terrain data
      if (levelEditorStore.setTerrainData) {
        levelEditorStore.setTerrainData({});
      }
      if (levelEditorStore.clearAllTerrain) {
        levelEditorStore.clearAllTerrain();
      }
      // Clear fog data
      if (levelEditorStore.setFogData) {
        levelEditorStore.setFogData({});
      }
      if (levelEditorStore.clearAllFog) {
        levelEditorStore.clearAllFog();
      }
      // Force update by setting empty arrays/objects directly, but preserve default drawing layers
      levelEditorStoreModule.setState({
        environmentalObjects: [],
        wallData: {},
        dndElements: [],
        drawingPaths: [],
        drawingLayers: defaultDrawingLayers, // Reset to defaults instead of empty array
        lightSources: {},
        terrainData: {},
        fogData: {},
        exploredAreas: {}
      });

      // Reset camera position and zoom for fresh view
      const gameStore = gameStoreModule.getState();
      if (gameStore.setCameraPosition) {
        gameStore.setCameraPosition(0, 0); // Reset to center/origin
      }
      if (gameStore.setZoomLevel) {
        gameStore.setZoomLevel(1.0); // Reset to default zoom
      }
      if (gameStore.setPlayerZoom) {
        gameStore.setPlayerZoom(1.0); // Reset player zoom
      }
      // Force update camera/zoom state directly
      gameStoreModule.setState({
        cameraX: 0,
        cameraY: 0,
        zoomLevel: 1.0,
        playerZoom: 1.0
      });

      // Clear any level editor persistence cache for sandbox mode
      try {
        const levelEditorPersistenceService = require('../services/levelEditorPersistenceService').default;
        // Clear cache for any test/sandbox room IDs
        const cacheKeys = ['test', 'sandbox', 'world-builder', 'global'];
        cacheKeys.forEach(key => {
          try {
            levelEditorPersistenceService.deleteLevelEditorState(key);
          } catch (err) {
            // Ignore errors if key doesn't exist
          }
        });
      } catch (err) {
        // Ignore if persistence service not available
      }
      
      console.log('🧹 World Builder Sandbox: Cleared all tokens, items, walls, terrain, fog, objects, and reset camera/zoom');
    } catch (error) {
      console.error('Error clearing room state for world builder:', error);
    }
  }
}

// Create singleton instance
const roomStateService = new RoomStateService();

export default roomStateService;

