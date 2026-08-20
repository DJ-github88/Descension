/**
 * Community Creatures Tab
 * 
 * Provides access to community-created creatures stored in Firebase.
 * Fully aligned with the Pathfinder grimoire UI system.
 */

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useCommunityCreatures } from '../../../../hooks/useCommunityCreatures';
import { useCreatureLibraryDispatch, libraryActionCreators } from '../../context/CreatureLibraryContext';
import useCreatureStore from '../../../../store/creatureStore';
import useAuthStore from '../../../../store/authStore';
import CompactCreatureCard from '../common/CompactCreatureCard';
import './CommunityCreaturesTab.css';

const DEFAULT_CREATURE_CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: 'beasts', name: 'Beasts' },
  { id: 'dragons', name: 'Dragons' },
  { id: 'elementals', name: 'Elementals' },
  { id: 'fiends', name: 'Fiends' },
  { id: 'humanoids', name: 'Humanoids' },
  { id: 'undead', name: 'Undead' },
  { id: 'monstrosities', name: 'Monstrosities' },
  { id: 'aberrations', name: 'Aberrations' },
  { id: 'celestials', name: 'Celestials' },
  { id: 'giants', name: 'Giants' },
  { id: 'plants', name: 'Plants' },
  { id: 'constructs', name: 'Constructs' }
];

const CommunityCreaturesTab = ({ refreshKey = 0 }) => {
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
    downloadCommunityCreature,
    rateCommunityCreature,
    refreshAll
  } = useCommunityCreatures();

  const libraryDispatch = useCreatureLibraryDispatch();
  const creatureStore = useCreatureStore();
  const { user } = useAuthStore();

  const [activeSection, setActiveSection] = useState('browse'); // 'browse', 'favorites', 'myCreatures'
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'
  const [searchInput, setSearchInput] = useState('');
  const [downloadingCreatures, setDownloadingCreatures] = useState(new Set());
  const [inspectingCreature, setInspectingCreature] = useState(null);
  const [toast, setToast] = useState(null);

  // Toast notification helper
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    const timer = setTimeout(() => setToast(null), duration);
    return () => clearTimeout(timer);
  }, []);

  // Check if creature is in local library
  const isInLibrary = useCallback((creature) => {
    if (!creatureStore?.creatures || !creature) return false;
    return creatureStore.creatures.some(c =>
      c.originalId === creature.id ||
      c.id === creature.id ||
      (c.name && creature.name && c.name.trim().toLowerCase() === creature.name.trim().toLowerCase())
    );
  }, [creatureStore?.creatures]);

  // Refresh when refreshKey changes
  useEffect(() => {
    if (refreshKey > 0 && refreshAll) {
      refreshAll();
    }
  }, [refreshKey, refreshAll]);

  // Listen for creatureShared custom event
  useEffect(() => {
    const handleCreatureShared = () => {
      if (refreshAll) {
        setTimeout(() => refreshAll(), 500);
      }
    };
    window.addEventListener('creatureShared', handleCreatureShared);
    return () => window.removeEventListener('creatureShared', handleCreatureShared);
  }, [refreshAll]);

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

  const handleDownloadCreature = async (creature, e) => {
    if (e) e.stopPropagation();
    if (downloadingCreatures.has(creature.id)) return;

    try {
      setDownloadingCreatures(prev => new Set([...prev, creature.id]));
      const downloadedCreature = await downloadCommunityCreature(creature.id);

      const localCreature = {
        ...(downloadedCreature.creatureData || downloadedCreature),
        id: `community-${downloadedCreature.id}-${Date.now()}`,
        name: downloadedCreature.name,
        description: downloadedCreature.description,
        type: downloadedCreature.type,
        size: downloadedCreature.size,
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        source: 'community',
        originalId: downloadedCreature.id,
        categoryIds: [downloadedCreature.categoryId || 'custom']
      };

      creatureStore.addCreature(localCreature);
      if (libraryDispatch) {
        libraryDispatch(libraryActionCreators.addCreature(localCreature));
      }

      showToast(`Added "${creature.name}" to your library!`, 'success');
    } catch (err) {
      console.error('Failed to download creature:', err);
      showToast('Failed to download creature. Please try again.', 'error');
    } finally {
      setDownloadingCreatures(prev => {
        const next = new Set(prev);
        next.delete(creature.id);
        return next;
      });
    }
  };

  // Build complete creature data object
  const buildCompleteCreature = useCallback((creature) => {
    return {
      ...(creature.creatureData || {}),
      id: creature.id || creature.creatureData?.id,
      name: creature.name || creature.creatureData?.name || 'Unnamed Creature',
      description: creature.description || creature.creatureData?.description || '',
      type: creature.type || creature.creatureData?.type || 'Humanoid',
      size: creature.size || creature.creatureData?.size || 'Medium',
      stats: creature.creatureData?.stats || creature.stats || { hp: 10, maxHp: 10, mana: 10, maxMana: 10, initiative: 0 },
      resistances: creature.creatureData?.resistances || creature.resistances || {},
      vulnerabilities: creature.creatureData?.vulnerabilities || creature.vulnerabilities || {},
      abilities: creature.creatureData?.abilities || creature.abilities || [],
      lootTable: creature.creatureData?.lootTable || creature.lootTable || { currency: { gold: { min: 0, max: 0 } }, items: [] },
      tokenIcon: creature.creatureData?.tokenIcon || creature.tokenIcon,
      tokenBorder: creature.creatureData?.tokenBorder || creature.tokenBorder,
      tags: creature.creatureData?.tags || creature.tags || [],
      downloadCount: creature.downloadCount || 0,
      rating: creature.rating || 0,
      ratingCount: creature.ratingCount || 0,
      source: 'community'
    };
  }, []);

  // Filter out featured creatures from catalog list in browse mode to avoid duplicates
  const filteredCatalogCreatures = useMemo(() => {
    if (searchTerm || selectedCategory) {
      return creatures;
    }
    const featuredIds = new Set(featuredCreatures.map(c => c.id));
    return creatures.filter(c => !featuredIds.has(c.id));
  }, [creatures, featuredCreatures, searchTerm, selectedCategory]);

  const activeCategoryList = useMemo(() => {
    if (categories && categories.length > 0) {
      return [{ id: 'all', name: 'All Categories' }, ...categories];
    }
    return DEFAULT_CREATURE_CATEGORIES;
  }, [categories]);

  const renderCreatureCard = (creature) => {
    const completeCreature = buildCompleteCreature(creature);
    const inLib = isInLibrary(creature);
    const isDownloading = downloadingCreatures.has(creature.id);

    const stats = completeCreature.stats || {};
    const hp = stats.hp !== undefined ? stats.hp : (stats.maxHp || 10);
    const mana = stats.mana !== undefined ? stats.mana : (stats.maxMana || 0);
    const init = stats.initiative !== undefined ? stats.initiative : 0;
    const initSign = init >= 0 ? `+${init}` : `${init}`;

    const iconUrl = completeCreature.tokenIcon || '/assets/icons/creatures/Monsters/Icon1.png';

    if (viewMode === 'grid') {
      return (
        <div
          key={creature.id}
          className="cct-card"
          onClick={() => setInspectingCreature(completeCreature)}
        >
          <div className="cct-card-topbar">
            <span className="cct-type-badge">{completeCreature.type || 'Creature'}</span>
            <div className="cct-card-topbar-badges">
              {inLib && (
                <span className="cct-in-lib-badge" title="In Library">
                  <i className="fas fa-check"></i> Library
                </span>
              )}
              <span className="cct-size-badge">{completeCreature.size || 'Medium'}</span>
            </div>
          </div>

          <div className="cct-card-header">
            <div className="cct-card-icon-frame">
              <img
                src={iconUrl}
                alt={creature.name}
                className="cct-card-icon"
                onError={(e) => {
                  e.target.src = "/assets/icons/creatures/Monsters/Icon1.png";
                }}
              />
            </div>
            <div className="cct-card-header-info">
              <h4 className="cct-card-title" title={creature.name}>{creature.name}</h4>
              <div className="cct-card-meta">
                <span>{completeCreature.size} {completeCreature.type}</span>
                {completeCreature.challengeRating !== undefined && (
                  <span>CR {completeCreature.challengeRating}</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Line */}
          <div className="cct-card-stats-strip">
            <div className="cct-stat-pill hp">
              <span className="cct-stat-label">HP</span>
              <span className="cct-stat-val">{hp}</span>
            </div>
            <div className="cct-stat-pill mana">
              <span className="cct-stat-label">MANA</span>
              <span className="cct-stat-val">{mana}</span>
            </div>
            <div className="cct-stat-pill init">
              <span className="cct-stat-label">INIT</span>
              <span className="cct-stat-val">{initSign}</span>
            </div>
          </div>

          {completeCreature.description && (
            <p className="cct-card-description">{completeCreature.description}</p>
          )}

          <div className="cct-card-footer">
            <div className="cct-card-stats">
              <span className="cct-stat-rating">
                <i className="fas fa-star"></i> {(creature.rating || 0).toFixed(1)}
              </span>
              <span className="cct-stat-downloads">
                <i className="fas fa-download"></i> {creature.downloadCount || 0}
              </span>
            </div>
            <div className="cct-card-actions">
              <button
                className={`cct-download-btn ${inLib ? 'in-library' : ''}`}
                onClick={(e) => handleDownloadCreature(creature, e)}
                disabled={isDownloading}
                title={inLib ? 'Already in your library' : 'Download creature to library'}
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
        </div>
      );
    }

    // List Row View
    return (
      <div
        key={creature.id}
        className="cct-row"
        onClick={() => setInspectingCreature(completeCreature)}
      >
        <div className="cct-row-main">
          <div className="cct-row-icon-frame">
            <img
              src={iconUrl}
              alt={creature.name}
              onError={(e) => {
                e.target.src = "/assets/icons/creatures/Monsters/Icon1.png";
              }}
            />
          </div>
          <div className="cct-row-details">
            <div className="cct-row-title-line">
              <span className="cct-row-title">{creature.name}</span>
              <span className="cct-type-badge small">{completeCreature.type}</span>
              <span className="cct-size-badge small">{completeCreature.size}</span>
              {inLib && (
                <span className="cct-in-lib-badge small" title="In Library">
                  <i className="fas fa-check"></i>
                </span>
              )}
            </div>
            <div className="cct-row-meta">
              <span>HP {hp}</span>
              <span>Mana {mana}</span>
              <span>Init {initSign}</span>
              {completeCreature.challengeRating !== undefined && <span>CR {completeCreature.challengeRating}</span>}
            </div>
            {completeCreature.description && (
              <p className="cct-row-desc">{completeCreature.description}</p>
            )}
          </div>
        </div>

        <div className="cct-row-controls">
          <div className="cct-row-stats">
            <span><i className="fas fa-star" style={{ color: '#d4af37' }}></i> {(creature.rating || 0).toFixed(1)}</span>
            <span><i className="fas fa-download"></i> {creature.downloadCount || 0}</span>
          </div>
          <button
            className={`cct-download-btn ${inLib ? 'in-library' : ''}`}
            onClick={(e) => handleDownloadCreature(creature, e)}
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
    <div className="community-creatures-tab cct-root">
      {/* Toast Notification Banner */}
      {toast && (
        <div className={`cct-toast ${toast.type}`}>
          <i className={toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-info-circle'}></i>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Grimoire Toolbar */}
      <div className="cct-toolbar">
        {/* Left: View Tabs */}
        <div className="cct-toolbar-nav">
          <button
            type="button"
            className={`cct-nav-tab ${activeSection === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveSection('browse')}
          >
            <i className="fas fa-compass"></i>
            <span>Browse</span>
            <span className="cct-nav-badge">{creatures.length}</span>
          </button>
        </div>

        {/* Center: Search Bar */}
        <form onSubmit={handleSearch} className="cct-search-bar">
          <i className="fas fa-search cct-search-icon"></i>
          <input
            type="text"
            placeholder="Search community creatures by name, type, CR..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="cct-search-input"
          />
          {searchInput && (
            <button
              type="button"
              className="cct-search-clear"
              onClick={handleClearSearch}
              title="Clear search"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </form>

        {/* Right: Sort & View Toggle Controls */}
        <div className="cct-toolbar-controls">
          <div className="cct-sort-box">
            <span className="cct-control-label">SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => changeSortBy(e.target.value)}
              className="cct-sort-select"
              disabled={!!searchTerm}
            >
              <option value="rating">Highest Rated</option>
              <option value="downloads">Most Downloads</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          <div className="cct-view-toggle">
            <button
              type="button"
              className={`cct-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <i className="fas fa-th-large"></i>
            </button>
            <button
              type="button"
              className={`cct-view-btn ${viewMode === 'list' ? 'active' : ''}`}
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
              className="cct-reset-btn"
              title="Clear active filter/search"
            >
              <i className="fas fa-times-circle"></i> Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Sleek Category Filter Strip */}
      <div className="cct-filter-bar">
        <div className="cct-filter-row">
          <span className="cct-filter-heading">CATEGORY:</span>
          <div className="cct-chips-wrap">
            {activeCategoryList.map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`cct-chip ${(selectedCategory === cat.id || (!selectedCategory && cat.id === 'all')) ? 'active' : ''}`}
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
      <div className="cct-content-scroll">
        {loading && creatures.length === 0 ? (
          <div className="cct-state-box">
            <div className="cct-arcane-spinner"></div>
            <h3>Consulting the Bestiary...</h3>
            <p>Summoning creatures from the community archives.</p>
          </div>
        ) : error ? (
          <div className="cct-state-box error">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Archive Connection Severed</h3>
            <p>{error}</p>
            <button className="cct-action-btn" onClick={refreshAll}>
              <i className="fas fa-redo"></i> Retry Connection
            </button>
          </div>
        ) : (searchTerm || selectedCategory) ? (
          /* Filter / Search Results Section */
          <div className="cct-section">
            <div className="cct-section-header">
              <div className="cct-section-title-wrap">
                <i className="fas fa-search"></i>
                <h3 className="cct-section-title">
                  {selectedCategory
                    ? `${activeCategoryList.find(c => c.id === selectedCategory)?.name || 'Category'} Creatures`
                    : `Search Results for "${searchTerm}"`}
                </h3>
                <span className="cct-section-badge">{creatures.length} creatures</span>
              </div>
            </div>

            {creatures.length === 0 ? (
              <div className="cct-state-box">
                <i className="fas fa-dragon"></i>
                <h4>No Creatures Found</h4>
                <p>No community creations match your current query.</p>
                <button className="cct-action-btn" onClick={clearSelection}>
                  Clear Query
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'cct-grid' : 'cct-list'}>
                {creatures.map(renderCreatureCard)}
              </div>
            )}
          </div>
        ) : (
          /* Browse Default Flow */
          <div className="cct-browse-flow">
            {/* Featured Section */}
            {featuredCreatures.length > 0 && (
              <div className="cct-section">
                <div className="cct-section-header">
                  <div className="cct-section-title-wrap">
                    <i className="fas fa-star gold-glow"></i>
                    <h3 className="cct-section-title">Featured Bestiary</h3>
                    <span className="cct-section-badge">{featuredCreatures.length} featured</span>
                  </div>
                  <span className="cct-section-note">Curated high-tier creature designs</span>
                </div>
                <div className={viewMode === 'grid' ? 'cct-grid' : 'cct-list'}>
                  {featuredCreatures.map(renderCreatureCard)}
                </div>
              </div>
            )}

            {/* General Archives (Deduplicated) */}
            <div className="cct-section">
              <div className="cct-section-header">
                <div className="cct-section-title-wrap">
                  <i className="fas fa-book-open"></i>
                  <h3 className="cct-section-title">Creature Archives</h3>
                  <span className="cct-section-badge">{filteredCatalogCreatures.length} creatures</span>
                </div>
              </div>

              {filteredCatalogCreatures.length > 0 ? (
                <div className={viewMode === 'grid' ? 'cct-grid' : 'cct-list'}>
                  {filteredCatalogCreatures.map(renderCreatureCard)}
                </div>
              ) : (
                <div className="cct-state-box">
                  <i className="fas fa-dragon"></i>
                  <h4>Archive Catalog Empty</h4>
                  <p>All featured creatures are shown above. Create and share your custom creatures to expand the archives!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !loading && !searchTerm && (
          <div className="cct-load-more-box">
            <button className="cct-load-more-btn" onClick={loadMoreCreatures}>
              <i className="fas fa-chevron-down"></i> Load More Creatures
            </button>
          </div>
        )}
      </div>

      {/* Inspect Creature Detail Modal */}
      {inspectingCreature && (
        <div className="cct-modal-backdrop" onClick={() => setInspectingCreature(null)}>
          <div className="cct-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="cct-modal-header">
              <h3 className="cct-modal-title">{inspectingCreature.name}</h3>
              <button className="cct-modal-close" onClick={() => setInspectingCreature(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="cct-modal-body">
              <CompactCreatureCard creature={inspectingCreature} />
            </div>
            <div className="cct-modal-footer">
              <button className="cct-modal-cancel" onClick={() => setInspectingCreature(null)}>
                Close
              </button>
              <button
                className={`cct-modal-download ${isInLibrary(inspectingCreature) ? 'in-library' : ''}`}
                onClick={(e) => {
                  handleDownloadCreature(inspectingCreature, e);
                  setInspectingCreature(null);
                }}
              >
                {isInLibrary(inspectingCreature) ? (
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

export default CommunityCreaturesTab;
