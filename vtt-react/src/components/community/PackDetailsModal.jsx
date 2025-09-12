/**
 * Pack Details Modal Component
 * 
 * Shows detailed information about a community pack including contents,
 * dependencies, compatibility, and download options.
 */

import React, { useState, useEffect } from 'react';
import { useCommunityPacks } from '../../hooks/useCommunityPacks';
import { PACK_TYPES } from '../../services/firebase/packService';
import './PackDetailsModal.css';

const PackDetailsModal = ({ pack, onClose, onDownload, isDownloading }) => {
  const { getPackContentsData, checkDependencies, getCompatibility } = useCommunityPacks();
  const [contents, setContents] = useState(null);
  const [dependencies, setDependencies] = useState(null);
  const [compatibility, setCompatibility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadPackDetails();
  }, [pack.id]);

  const loadPackDetails = async () => {
    try {
      setLoading(true);
      
      const [contentsData, dependenciesData, compatibilityData] = await Promise.all([
        getPackContentsData(pack.id),
        checkDependencies(pack.id),
        getCompatibility(pack.id)
      ]);
      
      setContents(contentsData);
      setDependencies(dependenciesData);
      setCompatibility(compatibilityData);
    } catch (error) {
      console.error('Failed to load pack details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPackTypeInfo = (type) => {
    switch (type) {
      case PACK_TYPES.ITEMS:
        return { name: 'Items Pack', icon: 'inv_misc_bag_08', color: '#2d5016' };
      case PACK_TYPES.CREATURES:
        return { name: 'Creatures Pack', icon: 'ability_hunter_pet_wolf', color: '#5a1e12' };
      case PACK_TYPES.MIXED:
        return { name: 'Adventure Pack', icon: 'inv_misc_book_09', color: '#8b4513' };
      default:
        return { name: 'Unknown Pack', icon: 'inv_misc_questionmark', color: '#666666' };
    }
  };

  const typeInfo = getPackTypeInfo(pack.type);

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderOverviewTab = () => (
    <div className="pack-overview">
      <div className="pack-info-grid">
        <div className="pack-info-item">
          <label>Type:</label>
          <div className="pack-type-info">
            <img
              src={`https://wow.zamimg.com/images/wow/icons/medium/${typeInfo.icon}.jpg`}
              alt={typeInfo.name}
              onError={(e) => {
                e.target.src = "https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg";
              }}
            />
            <span>{typeInfo.name}</span>
          </div>
        </div>
        
        <div className="pack-info-item">
          <label>Version:</label>
          <span>v{pack.version || '1.0.0'}</span>
        </div>
        
        <div className="pack-info-item">
          <label>Created:</label>
          <span>{formatDate(pack.createdAt)}</span>
        </div>
        
        <div className="pack-info-item">
          <label>Updated:</label>
          <span>{formatDate(pack.updatedAt)}</span>
        </div>
        
        <div className="pack-info-item">
          <label>Downloads:</label>
          <span>{pack.downloadCount || 0}</span>
        </div>
        
        <div className="pack-info-item">
          <label>Rating:</label>
          <span>
            <i className="fas fa-star"></i>
            {pack.rating || 0} ({pack.ratingCount || 0} reviews)
          </span>
        </div>
      </div>

      <div className="pack-description-full">
        <h4>Description</h4>
        <p>{pack.description}</p>
      </div>

      {pack.tags && pack.tags.length > 0 && (
        <div className="pack-tags-full">
          <h4>Tags</h4>
          <div className="tags-list">
            {pack.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderContentsTab = () => {
    if (!contents) return <div className="loading">Loading contents...</div>;

    return (
      <div className="pack-contents">
        {contents.items && contents.items.length > 0 && (
          <div className="content-section">
            <h4>Items ({contents.items.length})</h4>
            <div className="content-list">
              {contents.items.map((item, index) => (
                <div key={index} className="content-item">
                  <div className="item-icon">
                    <img
                      src={`https://wow.zamimg.com/images/wow/icons/medium/${item.icon || 'inv_misc_questionmark'}.jpg`}
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = "https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg";
                      }}
                    />
                  </div>
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-type">{item.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {contents.creatures && contents.creatures.length > 0 && (
          <div className="content-section">
            <h4>Creatures ({contents.creatures.length})</h4>
            <div className="content-list">
              {contents.creatures.map((creature, index) => (
                <div key={index} className="content-item">
                  <div className="item-icon">
                    <img
                      src={`https://wow.zamimg.com/images/wow/icons/medium/${creature.icon || 'ability_hunter_pet_wolf'}.jpg`}
                      alt={creature.name}
                      onError={(e) => {
                        e.target.src = "https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg";
                      }}
                    />
                  </div>
                  <div className="item-info">
                    <span className="item-name">{creature.name}</span>
                    <span className="item-type">{creature.type} • {creature.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCompatibilityTab = () => (
    <div className="pack-compatibility-info">
      {compatibility && (
        <div className="compatibility-section">
          <h4>Version Compatibility</h4>
          <p>
            This pack is compatible with application versions{' '}
            <strong>v{compatibility.compatibility.minVersion}</strong> to{' '}
            <strong>v{compatibility.compatibility.maxVersion}</strong>
          </p>
        </div>
      )}

      {dependencies && (
        <div className="dependencies-section">
          <h4>Dependencies</h4>
          {dependencies.satisfied ? (
            <div className="dependencies-satisfied">
              <i className="fas fa-check-circle"></i>
              <span>All dependencies are satisfied</span>
            </div>
          ) : (
            <div className="dependencies-missing">
              <i className="fas fa-exclamation-triangle"></i>
              <span>Missing dependencies: {dependencies.missing.join(', ')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="pack-details-modal-overlay" onClick={onClose}>
      <div className="pack-details-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="pack-title-section">
            <h3>{pack.name}</h3>
            {pack.isFeatured && (
              <div className="featured-badge">
                <i className="fas fa-star"></i>
                Featured
              </div>
            )}
          </div>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'contents' ? 'active' : ''}`}
            onClick={() => setActiveTab('contents')}
          >
            Contents
          </button>
          <button
            className={`tab-btn ${activeTab === 'compatibility' ? 'active' : ''}`}
            onClick={() => setActiveTab('compatibility')}
          >
            Compatibility
          </button>
        </div>

        {/* Modal Content */}
        <div className="modal-content">
          {loading ? (
            <div className="loading-state">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading pack details...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && renderOverviewTab()}
              {activeTab === 'contents' && renderContentsTab()}
              {activeTab === 'compatibility' && renderCompatibilityTab()}
            </>
          )}
        </div>

        {/* Modal Actions */}
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Close
          </button>
          <button
            className="download-btn"
            onClick={onDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Downloading...
              </>
            ) : (
              <>
                <i className="fas fa-download"></i>
                Download Pack
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackDetailsModal;
