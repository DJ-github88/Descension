/**
 * Community Spells Tab
 * 
 * This component provides access to community-created spells stored in Firebase.
 * Users can browse spells by category, search, and download spells to their local library.
 */

import React, { useState } from 'react';
import { useCommunitySpells } from '../../../../hooks/useCommunitySpells';
import { useSpellLibraryDispatch, libraryActionCreators } from '../../context/SpellLibraryContext';
import UnifiedSpellCard from '../common/UnifiedSpellCard';
import '../../styles/pathfinder/main.css';
import './CommunitySpellsTab.css';

const CommunitySpellsTab = () => {
  const {
    categories,
    spells,
    featuredSpells,
    loading,
    error,
    selectedCategory,
    searchTerm,
    hasMore,
    selectCategory,
    search,
    clearSelection,
    loadMoreSpells,
    downloadCommunitySpell
  } = useCommunitySpells();

  const libraryDispatch = useSpellLibraryDispatch();
  const [searchInput, setSearchInput] = useState('');
  const [downloadingSpells, setDownloadingSpells] = useState(new Set());

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      search(searchInput.trim());
    }
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

  const renderSpellCard = (spell) => (
    <div key={spell.id} className="community-spell-card-wrapper">
      <UnifiedSpellCard
        spell={spell}
        variant="library"
        showActions={false}
        showDescription={true}
        showStats={true}
        showTags={true}
      />
      <div className="community-spell-actions">
        <div className="spell-stats">
          <span className="download-count">
            <i className="fas fa-download"></i> {spell.downloadCount || 0}
          </span>
          <span className="rating">
            <i className="fas fa-star"></i> {spell.rating || 0} ({spell.ratingCount || 0})
          </span>
        </div>
        <button
          className="download-spell-btn"
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
      </div>
    </div>
  );

  return (
    <div className="community-spells-container">
      {/* Header */}
      <div className="community-header">
        <h2 className="community-title">Community Spells</h2>
        <p className="community-subtitle">
          Discover and download spells created by the community
        </p>
      </div>

      {/* Search Bar */}
      <div className="community-search">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search community spells..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            <i className="fas fa-search"></i>
          </button>
        </form>
        {(selectedCategory || searchTerm) && (
          <button onClick={clearSelection} className="clear-search-btn">
            <i className="fas fa-times"></i> Clear
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

      {/* Categories */}
      {!selectedCategory && !searchTerm && (
        <div className="community-categories">
          <h3>Browse by Category</h3>
          <div className="categories-grid">
            {categories.map(category => (
              <div
                key={category.id}
                className="category-card"
                onClick={() => selectCategory(category.id)}
                style={{
                  '--category-color': category.color,
                  borderColor: category.color
                }}
              >
                <div className="category-icon">
                  <i className={`wow-icon ${category.icon}`}></i>
                </div>
                <h4>{category.name}</h4>
                <p>{category.description}</p>
                {category.spellCount !== undefined && (
                  <div className="category-spell-count">
                    <i className="fas fa-scroll"></i>
                    {category.spellCount} spells
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Spells */}
      {!selectedCategory && !searchTerm && featuredSpells.length > 0 && (
        <div className="featured-spells">
          <h3>Featured Spells</h3>
          <div className="spells-grid">
            {featuredSpells.map(renderSpellCard)}
          </div>
        </div>
      )}

      {/* Spell Results */}
      {(selectedCategory || searchTerm) && (
        <div className="spell-results">
          <div className="results-header">
            <h3>
              {selectedCategory 
                ? `${categories.find(c => c.id === selectedCategory)?.name || 'Category'} Spells`
                : `Search Results for "${searchTerm}"`
              }
            </h3>
            <span className="results-count">{spells.length} spells found</span>
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
                {spells.map(renderSpellCard)}
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
  );
};

export default CommunitySpellsTab;
