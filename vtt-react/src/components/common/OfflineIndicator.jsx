import React, { useState, useEffect } from 'react';
import { getOfflineSyncStatus, syncOfflineData, isOnline } from '../../services/offlineService';
import useAuthStore from '../../store/authStore';
import './OfflineIndicator.css';

const OfflineIndicator = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [syncStatus, setSyncStatus] = useState(null);
  const [isCurrentlyOnline, setIsCurrentlyOnline] = useState(isOnline());
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Update sync status
    const updateSyncStatus = () => {
      const status = getOfflineSyncStatus();
      setSyncStatus(status);
      setIsCurrentlyOnline(isOnline());
    };

    // Initial status
    updateSyncStatus();

    // Listen for online/offline events
    const handleOnline = () => {
      setIsCurrentlyOnline(true);
      updateSyncStatus();
    };

    const handleOffline = () => {
      setIsCurrentlyOnline(false);
      updateSyncStatus();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Update status periodically
    const interval = setInterval(updateSyncStatus, 5000); // Every 5 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [isAuthenticated, user]);

  const handleManualSync = async () => {
    if (!user || isSyncing) return;

    setIsSyncing(true);
    try {
      await syncOfflineData(user.uid);
      const status = getOfflineSyncStatus();
      setSyncStatus(status);
    } catch (error) {
      console.error('Manual sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isAuthenticated || !syncStatus) return null;

  const hasPendingActions = syncStatus.pendingActions > 0;
  const hasConflicts = syncStatus.conflicts && syncStatus.conflicts.length > 0;

  return (
    <div className={`offline-indicator ${isCurrentlyOnline ? 'online' : 'offline'}`}>
      <div className="indicator-content">
        <div className="status-indicator">
          <i className={`fas ${isCurrentlyOnline ? 'fa-wifi' : 'fa-wifi-slash'}`}></i>
          <span className="status-text">
            {isCurrentlyOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {hasPendingActions && (
          <div className="pending-actions">
            <i className="fas fa-clock"></i>
            <span>{syncStatus.pendingActions} pending</span>
          </div>
        )}

        {hasConflicts && (
          <div className="sync-conflicts">
            <i className="fas fa-exclamation-triangle"></i>
            <span>{syncStatus.conflicts.length} conflicts</span>
          </div>
        )}

        {isCurrentlyOnline && hasPendingActions && (
          <button
            className="sync-button"
            onClick={handleManualSync}
            disabled={isSyncing}
            title="Sync offline changes"
          >
            <i className={`fas ${isSyncing ? 'fa-spinner fa-spin' : 'fa-sync'}`}></i>
          </button>
        )}
      </div>

      {syncStatus.lastSuccessfulSync && (
        <div className="last-sync">
          Last synced: {new Date(syncStatus.lastSuccessfulSync).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default OfflineIndicator;
