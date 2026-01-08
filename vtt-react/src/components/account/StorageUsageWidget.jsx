/**
 * Storage Usage Widget
 *
 * Shows user's current storage usage and limits.
 * Displays warnings when approaching limits.
 */

import React, { useEffect, useState } from 'react';
import useAuthStore from '../../store/authStore';
import { usePersistence } from '../providers/PersistenceProvider';
import persistenceService from '../../services/firebase/persistenceService';
import './styles/StorageUsageWidget.css';

const StorageUsageWidget = ({ compact = false }) => {
  const { user } = useAuthStore();
  const { storageUsage, isOnline } = usePersistence();
  const [detailedUsage, setDetailedUsage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load detailed storage usage on mount
  useEffect(() => {
    const loadDetailedUsage = async () => {
      if (!user || user.isGuest || !isOnline) return;

      setIsLoading(true);
      try {
        const usage = await persistenceService.getStorageSummary(user.uid);
        setDetailedUsage(usage);
      } catch (error) {
        console.error('Failed to load storage usage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDetailedUsage();
  }, [user, isOnline]);

  if (!user) return null;

  if (user.isGuest) {
    return (
      <div className={`storage-usage-widget ${compact ? 'compact' : ''} guest`}>
        <div className="storage-header">
          <i className="fas fa-info-circle"></i>
          <span>Guest Mode</span>
        </div>
        <div className="storage-content">
          <p>Data is not saved. Upgrade to an account to persist your progress!</p>
        </div>
      </div>
    );
  }

  if (!isOnline || !detailedUsage) {
    return (
      <div className={`storage-usage-widget ${compact ? 'compact' : ''} offline`}>
        <div className="storage-header">
          <i className="fas fa-cloud-offline"></i>
          <span>Storage Offline</span>
        </div>
        <div className="storage-content">
          <p>Unable to check storage usage. Please check your connection.</p>
        </div>
      </div>
    );
  }

  const { tier, totalUsed, totalLimit, percentage, breakdown, status, message } = detailedUsage;
  const usedMB = (totalUsed / (1024 * 1024)).toFixed(2);
  const limitMB = (totalLimit / (1024 * 1024)).toFixed(2);

  return (
    <div className={`storage-usage-widget ${compact ? 'compact' : ''} ${status}`}>
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
          <span className="storage-limit">{limitMB}MB limit</span>
        </div>

        {!compact && (
          <div className="storage-breakdown">
            <div className="breakdown-item">
              <span>Characters</span>
              <span>{breakdown.characters || 0} / {detailedUsage.limits.characters}</span>
            </div>
            <div className="breakdown-item">
              <span>Rooms</span>
              <span>{breakdown.rooms || 0} / {detailedUsage.limits.rooms}</span>
            </div>
            <div className="breakdown-item">
              <span>Journals</span>
              <span>{(breakdown.journals || 0) > 0 ? '1' : '0'} / 1</span>
            </div>
            <div className="breakdown-item">
              <span>Campaigns</span>
              <span>{breakdown.campaigns || 0} / {detailedUsage.limits.campaigns}</span>
            </div>
          </div>
        )}

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
