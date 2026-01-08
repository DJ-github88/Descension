import { TriggerUtils } from '../data/triggerTypes';
import { generateUniqueId } from '../../utils/idUtils';
import { deepEqual } from '../../utils/objectUtils';

// =====================================================================
// TRIGGER EVALUATION CONTEXTS
// =====================================================================

/**
 * Defines the contexts in which triggers can be evaluated
 * @type {Object}
 */
export const TRIGGER_EVALUATION_CONTEXTS = {
  /**
   * Triggers that are only active during combat
   */
  COMBAT: 'combat',
  
  /**
   * Triggers that are active during exploration and world interaction
   */
  EXPLORATION: 'exploration',
  
  /**
   * Triggers that are active during social interactions and dialogues
   */
  SOCIAL: 'social',
  
  /**
   * Triggers that are always active regardless of game context
   */
  GLOBAL: 'global'
};

// =====================================================================
// TRIGGER COMPARISON OPERATORS
// =====================================================================

/**
 * Operators used for condition evaluation within triggers
 * @type {Object}
 */
export const TRIGGER_COMPARISON_OPERATORS = {
  /**
   * Checks if two values are equal
   */
  EQUALS: {
    id: 'equals',
    name: 'Equals',
    symbol: '==',
    evaluate: (a, b) => deepEqual(a, b)
  },
  
  /**
   * Checks if two values are not equal
   */
  NOT_EQUALS: {
    id: 'not_equals',
    name: 'Not Equals',
    symbol: '!=',
    evaluate: (a, b) => !deepEqual(a, b)
  },
  
  /**
   * Checks if a value is greater than another
   */
  GREATER_THAN: {
    id: 'greater_than',
    name: 'Greater Than',
    symbol: '>',
    evaluate: (a, b) => a > b
  },
  
  /**
   * Checks if a value is less than another
   */
  LESS_THAN: {
    id: 'less_than',
    name: 'Less Than',
    symbol: '<',
    evaluate: (a, b) => a < b
  },
  
  /**
   * Checks if a value is greater than or equal to another
   */
  GREATER_THAN_OR_EQUAL: {
    id: 'greater_than_or_equal',
    name: 'Greater Than or Equal',
    symbol: '>=',
    evaluate: (a, b) => a >= b
  },
  
  /**
   * Checks if a value is less than or equal to another
   */
  LESS_THAN_OR_EQUAL: {
    id: 'less_than_or_equal',
    name: 'Less Than or Equal',
    symbol: '<=',
    evaluate: (a, b) => a <= b
  },
  
  /**
   * Checks if an array or string contains a value
   */
  CONTAINS: {
    id: 'contains',
    name: 'Contains',
    symbol: 'contains',
    evaluate: (collection, item) => {
      if (typeof collection === 'string') {
        return collection.includes(item);
      }
      if (Array.isArray(collection)) {
        return collection.some(element => deepEqual(element, item));
      }
      return false;
    }
  },
  
  /**
   * Checks if an array or string does not contain a value
   */
  NOT_CONTAINS: {
    id: 'not_contains',
    name: 'Does Not Contain',
    symbol: 'not contains',
    evaluate: (collection, item) => {
      if (typeof collection === 'string') {
        return !collection.includes(item);
      }
      if (Array.isArray(collection)) {
        return !collection.some(element => deepEqual(element, item));
      }
      return true;
    }
  },
  
  /**
   * Checks if a string starts with a specified prefix
   */
  STARTS_WITH: {
    id: 'starts_with',
    name: 'Starts With',
    symbol: 'starts with',
    evaluate: (str, prefix) => {
      if (typeof str !== 'string' || typeof prefix !== 'string') {
        return false;
      }
      return str.startsWith(prefix);
    }
  },
  
  /**
   * Checks if a string ends with a specified suffix
   */
  ENDS_WITH: {
    id: 'ends_with',
    name: 'Ends With',
    symbol: 'ends with',
    evaluate: (str, suffix) => {
      if (typeof str !== 'string' || typeof suffix !== 'string') {
        return false;
      }
      return str.endsWith(suffix);
    }
  },
  
  /**
   * Checks if an entity has a specific status effect
   */
  HAS_STATUS: {
    id: 'has_status',
    name: 'Has Status',
    symbol: 'has status',
    evaluate: (entity, statusId) => {
      if (!entity || !entity.statusEffects) {
        return false;
      }
      return entity.statusEffects.some(status => status.id === statusId);
    }
  },
  
  /**
   * Checks if an entity lacks a specific status effect
   */
  LACKS_STATUS: {
    id: 'lacks_status',
    name: 'Lacks Status',
    symbol: 'lacks status',
    evaluate: (entity, statusId) => {
      if (!entity || !entity.statusEffects) {
        return true;
      }
      return !entity.statusEffects.some(status => status.id === statusId);
    }
  }
};

/**
 * Get a comparison operator by its ID
 * @param {string} operatorId - The ID of the comparison operator
 * @returns {Object|null} The operator object or null if not found
 */
export function getComparisonOperator(operatorId) {
  return Object.values(TRIGGER_COMPARISON_OPERATORS).find(op => op.id === operatorId) || null;
}

// =====================================================================
// TRIGGER COMPOSITE LOGIC
// =====================================================================

/**
 * Logic operators for combining multiple trigger conditions
 * @type {Object}
 */
export const TRIGGER_COMPOSITE_LOGIC = {
  /**
   * All conditions must be true for the trigger to activate
   */
  AND: {
    id: 'and',
    name: 'AND',
    symbol: '&&',
    evaluate: (conditions, gameState, entity) => {
      return conditions.every(condition => evaluateTriggerCondition(condition, gameState, entity));
    },
    shortCircuit: true
  },
  
  /**
   * At least one condition must be true for the trigger to activate
   */
  OR: {
    id: 'or',
    name: 'OR',
    symbol: '||',
    evaluate: (conditions, gameState, entity) => {
      return conditions.some(condition => evaluateTriggerCondition(condition, gameState, entity));
    },
    shortCircuit: true
  },
  
  /**
   * Negates the result of a condition
   */
  NOT: {
    id: 'not',
    name: 'NOT',
    symbol: '!',
    evaluate: (conditions, gameState, entity) => {
      // NOT should only have one child condition
      if (conditions.length !== 1) {
        console.error('NOT logic should have exactly one condition');
        return false;
      }
      return !evaluateTriggerCondition(conditions[0], gameState, entity);
    },
    shortCircuit: false
  },
  
  /**
   * Exactly one condition must be true for the trigger to activate
   */
  XOR: {
    id: 'xor',
    name: 'XOR',
    symbol: '^',
    evaluate: (conditions, gameState, entity) => {
      let trueCount = 0;
      for (const condition of conditions) {
        if (evaluateTriggerCondition(condition, gameState, entity)) {
          trueCount++;
        }
      }
      return trueCount === 1;
    },
    shortCircuit: false
  },
  
  /**
   * If the first condition is true, then check the second condition
   */
  IF_THEN: {
    id: 'if_then',
    name: 'IF_THEN',
    symbol: '->',
    evaluate: (conditions, gameState, entity) => {
      if (conditions.length !== 2) {
        console.error('IF_THEN logic should have exactly two conditions');
        return false;
      }
      
      const [ifCondition, thenCondition] = conditions;
      if (!evaluateTriggerCondition(ifCondition, gameState, entity)) {
        return true; // If the IF part is false, the overall statement is true
      }
      
      // If the IF part is true, then the THEN part must also be true
      return evaluateTriggerCondition(thenCondition, gameState, entity);
    },
    shortCircuit: true
  },
  
  /**
   * Custom scripted logic for complex conditions
   */
  COMPLEX: {
    id: 'complex',
    name: 'COMPLEX',
    symbol: 'fn',
    evaluate: (conditions, gameState, entity, complexLogicFn) => {
      if (typeof complexLogicFn !== 'function') {
        console.error('COMPLEX logic requires a valid evaluation function');
        return false;
      }
      
      // Evaluate all child conditions first
      const results = conditions.map(condition => 
        evaluateTriggerCondition(condition, gameState, entity)
      );
      
      // Pass the results to the custom logic function
      return complexLogicFn(results, gameState, entity);
    },
    shortCircuit: false
  }
};

/**
 * Get a composite logic operator by its ID
 * @param {string} logicId - The ID of the logic operator
 * @returns {Object|null} The logic operator object or null if not found
 */
export function getCompositeLogic(logicId) {
  return Object.values(TRIGGER_COMPOSITE_LOGIC).find(logic => logic.id === logicId) || null;
}

// =====================================================================
// TRIGGER RESPONSE TYPES
// =====================================================================

/**
 * Defines how triggers respond when their conditions are met
 * @type {Object}
 */
export const TRIGGER_RESPONSE_TYPES = {
  /**
   * Trigger activates immediately when conditions are met
   */
  INSTANT: {
    id: 'instant',
    name: 'Instant',
    description: 'Activates immediately when conditions are met',
    configParams: {}
  },
  
  /**
   * Trigger activates after a specified delay when conditions are met
   */
  DELAYED: {
    id: 'delayed',
    name: 'Delayed',
    description: 'Activates after a delay when conditions are met',
    configParams: {
      delay: {
        type: 'number',
        default: 1000, // milliseconds
        min: 0,
        max: 60000
      },
      cancelOnConditionChange: {
        type: 'boolean',
        default: true
      }
    }
  },
  
  /**
   * Trigger activates repeatedly while conditions remain met
   */
  PERSISTENT: {
    id: 'persistent',
    name: 'Persistent',
    description: 'Activates repeatedly while conditions remain met',
    configParams: {
      interval: {
        type: 'number',
        default: 1000, // milliseconds
        min: 100,
        max: 60000
      },
      maxTriggerCount: {
        type: 'number',
        default: 0, // 0 means unlimited
        min: 0
      }
    }
  },
  
  /**
   * Trigger activates only if secondary conditions are also met
   */
  CONDITIONAL: {
    id: 'conditional',
    name: 'Conditional',
    description: 'Activates only if secondary conditions are also met',
    configParams: {
      secondaryCondition: {
        type: 'object',
        default: null
      }
    }
  },
  
  /**
   * Trigger activates once then becomes inactive
   */
  CONSUMABLE: {
    id: 'consumable',
    name: 'Consumable',
    description: 'Activates once then becomes inactive',
    configParams: {
      resetOnCombatEnd: {
        type: 'boolean',
        default: false
      },
      resetAfterTime: {
        type: 'number',
        default: 0, // 0 means no reset
        min: 0
      }
    }
  }
};

/**
 * Get a trigger response type by its ID
 * @param {string} responseTypeId - The ID of the response type
 * @returns {Object|null} The response type object or null if not found
 */
export function getTriggerResponseType(responseTypeId) {
  return Object.values(TRIGGER_RESPONSE_TYPES).find(type => type.id === responseTypeId) || null;
}

// =====================================================================
// TRIGGER SYSTEM
// =====================================================================

// Track active trigger listeners
const activeTriggerListeners = new Map();

// Track persistent triggers and their state
const persistentTriggers = new Map();

// Track delayed triggers and their timeouts
const delayedTriggers = new Map();

// Track consumable triggers and their usage
const consumableTriggers = new Map();

/**
 * Evaluate a single trigger condition against the current game state
 * @param {Object} condition - The trigger condition to evaluate
 * @param {Object} gameState - The current game state
 * @param {Object} entity - The entity context for the trigger
 * @returns {boolean} Whether the condition is met
 */
export function evaluateTriggerCondition(condition, gameState, entity) {
  if (!condition) {
    console.error('Invalid condition provided for evaluation');
    return false;
  }
  
  // Handle composite conditions (using logical operators)
  if (condition.type === 'composite' && condition.logic && condition.conditions) {
    const logicOperator = getCompositeLogic(condition.logic);
    if (!logicOperator) {
      console.error(`Unknown logic operator: ${condition.logic}`);
      return false;
    }
    
    return logicOperator.evaluate(
      condition.conditions,
      gameState,
      entity,
      condition.complexLogicFn
    );
  }
  
  // Handle primitive conditions
  if (condition.type === 'primitive') {
    if (!condition.triggerType) {
      console.error('Primitive condition missing triggerType');
      return false;
    }
    
    // Retrieve the trigger definition from triggerTypes
    const triggerDef = TriggerUtils.getTriggerById(condition.triggerType);
    if (!triggerDef) {
      console.error(`Unknown trigger type: ${condition.triggerType}`);
      return false;
    }
    
    // Use the evaluate logic specified in the trigger definition
    if (triggerDef.evaluateLogic && typeof triggerDef.evaluateLogic === 'string') {
      // Check if we're handling one of the standard evaluation logics
      switch (triggerDef.evaluateLogic) {
        case 'spatial_distance_check':
          return evaluateSpatialDistanceCheck(condition, gameState, entity);
          
        case 'effect_application_check':
          return evaluateEffectApplicationCheck(condition, gameState, entity);
          
        case 'health_threshold_check':
          return evaluateHealthThresholdCheck(condition, gameState, entity);
          
        case 'damage_taken_check':
          return evaluateDamageTakenCheck(condition, gameState, entity);
          
        case 'damage_dealt_check':
          return evaluateDamageDealtCheck(condition, gameState, entity);
          
        case 'combat_state_check':
          return evaluateCombatStateCheck(condition, gameState, entity);
          
        // Add cases for other evaluation logic types from triggerTypes
        
        default:
          console.warn(`No built-in evaluation logic for: ${triggerDef.evaluateLogic}`);
          // Fall back to a custom implementation if available
          if (typeof window.customTriggerEvaluators === 'object' && 
              typeof window.customTriggerEvaluators[triggerDef.evaluateLogic] === 'function') {
            return window.customTriggerEvaluators[triggerDef.evaluateLogic](condition, gameState, entity);
          }
          return false;
      }
    }
    
    // If no evaluation logic specified, assume it's always false
    console.warn(`No evaluation logic defined for trigger type: ${condition.triggerType}`);
    return false;
  }
  
  // Handle direct comparison conditions
  if (condition.type === 'comparison' && condition.operator) {
    const operator = getComparisonOperator(condition.operator);
    if (!operator) {
      console.error(`Unknown comparison operator: ${condition.operator}`);
      return false;
    }
    
    // Extract values from condition or game state
    let leftValue = condition.leftValue;
    let rightValue = condition.rightValue;
    
    // Handle path references to game state
    if (condition.leftValuePath && typeof condition.leftValuePath === 'string') {
      leftValue = getValueFromPath(gameState, condition.leftValuePath);
    }
    
    if (condition.rightValuePath && typeof condition.rightValuePath === 'string') {
      rightValue = getValueFromPath(gameState, condition.rightValuePath);
    }
    
    // Perform the comparison
    return operator.evaluate(leftValue, rightValue);
  }
  
  // If we reach here, the condition format wasn't recognized
  console.error('Unrecognized condition format:', condition);
  return false;
}

/**
 * Create a new trigger listener that executes a callback when conditions are met
 * @param {Object} condition - The trigger condition to listen for
 * @param {Function} callback - The function to call when triggered
 * @param {Object} options - Additional options for the trigger
 * @returns {string} A listener ID that can be used to remove the listener
 */
export function createTriggerListener(condition, callback, options = {}) {
  if (!condition || typeof callback !== 'function') {
    console.error('Invalid condition or callback for trigger listener');
    return null;
  }
  
  const listenerId = generateUniqueId('trigger');
  const context = options.context || TRIGGER_EVALUATION_CONTEXTS.GLOBAL;
  const responseType = options.responseType || TRIGGER_RESPONSE_TYPES.INSTANT.id;
  const responseConfig = options.responseConfig || {};
  
  // Basic validation
  const response = getTriggerResponseType(responseType);
  if (!response) {
    console.error(`Unknown response type: ${responseType}`);
    return null;
  }
  
  // Store the listener
  activeTriggerListeners.set(listenerId, {
    condition,
    callback,
    context,
    responseType,
    responseConfig,
    active: true,
    lastEvaluated: null,
    lastTriggered: null
  });
  
  // Initialize state for special response types
  if (responseType === TRIGGER_RESPONSE_TYPES.PERSISTENT.id) {
    persistentTriggers.set(listenerId, {
      active: false,
      interval: null,
      triggerCount: 0
    });
  } else if (responseType === TRIGGER_RESPONSE_TYPES.CONSUMABLE.id) {
    consumableTriggers.set(listenerId, {
      consumed: false,
      resetTimeout: null
    });
  }
  
  return listenerId;
}

/**
 * Remove a trigger listener by its ID
 * @param {string} listenerId - The ID of the listener to remove
 * @returns {boolean} Whether the listener was successfully removed
 */
export function removeTriggerListener(listenerId) {
  if (!activeTriggerListeners.has(listenerId)) {
    console.warn(`No trigger listener found with ID: ${listenerId}`);
    return false;
  }
  
  // Clean up any associated resources
  if (persistentTriggers.has(listenerId)) {
    const persistentState = persistentTriggers.get(listenerId);
    if (persistentState.interval) {
      clearInterval(persistentState.interval);
    }
    persistentTriggers.delete(listenerId);
  }
  
  if (delayedTriggers.has(listenerId)) {
    const timeout = delayedTriggers.get(listenerId);
    clearTimeout(timeout);
    delayedTriggers.delete(listenerId);
  }
  
  if (consumableTriggers.has(listenerId)) {
    const consumableState = consumableTriggers.get(listenerId);
    if (consumableState.resetTimeout) {
      clearTimeout(consumableState.resetTimeout);
    }
    consumableTriggers.delete(listenerId);
  }
  
  activeTriggerListeners.delete(listenerId);
  return true;
}

/**
 * Register a game event that might trigger effects
 * @param {string} eventType - The type of event that occurred
 * @param {Object} eventData - Data associated with the event
 * @param {Object} gameState - The current game state
 */
export function registerGameEvent(eventType, eventData, gameState) {
  if (!eventType || !gameState) {
    console.error('Invalid event type or game state');
    return;
  }
  
  // Update the game state with the event
  const updatedGameState = {
    ...gameState,
    lastEvent: {
      type: eventType,
      data: eventData,
      timestamp: Date.now()
    }
  };
  
  // Check if the event triggers any listeners
  checkAllTriggers(updatedGameState, eventType);
}

/**
 * Check all registered triggers against the current game state
 * @param {Object} gameState - The current game state
 * @param {string} [triggerContext] - Optional context to filter triggers
 */
export function checkAllTriggers(gameState, triggerContext = null) {
  for (const [listenerId, listener] of activeTriggerListeners.entries()) {
    // Skip inactive listeners
    if (!listener.active) continue;
    
    // Skip if context doesn't match (if specified)
    if (triggerContext && listener.context !== triggerContext && 
        listener.context !== TRIGGER_EVALUATION_CONTEXTS.GLOBAL) {
      continue;
    }
    
    // Check if the listener's condition is met
    const entity = gameState.entity || gameState.player; // Default to player if no specific entity
    const conditionMet = evaluateTriggerCondition(listener.condition, gameState, entity);
    
    // Update last evaluated timestamp
    listener.lastEvaluated = Date.now();
    
    // Handle based on response type
    handleTriggerResponse(listenerId, listener, conditionMet, gameState, entity);
  }
}

/**
 * Handle a trigger response based on its response type
 * @param {string} listenerId - The ID of the trigger listener
 * @param {Object} listener - The listener configuration
 * @param {boolean} conditionMet - Whether the trigger condition is met
 * @param {Object} gameState - The current game state
 * @param {Object} entity - The entity context for the trigger
 */
function handleTriggerResponse(listenerId, listener, conditionMet, gameState, entity) {
  switch (listener.responseType) {
    case TRIGGER_RESPONSE_TYPES.INSTANT.id:
      if (conditionMet) {
        listener.callback(gameState, entity);
        listener.lastTriggered = Date.now();
      }
      break;
      
    case TRIGGER_RESPONSE_TYPES.DELAYED.id:
      handleDelayedTrigger(listenerId, listener, conditionMet, gameState, entity);
      break;
      
    case TRIGGER_RESPONSE_TYPES.PERSISTENT.id:
      handlePersistentTrigger(listenerId, listener, conditionMet, gameState, entity);
      break;
      
    case TRIGGER_RESPONSE_TYPES.CONDITIONAL.id:
      if (conditionMet) {
        // Check secondary condition if specified
        const secondaryCondition = listener.responseConfig.secondaryCondition;
        if (!secondaryCondition || evaluateTriggerCondition(secondaryCondition, gameState, entity)) {
          listener.callback(gameState, entity);
          listener.lastTriggered = Date.now();
        }
      }
      break;
      
    case TRIGGER_RESPONSE_TYPES.CONSUMABLE.id:
      handleConsumableTrigger(listenerId, listener, conditionMet, gameState, entity);
      break;
      
    default:
      console.warn(`Unknown response type: ${listener.responseType}`);
      if (conditionMet) {
        // Default to instant if unknown
        listener.callback(gameState, entity);
        listener.lastTriggered = Date.now();
      }
  }
}

/**
 * Handle a delayed trigger
 * @param {string} listenerId - The ID of the trigger listener
 * @param {Object} listener - The listener configuration
 * @param {boolean} conditionMet - Whether the trigger condition is met
 * @param {Object} gameState - The current game state
 * @param {Object} entity - The entity context for the trigger
 */
function handleDelayedTrigger(listenerId, listener, conditionMet, gameState, entity) {
  const config = listener.responseConfig || {};
  const delay = config.delay || 1000;
  const cancelOnConditionChange = config.cancelOnConditionChange !== false;
  
  // If the condition is no longer met and we should cancel, clear any pending timeout
  if (!conditionMet && cancelOnConditionChange && delayedTriggers.has(listenerId)) {
    clearTimeout(delayedTriggers.get(listenerId));
    delayedTriggers.delete(listenerId);
    return;
  }
  
  // If the condition is met and there's no pending timeout, set one
  if (conditionMet && !delayedTriggers.has(listenerId)) {
    const timeout = setTimeout(() => {
      // Double-check that the condition is still met before triggering
      if (cancelOnConditionChange) {
        const stillMet = evaluateTriggerCondition(listener.condition, gameState, entity);
        if (!stillMet) {
          delayedTriggers.delete(listenerId);
          return;
        }
      }
      
      listener.callback(gameState, entity);
      listener.lastTriggered = Date.now();
      delayedTriggers.delete(listenerId);
    }, delay);
    
    delayedTriggers.set(listenerId, timeout);
  }
}

/**
 * Handle a persistent trigger
 * @param {string} listenerId - The ID of the trigger listener
 * @param {Object} listener - The listener configuration
 * @param {boolean} conditionMet - Whether the trigger condition is met
 * @param {Object} gameState - The current game state
 * @param {Object} entity - The entity context for the trigger
 */
function handlePersistentTrigger(listenerId, listener, conditionMet, gameState, entity) {
  if (!persistentTriggers.has(listenerId)) {
    console.error(`No persistent state found for trigger: ${listenerId}`);
    return;
  }
  
  const persistentState = persistentTriggers.get(listenerId);
  const config = listener.responseConfig || {};
  const interval = config.interval || 1000;
  const maxTriggerCount = config.maxTriggerCount || 0;
  
  // Handle condition becoming true
  if (conditionMet && !persistentState.active) {
    persistentState.active = true;
    persistentState.interval = setInterval(() => {
      // Check if max triggers reached
      if (maxTriggerCount > 0 && persistentState.triggerCount >= maxTriggerCount) {
        clearInterval(persistentState.interval);
        persistentState.interval = null;
        persistentState.active = false;
        return;
      }
      
      // Double-check that the condition is still met
      const stillMet = evaluateTriggerCondition(listener.condition, gameState, entity);
      if (!stillMet) {
        clearInterval(persistentState.interval);
        persistentState.interval = null;
        persistentState.active = false;
        return;
      }
      
      listener.callback(gameState, entity);
      listener.lastTriggered = Date.now();
      persistentState.triggerCount++;
    }, interval);
    
    // Initial trigger
    listener.callback(gameState, entity);
    listener.lastTriggered = Date.now();
    persistentState.triggerCount++;
  }
  
  // Handle condition becoming false
  if (!conditionMet && persistentState.active) {
    clearInterval(persistentState.interval);
    persistentState.interval = null;
    persistentState.active = false;
  }
}

/**
 * Handle a consumable trigger
 * @param {string} listenerId - The ID of the trigger listener
 * @param {Object} listener - The listener configuration
 * @param {boolean} conditionMet - Whether the trigger condition is met
 * @param {Object} gameState - The current game state
 * @param {Object} entity - The entity context for the trigger
 */
function handleConsumableTrigger(listenerId, listener, conditionMet, gameState, entity) {
  if (!consumableTriggers.has(listenerId)) {
    console.error(`No consumable state found for trigger: ${listenerId}`);
    return;
  }
  
  const consumableState = consumableTriggers.get(listenerId);
  
  // Skip if already consumed
  if (consumableState.consumed) return;
  
  if (conditionMet) {
    listener.callback(gameState, entity);
    listener.lastTriggered = Date.now();
    
    // Mark as consumed
    consumableState.consumed = true;
    
    // Set up reset if configured
    const config = listener.responseConfig || {};
    if (config.resetAfterTime && config.resetAfterTime > 0) {
      consumableState.resetTimeout = setTimeout(() => {
        consumableState.consumed = false;
        consumableState.resetTimeout = null;
      }, config.resetAfterTime);
    }
  }
}

// =====================================================================
// TRIGGER EVALUATION IMPLEMENTATIONS
// =====================================================================

/**
 * Evaluates a spatial distance check trigger
 * @param {Object} condition - The trigger condition
 * @param {Object} gameState - The current game state
 * @param {Object} entity - The entity context for the trigger
 * @returns {boolean} Whether the condition is met
 */
function evaluateSpatialDistanceCheck(condition, gameState, entity) {
  if (!entity || !entity.position || !gameState.entities) {
    return false;
  }
  
  const parameters = condition.parameters || [];
  const distanceParam = parameters.find(p => p.name === 'distance');
  const distance = distanceParam ? distanceParam.value : 30; // Default to 30ft
  
  // Handle different trigger types
  switch (condition.triggerType) {
    case 'near_ally': {
      const allyTypeParam = parameters.find(p => p.name === 'allyType');
      const allyType = allyTypeParam ? allyTypeParam.value : 'any';
      
      // Check for nearby allies
      for (const potentialAlly of gameState.entities) {
        // Skip self
        if (potentialAlly.id === entity.id) continue;
        
        // Skip non-allies
        if (potentialAlly.faction !== entity.faction) continue;
        
        // Check ally type
        if (allyType !== 'any') {
          if (allyType === 'player' && potentialAlly.type !== 'player') continue;
          if (allyType === 'companion' && potentialAlly.type !== 'companion') continue;
          if (allyType === 'specific') {
            const specificAllyParam = parameters.find(p => p.name === 'specificAlly');
            const specificAlly = specificAllyParam ? specificAllyParam.value : '';
            if (potentialAlly.id !== specificAlly && potentialAlly.name !== specificAlly) continue;
          }
        }
        
        // Check distance
        const dist = calculateDistance(entity.position, potentialAlly.position);
        if (dist <= distance) {
          return true;
        }
      }
      return false;
    }
    
    case 'near_enemy': {
      const enemyTypeParam = parameters.find(p => p.name === 'enemyType');
      const enemyType = enemyTypeParam ? enemyTypeParam.value : 'any';
      
      const minEnemiesParam = parameters.find(p => p.name === 'minEnemies');
      const minEnemies = minEnemiesParam ? minEnemiesParam.value : 1;
      
      // Count nearby enemies
      let nearbyEnemiesCount = 0;
      
      for (const potentialEnemy of gameState.entities) {
        // Skip non-enemies
        if (potentialEnemy.faction === entity.faction) continue;
        
        // Check enemy type
        if (enemyType !== 'any') {
          if (!potentialEnemy.creatureType) continue;
          
          if (enemyType === 'specific') {
            const specificEnemyParam = parameters.find(p => p.name === 'specificEnemy');
            const specificEnemy = specificEnemyParam ? specificEnemyParam.value : '';
            if (potentialEnemy.creatureType !== specificEnemy) continue;
          } else if (potentialEnemy.creatureType !== enemyType) {
            continue;
          }
        }
        
        // Check distance
        const dist = calculateDistance(entity.position, potentialEnemy.position);
        if (dist <= distance) {
          nearbyEnemiesCount++;
          
          if (nearbyEnemiesCount >= minEnemies) {
            return true;
          }
        }
      }
      return false;
    }
    
    // Implement other proximity trigger types
    
    default:
      console.warn(`Unimplemented spatial distance check: ${condition.triggerType}`);
      return false;
  }
}

/**
 * Evaluates an effect application check trigger
 * @param {Object} condition - The trigger condition
 * @param {Object} gameState - The current game state
 * @param {Object} entity - The entity context for the trigger
 * @returns {boolean} Whether the condition is met
 */
function evaluateEffectApplicationCheck(condition, gameState, entity) {
  // If there's no last event, or it's not a status effect application, return false
  if (!gameState.lastEvent || gameState.lastEvent.type !== 'effect_applied') {
    return false;
  }
  
  const eventData = gameState.lastEvent.data;
  
  // Check if the effect was applied to this entity
  if (!eventData || !eventData.targetId || eventData.targetId !== entity.id) {
    return false;
  }
  
  const parameters = condition.parameters || [];
  
  // Check effect type
  const effectTypeParam = parameters.find(p => p.name === 'effectType');
  const effectType = effectTypeParam ? effectTypeParam.value : 'any';
  
  if (effectType !== 'any') {
    // For "positive" or "negative" effect types
    if (effectType === 'positive' && !eventData.isPositive) return false;
    if (effectType === 'negative' && !eventData.isNegative) return false;
    
    // For specific effect
    if (effectType === 'specific') {
      const specificEffectParam = parameters.find(p => p.name === 'specificEffect');
      const specificEffect = specificEffectParam ? specificEffectParam.value : '';
      
      if (eventData.effectId !== specificEffect && eventData.effectName !== specificEffect) {
        return false;
      }
    }
  }
  
  // Check source criteria
  const sourceCriteriaParam = parameters.find(p => p.name === 'sourceCriteria');
  const sourceCriteria = sourceCriteriaParam ? sourceCriteriaParam.value : 'any';
  
  if (sourceCriteria !== 'any' && eventData.sourceId) {
    const source = gameState.entities.find(e => e.id === eventData.sourceId);
    
    if (!source) return false;
    
    if (sourceCriteria === 'self' && source.id !== entity.id) return false;
    if (sourceCriteria === 'ally' && source.faction !== entity.faction) return false;
    if (sourceCriteria === 'enemy' && source.faction === entity.faction) return false;
  }
  
  return true;
}

/**
 * Evaluates a health threshold check trigger
 * @param {Object} condition - The trigger condition
 * @param {Object} gameState - The current game state
 * @param {Object} entity - The entity context for the trigger
 * @returns {boolean} Whether the condition is met
 */
function evaluateHealthThresholdCheck(condition, gameState, entity) {
  const parameters = condition.parameters || [];
  
  // Determine the target entity to check
  let targetEntity = entity;
  
  const targetTypeParam = parameters.find(p => p.name === 'targetType');
  const targetType = targetTypeParam ? targetTypeParam.value : 'self';
  
  if (targetType !== 'self') {
    if (targetType === 'ally') {
      const specificAllyParam = parameters.find(p => p.name === 'specificAlly');
      const specificAlly = specificAllyParam ? specificAllyParam.value : '';
      
      if (specificAlly) {
        targetEntity = gameState.entities.find(e => 
          (e.id === specificAlly || e.name === specificAlly) && e.faction === entity.faction
        );
        
        if (!targetEntity) return false;
      } else {
        return false; // No specific ally specified
      }
    } else if (targetType === 'any_ally') {
      // Check if ANY ally meets the threshold
      const thresholdParam = parameters.find(p => p.name === 'threshold');
      const threshold = thresholdParam ? thresholdParam.value : 30; // Default to 30%
      
      const comparisonParam = parameters.find(p => p.name === 'comparison');
      const comparison = comparisonParam ? comparisonParam.value : 'below';
      
      for (const ally of gameState.entities) {
        if (ally.id === entity.id) continue; // Skip self
        if (ally.faction !== entity.faction) continue; // Skip non-allies
        
        if (!ally.health || !ally.maxHealth) continue;
        
        const healthPercent = (ally.health / ally.maxHealth) * 100;
        
        if (comparison === 'below' && healthPercent < threshold) return true;
        if (comparison === 'above' && healthPercent > threshold) return true;
        if (comparison === 'exactly' && Math.abs(healthPercent - threshold) < 0.1) return true;
      }
      
      return false;
    } else {
      return false; // Unsupported target type
    }
  }
  
  // Skip if no valid health data
  if (!targetEntity.health || !targetEntity.maxHealth) {
    return false;
  }
  
  const healthPercent = (targetEntity.health / targetEntity.maxHealth) * 100;
  
  const thresholdParam = parameters.find(p => p.name === 'threshold');
  const threshold = thresholdParam ? thresholdParam.value : 30; // Default to 30%
  
  const comparisonParam = parameters.find(p => p.name === 'comparison');
  const comparison = comparisonParam ? comparisonParam.value : 'below';
  
  switch (comparison) {
    case 'below':
      return healthPercent < threshold;
    case 'above':
      return healthPercent > threshold;
    case 'exactly':
      return Math.abs(healthPercent - threshold) < 0.1; // Small epsilon for float comparison
    default:
      return false;
  }
}

/**
 * Evaluates a damage taken check trigger
 * @param {Object} condition - The trigger condition
 * @param {Object} gameState - The current game state
 * @param {Object} entity - The entity context for the trigger
 * @returns {boolean} Whether the condition is met
 */
function evaluateDamageTakenCheck(condition, gameState, entity) {
  // If there's no last event, or it's not a damage event, return false
  if (!gameState.lastEvent || gameState.lastEvent.type !== 'damage_taken') {
    return false;
  }
  
  const eventData = gameState.lastEvent.data;
  
  // Check if the damage was dealt to this entity
  if (!eventData || !eventData.targetId || eventData.targetId !== entity.id) {
    return false;
  }
  
  const parameters = condition.parameters || [];
  
  // Check damage type
  const damageTypeParam = parameters.find(p => p.name === 'damageType');
  const damageType = damageTypeParam ? damageTypeParam.value : 'any';
  
  if (damageType !== 'any') {
    if (damageType === 'physical' && eventData.damageType !== 'physical') return false;
    if (damageType === 'magical' && eventData.damageType !== 'magical') return false;
    
    if (damageType === 'specific') {
      const specificDamageTypeParam = parameters.find(p => p.name === 'specificDamageType');
      const specificDamageType = specificDamageTypeParam ? specificDamageTypeParam.value : '';
      
      if (eventData.specificDamageType !== specificDamageType) {
        return false;
      }
    }
  }
  
  // Check damage threshold
  const thresholdParam = parameters.find(p => p.name === 'threshold');
  const threshold = thresholdParam ? thresholdParam.value : 0;
  
  const thresholdTypeParam = parameters.find(p => p.name === 'thresholdType');
  const thresholdType = thresholdTypeParam ? thresholdTypeParam.value : 'flat';
  
  if (threshold > 0) {
    if (thresholdType === 'flat' && eventData.amount < threshold) {
      return false;
    } else if (thresholdType === 'percentage') {
      // For percentage, compare against max health
      if (!entity.maxHealth) return false;
      
      const damagePercentage = (eventData.amount / entity.maxHealth) * 100;
      if (damagePercentage < threshold) {
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Evaluates a damage dealt check trigger
 * @param {Object} condition - The trigger condition
 * @param {Object} gameState - The current game state
 * @param {Object} entity - The entity context for the trigger
 * @returns {boolean} Whether the condition is met
 */
function evaluateDamageDealtCheck(condition, gameState, entity) {
  // If there's no last event, or it's not a damage event, return false
  if (!gameState.lastEvent || gameState.lastEvent.type !== 'damage_dealt') {
    return false;
  }
  
  const eventData = gameState.lastEvent.data;
  
  // Check if the damage was dealt by this entity
  if (!eventData || !eventData.sourceId || eventData.sourceId !== entity.id) {
    return false;
  }
  
  const parameters = condition.parameters || [];
  
  // Check damage type
  const damageTypeParam = parameters.find(p => p.name === 'damageType');
  const damageType = damageTypeParam ? damageTypeParam.value : 'any';
  
  if (damageType !== 'any') {
    if (damageType === 'physical' && eventData.damageType !== 'physical') return false;
    if (damageType === 'magical' && eventData.damageType !== 'magical') return false;
    
    if (damageType === 'specific') {
      const specificDamageTypeParam = parameters.find(p => p.name === 'specificDamageType');
      const specificDamageType = specificDamageTypeParam ? specificDamageTypeParam.value : '';
      
      if (eventData.specificDamageType !== specificDamageType) {
        return false;
      }
    }
  }
  
  // Check attack type
  const attackTypeParam = parameters.find(p => p.name === 'attackType');
  const attackType = attackTypeParam ? attackTypeParam.value : 'any';
  
  if (attackType !== 'any' && eventData.attackType !== attackType) {
    return false;
  }
  
  // Check minimum damage
  const minDamageParam = parameters.find(p => p.name === 'minDamage');
  const minDamage = minDamageParam ? minDamageParam.value : 0;
  
  if (minDamage > 0 && eventData.amount < minDamage) {
    return false;
  }
  
  return true;
}

/**
 * Evaluates a combat state check trigger
 * @param {Object} condition - The trigger condition
 * @param {Object} gameState - The current game state
 * @param {Object} entity - The entity context for the trigger
 * @returns {boolean} Whether the condition is met
 */
function evaluateCombatStateCheck(condition, gameState, entity) {
  // If there's no last event, or it's not a combat state event, return false
  if (!gameState.lastEvent || 
      (gameState.lastEvent.type !== 'combat_enter' && 
       gameState.lastEvent.type !== 'combat_exit')) {
    return false;
  }
  
  const eventData = gameState.lastEvent.data;
  const parameters = condition.parameters || [];
  
  // Check state parameter
  const stateParam = parameters.find(p => p.name === 'state');
  const state = stateParam ? stateParam.value : 'entering';
  
  // Check if the event matches the state
  if (state === 'entering' && gameState.lastEvent.type !== 'combat_enter') return false;
  if (state === 'leaving' && gameState.lastEvent.type !== 'combat_exit') return false;
  if (state !== 'either' && state !== 'entering' && state !== 'leaving') return false;
  
  // For entering combat, check enemy type
  if (state === 'entering' || (state === 'either' && gameState.lastEvent.type === 'combat_enter')) {
    const enemyTypeParam = parameters.find(p => p.name === 'enemyType');
    const enemyType = enemyTypeParam ? enemyTypeParam.value : 'any';
    
    if (enemyType !== 'any' && eventData.enemyType) {
      if (enemyType === 'elite' && !eventData.isElite) return false;
      if (enemyType === 'boss' && !eventData.isBoss) return false;
      if (enemyType === 'normal' && (eventData.isElite || eventData.isBoss)) return false;
      if (enemyType === 'multiple' && eventData.enemyCount < 2) return false;
    }
  }
  
  // For leaving combat, check victory type
  if (state === 'leaving' || (state === 'either' && gameState.lastEvent.type === 'combat_exit')) {
    const victoryTypeParam = parameters.find(p => p.name === 'victoryType');
    const victoryType = victoryTypeParam ? victoryTypeParam.value : 'any';
    
    if (victoryType !== 'any' && eventData.victoryType) {
      if (victoryType !== eventData.victoryType) return false;
    }
  }
  
  return true;
}

// =====================================================================
// UTILITY FUNCTIONS
// =====================================================================

/**
 * Calculate distance between two points
 * @param {Object} point1 - First point with x, y, z coordinates
 * @param {Object} point2 - Second point with x, y, z coordinates
 * @returns {number} The distance between the points
 */
function calculateDistance(point1, point2) {
  if (!point1 || !point2) return Infinity;
  
  const dx = (point2.x || 0) - (point1.x || 0);
  const dy = (point2.y || 0) - (point1.y || 0);
  const dz = (point2.z || 0) - (point1.z || 0);
  
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Get a value from an object using a dot-notation path
 * @param {Object} obj - The object to extract a value from
 * @param {string} path - The dot-notation path to the value
 * @returns {*} The value at the path, or undefined if not found
 */
function getValueFromPath(obj, path) {
  if (!obj || !path) return undefined;
  
  const pathParts = path.split('.');
  let current = obj;
  
  for (const part of pathParts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    
    current = current[part];
  }
  
  return current;
}

/**
 * Build a trigger from a template defined in triggerTypes.js
 * @param {string} triggerType - The type of trigger to create
 * @param {Array} parameters - The parameters for the trigger
 * @returns {Object} A trigger condition object
 */
export function buildTriggerFromTemplate(triggerType, parameters = []) {
  const triggerDef = TriggerUtils.getTriggerById(triggerType);
  if (!triggerDef) {
    console.error(`Unknown trigger type: ${triggerType}`);
    return null;
  }
  
  // Validate parameters against the trigger definition
  const validation = TriggerUtils.validateTriggerParameters(triggerType, parameters);
  if (!validation.valid) {
    console.error(`Invalid parameters for trigger type ${triggerType}:`, validation.errors);
    return null;
  }
  
  return {
    id: generateUniqueId('trigger_condition'),
    type: 'primitive',
    triggerType,
    parameters
  };
}

/**
 * Validate a trigger condition
 * @param {Object} trigger - The trigger condition to validate
 * @returns {Object} Validation result with valid boolean and errors array
 */
export function validateTrigger(trigger) {
  if (!trigger) {
    return { valid: false, errors: ['Trigger condition is null or undefined'] };
  }
  
  if (!trigger.type) {
    return { valid: false, errors: ['Trigger condition missing type'] };
  }
  
  const errors = [];
  
  // Validate based on type
  if (trigger.type === 'primitive') {
    if (!trigger.triggerType) {
      errors.push('Primitive trigger missing triggerType');
    } else {
      const triggerDef = TriggerUtils.getTriggerById(trigger.triggerType);
      if (!triggerDef) {
        errors.push(`Unknown trigger type: ${trigger.triggerType}`);
      } else {
        // Validate parameters
        const paramValidation = TriggerUtils.validateTriggerParameters(
          trigger.triggerType,
          trigger.parameters || []
        );
        
        if (!paramValidation.valid) {
          errors.push(...paramValidation.errors);
        }
      }
    }
  } else if (trigger.type === 'composite') {
    if (!trigger.logic) {
      errors.push('Composite trigger missing logic operator');
    } else {
      const logicOperator = getCompositeLogic(trigger.logic);
      if (!logicOperator) {
        errors.push(`Unknown logic operator: ${trigger.logic}`);
      }
    }
    
    if (!trigger.conditions || !Array.isArray(trigger.conditions)) {
      errors.push('Composite trigger missing or invalid conditions array');
    } else {
      if (trigger.logic === 'not' && trigger.conditions.length !== 1) {
        errors.push('NOT logic should have exactly one condition');
      }
      
      if (trigger.logic === 'if_then' && trigger.conditions.length !== 2) {
        errors.push('IF_THEN logic should have exactly two conditions');
      }
      
      // Recursively validate all child conditions
      trigger.conditions.forEach((childCondition, index) => {
        const childValidation = validateTrigger(childCondition);
        if (!childValidation.valid) {
          childValidation.errors.forEach(error => {
            errors.push(`Condition ${index}: ${error}`);
          });
        }
      });
    }
  } else if (trigger.type === 'comparison') {
    if (!trigger.operator) {
      errors.push('Comparison trigger missing operator');
    } else {
      const operator = getComparisonOperator(trigger.operator);
      if (!operator) {
        errors.push(`Unknown comparison operator: ${trigger.operator}`);
      }
    }
    
    if (!trigger.leftValue && !trigger.leftValuePath) {
      errors.push('Comparison trigger missing left value or value path');
    }
    
    if (!trigger.rightValue && !trigger.rightValuePath) {
      errors.push('Comparison trigger missing right value or value path');
    }
  } else {
    errors.push(`Unknown trigger type: ${trigger.type}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Generate a human-readable description of a trigger
 * @param {Object} trigger - The trigger condition
 * @returns {string} A description of the trigger
 */
export function getTriggerDescription(trigger) {
  if (!trigger) return 'Invalid trigger';
  
  if (trigger.type === 'primitive') {
    const triggerDef = TriggerUtils.getTriggerById(trigger.triggerType);
    if (!triggerDef) return `Unknown trigger type: ${trigger.triggerType}`;
    
    return TriggerUtils.describeTrigger(trigger);
  }
  
  if (trigger.type === 'composite') {
    const logicOperator = getCompositeLogic(trigger.logic);
    if (!logicOperator) return `Unknown logic operator: ${trigger.logic}`;
    
    if (!trigger.conditions || !Array.isArray(trigger.conditions)) {
      return `${logicOperator.name} with invalid conditions`;
    }
    
    if (trigger.logic === 'not') {
      if (trigger.conditions.length !== 1) {
        return `NOT with ${trigger.conditions.length} conditions (should be 1)`;
      }
      return `NOT (${getTriggerDescription(trigger.conditions[0])})`;
    }
    
    if (trigger.logic === 'if_then') {
      if (trigger.conditions.length !== 2) {
        return `IF_THEN with ${trigger.conditions.length} conditions (should be 2)`;
      }
      return `IF (${getTriggerDescription(trigger.conditions[0])}) THEN (${getTriggerDescription(trigger.conditions[1])})`;
    }
    
    const descriptions = trigger.conditions.map(c => `(${getTriggerDescription(c)})`);
    return descriptions.join(` ${logicOperator.name} `);
  }
  
  if (trigger.type === 'comparison') {
    const operator = getComparisonOperator(trigger.operator);
    if (!operator) return `Unknown comparison operator: ${trigger.operator}`;
    
    let leftString = trigger.leftValuePath ? 
      `[${trigger.leftValuePath}]` : 
      String(trigger.leftValue);
    
    let rightString = trigger.rightValuePath ? 
      `[${trigger.rightValuePath}]` : 
      String(trigger.rightValue);
    
    return `${leftString} ${operator.symbol} ${rightString}`;
  }
  
  return `Unknown trigger type: ${trigger.type}`;
}

/**
 * Serialize a trigger to a JSON string
 * @param {Object} trigger - The trigger to serialize
 * @returns {string} JSON string representation of the trigger
 */
export function serializeTrigger(trigger) {
  if (!trigger) return null;
  
  // Validate the trigger first
  const validation = validateTrigger(trigger);
  if (!validation.valid) {
    console.error('Cannot serialize invalid trigger:', validation.errors);
    return null;
  }
  
  return JSON.stringify(trigger);
}

/**
 * Deserialize a trigger from a JSON string
 * @param {string} data - The serialized trigger data
 * @returns {Object} The deserialized trigger object
 */
export function deserializeTrigger(data) {
  if (!data) return null;
  
  try {
    const trigger = JSON.parse(data);
    
    // Validate the trigger
    const validation = validateTrigger(trigger);
    if (!validation.valid) {
      console.error('Deserialized an invalid trigger:', validation.errors);
      return null;
    }
    
    return trigger;
  } catch (error) {
    console.error('Error deserializing trigger:', error);
    return null;
  }
}

/**
 * Create a composite trigger from multiple trigger conditions
 * @param {Array} triggers - Array of trigger conditions
 * @param {string} operator - Logic operator to use (from TRIGGER_COMPOSITE_LOGIC)
 * @returns {Object} A composite trigger condition
 */
export function createCompositeTrigger(triggers, operator = 'and') {
  if (!triggers || !Array.isArray(triggers) || triggers.length === 0) {
    console.error('Invalid triggers array for composite trigger');
    return null;
  }
  
  const logicOperator = getCompositeLogic(operator);
  if (!logicOperator) {
    console.error(`Unknown logic operator: ${operator}`);
    return null;
  }
  
  // Special case: if there's only one trigger and not using NOT
  if (triggers.length === 1 && operator !== 'not') {
    return triggers[0];
  }
  
  // Validate NOT and IF_THEN special cases
  if (operator === 'not' && triggers.length !== 1) {
    console.error(`NOT operator requires exactly one condition, got ${triggers.length}`);
    return null;
  }
  
  if (operator === 'if_then' && triggers.length !== 2) {
    console.error(`IF_THEN operator requires exactly two conditions, got ${triggers.length}`);
    return null;
  }
  
  // Validate all triggers
  for (const trigger of triggers) {
    const validation = validateTrigger(trigger);
    if (!validation.valid) {
      console.error('Cannot create composite with invalid trigger:', validation.errors);
      return null;
    }
  }
  
  return {
    id: generateUniqueId('composite_trigger'),
    type: 'composite',
    logic: operator,
    conditions: [...triggers]
  };
}

// =====================================================================
// SYSTEM EXAMPLE PRESETS
// =====================================================================

/**
 * Predefined trigger examples for different game mechanics
 * @type {Object}
 */
export const TRIGGER_EXAMPLES = {
  /**
   * Trigger when health is low and in combat
   */
  LOW_HEALTH_IN_COMBAT: createCompositeTrigger([
    buildTriggerFromTemplate('health_threshold', [
      { name: 'threshold', value: 25 },
      { name: 'comparison', value: 'below' },
      { name: 'targetType', value: 'self' }
    ]),
    {
      type: 'comparison',
      operator: 'equals',
      leftValuePath: 'player.inCombat',
      rightValue: true
    }
  ], 'and'),
  
  /**
   * Trigger when surrounded by multiple enemies
   */
  SURROUNDED_BY_ENEMIES: buildTriggerFromTemplate('near_enemy', [
    { name: 'distance', value: 15 },
    { name: 'enemyType', value: 'any' },
    { name: 'minEnemies', value: 3 }
  ]),
  
  /**
   * Trigger on special result to apply a bonus effect
   */
  SPECIAL_RESULT_PROC: buildTriggerFromTemplate('special_result', [
    { name: 'resultType', value: 'exceptional' },
    { name: 'actionType', value: 'any' },
    { name: 'targetType', value: 'any' }
  ]),
  
  /**
   * Trigger when poisoned to attempt automatic cleanse
   */
  AUTO_CLEANSE_POISON: buildTriggerFromTemplate('effect_applied', [
    { name: 'effectType', value: 'specific' },
    { name: 'specificEffect', value: 'poison' },
    { name: 'sourceCriteria', value: 'any' }
  ]),
  
  /**
   * Trigger when entering combat with a boss
   */
  BOSS_ENCOUNTER_START: buildTriggerFromTemplate('combat_state', [
    { name: 'state', value: 'entering' },
    { name: 'enemyType', value: 'boss' }
  ])
};

// Export everything for direct use
export default {
  TRIGGER_EVALUATION_CONTEXTS,
  TRIGGER_COMPARISON_OPERATORS,
  TRIGGER_COMPOSITE_LOGIC,
  TRIGGER_RESPONSE_TYPES,
  TRIGGER_EXAMPLES,
  evaluateTriggerCondition,
  createTriggerListener,
  removeTriggerListener,
  registerGameEvent,
  checkAllTriggers,
  buildTriggerFromTemplate,
  validateTrigger,
  getTriggerDescription,
  serializeTrigger,
  deserializeTrigger,
  createCompositeTrigger
};