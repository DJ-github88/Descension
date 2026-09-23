/**
 * Community Spells Hook
 * 
 * React hook for managing community spell data and operations.
 * Provides state management and caching for community spell interactions.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { tryAcquireCooldown } from '../utils/writeThrottle';
import {
  getAllCommunitySpells,
  searchSpells,
  getFeaturedSpells,
  downloadSpell,
  getUserSpells,
  voteSpell,
  getSpellVoteStatuses,
  favoriteSpell,
  getSpellFavoriteStatuses,
  getUserFavorites,
  seedTestSpell,
  cleanupDuplicateSpells,
  deduplicateSpellList
} from '../services/firebase/communitySpellService';

let spellsInitPromise = null;
function ensureSpellsInit(sortByValue) {
  if (!spellsInitPromise) {
    spellsInitPromise = (async () => {
      await cleanupDuplicateSpells();
      await seedTestSpell();
    })();
  }
  return spellsInitPromise;
}

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
  const lastDocRef = useRef(null);
  const [userVotes, setUserVotes] = useState({}); // Map of spellId -> vote
  const [userFavorites, setUserFavorites] = useState(new Set()); // Set of favorited spell IDs

  // Define all callback functions first
  const loadSpells = useCallback(async (sortByValue = sortBy, loadMore = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // One-time cleanup + seed (deduped via shared promise)
      if (!loadMore) await ensureSpellsInit(sortByValue);

      const docCursor = loadMore ? lastDocRef.current : null;
      const result = await getAllCommunitySpells(
        20,
        docCursor,
        sortByValue
      );
      
      lastDocRef.current = result.lastDoc;
      setHasMore(result.hasMore);

      if (loadMore) {
        setSpells(prev => deduplicateSpellList([...prev, ...result.spells]));
      } else {
        setSpells(deduplicateSpellList(result.spells));
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to load spells:', err);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  const loadFeaturedSpells = useCallback(async () => {
    try {
      const featured = await getFeaturedSpells(6);
      setFeaturedSpells(deduplicateSpellList(featured));
    } catch (err) {
      console.error('Failed to load featured spells:', err);
    }
  }, []);

  const performSearch = useCallback(async (term) => {
    try {
      setLoading(true);
      setError(null);
      const searchResults = await searchSpells(term);
      setSpells(deduplicateSpellList(searchResults));
      setHasMore(false);
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
    setHasMore(false);
  }, []);

  const clearSelection = useCallback(() => {
    setSearchTerm('');
    setHasMore(false);
    loadSpells();
  }, [loadSpells]);

  const changeSortBy = useCallback((newSortBy) => {
    setSortBy(newSortBy);
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
    // Cooldown: prevents double-click races on the read-modify-write vote
    // counters and stops vote spam from firing a query per click.
    if (!tryAcquireCooldown(`vote:${userId || 'anon'}`, 1500)) {
      return { blocked: true };
    }

    try {
      await voteSpell(spellId, userId, voteType);

      // Update local state instead of re-reading catalog + featured + my
      // spells (that was 46+ document reads per upvote).
      setUserVotes(prev => ({ ...prev, [spellId]: voteType === 'upvote' ? 1 : -1 }));

      const updateVoteCount = (list) => list.map(s => {
        if (s.id !== spellId) return s;
        const prevDir = s._userVote;
        let upvotes = s.upvotes || 0;
        let downvotes = s.downvotes || 0;
        const dir = voteType === 'upvote' ? 'up' : 'down';
        if (prevDir === dir) {
          if (dir === 'up') upvotes--; else downvotes--;
          return { ...s, upvotes, downvotes, _userVote: null };
        }
        if (prevDir === 'up') upvotes--;
        if (prevDir === 'down') downvotes--;
        if (dir === 'up') upvotes++; else downvotes++;
        return { ...s, upvotes, downvotes, _userVote: dir };
      });
      setSpells(prev => updateVoteCount(prev));
      setFeaturedSpells(prev => updateVoteCount(prev));
      setMySpells(prev => updateVoteCount(prev));
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Failed to vote on spell:', err);
      throw err;
    }
  }, []);

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
      // Batch `in` queries (30 ids each) instead of one getDoc per card.
      const statuses = await getSpellFavoriteStatuses(userId, spellIds);
      const favoriteIds = new Set(
        Object.entries(statuses).filter(([, isFav]) => isFav).map(([id]) => id)
      );
      setUserFavorites(favoriteIds);
    } catch (err) {
      console.error('Failed to load favorite statuses:', err);
    }
  }, []);

  const loadUserVotes = useCallback(async (spellIds, userId) => {
    if (!userId || !spellIds || spellIds.length === 0) return;

    try {
      // Batch `in` queries instead of one getDoc per card.
      const statuses = await getSpellVoteStatuses(userId, spellIds);
      const votes = {};
      Object.entries(statuses).forEach(([spellId, vote]) => {
        if (vote !== null && vote !== undefined) {
          votes[spellId] = vote;
        }
      });
      setUserVotes(votes);
    } catch (err) {
      console.error('Failed to load user votes:', err);
    }
  }, []);

  // Load spells on mount and when sort or search changes
  useEffect(() => {
    if (searchTerm) {
      performSearch(searchTerm);
    } else {
      loadFeaturedSpells();
      loadSpells(sortBy);
    }
  }, [sortBy, searchTerm, performSearch, loadFeaturedSpells, loadSpells]);

  const refreshAll = useCallback(async () => {
    loadFeaturedSpells();
    if (searchTerm) {
      performSearch(searchTerm);
    } else {
      loadSpells();
    }
  }, [loadFeaturedSpells, searchTerm, performSearch, loadSpells]);

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
    refreshFeatured: loadFeaturedSpells,
    refreshAll
  };
}
