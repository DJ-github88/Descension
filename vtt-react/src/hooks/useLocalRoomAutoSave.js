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
  const cameraChangeTimeoutRef = useRef(null);
  const lastCameraSaveRef = useRef(0);
  const cameraChangeCountRef = useRef(0);

  // Manual save function that can be called externally
  const forceSave = () => {
    if (isInLocalRoom() && !isLoadingRef.current) {
      localRoomService.autoSaveCurrentRoom();
      lastSaveRef.current = Date.now();
      lastCameraSaveRef.current = Date.now();
      console.log('💾 Manual save triggered for local room');
    }
  };

  // Function to set loading state (prevents auto-save during loading)
  const setLoading = (loading) => {
    isLoadingRef.current = loading;
    if (loading) {
      console.log('🔄 Auto-save disabled during room loading');
    } else {
      console.log('✅ Auto-save re-enabled after room loading');
    }
  };
  
  // CRITICAL FIX: Debounced save function with aggressive throttling for camera changes
  // Camera changes are throttled heavily to prevent lag during dragging/zooming
  const debouncedSave = (isCameraChange = false) => {
    if (isLoadingRef.current) {
      return;
    }

    const now = Date.now();

    // CRITICAL FIX: For camera changes, use very aggressive debouncing (10 seconds)
    // This prevents auto-save from firing during active dragging/zooming
    if (isCameraChange) {
      cameraChangeCountRef.current += 1;
      
      // Clear any existing timeout
      if (cameraChangeTimeoutRef.current) {
        clearTimeout(cameraChangeTimeoutRef.current);
      }
      
      // Save camera position only after 10 seconds of no camera changes
      // This ensures we only save when the user stops moving/zooming
      cameraChangeTimeoutRef.current = setTimeout(() => {
        if (!isLoadingRef.current) {
          localRoomService.autoSaveCurrentRoom();
          lastSaveRef.current = Date.now();
          lastCameraSaveRef.current = Date.now();
          cameraChangeCountRef.current = 0;
        }
      }, 10000); // 10 second debounce for camera changes
      return;
    }

    // For non-camera changes, use shorter debounce (2 seconds)
    if (now - lastSaveRef.current < 2000) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        if (!isLoadingRef.current) {
          localRoomService.autoSaveCurrentRoom();
          lastSaveRef.current = Date.now();
        }
      }, 2000);
      return;
    }

    localRoomService.autoSaveCurrentRoom();
    lastSaveRef.current = now;
    if (isCameraChange) {
      lastCameraSaveRef.current = now;
    }
  };

  // Check if we're in a local room
  const isInLocalRoom = () => {
    return localStorage.getItem('isLocalRoom') === 'true' && 
           localStorage.getItem('selectedLocalRoomId');
  };

  useEffect(() => {
    if (!isInLocalRoom()) return;

    // Subscribe to game store changes (backgrounds, camera, etc.)
    const unsubscribeGame = useGameStore.subscribe((state, prevState) => {
      if (!isInLocalRoom()) return;

      // Check for background changes (non-camera changes)
      const backgroundChanged = state.backgrounds !== prevState.backgrounds ||
          state.activeBackgroundId !== prevState.activeBackgroundId ||
          state.backgroundImageUrl !== prevState.backgroundImageUrl ||
          state.backgroundImage !== prevState.backgroundImage;

      // Check for camera changes (camera position/zoom)
      const cameraChanged = state.cameraX !== prevState.cameraX ||
          state.cameraY !== prevState.cameraY ||
          state.zoomLevel !== prevState.zoomLevel;

      if (backgroundChanged || cameraChanged) {
        // Only log for background changes, not camera changes (reduces spam)
        if (backgroundChanged) {
          console.log('🎨 Local room: Background changed, auto-saving...');
        }
        // CRITICAL FIX: Pass isCameraChange flag to use aggressive throttling
        // Camera changes use 10 second debounce to prevent lag during dragging/zooming
        debouncedSave(cameraChanged && !backgroundChanged);
      }
    });

    // Subscribe to creature store changes (tokens, not global creatures)
    const unsubscribeCreatures = useCreatureStore.subscribe((state, prevState) => {
      if (!isInLocalRoom()) return;

      // Monitor tokens (placed creatures) instead of global creature library
      if (state.tokens !== prevState.tokens) {
        console.log('🎭 Local room: Tokens changed, auto-saving...');
        debouncedSave();
      }
    });

    // Subscribe to grid item changes (dropped items)
    const unsubscribeGridItems = useGridItemStore.subscribe((state, prevState) => {
      if (!isInLocalRoom()) return;
      
      if (state.gridItems !== prevState.gridItems) {
        console.log('📦 Local room: Grid items changed, auto-saving...');
        debouncedSave();
      }
    });

    // Subscribe to level editor changes
    const unsubscribeLevelEditor = useLevelEditorStore.subscribe((state, prevState) => {
      if (!isInLocalRoom()) return;
      
      if (state.terrainData !== prevState.terrainData ||
          state.environmentalObjects !== prevState.environmentalObjects ||
          state.lightSources !== prevState.lightSources) {
        console.log('🏗️ Local room: Level editor changed, auto-saving...');
        debouncedSave();
      }
    });

    console.log('🔄 Local room auto-save enabled');

    // Cleanup function
    return () => {
      unsubscribeGame();
      unsubscribeCreatures();
      unsubscribeGridItems();
      unsubscribeLevelEditor();
      
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      if (cameraChangeTimeoutRef.current) {
        clearTimeout(cameraChangeTimeoutRef.current);
      }
      
      console.log('🔄 Local room auto-save disabled');
    };
  }, []); // Empty dependency array - we check isInLocalRoom() inside the effect

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (cameraChangeTimeoutRef.current) {
        clearTimeout(cameraChangeTimeoutRef.current);
      }
    };
  }, []);

  // Return the manual save function for external use
  return { forceSave, setLoading };
};

export default useLocalRoomAutoSave;
