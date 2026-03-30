/**
 * Community Spells Tab
 * 
 * This component provides access to community-created spells stored in Firebase.
 * Users can browse spells by category, search, and download spells to their local library.
 */

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useCommunitySpells } from '../../../../hooks/useCommunitySpells';
import { useSpellLibrary, useSpellLibraryDispatch, libraryActionCreators } from '../../context/SpellLibraryContext';
import useAuthStore from '../../../../store/authStore';
import UnifiedSpellCard from '../common/UnifiedSpellCard';
import SpellTooltip from '../common/SpellTooltip';
import SpellContextMenu from './SpellContextMenu';
import '../../../../styles/community-tabs-shared.css';
import '../../styles/pathfinder/main.css';
import './CommunitySpellsTab.css';

const CommunitySpellsTab = () => {
  const { user } = useAuthStore();
  const library = useSpellLibrary();
  const {
    spells,
    featuredSpells,
    mySpells,
    favoriteSpells,
    loading,
    error,
    searchTerm,
    sortBy,
    hasMore,
    userVotes,
    userFavorites,
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
    loadFavoriteStatuses
  } = useCommunitySpells();
  
  const [activeSection, setActiveSection] = useState('browse'); // 'browse', 'mySpells', 'favorites'

  const libraryDispatch = useSpellLibraryDispatch();
  const [searchInput, setSearchInput] = useState('');
  const [downloadingSpells, setDownloadingSpells] = useState(new Set());
  const [votingSpells, setVotingSpells] = useState(new Set());
  const [favoritingSpells, setFavoritingSpells] = useState(new Set());
  const [contextMenu, setContextMenu] = useState(null);

  // Load user's spells when component mounts and user is logged in
  useEffect(() => {
    if (user?.uid) {
      loadMySpells(user.uid);
    }
  }, [user?.uid, loadMySpells]);

  // Load user votes and favorites when spells change
  useEffect(() => {
    if (user?.uid) {
      if (spells.length > 0) {
        loadUserVotes(spells.map(s => s.id), user.uid);
        loadFavoriteStatuses(spells.map(s => s.id), user.uid);
      }
      if (featuredSpells.length > 0) {
        loadUserVotes(featuredSpells.map(s => s.id), user.uid);
        loadFavoriteStatuses(featuredSpells.map(s => s.id), user.uid);
      }
      if (mySpells.length > 0) {
        loadUserVotes(mySpells.map(s => s.id), user.uid);
      }
      if (favoriteSpells.length > 0) {
        loadUserVotes(favoriteSpells.map(s => s.id), user.uid);
      }
    }
  }, [user?.uid, spells, featuredSpells, mySpells, favoriteSpells, loadUserVotes, loadFavoriteStatuses]);
  
  // Load user favorites when component mounts
  useEffect(() => {
    if (user?.uid) {
      loadUserFavorites(user.uid);
    }
  }, [user?.uid, loadUserFavorites]);

  // Tooltip state
  const [hoveredSpell, setHoveredSpell] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      search(searchInput.trim());
    }
  };

  // Tooltip handlers
  const handleMouseEnter = (spell, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.right + 10,
      y: rect.top
    });
    setHoveredSpell(spell);
  };

  const handleMouseMove = (e) => {
    if (hoveredSpell) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.right + 10,
        y: rect.top
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredSpell(null);
  };

  const handleDownloadSpell = async (spell) => {
    try {
      setDownloadingSpells(prev => new Set([...prev, spell.id]));
      
      // Download from Firebase (increments download count)
      const downloadedSpell = await downloadCommunitySpell(spell.id);
      
      // Add to local library
      const localSpell = {
        ...downloadedSpell,
        id: `community-${downloadedSpell.id}-${Date.now()}`, // Ensure unique local ID
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        source: 'community',
        originalId: downloadedSpell.id
      };
      
      libraryDispatch(libraryActionCreators.addSpell(localSpell));
      
      alert(`Successfully downloaded "${spell.name}" to your spell library!`);
    } catch (err) {
      alert(`Failed to download spell: ${err.message}`);
    } finally {
      setDownloadingSpells(prev => {
        const newSet = new Set(prev);
        newSet.delete(spell.id);
        return newSet;
      });
    }
  };

  // Handle adding spell to collection (downloads first if not already in library)
  const handleAddToCollection = async (spellId, collectionId) => {
    // First, check if spell is already in library
    let spell = library.spells.find(s => s.id === spellId || s.originalId === spellId);
    
    // If not in library, download it first
    if (!spell) {
      try {
        setDownloadingSpells(prev => new Set([...prev, spellId]));
        
        // Download from Firebase
        const downloadedSpell = await downloadCommunitySpell(spellId);
        
        // Add to local library
        const localSpell = {
          ...downloadedSpell,
          id: `community-${downloadedSpell.id}-${Date.now()}`,
          dateCreated: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          source: 'community',
          originalId: downloadedSpell.id
        };
        
        libraryDispatch(libraryActionCreators.addSpell(localSpell));
        spell = localSpell;
        
        setDownloadingSpells(prev => {
          const newSet = new Set(prev);
          newSet.delete(spellId);
          return newSet;
        });
      } catch (err) {
        alert(`Failed to download spell: ${err.message}`);
        setDownloadingSpells(prev => {
          const newSet = new Set(prev);
          newSet.delete(spellId);
          return newSet;
        });
        return;
      }
    }
    
    // Now add to collection
    libraryDispatch(libraryActionCreators.addSpellToCollection(spell.id, collectionId));
    alert(`Added "${spell.name}" to collection!`);
  };

  // Handle right-click on spell card
  const handleSpellContextMenu = (e, spell) => {
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      spellId: spell.id,
      spell: spell
    });
  };

  const handleVote = async (spell, voteType) => {
    if (!user?.uid) {
      alert('Please log in to vote on spells.');
      return;
    }

    try {
      setVotingSpells(prev => new Set([...prev, spell.id]));
      await voteCommunitySpell(spell.id, user.uid, voteType);
    } catch (err) {
      alert(`Failed to vote: ${err.message}`);
    } finally {
      setVotingSpells(prev => {
        const newSet = new Set(prev);
        newSet.delete(spell.id);
        return newSet;
      });
    }
  };

  const getUserVoteForSpell = (spellId) => {
    return userVotes[spellId] || null;
  };

  const isSpellFavoritedByUser = (spellId) => {
    return userFavorites.has(spellId);
  };

  const handleFavorite = async (spell, isFavorite) => {
    if (!user?.uid) {
      alert('Please log in to favorite spells.');
      return;
    }

    try {
      setFavoritingSpells(prev => new Set([...prev, spell.id]));
      await favoriteCommunitySpell(spell.id, user.uid, isFavorite);
    } catch (err) {
      alert(`Failed to ${isFavorite ? 'favorite' : 'unfavorite'} spell: ${err.message}`);
    } finally {
      setFavoritingSpells(prev => {
        const newSet = new Set(prev);
        newSet.delete(spell.id);
        return newSet;
      });
    }
  };

  const renderSpellCard = (spell) => {
    // Ensure complete spell data structure for proper tooltip display
    const completeSpell = {
      ...spell,
      // Add community-specific metadata
      downloadCount: spell.downloadCount || 0,
      rating: spell.rating || 0,
      ratingCount: spell.ratingCount || 0,
      source: 'community'
    };

    return (
      <div
        key={spell.id}
        className="community-card-wrapper community-spell-card-wrapper"
        onMouseEnter={(e) => handleMouseEnter(completeSpell, e)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onContextMenu={(e) => handleSpellContextMenu(e, spell)}
        onMouseDown={(e) => { if (e.button === 2) handleSpellContextMenu(e, spell); }}
      >
        <UnifiedSpellCard
          spell={completeSpell}
          variant="library"
          showActions={false}
          showDescription={true}
          showStats={true}
          showTags={true}
        />
        <div className="community-card-actions community-spell-actions">
          <div className="community-card-stats spell-stats">
            <span className="download-count">
              <i className="fas fa-download"></i> {spell.downloadCount || 0}
            </span>
            <span className="rating">
              <i className="fas fa-star"></i> {spell.rating?.toFixed(1) || '0.0'} ({spell.ratingCount || 0})
            </span>
            {spell.upvotes !== undefined && spell.downvotes !== undefined && (
              <span className="vote-count">
                <i className="fas fa-thumbs-up"></i> {spell.upvotes || 0} / 
                <i className="fas fa-thumbs-down"></i> {spell.downvotes || 0}
              </span>
            )}
          </div>
          <div className="community-card-interactions">
            {/* Voting buttons */}
            {user?.uid && (
              <div className="vote-buttons">
                <button
                  className={`vote-btn upvote ${getUserVoteForSpell(spell.id) === 1 ? 'active' : ''}`}
                  onClick={() => handleVote(spell, 'upvote')}
                  disabled={votingSpells.has(spell.id)}
                  title="Upvote this spell"
                >
                  <i className="fas fa-thumbs-up"></i>
                </button>
                <button
                  className={`vote-btn downvote ${getUserVoteForSpell(spell.id) === -1 ? 'active' : ''}`}
                  onClick={() => handleVote(spell, 'downvote')}
                  disabled={votingSpells.has(spell.id)}
                  title="Downvote this spell"
                >
                  <i className="fas fa-thumbs-down"></i>
                </button>
              </div>
            )}
            <button
              className="community-download-btn download-spell-btn"
              onClick={() => handleDownloadSpell(spell)}
              disabled={downloadingSpells.has(spell.id)}
            >
              {downloadingSpells.has(spell.id) ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Downloading...
                </>
              ) : (
                <>
                  <i className="fas fa-download"></i> Download
                </>
              )}
            </button>
            {/* Favorite button */}
            {user?.uid && (
              <button
                className={`favorite-btn ${isSpellFavoritedByUser(spell.id) ? 'active' : ''}`}
                onClick={() => handleFavorite(spell, !isSpellFavoritedByUser(spell.id))}
                disabled={favoritingSpells.has(spell.id)}
                title={isSpellFavoritedByUser(spell.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                {favoritingSpells.has(spell.id) ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : isSpellFavoritedByUser(spell.id) ? (
                  <i className="fas fa-star"></i>
                ) : (
                  <i className="far fa-star"></i>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="community-spells-container">
      {/* Header */}
      <div className="community-header">
        <h2 className="community-title">Community Spells</h2>
        <p className="community-subtitle">
          Discover and download spells created by the community
        </p>
        
        {/* Section Tabs */}
        {user?.uid && (
          <div className="community-section-tabs">
            <button
              className={`section-tab ${activeSection === 'browse' ? 'active' : ''}`}
              onClick={() => setActiveSection('browse')}
            >
              <i className="fas fa-compass"></i> Browse Community
            </button>
            <button
              className={`section-tab ${activeSection === 'favorites' ? 'active' : ''}`}
              onClick={() => {
                setActiveSection('favorites');
                if (user?.uid) {
                  loadUserFavorites(user.uid);
                }
              }}
            >
              <i className="fas fa-star"></i> Favorites ({favoriteSpells.length})
            </button>
            <button
              className={`section-tab ${activeSection === 'mySpells' ? 'active' : ''}`}
              onClick={() => {
                setActiveSection('mySpells');
                if (user?.uid) {
                  loadMySpells(user.uid);
                }
              }}
            >
              <i className="fas fa-book"></i> My Shared Spells ({mySpells.length})
            </button>
          </div>
        )}
      </div>

      {/* Search Bar and Sort */}
      <div className="community-tab-search-section community-search">
        <form onSubmit={handleSearch} className="community-tab-search-form search-form">
          <div className="community-tab-search-input-group">
            <input
              type="text"
              placeholder="Search community spells..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="community-tab-search-input search-input"
            />
            <button type="submit" className="community-tab-search-btn search-btn">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </form>
        <div className="sort-controls">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => changeSortBy(e.target.value)}
            className="sort-select"
            disabled={!!searchTerm}
          >
            <option value="rating">Rating</option>
            <option value="downloads">Downloads</option>
            <option value="newest">Newest</option>
          </select>
        </div>
        {(searchTerm) && (
          <button onClick={clearSelection} className="community-tab-clear-btn clear-search-btn" title="Clear search/filter">
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="community-error-state">
          <div className="error-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h3>Unable to Connect to Community</h3>
          <p>
            We're having trouble connecting to the community spell database.
            This might be due to network issues or the service being temporarily unavailable.
          </p>
          <p className="error-details">
            <strong>Don't worry!</strong> You can still use the spell wizard to create your own spells,
            and they'll be saved to your local library.
          </p>
          <div className="error-actions">
            <button
              onClick={() => window.location.reload()}
              className="retry-btn"
            >
              <i className="fas fa-redo"></i> Try Again
            </button>
          </div>
        </div>
      )}


      {/* Favorites Section */}
      {activeSection === 'favorites' && user?.uid && (
        <div className="my-spells-section">
          <div className="section-header">
            <h3>Favorite Spells</h3>
            <p className="section-subtitle">
              Spells you've favorited from the community
            </p>
          </div>
          
          {loading && favoriteSpells.length === 0 ? (
            <div className="loading-state">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading favorites...</p>
            </div>
          ) : favoriteSpells.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-star"></i>
              <p>You haven't favorited any spells yet.</p>
              <p className="empty-state-hint">
                Browse the community spells and click the star icon to favorite spells you like!
              </p>
            </div>
          ) : (
            <div className="spells-grid">
              {favoriteSpells
                .sort((a, b) => {
                  const ratingA = a.rating || 0;
                  const ratingB = b.rating || 0;
                  if (ratingA !== ratingB) return ratingB - ratingA;
                  return (b.downloadCount || 0) - (a.downloadCount || 0);
                })
                .map(renderSpellCard)}
            </div>
          )}
        </div>
      )}

      {/* My Spells Section */}
      {activeSection === 'mySpells' && user?.uid && (
        <div className="my-spells-section">
          <div className="section-header">
            <h3>My Shared Spells</h3>
            <p className="section-subtitle">
              Spells you've shared with the community
            </p>
          </div>
          
          {loading && mySpells.length === 0 ? (
            <div className="loading-state">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading your spells...</p>
            </div>
          ) : mySpells.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-scroll"></i>
              <p>You haven't shared any spells yet.</p>
              <p className="empty-state-hint">
                Right-click on a custom spell in your Spell Library and select "Share with Community" to share it!
              </p>
            </div>
          ) : (
            <div className="spells-grid">
              {mySpells
                .sort((a, b) => {
                  // Sort by rating (highest first), then by download count
                  const ratingA = a.rating || 0;
                  const ratingB = b.rating || 0;
                  if (ratingA !== ratingB) return ratingB - ratingA;
                  return (b.downloadCount || 0) - (a.downloadCount || 0);
                })
                .map(renderSpellCard)}
            </div>
          )}
        </div>
      )}

      {/* Browse Community Section */}
      {activeSection === 'browse' && (
        <>
          {/* Featured Spells */}
          {!searchTerm && featuredSpells.length > 0 && (
            <div className="featured-spells">
              <h3>Featured Spells</h3>
              <div className="spells-grid">
                {featuredSpells
                  .sort((a, b) => {
                    // Sort by rating (highest first), then by download count
                    const ratingA = a.rating || 0;
                    const ratingB = b.rating || 0;
                    if (ratingA !== ratingB) return ratingB - ratingA;
                    return (b.downloadCount || 0) - (a.downloadCount || 0);
                  })
                  .map(renderSpellCard)}
              </div>
            </div>
          )}

          {/* All Community Spells */}
          <div className="spell-results">
            <div className="results-header">
              <h3>
                {searchTerm 
                  ? `Search Results for "${searchTerm}"`
                  : 'All Community Spells'
                }
              </h3>
              <span className="results-count">{spells.length} spells</span>
            </div>

              {loading && spells.length === 0 ? (
                <div className="loading-state">
                  <i className="fas fa-spinner fa-spin"></i>
                  <p>Loading spells...</p>
                </div>
              ) : spells.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-search"></i>
                  <p>No spells found</p>
                </div>
              ) : (
                <>
                  <div className="spells-grid">
                    {spells
                      .sort((a, b) => {
                        // Sort by rating (highest first), then by download count
                        const ratingA = a.rating || 0;
                        const ratingB = b.rating || 0;
                        if (ratingA !== ratingB) return ratingB - ratingA;
                        return (b.downloadCount || 0) - (a.downloadCount || 0);
                      })
                      .map(renderSpellCard)}
                  </div>
                  
                  {hasMore && (
                    <div className="load-more">
                      <button 
                        onClick={loadMoreSpells} 
                        disabled={loading}
                        className="load-more-btn"
                      >
                        {loading ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i> Loading...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-chevron-down"></i> Load More
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
          </div>
        </>
      )}

      {/* Error State */}
      {error && (
        <div className="error-state">
          <i className="fas fa-exclamation-triangle"></i>
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {/* Offline State */}
      {!navigator.onLine && (
        <div className="offline-state">
          <i className="fas fa-wifi"></i>
          <p>You're offline. Community spells require an internet connection.</p>
        </div>
      )}

      {/* Tooltip Portal */}
      {hoveredSpell && ReactDOM.createPortal(
        <SpellTooltip
          spell={hoveredSpell}
          position={tooltipPosition}
          onMouseEnter={() => {
            // Keep tooltip visible when hovering over it
            setHoveredSpell(hoveredSpell);
          }}
          onMouseLeave={() => {
            // Hide tooltip when leaving it
            setHoveredSpell(null);
          }}
        />,
        document.body
      )}

      {/* Context Menu */}
      {contextMenu && ReactDOM.createPortal(
        <SpellContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          spell={contextMenu.spell || { id: contextMenu.spellId, name: 'Unknown Spell' }}
          onClose={() => setContextMenu(null)}
          collections={library.categories || []}
          inCollection={false}
          isCustomSpell={false}
          onAddToCollection={(spellId, collectionId) => {
            handleAddToCollection(contextMenu.spellId, collectionId);
            setContextMenu(null);
          }}
          onDownload={contextMenu.spell ? () => {
            handleDownloadSpell(contextMenu.spell);
            setContextMenu(null);
          } : null}
        />,
        document.body
      )}

    </div>
  );
};

export default CommunitySpellsTab;
