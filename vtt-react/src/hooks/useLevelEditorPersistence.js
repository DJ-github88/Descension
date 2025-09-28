/**
 * Hook for managing level editor persistence per room
 * Automatically saves and loads level editor state when room changes
 */

import { useEffect, useCallback, useRef } from 'react';
import levelEditorPersistenceService from '../services/levelEditorPersistenceService';
import useLevelEditorStore from '../store/levelEditorStore';
import { useRoomContext } from '../contexts/RoomContext';

export const useLevelEditorPersistence = () => {
  const { currentRoomId, isInRoom } = useRoomContext();
  
  // Get level editor state and actions
  const levelEditorState = useLevelEditorStore();
  const { loadMapState } = useLevelEditorStore();
  
  // Auto-save timer ref
  const autoSaveTimerRef = useRef(null);
  const lastSaveTimeRef = useRef(0);
  const isLoadingRef = useRef(false);

  /**
   * Collect current level editor state for saving
   */
  const collectLevelEditorState = useCallback(() => {
    return {
      // Terrain and environment
      terrainData: levelEditorState.terrainData,
      environmentalObjects: levelEditorState.environmentalObjects,
      
      // Walls and structures
      wallData: levelEditorState.wallData,
      
      // D&D elements
      dndElements: levelEditorState.dndElements,
      
      // Fog of war
      fogOfWarData: levelEditorState.fogOfWarData,
      
      // Drawing system
      drawingPaths: levelEditorState.drawingPaths,
      drawingLayers: levelEditorState.drawingLayers,
      
      // Lighting system
      lightSources: levelEditorState.lightSources,
      
      // Grid and view settings
      gridSize: levelEditorState.gridSize,
      gridOffsetX: levelEditorState.gridOffsetX,
      gridOffsetY: levelEditorState.gridOffsetY,
      gridColor: levelEditorState.gridColor,
      gridThickness: levelEditorState.gridThickness,
      showGridLines: levelEditorState.showGridLines,
      
      // Layer visibility settings
      showTerrainLayer: levelEditorState.showTerrainLayer,
      showObjectLayer: levelEditorState.showObjectLayer,
      showWallLayer: levelEditorState.showWallLayer,
      showDndLayer: levelEditorState.showDndLayer,
      
      // Tool settings
      selectedTool: levelEditorState.selectedTool,
      brushSize: levelEditorState.brushSize,
      activeLayer: levelEditorState.activeLayer
    };
  }, [levelEditorState]);

  /**
   * Save current level editor state to room
   */
  const saveLevelEditorState = useCallback(async () => {
    if (!isInRoom || !currentRoomId || currentRoomId === 'global') {
      return false;
    }

    try {
      const stateData = collectLevelEditorState();
      const success = levelEditorPersistenceService.saveLevelEditorState(currentRoomId, stateData);
      
      if (success) {
        lastSaveTimeRef.current = Date.now();
        console.log(`💾 Level editor state saved for room ${currentRoomId}`);
      }
      
      return success;
    } catch (error) {
      console.error('Error saving level editor state:', error);
      return false;
    }
  }, [currentRoomId, isInRoom, collectLevelEditorState]);

  /**
   * Load level editor state for current room
   */
  const loadLevelEditorState = useCallback(async () => {
    if (!isInRoom || !currentRoomId || currentRoomId === 'global') {
      console.log('📋 Not in a specific room, skipping level editor state load');
      return false;
    }

    if (isLoadingRef.current) {
      console.log('📋 Already loading level editor state, skipping');
      return false;
    }

    isLoadingRef.current = true;

    try {
      const savedState = levelEditorPersistenceService.loadLevelEditorState(currentRoomId);
      
      if (savedState) {
        // Apply the loaded state to the level editor store
        loadMapState(savedState);
        console.log(`📋 Level editor state loaded for room ${currentRoomId}`);
        return true;
      } else {
        console.log(`📋 No saved level editor state found for room ${currentRoomId}`);
        return false;
      }
    } catch (error) {
      console.error('Error loading level editor state:', error);
      return false;
    } finally {
      isLoadingRef.current = false;
    }
  }, [currentRoomId, isInRoom, loadMapState]);

  /**
   * Schedule auto-save with debouncing
   */
  const scheduleAutoSave = useCallback(() => {
    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Don't auto-save too frequently
    const timeSinceLastSave = Date.now() - lastSaveTimeRef.current;
    if (timeSinceLastSave < 5000) { // Minimum 5 seconds between saves
      return;
    }

    // Schedule save after 3 seconds of inactivity
    autoSaveTimerRef.current = setTimeout(() => {
      saveLevelEditorState();
    }, 3000);
  }, [saveLevelEditorState]);

  /**
   * Force save current state
   */
  const forceSave = useCallback(() => {
    // Clear auto-save timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
    
    return saveLevelEditorState();
  }, [saveLevelEditorState]);

  /**
   * Copy level editor state from another room
   */
  const copyFromRoom = useCallback(async (sourceRoomId) => {
    if (!isInRoom || !currentRoomId || currentRoomId === 'global') {
      console.warn('Cannot copy level editor state: not in a specific room');
      return false;
    }

    try {
      const success = levelEditorPersistenceService.copyLevelEditorState(sourceRoomId, currentRoomId);
      
      if (success) {
        // Reload the state after copying
        await loadLevelEditorState();
        console.log(`📋 Level editor state copied from room ${sourceRoomId} to ${currentRoomId}`);
      }
      
      return success;
    } catch (error) {
      console.error('Error copying level editor state:', error);
      return false;
    }
  }, [currentRoomId, isInRoom, loadLevelEditorState]);

  /**
   * Clear level editor state for current room
   */
  const clearRoomState = useCallback(() => {
    if (!isInRoom || !currentRoomId || currentRoomId === 'global') {
      return false;
    }

    return levelEditorPersistenceService.deleteLevelEditorState(currentRoomId);
  }, [currentRoomId, isInRoom]);

  // Load state when room changes
  useEffect(() => {
    if (isInRoom && currentRoomId && currentRoomId !== 'global') {
      loadLevelEditorState();
    }
  }, [currentRoomId, isInRoom, loadLevelEditorState]);

  // Auto-save when level editor state changes
  useEffect(() => {
    if (isInRoom && currentRoomId && currentRoomId !== 'global') {
      scheduleAutoSave();
    }
  }, [
    // Monitor key level editor state changes
    levelEditorState.terrainData,
    levelEditorState.wallData,
    levelEditorState.environmentalObjects,
    levelEditorState.dndElements,
    levelEditorState.fogOfWarData,
    levelEditorState.drawingPaths,
    levelEditorState.lightSources,
    isInRoom,
    currentRoomId,
    scheduleAutoSave
  ]);

  // Save state when component unmounts or room changes
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      // Force save on unmount if in a room
      if (isInRoom && currentRoomId && currentRoomId !== 'global') {
        levelEditorPersistenceService.saveLevelEditorState(currentRoomId, collectLevelEditorState());
      }
    };
  }, [currentRoomId, isInRoom, collectLevelEditorState]);

  return {
    // Actions
    saveLevelEditorState: forceSave,
    loadLevelEditorState,
    copyFromRoom,
    clearRoomState,
    
    // State
    currentRoomId,
    isInRoom,
    hasUnsavedChanges: autoSaveTimerRef.current !== null,
    
    // Utility
    scheduleAutoSave
  };
};
