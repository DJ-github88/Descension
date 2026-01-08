/**
 * Community Creatures Tab
 * 
 * This component provides access to community-created creatures stored in Firebase.
 * Users can browse creatures by category, search, and download creatures to their local library.
 */

import React, { useState, useRef, useEffect } from 'react';
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
    sortBy,
    hasMore,
    selectCategory,
    search,
    clearSelection,
    changeSortBy,
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
  const tooltipRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      search(searchInput.trim());
    }
  };

  // Close tooltip when clicking outside (same as library section)
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close tooltip if clicking outside the tooltip and creature card
      if (hoveredCreature) {
        const tooltipElement = document.querySelector('.creature-card-hover-preview-portal');
        const creatureCard = event.target.closest('.community-creature-card-wrapper');
        
        // Don't close if clicking on the tooltip itself or a creature card
        if (!tooltipElement?.contains(event.target) && !creatureCard) {
          setHoveredCreature(null);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [hoveredCreature]);

  // Tooltip handlers - click-based (same as library section)
  const handleCreatureClick = (creature, event) => {
    event.stopPropagation(); // Prevent document click handler from interfering
    
    // Toggle tooltip on click
    if (hoveredCreature?.id === creature.id) {
      // If clicking the same creature, close the tooltip
      setHoveredCreature(null);
    } else {
      // Show tooltip for clicked creature
      window.lastTooltipEvent = event; // Store for position recalculation
      setHoveredCreature(creature);
      updateTooltipPosition(event);
    }
  };

  const handleMouseMove = (e) => {
    if (hoveredCreature) {
      window.lastTooltipEvent = e; // Store for position recalculation
      updateTooltipPosition(e);
    }
  };

  // Update tooltip position - position at mouse cursor (same as library section)
  const updateTooltipPosition = (event) => {
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Tooltip dimensions
    const tooltipWidth = 380;
    const tooltipHeight = 450;
    const padding = 20; // Padding from edges

    // Check if creature icon selector is open
    const iconSelectorModal = document.querySelector('.creature-icon-selector-modal');

    if (iconSelectorModal) {
      // Position tooltip below the icon selector modal
      const modalRect = iconSelectorModal.getBoundingClientRect();
      const x = Math.max(padding, Math.min(event.clientX, viewportWidth - tooltipWidth - padding));
      const y = modalRect.bottom + 15; // 15px below the modal

      // Ensure tooltip doesn't go off bottom of screen
      const finalY = Math.min(y, viewportHeight - tooltipHeight - padding);

      setTooltipPosition({ x, y: finalY });
      return;
    }

    // Position tooltip at mouse cursor with offset
    const offsetX = 15; // Horizontal offset from cursor
    const offsetY = -10; // Vertical offset from cursor (above cursor)
    const margin = 10; // Minimum margin from screen edges

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Calculate initial position relative to mouse cursor
    let x = mouseX + offsetX;
    let y = mouseY + offsetY;

    // Adjust horizontal position if tooltip would go off screen
    if (x + tooltipWidth > viewportWidth - margin) {
      // Position to the left of cursor
      x = mouseX - tooltipWidth - offsetX;

      // If still off screen on the left, clamp to margin
      if (x < margin) {
        x = margin;
      }
    }

    // Adjust vertical position if tooltip would go off screen
    if (y + tooltipHeight > viewportHeight - margin) {
      // Position above cursor
      y = mouseY - tooltipHeight - Math.abs(offsetY);

      // If still off screen at the top, clamp to margin
      if (y < margin) {
        y = margin;
      }
    }

    // Ensure minimum Y position
    if (y < margin) {
      y = margin;
    }

    // Final safety check - ensure tooltip is always within viewport
    x = Math.max(margin, Math.min(x, viewportWidth - tooltipWidth - margin));
    y = Math.max(margin, Math.min(y, viewportHeight - tooltipHeight - margin));

    setTooltipPosition({ x, y });
  };

  const handleMouseLeave = (creature) => {
    // Close tooltip immediately when leaving the card
    if (hoveredCreature?.id === creature.id) {
      setHoveredCreature(null);
    }
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
    // Merge creatureData with top-level properties to ensure all fields are available
    const completeCreature = {
      ...creature.creatureData,
      // Override with top-level properties if they exist (they take precedence)
      id: creature.id || creature.creatureData?.id, // Include ID for comparison
      name: creature.name || creature.creatureData?.name,
      description: creature.description || creature.creatureData?.description,
      type: creature.type || creature.creatureData?.type,
      size: creature.size || creature.creatureData?.size,
      // Ensure all nested properties are included
      stats: creature.creatureData?.stats || creature.stats || {},
      resistances: creature.creatureData?.resistances || creature.resistances || {},
      vulnerabilities: creature.creatureData?.vulnerabilities || creature.vulnerabilities || {},
      abilities: creature.creatureData?.abilities || creature.abilities || [],
      lootTable: creature.creatureData?.lootTable || creature.lootTable || {
        currency: { gold: { min: 0, max: 0 }, silver: { min: 0, max: 0 }, copper: { min: 0, max: 0 } },
        items: []
      },
      tokenIcon: creature.creatureData?.tokenIcon || creature.tokenIcon,
      tokenBorder: creature.creatureData?.tokenBorder || creature.tokenBorder,
      tags: creature.creatureData?.tags || creature.tags || [],
      isShopkeeper: creature.creatureData?.isShopkeeper || creature.isShopkeeper || false,
      shopInventory: creature.creatureData?.shopInventory || creature.shopInventory,
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
        onClick={(e) => {
          // Don't trigger if clicking the download button
          if (!e.target.closest('.download-creature-btn')) {
            handleCreatureClick(completeCreature, e);
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => handleMouseLeave(completeCreature)}
      >
        <CompactCreatureCard creature={completeCreature} />
        <div className="community-creature-actions">
          <div className="creature-stats">
            <span className="download-count">
              <i className="fas fa-download"></i> {creature.downloadCount || 0}
            </span>
            <span className="rating">
              <i className="fas fa-star"></i> {(creature.rating || 0).toFixed(1)} ({creature.ratingCount || 0})
            </span>
          </div>
          <button
            className="download-creature-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadCreature(creature);
            }}
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
    <div className="community-creatures-container">
      {/* Header */}
      <div className="community-header">
        <h2 className="community-title">Community Creatures</h2>
        <p className="community-subtitle">
          Discover and download creatures created by the community
        </p>
      </div>

      {/* Search Bar and Sort */}
      <div className="community-tab-search-section community-search">
        <form onSubmit={handleSearch} className="community-tab-search-form search-form">
          <div className="community-tab-search-input-group">
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
        <div className="sort-controls">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => changeSortBy(e.target.value)}
            className="sort-select"
            disabled={!!searchTerm || !!selectedCategory}
          >
            <option value="rating">Rating</option>
            <option value="downloads">Downloads</option>
            <option value="newest">Newest</option>
          </select>
        </div>
        {(searchTerm || selectedCategory) && (
          <button onClick={clearSelection} className="community-tab-clear-btn clear-search-btn" title="Clear search/filter">
            <i className="fas fa-times"></i>
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

      {/* Browse Community Section */}
      {!selectedCategory && !searchTerm && (
        <>
          {/* Categories */}
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

          {/* Featured Creatures */}
          {featuredCreatures.length > 0 && (
            <div className="featured-creatures">
              <h3>Featured Creatures</h3>
              <div className="creatures-grid">
                {featuredCreatures.map(renderCreatureCard)}
              </div>
            </div>
          )}

          {/* All Community Creatures */}
          <div className="creature-results">
            <div className="results-header">
              <h3>All Community Creatures</h3>
              <span className="results-count">{creatures.length} creatures</span>
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
                  {creatures
                    .sort((a, b) => {
                      // Sort by rating (highest first), then by download count
                      const ratingA = a.rating || 0;
                      const ratingB = b.rating || 0;
                      if (ratingA !== ratingB) return ratingB - ratingA;
                      return (b.downloadCount || 0) - (a.downloadCount || 0);
                    })
                    .map(renderCreatureCard)}
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
        </>
      )}

      {/* Search/Category Results */}
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
        >
          <div
            ref={tooltipRef}
            className="creature-card-hover-preview-interactive"
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
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CommunityCreaturesTab;
