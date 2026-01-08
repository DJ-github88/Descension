/**
 * Input Validation Service
 * Provides validation middleware for socket events and API endpoints
 */

const Joi = require('joi');

// Validation schemas for different socket events
const validationSchemas = {
  // Room management
  create_room: Joi.object({
    roomName: Joi.string().min(1).max(50).required(),
    gmName: Joi.string().min(1).max(50).required(),
    password: Joi.string().min(0).max(100).allow(''),
    playerColor: Joi.string().regex(/^#[0-9A-Fa-f]{6}$/).optional()
  }),

  join_room: Joi.object({
    roomId: Joi.string().min(1).max(100).required(), // Room IDs can be UUID or room_timestamp_random format
    playerName: Joi.string().min(1).max(50).required(),
    password: Joi.string().min(0).max(100).allow(''),
    playerColor: Joi.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    character: Joi.object().optional().allow(null)
  }),

  // Chat and communication
  chat_message: Joi.object({
    message: Joi.string().min(1).max(1000).required(),
    type: Joi.string().valid('chat', 'system', 'roll').optional()
  }),

  // Character management
  character_updated: Joi.object({
    characterId: Joi.string().required(),
    character: Joi.object().required()
  }),

  character_equipment_updated: Joi.object({
    characterId: Joi.string().required(),
    slot: Joi.string().required(),
    item: Joi.object().optional(),
    equipment: Joi.object().optional(),
    stats: Joi.object().optional()
  }),

  // Token management
  token_created: Joi.object({
    creature: Joi.object().required(),
    token: Joi.object().optional(),
    position: Joi.object({
      x: Joi.number().required(),
      y: Joi.number().required()
    }).required()
  }),

  token_moved: Joi.object({
    tokenId: Joi.string().required(),
    position: Joi.object({
      x: Joi.number().required(),
      y: Joi.number().required()
    }).required(),
    velocity: Joi.object().optional(),
    isDragging: Joi.boolean().optional()
  }),

  // Combat
  combat_action: Joi.object({
    type: Joi.string().valid('next_turn', 'initiative_roll').required(),
    data: Joi.object().optional()
  }),

  // Item management
  item_dropped: Joi.object({
    item: Joi.object().required(),
    position: Joi.object({
      x: Joi.number().required(),
      y: Joi.number().required()
    }).required(),
    gridPosition: Joi.object().optional()
  }),

  item_looted: Joi.object({
    item: Joi.object().required(),
    quantity: Joi.number().integer().min(1).required(),
    source: Joi.string().required(),
    gridItemId: Joi.string().optional()
  }),

  // Dice rolling
  dice_rolled: Joi.object({
    dice: Joi.array().items(Joi.string()).required(),
    results: Joi.array().items(Joi.number().integer()).required(),
    total: Joi.number().integer().required(),
    purpose: Joi.string().optional()
  }),

  // Map management
  map_update: Joi.object({
    mapUpdates: Joi.object().optional(),
    mapData: Joi.object().optional()
  }),

  // Player updates
  update_player_color: Joi.object({
    color: Joi.string().regex(/^#[0-9A-Fa-f]{6}$/).required()
  }),

  // Room invitations
  send_room_invite: Joi.object({
    targetUserId: Joi.string().required(),
    roomId: Joi.string().uuid().required(),
    roomName: Joi.string().required(),
    gmName: Joi.string().required()
  }),

  respond_to_invite: Joi.object({
    inviteId: Joi.string().uuid().required(),
    accepted: Joi.boolean().required(),
    roomId: Joi.string().uuid().optional(),
    password: Joi.string().optional()
  })
};

/**
 * Validate socket event data
 * @param {string} eventType - The socket event type
 * @param {Object} data - The event data to validate
 * @returns {Object} - Validation result { isValid, errors, value }
 */
function validateSocketEvent(eventType, data) {
  const schema = validationSchemas[eventType];

  if (!schema) {
    // No validation schema defined for this event type
    return { isValid: true, value: data, errors: null };
  }

  const { error, value } = schema.validate(data, {
    abortEarly: false, // Collect all validation errors
    stripUnknown: true, // Remove unknown properties
    convert: true // Convert types where possible
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context.value
    }));

    return {
      isValid: false,
      errors: errors,
      value: null
    };
  }

  return {
    isValid: true,
    value: value,
    errors: null
  };
}

/**
 * Create validation middleware for socket events
 * @param {Object} options - Configuration options
 * @returns {Function} - Socket middleware function
 */
function createValidationMiddleware(options = {}) {
  const {
    logErrors = true,
    strictMode = false, // If true, disconnect client on validation failure
    maxErrorsPerMinute = 10 // Rate limiting for validation errors
  } = options;

  // Track validation errors per client
  const clientErrorCounts = new Map();
  setInterval(() => {
    clientErrorCounts.clear();
  }, 60000); // Reset every minute

  return (socket, next) => {
    // Override the socket.on method to add validation
    const originalOn = socket.on.bind(socket);

    socket.on = function(event, handler){
      const validatedHandler = async(data) => {
        const clientId = socket.id;
        const validation = validateSocketEvent(event, data);

        if (!validation.isValid) {
          // Track error count for rate limiting
          const errorCount = clientErrorCounts.get(clientId) || 0;
          clientErrorCounts.set(clientId, errorCount + 1);

          if (logErrors) {
            console.warn(`⚠️ Socket validation failed for event '${event}' from client ${clientId}:`, validation.errors);
          }

          // Send validation error to client
          socket.emit('validation_error', {
            event: event,
            errors: validation.errors,
            message: 'Invalid data format'
          });

          // Disconnect client if too many validation errors or in strict mode
          if (strictMode || errorCount >= maxErrorsPerMinute) {
            console.error(`🚫 Disconnecting client ${clientId} due to validation errors`);
            socket.disconnect(true);
            return;
          }

          return;
        }

        // Data is valid, proceed with handler
        try {
          await handler(validation.value);
        } catch (error) {
          console.error(`Error in socket handler for event '${event}':`, error);
          socket.emit('error', {
            message: 'Internal server error',
            event: event
          });
        }
      };

      return originalOn(event, validatedHandler);
    };

    next();
  };
}

/**
 * Validate API request data
 * @param {Object} schema - Joi validation schema
 * @param {Object} data - Data to validate
 * @returns {Object} - Validation result
 */
function validateApiRequest(schema, data) {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    convert: true
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return {
      isValid: false,
      errors: errors,
      value: null
    };
  }

  return {
    isValid: true,
    value: value,
    errors: null
  };
}

/**
 * Express middleware for API validation
 * @param {Object} schema - Joi validation schema
 * @returns {Function} - Express middleware function
 */
function createApiValidationMiddleware(schema) {
  return (req, res, next) => {
    const validation = validateApiRequest(schema, req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors
      });
    }

    // Replace request body with validated data
    req.body = validation.value;
    next();
  };
}

module.exports = {
  validateSocketEvent,
  validateApiRequest,
  createValidationMiddleware,
  createApiValidationMiddleware,
  validationSchemas
};
