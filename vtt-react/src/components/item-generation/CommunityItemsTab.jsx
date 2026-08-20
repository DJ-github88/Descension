/**
 * Community Items Tab
 * 
 * Provides access to community-created items stored in Firebase.
 * Fully aligned with the Pathfinder grimoire UI system.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useCommunityItems } from '../../hooks/useCommunityItems';
import useItemStore from '../../store/itemStore';
import useAuthStore from '../../store/authStore';
import ItemCard from './ItemCard';
import { getIconUrl } from '../../utils/assetManager';
import { RARITY_COLORS } from '../../constants/itemConstants';
import './CommunityItemsTab.css';

const DEFAULT_ITEM_CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: 'weapons', name: 'Weapons' },
  { id: 'armor', name: 'Armor' },
  { id: 'consumables', name: 'Consumables' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'materials', name: 'Materials' },
  { id: 'tools', name: 'Tools' },
  { id: 'misc', name: 'Misc' }
];

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
    sortBy,
    hasMore,
    selectCategory,
    search,
    clearSelection,
    changeSortBy,
    loadMoreItems,
    downloadCommunityItem,
    voteCommunityItem,
    fetchUserVote,
    addCommunityComment,
    fetchComments,
    refreshAll
  } = useCommunityItems();

  const { addItem, items: localItems } = useItemStore();
  const { user } = useAuthStore();

  const [activeSection, setActiveSection] = useState('browse'); // 'browse', 'recent'
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'
  const [searchInput, setSearchInput] = useState('');
  const [downloadingItems, setDownloadingItems] = useState(new Set());
  const [expandedComments, setExpandedComments] = useState({});
  const [commentTexts, setCommentTexts] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [inspectingItem, setInspectingItem] = useState(null);
  const [toast, setToast] = useState(null);

  // Toast helper
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    const timer = setTimeout(() => setToast(null), duration);
    return () => clearTimeout(timer);
  }, []);

  // Check if item is in local library
  const isInLibrary = useCallback((item) => {
    if (!localItems || !item) return false;
    return localItems.some(i =>
      i.originalId === item.id ||
      i.id === item.id ||
      (i.name && item.name && i.name.trim().toLowerCase() === item.name.trim().toLowerCase())
    );
  }, [localItems]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      search(searchInput.trim());
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    search('');
  };

  const handleDownloadItem = async (item, e) => {
    if (e) e.stopPropagation();
    if (downloadingItems.has(item.id)) return;

    try {
      setDownloadingItems(prev => new Set([...prev, item.id]));
      const downloadedItem = await downloadCommunityItem(item.id);

      const localItem = {
        ...(downloadedItem.itemData || downloadedItem),
        id: `community-${downloadedItem.id}-${Date.now()}`,
        name: downloadedItem.name,
        description: downloadedItem.description,
        type: downloadedItem.type,
        quality: downloadedItem.quality || downloadedItem.rarity || 'common',
        source: 'community',
        originalId: downloadedItem.id,
        dateAdded: new Date().toISOString()
      };

      addItem(localItem, [downloadedItem.categoryId || 'weapons']);
      showToast(`Added "${item.name}" to your library!`, 'success');
    } catch (err) {
      console.error('Failed to download item:', err);
      showToast('Failed to download item. Please try again.', 'error');
    } finally {
      setDownloadingItems(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  const handleVote = async (item, direction, e) => {
    if (e) e.stopPropagation();
    if (!user?.uid) {
      showToast('Please log in to vote on community items.', 'error');
      return;
    }
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

  const toggleComments = async (itemId, e) => {
    if (e) e.stopPropagation();
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
    const displayName = user.displayName || user.email || 'Adventurer';
    try {
      const comment = await addCommunityComment(itemId, user.uid, displayName, commentTexts[itemId].trim());
      setExpandedComments(prev => ({
        ...prev,
        [itemId]: [comment, ...(prev[itemId] || [])]
      }));
      setCommentTexts(prev => ({ ...prev, [itemId]: '' }));
      showToast('Comment submitted!', 'success');
    } catch (err) {
      console.error('Comment failed:', err);
      showToast('Failed to submit comment.', 'error');
    }
  };

  const loadUserVote = async (itemId) => {
    if (!user?.uid) return;
    const vote = await fetchUserVote(itemId, user.uid);
    setUserVotes(prev => ({ ...prev, [itemId]: vote }));
  };

  const buildCompleteItem = useCallback((item) => {
    return {
      ...(item.itemData || {}),
      id: item.id,
      name: item.name || 'Unnamed Item',
      description: item.description || '',
      quality: item.quality || item.rarity || 'common',
      type: item.type || 'equipment',
      iconId: item.itemData?.iconId || item.iconId,
      imageUrl: item.itemData?.imageUrl || item.imageUrl,
      baseStats: item.itemData?.baseStats || item.baseStats || {},
      enchantments: item.itemData?.enchantments || item.enchantments || [],
      requiredLevel: item.itemData?.requiredLevel || 0,
      value: item.itemData?.goldValue !== undefined ? {
        platinum: item.itemData.platinumValue || 0,
        gold: item.itemData.goldValue || 0,
        silver: item.itemData.silverValue || 0,
        copper: item.itemData.copperValue || 0
      } : (item.itemData?.value || 0),
      downloadCount: item.downloadCount || 0,
      rating: item.rating || 0,
      ratingCount: item.ratingCount || 0,
      upvotes: item.upvotes || 0,
      downvotes: item.downvotes || 0,
      commentCount: item.commentCount || 0,
      source: 'community'
    };
  }, []);

  // Filter out featured items from general catalog to avoid duplicate cards
  const filteredCatalogItems = useMemo(() => {
    if (searchTerm || selectedCategory) {
      return items;
    }
    const featuredIds = new Set(featuredItems.map(i => i.id));
    return items.filter(i => !featuredIds.has(i.id));
  }, [items, featuredItems, searchTerm, selectedCategory]);

  const activeCategoryList = useMemo(() => {
    if (categories && categories.length > 0) {
      return [{ id: 'all', name: 'All Categories' }, ...categories];
    }
    return DEFAULT_ITEM_CATEGORIES;
  }, [categories]);

  const renderItemCard = (item) => {
    const completeItem = buildCompleteItem(item);
    const inLib = isInLibrary(item);
    const isDownloading = downloadingItems.has(item.id);
    const userVote = userVotes[item.id] || item._userVote || null;
    const voteScore = (item.upvotes || 0) - (item.downvotes || 0);

    const quality = (completeItem.quality || 'common').toLowerCase();
    const qualityColor = RARITY_COLORS[quality]?.text || '#4a2818';

    const iconUrl = completeItem.imageUrl || (completeItem.iconId ? getIconUrl(completeItem.iconId, 'items') : getIconUrl('inv_sword_04', 'items'));

    if (viewMode === 'grid') {
      return (
        <div
          key={item.id}
          className={`cit-card quality-${quality}`}
          onClick={() => setInspectingItem(completeItem)}
        >
          <div className="cit-card-topbar">
            <span className="cit-quality-badge" style={{ color: qualityColor, borderColor: `${qualityColor}40` }}>
              {quality}
            </span>
            <div className="cit-card-topbar-badges">
              {inLib && (
                <span className="cit-in-lib-badge" title="In Library">
                  <i className="fas fa-check"></i> Library
                </span>
              )}
              <span className="cit-type-badge">{completeItem.type}</span>
            </div>
          </div>

          <div className="cit-card-header">
            <div className="cit-card-icon-frame" style={{ borderColor: qualityColor }}>
              <img
                src={iconUrl}
                alt={item.name}
                className="cit-card-icon"
                onError={(e) => {
                  e.target.src = getIconUrl('inv_sword_04', 'items');
                }}
              />
            </div>
            <div className="cit-card-header-info">
              <h4 className="cit-card-title" title={item.name}>{item.name}</h4>
              <div className="cit-card-meta">
                <span>{completeItem.type}</span>
                {completeItem.requiredLevel > 0 && <span>Lvl {completeItem.requiredLevel}</span>}
              </div>
            </div>
          </div>

          {completeItem.description && (
            <p className="cit-card-description">{completeItem.description}</p>
          )}

          <div className="cit-card-footer">
            <div className="cit-card-votes">
              <button
                className={`cit-vote-btn up ${userVote === 'up' ? 'active' : ''}`}
                onClick={(e) => handleVote(item, 'up', e)}
                onMouseEnter={() => loadUserVote(item.id)}
                title={user?.uid ? 'Upvote' : 'Log in to vote'}
              >
                <i className="fas fa-arrow-up"></i>
              </button>
              <span className="cit-vote-score">{voteScore}</span>
              <button
                className={`cit-vote-btn down ${userVote === 'down' ? 'active' : ''}`}
                onClick={(e) => handleVote(item, 'down', e)}
                title={user?.uid ? 'Downvote' : 'Log in to vote'}
              >
                <i className="fas fa-arrow-down"></i>
              </button>
            </div>

            <div className="cit-card-stats">
              <span className="cit-stat-downloads" title="Downloads">
                <i className="fas fa-download"></i> {item.downloadCount || 0}
              </span>
              <button
                className="cit-comments-toggle"
                onClick={(e) => toggleComments(item.id, e)}
                title="View comments"
              >
                <i className="fas fa-comment"></i> {item.commentCount || 0}
              </button>
            </div>

            <div className="cit-card-actions">
              <button
                className={`cit-download-btn ${inLib ? 'in-library' : ''}`}
                onClick={(e) => handleDownloadItem(item, e)}
                disabled={isDownloading}
                title={inLib ? 'Already in your library' : 'Download item to library'}
              >
                {isDownloading ? (
                  <><i className="fas fa-spinner fa-spin"></i> ...</>
                ) : inLib ? (
                  <><i className="fas fa-check"></i> In Library</>
                ) : (
                  <><i className="fas fa-download"></i> Download</>
                )}
              </button>
            </div>
          </div>

          {/* Comments Section Drawer */}
          {expandedComments[item.id] && (
            <div className="cit-comments-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="cit-comments-list">
                {(expandedComments[item.id] || []).length === 0 ? (
                  <p className="cit-no-comments">No notes etched on this relic yet.</p>
                ) : (
                  expandedComments[item.id].map(c => (
                    <div key={c.id || Math.random()} className="cit-comment-item">
                      <span className="cit-comment-author">{c.displayName || 'Adventurer'}</span>
                      <span className="cit-comment-text">{c.text}</span>
                    </div>
                  ))
                )}
              </div>
              {user?.uid ? (
                <div className="cit-comment-input-wrap">
                  <input
                    type="text"
                    placeholder="Leave lore comment..."
                    value={commentTexts[item.id] || ''}
                    onChange={(e) => setCommentTexts(prev => ({ ...prev, [item.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(item.id)}
                    className="cit-comment-input"
                  />
                  <button onClick={() => handleAddComment(item.id)} className="cit-comment-send">
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              ) : (
                <p className="cit-login-note">Log in to leave comments</p>
              )}
            </div>
          )}
        </div>
      );
    }

    // List Row View
    return (
      <div
        key={item.id}
        className={`cit-row quality-${quality}`}
        onClick={() => setInspectingItem(completeItem)}
      >
        <div className="cit-row-main">
          <div className="cit-row-icon-frame" style={{ borderColor: qualityColor }}>
            <img
              src={iconUrl}
              alt={item.name}
              onError={(e) => {
                e.target.src = getIconUrl('inv_sword_04', 'items');
              }}
            />
          </div>
          <div className="cit-row-details">
            <div className="cit-row-title-line">
              <span className="cit-row-title">{item.name}</span>
              <span className="cit-quality-badge small" style={{ color: qualityColor }}>{quality}</span>
              <span className="cit-type-badge small">{completeItem.type}</span>
              {inLib && (
                <span className="cit-in-lib-badge small" title="In Library">
                  <i className="fas fa-check"></i>
                </span>
              )}
            </div>
            {completeItem.description && (
              <p className="cit-row-desc">{completeItem.description}</p>
            )}
          </div>
        </div>

        <div className="cit-row-controls">
          <div className="cit-row-stats">
            <span title="Score"><i className="fas fa-arrow-up" style={{ color: '#4caf50' }}></i> {voteScore}</span>
            <span title="Downloads"><i className="fas fa-download"></i> {item.downloadCount || 0}</span>
          </div>
          <button
            className={`cit-download-btn ${inLib ? 'in-library' : ''}`}
            onClick={(e) => handleDownloadItem(item, e)}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <><i className="fas fa-spinner fa-spin"></i> ...</>
            ) : inLib ? (
              <><i className="fas fa-check"></i> In Library</>
            ) : (
              <><i className="fas fa-download"></i> Download</>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="community-items-tab cit-root">
      {/* Toast Notification Banner */}
      {toast && (
        <div className={`cit-toast ${toast.type}`}>
          <i className={toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-info-circle'}></i>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Grimoire Toolbar */}
      <div className="cit-toolbar">
        {/* Left: View Tabs */}
        <div className="cit-toolbar-nav">
          <button
            type="button"
            className={`cit-nav-tab ${activeSection === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveSection('browse')}
          >
            <i className="fas fa-compass"></i>
            <span>Browse</span>
            <span className="cit-nav-badge">{items.length}</span>
          </button>
          <button
            type="button"
            className={`cit-nav-tab ${activeSection === 'recent' ? 'active' : ''}`}
            onClick={() => setActiveSection('recent')}
          >
            <i className="fas fa-sparkles"></i>
            <span>Recent</span>
            <span className="cit-nav-badge">{recentItems.length}</span>
          </button>
        </div>

        {/* Center: Search Bar */}
        <form onSubmit={handleSearch} className="cit-search-bar">
          <i className="fas fa-search cit-search-icon"></i>
          <input
            type="text"
            placeholder="Search community items by name, type, quality..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="cit-search-input"
          />
          {searchInput && (
            <button
              type="button"
              className="cit-search-clear"
              onClick={handleClearSearch}
              title="Clear search"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </form>

        {/* Right: Sort & View Toggle Controls */}
        <div className="cit-toolbar-controls">
          <div className="cit-sort-box">
            <span className="cit-control-label">SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => changeSortBy(e.target.value)}
              className="cit-sort-select"
              disabled={!!searchTerm}
            >
              <option value="rating">Highest Rated</option>
              <option value="downloads">Most Downloads</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          <div className="cit-view-toggle">
            <button
              type="button"
              className={`cit-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <i className="fas fa-th-large"></i>
            </button>
            <button
              type="button"
              className={`cit-view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <i className="fas fa-list"></i>
            </button>
          </div>

          {(selectedCategory || searchTerm) && (
            <button
              type="button"
              onClick={clearSelection}
              className="cit-reset-btn"
              title="Clear active filter/search"
            >
              <i className="fas fa-times-circle"></i> Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Sleek Category Filter Strip */}
      <div className="cit-filter-bar">
        <div className="cit-filter-row">
          <span className="cit-filter-heading">CATEGORY:</span>
          <div className="cit-chips-wrap">
            {activeCategoryList.map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`cit-chip ${(selectedCategory === cat.id || (!selectedCategory && cat.id === 'all')) ? 'active' : ''}`}
                onClick={() => {
                  if (cat.id === 'all') {
                    clearSelection();
                  } else {
                    selectCategory(cat.id);
                  }
                }}
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="cit-content-scroll">
        {loading && items.length === 0 ? (
          <div className="cit-state-box">
            <div className="cit-arcane-spinner"></div>
            <h3>Searching the Archives...</h3>
            <p>Gathering relics and treasures from the community vault.</p>
          </div>
        ) : error ? (
          <div className="cit-state-box error">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Vault Connection Severed</h3>
            <p>{error}</p>
            <button className="cit-action-btn" onClick={refreshAll}>
              <i className="fas fa-redo"></i> Retry Connection
            </button>
          </div>
        ) : (searchTerm || selectedCategory) ? (
          /* Filter / Search Results Section */
          <div className="cit-section">
            <div className="cit-section-header">
              <div className="cit-section-title-wrap">
                <i className="fas fa-search"></i>
                <h3 className="cit-section-title">
                  {selectedCategory
                    ? `${activeCategoryList.find(c => c.id === selectedCategory)?.name || 'Category'} Items`
                    : `Search Results for "${searchTerm}"`}
                </h3>
                <span className="cit-section-badge">{items.length} items</span>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="cit-state-box">
                <i className="fas fa-shield-alt"></i>
                <h4>No Items Found</h4>
                <p>No community items match your current query.</p>
                <button className="cit-action-btn" onClick={clearSelection}>
                  Clear Query
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'cit-grid' : 'cit-list'}>
                {items.map(renderItemCard)}
              </div>
            )}
          </div>
        ) : activeSection === 'recent' ? (
          /* Recent Discoveries Flow */
          <div className="cit-section">
            <div className="cit-section-header">
              <div className="cit-section-title-wrap">
                <i className="fas fa-sparkles gold-glow"></i>
                <h3 className="cit-section-title">Recent Discoveries</h3>
                <span className="cit-section-badge">{recentItems.length} items</span>
              </div>
            </div>

            {recentItems.length > 0 ? (
              <div className={viewMode === 'grid' ? 'cit-grid' : 'cit-list'}>
                {recentItems.map(renderItemCard)}
              </div>
            ) : (
              <div className="cit-state-box">
                <i className="fas fa-gem"></i>
                <h4>No Recent Discoveries</h4>
                <p>Be the first to forge and upload new relics to the community vault!</p>
              </div>
            )}
          </div>
        ) : (
          /* Browse Default Flow */
          <div className="cit-browse-flow">
            {/* Featured Items Section */}
            {featuredItems.length > 0 && (
              <div className="cit-section">
                <div className="cit-section-header">
                  <div className="cit-section-title-wrap">
                    <i className="fas fa-star gold-glow"></i>
                    <h3 className="cit-section-title">Featured Relics</h3>
                    <span className="cit-section-badge">{featuredItems.length} featured</span>
                  </div>
                  <span className="cit-section-note">Handcrafted legendary community creations</span>
                </div>
                <div className={viewMode === 'grid' ? 'cit-grid' : 'cit-list'}>
                  {featuredItems.map(renderItemCard)}
                </div>
              </div>
            )}

            {/* General Item Archives (Deduplicated) */}
            <div className="cit-section">
              <div className="cit-section-header">
                <div className="cit-section-title-wrap">
                  <i className="fas fa-box-open"></i>
                  <h3 className="cit-section-title">Item Archives</h3>
                  <span className="cit-section-badge">{filteredCatalogItems.length} items</span>
                </div>
              </div>

              {filteredCatalogItems.length > 0 ? (
                <div className={viewMode === 'grid' ? 'cit-grid' : 'cit-list'}>
                  {filteredCatalogItems.map(renderItemCard)}
                </div>
              ) : (
                <div className="cit-state-box">
                  <i className="fas fa-shield-alt"></i>
                  <h4>Vault Catalog Empty</h4>
                  <p>All featured relics are displayed above. Craft your own items in the Designer to expand the library!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !loading && !searchTerm && (
          <div className="cit-load-more-box">
            <button className="cit-load-more-btn" onClick={loadMoreItems}>
              <i className="fas fa-chevron-down"></i> Load More Items
            </button>
          </div>
        )}
      </div>

      {/* Inspect Item Detail Modal */}
      {inspectingItem && (
        <div className="cit-modal-backdrop" onClick={() => setInspectingItem(null)}>
          <div className="cit-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="cit-modal-header">
              <h3 className="cit-modal-title">{inspectingItem.name}</h3>
              <button className="cit-modal-close" onClick={() => setInspectingItem(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="cit-modal-body">
              <ItemCard
                item={inspectingItem}
                onClick={() => {}}
                onContextMenu={() => {}}
                isSelected={false}
              />
            </div>
            <div className="cit-modal-footer">
              <button className="cit-modal-cancel" onClick={() => setInspectingItem(null)}>
                Close
              </button>
              <button
                className={`cit-modal-download ${isInLibrary(inspectingItem) ? 'in-library' : ''}`}
                onClick={(e) => {
                  handleDownloadItem(inspectingItem, e);
                  setInspectingItem(null);
                }}
              >
                {isInLibrary(inspectingItem) ? (
                  <><i className="fas fa-check"></i> In Library</>
                ) : (
                  <><i className="fas fa-download"></i> Add to Library</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityItemsTab;
