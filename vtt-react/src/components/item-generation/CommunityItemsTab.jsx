/**
 * Community Items Tab
 * 
 * This component provides access to community-created items stored in Firebase.
 * Users can browse items by category, search, and download items to their local library.
 */

import React, { useState } from 'react';
import { useCommunityItems } from '../../hooks/useCommunityItems';
import useItemStore from '../../store/itemStore';
import ItemCard from './ItemCard';
import '../../styles/community-tabs-shared.css';
import './CommunityItemsTab.css';

const CommunityItemsTab = () => {
  const {
    categories,
    items,
    featuredItems,
    loading,
    error,
    selectedCategory,
    searchTerm,
    hasMore,
    selectCategory,
    search,
    clearSelection,
    loadMoreItems,
    downloadCommunityItem
  } = useCommunityItems();

  const { addItem } = useItemStore();
  const [searchInput, setSearchInput] = useState('');
  const [downloadingItems, setDownloadingItems] = useState(new Set());

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      search(searchInput.trim());
    }
  };

  const handleDownloadItem = async (item) => {
    try {
      setDownloadingItems(prev => new Set([...prev, item.id]));
      
      // Download from Firebase (increments download count)
      const downloadedItem = await downloadCommunityItem(item.id);
      
      // Add to local library
      const localItem = {
        ...downloadedItem.itemData,
        id: `community-${downloadedItem.id}-${Date.now()}`, // Ensure unique local ID
        name: downloadedItem.name,
        description: downloadedItem.description,
        type: downloadedItem.type,
        quality: downloadedItem.quality,
        source: 'community',
        originalId: downloadedItem.id,
        dateAdded: new Date().toISOString()
      };

      // Add to item store
      addItem(localItem, [downloadedItem.categoryId]);
      
      console.log('Item downloaded and added to library:', localItem.name);
    } catch (error) {
      console.error('Failed to download item:', error);
    } finally {
      setDownloadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const renderItemCard = (item) => {
    // Ensure complete item data structure for proper tooltip display
    const completeItem = {
      // Start with itemData if it exists
      ...(item.itemData || {}),
      // Override with community-specific data
      id: item.id,
      name: item.name,
      description: item.description,
      quality: item.quality || item.rarity || 'common',
      type: item.type,
      // Ensure required properties exist for tooltip
      iconId: item.itemData?.iconId || item.iconId,
      imageUrl: item.itemData?.imageUrl || item.imageUrl,
      baseStats: item.itemData?.baseStats || {},
      enchantments: item.itemData?.enchantments || [],
      requiredLevel: item.itemData?.requiredLevel || 0,
      // Properly format value for tooltip display
      value: item.itemData?.goldValue !== undefined ? {
        platinum: item.itemData.platinumValue || 0,
        gold: item.itemData.goldValue || 0,
        silver: item.itemData.silverValue || 0,
        copper: item.itemData.copperValue || 0
      } : (item.itemData?.value || 0),
      // Add community-specific metadata
      downloadCount: item.downloadCount || 0,
      rating: item.rating || 0,
      ratingCount: item.ratingCount || 0,
      source: 'community'
    };

    return (
      <div key={item.id} className="community-item-card-wrapper">
        <ItemCard
          item={completeItem}
          onClick={() => {}} // No selection in community view
          onContextMenu={() => {}} // No context menu in community view
          isSelected={false}
        />
        <div className="community-item-actions">
          <div className="item-stats">
            <span className="download-count">
              <i className="fas fa-download"></i> {item.downloadCount || 0}
            </span>
            <span className="rating">
              <i className="fas fa-star"></i> {item.rating || 0} ({item.ratingCount || 0})
            </span>
          </div>
          <button
            className="download-item-btn"
            onClick={() => handleDownloadItem(item)}
            disabled={downloadingItems.has(item.id)}
          >
            {downloadingItems.has(item.id) ? (
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
    <div className="community-items-tab">
      {/* Search Bar */}
      <div className="community-tab-search-section community-search-section">
        <form onSubmit={handleSearch} className="community-tab-search-form search-form">
          <div className="community-tab-search-input-group search-input-group">
            <input
              type="text"
              placeholder="Search community items..."
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

      <div className="community-content">
        {/* Loading State */}
        {loading && items.length === 0 && (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading items...</p>
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
            We're having trouble connecting to the community item database.
            This might be due to network issues or the service being temporarily unavailable.
          </p>
          <p className="error-details">
            <strong>Don't worry!</strong> You can still use the item designer to create your own items,
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
                {category.itemCount !== undefined && (
                  <div className="category-item-count">
                    <i className="fas fa-box"></i>
                    {category.itemCount} items
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Items */}
      {!selectedCategory && !searchTerm && featuredItems.length > 0 && (
        <div className="featured-items">
          <h3>Featured Items</h3>
          <div className="items-grid">
            {featuredItems.map(renderItemCard)}
          </div>
        </div>
      )}

      {/* Item Results */}
      {(selectedCategory || searchTerm) && (
        <div className="item-results">
          <div className="results-header">
            <h3>
              {selectedCategory 
                ? `${categories.find(c => c.id === selectedCategory)?.name || 'Category'} Items`
                : `Search Results for "${searchTerm}"`
              }
            </h3>
            <span className="results-count">{items.length} items found</span>
          </div>

          {loading && items.length === 0 ? (
            <div className="loading-state">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading items...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-search"></i>
              <p>No items found</p>
            </div>
          ) : (
            <>
              <div className="items-grid">
                {items.map(renderItemCard)}
              </div>
              
              {hasMore && (
                <div className="load-more">
                  <button 
                    onClick={loadMoreItems} 
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
      </div>
    </div>
  );
};

export default CommunityItemsTab;
