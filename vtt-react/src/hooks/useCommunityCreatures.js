/**
 * Community Creatures Hook
 * 
 * This hook provides state management for community creatures, similar to useCommunitySpells.
 * It handles loading, searching, and managing community creatures from Firebase.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getCreatureCategories,
  getAllCommunityCreatures,
  getCreaturesByCategory,
  searchCreatures,
  getFeaturedCreatures,
  downloadCreature,
  rateCreature,
  uploadCreature,
  seedTestCreature,
  initializeCreatureCategories,
  cleanupDuplicateCreatures
} from '../services/firebase/communityCreatureService';

export function deduplicateCreatureList(list) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  return list.filter(item => {
    if (!item) return false;
    const name = item.name ? item.name.trim().toLowerCase() : '';
    const key = item.id || name;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

let creaturesInitPromise = null;
function ensureCreaturesInit(sortByValue) {
  if (!creaturesInitPromise) {
    creaturesInitPromise = (async () => {
      await cleanupDuplicateCreatures();
      await seedTestCreature();
    })();
  }
  return creaturesInitPromise;
}

export function useCommunityCreatures() {
  // State management
  const [categories, setCategories] = useState([]);
  const [creatures, setCreatures] = useState([]);
  const [featuredCreatures, setFeaturedCreatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const lastDocRef = useRef(null);
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'downloads', 'newest'

  const loadCategories = useCallback(async () => {
    try {
      setError(null);
      // Always ensure categories are initialized in Firestore
      await initializeCreatureCategories();
      const categoriesData = await getCreatureCategories();
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load creature categories:', err);
    }
  }, []);

  const loadFeaturedCreatures = useCallback(async () => {
    try {
      setError(null);
      const featuredData = await getFeaturedCreatures(10);
      setFeaturedCreatures(deduplicateCreatureList(featuredData));
    } catch (err) {
      setError(err.message);
      console.error('Failed to load featured creatures:', err);
    }
  }, []);

  const loadAllCreatures = useCallback(async (sortByValue = sortBy, loadMore = false) => {
    try {
      setLoading(true);
      setError(null);

      // One-time cleanup + seed (deduped via shared promise)
      if (!loadMore) await ensureCreaturesInit(sortByValue);

      const docCursor = loadMore ? lastDocRef.current : null;
      const result = await getAllCommunityCreatures(
        20,
        docCursor,
        sortByValue
      );
      
      lastDocRef.current = result.lastDoc;
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);

      if (loadMore) {
        setCreatures(prev => deduplicateCreatureList([...prev, ...result.creatures]));
      } else {
        setCreatures(deduplicateCreatureList(result.creatures));
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to load creatures:', err);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  const loadCreaturesByCategory = useCallback(async (categoryId, loadMore = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const docCursor = loadMore ? lastDocRef.current : null;
      const result = await getCreaturesByCategory(
        categoryId, 
        20, 
        docCursor
      );
      
      lastDocRef.current = result.lastDoc;
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);

      if (loadMore) {
        setCreatures(prev => deduplicateCreatureList([...prev, ...result.creatures]));
      } else {
        setCreatures(deduplicateCreatureList(result.creatures));
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to load creatures:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const performSearch = useCallback(async (term) => {
    try {
      setLoading(true);
      setError(null);
      const searchResults = await searchCreatures(term);
      setCreatures(deduplicateCreatureList(searchResults));
      setHasMore(false);
      lastDocRef.current = null;
      setLastDoc(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to search creatures:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMoreCreatures = useCallback(() => {
    if (hasMore && !loading && !searchTerm) {
      if (selectedCategory) {
        loadCreaturesByCategory(selectedCategory, true);
      } else {
        loadAllCreatures(sortBy, true);
      }
    }
  }, [selectedCategory, hasMore, loading, searchTerm, sortBy, loadCreaturesByCategory, loadAllCreatures]);

  const selectCategory = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    setSearchTerm('');
    setLastDoc(null);
  }, []);

  const search = useCallback((term) => {
    setSearchTerm(term);
    setSelectedCategory(null);
    setLastDoc(null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCategory(null);
    setSearchTerm('');
    setLastDoc(null);
    setHasMore(false);
    loadAllCreatures();
  }, [loadAllCreatures]);

  const changeSortBy = useCallback((newSortBy) => {
    setSortBy(newSortBy);
    setLastDoc(null);
    setHasMore(false);
  }, []);

  // Load all creatures on mount and when sort changes
  useEffect(() => {
    loadFeaturedCreatures();
    if (!searchTerm && !selectedCategory) {
      loadAllCreatures();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  // Load creatures when category or search term changes
  useEffect(() => {
    if (selectedCategory) {
      loadCreaturesByCategory(selectedCategory);
    } else if (searchTerm) {
      performSearch(searchTerm);
    } else {
      loadAllCreatures();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchTerm]);

  const downloadCommunityCreature = useCallback(async (creatureId) => {
    try {
      const creature = await downloadCreature(creatureId);
      
      // Update the creature in our local state to reflect the new download count
      setCreatures(prev => prev.map(c => 
        c.id === creatureId 
          ? { ...c, downloadCount: creature.downloadCount }
          : c
      ));
      
      return creature;
    } catch (err) {
      setError(err.message);
      console.error('Failed to download creature:', err);
      throw err;
    }
  }, []);

  const rateCommunityCreature = useCallback(async (creatureId, userId, rating) => {
    try {
      await rateCreature(creatureId, userId, rating);
      
      // Refresh the creature data to get updated rating
      if (selectedCategory) {
        loadCreaturesByCategory(selectedCategory);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to rate creature:', err);
      throw err;
    }
  }, [selectedCategory, loadCreaturesByCategory]);

  const uploadCommunityCreature = useCallback(async (creatureData, userId) => {
    try {
      const uploadedCreature = await uploadCreature(creatureData, userId);
      
      // Refresh categories and featured creatures
      loadCategories();
      loadFeaturedCreatures();
      
      return uploadedCreature;
    } catch (err) {
      setError(err.message);
      console.error('Failed to upload creature:', err);
      throw err;
    }
  }, [loadCategories, loadFeaturedCreatures]);

  const refreshAll = useCallback(() => {
    loadCategories();
    loadFeaturedCreatures();
    loadAllCreatures();
  }, [loadCategories, loadFeaturedCreatures, loadAllCreatures]);

  return {
    // Data
    categories,
    creatures,
    featuredCreatures,
    
    // State
    loading,
    error,
    selectedCategory,
    searchTerm,
    sortBy,
    hasMore,
    
    // Actions
    selectCategory,
    search,
    clearSelection,
    changeSortBy,
    loadMoreCreatures,
    uploadCommunityCreature,
    downloadCommunityCreature,
    rateCommunityCreature,
    
    // Refresh functions
    refreshAll,
    refreshCategories: loadCategories,
    refreshFeatured: loadFeaturedCreatures
  };
}

export default useCommunityCreatures;
