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
import { getCustomIconUrl } from '../../../../utils/assetManager';
import { mapSpellIcon } from '../common/spellFormatterUtils';
import SpellTooltip from '../common/SpellTooltip';
import SpellContextMenu from './SpellContextMenu';
import '../../../../styles/community-tabs-shared.css';
import '../../styles/pathfinder/main.css';
import './CommunitySpellsTab.css';

const CATEGORIES = [
  { id: 'all', name: 'All Spells', icon: 'fa-book-open' },
  { id: 'damage', name: 'Damage', icon: 'fa-fire' },
  { id: 'healing', name: 'Healing', icon: 'fa-heart' },
  { id: 'control', name: 'Control', icon: 'fa-hand-sparkles' },
  { id: 'utility', name: 'Utility', icon: 'fa-tools' },
  { id: 'summoning', name: 'Summoning', icon: 'fa-paw' }
];

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
  const [selectedCategory, setSelectedCategory] = useState('all');

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
    const completeSpell = {
      ...spell,
      downloadCount: spell.downloadCount || 0,
      rating: spell.rating || 0,
      ratingCount: spell.ratingCount || 0,
      source: 'community'
    };

    // Resolve spell icon (same logic as SpellLibrary)
    const iconId = spell?.typeConfig?.icon || spell?.icon || spell?.damageConfig?.icon || spell?.healingConfig?.icon || null;
    let iconUrl;
    if (!iconId) {
      iconUrl = getCustomIconUrl('Utility/Utility', 'abilities');
    } else if (typeof iconId === 'string' && iconId.startsWith('/assets/')) {
      iconUrl = iconId;
    } else if (iconId.includes('/') && !iconId.startsWith('http')) {
      iconUrl = getCustomIconUrl(iconId, 'abilities');
    } else if (iconId.startsWith('inv_') || iconId.startsWith('spell_') || iconId.startsWith('ability_')) {
      const mapped = mapSpellIcon(iconId);
      iconUrl = mapped ? getCustomIconUrl(mapped, 'abilities') : getCustomIconUrl('Utility/Utility', 'abilities');
    } else {
      iconUrl = getCustomIconUrl(iconId, 'abilities');
    }

    // School color class
    const school = (spell?.typeConfig?.school || spell?.school || spell?.damageTypes?.[0] || spell?.elementType || '').toLowerCase();
    const schoolClassMap = {
      ember: 'spell-ember', fire: 'spell-ember',
      rime: 'spell-rime', frost: 'spell-rime', cold: 'spell-rime', ice: 'spell-rime',
      storm: 'spell-storm', lightning: 'spell-storm', thunder: 'spell-storm',
      arcane: 'spell-arcane',
      primal: 'spell-primal', nature: 'spell-primal',
      blight: 'spell-blight', shadow: 'spell-blight', necrotic: 'spell-blight',
      wyrd: 'spell-wyrd', psychic: 'spell-wyrd', chaos: 'spell-wyrd',
      sacred: 'spell-sacred', divine: 'spell-sacred',
    };
    const schoolClass = schoolClassMap[school] || '';
    const schoolLabel = school ? school.charAt(0).toUpperCase() + school.slice(1) : '';

    // Spell type label (ACTION, REACTION, etc.)
    const spellType = spell.spellType || spell.actionType || 'Action';

    // Tags (damage types, etc.)
    const tags = spell.tags || [];

    return (
      <div
        key={spell.id}
        className={`community-spell-row ${schoolClass}`}
        onMouseEnter={(e) => handleMouseEnter(completeSpell, e)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onContextMenu={(e) => handleSpellContextMenu(e, spell)}
        onMouseDown={(e) => { if (e.button === 2) handleSpellContextMenu(e, spell); }}
      >
        {/* Main content row: icon + info + type badge */}
        <div className="community-spell-row-main">
          <div className="community-spell-row-icon">
            <img
              src={iconUrl}
              alt={spell.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
              }}
            />
          </div>
          <div className="community-spell-row-info">
            <div className="community-spell-row-name-row">
              <span className="community-spell-row-name">{spell.name}</span>
              {schoolLabel && (
                <span className={`community-spell-row-school ${schoolClass}`}>{schoolLabel}</span>
              )}
            </div>
            <div className="community-spell-row-meta">
              {spell.level !== undefined && <span className="community-spell-row-level">Level {spell.level}</span>}
              {spell.castingTime && <span className="community-spell-row-cast">{spell.castingTime}</span>}
              {spell.range && <span className="community-spell-row-range">{spell.range}</span>}
            </div>
            {spell.description && (
              <p className="community-spell-row-desc">{spell.description}</p>
            )}
            {tags.length > 0 && (
              <div className="community-spell-row-tags">
                {tags.map((tag, i) => (
                  <span key={i} className="community-spell-row-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
          <span className="community-spell-row-type">{spellType}</span>
        </div>

        {/* Action bar: votes + stats + download + favorite */}
        <div className="community-spell-row-actions">
          {user?.uid && (
            <div className="community-spell-row-votes">
              <button
                className={`vote-btn upvote ${getUserVoteForSpell(spell.id) === 1 ? 'active' : ''}`}
                onClick={() => handleVote(spell, 'upvote')}
                disabled={votingSpells.has(spell.id)}
                title="Upvote"
              >
                <i className="fas fa-thumbs-up"></i>
              </button>
              <button
                className={`vote-btn downvote ${getUserVoteForSpell(spell.id) === -1 ? 'active' : ''}`}
                onClick={() => handleVote(spell, 'downvote')}
                disabled={votingSpells.has(spell.id)}
                title="Downvote"
              >
                <i className="fas fa-thumbs-down"></i>
              </button>
            </div>
          )}
          <div className="community-spell-row-stats">
            <span className="community-spell-row-rating">
              <i className="fas fa-star"></i> {spell.rating?.toFixed(1) || '0.0'} <span className="community-spell-row-rating-count">({spell.ratingCount || 0})</span>
            </span>
            <span className="community-spell-row-downloads">
              <i className="fas fa-download"></i> {spell.downloadCount || 0}
            </span>
          </div>
          <div className="community-spell-row-btns">
            <button
              className="community-download-btn"
              onClick={() => handleDownloadSpell(spell)}
              disabled={downloadingSpells.has(spell.id)}
            >
              {downloadingSpells.has(spell.id) ? (
                <><i className="fas fa-spinner fa-spin"></i> Downloading...</>
              ) : (
                <><i className="fas fa-download"></i> Download</>
              )}
            </button>
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

  const filteredSpells = spells.filter(spell => {
    if (selectedCategory === 'all') return true;
    return spell.categoryId?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const filteredFeaturedSpells = featuredSpells.filter(spell => {
    if (selectedCategory === 'all') return true;
    return spell.categoryId?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const filteredFavoriteSpells = favoriteSpells.filter(spell => {
    if (selectedCategory === 'all') return true;
    return spell.categoryId?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const filteredMySpells = mySpells.filter(spell => {
    if (selectedCategory === 'all') return true;
    return spell.categoryId?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="community-spells-tab">
      {/* Top Controls Bar */}
      <div className="premium-community-controls">
        <div className="community-section-tabs">
          <button
            className={`section-tab ${activeSection === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveSection('browse')}
          >
            <i className="fas fa-compass"></i> Browse
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
            <i className="fas fa-star"></i> Favorites {user?.uid ? `(${favoriteSpells.length})` : ''}
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
            <i className="fas fa-book"></i> My Spells {user?.uid ? `(${mySpells.length})` : ''}
          </button>
        </div>

        <form onSubmit={handleSearch} className="premium-search-form">
          <div className="premium-search-input-group">
            <i className="fas fa-search search-field-icon"></i>
            <input
              type="text"
              placeholder="Search community spells..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="premium-search-input"
            />
            {searchInput && (
              <button 
                type="button" 
                className="search-clear-inline" 
                onClick={() => { setSearchInput(''); search(''); }}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </form>

        <div className="sort-controls">
          <label>Sort:</label>
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

        {(searchTerm || selectedCategory !== 'all') && (
          <button 
            onClick={() => {
              clearSelection();
              setSearchInput('');
              setSelectedCategory('all');
            }} 
            className="premium-clear-btn" 
            title="Clear search/filter"
          >
            <i className="fas fa-times-circle"></i> Clear
          </button>
        )}
      </div>

      {/* Content */}
      <div className="community-content">
        {/* Mini Header */}
        <div className="community-minimal-header">
          <div className="minimal-header-content">
            <h1>Community Spells</h1>
            <div className="header-stats">
              <span className="header-stat"><i className="fas fa-scroll"></i> {spells.length} spells</span>
              <span className="header-stat"><i className="fas fa-star"></i> {featuredSpells.length} featured</span>
            </div>
          </div>
        </div>

        {/* Category Chips Section */}
        <div className="spell-categories-section">
          <div className="section-header">
            <i className="fas fa-filter"></i>
            <h3>Filter by School</h3>
          </div>
          <div className="community-category-chips">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <i className={`fas ${cat.icon}`}></i> {cat.name}
              </button>
            ))}
          </div>
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
        {activeSection === 'favorites' && (
          !user?.uid ? (
            <div className="community-auth-prompt">
              <div className="prompt-icon">
                <i className="fas fa-scroll fa-3x"></i>
              </div>
              <h3>Guild Registry Required</h3>
              <p>
                Sign in to your character account to bookmark spells from the community archives and sync them across the realm.
              </p>
            </div>
          ) : (
            <div className="my-spells-section">
              <div className="section-header">
                <h3>Favorite Spells</h3>
                <p className="section-subtitle">
                  Spells you've favorited from the community
                </p>
              </div>
              
              {loading && filteredFavoriteSpells.length === 0 ? (
                <div className="loading-state">
                  <i className="fas fa-spinner fa-spin"></i>
                  <p>Loading favorites...</p>
                </div>
              ) : filteredFavoriteSpells.length === 0 ? (
                <div className="empty-state empty-state-enhanced">
                  <div className="empty-state-icon-group">
                    <i className="fas fa-star"></i>
                  </div>
                  <h4 className="empty-state-title">No Favorites Yet</h4>
                  <p className="empty-state-message">
                    {favoriteSpells.length === 0 
                      ? "Browse community spells and click the star icon to save your favorites here."
                      : "Try changing your magic school filters."}
                  </p>
                </div>
              ) : (
                <div className="spells-grid">
                  {filteredFavoriteSpells
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
          )
        )}

        {/* My Spells Section */}
        {activeSection === 'mySpells' && (
          !user?.uid ? (
            <div className="community-auth-prompt">
              <div className="prompt-icon">
                <i className="fas fa-quill-pen fa-3x"></i>
              </div>
              <h3>Archmage Credentials Needed</h3>
              <p>
                Sign in to document and publish your custom-crafted spells to the great community library.
              </p>
            </div>
          ) : (
            <div className="my-spells-section">
              <div className="section-header">
                <h3>My Shared Spells</h3>
                <p className="section-subtitle">
                  Spells you've shared with the community
                </p>
              </div>
              
              {loading && filteredMySpells.length === 0 ? (
                <div className="loading-state">
                  <i className="fas fa-spinner fa-spin"></i>
                  <p>Loading your spells...</p>
                </div>
              ) : filteredMySpells.length === 0 ? (
                <div className="empty-state empty-state-enhanced">
                  <div className="empty-state-icon-group">
                    <i className="fas fa-scroll"></i>
                  </div>
                  <h4 className="empty-state-title">No Shared Spells</h4>
                  <p className="empty-state-message">
                    {mySpells.length === 0
                      ? "Right-click on a custom spell in your Spell Library and select 'Share with Community' to contribute to the archives."
                      : "Try changing your magic school filters."}
                  </p>
                </div>
              ) : (
                <div className="spells-grid">
                  {filteredMySpells
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
          )
        )}

        {/* Browse Community Section */}
        {activeSection === 'browse' && (
          <>
            {/* Featured Spells */}
            {!searchTerm && filteredFeaturedSpells.length > 0 && (
              <div className="featured-spells-section">
                <div className="section-header">
                  <i className="fas fa-star"></i>
                  <h3>Featured Spells</h3>
                  <span className="section-subtitle">Curated by the community</span>
                </div>
                <div className="spells-grid">
                  {filteredFeaturedSpells
                    .sort((a, b) => {
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
            <div className="spell-results-section">
              <div className="results-header">
                <h3>
                  {searchTerm 
                    ? `Search Results for "${searchTerm}"`
                    : 'All Community Spells'
                  }
                </h3>
                <span className="results-count">{filteredSpells.length} spells</span>
              </div>

              {loading && filteredSpells.length === 0 ? (
                <div className="loading-state">
                  <i className="fas fa-spinner fa-spin"></i>
                  <p>Loading spells...</p>
                </div>
              ) : filteredSpells.length === 0 ? (
                <div className="empty-state empty-state-enhanced">
                  <div className="empty-state-icon-group">
                    <div className="arcane-loading-circle"></div>
                    <i className="fas fa-scroll"></i>
                  </div>
                  <h4 className="empty-state-title">The Arcane Archives Await</h4>
                  <p className="empty-state-message">No community spells have been shared yet. Be the first to contribute to the guild's collection!</p>
                  <p className="empty-state-hint">Create a spell in the Spell Wizard and share it with the community.</p>
                </div>
              ) : (
                <>
                  <div className="spells-grid">
                    {filteredSpells
                      .sort((a, b) => {
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
                        className="load-more-btn animate-pulse"
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
      </div>

      {/* Tooltip Portal */}
      {hoveredSpell && ReactDOM.createPortal(
        <SpellTooltip
          spell={hoveredSpell}
          position={tooltipPosition}
          onMouseEnter={() => {
            setHoveredSpell(hoveredSpell);
          }}
          onMouseLeave={() => {
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
