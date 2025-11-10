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
  
  // Debounced save function to prevent excessive saves
  const debouncedSave = () => {
    if (isLoadingRef.current) {
      console.log('🚫 Auto-save skipped - room is loading');
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
          console.log('⏰ Delayed auto-save triggered');
          localRoomService.autoSaveCurrentRoom();
          lastSaveRef.current = Date.now();
        } else {
          console.log('🚫 Delayed auto-save skipped - still loading');
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
    if (!isInLocalRoom()) return;

    // Subscribe to game store changes (backgrounds, camera, etc.)
    const unsubscribeGame = useGameStore.subscribe((state, prevState) => {
      if (!isInLocalRoom()) return;

      // Check for background changes
      if (state.backgrounds !== prevState.backgrounds ||
          state.activeBackgroundId !== prevState.activeBackgroundId ||
          state.backgroundImageUrl !== prevState.backgroundImageUrl ||
          state.backgroundImage !== prevState.backgroundImage ||
          state.cameraX !== prevState.cameraX ||
          state.cameraY !== prevState.cameraY ||
          state.zoomLevel !== prevState.zoomLevel) {
        console.log('🎨 Local room: Background or camera changed, auto-saving...', {
          backgroundsChanged: state.backgrounds !== prevState.backgrounds,
          activeIdChanged: state.activeBackgroundId !== prevState.activeBackgroundId,
          backgroundUrlChanged: state.backgroundImageUrl !== prevState.backgroundImageUrl,
          backgroundImageChanged: state.backgroundImage !== prevState.backgroundImage,
          backgroundsCount: state.backgrounds?.length || 0,
          activeBackgroundId: state.activeBackgroundId
        });
        debouncedSave();
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
      
      console.log('🔄 Local room auto-save disabled');
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
