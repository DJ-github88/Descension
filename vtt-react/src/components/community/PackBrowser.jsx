/**
 * Pack Browser Component
 * 
 * This component provides a unified interface for browsing and downloading
 * community packs (collections of items and/or creatures).
 */

import React, { useState } from 'react';
import { useCommunityPacks } from '../../hooks/useCommunityPacks';
import useItemStore from '../../store/itemStore';
import { useCreatureLibraryDispatch, libraryActionCreators } from '../creature-wizard/context/CreatureLibraryContext';
import PackCard from './PackCard';
import PackDetailsModal from './PackDetailsModal';
import './PackBrowser.css';

const PackBrowser = () => {
  const {
    packs,
    featuredPacks,
    loading,
    error,
    selectedType,
    searchTerm,
    hasMore,
    selectType,
    search,
    clearSelection,
    loadMorePacks,
    downloadCommunityPack,
    getPackContentsData,
    PACK_TYPES
  } = useCommunityPacks();

  const { addItem } = useItemStore();
  const libraryDispatch = useCreatureLibraryDispatch();
  
  const [searchInput, setSearchInput] = useState('');
  const [downloadingPacks, setDownloadingPacks] = useState(new Set());
  const [selectedPack, setSelectedPack] = useState(null);
  const [showPackDetails, setShowPackDetails] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      search(searchInput.trim());
    }
  };

  const handleDownloadPack = async (pack) => {
    try {
      setDownloadingPacks(prev => new Set([...prev, pack.id]));
      
      // Download pack (increments download count)
      const downloadedPack = await downloadCommunityPack(pack.id);
      
      // Get pack contents
      const contents = await getPackContentsData(pack.id);
      
      // Add items to local library
      if (contents.items && contents.items.length > 0) {
        contents.items.forEach(item => {
          const localItem = {
            ...item,
            id: `pack-${pack.id}-item-${item.id}-${Date.now()}`,
            source: 'community-pack',
            packId: pack.id,
            packName: pack.name,
            dateAdded: new Date().toISOString()
          };
          addItem(localItem, ['community-packs']);
        });
      }
      
      // Add creatures to local library
      if (contents.creatures && contents.creatures.length > 0) {
        contents.creatures.forEach(creature => {
          const localCreature = {
            ...creature,
            id: `pack-${pack.id}-creature-${creature.id}-${Date.now()}`,
            source: 'community-pack',
            packId: pack.id,
            packName: pack.name,
            dateCreated: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            categoryIds: ['community-packs']
          };
          libraryDispatch(libraryActionCreators.addCreature(localCreature));
        });
      }
      
      console.log(`Pack "${pack.name}" downloaded successfully!`);
      console.log(`Added ${contents.items?.length || 0} items and ${contents.creatures?.length || 0} creatures`);
      
    } catch (error) {
      console.error('Failed to download pack:', error);
    } finally {
      setDownloadingPacks(prev => {
        const newSet = new Set(prev);
        newSet.delete(pack.id);
        return newSet;
      });
    }
  };

  const handlePackDetails = async (pack) => {
    setSelectedPack(pack);
    setShowPackDetails(true);
  };

  const packTypes = [
    {
      id: PACK_TYPES.ITEMS,
      name: 'Item Packs',
      description: 'Collections of weapons, armor, and magical items',
      icon: 'inv_misc_bag_08',
      color: '#2d5016'
    },
    {
      id: PACK_TYPES.CREATURES,
      name: 'Creature Packs',
      description: 'Collections of monsters and NPCs for encounters',
      icon: 'ability_hunter_pet_wolf',
      color: '#5a1e12'
    },
    {
      id: PACK_TYPES.MIXED,
      name: 'Adventure Packs',
      description: 'Complete adventure sets with items and creatures',
      icon: 'inv_misc_book_09',
      color: '#8b4513'
    }
  ];

  return (
    <div className="pack-browser">
      {/* Search Bar */}
      <div className="pack-search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search community packs..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </form>
        
        {(selectedType || searchTerm) && (
          <button onClick={clearSelection} className="clear-selection-btn">
            <i className="fas fa-times"></i> Clear Selection
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && packs.length === 0 && (
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading packs...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="pack-error-state">
          <div className="error-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h3>Unable to Connect to Community</h3>
          <p>
            We're having trouble connecting to the community pack database.
            This might be due to network issues or the service being temporarily unavailable.
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

      {/* Pack Types */}
      {!selectedType && !searchTerm && (
        <div className="pack-types">
          <h3>Browse by Type</h3>
          <div className="pack-types-grid">
            {packTypes.map(type => (
              <div
                key={type.id}
                className="pack-type-card"
                onClick={() => selectType(type.id)}
                style={{
                  '--type-color': type.color
                }}
              >
                <div className="pack-type-icon">
                  <img
                    src={`https://wow.zamimg.com/images/wow/icons/large/${type.icon}.jpg`}
                    alt={type.name}
                    onError={(e) => {
                      e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                    }}
                  />
                </div>
                <h4>{type.name}</h4>
                <p>{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Packs */}
      {!selectedType && !searchTerm && featuredPacks.length > 0 && (
        <div className="featured-packs">
          <h3>Featured Packs</h3>
          <div className="packs-grid">
            {featuredPacks.map(pack => (
              <PackCard
                key={pack.id}
                pack={pack}
                onDownload={() => handleDownloadPack(pack)}
                onViewDetails={() => handlePackDetails(pack)}
                isDownloading={downloadingPacks.has(pack.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Pack Results */}
      {(selectedType || searchTerm) && (
        <div className="pack-results">
          <div className="results-header">
            <h3>
              {selectedType 
                ? `${packTypes.find(t => t.id === selectedType)?.name || 'Packs'}`
                : `Search Results for "${searchTerm}"`
              }
            </h3>
            <span className="results-count">{packs.length} packs found</span>
          </div>

          {loading && packs.length === 0 ? (
            <div className="loading-state">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading packs...</p>
            </div>
          ) : packs.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-search"></i>
              <p>No packs found</p>
            </div>
          ) : (
            <>
              <div className="packs-grid">
                {packs.map(pack => (
                  <PackCard
                    key={pack.id}
                    pack={pack}
                    onDownload={() => handleDownloadPack(pack)}
                    onViewDetails={() => handlePackDetails(pack)}
                    isDownloading={downloadingPacks.has(pack.id)}
                  />
                ))}
              </div>
              
              {hasMore && (
                <div className="load-more">
                  <button 
                    onClick={loadMorePacks} 
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

      {/* Pack Details Modal */}
      {showPackDetails && selectedPack && (
        <PackDetailsModal
          pack={selectedPack}
          onClose={() => {
            setShowPackDetails(false);
            setSelectedPack(null);
          }}
          onDownload={() => handleDownloadPack(selectedPack)}
          isDownloading={downloadingPacks.has(selectedPack.id)}
        />
      )}
    </div>
  );
};

export default PackBrowser;
