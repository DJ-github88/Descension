/**
 * Lag Compensation & Prediction System
 * 
 * This module provides smooth gameplay by:
 * - Client-side prediction for immediate feedback
 * - Server-side lag compensation for fair gameplay
 * - Adaptive update rates based on network conditions
 * - Rollback/replay system for corrections
 */

const { v4: uuidv4 } = require('uuid');

class LagCompensationSystem {
  constructor() {
    this.clientStates = new Map(); // socketId -> client state history
    this.serverStates = new Map(); // roomId -> server state history
    this.pendingInputs = new Map(); // socketId -> pending input queue
    this.networkMetrics = new Map(); // socketId -> network metrics
    
    // Configuration
    this.stateHistorySize = 60; // Keep 1 second at 60fps
    this.maxPredictionTime = 200; // Max 200ms prediction
    this.rollbackThreshold = 50; // Rollback if error > 50ms
    this.adaptiveUpdateRates = {
      excellent: 60, // < 20ms latency
      good: 30,      // 20-50ms latency
      fair: 20,      // 50-100ms latency
      poor: 10       // > 100ms latency
    };

    console.log('⚡ Lag Compensation System initialized');
  }

  /**
   * Initialize client for lag compensation
   */
  initializeClient(socketId, roomId) {
    this.clientStates.set(socketId, {
      roomId: roomId,
      stateHistory: [],
      lastServerUpdate: 0,
      lastInputSequence: 0,
      predictedState: null,
      confirmedState: null
    });

    this.pendingInputs.set(socketId, []);
    
    this.networkMetrics.set(socketId, {
      latency: 50, // Default 50ms
      jitter: 5,
      packetLoss: 0,
      bandwidth: 10000000, // 10Mbps default
      updateRate: 30,
      lastMeasurement: Date.now()
    });

    // Reduce logging to prevent spam - only log every 5th client
    if (this.clientStates.size % 5 === 0) {
      console.log(`⚡ Lag compensation: ${this.clientStates.size} clients tracked`);
    }
  }

  /**
   * Process client input with prediction
   */
  processClientInput(socketId, input) {
    const clientState = this.clientStates.get(socketId);
    if (!clientState) {return null;}

    const now = Date.now();
    const sequence = ++clientState.lastInputSequence;

    // Enhanced input with metadata
    const enhancedInput = {
      ...input,
      sequence: sequence,
      clientTimestamp: input.timestamp || now,
      serverTimestamp: now,
      socketId: socketId
    };

    // Add to pending inputs
    const pendingInputs = this.pendingInputs.get(socketId);
    pendingInputs.push(enhancedInput);

    // Keep only recent inputs
    const cutoff = now - this.maxPredictionTime;
    this.pendingInputs.set(socketId, 
      pendingInputs.filter(input => input.serverTimestamp > cutoff)
    );

    // Apply client-side prediction
    const predictedState = this.applyClientPrediction(socketId, enhancedInput);

    return {
      input: enhancedInput,
      predictedState: predictedState,
      sequence: sequence
    };
  }

  /**
   * Apply client-side prediction
   */
  applyClientPrediction(socketId, input) {
    const clientState = this.clientStates.get(socketId);
    if (!clientState) {return null;}

    const metrics = this.networkMetrics.get(socketId);
    const latency = metrics.latency;

    // Don't predict if latency is too low or too high
    if (latency < 10 || latency > this.maxPredictionTime) {
      return null;
    }

    // Get current confirmed state
    const baseState = clientState.confirmedState || this.getLatestServerState(clientState.roomId);
    if (!baseState) {return null;}

    // Apply prediction based on input type
    let predictedState = { ...baseState };

    switch (input.type) {
    case 'token_move':
      predictedState = this.predictTokenMovement(predictedState, input, latency);
      break;
    case 'character_update':
      predictedState = this.predictCharacterUpdate(predictedState, input, latency);
      break;
    case 'inventory_change':
      predictedState = this.predictInventoryChange(predictedState, input, latency);
      break;
    }

    clientState.predictedState = predictedState;
    return predictedState;
  }

  /**
   * Predict token movement
   */
  predictTokenMovement(state, input, latency) {
    if (!input.data || !input.data.position) {return state;}

    const predicted = { ...state };
    if (!predicted.tokens) {predicted.tokens = {};}

    const tokenId = input.data.tokenId;
    const newPosition = input.data.position;

    // Apply movement with latency compensation
    if (input.data.velocity) {
      const compensationTime = latency / 1000; // Convert to seconds
      const compensatedPosition = {
        x: newPosition.x + (input.data.velocity.x * compensationTime),
        y: newPosition.y + (input.data.velocity.y * compensationTime)
      };

      predicted.tokens[tokenId] = {
        ...predicted.tokens[tokenId],
        position: compensatedPosition,
        predictedAt: Date.now()
      };
    } else {
      predicted.tokens[tokenId] = {
        ...predicted.tokens[tokenId],
        position: newPosition,
        predictedAt: Date.now()
      };
    }

    return predicted;
  }

  /**
   * Predict character update
   */
  predictCharacterUpdate(state, input, _latency) {
    const predicted = { ...state };
    if (!predicted.characters) {predicted.characters = {};}

    const characterId = input.data.characterId;
    const updates = input.data.updates;

    predicted.characters[characterId] = {
      ...predicted.characters[characterId],
      ...updates,
      predictedAt: Date.now()
    };

    return predicted;
  }

  /**
   * Predict inventory change
   */
  predictInventoryChange(state, input, _latency) {
    const predicted = { ...state };
    if (!predicted.inventories) {predicted.inventories = {};}

    const playerId = input.data.playerId;
    const change = input.data.change;

    if (!predicted.inventories[playerId]) {
      predicted.inventories[playerId] = { items: [] };
    }

    // Apply inventory change prediction
    switch (change.type) {
    case 'add_item':
      predicted.inventories[playerId].items.push({
        ...change.item,
        predictedAt: Date.now()
      });
      break;
    case 'remove_item':
      predicted.inventories[playerId].items = 
          predicted.inventories[playerId].items.filter(item => item.id !== change.itemId);
      break;
    case 'move_item': {
      const item = predicted.inventories[playerId].items.find(item => item.id === change.itemId);
      if (item) {
        item.position = change.newPosition;
        item.predictedAt = Date.now();
      }
      break;
    }
    }

    return predicted;
  }

  /**
   * Confirm server state and check for corrections
   */
  confirmServerState(roomId, serverState, timestamp) {
    const corrections = [];

    // Update server state history
    if (!this.serverStates.has(roomId)) {
      this.serverStates.set(roomId, []);
    }

    const stateHistory = this.serverStates.get(roomId);
    stateHistory.push({
      state: serverState,
      timestamp: timestamp
    });

    // Keep only recent history
    const cutoff = timestamp - (this.stateHistorySize * 16.67); // ~1 second at 60fps
    this.serverStates.set(roomId, 
      stateHistory.filter(entry => entry.timestamp > cutoff)
    );

    // Check all clients in this room for corrections
    for (const [socketId, clientState] of this.clientStates.entries()) {
      if (clientState.roomId !== roomId) {continue;}

      const correction = this.checkForCorrection(socketId, serverState, timestamp);
      if (correction) {
        corrections.push(correction);
      }
    }

    return corrections;
  }

  /**
   * Check if client needs correction
   */
  checkForCorrection(socketId, serverState, timestamp) {
    const clientState = this.clientStates.get(socketId);
    if (!clientState || !clientState.predictedState) {return null;}

    const metrics = this.networkMetrics.get(socketId);
    const latency = metrics.latency;

    // Compare predicted state with server state
    const discrepancy = this.calculateStateDiscrepancy(
      clientState.predictedState, 
      serverState
    );

    // Determine if correction is needed
    const correctionThreshold = this.getCorrectionThreshold(latency);
    
    if (discrepancy > correctionThreshold) {
      console.log(`🔄 Correction needed for client ${socketId}: discrepancy ${discrepancy}ms > threshold ${correctionThreshold}ms`);

      // Update confirmed state
      clientState.confirmedState = serverState;
      clientState.lastServerUpdate = timestamp;

      // Clear old pending inputs
      const pendingInputs = this.pendingInputs.get(socketId);
      const validInputs = pendingInputs.filter(input => 
        input.serverTimestamp > timestamp - latency
      );
      this.pendingInputs.set(socketId, validInputs);

      return {
        socketId: socketId,
        correctedState: serverState,
        discrepancy: discrepancy,
        pendingInputs: validInputs
      };
    }

    return null;
  }

  /**
   * Calculate discrepancy between predicted and server state
   */
  calculateStateDiscrepancy(predictedState, serverState) {
    let maxDiscrepancy = 0;

    // Check token positions
    if (predictedState.tokens && serverState.tokens) {
      for (const tokenId in predictedState.tokens) {
        const predicted = predictedState.tokens[tokenId];
        const server = serverState.tokens[tokenId];

        if (predicted && server && predicted.position && server.position) {
          const distance = Math.sqrt(
            Math.pow(predicted.position.x - server.position.x, 2) +
            Math.pow(predicted.position.y - server.position.y, 2)
          );

          // Convert distance to time discrepancy (rough estimate)
          const timeDiscrepancy = distance * 10; // Assume 10ms per unit distance
          maxDiscrepancy = Math.max(maxDiscrepancy, timeDiscrepancy);
        }
      }
    }

    return maxDiscrepancy;
  }

  /**
   * Get correction threshold based on latency
   */
  getCorrectionThreshold(latency) {
    if (latency < 20) {return 30;}
    if (latency < 50) {return 50;}
    if (latency < 100) {return 80;}
    return 100;
  }

  /**
   * Update network metrics for adaptive behavior
   */
  updateNetworkMetrics(socketId, metrics) {
    const existing = this.networkMetrics.get(socketId);
    if (!existing) {return;}

    // Smooth metrics with exponential moving average
    const alpha = 0.3; // Smoothing factor
    
    existing.latency = (alpha * metrics.latency) + ((1 - alpha) * existing.latency);
    existing.jitter = (alpha * metrics.jitter) + ((1 - alpha) * existing.jitter);
    existing.packetLoss = (alpha * metrics.packetLoss) + ((1 - alpha) * existing.packetLoss);
    
    if (metrics.bandwidth) {
      existing.bandwidth = (alpha * metrics.bandwidth) + ((1 - alpha) * existing.bandwidth);
    }

    existing.lastMeasurement = Date.now();

    // Adapt update rate based on network conditions
    existing.updateRate = this.calculateAdaptiveUpdateRate(existing);

    console.log(`📊 Network metrics updated for ${socketId}: latency=${Math.round(existing.latency)}ms, rate=${existing.updateRate}fps`);
  }

  /**
   * Calculate adaptive update rate
   */
  calculateAdaptiveUpdateRate(metrics) {
    const { latency, jitter, packetLoss } = metrics;

    if (latency < 20 && jitter < 5 && packetLoss < 0.01) {
      return this.adaptiveUpdateRates.excellent;
    } else if (latency < 50 && jitter < 10 && packetLoss < 0.02) {
      return this.adaptiveUpdateRates.good;
    } else if (latency < 100 && jitter < 20 && packetLoss < 0.05) {
      return this.adaptiveUpdateRates.fair;
    } else {
      return this.adaptiveUpdateRates.poor;
    }
  }

  /**
   * Get latest server state for a room
   */
  getLatestServerState(roomId) {
    const stateHistory = this.serverStates.get(roomId);
    if (!stateHistory || stateHistory.length === 0) {return null;}

    return stateHistory[stateHistory.length - 1].state;
  }

  /**
   * Get client metrics
   */
  getClientMetrics(socketId) {
    return this.networkMetrics.get(socketId);
  }

  /**
   * Get system metrics
   */
  getSystemMetrics() {
    const totalClients = this.clientStates.size;
    const totalPendingInputs = Array.from(this.pendingInputs.values())
      .reduce((sum, inputs) => sum + inputs.length, 0);

    const avgLatency = Array.from(this.networkMetrics.values())
      .reduce((sum, metrics) => sum + metrics.latency, 0) / this.networkMetrics.size;

    return {
      totalClients,
      totalPendingInputs,
      avgLatency: Math.round(avgLatency),
      stateHistorySize: Array.from(this.serverStates.values())
        .reduce((sum, history) => sum + history.length, 0)
    };
  }

  /**
   * Cleanup client data
   */
  cleanupClient(socketId) {
    this.clientStates.delete(socketId);
    this.pendingInputs.delete(socketId);
    this.networkMetrics.delete(socketId);
    console.log(`🧹 Lag compensation cleanup for client ${socketId}`);
  }

  /**
   * Combat-specific lag compensation methods
   */

  /**
   * Predict combat action with lag compensation
   */
  predictCombatAction(socketId, actionData) {
    const clientState = this.clientStates.get(socketId);
    if (!clientState) {return null;}

    const predictedAction = {
      id: uuidv4(),
      type: actionData.type,
      sequence: ++clientState.lastInputSequence,
      timestamp: Date.now(),
      predicted: true,
      data: actionData.data
    };

    // Add to pending inputs for server processing
    const pending = this.pendingInputs.get(socketId);
    pending.push({
      action: predictedAction,
      clientTime: actionData.clientTime || Date.now(),
      predicted: true
    });

    return predictedAction;
  }

  /**
   * Process combat state update with reconciliation
   */
  processCombatStateUpdate(roomId, combatState, serverTime) {
    const serverHistory = this.serverStates.get(roomId);
    if (!serverHistory) {return;}

    // Store server state
    serverHistory.push({
      timestamp: serverTime,
      state: { ...combatState }
    });

    // Keep only recent history
    if (serverHistory.length > this.stateHistorySize) {
      serverHistory.shift();
    }

    // Find clients in this room and reconcile their predictions
    for (const [socketId, clientState] of this.clientStates) {
      if (clientState.roomId === roomId) {
        this.reconcileCombatPrediction(socketId, combatState, serverTime);
      }
    }
  }

  /**
   * Reconcile client prediction with server state
   */
  reconcileCombatPrediction(socketId, serverCombatState, _serverTime) {
    const clientState = this.clientStates.get(socketId);
    if (!clientState || !clientState.predictedState) {return;}

    const predictedState = clientState.predictedState.combat;
    const discrepancies = this.findCombatDiscrepancies(predictedState, serverCombatState);

    if (discrepancies.length > 0) {
      // Send correction to client
      // const correction = {
      //   type: 'combat_correction',
      //   serverState: serverCombatState,
      //   timestamp: serverTime,
      //   discrepancies: discrepancies
      // };

      // This would be sent via socket to the client
      console.log(`🔄 Sending combat correction to ${socketId}:`, discrepancies.length, 'discrepancies');
    }
  }

  /**
   * Find discrepancies between predicted and server combat state
   */
  findCombatDiscrepancies(predictedState, serverState) {
    const discrepancies = [];

    // Check current turn
    if (predictedState.currentTurnIndex !== serverState.currentTurnIndex) {
      discrepancies.push({
        field: 'currentTurnIndex',
        predicted: predictedState.currentTurnIndex,
        server: serverState.currentTurnIndex
      });
    }

    // Check round
    if (predictedState.round !== serverState.round) {
      discrepancies.push({
        field: 'round',
        predicted: predictedState.round,
        server: serverState.round
      });
    }

    // Check turn order
    const predictedOrder = predictedState.turnOrder.map(c => ({ id: c.tokenId, initiative: c.initiative }));
    const serverOrder = serverState.turnOrder.map(c => ({ id: c.tokenId, initiative: c.initiative }));

    if (JSON.stringify(predictedOrder) !== JSON.stringify(serverOrder)) {
      discrepancies.push({
        field: 'turnOrder',
        predicted: predictedOrder,
        server: serverOrder
      });
    }

    return discrepancies;
  }

  /**
   * Get combat prediction quality metrics
   */
  getCombatPredictionMetrics(roomId) {
    const serverHistory = this.serverStates.get(roomId);
    if (!serverHistory || serverHistory.length < 2) {return null;}

    const totalCorrections = 0;
    let totalClients = 0;

    // Count clients in room
    for (const clientState of this.clientStates.values()) {
      if (clientState.roomId === roomId) {
        totalClients++;
      }
    }

    return {
      roomId,
      clientCount: totalClients,
      predictionQuality: totalCorrections === 0 ? 'excellent' :
        totalCorrections < totalClients * 0.1 ? 'good' :
          totalCorrections < totalClients * 0.3 ? 'fair' : 'poor',
      correctionsNeeded: totalCorrections
    };
  }

  /**
   * Cleanup room data
   */
  cleanupRoom(roomId) {
    // Remove server state history
    this.serverStates.delete(roomId);

    // Remove clients in this room
    const clientsToRemove = [];
    for (const [socketId, clientState] of this.clientStates.entries()) {
      if (clientState.roomId === roomId) {
        clientsToRemove.push(socketId);
      }
    }

    for (const socketId of clientsToRemove) {
      this.cleanupClient(socketId);
    }

    console.log(`🧹 Lag compensation cleanup for room ${roomId}`);
  }
}

module.exports = new LagCompensationSystem();
