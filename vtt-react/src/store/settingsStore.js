/**
 * Settings Store
 *
 * Manages user preferences and settings with persistence.
 * Integrates with Firebase for authenticated users.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DEFAULT_USER_SETTINGS, saveUserSettings, loadUserSettings, updateUserSettings } from '../services/firebase/userSettingsService';
import useAuthStore from './authStore';

// Default settings (fallback for when Firebase is unavailable)
const initialState = DEFAULT_USER_SETTINGS;

// Custom storage engine that syncs with Firebase for authenticated users
// Note: We use a different approach since we can't access stores synchronously in storage engine
const createFirebaseStorage = () => ({
  getItem: async (name) => {
    try {
      // Try to get current user from localStorage first (set by auth system)
      const authData = localStorage.getItem('auth-storage');
      let user = null;

      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          user = parsed.state?.user;
        } catch (e) {
          // Ignore parsing errors
        }
      }

      if (user && !user.isGuest) {
        const settings = await loadUserSettings(user.uid);
        return {
          state: settings,
          version: 1
        };
      } else {
        // For guests, use localStorage
        const item = localStorage.getItem(name);
        return item ? JSON.parse(item) : null;
      }
    } catch (error) {
      console.error('Error loading settings from Firebase:', error);
      // Fallback to localStorage
      return localStorage.getItem(name);
    }
  },

  setItem: async (name, data) => {
    try {
      // Try to get current user from localStorage first (set by auth system)
      const authData = localStorage.getItem('auth-storage');
      let user = null;

      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          user = parsed.state?.user;
        } catch (e) {
          // Ignore parsing errors
        }
      }

      if (user && !user.isGuest) {
        // Save to Firebase for authenticated users
        await saveUserSettings(user.uid, data.state);
      } else {
        // Save to localStorage for guests
        // data is already an object when using createJSONStorage, but we need to stringify it for localStorage
        localStorage.setItem(name, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error saving settings to Firebase:', error);
      // Fallback to localStorage
      localStorage.setItem(name, JSON.stringify(data));
    }
  },

  removeItem: async (name) => {
    try {
      // For Firebase, we don't actually delete settings, just leave them as defaults
      console.log('Settings removed from local cache, Firebase retains defaults');
      localStorage.removeItem(name);
    } catch (error) {
      console.error('Error removing settings:', error);
      localStorage.removeItem(name);
    }
  }
});

const useSettingsStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Actions for updating settings (persist middleware handles Firebase sync)
      updateSettings: (updates) => {
        set(updates);
      },

      // Bulk update multiple settings
      updateMultipleSettings: (settingsObject) => {
        set(settingsObject);
      },

      // Reset all settings to defaults
      resetSettings: () => {
        set({ ...DEFAULT_USER_SETTINGS });
        // Trigger Firebase sync for authenticated users
        const { user } = window.authStore?.getState() || {};
        if (user && !user.isGuest) {
          saveUserSettings(user.uid, DEFAULT_USER_SETTINGS).catch(error => {
            console.error('Failed to reset settings in Firebase:', error);
          });
        }
      },

      // Window & UI Settings
      setWindowScale: (scale) => {
        const clampedScale = Math.max(0.5, Math.min(2.0, scale));
        get().updateSettings({ windowScale: clampedScale });
      },

      setUITheme: (theme) => {
        get().updateSettings({ uiTheme: theme });
      },

      setShowAnimations: (enabled) => {
        get().updateSettings({ showAnimations: enabled });
      },

      setShowTooltips: (enabled) => {
        get().updateSettings({ showTooltips: enabled });
      },

      // Grid & Movement Settings
      setFeetPerTile: (feet) => {
        const clampedFeet = Math.max(1, Math.min(20, feet));
        get().updateSettings({ feetPerTile: clampedFeet });
      },

      setShowMovementVisualization: (enabled) => {
        get().updateSettings({ showMovementVisualization: enabled });
      },

      setMovementLineColor: (color) => {
        get().updateSettings({ movementLineColor: color });
      },

      setMovementLineWidth: (width) => {
        const clampedWidth = Math.max(1, Math.min(10, width));
        get().updateSettings({ movementLineWidth: clampedWidth });
      },

      setShowGridCoordinates: (enabled) => {
        get().updateSettings({ showGridCoordinates: enabled });
      },

      // Cursor & Interaction Settings
      setShowCursorTracking: (enabled) => {
        get().updateSettings({ showCursorTracking: enabled });
      },

      setCursorPingEnabled: (enabled) => {
        get().updateSettings({ cursorPingEnabled: enabled });
      },

      setCursorPingColor: (color) => {
        get().updateSettings({ cursorPingColor: color });
      },

      // GM-Specific Settings
      setDefaultViewFromToken: (enabled) => {
        get().updateSettings({ defaultViewFromToken: enabled });
      },

      setShowGMArea: (enabled) => {
        get().updateSettings({ showGMArea: enabled });
      },

      setGMOverlayOpacity: (opacity) => {
        const clampedOpacity = Math.max(0.1, Math.min(1.0, opacity));
        get().updateSettings({ gmOverlayOpacity: clampedOpacity });
      },

      // Audio Settings
      setMasterVolume: (volume) => {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        get().updateSettings({ masterVolume: clampedVolume });
      },

      setSoundEffectsVolume: (volume) => {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        get().updateSettings({ soundEffectsVolume: clampedVolume });
      },

      setMusicVolume: (volume) => {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        get().updateSettings({ musicVolume: clampedVolume });
      },

      setAmbientVolume: (volume) => {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        get().updateSettings({ ambientVolume: clampedVolume });
      },

      setVoiceVolume: (volume) => {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        get().updateSettings({ voiceVolume: clampedVolume });
      },

      setMuteAllSounds: (muted) => {
        get().updateSettings({ muteAllSounds: muted });
      },

      // Video/Visual Settings
      setParticleEffects: (enabled) => {
        get().updateSettings({ particleEffects: enabled });
      },

      setShadowQuality: (quality) => {
        get().updateSettings({ shadowQuality: quality });
      },

      setAntiAliasing: (enabled) => {
        get().updateSettings({ antiAliasing: enabled });
      },

      setVsync: (enabled) => {
        get().updateSettings({ vsync: enabled });
      },

      setMaxFPS: (fps) => {
        const clampedFPS = Math.max(30, Math.min(144, fps));
        get().updateSettings({ maxFPS: clampedFPS });
      },

      // Chat Settings
      setChatFontSize: (size) => {
        get().updateSettings({ chatFontSize: size });
      },

      setChatTimestamps: (enabled) => {
        get().updateSettings({ chatTimestamps: enabled });
      },

      setChatMessageHistory: (count) => {
        const clampedCount = Math.max(10, Math.min(1000, count));
        get().updateSettings({ chatMessageHistory: clampedCount });
      },

      setChatSoundNotifications: (enabled) => {
        get().updateSettings({ chatSoundNotifications: enabled });
      },

      // Combat Settings
      setAutoRollInitiative: (enabled) => {
        get().updateSettings({ autoRollInitiative: enabled });
      },

      setShowDiceRollAnimations: (enabled) => {
        get().updateSettings({ showDiceRollAnimations: enabled });
      },

      setCombatLogSize: (size) => {
        const clampedSize = Math.max(10, Math.min(500, size));
        get().updateSettings({ combatLogSize: clampedSize });
      },

      setShowTurnIndicators: (enabled) => {
        get().updateSettings({ showTurnIndicators: enabled });
      },

      // Accessibility Settings
      setHighContrast: (enabled) => {
        get().updateSettings({ highContrast: enabled });
      },

      setReducedMotion: (enabled) => {
        get().updateSettings({ reducedMotion: enabled });
      },

      setLargeText: (enabled) => {
        get().updateSettings({ largeText: enabled });
      },

      setScreenReader: (enabled) => {
        get().updateSettings({ screenReader: enabled });
      },

      // Performance Settings
      setRenderDistance: (distance) => {
        const clampedDistance = Math.max(500, Math.min(5000, distance));
        get().updateSettings({ renderDistance: clampedDistance });
      },

      setTextureQuality: (quality) => {
        get().updateSettings({ textureQuality: quality });
      },

      setEffectsQuality: (quality) => {
        get().updateSettings({ effectsQuality: quality });
      },

      // Privacy Settings
      setShowOnlineStatus: (enabled) => {
        get().updateSettings({ showOnlineStatus: enabled });
      },

      setAllowDirectMessages: (enabled) => {
        get().updateSettings({ allowDirectMessages: enabled });
      },

      setShareGameStats: (enabled) => {
        get().updateSettings({ shareGameStats: enabled });
      }
    }),
    {
      name: 'user-settings',
      storage: createJSONStorage(() => createFirebaseStorage()),
      // Only persist certain settings to avoid bloat
      partialize: (state) => ({
        // Window & UI
        windowScale: state.windowScale,
        uiTheme: state.uiTheme,
        showAnimations: state.showAnimations,
        showTooltips: state.showTooltips,

        // Grid & Movement
        feetPerTile: state.feetPerTile,
        showMovementVisualization: state.showMovementVisualization,
        movementLineColor: state.movementLineColor,
        movementLineWidth: state.movementLineWidth,
        showGridCoordinates: state.showGridCoordinates,

        // Cursor & Interaction
        showCursorTracking: state.showCursorTracking,
        cursorPingEnabled: state.cursorPingEnabled,
        cursorPingColor: state.cursorPingColor,

        // GM Settings
        defaultViewFromToken: state.defaultViewFromToken,
        showGMArea: state.showGMArea,
        gmOverlayOpacity: state.gmOverlayOpacity,

        // Audio
        masterVolume: state.masterVolume,
        soundEffectsVolume: state.soundEffectsVolume,
        musicVolume: state.musicVolume,
        ambientVolume: state.ambientVolume,
        voiceVolume: state.voiceVolume,
        muteAllSounds: state.muteAllSounds,

        // Video/Visual
        particleEffects: state.particleEffects,
        shadowQuality: state.shadowQuality,
        antiAliasing: state.antiAliasing,
        vsync: state.vsync,
        maxFPS: state.maxFPS,

        // Chat
        chatFontSize: state.chatFontSize,
        chatTimestamps: state.chatTimestamps,
        chatMessageHistory: state.chatMessageHistory,
        chatSoundNotifications: state.chatSoundNotifications,

        // Combat
        autoRollInitiative: state.autoRollInitiative,
        showDiceRollAnimations: state.showDiceRollAnimations,
        combatLogSize: state.combatLogSize,
        showTurnIndicators: state.showTurnIndicators,

        // Accessibility
        highContrast: state.highContrast,
        reducedMotion: state.reducedMotion,
        largeText: state.largeText,
        screenReader: state.screenReader,

        // Performance
        renderDistance: state.renderDistance,
        textureQuality: state.textureQuality,
        effectsQuality: state.effectsQuality,

        // Privacy
        showOnlineStatus: state.showOnlineStatus,
        allowDirectMessages: state.allowDirectMessages,
        shareGameStats: state.shareGameStats
      })
    }
  )
);

// Export the store hook
export default useSettingsStore;

// Export settings categories for UI organization
export const SETTINGS_CATEGORIES = {
  WINDOW_UI: 'Window & UI',
  GRID_MOVEMENT: 'Grid & Movement',
  CURSOR_INTERACTION: 'Cursor & Interaction',
  GM_SETTINGS: 'GM Settings',
  AUDIO: 'Audio',
  VIDEO_VISUAL: 'Video & Visual',
  CHAT: 'Chat',
  COMBAT: 'Combat',
  ACCESSIBILITY: 'Accessibility',
  PERFORMANCE: 'Performance',
  PRIVACY: 'Privacy'
};

// Helper to get settings by category
export const getSettingsByCategory = (category) => {
  const state = useSettingsStore.getState();

  switch (category) {
    case SETTINGS_CATEGORIES.WINDOW_UI:
      return {
        windowScale: state.windowScale,
        uiTheme: state.uiTheme,
        showAnimations: state.showAnimations,
        showTooltips: state.showTooltips
      };

    case SETTINGS_CATEGORIES.GRID_MOVEMENT:
      return {
        feetPerTile: state.feetPerTile,
        showMovementVisualization: state.showMovementVisualization,
        movementLineColor: state.movementLineColor,
        movementLineWidth: state.movementLineWidth,
        showGridCoordinates: state.showGridCoordinates
      };

    case SETTINGS_CATEGORIES.CURSOR_INTERACTION:
      return {
        showCursorTracking: state.showCursorTracking,
        cursorPingEnabled: state.cursorPingEnabled,
        cursorPingColor: state.cursorPingColor
      };

    case SETTINGS_CATEGORIES.GM_SETTINGS:
      return {
        defaultViewFromToken: state.defaultViewFromToken,
        showGMArea: state.showGMArea,
        gmOverlayOpacity: state.gmOverlayOpacity
      };

    case SETTINGS_CATEGORIES.AUDIO:
      return {
        masterVolume: state.masterVolume,
        soundEffectsVolume: state.soundEffectsVolume,
        musicVolume: state.musicVolume,
        ambientVolume: state.ambientVolume,
        voiceVolume: state.voiceVolume,
        muteAllSounds: state.muteAllSounds
      };

    case SETTINGS_CATEGORIES.VIDEO_VISUAL:
      return {
        particleEffects: state.particleEffects,
        shadowQuality: state.shadowQuality,
        antiAliasing: state.antiAliasing,
        vsync: state.vsync,
        maxFPS: state.maxFPS
      };

    case SETTINGS_CATEGORIES.CHAT:
      return {
        chatFontSize: state.chatFontSize,
        chatTimestamps: state.chatTimestamps,
        chatMessageHistory: state.chatMessageHistory,
        chatSoundNotifications: state.chatSoundNotifications
      };

    case SETTINGS_CATEGORIES.COMBAT:
      return {
        autoRollInitiative: state.autoRollInitiative,
        showDiceRollAnimations: state.showDiceRollAnimations,
        combatLogSize: state.combatLogSize,
        showTurnIndicators: state.showTurnIndicators
      };

    case SETTINGS_CATEGORIES.ACCESSIBILITY:
      return {
        highContrast: state.highContrast,
        reducedMotion: state.reducedMotion,
        largeText: state.largeText,
        screenReader: state.screenReader
      };

    case SETTINGS_CATEGORIES.PERFORMANCE:
      return {
        renderDistance: state.renderDistance,
        textureQuality: state.textureQuality,
        effectsQuality: state.effectsQuality
      };

    case SETTINGS_CATEGORIES.PRIVACY:
      return {
        showOnlineStatus: state.showOnlineStatus,
        allowDirectMessages: state.allowDirectMessages,
        shareGameStats: state.shareGameStats
      };

    default:
      return {};
  }
};
