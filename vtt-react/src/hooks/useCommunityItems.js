/**
 * Community Items Hook
 * 
 * This hook provides state management for community items, aligned with the grimoire UI system.
 * It handles loading, searching, and managing community items from Firebase.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getItemCategories,
  getAllCommunityItems,
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

export function deduplicateItemList(list) {
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
  const lastDocRef = useRef(null);
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'downloads', 'newest'

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
      setFeaturedItems(deduplicateItemList(featuredData));
    } catch (err) {
      setError(err.message);
      console.error('Failed to load featured items:', err);
    }
  }, []);

  const loadRecentItems = useCallback(async () => {
    try {
      setError(null);
      const recentData = await getRecentItems(10);
      setRecentItems(deduplicateItemList(recentData));
    } catch (err) {
      setError(err.message);
      console.error('Failed to load recent items:', err);
    }
  }, []);

  const loadAllItems = useCallback(async (sortByValue = sortBy, loadMore = false) => {
    try {
      setLoading(true);
      setError(null);

      const docCursor = loadMore ? lastDocRef.current : null;
      const result = await getAllCommunityItems(
        20,
        docCursor,
        sortByValue
      );

      lastDocRef.current = result.lastDoc;
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);

      if (loadMore) {
        setItems(prev => deduplicateItemList([...prev, ...result.items]));
      } else {
        setItems(deduplicateItemList(result.items));
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to load items:', err);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  const loadItemsByCategory = useCallback(async (categoryId, loadMore = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const docCursor = loadMore ? lastDocRef.current : null;
      const result = await getItemsByCategory(
        categoryId, 
        20, 
        docCursor
      );
      
      lastDocRef.current = result.lastDoc;
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);

      if (loadMore) {
        setItems(prev => deduplicateItemList([...prev, ...result.items]));
      } else {
        setItems(deduplicateItemList(result.items));
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to load items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const performSearch = useCallback(async (term) => {
    try {
      setLoading(true);
      setError(null);
      const searchResults = await searchItems(term);
      setItems(deduplicateItemList(searchResults));
      setHasMore(false);
      lastDocRef.current = null;
      setLastDoc(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to search items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadCategories();
    loadFeaturedItems();
    loadRecentItems();
  }, [loadCategories, loadFeaturedItems, loadRecentItems]);

  // Load items on sort change or initial mount
  useEffect(() => {
    if (!searchTerm && !selectedCategory) {
      loadAllItems(sortBy);
    }
  }, [sortBy, searchTerm, selectedCategory, loadAllItems]);

  // Load items when category or search term changes
  useEffect(() => {
    if (selectedCategory) {
      loadItemsByCategory(selectedCategory);
    } else if (searchTerm) {
      performSearch(searchTerm);
    } else {
      loadAllItems(sortBy);
    }
  }, [selectedCategory, searchTerm, loadItemsByCategory, performSearch, loadAllItems, sortBy]);

  const loadMoreItems = useCallback(() => {
    if (hasMore && !loading && !searchTerm) {
      if (selectedCategory) {
        loadItemsByCategory(selectedCategory, true);
      } else {
        loadAllItems(sortBy, true);
      }
    }
  }, [selectedCategory, hasMore, loading, searchTerm, sortBy, loadItemsByCategory, loadAllItems]);

  const selectCategory = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    setSearchTerm('');
    lastDocRef.current = null;
    setLastDoc(null);
  }, []);

  const search = useCallback((term) => {
    setSearchTerm(term);
    setSelectedCategory(null);
    lastDocRef.current = null;
    setLastDoc(null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCategory(null);
    setSearchTerm('');
    lastDocRef.current = null;
    setLastDoc(null);
    setHasMore(false);
    loadAllItems(sortBy);
  }, [loadAllItems, sortBy]);

  const changeSortBy = useCallback((newSortBy) => {
    setSortBy(newSortBy);
    lastDocRef.current = null;
    setLastDoc(null);
    setHasMore(false);
  }, []);

  const downloadCommunityItem = useCallback(async (itemId) => {
    try {
      const item = await downloadItem(itemId);
      
      setItems(prev => prev.map(i => 
        i.id === itemId 
          ? { ...i, downloadCount: (i.downloadCount || 0) + 1 }
          : i
      ));
      setFeaturedItems(prev => prev.map(i =>
        i.id === itemId
          ? { ...i, downloadCount: (i.downloadCount || 0) + 1 }
          : i
      ));
      setRecentItems(prev => prev.map(i =>
        i.id === itemId
          ? { ...i, downloadCount: (i.downloadCount || 0) + 1 }
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
      if (selectedCategory) {
        loadItemsByCategory(selectedCategory);
      } else {
        loadAllItems(sortBy);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to rate item:', err);
      throw err;
    }
  }, [selectedCategory, loadItemsByCategory, loadAllItems, sortBy]);

  const uploadCommunityItem = useCallback(async (itemData, userId) => {
    try {
      const uploadedItem = await uploadItem(itemData, userId);
      loadCategories();
      loadFeaturedItems();
      loadRecentItems();
      loadAllItems(sortBy);
      return uploadedItem;
    } catch (err) {
      setError(err.message);
      console.error('Failed to upload item:', err);
      throw err;
    }
  }, [loadCategories, loadFeaturedItems, loadRecentItems, loadAllItems, sortBy]);

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

  const refreshAll = useCallback(() => {
    loadCategories();
    loadFeaturedItems();
    loadRecentItems();
    loadAllItems(sortBy);
  }, [loadCategories, loadFeaturedItems, loadRecentItems, loadAllItems, sortBy]);

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
    sortBy,
    hasMore,
    
    // Actions
    selectCategory,
    search,
    clearSelection,
    changeSortBy,
    loadMoreItems,
    uploadCommunityItem,
    downloadCommunityItem,
    rateCommunityItem,
    voteCommunityItem,
    fetchUserVote,
    addCommunityComment,
    fetchComments,
    
    // Refresh functions
    refreshAll,
    refreshCategories: loadCategories,
    refreshFeatured: loadFeaturedItems,
    refreshRecent: loadRecentItems
  };
}

export default useCommunityItems;
