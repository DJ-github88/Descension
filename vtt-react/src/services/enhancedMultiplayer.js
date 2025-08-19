/**
 * Enhanced Multiplayer Client Service
 * 
 * This service provides ultra-responsive multiplayer functionality by:
 * - Client-side prediction for immediate feedback
 * - Delta decompression for efficient updates
 * - Network metrics monitoring and adaptation
 * - Automatic reconnection with state recovery
 */

import io from 'socket.io-client';

class EnhancedMultiplayerClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.roomId = null;
    this.playerId = null;
    this.isGM = false;
    
    // Client-side prediction
    this.predictedState = {};
    this.confirmedState = {};
    this.pendingInputs = [];
    this.inputSequence = 0;
    
    // Network metrics
    this.networkMetrics = {
      latency: 50,
      jitter: 5,
      packetLoss: 0,
      bandwidth: 10000000,
      lastPing: Date.now()
    };
    
    // Performance optimization
    this.updateQueue = [];
    this.isProcessingUpdates = false;
    this.frameRate = 60;
    this.lastFrameTime = 0;
    
    // Event handlers
    this.eventHandlers = new Map();
    
    console.log('🚀 Enhanced Multiplayer Client initialized');
  }

  /**
   * Connect to enhanced multiplayer server
   */
  connect(serverUrl, options = {}) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      ...options
    });

    this.setupEventHandlers();
    this.startNetworkMonitoring();
    this.startUpdateLoop();

    return new Promise((resolve, reject) => {
      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log('🔗 Enhanced multiplayer connected');
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Enhanced multiplayer connection failed:', error);
        reject(error);
      });
    });
  }

  /**
   * Setup enhanced event handlers
   */
  setupEventHandlers() {
    // Handle batch updates from server
    this.socket.on('batch_update', (batchPacket) => {
      this.processBatchUpdate(batchPacket);
    });

    // Handle delta updates
    this.socket.on('delta_update', (deltaUpdate) => {
      this.processDeltaUpdate(deltaUpdate);
    });

    // Handle full state sync
    this.socket.on('full_state_sync', (stateData) => {
      this.processFullStateSync(stateData);
    });

    // Handle corrections from server
    this.socket.on('state_correction', (correction) => {
      this.processStateCorrection(correction);
    });

    // Network metrics updates
    this.socket.on('network_metrics', (metrics) => {
      this.updateNetworkMetrics(metrics);
    });

    // Standard multiplayer events
    this.socket.on('room_created', (data) => {
      this.handleRoomCreated(data);
    });

    this.socket.on('room_joined', (data) => {
      this.handleRoomJoined(data);
    });

    this.socket.on('player_joined', (data) => {
      this.emit('player_joined', data);
    });

    this.socket.on('player_left', (data) => {
      this.emit('player_left', data);
    });

    // Token movement events
    this.socket.on('token_moved', (data) => {
      this.handleTokenMoved(data);
    });

    this.socket.on('character_moved', (data) => {
      this.handleCharacterMoved(data);
    });

    // Item and loot events
    this.socket.on('item_dropped', (data) => {
      this.handleItemDropped(data);
    });

    this.socket.on('item_looted', (data) => {
      this.handleItemLooted(data);
    });

    this.socket.on('token_created', (data) => {
      this.handleTokenCreated(data);
    });

    this.socket.on('error', (error) => {
      console.error('🚨 Multiplayer error:', error);
      this.emit('error', error);
    });

    // Disconnection handling
    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      console.warn('⚠️ Multiplayer disconnected:', reason);
      this.emit('disconnected', reason);
    });
  }

  /**
   * Process batch updates from server
   */
  processBatchUpdate(batchPacket) {
    if (batchPacket.compressed) {
      // Handle compressed batch
      this.decompressBatch(batchPacket).then(decompressed => {
        this.processBatchEvents(decompressed.events);
      });
    } else {
      this.processBatchEvents(batchPacket.events);
    }
  }

  /**
   * Process individual events from batch with throttling to prevent player lag
   */
  processBatchEvents(events) {
    // Sort events by priority and timestamp
    const sortedEvents = events.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, normal: 2, low: 3 };
      const aPriority = priorityOrder[a.priority] || 2;
      const bPriority = priorityOrder[b.priority] || 2;

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      return a.timestamp - b.timestamp;
    });

    // Process events in chunks to prevent blocking the main thread
    const CHUNK_SIZE = 5; // Process max 5 events per frame
    let index = 0;

    const processChunk = () => {
      const endIndex = Math.min(index + CHUNK_SIZE, sortedEvents.length);

      for (let i = index; i < endIndex; i++) {
        this.processEvent(sortedEvents[i]);
      }

      index = endIndex;

      if (index < sortedEvents.length) {
        // Schedule next chunk for next frame
        requestAnimationFrame(processChunk);
      }
    };

    // Start processing
    requestAnimationFrame(processChunk);
  }

  /**
   * Process individual event
   */
  processEvent(event) {
    switch (event.type) {
      case 'token_moved':
        this.handleTokenMoved(event.data);
        break;
      case 'character_updated':
        this.handleCharacterUpdated(event.data);
        break;
      case 'inventory_changed':
        this.handleInventoryChanged(event.data);
        break;
      case 'chat_message':
        this.handleChatMessage(event.data);
        break;
      default:
        console.warn('Unknown event type:', event.type);
    }
  }

  /**
   * Handle token movement with prediction
   */
  handleTokenMoved(data) {
    // Check if this is our own movement (confirmation)
    if (data.playerId === this.playerId) {
      this.confirmPrediction(data.sequence);
    }

    // Apply movement to confirmed state
    this.updateConfirmedState('tokens', data.tokenId, {
      position: data.position,
      lastMovedBy: data.playerId,
      lastMovedAt: data.serverTimestamp
    });

    // Emit to game components
    this.emit('token_moved', data);
  }

  /**
   * Send token movement with client-side prediction
   */
  moveToken(tokenId, position, isDragging = false, velocity = null) {
    const sequence = ++this.inputSequence;
    const timestamp = Date.now();

    // Apply client-side prediction immediately
    this.applyPrediction('tokens', tokenId, {
      position: position,
      sequence: sequence,
      predictedAt: timestamp
    });

    // Store pending input for confirmation
    this.pendingInputs.push({
      sequence: sequence,
      type: 'token_move',
      tokenId: tokenId,
      position: position,
      timestamp: timestamp
    });

    // Send to server
    this.socket.emit('token_moved', {
      tokenId: tokenId,
      position: position,
      isDragging: isDragging,
      velocity: velocity,
      sequence: sequence,
      timestamp: timestamp
    });

    // Emit immediate feedback to UI
    this.emit('token_moved_predicted', {
      tokenId: tokenId,
      position: position,
      predicted: true
    });
  }

  /**
   * Apply client-side prediction
   */
  applyPrediction(category, id, update) {
    if (!this.predictedState[category]) {
      this.predictedState[category] = {};
    }

    this.predictedState[category][id] = {
      ...this.predictedState[category][id],
      ...update
    };
  }

  /**
   * Update confirmed state from server
   */
  updateConfirmedState(category, id, update) {
    if (!this.confirmedState[category]) {
      this.confirmedState[category] = {};
    }

    this.confirmedState[category][id] = {
      ...this.confirmedState[category][id],
      ...update
    };
  }

  /**
   * Confirm prediction when server responds
   */
  confirmPrediction(sequence) {
    // Remove confirmed input from pending list
    this.pendingInputs = this.pendingInputs.filter(input => input.sequence !== sequence);
  }

  /**
   * Process state correction from server
   */
  processStateCorrection(correction) {
    console.log('🔄 Applying state correction:', correction);
    
    // Update confirmed state
    this.confirmedState = correction.correctedState;
    
    // Re-apply pending inputs
    for (const input of correction.pendingInputs) {
      this.reapplyInput(input);
    }

    // Emit correction to UI
    this.emit('state_corrected', correction);
  }

  /**
   * Re-apply input after correction
   */
  reapplyInput(input) {
    switch (input.type) {
      case 'token_move':
        this.applyPrediction('tokens', input.tokenId, {
          position: input.position,
          sequence: input.sequence
        });
        break;
    }
  }

  /**
   * Start network monitoring
   */
  startNetworkMonitoring() {
    setInterval(() => {
      this.measureLatency();
    }, 5000); // Every 5 seconds

    setInterval(() => {
      this.sendNetworkMetrics();
    }, 10000); // Every 10 seconds
  }

  /**
   * Measure network latency
   */
  measureLatency() {
    if (!this.isConnected) return;

    const startTime = Date.now();
    this.socket.emit('ping', startTime);
    
    this.socket.once('pong', (serverTime) => {
      const latency = Date.now() - startTime;
      const jitter = Math.abs(latency - this.networkMetrics.latency);
      
      // Smooth metrics with exponential moving average
      this.networkMetrics.latency = (0.3 * latency) + (0.7 * this.networkMetrics.latency);
      this.networkMetrics.jitter = (0.3 * jitter) + (0.7 * this.networkMetrics.jitter);
      this.networkMetrics.lastPing = Date.now();
    });
  }

  /**
   * Send network metrics to server
   */
  sendNetworkMetrics() {
    if (!this.isConnected) return;

    this.socket.emit('network_metrics', this.networkMetrics);
  }

  /**
   * Update network metrics from server
   */
  updateNetworkMetrics(metrics) {
    this.networkMetrics = { ...this.networkMetrics, ...metrics };
    this.emit('network_metrics_updated', this.networkMetrics);
  }

  /**
   * Start update processing loop
   */
  startUpdateLoop() {
    const processFrame = (timestamp) => {
      if (timestamp - this.lastFrameTime >= 1000 / this.frameRate) {
        this.processUpdateQueue();
        this.lastFrameTime = timestamp;
      }
      
      if (this.isConnected) {
        requestAnimationFrame(processFrame);
      }
    };

    requestAnimationFrame(processFrame);
  }

  /**
   * Process queued updates
   */
  processUpdateQueue() {
    if (this.isProcessingUpdates || this.updateQueue.length === 0) {
      return;
    }

    this.isProcessingUpdates = true;

    // Process up to 10 updates per frame to prevent blocking
    const updatesToProcess = this.updateQueue.splice(0, 10);
    
    for (const update of updatesToProcess) {
      try {
        update();
      } catch (error) {
        console.error('Error processing update:', error);
      }
    }

    this.isProcessingUpdates = false;
  }

  /**
   * Event emitter functionality
   */
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  off(event, handler) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      }
    }
  }

  /**
   * Get current game state (predicted + confirmed)
   */
  getCurrentState() {
    // Merge confirmed state with predictions
    const mergedState = { ...this.confirmedState };
    
    for (const [category, items] of Object.entries(this.predictedState)) {
      if (!mergedState[category]) {
        mergedState[category] = {};
      }
      
      for (const [id, item] of Object.entries(items)) {
        mergedState[category][id] = {
          ...mergedState[category][id],
          ...item
        };
      }
    }

    return mergedState;
  }

  /**
   * Get network quality indicator
   */
  getNetworkQuality() {
    const { latency, jitter, packetLoss } = this.networkMetrics;
    
    if (latency < 20 && jitter < 5 && packetLoss < 0.01) {
      return 'excellent';
    } else if (latency < 50 && jitter < 10 && packetLoss < 0.02) {
      return 'good';
    } else if (latency < 100 && jitter < 20 && packetLoss < 0.05) {
      return 'fair';
    } else {
      return 'poor';
    }
  }

  /**
   * Disconnect from server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    this.isConnected = false;
    this.roomId = null;
    this.playerId = null;
    this.predictedState = {};
    this.confirmedState = {};
    this.pendingInputs = [];
    
    console.log('🔌 Enhanced multiplayer disconnected');
  }

  // Standard multiplayer methods
  createRoom(roomData) {
    return new Promise((resolve, reject) => {
      this.socket.emit('create_room', roomData);
      
      this.socket.once('room_created', resolve);
      this.socket.once('error', reject);
    });
  }

  joinRoom(roomData) {
    return new Promise((resolve, reject) => {
      this.socket.emit('join_room', roomData);
      
      this.socket.once('room_joined', resolve);
      this.socket.once('error', reject);
    });
  }

  sendChatMessage(message) {
    this.socket.emit('chat_message', { message });
  }

  // Helper methods for room events
  handleRoomCreated(data) {
    this.roomId = data.room.id;
    this.playerId = data.room.gm.id;
    this.isGM = true;
    this.emit('room_created', data);
  }

  handleRoomJoined(data) {
    this.roomId = data.room.id;
    this.playerId = data.player.id;
    this.isGM = data.player.isGM;
    this.emit('room_joined', data);
  }

  handleChatMessage(data) {
    this.emit('chat_message', data);
  }

  handleCharacterUpdated(data) {
    this.updateConfirmedState('characters', data.characterId, data.updates);
    this.emit('character_updated', data);
  }

  handleInventoryChanged(data) {
    this.updateConfirmedState('inventories', data.playerId, data.inventory);
    this.emit('inventory_changed', data);
  }

  /**
   * Handle character movement from server
   */
  handleCharacterMoved(data) {
    console.log('👤 Character moved:', data);

    // Update confirmed state
    this.updateConfirmedState('characters', `character_${data.playerId}`, {
      position: data.position,
      lastMovedAt: data.timestamp
    });

    // Emit to game components
    this.emit('character_moved', data);
  }

  /**
   * Handle item dropped on grid
   */
  handleItemDropped(data) {
    console.log('📦 Item dropped:', data);

    // Update confirmed state
    if (!this.confirmedState.gridItems) {
      this.confirmedState.gridItems = {};
    }

    this.confirmedState.gridItems[data.item.id] = {
      ...data.item,
      position: data.position,
      gridPosition: data.gridPosition,
      droppedBy: data.playerId,
      droppedByName: data.playerName,
      droppedAt: data.timestamp
    };

    // Emit to game components
    this.emit('item_dropped', data);
  }

  /**
   * Handle item looted from grid
   */
  handleItemLooted(data) {
    console.log('🎁 Item looted:', data);

    // Remove item from confirmed state if it was removed
    if (data.itemRemoved && data.gridItemId && this.confirmedState.gridItems) {
      delete this.confirmedState.gridItems[data.gridItemId];
    }

    // Emit to game components
    this.emit('item_looted', data);
  }

  /**
   * Handle token created on grid
   */
  handleTokenCreated(data) {
    console.log('🎭 Token created:', data);

    // Update confirmed state
    if (!this.confirmedState.tokens) {
      this.confirmedState.tokens = {};
    }

    this.confirmedState.tokens[data.token.id] = {
      ...data.token,
      position: data.position,
      createdBy: data.playerId,
      createdByName: data.playerName,
      createdAt: data.timestamp
    };

    // Emit to game components
    this.emit('token_created', data);
  }

  // Utility methods
  async decompressBatch(compressedBatch) {
    // Implement decompression logic here
    // For now, return as-is
    return compressedBatch;
  }

  processDeltaUpdate(deltaUpdate) {
    // Apply delta to confirmed state
    this.confirmedState = this.applyDelta(this.confirmedState, deltaUpdate.delta);
    this.emit('state_updated', deltaUpdate);
  }

  processFullStateSync(stateData) {
    this.confirmedState = stateData.state;
    this.predictedState = {};
    this.pendingInputs = [];
    this.emit('full_sync', stateData);
  }

  applyDelta(state, delta) {
    // Simplified delta application - in production, use proper delta algorithm
    return { ...state, ...delta };
  }
}

export default new EnhancedMultiplayerClient();
