/**
 * Community Spells Hook
 * 
 * React hook for managing community spell data and operations.
 * Provides state management and caching for community spell interactions.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getSpellCategories,
  getSpellsByCategory,
  searchSpells,
  getFeaturedSpells,
  uploadSpell,
  downloadSpell,
  rateSpell
} from '../services/firebase/communitySpellService';

export function useCommunitySpells() {
  const [categories, setCategories] = useState([]);
  const [spells, setSpells] = useState([]);
  const [featuredSpells, setFeaturedSpells] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
    loadFeaturedSpells();
  }, []);

  // Load spells when category or search term changes
  useEffect(() => {
    if (selectedCategory) {
      loadSpellsByCategory(selectedCategory);
    } else if (searchTerm) {
      performSearch(searchTerm);
    } else {
      setSpells([]);
    }
  }, [selectedCategory, searchTerm]);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const categoriesData = await getSpellCategories();
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load categories:', err);
      // If Firebase is not configured, provide default categories
      if (err.message.includes('Firebase is not configured')) {
        setCategories([
          {
            id: 'damage',
            name: 'Damage Spells',
            description: 'Spells that deal damage to enemies',
            icon: 'spell_fire_fireball02',
            color: '#FF4500'
          },
          {
            id: 'healing',
            name: 'Healing Spells',
            description: 'Spells that restore health and vitality',
            icon: 'spell_holy_heal',
            color: '#32CD32'
          },
          {
            id: 'utility',
            name: 'Utility Spells',
            description: 'Spells that provide various utility effects',
            icon: 'spell_arcane_teleportundercity',
            color: '#4169E1'
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFeaturedSpells = useCallback(async () => {
    try {
      const featured = await getFeaturedSpells(6);
      setFeaturedSpells(featured);
    } catch (err) {
      console.error('Failed to load featured spells:', err);
    }
  }, []);

  const loadSpellsByCategory = useCallback(async (categoryId, loadMore = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getSpellsByCategory(
        categoryId, 
        20, 
        loadMore ? lastDoc : null
      );
      
      if (loadMore) {
        setSpells(prev => [...prev, ...result.spells]);
      } else {
        setSpells(result.spells);
      }
      
      setHasMore(result.hasMore);
      setLastDoc(result.lastDoc);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load spells:', err);
    } finally {
      setLoading(false);
    }
  }, [lastDoc]);

  const performSearch = useCallback(async (term) => {
    try {
      setLoading(true);
      setError(null);
      const searchResults = await searchSpells(term);
      setSpells(searchResults);
      setHasMore(false);
      setLastDoc(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to search spells:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMoreSpells = useCallback(() => {
    if (selectedCategory && hasMore && !loading) {
      loadSpellsByCategory(selectedCategory, true);
    }
  }, [selectedCategory, hasMore, loading, loadSpellsByCategory]);

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
    setSpells([]);
    setLastDoc(null);
    setHasMore(false);
  }, []);

  const uploadCommunitySpell = useCallback(async (spellData, userId) => {
    try {
      setLoading(true);
      setError(null);
      const uploadedSpell = await uploadSpell(spellData, userId);
      
      // Refresh the current view if we're in the same category
      if (selectedCategory === uploadedSpell.categoryId) {
        loadSpellsByCategory(selectedCategory);
      }
      
      return uploadedSpell;
    } catch (err) {
      setError(err.message);
      console.error('Failed to upload spell:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, loadSpellsByCategory]);

  const downloadCommunitySpell = useCallback(async (spellId) => {
    try {
      const spell = await downloadSpell(spellId);
      
      // Update the spell in our local state to reflect the new download count
      setSpells(prev => prev.map(s => 
        s.id === spellId 
          ? { ...s, downloadCount: spell.downloadCount }
          : s
      ));
      
      return spell;
    } catch (err) {
      setError(err.message);
      console.error('Failed to download spell:', err);
      throw err;
    }
  }, []);

  const rateCommunitySpell = useCallback(async (spellId, userId, rating) => {
    try {
      await rateSpell(spellId, userId, rating);
      
      // Refresh the spell data to get updated rating
      if (selectedCategory) {
        loadSpellsByCategory(selectedCategory);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to rate spell:', err);
      throw err;
    }
  }, [selectedCategory, loadSpellsByCategory]);

  return {
    // Data
    categories,
    spells,
    featuredSpells,
    
    // State
    loading,
    error,
    selectedCategory,
    searchTerm,
    hasMore,
    
    // Actions
    selectCategory,
    search,
    clearSelection,
    loadMoreSpells,
    uploadCommunitySpell,
    downloadCommunitySpell,
    rateCommunitySpell,
    
    // Refresh functions
    refreshCategories: loadCategories,
    refreshFeatured: loadFeaturedSpells
  };
}
