/**
 * Hook for managing level editor persistence per room
 * Automatically saves and loads level editor state when room changes
 */

import { useEffect, useCallback, useRef } from 'react';
import levelEditorPersistenceService from '../services/levelEditorPersistenceService';
import useLevelEditorStore from '../store/levelEditorStore';
import useGameStore from '../store/gameStore';
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
  
  // CRITICAL FIX: Track last state to prevent unnecessary auto-saves during scrolling/dragging
  const lastStateRef = useRef(null);

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
      exploredAreas: levelEditorState.exploredAreas,
      
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
      return false;
    }

    // CRITICAL FIX: Skip loading from persistence service for local rooms
    // Local rooms load state from localStorage via applyLocalGameState in App.jsx
    // Loading from persistence service cache would overwrite the correctly loaded terrain data
    const isLocalRoom = typeof window !== 'undefined' && localStorage.getItem('isLocalRoom') === 'true';
    if (isLocalRoom) {
      console.log('📋 Skipping persistence service load for local room - state already loaded from localStorage');
      return false;
    }

    if (isLoadingRef.current) {
      return false;
    }

    isLoadingRef.current = true;

    try {
      const savedState = levelEditorPersistenceService.loadLevelEditorState(currentRoomId);
      
      if (savedState) {
        // Apply the loaded state to the level editor store
        loadMapState(savedState);
        return true;
      } else {
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

    // Don't auto-save too frequently - increased to 15 seconds minimum
    const timeSinceLastSave = Date.now() - lastSaveTimeRef.current;
    if (timeSinceLastSave < 15000) { // Minimum 15 seconds between saves
      return;
    }

    // Schedule save after 10 seconds of inactivity (increased from 3)
    autoSaveTimerRef.current = setTimeout(() => {
      saveLevelEditorState();
    }, 10000);
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

  // CRITICAL FIX: Auto-save when level editor state changes, but with aggressive throttling
  // Only monitor actual content changes, not UI state changes that occur during scrolling/dragging
  // IMPORTANT: This is for LOCAL room persistence only. Multiplayer sync is handled separately via socket.emit
  useEffect(() => {
    if (!isInRoom || !currentRoomId || currentRoomId === 'global') {
      return;
    }

    // CRITICAL FIX: Skip if we're receiving a map update from multiplayer (prevents echo loops)
    if (window._isReceivingMapUpdate) {
      return;
    }

    // CRITICAL FIX: Skip if we're actively scrolling/dragging to prevent lag
    // Check if camera is being dragged or if we're scrolling
    const gameStore = useGameStore.getState();
    const isDraggingCamera = gameStore.isDraggingCamera || false;
    const isScrolling = window._isScrolling || false;
    
    if (isDraggingCamera || isScrolling) {
      // Skip persistence during active scrolling/dragging
      return;
    }

    // CRITICAL FIX: Only trigger auto-save if actual content changed
    // Skip if this is just a re-render from camera/zoom changes
    const currentState = {
      terrainData: levelEditorState.terrainData,
      wallData: levelEditorState.wallData,
      environmentalObjects: levelEditorState.environmentalObjects,
      dndElements: levelEditorState.dndElements,
      fogOfWarData: levelEditorState.fogOfWarData,
      fogOfWarPaths: levelEditorState.fogOfWarPaths || [], // CRITICAL FIX: Track fog paths changes
      fogErasePaths: levelEditorState.fogErasePaths || [], // CRITICAL FIX: Track erase paths changes
      exploredAreas: levelEditorState.exploredAreas,
      drawingPaths: levelEditorState.drawingPaths,
      lightSources: levelEditorState.lightSources
    };

    // Compare with previous state
    if (lastStateRef.current) {
      const stateChanged = JSON.stringify(lastStateRef.current) !== JSON.stringify(currentState);
      if (!stateChanged) {
        // State hasn't actually changed, skip auto-save
        return;
      }
    }

    // Update last state
    lastStateRef.current = currentState;

    // CRITICAL FIX: Skip persistence service for local rooms
    // Local rooms use useLocalRoomAutoSave hook which saves directly to localStorage
    // The persistence service is only for in-memory caching and should not interfere with local rooms
    const isLocalRoom = typeof window !== 'undefined' && localStorage.getItem('isLocalRoom') === 'true';
    if (isLocalRoom) {
      // Skip persistence service for local rooms - they have their own auto-save mechanism
      return;
    }

    // Schedule auto-save with debouncing (only for non-local rooms that use persistence service)
    scheduleAutoSave();
  }, [
    // Monitor key level editor state changes
    levelEditorState.terrainData,
    levelEditorState.wallData,
    levelEditorState.environmentalObjects,
    levelEditorState.dndElements,
    levelEditorState.fogOfWarData,
    levelEditorState.exploredAreas,
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
