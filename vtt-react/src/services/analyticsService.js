/**
 * Advanced Analytics Service
 *
 * Tracks user behavior, feature usage, and engagement metrics
 * Provides insights into how users interact with the application
 */

import { recordMetric, recordUserInteraction, recordApiCall } from './performanceService';

// Analytics event types
export const ANALYTICS_EVENTS = {
  // User engagement
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  SESSION_START: 'session_start',
  SESSION_END: 'session_end',

  // Feature usage
  CHARACTER_CREATED: 'character_created',
  CHARACTER_EDITED: 'character_edited',
  SPELL_CAST: 'spell_cast',
  DICE_ROLLED: 'dice_rolled',
  COMBAT_STARTED: 'combat_started',
  COMBAT_ENDED: 'combat_ended',

  // Navigation
  PAGE_VIEW: 'page_view',
  FEATURE_ACCESSED: 'feature_accessed',
  TOOLBAR_CLICK: 'toolbar_click',

  // Content creation
  MAP_CREATED: 'map_created',
  CREATURE_CREATED: 'creature_created',
  ITEM_CREATED: 'item_created',
  CAMPAIGN_CREATED: 'campaign_created',

  // Social features
  MESSAGE_SENT: 'message_sent',
  FRIEND_ADDED: 'friend_added',
  ROOM_JOINED: 'room_joined',

  // Error tracking
  ERROR_OCCURRED: 'error_occurred',
  FEATURE_FAILED: 'feature_failed'
};

/**
 * Initialize analytics tracking
 */
export function initializeAnalytics(userId) {
  console.log('Analytics tracking initialized');

  // Track session start
  trackEvent(ANALYTICS_EVENTS.SESSION_START, {
    userId,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  // Set up automatic tracking for common events
  setupAutomaticTracking(userId);
}

/**
 * Track a custom analytics event
 */
export function trackEvent(eventType, data = {}, userId = null) {
  try {
    recordMetric('analytics_event', {
      eventType,
      data,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId()
    }, userId);

    console.log(`📊 Event tracked: ${eventType}`, data);
  } catch (error) {
    console.error('Failed to track analytics event:', error);
  }
}

/**
 * Track user interaction with UI elements
 */
export function trackInteraction(elementType, elementId, action, metadata = {}) {
  try {
    recordUserInteraction('ui_interaction', {
      elementType, // 'button', 'menu', 'form', 'modal', etc.
      elementId,   // specific identifier
      action,      // 'click', 'hover', 'submit', 'cancel', etc.
      metadata,
      timestamp: new Date().toISOString()
    });

    console.log(`👆 UI Interaction: ${elementType}.${elementId} - ${action}`);
  } catch (error) {
    console.error('Failed to track UI interaction:', error);
  }
}

/**
 * Track feature usage
 */
export function trackFeatureUsage(featureName, action, duration = null, metadata = {}) {
  try {
    recordMetric('feature_usage', {
      featureName,
      action,
      duration,
      metadata,
      timestamp: new Date().toISOString()
    });

    console.log(`⚡ Feature Used: ${featureName} - ${action}${duration ? ` (${duration}ms)` : ''}`);
  } catch (error) {
    console.error('Failed to track feature usage:', error);
  }
}

/**
 * Track time spent on features
 */
export class FeatureTimer {
  constructor(featureName, metadata = {}) {
    this.featureName = featureName;
    this.metadata = metadata;
    this.startTime = Date.now();
    this.isActive = true;
  }

  end(metadata = {}) {
    if (!this.isActive) return;

    const duration = Date.now() - this.startTime;
    this.isActive = false;

    trackFeatureUsage(this.featureName, 'completed', duration, {
      ...this.metadata,
      ...metadata
    });

    return duration;
  }

  cancel(reason = 'user_cancelled') {
    if (!this.isActive) return;

    const duration = Date.now() - this.startTime;
    this.isActive = false;

    trackFeatureUsage(this.featureName, 'cancelled', duration, {
      ...this.metadata,
      reason
    });
  }
}

/**
 * Create a feature usage timer
 */
export function startFeatureTimer(featureName, metadata = {}) {
  return new FeatureTimer(featureName, metadata);
}

/**
 * Track API call with analytics
 */
export function trackApiCall(endpoint, method, success, responseTime, error = null) {
  recordApiCall(endpoint, method, responseTime, success, error);

  trackEvent(success ? 'api_call_success' : 'api_call_failure', {
    endpoint,
    method,
    responseTime,
    error: error?.message,
    statusCode: error?.statusCode
  });
}

/**
 * Track user journey/flow
 */
export function trackUserJourney(step, journeyType, metadata = {}) {
  trackEvent('user_journey', {
    step,
    journeyType, // 'character_creation', 'combat_setup', 'campaign_planning', etc.
    metadata,
    timestamp: new Date().toISOString()
  });
}

/**
 * Track conversion events
 */
export function trackConversion(eventType, value = null, metadata = {}) {
  trackEvent('conversion', {
    eventType, // 'first_character_created', 'first_campaign_created', 'premium_upgrade', etc.
    value,
    metadata,
    timestamp: new Date().toISOString()
  });
}

/**
 * Set up automatic tracking for common events
 */
function setupAutomaticTracking(userId) {
  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      trackEvent('page_hidden', { timestamp: new Date().toISOString() });
    } else {
      trackEvent('page_visible', { timestamp: new Date().toISOString() });
    }
  });

  // Track clicks on important UI elements
  const trackableSelectors = [
    '[data-track]',
    'button:not([data-no-track])',
    '.modal button',
    '.toolbar button',
    '.navigation button'
  ];

  // Use event delegation for better performance
  document.addEventListener('click', (event) => {
    const element = event.target.closest(trackableSelectors.join(', '));
    if (element) {
      const trackingData = element.dataset.track;
      if (trackingData) {
        try {
          const data = JSON.parse(trackingData);
          trackInteraction(data.type || 'button', data.id || element.id || element.className, 'click', data.metadata);
        } catch (error) {
          trackInteraction('button', element.id || element.className || 'unknown', 'click');
        }
      }
    }
  });

  // Track form submissions
  document.addEventListener('submit', (event) => {
    const form = event.target;
    trackInteraction('form', form.id || form.className || 'unknown', 'submit', {
      action: form.action,
      method: form.method
    });
  });

  // Track errors globally
  window.addEventListener('error', (event) => {
    trackEvent(ANALYTICS_EVENTS.ERROR_OCCURRED, {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      url: window.location.href
    });
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    trackEvent(ANALYTICS_EVENTS.ERROR_OCCURRED, {
      type: 'unhandled_promise_rejection',
      reason: event.reason?.message || String(event.reason),
      stack: event.reason?.stack,
      url: window.location.href
    });
  });
}

/**
 * Get session ID (reuse from performance service)
 */
function getSessionId() {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `analytics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Track user engagement metrics
 */
export function trackEngagement(metric, value, metadata = {}) {
  trackEvent('user_engagement', {
    metric, // 'time_spent', 'features_used', 'characters_created', etc.
    value,
    metadata,
    timestamp: new Date().toISOString()
  });
}

/**
 * Track performance metrics with business context
 */
export function trackPerformanceMetric(metricName, value, unit = 'ms', context = {}) {
  recordMetric('performance_business', {
    metricName,
    value,
    unit,
    context,
    timestamp: new Date().toISOString()
  });
}

/**
 * Export analytics data for analysis
 */
export function exportAnalyticsData(timeRange = '7d') {
  // This would integrate with the performance service's export functionality
  // For now, return a placeholder
  return {
    timeRange,
    exportedAt: new Date().toISOString(),
    note: 'Analytics data export would integrate with performance service'
  };
}

// Convenience functions for common events

export const Analytics = {
  // User events
  login: (method) => trackEvent(ANALYTICS_EVENTS.USER_LOGIN, { method }),
  logout: () => trackEvent(ANALYTICS_EVENTS.USER_LOGOUT),

  // Character events
  characterCreated: (characterData) => trackEvent(ANALYTICS_EVENTS.CHARACTER_CREATED, {
    class: characterData.class,
    race: characterData.race,
    level: characterData.level
  }),
  characterEdited: (characterId, changes) => trackEvent(ANALYTICS_EVENTS.CHARACTER_EDITED, {
    characterId,
    changes: Object.keys(changes)
  }),

  // Combat events
  combatStarted: (combatants) => trackEvent(ANALYTICS_EVENTS.COMBAT_STARTED, {
    participantCount: combatants.length
  }),
  combatEnded: (duration, winner) => trackEvent(ANALYTICS_EVENTS.COMBAT_ENDED, {
    duration,
    winner
  }),

  // Dice events
  diceRolled: (dice, total, context = 'manual') => trackEvent(ANALYTICS_EVENTS.DICE_ROLLED, {
    dice,
    total,
    context
  }),

  // Content creation events
  spellCreated: (spellData) => trackEvent('spell_created', spellData),
  creatureCreated: (creatureData) => trackEvent(ANALYTICS_EVENTS.CREATURE_CREATED, {
    type: creatureData.type,
    cr: creatureData.cr
  }),
  itemCreated: (itemData) => trackEvent(ANALYTICS_EVENTS.ITEM_CREATED, {
    type: itemData.type,
    rarity: itemData.rarity
  }),

  // Navigation events
  pageViewed: (page, from) => trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, {
    page,
    from,
    referrer: document.referrer
  }),
  featureAccessed: (feature) => trackEvent(ANALYTICS_EVENTS.FEATURE_ACCESSED, { feature }),

  // Error events
  error: (error, context) => trackEvent(ANALYTICS_EVENTS.ERROR_OCCURRED, {
    error: error.message,
    stack: error.stack,
    context
  }),
  featureFailed: (feature, error) => trackEvent(ANALYTICS_EVENTS.FEATURE_FAILED, {
    feature,
    error: error.message
  })
};
