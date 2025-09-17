/**
 * Community Creatures Tab
 * 
 * This component provides access to community-created creatures stored in Firebase.
 * Users can browse creatures by category, search, and download creatures to their local library.
 */

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useCommunityCreatures } from '../../../../hooks/useCommunityCreatures';
import { useCreatureLibraryDispatch, libraryActionCreators } from '../../context/CreatureLibraryContext';
import useCreatureStore from '../../../../store/creatureStore';
import CompactCreatureCard from '../common/CompactCreatureCard';
import SimpleCreatureTooltip from '../common/SimpleCreatureTooltip';
import '../../../../styles/community-tabs-shared.css';
import './CommunityCreaturesTab.css';

const CommunityCreaturesTab = () => {
  const {
    categories,
    creatures,
    featuredCreatures,
    loading,
    error,
    selectedCategory,
    searchTerm,
    hasMore,
    selectCategory,
    search,
    clearSelection,
    loadMoreCreatures,
    downloadCommunityCreature
  } = useCommunityCreatures();

  const libraryDispatch = useCreatureLibraryDispatch();
  const creatureStore = useCreatureStore();
  const [searchInput, setSearchInput] = useState('');
  const [downloadingCreatures, setDownloadingCreatures] = useState(new Set());

  // Tooltip state
  const [hoveredCreature, setHoveredCreature] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      search(searchInput.trim());
    }
  };

  // Tooltip handlers
  const handleMouseEnter = (creature, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.right + 10,
      y: rect.top
    });
    setHoveredCreature(creature);
  };

  const handleMouseMove = (e) => {
    if (hoveredCreature) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.right + 10,
        y: rect.top
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredCreature(null);
  };

  const handleDownloadCreature = async (creature) => {
    try {
      setDownloadingCreatures(prev => new Set([...prev, creature.id]));
      
      // Download from Firebase (increments download count)
      const downloadedCreature = await downloadCommunityCreature(creature.id);
      
      // Add to local library
      const localCreature = {
        ...downloadedCreature.creatureData,
        id: `community-${downloadedCreature.id}-${Date.now()}`, // Ensure unique local ID
        name: downloadedCreature.name,
        description: downloadedCreature.description,
        type: downloadedCreature.type,
        size: downloadedCreature.size,
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        source: 'community',
        originalId: downloadedCreature.id,
        categoryIds: [downloadedCreature.categoryId]
      };

      // Add to creature store first to ensure immediate availability for token placement
      creatureStore.addCreature(localCreature);

      // Add to creature library using the context
      libraryDispatch(libraryActionCreators.addCreature(localCreature));

      console.log('Creature downloaded and added to library:', localCreature.name);
    } catch (error) {
      console.error('Failed to download creature:', error);
    } finally {
      setDownloadingCreatures(prev => {
        const newSet = new Set(prev);
        newSet.delete(creature.id);
        return newSet;
      });
    }
  };

  const renderCreatureCard = (creature) => {
    // Ensure complete creature data structure for proper tooltip display
    const completeCreature = {
      ...creature.creatureData,
      name: creature.name,
      description: creature.description,
      type: creature.type,
      size: creature.size,
      // Add community-specific metadata
      downloadCount: creature.downloadCount || 0,
      rating: creature.rating || 0,
      ratingCount: creature.ratingCount || 0,
      source: 'community'
    };

    return (
      <div
        key={creature.id}
        className="community-creature-card-wrapper"
        onMouseEnter={(e) => handleMouseEnter(completeCreature, e)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <CompactCreatureCard creature={completeCreature} />
        <div className="community-creature-actions">
          <div className="creature-stats">
            <span className="download-count">
              <i className="fas fa-download"></i> {creature.downloadCount || 0}
            </span>
            <span className="rating">
              <i className="fas fa-star"></i> {creature.rating || 0} ({creature.ratingCount || 0})
            </span>
          </div>
          <button
            className="download-creature-btn"
            onClick={() => handleDownloadCreature(creature)}
            disabled={downloadingCreatures.has(creature.id)}
          >
            {downloadingCreatures.has(creature.id) ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Downloading...
              </>
            ) : (
              <>
                <i className="fas fa-download"></i> Add to Library
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="community-creatures-tab">
      {/* Search Bar */}
      <div className="community-tab-search-section community-search-section">
        <form onSubmit={handleSearch} className="community-tab-search-form search-form">
          <div className="community-tab-search-input-group search-input-group">
            <input
              type="text"
              placeholder="Search community creatures..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="community-tab-search-input search-input"
            />
            <button type="submit" className="community-tab-search-btn search-btn">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </form>

        {(selectedCategory || searchTerm) && (
          <button onClick={clearSelection} className="community-tab-clear-btn clear-selection-btn">
            <i className="fas fa-times"></i> Clear Selection
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && creatures.length === 0 && (
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading creatures...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="community-error-state">
          <div className="error-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h3>Unable to Connect to Community</h3>
          <p>
            We're having trouble connecting to the community creature database.
            This might be due to network issues or the service being temporarily unavailable.
          </p>
          <p className="error-details">
            <strong>Don't worry!</strong> You can still use the creature wizard to create your own creatures,
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
                  '--category-color': category.color
                }}
              >
                <div className="category-icon">
                  <img
                    src={`https://wow.zamimg.com/images/wow/icons/large/${category.icon}.jpg`}
                    alt={category.name}
                    onError={(e) => {
                      e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                    }}
                  />
                </div>
                <h4>{category.name}</h4>
                <p>{category.description}</p>
                {category.creatureCount !== undefined && (
                  <div className="category-creature-count">
                    <i className="fas fa-dragon"></i>
                    {category.creatureCount} creatures
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Creatures */}
      {!selectedCategory && !searchTerm && featuredCreatures.length > 0 && (
        <div className="featured-creatures">
          <h3>Featured Creatures</h3>
          <div className="creatures-grid">
            {featuredCreatures.map(renderCreatureCard)}
          </div>
        </div>
      )}

      {/* Creature Results */}
      {(selectedCategory || searchTerm) && (
        <div className="creature-results">
          <div className="results-header">
            <h3>
              {selectedCategory 
                ? `${categories.find(c => c.id === selectedCategory)?.name || 'Category'} Creatures`
                : `Search Results for "${searchTerm}"`
              }
            </h3>
            <span className="results-count">{creatures.length} creatures found</span>
          </div>

          {loading && creatures.length === 0 ? (
            <div className="loading-state">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading creatures...</p>
            </div>
          ) : creatures.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-search"></i>
              <p>No creatures found</p>
            </div>
          ) : (
            <>
              <div className="creatures-grid">
                {creatures.map(renderCreatureCard)}
              </div>
              
              {hasMore && (
                <div className="load-more">
                  <button 
                    onClick={loadMoreCreatures} 
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

      {/* Tooltip Portal */}
      {hoveredCreature && ReactDOM.createPortal(
        <div
          className="creature-card-hover-preview-portal"
          style={{
            position: 'fixed',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            zIndex: 2147483647 // Maximum z-index to ensure tooltips always appear above windows
          }}
          onWheel={(e) => {
            // Stop propagation to prevent background scrolling when scrolling tooltip
            e.stopPropagation();
          }}
          onMouseEnter={() => {
            // Keep tooltip visible when hovering over it
            setHoveredCreature(hoveredCreature);
          }}
          onMouseLeave={() => {
            // Hide tooltip when leaving it
            setHoveredCreature(null);
          }}
        >
          <SimpleCreatureTooltip creature={hoveredCreature} />
        </div>,
        document.body
      )}
    </div>
  );
};

export default CommunityCreaturesTab;
