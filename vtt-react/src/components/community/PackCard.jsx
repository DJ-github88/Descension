/**
 * Pack Card Component
 * 
 * Displays a community pack with its metadata, contents preview, and actions.
 */

import React from 'react';
import { PACK_TYPES } from '../../services/firebase/packService';
import './PackCard.css';

const PackCard = ({ pack, onDownload, onViewDetails, isDownloading }) => {
  const getPackTypeInfo = (type) => {
    switch (type) {
      case PACK_TYPES.ITEMS:
        return {
          name: 'Items',
          icon: 'inv_misc_bag_08',
          color: '#2d5016'
        };
      case PACK_TYPES.CREATURES:
        return {
          name: 'Creatures',
          icon: 'ability_hunter_pet_wolf',
          color: '#5a1e12'
        };
      case PACK_TYPES.MIXED:
        return {
          name: 'Mixed',
          icon: 'inv_misc_book_09',
          color: '#8b4513'
        };
      default:
        return {
          name: 'Unknown',
          icon: 'inv_misc_questionmark',
          color: '#666666'
        };
    }
  };

  const typeInfo = getPackTypeInfo(pack.type);
  const itemCount = pack.items?.length || 0;
  const creatureCount = pack.creatures?.length || 0;
  const totalContent = itemCount + creatureCount;

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString();
  };

  const renderTags = () => {
    if (!pack.tags || pack.tags.length === 0) return null;
    
    return (
      <div className="pack-tags">
        {pack.tags.slice(0, 3).map((tag, index) => (
          <span key={index} className="pack-tag">
            {tag}
          </span>
        ))}
        {pack.tags.length > 3 && (
          <span className="pack-tag-more">+{pack.tags.length - 3}</span>
        )}
      </div>
    );
  };

  const renderContentSummary = () => {
    const parts = [];
    
    if (itemCount > 0) {
      parts.push(`${itemCount} item${itemCount !== 1 ? 's' : ''}`);
    }
    
    if (creatureCount > 0) {
      parts.push(`${creatureCount} creature${creatureCount !== 1 ? 's' : ''}`);
    }
    
    return parts.join(' • ');
  };

  const renderDependencies = () => {
    if (!pack.dependencies || pack.dependencies.length === 0) return null;
    
    return (
      <div className="pack-dependencies">
        <i className="fas fa-link" title="Has dependencies"></i>
        <span>{pack.dependencies.length} dependencies</span>
      </div>
    );
  };

  return (
    <div className="pack-card">
      {/* Pack Header */}
      <div className="pack-header">
        <div className="pack-type-badge" style={{ '--type-color': typeInfo.color }}>
          <img
            src={`https://wow.zamimg.com/images/wow/icons/medium/${typeInfo.icon}.jpg`}
            alt={typeInfo.name}
            onError={(e) => {
              e.target.src = "https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg";
            }}
          />
          <span>{typeInfo.name}</span>
        </div>
        
        {pack.isFeatured && (
          <div className="featured-badge">
            <i className="fas fa-star"></i>
            Featured
          </div>
        )}
      </div>

      {/* Pack Content */}
      <div className="pack-content">
        <h4 className="pack-name" title={pack.name}>
          {pack.name}
        </h4>
        
        <p className="pack-description" title={pack.description}>
          {pack.description}
        </p>

        {renderTags()}

        <div className="pack-metadata">
          <div className="content-summary">
            <i className="fas fa-box"></i>
            <span>{renderContentSummary()}</span>
          </div>
          
          <div className="pack-version">
            <i className="fas fa-code-branch"></i>
            <span>v{pack.version || '1.0.0'}</span>
          </div>
        </div>

        {renderDependencies()}
      </div>

      {/* Pack Stats */}
      <div className="pack-stats">
        <div className="stat-item">
          <i className="fas fa-download"></i>
          <span>{pack.downloadCount || 0}</span>
        </div>
        
        <div className="stat-item">
          <i className="fas fa-star"></i>
          <span>{pack.rating || 0}</span>
          <span className="rating-count">({pack.ratingCount || 0})</span>
        </div>
        
        <div className="stat-item">
          <i className="fas fa-calendar"></i>
          <span>{formatDate(pack.createdAt)}</span>
        </div>
      </div>

      {/* Pack Actions */}
      <div className="pack-actions">
        <button
          className="pack-details-btn"
          onClick={onViewDetails}
        >
          <i className="fas fa-info-circle"></i>
          Details
        </button>
        
        <button
          className="pack-download-btn"
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
              Download
            </>
          )}
        </button>
      </div>

      {/* Compatibility Info */}
      {pack.compatibility && (
        <div className="pack-compatibility">
          <i className="fas fa-check-circle" title="Compatible"></i>
          <span>Compatible v{pack.compatibility.minVersion} - v{pack.compatibility.maxVersion}</span>
        </div>
      )}
    </div>
  );
};

export default PackCard;
