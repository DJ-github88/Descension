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
  getRecentItems,
  downloadItem,
  rateItem,
  uploadItem,
  voteItem,
  getUserVote,
  addComment,
  getComments
} from '../services/firebase/communityItemService';

export function useCommunityItems() {
  // State management
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
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
    loadRecentItems();
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const categoriesData = await getItemCategories();
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load item categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFeaturedItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const featuredData = await getFeaturedItems(10);
      setFeaturedItems(featuredData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load featured items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRecentItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const recentData = await getRecentItems(10);
      setRecentItems(recentData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load recent items:', err);
    } finally {
      setLoading(false);
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

  const voteCommunityItem = useCallback(async (itemId, userId, direction) => {
    try {
      await voteItem(itemId, userId, direction);
      const updateVoteCount = (list) => list.map(i => {
        if (i.id !== itemId) return i;
        const prevDir = i._userVote;
        let upvotes = i.upvotes || 0;
        let downvotes = i.downvotes || 0;
        if (prevDir === direction) {
          if (direction === 'up') upvotes--;
          else downvotes--;
          return { ...i, upvotes, downvotes, _userVote: null };
        }
        if (prevDir === 'up') upvotes--;
        if (prevDir === 'down') downvotes--;
        if (direction === 'up') upvotes++;
        if (direction === 'down') downvotes++;
        return { ...i, upvotes, downvotes, _userVote: direction };
      });
      setItems(prev => updateVoteCount(prev));
      setFeaturedItems(prev => updateVoteCount(prev));
      setRecentItems(prev => updateVoteCount(prev));
    } catch (err) {
      console.error('Failed to vote:', err);
      throw err;
    }
  }, []);

  const fetchUserVote = useCallback(async (itemId, userId) => {
    try {
      return await getUserVote(itemId, userId);
    } catch (err) {
      console.error('Failed to get user vote:', err);
      return null;
    }
  }, []);

  const addCommunityComment = useCallback(async (itemId, userId, displayName, text) => {
    try {
      const comment = await addComment(itemId, userId, displayName, text);
      const appendComment = (list) => list.map(i =>
        i.id === itemId ? { ...i, commentCount: (i.commentCount || 0) + 1, _comments: [...(i._comments || []), comment] } : i
      );
      setItems(prev => appendComment(prev));
      setFeaturedItems(prev => appendComment(prev));
      setRecentItems(prev => appendComment(prev));
      return comment;
    } catch (err) {
      console.error('Failed to add comment:', err);
      throw err;
    }
  }, []);

  const fetchComments = useCallback(async (itemId) => {
    try {
      return await getComments(itemId);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      return [];
    }
  }, []);

  return {
    // Data
    categories,
    items,
    featuredItems,
    recentItems,
    
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
    voteCommunityItem,
    fetchUserVote,
    addCommunityComment,
    fetchComments,
    
    // Refresh functions
    refreshCategories: loadCategories,
    refreshFeatured: loadFeaturedItems,
    refreshRecent: loadRecentItems
  };
}

export default useCommunityItems;
