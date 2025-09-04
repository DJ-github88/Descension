/**
 * Event Batching & Compression System
 * 
 * This module optimizes network traffic by:
 * - Batching multiple events into single packets
 * - Prioritizing critical events (movement, combat)
 * - Compressing repeated data patterns
 * - Adapting batch size based on network conditions
 */

const { v4: uuidv4 } = require('uuid');

class EventBatcher {
  constructor(io) {
    this.io = io;
    this.roomBatches = new Map(); // roomId -> batch data
    this.clientMetrics = new Map(); // socketId -> network metrics
    this.batchIntervals = new Map(); // roomId -> interval ID
    
    // Configuration - optimized for player performance (reduced frequency)
    this.defaultBatchInterval = 200; // ~5fps to prevent player lag spikes
    this.maxBatchSize = 10; // further reduced batch size to prevent overwhelming players
    this.priorityThreshold = 10; // ms for high priority events
    this.adaptiveThresholds = {
      lowLatency: 10, // < 10ms
      mediumLatency: 50, // 10-50ms
      highLatency: 100 // > 50ms
    };

    console.log('🚀 Event Batcher initialized');
  }

  /**
   * Initialize batching for a room
   */
  initializeRoom(roomId) {
    if (this.roomBatches.has(roomId)) {
      console.log(`📦 Room ${roomId} already has event batching initialized`);
      return; // Already initialized
    }

    const batchData = {
      events: [],
      highPriorityEvents: [],
      lastFlush: Date.now(),
      metrics: {
        totalEvents: 0,
        batchesSent: 0,
        bytesTransferred: 0,
        averageBatchSize: 0
      }
    };

    this.roomBatches.set(roomId, batchData);

    // Start batching interval
    const intervalId = setInterval(() => {
      this.flushBatch(roomId);
    }, this.defaultBatchInterval);

    this.batchIntervals.set(roomId, intervalId);
    // Reduce logging frequency to prevent spam
    if (this.roomBatches.size % 3 === 0) {
      console.log(`📦 Event batching: ${this.roomBatches.size} rooms tracked`);
    }
  }

  /**
   * Add event to batch queue
   */
  addEvent(roomId, event, priority = 'normal') {
    const batchData = this.roomBatches.get(roomId);
    if (!batchData) {
      console.warn(`Room ${roomId} not initialized for batching`);
      return false;
    }

    // Enhance event with metadata
    const enhancedEvent = {
      id: uuidv4(),
      timestamp: Date.now(),
      priority: priority,
      ...event
    };

    // Add to appropriate queue based on priority
    if (priority === 'high' || priority === 'critical') {
      batchData.highPriorityEvents.push(enhancedEvent);
      
      // Flush immediately for critical events
      if (priority === 'critical') {
        this.flushBatch(roomId, true);
        return true;
      }
    } else {
      batchData.events.push(enhancedEvent);
    }

    batchData.metrics.totalEvents++;

    // Check if batch is full
    const totalEvents = batchData.events.length + batchData.highPriorityEvents.length;
    if (totalEvents >= this.maxBatchSize) {
      this.flushBatch(roomId);
    }

    return true;
  }

  /**
   * Flush batch to all clients in room
   */
  flushBatch(roomId, forceCritical = false) {
    const batchData = this.roomBatches.get(roomId);
    if (!batchData) return;

    const now = Date.now();
    const timeSinceLastFlush = now - batchData.lastFlush;

    // Combine events
    const allEvents = [
      ...batchData.highPriorityEvents,
      ...batchData.events
    ];

    if (allEvents.length === 0 && !forceCritical) {
      return; // Nothing to send
    }

    // Sort events by priority and timestamp
    allEvents.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, normal: 2, low: 3 };
      const aPriority = priorityOrder[a.priority] || 2;
      const bPriority = priorityOrder[b.priority] || 2;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      return a.timestamp - b.timestamp;
    });

    // Create batch packet
    const batchPacket = {
      id: uuidv4(),
      timestamp: now,
      roomId: roomId,
      eventCount: allEvents.length,
      events: allEvents,
      metadata: {
        batchInterval: timeSinceLastFlush,
        serverTimestamp: now
      }
    };

    // Compress if beneficial
    const compressedPacket = this.compressBatch(batchPacket);

    // Send to all clients in room with adaptive delivery
    this.sendBatchToRoom(roomId, compressedPacket);

    // Update metrics
    batchData.metrics.batchesSent++;
    batchData.metrics.bytesTransferred += JSON.stringify(compressedPacket).length;
    batchData.metrics.averageBatchSize = 
      (batchData.metrics.averageBatchSize * (batchData.metrics.batchesSent - 1) + allEvents.length) / 
      batchData.metrics.batchesSent;

    // Clear queues
    batchData.events = [];
    batchData.highPriorityEvents = [];
    batchData.lastFlush = now;

    if (allEvents.length > 0) {
      console.log(`📦 Batch sent to room ${roomId}: ${allEvents.length} events, ${JSON.stringify(compressedPacket).length} bytes`);
    }
  }

  /**
   * Send batch to room with role-aware adaptive delivery
   */
  sendBatchToRoom(roomId, batchPacket) {
    const room = this.io.sockets.adapter.rooms.get(roomId);
    if (!room) return;

    // Get all sockets in room
    const sockets = Array.from(room).map(socketId => this.io.sockets.sockets.get(socketId)).filter(Boolean);

    // Get player data to determine roles
    const players = global.players || new Map();

    // Send to each socket with role-aware adaptation
    for (const socket of sockets) {
      const player = players.get(socket.id);
      const clientMetrics = this.getClientMetrics(socket.id);

      // Optimize batch based on player role
      let finalBatch = batchPacket;

      if (player && !player.isGM) {
        // For players: Send simplified batch to reduce processing overhead
        finalBatch = this.simplifyBatchForPlayer(batchPacket);
      } else {
        // For GMs: Use full adaptive batching
        finalBatch = this.adaptBatchForClient(batchPacket, clientMetrics);
      }

      socket.emit('batch_update', finalBatch);
    }
  }

  /**
   * Adapt batch based on client network conditions
   */
  adaptBatchForClient(batchPacket, clientMetrics) {
    const { latency, bandwidth, packetLoss } = clientMetrics;

    // For high latency clients, prioritize critical events only
    if (latency > this.adaptiveThresholds.highLatency) {
      const criticalEvents = batchPacket.events.filter(e => 
        e.priority === 'critical' || e.priority === 'high'
      );
      
      if (criticalEvents.length < batchPacket.events.length) {
        return {
          ...batchPacket,
          events: criticalEvents,
          eventCount: criticalEvents.length,
          metadata: {
            ...batchPacket.metadata,
            adaptedForLatency: true,
            originalEventCount: batchPacket.eventCount
          }
        };
      }
    }

    // For low bandwidth clients, compress more aggressively
    if (bandwidth < 1000000) { // < 1Mbps
      return this.compressBatch(batchPacket, true);
    }

    return batchPacket;
  }

  /**
   * Simplify batch for player clients to reduce processing overhead
   */
  simplifyBatchForPlayer(batchPacket) {
    // For players: Remove unnecessary metadata and keep only essential events
    const simplifiedEvents = batchPacket.events.filter(event => {
      // Keep only essential events for players
      return event.priority === 'critical' ||
             event.type === 'token_moved' ||
             event.type === 'character_moved' ||
             event.type === 'chat_message';
    });

    return {
      id: batchPacket.id,
      timestamp: batchPacket.timestamp,
      roomId: batchPacket.roomId,
      eventCount: simplifiedEvents.length,
      events: simplifiedEvents,
      metadata: {
        simplified: true,
        originalEventCount: batchPacket.eventCount
      }
    };
  }

  /**
   * Compress batch data
   */
  compressBatch(batchPacket, aggressive = false) {
    // Pattern-based compression for repeated data
    const compressed = {
      ...batchPacket,
      compressed: true
    };

    // Extract common patterns
    const patterns = this.extractPatterns(batchPacket.events);
    if (patterns.length > 0) {
      compressed.patterns = patterns;
      compressed.events = this.applyPatternCompression(batchPacket.events, patterns);
    }

    // Aggressive compression for low bandwidth
    if (aggressive) {
      compressed.events = compressed.events.map(event => this.compressEvent(event));
    }

    const originalSize = JSON.stringify(batchPacket).length;
    const compressedSize = JSON.stringify(compressed).length;
    const ratio = compressedSize / originalSize;

    if (ratio < 0.9) { // Only use compression if it saves at least 10%
      compressed.metadata = {
        ...compressed.metadata,
        compressionRatio: ratio,
        originalSize: originalSize,
        compressedSize: compressedSize
      };
      return compressed;
    }

    return batchPacket; // Return original if compression not beneficial
  }

  /**
   * Extract common patterns from events
   */
  extractPatterns(events) {
    const patterns = [];
    const patternMap = new Map();

    // Look for repeated structures
    for (const event of events) {
      const structure = this.getEventStructure(event);
      const key = JSON.stringify(structure);
      
      if (patternMap.has(key)) {
        patternMap.get(key).count++;
      } else {
        patternMap.set(key, { structure, count: 1 });
      }
    }

    // Extract patterns that appear multiple times
    for (const [key, data] of patternMap) {
      if (data.count > 1) {
        patterns.push({
          id: patterns.length,
          structure: data.structure,
          count: data.count
        });
      }
    }

    return patterns;
  }

  /**
   * Get event structure for pattern matching
   */
  getEventStructure(event) {
    const structure = {};
    for (const key in event) {
      if (typeof event[key] === 'object' && event[key] !== null) {
        structure[key] = Array.isArray(event[key]) ? 'array' : 'object';
      } else {
        structure[key] = typeof event[key];
      }
    }
    return structure;
  }

  /**
   * Apply pattern compression to events
   */
  applyPatternCompression(events, patterns) {
    return events.map(event => {
      for (const pattern of patterns) {
        const eventStructure = this.getEventStructure(event);
        if (JSON.stringify(eventStructure) === JSON.stringify(pattern.structure)) {
          return {
            ...event,
            __pattern: pattern.id
          };
        }
      }
      return event;
    });
  }

  /**
   * Compress individual event
   */
  compressEvent(event) {
    const compressed = { ...event };

    // Remove redundant data
    if (compressed.timestamp && Date.now() - compressed.timestamp < 1000) {
      delete compressed.timestamp; // Recent timestamp, can be inferred
    }

    // Compress coordinate data
    if (compressed.position) {
      compressed.position = {
        x: Math.round(compressed.position.x * 100) / 100, // 2 decimal places
        y: Math.round(compressed.position.y * 100) / 100
      };
    }

    return compressed;
  }

  /**
   * Update client network metrics
   */
  updateClientMetrics(socketId, metrics) {
    const existing = this.clientMetrics.get(socketId) || {
      latency: 50,
      bandwidth: 10000000, // 10Mbps default
      packetLoss: 0,
      lastUpdate: Date.now()
    };

    const updated = {
      ...existing,
      ...metrics,
      lastUpdate: Date.now()
    };

    this.clientMetrics.set(socketId, updated);

    // Adjust batch interval based on metrics
    this.adjustBatchInterval(socketId, updated);
  }

  /**
   * Get client metrics with defaults
   */
  getClientMetrics(socketId) {
    return this.clientMetrics.get(socketId) || {
      latency: 50,
      bandwidth: 10000000,
      packetLoss: 0,
      lastUpdate: Date.now()
    };
  }

  /**
   * Adjust batch interval based on client performance
   */
  adjustBatchInterval(socketId, metrics) {
    // This could be used to create per-client batch intervals in the future
    // For now, we use room-wide intervals
  }

  /**
   * Get room metrics
   */
  getRoomMetrics(roomId) {
    const batchData = this.roomBatches.get(roomId);
    if (!batchData) return null;

    return {
      ...batchData.metrics,
      currentBatchSize: batchData.events.length + batchData.highPriorityEvents.length,
      lastFlush: batchData.lastFlush
    };
  }

  /**
   * Cleanup room batching
   */
  cleanupRoom(roomId) {
    // Flush any remaining events
    this.flushBatch(roomId);

    // Clear interval
    const intervalId = this.batchIntervals.get(roomId);
    if (intervalId) {
      clearInterval(intervalId);
      this.batchIntervals.delete(roomId);
    }

    // Remove batch data
    this.roomBatches.delete(roomId);
    console.log(`🧹 Event batching cleaned up for room ${roomId}`);
  }

  /**
   * Cleanup client metrics
   */
  cleanupClient(socketId) {
    this.clientMetrics.delete(socketId);
  }

  /**
   * Get system-wide metrics
   */
  getSystemMetrics() {
    const totalRooms = this.roomBatches.size;
    const totalClients = this.clientMetrics.size;
    
    let totalEvents = 0;
    let totalBatches = 0;
    let totalBytes = 0;

    for (const batchData of this.roomBatches.values()) {
      totalEvents += batchData.metrics.totalEvents;
      totalBatches += batchData.metrics.batchesSent;
      totalBytes += batchData.metrics.bytesTransferred;
    }

    return {
      totalRooms,
      totalClients,
      totalEvents,
      totalBatches,
      totalBytes,
      averageEventsPerBatch: totalBatches > 0 ? totalEvents / totalBatches : 0,
      averageBytesPerBatch: totalBatches > 0 ? totalBytes / totalBatches : 0
    };
  }
}

module.exports = EventBatcher;
