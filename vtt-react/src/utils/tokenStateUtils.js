/**
 * Token State Utilities
 * Provides unified access to token state across creature and character tokens
 */

/**
 * Get token resources (HP, Mana, AP) with unified interface
 * Works for both creature tokens and character tokens
 */
export const getTokenResources = (target, targetType) => {
  if (targetType === 'party_member' || targetType === 'player') {
    // Character resources from character store
    const health = target.character?.health || { current: 0, max: 0 };
    const mana = target.character?.mana || { current: 0, max: 0 };
    const actionPoints = target.character?.actionPoints || { current: 0, max: 0 };

    return {
      health,
      mana,
      actionPoints,
      tempHealth: target.character?.tempHealth || 0,
      tempMana: target.character?.tempMana || 0,
      tempActionPoints: target.character?.tempActionPoints || 0
    };
  } else if (targetType === 'creature') {
    // Creature resources from token state
    const state = target.state || {};
    const stats = target.stats || {};

    return {
      health: {
        current: state.currentHp ?? stats.currentHp ?? stats.maxHp ?? 0,
        max: state.maxHp ?? stats.maxHp ?? 100
      },
      mana: {
        current: state.currentMana ?? stats.currentMana ?? stats.maxMana ?? 0,
        max: state.maxMana ?? stats.maxMana ?? 50
      },
      actionPoints: {
        current: state.currentActionPoints ?? stats.currentActionPoints ?? stats.maxActionPoints ?? 0,
        max: state.maxActionPoints ?? stats.maxActionPoints ?? 3
      },
      tempHealth: state.tempHealth || 0,
      tempMana: state.tempMana || 0,
      tempActionPoints: state.tempActionPoints || 0
    };
  }

  return {
    health: { current: 0, max: 0 },
    mana: { current: 0, max: 0 },
    actionPoints: { current: 0, max: 0 },
    tempHealth: 0,
    tempMana: 0,
    tempActionPoints: 0
  };
};

/**
 * Get token conditions with unified interface
 */
export const getTokenConditions = (target, targetType) => {
  if (targetType === 'party_member' || targetType === 'player') {
    return target.character?.tokenState?.conditions || [];
  } else if (targetType === 'creature') {
    return target.state?.conditions || [];
  }
  return [];
};

/**
 * Get state key for resource type (for creature tokens)
 */
export const getStateKeyForResource = (resourceType) => {
  const keyMap = {
    'health': 'currentHp',
    'mana': 'currentMana',
    'actionPoints': 'currentActionPoints'
  };
  return keyMap[resourceType];
};

/**
 * Get temp field name for resource type (for character tokens)
 */
export const getTempFieldName = (resourceType) => {
  const fieldMap = {
    'health': 'tempHealth',
    'mana': 'tempMana',
    'actionPoints': 'tempActionPoints'
  };
  return fieldMap[resourceType];
};

/**
 * Normalize token data for consistent handling
 */
export const normalizeTokenData = (token, targetType) => {
  if (targetType === 'creature') {
    // Ensure creature token has state object
    return {
      ...token,
      state: token.state || {
        currentHp: token.stats?.currentHp || token.stats?.maxHp || 35,
        currentMana: token.stats?.currentMana || token.stats?.maxMana || 0,
        currentActionPoints: token.stats?.currentActionPoints || token.stats?.maxActionPoints || 2,
        tempHealth: 0,
        tempMana: 0,
        tempActionPoints: 0,
        conditions: [],
        customIcon: null,
        iconScale: 100,
        iconPosition: { x: 50, y: 50 }
      }
    };
  } else if (targetType === 'party_member' || targetType === 'player') {
    // Ensure character token has token state for conditions
    return {
      ...token,
      state: token.state || {
        conditions: []
      }
    };
  }
  return token;
};
