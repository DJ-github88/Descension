/**
 * Community Items Hook
 * 
 * This hook provides state management for community items, similar to useCommunitySpells.
 * It handles loading, searching, and managing community items from Firebase.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getItemCategories,
  getItemsByCategory,
  searchItems,
  getFeaturedItems,
  downloadItem,
  rateItem,
  uploadItem
} from '../services/firebase/communityItemService';

export function useCommunityItems() {
  // State management
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
    loadFeaturedItems();
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      setError(null);
      const categoriesData = await getItemCategories();
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load item categories:', err);
    }
  }, []);

  const loadFeaturedItems = useCallback(async () => {
    try {
      setError(null);
      const featuredData = await getFeaturedItems(10);
      setFeaturedItems(featuredData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load featured items:', err);
    }
  }, []);

  const loadItemsByCategory = useCallback(async (categoryId, loadMore = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getItemsByCategory(
        categoryId, 
        20, 
        loadMore ? lastDoc : null
      );
      
      if (loadMore) {
        setItems(prev => [...prev, ...result.items]);
      } else {
        setItems(result.items);
      }
      
      setHasMore(result.hasMore);
      setLastDoc(result.lastDoc);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load items:', err);
    } finally {
      setLoading(false);
    }
  }, [lastDoc]);

  const performSearch = useCallback(async (term) => {
    try {
      setLoading(true);
      setError(null);
      const searchResults = await searchItems(term);
      setItems(searchResults);
      setHasMore(false);
      setLastDoc(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to search items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMoreItems = useCallback(() => {
    if (selectedCategory && hasMore && !loading) {
      loadItemsByCategory(selectedCategory, true);
    }
  }, [selectedCategory, hasMore, loading, loadItemsByCategory]);

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
    setItems([]);
    setLastDoc(null);
    setHasMore(false);
  }, []);

  // Load items when category or search term changes
  useEffect(() => {
    if (selectedCategory) {
      loadItemsByCategory(selectedCategory);
    } else if (searchTerm) {
      performSearch(searchTerm);
    }
  }, [selectedCategory, searchTerm, loadItemsByCategory, performSearch]);

  const downloadCommunityItem = useCallback(async (itemId) => {
    try {
      const item = await downloadItem(itemId);
      
      // Update the item in our local state to reflect the new download count
      setItems(prev => prev.map(i => 
        i.id === itemId 
          ? { ...i, downloadCount: item.downloadCount }
          : i
      ));
      
      return item;
    } catch (err) {
      setError(err.message);
      console.error('Failed to download item:', err);
      throw err;
    }
  }, []);

  const rateCommunityItem = useCallback(async (itemId, userId, rating) => {
    try {
      await rateItem(itemId, userId, rating);
      
      // Refresh the item data to get updated rating
      if (selectedCategory) {
        loadItemsByCategory(selectedCategory);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to rate item:', err);
      throw err;
    }
  }, [selectedCategory, loadItemsByCategory]);

  const uploadCommunityItem = useCallback(async (itemData, userId) => {
    try {
      const uploadedItem = await uploadItem(itemData, userId);
      
      // Refresh categories and featured items
      loadCategories();
      loadFeaturedItems();
      
      return uploadedItem;
    } catch (err) {
      setError(err.message);
      console.error('Failed to upload item:', err);
      throw err;
    }
  }, [loadCategories, loadFeaturedItems]);

  return {
    // Data
    categories,
    items,
    featuredItems,
    
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
    loadMoreItems,
    uploadCommunityItem,
    downloadCommunityItem,
    rateCommunityItem,
    
    // Refresh functions
    refreshCategories: loadCategories,
    refreshFeatured: loadFeaturedItems
  };
}

export default useCommunityItems;
