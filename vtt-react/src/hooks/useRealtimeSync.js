/**
 * Real-time Sync Hook with Conflict Resolution
 *
 * Provides real-time synchronization across devices with conflict resolution.
 * Uses Firebase real-time listeners to detect changes from other devices.
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import { doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import useAuthStore from '../store/authStore';

export const useRealtimeSync = (collection, documentId, onRemoteChange, options = {}) => {
  const { user } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);
  const [lastRemoteUpdate, setLastRemoteUpdate] = useState(null);
  const [conflictDetected, setConflictDetected] = useState(false);
  const [conflictData, setConflictData] = useState(null);

  const unsubscribeRef = useRef(null);
  const localChangesRef = useRef(new Set());
  const lastLocalSaveRef = useRef(null);

  const {
    enabled = true,
    conflictResolution = 'remote-wins', // 'remote-wins', 'local-wins', 'ask-user'
    onConflict = null
  } = options;

  /**
   * Start real-time listener for the document
   */
  const startSync = useCallback(() => {
    if (!db || !user || !documentId || !enabled) {
      // If conditions aren't met, ensure we stop any existing sync
      stopSync();
      return;
    }

    // Stop existing listener before starting a new one
    stopSync();

    const docRef = doc(db, collection, documentId);

    unsubscribeRef.current = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (!docSnapshot.exists()) {
          setIsConnected(true);
          return;
        }

        const remoteData = docSnapshot.data();
        const remoteTimestamp = remoteData.lastUpdated?.toDate?.() || new Date(remoteData.lastUpdated);
        const remoteVersion = remoteData.version || 1;

        setLastRemoteUpdate(remoteTimestamp);
        setIsConnected(true);

        // Check if this is a change we made locally (ignore our own changes)
        if (lastLocalSaveRef.current &&
            Math.abs(remoteTimestamp.getTime() - lastLocalSaveRef.current.getTime()) < 1000) {
          return;
        }

        // Check for conflicts
        const hasLocalChanges = localChangesRef.current.size > 0;

        if (hasLocalChanges) {
          // Conflict detected - we have local changes and remote changes
          setConflictDetected(true);
          setConflictData({
            remoteData,
            remoteTimestamp,
            remoteVersion,
            localTimestamp: lastLocalSaveRef.current
          });

          if (conflictResolution === 'remote-wins') {
            // Automatically resolve by accepting remote changes
            handleConflictResolution('remote');
          } else if (conflictResolution === 'local-wins') {
            // Keep local changes
            handleConflictResolution('local');
          } else if (conflictResolution === 'ask-user') {
            // Show conflict resolution modal
            setConflictDetected(true);
            setConflictData({
              remoteData,
              remoteTimestamp,
              remoteVersion,
              localTimestamp: lastLocalSaveRef.current,
              resolveWithRemote: () => handleConflictResolution('remote'),
              resolveWithLocal: () => handleConflictResolution('local')
            });
          }
        } else {
          // No local changes, accept remote update
          onRemoteChange(remoteData, 'remote-update');
        }
      },
      (error) => {
        console.error('Real-time sync error:', error);
        setIsConnected(false);
      }
    );

    console.log(`🔄 Started real-time sync for ${collection}/${documentId}`);
  }, [collection, documentId, user, enabled, onRemoteChange, conflictResolution, onConflict]);

  /**
   * Stop real-time listener
   */
  const stopSync = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
      setIsConnected(false);
      console.log(`🛑 Stopped real-time sync for ${collection}/${documentId}`);
    }
  }, [collection, documentId]);

  /**
   * Mark that local changes have been made
   */
  const markLocalChange = useCallback((changeId) => {
    localChangesRef.current.add(changeId);
  }, []);

  /**
   * Mark that local changes have been saved
   */
  const markLocalSave = useCallback((timestamp = new Date()) => {
    lastLocalSaveRef.current = timestamp;
    localChangesRef.current.clear();
    setConflictDetected(false);
    setConflictData(null);
  }, []);

  /**
   * Handle conflict resolution
   */
  const handleConflictResolution = useCallback((choice) => {
    if (!conflictData) return;

    if (choice === 'remote') {
      // Accept remote changes
      onRemoteChange(conflictData.remoteData, 'conflict-resolved-remote');
      localChangesRef.current.clear();
    } else if (choice === 'local') {
      // Keep local changes - don't call onRemoteChange
      // The local changes will be saved on next auto-save
    }

    setConflictDetected(false);
    setConflictData(null);
  }, [conflictData, onRemoteChange]);

  // Start/stop sync based on enabled state and dependencies
  useEffect(() => {
    if (enabled && user && documentId) {
      startSync();
    } else {
      stopSync();
    }

    // Cleanup function to ensure listener is stopped on unmount or dependency changes
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
        setIsConnected(false);
        console.log(`🧹 Cleanup: Stopped real-time sync for ${collection}/${documentId} on unmount/dependency change`);
      }
    };
  }, [enabled, user, documentId]);

  return {
    // Status
    isConnected,
    conflictDetected,
    conflictData,
    lastRemoteUpdate,

    // Controls
    startSync,
    stopSync,
    markLocalChange,
    markLocalSave,

    // Conflict resolution
    resolveConflict: handleConflictResolution
  };
};
