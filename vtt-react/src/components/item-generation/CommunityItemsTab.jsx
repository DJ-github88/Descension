/**
 * Community Items Tab
 * 
 * This component provides access to community-created items stored in Firebase.
 * Users can browse items by category, search, and download items to their local library.
 */

import React, { useState } from 'react';
import { useCommunityItems } from '../../hooks/useCommunityItems';
import useItemStore from '../../store/itemStore';
import useAuthStore from '../../store/authStore';
import ItemCard from './ItemCard';
import { getIconUrl } from '../../utils/assetManager';


const CommunityItemsTab = () => {
  const {
    categories,
    items,
    featuredItems,
    recentItems,
    loading,
    error,
    selectedCategory,
    searchTerm,
    hasMore,
    selectCategory,
    search,
    clearSelection,
    loadMoreItems,
    downloadCommunityItem,
    voteCommunityItem,
    fetchUserVote,
    addCommunityComment,
    fetchComments,
    refreshCategories,
    refreshRecent
  } = useCommunityItems();

  const { addItem } = useItemStore();
  const { user } = useAuthStore();
  const [searchInput, setSearchInput] = useState('');
  const [downloadingItems, setDownloadingItems] = useState(new Set());
  const [expandedComments, setExpandedComments] = useState({});
  const [commentTexts, setCommentTexts] = useState({});
  const [userVotes, setUserVotes] = useState({});

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

  const handleVote = async (item, direction) => {
    if (!user?.uid) return;
    try {
      await voteCommunityItem(item.id, user.uid, direction);
      setUserVotes(prev => {
        const current = prev[item.id];
        if (current === direction) return { ...prev, [item.id]: null };
        return { ...prev, [item.id]: direction };
      });
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  const toggleComments = async (itemId) => {
    if (expandedComments[itemId]) {
      setExpandedComments(prev => ({ ...prev, [itemId]: null }));
      return;
    }
    let comments = [];
    const existing = items.find(i => i.id === itemId)?._comments || featuredItems.find(i => i.id === itemId)?._comments;
    if (!existing) {
      comments = await fetchComments(itemId);
    } else {
      comments = existing;
    }
    setExpandedComments(prev => ({ ...prev, [itemId]: comments }));
  };

  const handleAddComment = async (itemId) => {
    if (!user?.uid || !commentTexts[itemId]?.trim()) return;
    const displayName = user.displayName || user.email || 'Anonymous';
    try {
      const comment = await addCommunityComment(itemId, user.uid, displayName, commentTexts[itemId].trim());
      setExpandedComments(prev => ({
        ...prev,
        [itemId]: [comment, ...(prev[itemId] || [])]
      }));
      setCommentTexts(prev => ({ ...prev, [itemId]: '' }));
    } catch (err) {
      console.error('Comment failed:', err);
    }
  };

  const loadUserVote = async (itemId) => {
    if (!user?.uid) return;
    const vote = await fetchUserVote(itemId, user.uid);
    setUserVotes(prev => ({ ...prev, [itemId]: vote }));
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

    const userVote = userVotes[item.id] || item._userVote || null;

    return (
      <div key={item.id} className="community-item-card-wrapper">
        <ItemCard
          item={completeItem}
          onClick={() => {}}
          onContextMenu={() => {}}
          isSelected={false}
        />
        <div className="community-item-actions">
          <div className="item-stats">
            <div className="vote-controls">
              <button
                className={`vote-btn upvote ${userVote === 'up' ? 'active' : ''}`}
                onClick={() => handleVote(item, 'up')}
                onMouseEnter={() => loadUserVote(item.id)}
                disabled={!user?.uid}
                title={user?.uid ? 'Upvote' : 'Log in to vote'}
              >
                <i className="fas fa-arrow-up"></i>
              </button>
              <span className="vote-count">{(item.upvotes || 0) - (item.downvotes || 0)}</span>
              <button
                className={`vote-btn downvote ${userVote === 'down' ? 'active' : ''}`}
                onClick={() => handleVote(item, 'down')}
                disabled={!user?.uid}
                title={user?.uid ? 'Downvote' : 'Log in to vote'}
              >
                <i className="fas fa-arrow-down"></i>
              </button>
            </div>
            <span className="download-count">
              <i className="fas fa-download"></i> {item.downloadCount || 0}
            </span>
            <button
              className="comment-toggle-btn"
              onClick={() => toggleComments(item.id)}
              title="Comments"
            >
              <i className="fas fa-comment"></i> {item.commentCount || 0}
            </button>
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
        {expandedComments[item.id] && (
          <div className="comments-section">
            <div className="comments-list">
              {(expandedComments[item.id] || []).length === 0 ? (
                <p className="no-comments">No comments yet</p>
              ) : (
                expandedComments[item.id].map(c => (
                  <div key={c.id} className="comment-item">
                    <span className="comment-author">{c.displayName}</span>
                    <span className="comment-text">{c.text}</span>
                  </div>
                ))
              )}
            </div>
            {user?.uid ? (
              <div className="comment-input-row">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentTexts[item.id] || ''}
                  onChange={(e) => setCommentTexts(prev => ({ ...prev, [item.id]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment(item.id)}
                  className="comment-input"
                />
                <button onClick={() => handleAddComment(item.id)} className="comment-submit-btn">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            ) : (
              <p className="login-prompt">Log in to comment</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="community-items-tab">
      {/* Search Bar & Controls */}
      <div className="premium-community-controls">
        {selectedCategory && (
          <button onClick={clearSelection} className="community-go-back-btn">
            <i className="fas fa-arrow-left"></i> Back to Categories
          </button>
        )}
        
        <form onSubmit={handleSearch} className="premium-search-form">
          <div className="premium-search-input-group">
            <input
              type="text"
              placeholder="Search community items..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="premium-search-input"
            />
            <button type="submit" className="premium-search-btn">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </form>

        {searchTerm && (
          <button onClick={() => { clearSelection(); setSearchInput(''); }} className="premium-clear-btn">
            <i className="fas fa-times"></i> Clear Search
          </button>
        )}
      </div>

      <div className="community-content">
        {/* Simplified Header */}
        {!selectedCategory && !searchTerm && (
          <div className="community-minimal-header">
            <div className="minimal-header-content">
              <h1>Community Library</h1>
              <div className="header-stats">
                <div className="header-stat">
                  <i className="fas fa-box-open"></i>
                  <span>{categories.reduce((acc, cat) => acc + (cat.itemCount || 0), 0)} Items</span>
                </div>
                <div className="header-stat">
                  <i className="fas fa-layer-group"></i>
                  <span>{categories.length} Categories</span>
                </div>
                <button 
                  className="refresh-community-btn" 
                  onClick={() => {
                    refreshCategories();
                    refreshRecent();
                  }}
                  title="Refresh Community Data"
                >
                  <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Discoveries (NOW AT THE TOP) */}
        {!selectedCategory && !searchTerm && (
          <div className="recent-items-section top-section">
            <div className="section-header">
              <i className="fas fa-sparkles"></i>
              <h3>Recent Discoveries</h3>
            </div>
            {recentItems.length > 0 ? (
              <div className="items-grid horizontal-snap">
                {recentItems.map(renderItemCard)}
              </div>
            ) : !loading ? (
              <div className="no-items-placeholder">
                <i className="fas fa-ghost"></i>
                <p>No items shared yet. Be the first to grace this library!</p>
              </div>
            ) : (
              <div className="loading-placeholder">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Gazing into the void...</p>
              </div>
            )}
          </div>
        )}

        {/* Categories (SMALLER TILES) */}
        {!selectedCategory && !searchTerm && (
          <div className="community-categories browse-section">
            <div className="section-header">
              <i className="fas fa-th-large"></i>
              <h3>Browse by Category</h3>
            </div>
            <div className="categories-grid compact-grid">
              {categories.map(category => (
                <div
                  key={category.id}
                  className="category-tile"
                  onClick={() => selectCategory(category.id)}
                >
                  <div className="tile-icon">
                    <img
                      src={getIconUrl(category.icon, 'items')}
                      alt={category.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                      }}
                    />
                  </div>
                  <div className="tile-info">
                    <h4>{category.name}</h4>
                    <span className="tile-count">{category.itemCount || 0} items</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Featured Items */}
      {!selectedCategory && !searchTerm && featuredItems.length > 0 && (
        <div className="featured-items-section">
          <div className="section-header">
            <i className="fas fa-star"></i>
            <h3>Featured Items</h3>
          </div>
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
