/**
 * Storage Usage Widget
 *
 * Shows user's current storage usage and limits.
 * Displays warnings when approaching limits.
 *
 * Modes:
 *  - default: full card with breakdown
 *  - compact: horizontal bar for tight spaces
 *  - cloud: cloud-shaped header button that fills up; click for details
 */

import React, { useEffect, useRef, useState } from 'react';
import useAuthStore from '../../store/authStore';
import { usePersistence } from '../providers/PersistenceProvider';
import storageLimitService from '../../services/firebase/storageLimitService';
import './styles/StorageUsageWidget.css';

const CLOUD_PATH = 'M 22,64 A 14,14 0 0,1 22,36 A 18,18 0 0,1 58,28 A 18,18 0 0,1 96,34 A 14,14 0 0,1 106,58 A 14,14 0 0,1 92,74 L 34,74 A 14,14 0 0,1 22,64 Z';

const StorageUsageWidget = ({ compact = false, cloud = false }) => {
  const { user } = useAuthStore();
  const { storageUsage, isOnline } = usePersistence();
  const [detailedUsage, setDetailedUsage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const widgetRef = useRef(null);

  useEffect(() => {
    const loadDetailedUsage = async () => {
      if (!user || user.isGuest || !isOnline) return;

      setIsLoading(true);
      try {
        const usage = await storageLimitService.getStorageSummary(user.uid);
        setDetailedUsage(usage);
      } catch (error) {
        console.error('Failed to load storage usage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDetailedUsage();
  }, [user, isOnline, storageUsage]); // refresh when persisted usage changes

  // Close detail popover when clicking outside
  useEffect(() => {
    if (!showDetails) return;

    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setShowDetails(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDetails]);

  if (!user) return null;

  if (user.isGuest) {
    if (cloud) {
      return (
        <div
          ref={widgetRef}
          className="storage-usage-widget cloud guest"
        >
          <button
            className="storage-cloud-button"
            onClick={() => setShowDetails(!showDetails)}
            aria-label="No cloud storage. Click for details."
            title="No cloud storage"
          >
            <div className="storage-cloud-visual">
              <svg viewBox="0 0 128 80" className="storage-cloud-svg">
                <path className="storage-cloud-outline" d={CLOUD_PATH} />
              </svg>
              <span className="storage-cloud-label"><i className="fas fa-lock"></i></span>
            </div>
            <span className="storage-cloud-text">Storage</span>
          </button>

          {showDetails && (
            <div className="storage-cloud-details guest">
              <div className="storage-details-header">
                <h4>
                  <i className="fas fa-cloud"></i>
                  Guest Storage
                </h4>
                <button
                  className="storage-details-close"
                  onClick={() => setShowDetails(false)}
                  aria-label="Close storage details"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="storage-message guest">
                <i className="fas fa-info-circle"></i>
                You are playing as a guest. Your progress is saved locally only and will be lost when you sign out. Create a free account to unlock cloud storage!
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={`storage-usage-widget ${compact ? 'compact' : ''} guest`}>
        <div className="storage-header">
          <i className="fas fa-info-circle"></i>
          <span>No Cloud Storage</span>
        </div>
        {!compact && (
          <div className="storage-content">
            <p>Data is not saved. Upgrade to an account to persist your progress!</p>
          </div>
        )}
      </div>
    );
  }

  if (!isOnline || !detailedUsage) {
    // In compact mode (account overview bar), hide entirely while unavailable
    // so we don't park a permanent "Loading..." cloud below the header.
    if (compact || cloud) return null;
    return (
      <div className={`storage-usage-widget offline`}>
        <div className="storage-header">
          <i className="fas fa-cloud"></i>
          <span>Loading...</span>
        </div>
        <div className="storage-content">
          <p>Unable to check storage usage. Please check your connection.</p>
        </div>
      </div>
    );
  }

  const { tier, totalUsed, totalLimit, percentage, breakdown, status, message } = detailedUsage;
  const isUnlimited = totalLimit >= 5 * 1024 * 1024 * 1024;
  const usedMB = (totalUsed / (1024 * 1024)).toFixed(2);
  const limitMB = isUnlimited ? 'Unlimited' : (totalLimit / (1024 * 1024)).toFixed(0);
  const limitGB = (totalLimit / (1024 * 1024 * 1024)).toFixed(1);
  const displayLimit = isUnlimited ? 'Unlimited' : totalLimit >= 1024 * 1024 * 1024 ? `${limitGB} GB` : `${limitMB} MB`;
  const formattedUsed = storageLimitService.formatBytes(totalUsed);
  const formattedLimit = isUnlimited ? 'Unlimited' : storageLimitService.formatBytes(totalLimit);

  const formatCategoryLimit = (val) => val === -1 || val === undefined ? '∞' : val;

  const getFillColor = () => {
    if (status === 'critical') return '#ff6b6b';
    if (status === 'warning') return '#ffd93d';
    return '#6bcf7f';
  };

  const getCloudLabel = () => {
    if (isUnlimited) return '∞';
    return `${percentage}%`;
  };

  if (cloud) {
    const fillHeight = 76 * Math.min(percentage, 100) / 100;
    const fillY = 76 - fillHeight;
    const fillColor = getFillColor();

    return (
      <div
        ref={widgetRef}
        className={`storage-usage-widget cloud ${status}`}
      >
        <button
          className="storage-cloud-button"
          onClick={() => setShowDetails(!showDetails)}
          aria-label={`Storage usage: ${formattedUsed} of ${formattedLimit} (${percentage}%). Click for details.`}
          title="Click for storage details"
        >
          <div className="storage-cloud-visual">
            <svg viewBox="0 0 128 80" className="storage-cloud-svg">
              <defs>
                <clipPath id="cloud-clip">
                  <path d={CLOUD_PATH} />
                </clipPath>
                <linearGradient id="cloud-fill-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={fillColor} stopOpacity="0.95" />
                  <stop offset="100%" stopColor={fillColor} stopOpacity="0.65" />
                </linearGradient>
              </defs>

              {/* Empty cloud backing */}
              <path className="storage-cloud-outline" d={CLOUD_PATH} />

              {/* Filled portion clipped to cloud shape */}
              <g clipPath="url(#cloud-clip)">
                <rect
                  className="storage-cloud-fill"
                  x="0"
                  y={fillY}
                  width="128"
                  height={fillHeight}
                  fill="url(#cloud-fill-gradient)"
                />
                {/* Animated wave surface */}
                {percentage > 0 && (
                  <path
                    className="storage-cloud-wave"
                    d={`M 0,${fillY} Q 16,${fillY - 3} 32,${fillY} T 64,${fillY} T 96,${fillY} T 128,${fillY} V 0 H 0 Z`}
                    fill={fillColor}
                    opacity="0.35"
                  />
                )}
              </g>
            </svg>
            <span className="storage-cloud-label">{getCloudLabel()}</span>
          </div>
          <span className="storage-cloud-text">Storage</span>
        </button>

        {showDetails && (
          <div className="storage-cloud-details">
            <div className="storage-details-header">
              <h4>
                <i className="fas fa-cloud"></i>
                {tier} Storage
              </h4>
              <button
                className="storage-details-close"
                onClick={() => setShowDetails(false)}
                aria-label="Close storage details"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="storage-details-summary">
              <div className="storage-details-usage">
                <span className="storage-details-used">{formattedUsed}</span>
                <span className="storage-details-separator">of</span>
                <span className="storage-details-limit">{formattedLimit}</span>
              </div>
              <div className={`storage-details-percentage ${status}`}>{percentage}% used</div>
            </div>

            <div className="storage-bar">
              <div
                className="storage-fill"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>

            <div className="storage-breakdown">
              <div className="breakdown-item">
                <span><i className="fas fa-globe"></i> World Lore</span>
                <span>{storageLimitService.formatBytes(breakdown.worldLore || 0)}</span>
              </div>
              <div className="breakdown-item">
                <span><i className="fas fa-user"></i> Characters</span>
                <span>{storageLimitService.formatBytes(breakdown.characters || 0)}</span>
              </div>
              <div className="breakdown-item">
                <span><i className="fas fa-door-open"></i> Rooms</span>
                <span>{storageLimitService.formatBytes(breakdown.rooms || 0)}</span>
              </div>
              <div className="breakdown-item">
                <span><i className="fas fa-book"></i> Journals</span>
                <span>{storageLimitService.formatBytes(breakdown.journals || 0)}</span>
              </div>
              <div className="breakdown-item">
                <span><i className="fas fa-map"></i> Campaigns</span>
                <span>
                  {breakdown.campaigns || 0} / {formatCategoryLimit(detailedUsage.limits.campaigns)}
                  {(breakdown.campaignBytes || 0) > 0 ? ` • ${storageLimitService.formatBytes(breakdown.campaignBytes)}` : ''}
                </span>
              </div>
              {(breakdown.customMaps || 0) > 0 && (
                <div className="breakdown-item">
                  <span><i className="fas fa-map-marked-alt"></i> Custom Maps</span>
                  <span>{storageLimitService.formatBytes(breakdown.customMaps)}</span>
                </div>
              )}
              {(breakdown.audioFiles || 0) > 0 && (
                <div className="breakdown-item">
                  <span><i className="fas fa-music"></i> Audio</span>
                  <span>{storageLimitService.formatBytes(breakdown.audioFiles)}</span>
                </div>
              )}
              {(breakdown.mediaFiles || 0) > 0 && (
                <div className="breakdown-item">
                  <span><i className="fas fa-image"></i> Images & Maps</span>
                  <span>{storageLimitService.formatBytes(breakdown.mediaFiles)}</span>
                </div>
              )}
            </div>

            {message && (
              <div className={`storage-message ${status}`}>
                <i className={`fas ${status === 'critical' ? 'fa-exclamation-triangle' : status === 'warning' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
                {message}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`storage-usage-widget compact ${status}`}>
        <div className="storage-compact-row">
          <div className="storage-header">
            <i className={`fas fa-cloud ${status === 'critical' ? 'error' : status === 'warning' ? 'warning' : 'success'}`}></i>
            <span>Storage</span>
          </div>
          <div className="storage-bar">
            <div
              className="storage-fill"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <div className="storage-stats">
            <span className="storage-used">{usedMB} MB</span>
            <span className="storage-separator">/</span>
            <span className="storage-limit">{displayLimit}</span>
          </div>
          <span className="storage-percentage">{percentage}%</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`storage-usage-widget ${status}`}>
      <div className="storage-header">
        <i className={`fas fa-cloud ${status === 'critical' ? 'error' : status === 'warning' ? 'warning' : 'success'}`}></i>
        <span>{tier} Storage</span>
        <span className="storage-percentage">{percentage}%</span>
      </div>

      <div className="storage-content">
        <div className="storage-bar">
          <div
            className="storage-fill"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="storage-stats">
          <span className="storage-used">{usedMB}MB used</span>
          <span className="storage-limit">{displayLimit}</span>
        </div>

        <div className="storage-breakdown">
          <div className="breakdown-item">
            <span>World Lore</span>
            <span>{storageLimitService.formatBytes(breakdown.worldLore || 0)}</span>
          </div>
          <div className="breakdown-item">
            <span>Characters</span>
            <span>{storageLimitService.formatBytes(breakdown.characters || 0)}</span>
          </div>
          <div className="breakdown-item">
            <span>Rooms</span>
            <span>{storageLimitService.formatBytes(breakdown.rooms || 0)}</span>
          </div>
          <div className="breakdown-item">
            <span>Journals</span>
            <span>{storageLimitService.formatBytes(breakdown.journals || 0)}</span>
          </div>
          <div className="breakdown-item">
            <span>Campaigns</span>
            <span>
              {breakdown.campaigns || 0} / {formatCategoryLimit(detailedUsage.limits.campaigns)}
              {(breakdown.campaignBytes || 0) > 0 ? ` • ${storageLimitService.formatBytes(breakdown.campaignBytes)}` : ''}
            </span>
          </div>
          {(breakdown.customMaps || 0) > 0 && (
            <div className="breakdown-item">
              <span>Custom Maps</span>
              <span>{storageLimitService.formatBytes(breakdown.customMaps)}</span>
            </div>
          )}
          {(breakdown.audioFiles || 0) > 0 && (
            <div className="breakdown-item">
              <span>Audio</span>
              <span>{storageLimitService.formatBytes(breakdown.audioFiles)}</span>
            </div>
          )}
          {(breakdown.mediaFiles || 0) > 0 && (
            <div className="breakdown-item">
              <span>Images & Maps</span>
              <span>{storageLimitService.formatBytes(breakdown.mediaFiles)}</span>
            </div>
          )}
        </div>

        {message && (
          <div className={`storage-message ${status}`}>
            <i className={`fas ${status === 'critical' ? 'fa-exclamation-triangle' : status === 'warning' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default StorageUsageWidget;
