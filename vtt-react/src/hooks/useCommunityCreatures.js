/**
 * Community Creatures Hook
 * 
 * This hook provides state management for community creatures, similar to useCommunitySpells.
 * It handles loading, searching, and managing community creatures from Firebase.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getCreatureCategories,
  getAllCommunityCreatures,
  getCreaturesByCategory,
  searchCreatures,
  getFeaturedCreatures,
  downloadCreature,
  rateCreature,
  uploadCreature
} from '../services/firebase/communityCreatureService';

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
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'downloads', 'newest'

  const loadCategories = useCallback(async () => {
    try {
      setError(null);
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
      setFeaturedCreatures(featuredData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load featured creatures:', err);
    }
  }, []);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
    loadFeaturedCreatures();
  }, [loadCategories, loadFeaturedCreatures]);

  const loadAllCreatures = useCallback(async (sortByValue = sortBy, loadMore = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getAllCommunityCreatures(
        20,
        loadMore ? lastDoc : null,
        sortByValue
      );
      
      if (loadMore) {
        setCreatures(prev => [...prev, ...result.creatures]);
      } else {
        setCreatures(result.creatures);
      }
      
      setHasMore(result.hasMore);
      setLastDoc(result.lastDoc);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load creatures:', err);
    } finally {
      setLoading(false);
    }
  }, [sortBy, lastDoc]);

  const loadCreaturesByCategory = useCallback(async (categoryId, loadMore = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getCreaturesByCategory(
        categoryId, 
        20, 
        loadMore ? lastDoc : null
      );
      
      if (loadMore) {
        setCreatures(prev => [...prev, ...result.creatures]);
      } else {
        setCreatures(result.creatures);
      }
      
      setHasMore(result.hasMore);
      setLastDoc(result.lastDoc);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load creatures:', err);
    } finally {
      setLoading(false);
    }
  }, [lastDoc]);

  const performSearch = useCallback(async (term) => {
    try {
      setLoading(true);
      setError(null);
      const searchResults = await searchCreatures(term);
      setCreatures(searchResults);
      setHasMore(false);
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
    refreshCategories: loadCategories,
    refreshFeatured: loadFeaturedCreatures
  };
}

export default useCommunityCreatures;
