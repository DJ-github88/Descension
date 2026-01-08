import { useEffect, useRef } from 'react';
import localRoomService from '../services/localRoomService';
import useGameStore from '../store/gameStore';
import useCreatureStore from '../store/creatureStore';
import useGridItemStore from '../store/gridItemStore';
import useLevelEditorStore from '../store/levelEditorStore';

/**
 * Hook to automatically save local room state when game state changes
 * Only active when in a local room
 */
const useLocalRoomAutoSave = () => {
  const saveTimeoutRef = useRef(null);
  const lastSaveRef = useRef(0);
  const isLoadingRef = useRef(false);

  // Manual save function that can be called externally
  const forceSave = () => {
    if (isInLocalRoom() && !isLoadingRef.current) {
      localRoomService.autoSaveCurrentRoom();
      lastSaveRef.current = Date.now();
    }
  };

  // Function to set loading state (prevents auto-save during loading)
  const setLoading = (loading) => {
    isLoadingRef.current = loading;
    if (loading) {
    } else {
    }
  };
  
  // Debounced save function to prevent excessive saves
  const debouncedSave = () => {
    if (isLoadingRef.current) {
      return;
    }

    const now = Date.now();

    // Don't save more than once every 2 seconds
    if (now - lastSaveRef.current < 2000) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        if (!isLoadingRef.current) {
          localRoomService.autoSaveCurrentRoom();
          lastSaveRef.current = Date.now();
        } else {
        }
      }, 2000);
      return;
    }

    localRoomService.autoSaveCurrentRoom();
    lastSaveRef.current = now;
  };

  // Check if we're in a local room
  const isInLocalRoom = () => {
    return localStorage.getItem('isLocalRoom') === 'true' && 
           localStorage.getItem('selectedLocalRoomId');
  };

  useEffect(() => {
    // Always return a cleanup function, even if not in local room
    // This ensures React always gets the same number of hooks
    if (!isInLocalRoom()) {
      return () => {
        // No cleanup needed if not in local room
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
      };
    }

    // Subscribe to game store changes (backgrounds, camera, etc.)
    const unsubscribeGame = useGameStore.subscribe((state, prevState) => {
      if (!isInLocalRoom()) return;

      // Skip auto-save if we're actively dragging to prevent performance issues
      const isDraggingCamera = state.isDraggingCamera || window._isDraggingCamera || false;
      const isTokenDragging = window.tokenInteractionActive || false;

      if (isDraggingCamera || isTokenDragging) {
        return; // Skip saving during active dragging
      }

      // Check for background changes (skip camera position changes - too frequent and less critical)
      // Camera position is saved when other changes occur or on unmount
      if (state.backgrounds !== prevState.backgrounds ||
          state.activeBackgroundId !== prevState.activeBackgroundId ||
          state.backgroundImageUrl !== prevState.backgroundImageUrl ||
          state.backgroundImage !== prevState.backgroundImage ||
          state.zoomLevel !== prevState.zoomLevel) {
        debouncedSave();
      }
    });

    // Subscribe to creature store changes (tokens, not global creatures)
    const unsubscribeCreatures = useCreatureStore.subscribe((state, prevState) => {
      if (!isInLocalRoom()) return;

      // Monitor tokens (placed creatures) instead of global creature library
      if (state.tokens !== prevState.tokens) {
        debouncedSave();
      }
    });

    // Subscribe to grid item changes (dropped items)
    const unsubscribeGridItems = useGridItemStore.subscribe((state, prevState) => {
      if (!isInLocalRoom()) return;
      
      if (state.gridItems !== prevState.gridItems) {
        debouncedSave();
      }
    });

    // Subscribe to level editor changes
    const unsubscribeLevelEditor = useLevelEditorStore.subscribe((state, prevState) => {
      if (!isInLocalRoom()) return;
      
      if (state.terrainData !== prevState.terrainData ||
          state.environmentalObjects !== prevState.environmentalObjects ||
          state.lightSources !== prevState.lightSources) {
        debouncedSave();
      }
    });


    // Cleanup function
    return () => {
      unsubscribeGame();
      unsubscribeCreatures();
      unsubscribeGridItems();
      unsubscribeLevelEditor();
      
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
    };
  }, []); // Empty dependency array - we check isInLocalRoom() inside the effect

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Return the manual save function for external use
  return { forceSave, setLoading };
};

export default useLocalRoomAutoSave;
