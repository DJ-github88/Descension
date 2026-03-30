/**
 * Advanced Real-time Synchronization Engine
 * 
 * This module provides comprehensive synchronization for all game elements:
 * - Character sheets (stats, equipment, inventory)
 * - Map state (fog of war, lighting, weather)
 * - Combat state (initiative, conditions, effects)
 * - UI state (windows, selections, cursors)
 */

const { v4: uuidv4 } = require('uuid');

class RealtimeSyncEngine {
  constructor(eventBatcher, deltaSync, optimizedFirebase) {
    this.eventBatcher = eventBatcher;
    this.deltaSync = deltaSync;
    this.optimizedFirebase = optimizedFirebase;
    
    // Sync categories with different priorities and update rates (reduced for player performance)
    this.syncCategories = {
      // Critical - reduced sync rate to prevent lag
      combat: { priority: 'critical', updateRate: 10, persistent: true },
      tokens: { priority: 'high', updateRate: 10, persistent: true },

      // High priority - much slower sync
      characters: { priority: 'high', updateRate: 5, persistent: true },
      inventory: { priority: 'high', updateRate: 3, persistent: true },

      // Normal priority - slow sync
      map: { priority: 'normal', updateRate: 2, persistent: true },
      ui: { priority: 'normal', updateRate: 2, persistent: false },

      // Low priority - very slow sync
      chat: { priority: 'low', updateRate: 1, persistent: true },
      settings: { priority: 'low', updateRate: 1, persistent: true }
    };

    // Room sync states
    this.roomStates = new Map(); // roomId -> complete game state
    this.syncTimers = new Map(); // roomId -> category timers
    this.pendingUpdates = new Map(); // roomId -> pending updates by category
    this.playerViewports = new Map(); // roomId -> playerId -> viewport data

    console.log('🔄 Advanced Real-time Sync Engine initialized');
  }

  /**
   * Check if room is already initialized
   */
  isRoomInitialized(roomId) {
    return this.roomStates.has(roomId);
  }

  /**
   * Initialize synchronization for a room
   */
  initializeRoom(roomId, initialState = {}) {
    // Prevent duplicate initialization
    if (this.isRoomInitialized(roomId)) {
      console.log(`🔄 Room ${roomId} already initialized for real-time sync`);
      return this.roomStates.get(roomId);
    }
    const completeState = {
      // Character data
      characters: initialState.characters || {},
      
      // Combat system
      combat: {
        isActive: false,
        currentTurn: null,
        turnOrder: [],
        round: 0,
        initiative: {},
        conditions: {},
        effects: {},
        ...initialState.combat
      },
      
      // Map and environment
      map: {
        backgrounds: [],
        activeBackgroundId: null,
        cameraPosition: { x: 0, y: 0 },
        zoomLevel: 1.0,
        fogOfWar: {},
        lighting: {},
        weather: null,
        ...initialState.map
      },
      
      // Tokens and creatures
      tokens: initialState.tokens || {},
      
      // Inventory systems
      inventory: {
        players: {},
        shared: {},
        loot: {},
        ...initialState.inventory
      },
      
      // UI synchronization
      ui: {
        windows: {},
        selections: {},
        cursors: {},
        notifications: [],
        ...initialState.ui
      },
      
      // Chat and communication
      chat: {
        messages: [],
        typing: {},
        ...initialState.chat
      },
      
      // Room settings
      settings: {
        permissions: {},
        preferences: {},
        ...initialState.settings
      }
    };

    this.roomStates.set(roomId, completeState);
    this.pendingUpdates.set(roomId, new Map());
    
    // Start sync timers for each category
    this.startSyncTimers(roomId);
    
    console.log(`🔄 Real-time sync initialized for room ${roomId}`);
    return completeState;
  }

  /**
   * Start synchronization timers for all categories
   */
  startSyncTimers(roomId) {
    const timers = new Map();
    
    for (const [category, config] of Object.entries(this.syncCategories)) {
      const interval = 1000 / config.updateRate; // Convert to milliseconds
      
      const timerId = setInterval(() => {
        this.processCategorySync(roomId, category);
      }, interval);
      
      timers.set(category, timerId);
    }
    
    this.syncTimers.set(roomId, timers);
  }

  /**
   * Update player viewport for selective sync
   */
  updatePlayerViewport(roomId, playerId, viewportData) {
    if (!this.playerViewports.has(roomId)) {
      this.playerViewports.set(roomId, new Map());
    }

    this.playerViewports.get(roomId).set(playerId, {
      ...viewportData,
      lastUpdated: Date.now()
    });
  }

  /**
   * Check if a position is visible to a player
   */
  isPositionVisibleToPlayer(roomId, playerId, position, visibilityRadius = 1000) {
    const roomViewports = this.playerViewports.get(roomId);
    if (!roomViewports) {return true;} // If no viewport data, assume visible

    const viewport = roomViewports.get(playerId);
    if (!viewport) {return true;} // If no viewport for player, assume visible

    const { cameraX, cameraY, zoomLevel, viewportWidth, viewportHeight } = viewport;

    // Calculate visible area bounds
    const halfWidth = (viewportWidth / zoomLevel) / 2;
    const halfHeight = (viewportHeight / zoomLevel) / 2;

    const leftBound = cameraX - halfWidth - visibilityRadius;
    const rightBound = cameraX + halfWidth + visibilityRadius;
    const topBound = cameraY - halfHeight - visibilityRadius;
    const bottomBound = cameraY + halfHeight + visibilityRadius;

    return position.x >= leftBound && position.x <= rightBound &&
           position.y >= topBound && position.y <= bottomBound;
  }

  /**
   * Filter tokens based on player visibility
   */
  filterTokensForPlayer(roomId, playerId, tokens) {
    const filteredTokens = {};

    for (const [tokenId, token] of Object.entries(tokens)) {
      if (this.isPositionVisibleToPlayer(roomId, playerId, token.position)) {
        filteredTokens[tokenId] = token;
      }
    }

    return filteredTokens;
  }

  /**
   * Filter map data based on player visibility
   */
  filterMapDataForPlayer(roomId, playerId, mapData) {
    // For now, send all map data - could be optimized later
    // Map data filtering would be complex due to dependencies
    return mapData;
  }

  /**
   * Update character data with real-time sync
   */
  updateCharacter(roomId, characterId, updates, playerId) {
    const state = this.roomStates.get(roomId);
    if (!state) {return false;}

    // Apply update to state
    if (!state.characters[characterId]) {
      state.characters[characterId] = {};
    }

    const oldCharacter = { ...state.characters[characterId] };
    state.characters[characterId] = {
      ...state.characters[characterId],
      ...updates,
      lastUpdatedBy: playerId,
      lastUpdatedAt: Date.now()
    };

    // Queue for synchronization
    this.queueUpdate(roomId, 'characters', {
      type: 'character_update',
      characterId: characterId,
      updates: updates,
      oldData: oldCharacter,
      playerId: playerId
    });

    return true;
  }

  /**
   * Update inventory with real-time sync
   */
  updateInventory(roomId, playerId, inventoryData, changeType = 'full') {
    const state = this.roomStates.get(roomId);
    if (!state) {return false;}

    if (!state.inventory.players[playerId]) {
      state.inventory.players[playerId] = { items: [], equipment: {} };
    }

    const oldInventory = { ...state.inventory.players[playerId] };
    
    switch (changeType) {
    case 'add_item':
      state.inventory.players[playerId].items.push(inventoryData.item);
      break;
    case 'remove_item':
      state.inventory.players[playerId].items = 
          state.inventory.players[playerId].items.filter(item => item.id !== inventoryData.itemId);
      break;
    case 'move_item': {
      const item = state.inventory.players[playerId].items.find(item => item.id === inventoryData.itemId);
      if (item) {
        item.position = inventoryData.newPosition;
      }
      break;
    }
    case 'equip_item':
      state.inventory.players[playerId].equipment[inventoryData.slot] = inventoryData.item;
      break;
    case 'full':
      state.inventory.players[playerId] = inventoryData;
      break;
    }

    // Queue for synchronization
    this.queueUpdate(roomId, 'inventory', {
      type: 'inventory_update',
      playerId: playerId,
      changeType: changeType,
      data: inventoryData,
      oldData: oldInventory
    });

    return true;
  }

  /**
   * Update combat state with real-time sync
   */
  updateCombat(roomId, combatUpdates, gmId) {
    const state = this.roomStates.get(roomId);
    if (!state) {return false;}

    const oldCombat = { ...state.combat };
    state.combat = {
      ...state.combat,
      ...combatUpdates,
      lastUpdatedBy: gmId,
      lastUpdatedAt: Date.now()
    };

    // Queue for immediate synchronization (critical priority)
    this.queueUpdate(roomId, 'combat', {
      type: 'combat_update',
      updates: combatUpdates,
      oldData: oldCombat,
      gmId: gmId
    });

    return true;
  }

  /**
   * Update map state with real-time sync
   */
  updateMap(roomId, mapUpdates, playerId) {
    const state = this.roomStates.get(roomId);
    if (!state) {return false;}

    const oldMap = { ...state.map };
    state.map = {
      ...state.map,
      ...mapUpdates,
      lastUpdatedBy: playerId,
      lastUpdatedAt: Date.now()
    };

    // Queue for synchronization
    this.queueUpdate(roomId, 'map', {
      type: 'map_update',
      updates: mapUpdates,
      oldData: oldMap,
      playerId: playerId
    });

    return true;
  }

  /**
   * Update UI state with real-time sync
   */
  updateUI(roomId, playerId, uiUpdates) {
    const state = this.roomStates.get(roomId);
    if (!state) {return false;}

    if (!state.ui.windows[playerId]) {
      state.ui.windows[playerId] = {};
    }

    const oldUI = { ...state.ui.windows[playerId] };
    state.ui.windows[playerId] = {
      ...state.ui.windows[playerId],
      ...uiUpdates,
      lastUpdatedAt: Date.now()
    };

    // Queue for synchronization (UI updates are not persistent)
    this.queueUpdate(roomId, 'ui', {
      type: 'ui_update',
      playerId: playerId,
      updates: uiUpdates,
      oldData: oldUI
    });

    return true;
  }

  /**
   * Add chat message with real-time sync
   */
  addChatMessage(roomId, message) {
    const state = this.roomStates.get(roomId);
    if (!state) {return false;}

    const enhancedMessage = {
      ...message,
      id: message.id || uuidv4(),
      timestamp: Date.now()
    };

    state.chat.messages.push(enhancedMessage);

    // Keep only last 100 messages in memory
    if (state.chat.messages.length > 100) {
      state.chat.messages = state.chat.messages.slice(-100);
    }

    // Queue for immediate synchronization
    this.queueUpdate(roomId, 'chat', {
      type: 'chat_message',
      message: enhancedMessage
    });

    return true;
  }

  /**
   * Queue update for synchronization
   */
  queueUpdate(roomId, category, updateData) {
    const pending = this.pendingUpdates.get(roomId);
    if (!pending) {return;}

    if (!pending.has(category)) {
      pending.set(category, []);
    }

    pending.get(category).push({
      ...updateData,
      timestamp: Date.now(),
      id: uuidv4()
    });
  }

  /**
   * Process synchronization for a specific category with selective sync
   */
  async processCategorySync(roomId, category) {
    const pending = this.pendingUpdates.get(roomId);
    if (!pending || !pending.has(category)) {return;}

    const updates = pending.get(category);
    if (updates.length === 0) {return;}

    // Get all updates for this category
    const categoryUpdates = updates.splice(0); // Remove all updates
    const config = this.syncCategories[category];
    const state = this.roomStates.get(roomId);

    try {
      // Create delta update
      const deltaUpdate = await this.deltaSync.createStateUpdate(
        roomId,
        state,
        {
          category: category,
          updates: categoryUpdates,
          timestamp: Date.now()
        }
      );

      // For selective sync categories, filter data per player
      if (category === 'tokens' || category === 'map') {
        await this.processSelectiveSync(roomId, category, categoryUpdates, config, deltaUpdate);
      } else {
        // For non-selective categories, send to entire room as before
        for (const update of categoryUpdates) {
          this.eventBatcher.addEvent(roomId, {
            type: `${category}_sync`,
            category: category,
            data: update,
            deltaUpdate: deltaUpdate
          }, config.priority);
        }
      }

      // Persist to Firebase if category requires it
      if (config.persistent && categoryUpdates.length > 0) {
        await this.optimizedFirebase.updateGameState(
          roomId,
          state,
          deltaUpdate?.delta
        );
      }

      console.log(`🔄 Synced ${categoryUpdates.length} ${category} updates for room ${roomId}`);

    } catch (error) {
      console.error(`❌ Failed to sync ${category} for room ${roomId}:`, error);

      // Re-queue failed updates
      pending.get(category).unshift(...categoryUpdates);
    }
  }

  /**
   * Process selective sync for categories that benefit from filtering
   */
  async processSelectiveSync(roomId, category, categoryUpdates, config, deltaUpdate) {
    const roomViewports = this.playerViewports.get(roomId) || new Map();

    // If no viewport data, fall back to room-wide sync
    if (roomViewports.size === 0) {
      for (const update of categoryUpdates) {
        this.eventBatcher.addEvent(roomId, {
          type: `${category}_sync`,
          category: category,
          data: update,
          deltaUpdate: deltaUpdate
        }, config.priority);
      }
      return;
    }

    // Process updates for each player based on their viewport
    for (const [playerId] of roomViewports) {
      const filteredUpdates = this.filterUpdatesForPlayer(category, categoryUpdates, roomId, playerId);

      // Only send updates if there are relevant changes for this player
      if (filteredUpdates.length > 0) {
        for (const update of filteredUpdates) {
          this.eventBatcher.addPlayerEvent(roomId, playerId, {
            type: `${category}_sync`,
            category: category,
            data: update,
            deltaUpdate: deltaUpdate
          }, config.priority);
        }
      }
    }
  }

  /**
   * Filter updates based on player visibility
   */
  filterUpdatesForPlayer(category, updates, roomId, playerId) {
    switch (category) {
    case 'tokens':
      return updates.filter(update => {
        if (update.type === 'token_move' && update.data && update.data.position) {
          return this.isPositionVisibleToPlayer(roomId, playerId, update.data.position);
        }
        // For other token updates, send them (they might be relevant)
        return true;
      });

    case 'map':
      // For map updates, currently send all (could be optimized later)
      return updates;

    default:
      return updates;
    }
  }

  /**
   * Get complete room state
   */
  getRoomState(roomId) {
    return this.roomStates.get(roomId);
  }

  /**
   * Get specific category state
   */
  getCategoryState(roomId, category) {
    const state = this.roomStates.get(roomId);
    return state ? state[category] : null;
  }

  /**
   * Force sync all categories for a room
   */
  async forceSyncAll(roomId) {
    const categories = Object.keys(this.syncCategories);
    const promises = categories.map(category => 
      this.processCategorySync(roomId, category)
    );

    await Promise.all(promises);
    console.log(`🚀 Force sync completed for room ${roomId}`);
  }

  /**
   * Get sync statistics for a room
   */
  getSyncStats(roomId) {
    const pending = this.pendingUpdates.get(roomId);
    if (!pending) {return null;}

    const stats = {};
    for (const [category, updates] of pending.entries()) {
      stats[category] = {
        pendingUpdates: updates.length,
        updateRate: this.syncCategories[category].updateRate,
        priority: this.syncCategories[category].priority,
        persistent: this.syncCategories[category].persistent
      };
    }

    return stats;
  }

  /**
   * Cleanup room synchronization
   */
  cleanupRoom(roomId) {
    // Clear timers
    const timers = this.syncTimers.get(roomId);
    if (timers) {
      for (const timerId of timers.values()) {
        clearInterval(timerId);
      }
      this.syncTimers.delete(roomId);
    }

    // Clear state and pending updates
    this.roomStates.delete(roomId);
    this.pendingUpdates.delete(roomId);

    console.log(`🧹 Real-time sync cleanup completed for room ${roomId}`);
  }

  /**
   * Update sync configuration for a category
   */
  updateSyncConfig(category, newConfig) {
    if (this.syncCategories[category]) {
      this.syncCategories[category] = {
        ...this.syncCategories[category],
        ...newConfig
      };

      // Restart timers for all rooms if update rate changed
      if (newConfig.updateRate) {
        for (const roomId of this.syncTimers.keys()) {
          const timers = this.syncTimers.get(roomId);
          if (timers.has(category)) {
            clearInterval(timers.get(category));
            
            const interval = 1000 / newConfig.updateRate;
            const timerId = setInterval(() => {
              this.processCategorySync(roomId, category);
            }, interval);
            
            timers.set(category, timerId);
          }
        }
      }

      console.log(`⚙️ Updated sync config for ${category}:`, newConfig);
    }
  }

  /**
   * Get system-wide sync metrics
   */
  getSystemMetrics() {
    const totalRooms = this.roomStates.size;
    let totalPendingUpdates = 0;
    const categoryBreakdown = {};

    for (const pending of this.pendingUpdates.values()) {
      for (const [category, updates] of pending.entries()) {
        totalPendingUpdates += updates.length;
        categoryBreakdown[category] = (categoryBreakdown[category] || 0) + updates.length;
      }
    }

    return {
      totalRooms,
      totalPendingUpdates,
      categoryBreakdown,
      syncCategories: this.syncCategories
    };
  }
}

module.exports = RealtimeSyncEngine;
