/**
 * Hook for managing action bar persistence
 * Automatically saves and loads action bar configurations per character per room
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import actionBarPersistenceService from '../services/actionBarPersistenceService';
import useCharacterStore from '../store/characterStore';

export const useActionBarPersistence = (roomId = 'global') => {
  const [actionSlots, setActionSlots] = useState(Array(10).fill(null));
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaveTime, setLastSaveTime] = useState(null);

  // Stable reference for empty slots to prevent re-renders
  const EMPTY_SLOTS = useRef(Array(10).fill(null)).current;

  // Get current character ID from character store
  const currentCharacterId = useCharacterStore(state => state.currentCharacterId);
  const characterName = useCharacterStore(state => state.name);

  // Auto-save timer ref
  const autoSaveTimerRef = useRef(null);
  const lastActionSlotsRef = useRef(null);

  /**
   * Load action bar configuration for current character and room
   */
  const loadActionBarConfig = useCallback(async () => {
    if (!currentCharacterId) {
      if (JSON.stringify(actionSlots) !== JSON.stringify(EMPTY_SLOTS)) {
        setActionSlots(EMPTY_SLOTS);
      }
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const savedConfig = actionBarPersistenceService.loadActionBarConfig(currentCharacterId, roomId);

      if (savedConfig && Array.isArray(savedConfig)) {
        // Ensure the config has exactly 10 slots
        const normalizedConfig = Array(10).fill(null);
        savedConfig.forEach((slot, index) => {
          if (index < 10) {
            normalizedConfig[index] = slot;
          }
        });

        if (JSON.stringify(actionSlots) !== JSON.stringify(normalizedConfig)) {
          setActionSlots(normalizedConfig);
        }
      } else {
        // No saved config found, use empty slots
        if (JSON.stringify(actionSlots) !== JSON.stringify(EMPTY_SLOTS)) {
          setActionSlots(EMPTY_SLOTS);
        }
      }
    } catch (error) {
      console.error('Error loading action bar config:', error);
      setActionSlots(Array(10).fill(null));
    } finally {
      setIsLoading(false);
    }
  }, [currentCharacterId, roomId, characterName]);

  /**
   * Save action bar configuration
   */
  const saveActionBarConfig = useCallback(async (slotsToSave = null) => {
    if (!currentCharacterId) {
      console.warn('Cannot save action bar: no character selected');
      return false;
    }

    const slots = slotsToSave || actionSlots;

    try {
      const success = actionBarPersistenceService.saveActionBarConfig(currentCharacterId, roomId, slots);

      if (success) {
        setLastSaveTime(new Date());
      }

      return success;
    } catch (error) {
      console.error('Error saving action bar config:', error);
      return false;
    }
  }, [currentCharacterId, roomId, actionSlots, characterName]);

  /**
   * Update action slots with automatic persistence
   */
  const updateActionSlots = useCallback((newSlots) => {
    setActionSlots(newSlots);

    // Clear existing auto-save timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Set new auto-save timer (debounced save after 2 seconds)
    autoSaveTimerRef.current = setTimeout(() => {
      saveActionBarConfig(newSlots);
    }, 2000);
  }, [saveActionBarConfig]);

  /**
   * Update a specific slot
   */
  const updateSlot = useCallback((slotIndex, item) => {
    if (slotIndex < 0 || slotIndex >= 10) {
      console.warn('Invalid slot index:', slotIndex);
      return;
    }

    const newSlots = [...actionSlots];
    newSlots[slotIndex] = item;
    updateActionSlots(newSlots);
  }, [actionSlots, updateActionSlots]);

  /**
   * Clear a specific slot
   */
  const clearSlot = useCallback((slotIndex) => {
    updateSlot(slotIndex, null);
  }, [updateSlot]);

  /**
   * Clear all slots
   */
  const clearAllSlots = useCallback(() => {
    updateActionSlots(EMPTY_SLOTS);
  }, [updateActionSlots, EMPTY_SLOTS]);

  /**
   * Copy configuration from another room
   */
  const copyFromRoom = useCallback(async (sourceRoomId) => {
    if (!currentCharacterId) {
      console.warn('Cannot copy action bar: no character selected');
      return false;
    }

    try {
      const success = actionBarPersistenceService.copyActionBarConfig(
        currentCharacterId,
        sourceRoomId,
        roomId
      );

      if (success) {
        // Reload the configuration
        await loadActionBarConfig();
      }

      return success;
    } catch (error) {
      console.error('Error copying action bar config:', error);
      return false;
    }
  }, [currentCharacterId, roomId, loadActionBarConfig]);

  /**
   * Force save current configuration
   */
  const forceSave = useCallback(() => {
    // Clear auto-save timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }

    return saveActionBarConfig();
  }, [saveActionBarConfig]);

  // Load configuration when character or room changes
  useEffect(() => {
    loadActionBarConfig();
  }, [loadActionBarConfig]);

  // Save configuration when component unmounts or character changes
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Force save on unmount if there are unsaved changes
      if (currentCharacterId && lastActionSlotsRef.current !== actionSlots) {
        actionBarPersistenceService.saveActionBarConfig(currentCharacterId, roomId, actionSlots);
      }
    };
  }, [currentCharacterId, roomId, actionSlots]);

  // Track changes for unsaved detection
  useEffect(() => {
    lastActionSlotsRef.current = actionSlots;
  }, [actionSlots]);

  return {
    // State
    actionSlots,
    isLoading,
    lastSaveTime,

    // Actions
    updateActionSlots,
    updateSlot,
    clearSlot,
    clearAllSlots,

    // Persistence actions
    saveActionBarConfig: forceSave,
    loadActionBarConfig,
    copyFromRoom,

    // Utility
    hasUnsavedChanges: autoSaveTimerRef.current !== null
  };
};
