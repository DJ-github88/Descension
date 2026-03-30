/**
 * Community Spells Hook
 * 
 * React hook for managing community spell data and operations.
 * Provides state management and caching for community spell interactions.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getAllCommunitySpells,
  searchSpells,
  getFeaturedSpells,
  downloadSpell,
  getUserSpells,
  voteSpell,
  getUserVote,
  favoriteSpell,
  isSpellFavorited,
  getUserFavorites
} from '../services/firebase/communitySpellService';

export function useCommunitySpells() {
  const [spells, setSpells] = useState([]);
  const [featuredSpells, setFeaturedSpells] = useState([]);
  const [mySpells, setMySpells] = useState([]);
  const [favoriteSpells, setFavoriteSpells] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'downloads', 'newest'
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [userVotes, setUserVotes] = useState({}); // Map of spellId -> vote
  const [userFavorites, setUserFavorites] = useState(new Set()); // Set of favorited spell IDs

  // Define all callback functions first
  const loadSpells = useCallback(async (sortByValue = sortBy, loadMore = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getAllCommunitySpells(
        20,
        loadMore ? lastDoc : null,
        sortByValue
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
  }, [sortBy, lastDoc]);


  const loadFeaturedSpells = useCallback(async () => {
    try {
      const featured = await getFeaturedSpells(6);
      setFeaturedSpells(featured);
    } catch (err) {
      console.error('Failed to load featured spells:', err);
    }
  }, []);



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
    if (hasMore && !loading && !searchTerm) {
      loadSpells(sortBy, true);
    }
  }, [hasMore, loading, searchTerm, sortBy, loadSpells]);

  const search = useCallback((term) => {
    setSearchTerm(term);
    setLastDoc(null);
    setHasMore(false);
  }, []);

  const clearSelection = useCallback(() => {
    setSearchTerm('');
    setLastDoc(null);
    setHasMore(false);
    loadSpells();
  }, [loadSpells]);

  const changeSortBy = useCallback((newSortBy) => {
    setSortBy(newSortBy);
    setLastDoc(null);
    setHasMore(false);
  }, []);


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


  const loadMySpells = useCallback(async (userId) => {
    try {
      if (!userId) {
        setMySpells([]);
        return;
      }

      setLoading(true);
      const userSpells = await getUserSpells(userId);
      setMySpells(userSpells);
    } catch (err) {
      console.error('Failed to load user spells:', err);
      setMySpells([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const voteCommunitySpell = useCallback(async (spellId, userId, voteType) => {
    try {
      await voteSpell(spellId, userId, voteType);
      
      // Update local state
      setUserVotes(prev => ({ ...prev, [spellId]: voteType === 'upvote' ? 1 : -1 }));
      
      // Refresh spell data to get updated rating
      if (searchTerm) {
        performSearch(searchTerm);
      } else {
        loadSpells(sortBy);
      }
      
      // Refresh featured and my spells
      loadFeaturedSpells();
      loadMySpells(userId);
    } catch (err) {
      setError(err.message);
      console.error('Failed to vote on spell:', err);
      throw err;
    }
  }, [searchTerm, sortBy, performSearch, loadSpells, loadFeaturedSpells, loadMySpells]);

  const favoriteCommunitySpell = useCallback(async (spellId, userId, isFavorite) => {
    try {
      await favoriteSpell(spellId, userId, isFavorite);
      
      // Update local state
      setUserFavorites(prev => {
        const newSet = new Set(prev);
        if (isFavorite) {
          newSet.add(spellId);
        } else {
          newSet.delete(spellId);
        }
        return newSet;
      });
      
      // Refresh favorites list
      if (isFavorite) {
        const favorites = await getUserFavorites(userId);
        setFavoriteSpells(favorites);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to favorite spell:', err);
      throw err;
    }
  }, []);

  const loadUserFavorites = useCallback(async (userId) => {
    try {
      if (!userId) {
        setFavoriteSpells([]);
        return;
      }

      const favorites = await getUserFavorites(userId);
      setFavoriteSpells(favorites);
      
      // Build set of favorited spell IDs
      const favoriteIds = new Set(favorites.map(s => s.id));
      setUserFavorites(favoriteIds);
    } catch (err) {
      console.error('Failed to load favorites:', err);
      setFavoriteSpells([]);
    }
  }, []);

  const loadFavoriteStatuses = useCallback(async (spellIds, userId) => {
    if (!userId || !spellIds || spellIds.length === 0) return;

    try {
      const favoriteIds = new Set();
      await Promise.all(
        spellIds.map(async (spellId) => {
          const isFav = await isSpellFavorited(spellId, userId);
          if (isFav) {
            favoriteIds.add(spellId);
          }
        })
      );
      setUserFavorites(favoriteIds);
    } catch (err) {
      console.error('Failed to load favorite statuses:', err);
    }
  }, []);

  const loadUserVotes = useCallback(async (spellIds, userId) => {
    if (!userId || !spellIds || spellIds.length === 0) return;

    try {
      const votes = {};
      await Promise.all(
        spellIds.map(async (spellId) => {
          const vote = await getUserVote(spellId, userId);
          if (vote !== null) {
            votes[spellId] = vote;
          }
        })
      );
      setUserVotes(votes);
    } catch (err) {
      console.error('Failed to load user votes:', err);
    }
  }, []);

  // Load spells on mount and when sort changes
  useEffect(() => {
    loadFeaturedSpells();
    if (!searchTerm) {
      loadSpells();
    }
  }, [sortBy]);

  // Load spells when search term changes
  useEffect(() => {
    if (searchTerm) {
      performSearch(searchTerm);
    } else {
      loadSpells();
    }
  }, [searchTerm]);

  return {
    // Data
    spells,
    featuredSpells,
    mySpells,
    favoriteSpells,
    
    // State
    loading,
    error,
    searchTerm,
    sortBy,
    hasMore,
    userVotes,
    userFavorites,
    
    // Actions
    search,
    clearSelection,
    changeSortBy,
    loadMoreSpells,
    downloadCommunitySpell,
    voteCommunitySpell,
    favoriteCommunitySpell,
    loadMySpells,
    loadUserVotes,
    loadUserFavorites,
    loadFavoriteStatuses,
    
    // Refresh functions
    refreshSpells: loadSpells,
    refreshFeatured: loadFeaturedSpells
  };
}
