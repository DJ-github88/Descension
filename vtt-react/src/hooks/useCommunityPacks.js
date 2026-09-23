/**
 * Community Packs Hook
 * 
 * This hook provides state management for community packs (collections of items and/or creatures).
 * It handles loading, searching, and managing community packs from Firebase.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { tryAcquireCooldown } from '../utils/writeThrottle';
import {
  getPacksByType,
  searchPacks,
  getFeaturedPacks,
  downloadPack,
  getPackContents,
  ratePack,
  createPack,
  checkPackDependencies,
  getPackCompatibility,
  validatePack,
  PACK_TYPES
} from '../services/firebase/packService';

export function useCommunityPacks() {
  // State management
  const [packs, setPacks] = useState([]);
  const [featuredPacks, setFeaturedPacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasMore, setHasMore] = useState(false);
  // Pagination cursor kept in a ref, NOT state: storing the QueryDocumentSnapshot
  // in state gave it a new identity on every fetch, which changed the
  // `loadPacksByType` callback identity, which re-ran the load effect, which
  // fetched again - an endless 20-document read loop while a type was selected.
  const lastDocRef = useRef(null);

  // Load featured packs on mount
  useEffect(() => {
    loadFeaturedPacks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFeaturedPacks = useCallback(async () => {
    try {
      setError(null);
      const featuredData = await getFeaturedPacks(12);
      setFeaturedPacks(featuredData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load featured packs:', err);
    }
  }, []);

  const loadPacksByType = useCallback(async (packType, loadMore = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getPacksByType(
        packType, 
        20, 
        loadMore ? lastDocRef.current : null
      );
      
      if (loadMore) {
        setPacks(prev => [...prev, ...result.packs]);
      } else {
        setPacks(result.packs);
      }
      
      setHasMore(result.hasMore);
      lastDocRef.current = result.lastDoc || null;
    } catch (err) {
      setError(err.message);
      console.error('Failed to load packs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const performSearch = useCallback(async (term) => {
    try {
      setLoading(true);
      setError(null);
      const searchResults = await searchPacks(term);
      setPacks(searchResults);
      setHasMore(false);
      lastDocRef.current = null;
    } catch (err) {
      setError(err.message);
      console.error('Failed to search packs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMorePacks = useCallback(() => {
    if (selectedType && hasMore && !loading) {
      loadPacksByType(selectedType, true);
    }
  }, [selectedType, hasMore, loading, loadPacksByType]);

  const selectType = useCallback((packType) => {
    setSelectedType(packType);
    setSearchTerm('');
    lastDocRef.current = null;
  }, []);

  const search = useCallback((term) => {
    setSearchTerm(term);
    setSelectedType(null);
    lastDocRef.current = null;
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedType(null);
    setSearchTerm('');
    setPacks([]);
    lastDocRef.current = null;
    setHasMore(false);
  }, []);

  // Load packs when type or search term changes
  useEffect(() => {
    if (selectedType) {
      loadPacksByType(selectedType);
    } else if (searchTerm) {
      performSearch(searchTerm);
    }
  }, [selectedType, searchTerm, loadPacksByType, performSearch]);

  const downloadCommunityPack = useCallback(async (packId) => {
    try {
      const pack = await downloadPack(packId);
      
      // Update the pack in our local state to reflect the new download count
      setPacks(prev => prev.map(p => 
        p.id === packId 
          ? { ...p, downloadCount: pack.downloadCount }
          : p
      ));
      
      setFeaturedPacks(prev => prev.map(p => 
        p.id === packId 
          ? { ...p, downloadCount: pack.downloadCount }
          : p
      ));
      
      return pack;
    } catch (err) {
      setError(err.message);
      console.error('Failed to download pack:', err);
      throw err;
    }
  }, []);

  const getPackContentsData = useCallback(async (packId) => {
    try {
      const contents = await getPackContents(packId);
      return contents;
    } catch (err) {
      setError(err.message);
      console.error('Failed to get pack contents:', err);
      throw err;
    }
  }, []);

  const rateCommunityPack = useCallback(async (packId, userId, rating) => {
    if (!tryAcquireCooldown(`rate:${userId || 'anon'}`, 1500)) {
      return { blocked: true };
    }

    try {
      await ratePack(packId, userId, rating);
      
      // Refresh the pack data to get updated rating
      if (selectedType) {
        loadPacksByType(selectedType);
      }
      loadFeaturedPacks();
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Failed to rate pack:', err);
      throw err;
    }
  }, [selectedType, loadPacksByType, loadFeaturedPacks]);

  const createCommunityPack = useCallback(async (packData, userId) => {
    try {
      // Validate pack data first
      const validation = validatePack(packData);
      if (!validation.isValid) {
        throw new Error(`Pack validation failed: ${validation.errors.join(', ')}`);
      }

      const createdPack = await createPack(packData, userId);
      
      // Refresh featured packs
      loadFeaturedPacks();
      
      return createdPack;
    } catch (err) {
      setError(err.message);
      console.error('Failed to create pack:', err);
      throw err;
    }
  }, [loadFeaturedPacks]);

  const checkDependencies = useCallback(async (packId) => {
    try {
      const dependencies = await checkPackDependencies(packId);
      return dependencies;
    } catch (err) {
      setError(err.message);
      console.error('Failed to check pack dependencies:', err);
      throw err;
    }
  }, []);

  const getCompatibility = useCallback(async (packId) => {
    try {
      const compatibility = await getPackCompatibility(packId);
      return compatibility;
    } catch (err) {
      setError(err.message);
      console.error('Failed to get pack compatibility:', err);
      throw err;
    }
  }, []);

  return {
    // Data
    packs,
    featuredPacks,
    
    // State
    loading,
    error,
    selectedType,
    searchTerm,
    hasMore,
    
    // Actions
    selectType,
    search,
    clearSelection,
    loadMorePacks,
    downloadCommunityPack,
    getPackContentsData,
    rateCommunityPack,
    createCommunityPack,
    checkDependencies,
    getCompatibility,
    
    // Utilities
    validatePack,
    PACK_TYPES,
    
    // Refresh functions
    refreshFeatured: loadFeaturedPacks
  };
}

export default useCommunityPacks;
