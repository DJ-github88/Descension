/**
 * User Library Hook
 * 
 * This hook provides state management for user's personal library of downloaded
 * community content. It handles syncing with Firebase and local storage.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getUserLibrary,
  addDownloadedItem,
  addDownloadedCreature,
  addDownloadedPack,
  addToFavorites,
  removeFromFavorites,
  getDownloadHistory,
  syncUserLibrary,
  clearUserLibrary
} from '../services/firebase/userLibraryService';

export function useUserLibrary(userId) {
  // State management
  const [library, setLibrary] = useState({
    downloadedItems: [],
    downloadedCreatures: [],
    downloadedPacks: [],
    favorites: [],
    downloadHistory: [],
    lastSyncAt: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // Load user library on mount and when userId changes
  useEffect(() => {
    if (userId) {
      loadUserLibrary();
    }
  }, [userId]);

  const loadUserLibrary = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      
      const libraryData = await getUserLibrary(userId);
      setLibrary(libraryData);
      
      // Also load from local storage and merge
      const localLibrary = getLocalLibrary();
      if (localLibrary && Object.keys(localLibrary).length > 0) {
        await syncLibraryData(localLibrary);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to load user library:', err);
      
      // Fallback to local storage
      const localLibrary = getLocalLibrary();
      if (localLibrary) {
        setLibrary(localLibrary);
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const syncLibraryData = useCallback(async (localData = null) => {
    if (!userId) return;

    try {
      setSyncing(true);
      setError(null);
      
      const dataToSync = localData || library;
      const syncedLibrary = await syncUserLibrary(userId, dataToSync);
      
      setLibrary(syncedLibrary);
      saveLocalLibrary(syncedLibrary);
      
      console.log('Library synced successfully');
    } catch (err) {
      setError(err.message);
      console.error('Failed to sync library:', err);
    } finally {
      setSyncing(false);
    }
  }, [userId, library]);

  const addItemToLibrary = useCallback(async (itemData) => {
    try {
      setError(null);
      
      // Add to Firebase
      if (userId) {
        await addDownloadedItem(userId, itemData);
      }
      
      // Update local state
      setLibrary(prev => ({
        ...prev,
        downloadedItems: [...prev.downloadedItems, {
          id: itemData.id,
          name: itemData.name,
          type: itemData.type,
          categoryId: itemData.categoryId,
          downloadedAt: new Date(),
          source: 'community'
        }],
        downloadHistory: [...prev.downloadHistory, {
          type: 'item',
          action: 'download',
          itemId: itemData.id,
          itemName: itemData.name,
          timestamp: new Date()
        }],
        lastSyncAt: new Date()
      }));
      
      // Save to local storage
      saveLocalLibrary(library);
      
    } catch (err) {
      setError(err.message);
      console.error('Failed to add item to library:', err);
      throw err;
    }
  }, [userId, library]);

  const addCreatureToLibrary = useCallback(async (creatureData) => {
    try {
      setError(null);
      
      // Add to Firebase
      if (userId) {
        await addDownloadedCreature(userId, creatureData);
      }
      
      // Update local state
      setLibrary(prev => ({
        ...prev,
        downloadedCreatures: [...prev.downloadedCreatures, {
          id: creatureData.id,
          name: creatureData.name,
          type: creatureData.type,
          categoryId: creatureData.categoryId,
          downloadedAt: new Date(),
          source: 'community'
        }],
        downloadHistory: [...prev.downloadHistory, {
          type: 'creature',
          action: 'download',
          creatureId: creatureData.id,
          creatureName: creatureData.name,
          timestamp: new Date()
        }],
        lastSyncAt: new Date()
      }));
      
      // Save to local storage
      saveLocalLibrary(library);
      
    } catch (err) {
      setError(err.message);
      console.error('Failed to add creature to library:', err);
      throw err;
    }
  }, [userId, library]);

  const addPackToLibrary = useCallback(async (packData) => {
    try {
      setError(null);
      
      // Add to Firebase
      if (userId) {
        await addDownloadedPack(userId, packData);
      }
      
      // Update local state
      setLibrary(prev => ({
        ...prev,
        downloadedPacks: [...prev.downloadedPacks, {
          id: packData.id,
          name: packData.name,
          type: packData.type,
          version: packData.version,
          itemCount: packData.items?.length || 0,
          creatureCount: packData.creatures?.length || 0,
          downloadedAt: new Date(),
          source: 'community'
        }],
        downloadHistory: [...prev.downloadHistory, {
          type: 'pack',
          action: 'download',
          packId: packData.id,
          packName: packData.name,
          timestamp: new Date()
        }],
        lastSyncAt: new Date()
      }));
      
      // Save to local storage
      saveLocalLibrary(library);
      
    } catch (err) {
      setError(err.message);
      console.error('Failed to add pack to library:', err);
      throw err;
    }
  }, [userId, library]);

  const toggleFavorite = useCallback(async (contentType, contentId, contentName) => {
    try {
      setError(null);
      
      const isFavorite = library.favorites.some(
        fav => fav.type === contentType && fav.id === contentId
      );
      
      if (isFavorite) {
        // Remove from favorites
        if (userId) {
          await removeFromFavorites(userId, contentType, contentId);
        }
        
        setLibrary(prev => ({
          ...prev,
          favorites: prev.favorites.filter(
            fav => !(fav.type === contentType && fav.id === contentId)
          ),
          lastSyncAt: new Date()
        }));
      } else {
        // Add to favorites
        if (userId) {
          await addToFavorites(userId, contentType, contentId, contentName);
        }
        
        setLibrary(prev => ({
          ...prev,
          favorites: [...prev.favorites, {
            type: contentType,
            id: contentId,
            name: contentName,
            addedAt: new Date()
          }],
          lastSyncAt: new Date()
        }));
      }
      
      // Save to local storage
      saveLocalLibrary(library);
      
    } catch (err) {
      setError(err.message);
      console.error('Failed to toggle favorite:', err);
      throw err;
    }
  }, [userId, library]);

  const clearLibrary = useCallback(async () => {
    try {
      setError(null);
      
      if (userId) {
        await clearUserLibrary(userId);
      }
      
      const emptyLibrary = {
        downloadedItems: [],
        downloadedCreatures: [],
        downloadedPacks: [],
        favorites: [],
        downloadHistory: [],
        lastSyncAt: new Date()
      };
      
      setLibrary(emptyLibrary);
      saveLocalLibrary(emptyLibrary);
      
    } catch (err) {
      setError(err.message);
      console.error('Failed to clear library:', err);
      throw err;
    }
  }, [userId]);

  // Helper functions for local storage
  const getLocalLibrary = () => {
    try {
      const stored = localStorage.getItem(`userLibrary_${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error reading local library:', error);
      return null;
    }
  };

  const saveLocalLibrary = (libraryData) => {
    try {
      localStorage.setItem(`userLibrary_${userId}`, JSON.stringify(libraryData));
    } catch (error) {
      console.error('Error saving local library:', error);
    }
  };

  // Check if content is in user's library
  const isDownloaded = useCallback((contentType, contentId) => {
    switch (contentType) {
      case 'item':
        return library.downloadedItems.some(item => item.id === contentId);
      case 'creature':
        return library.downloadedCreatures.some(creature => creature.id === contentId);
      case 'pack':
        return library.downloadedPacks.some(pack => pack.id === contentId);
      default:
        return false;
    }
  }, [library]);

  // Check if content is favorited
  const isFavorited = useCallback((contentType, contentId) => {
    return library.favorites.some(
      fav => fav.type === contentType && fav.id === contentId
    );
  }, [library]);

  return {
    // Data
    library,
    
    // State
    loading,
    error,
    syncing,
    
    // Actions
    addItemToLibrary,
    addCreatureToLibrary,
    addPackToLibrary,
    toggleFavorite,
    clearLibrary,
    syncLibraryData,
    
    // Utilities
    isDownloaded,
    isFavorited,
    
    // Refresh
    refreshLibrary: loadUserLibrary
  };
}

export default useUserLibrary;
