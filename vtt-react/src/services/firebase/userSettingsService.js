/**
 * User Settings Service
 *
 * Manages user preferences and settings persistence to Firebase.
 * Handles window scale, grid settings, audio/video preferences, UI layout, etc.
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured, isDemoMode } from '../../config/firebase';

// Collection names
const COLLECTIONS = {
  USER_SETTINGS: 'userSettings',
  USERS: 'users'
};

/**
 * Check if Firebase is available
 */
function checkFirebaseAvailable() {
  if (!isFirebaseConfigured || isDemoMode || !db) {
    console.warn('Firebase not configured or in demo mode');
    return false;
  }
  return true;
}

/**
 * Default user settings
 */
export const DEFAULT_USER_SETTINGS = {
  // Window & UI Settings
  windowScale: 1.0,
  uiTheme: 'fantasy', // 'fantasy', 'modern', 'dark'
  showAnimations: true,
  showTooltips: true,

  // Grid & Movement Settings
  feetPerTile: 5,
  showMovementVisualization: true,
  movementLineColor: '#FFD700',
  movementLineWidth: 3,
  showGridCoordinates: false,

  // Cursor & Interaction Settings
  showCursorTracking: true,
  cursorPingEnabled: true,
  cursorPingColor: '#FF6B6B',

  // GM-Specific Settings
  defaultViewFromToken: false,
  showGMArea: true,
  gmOverlayOpacity: 0.8,

  // Audio Settings
  masterVolume: 0.8,
  soundEffectsVolume: 0.7,
  musicVolume: 0.6,
  ambientVolume: 0.5,
  voiceVolume: 1.0,
  muteAllSounds: false,

  // Video/Visual Settings
  particleEffects: true,
  shadowQuality: 'medium', // 'low', 'medium', 'high'
  antiAliasing: true,
  vsync: true,
  maxFPS: 60,

  // Chat Settings
  chatFontSize: 'medium', // 'small', 'medium', 'large'
  chatTimestamps: true,
  chatMessageHistory: 100,
  chatSoundNotifications: true,

  // Combat Settings
  autoRollInitiative: false,
  showDiceRollAnimations: true,
  combatLogSize: 50,
  showTurnIndicators: true,

  // Accessibility Settings
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  screenReader: false,

  // Performance Settings
  renderDistance: 1000,
  textureQuality: 'high',
  effectsQuality: 'medium',

  // Privacy Settings
  showOnlineStatus: true,
  allowDirectMessages: true,
  shareGameStats: false,

  // Metadata
  version: 1,
  lastUpdated: new Date().toISOString()
};

/**
 * Save user settings to Firebase
 */
export async function saveUserSettings(userId, settingsData) {
  try {
    if (!checkFirebaseAvailable()) {
      console.warn('Firebase not available, settings will be local only');
      return { success: false, localOnly: true };
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Merge with defaults to ensure all settings are present
    const settingsToSave = {
      ...DEFAULT_USER_SETTINGS,
      ...settingsData,
      userId,
      lastUpdated: serverTimestamp(),
      version: 1
    };

    const settingsRef = doc(db, COLLECTIONS.USER_SETTINGS, userId);
    await setDoc(settingsRef, settingsToSave, { merge: true });

    // Update user's settings reference
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await updateDoc(userRef, {
        settingsLastUpdated: serverTimestamp(),
        hasSettings: true
      });
    } else {
      // Create user document if it doesn't exist
      await setDoc(userRef, {
        settingsLastUpdated: serverTimestamp(),
        hasSettings: true,
        createdAt: serverTimestamp()
      });
    }

    console.log(`✅ User settings saved for ${userId}`);
    return { success: true, localOnly: false };

  } catch (error) {
    console.error('Error saving user settings:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Load user settings from Firebase
 */
export async function loadUserSettings(userId) {
  try {
    if (!checkFirebaseAvailable()) {
      console.log('Firebase not available, using default settings');
      return { ...DEFAULT_USER_SETTINGS };
    }

    if (!userId) {
      console.log('No user ID provided, using default settings');
      return { ...DEFAULT_USER_SETTINGS };
    }

    const settingsRef = doc(db, COLLECTIONS.USER_SETTINGS, userId);
    const settingsDoc = await getDoc(settingsRef);

    if (settingsDoc.exists()) {
      const settingsData = settingsDoc.data();
      console.log(`📂 User settings loaded for ${userId}`);

      // Merge with defaults to ensure all settings are present
      return {
        ...DEFAULT_USER_SETTINGS,
        ...settingsData
      };
    } else {
      console.log(`📂 No saved settings found for ${userId}, using defaults`);
      return { ...DEFAULT_USER_SETTINGS };
    }

  } catch (error) {
    console.error('Error loading user settings:', error);
    return { ...DEFAULT_USER_SETTINGS };
  }
}

/**
 * Update specific user settings (partial update)
 */
export async function updateUserSettings(userId, updates) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    const settingsRef = doc(db, COLLECTIONS.USER_SETTINGS, userId);
    await updateDoc(settingsRef, {
      ...updates,
      lastUpdated: serverTimestamp()
    });

    console.log(`🔄 User settings updated for ${userId}`);
    return { success: true, localOnly: false };

  } catch (error) {
    console.error('Error updating user settings:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Reset user settings to defaults
 */
export async function resetUserSettings(userId) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    const defaultSettings = {
      ...DEFAULT_USER_SETTINGS,
      userId,
      lastUpdated: serverTimestamp()
    };

    const settingsRef = doc(db, COLLECTIONS.USER_SETTINGS, userId);
    await setDoc(settingsRef, defaultSettings);

    console.log(`🔄 User settings reset to defaults for ${userId}`);
    return { success: true, localOnly: false };

  } catch (error) {
    console.error('Error resetting user settings:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Export user settings for backup/sharing
 */
export async function exportUserSettings(userId) {
  try {
    const settings = await loadUserSettings(userId);
    // Remove Firebase-specific metadata
    const { userId: _, lastUpdated, ...exportableSettings } = settings;
    return exportableSettings;
  } catch (error) {
    console.error('Error exporting user settings:', error);
    return null;
  }
}

/**
 * Import user settings from backup
 */
export async function importUserSettings(userId, settingsData) {
  try {
    // Validate settings data
    const validatedSettings = {};
    Object.keys(DEFAULT_USER_SETTINGS).forEach(key => {
      if (settingsData.hasOwnProperty(key)) {
        validatedSettings[key] = settingsData[key];
      }
    });

    return await saveUserSettings(userId, validatedSettings);
  } catch (error) {
    console.error('Error importing user settings:', error);
    return { success: false, error: error.message };
  }
}
