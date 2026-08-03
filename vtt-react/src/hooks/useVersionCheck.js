import { useState, useEffect, useCallback, useRef } from 'react';
import { getPublicUrl } from '../config/env';

const CHECK_INTERVAL = 30000; // Check every 30 seconds
const AUTO_RELOAD_DELAY = 5; // 5-second auto-reload countdown

export function useVersionCheck() {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [latestInfo, setLatestInfo] = useState(null);
  const [countdown, setCountdown] = useState(AUTO_RELOAD_DELAY);
  const initialVersionRef = useRef(null);
  const isCheckingRef = useRef(false);

  const localCommit = process.env.REACT_APP_COMMIT_SHA || null;
  const localBuildTime = process.env.REACT_APP_BUILD_TIME || null;
  const localVersion = process.env.REACT_APP_VERSION || null;

  const triggerUpdate = useCallback(() => {
    // If service worker is waiting, send skip waiting command first
    if (window.__swRegistration && window.__swRegistration.waiting) {
      try {
        window.__swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      } catch (err) {
        console.warn('[VersionCheck] Error posting SKIP_WAITING to service worker:', err);
      }
    }
    // Force reload from server ignoring cache
    window.location.reload(true);
  }, []);

  const checkRemoteVersion = useCallback(async () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;

    try {
      // Trigger SW check if SW is active
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        try {
          const reg = await navigator.serviceWorker.ready;
          if (reg && typeof reg.update === 'function') {
            await reg.update();
          }
        } catch (swErr) {
          // Ignore SW check errors silently
        }
      }

      const publicUrl = getPublicUrl() || '';
      const versionUrl = `${publicUrl}/version.json?t=${Date.now()}`;
      
      const response = await fetch(versionUrl, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        isCheckingRef.current = false;
        return;
      }

      const remoteInfo = await response.json();
      if (!remoteInfo || (!remoteInfo.commitSha && !remoteInfo.version && !remoteInfo.buildTime)) {
        isCheckingRef.current = false;
        return;
      }

      // Establish initial ref if local build values are unavailable
      if (!initialVersionRef.current) {
        initialVersionRef.current = {
          commitSha: localCommit || remoteInfo.commitSha,
          buildTime: localBuildTime || remoteInfo.buildTime,
          version: localVersion || remoteInfo.version
        };
      }

      const baseline = initialVersionRef.current;
      
      // Determine if remote version differs from baseline
      const isCommitDifferent = remoteInfo.commitSha && baseline.commitSha && remoteInfo.commitSha !== baseline.commitSha;
      const isBuildTimeDifferent = remoteInfo.buildTime && baseline.buildTime && remoteInfo.buildTime !== baseline.buildTime;
      const isVersionDifferent = remoteInfo.version && baseline.version && remoteInfo.version !== baseline.version;

      if (isCommitDifferent || isBuildTimeDifferent || isVersionDifferent) {
        console.log('[VersionCheck] Mismatch detected between client and remote server:', {
          current: baseline,
          remote: remoteInfo
        });
        setLatestInfo(remoteInfo);
        setHasUpdate(true);
      }
    } catch (error) {
      console.warn('[VersionCheck] Failed to check remote version:', error.message);
    } finally {
      isCheckingRef.current = false;
    }
  }, [localCommit, localBuildTime, localVersion]);

  // Periodic polling & event listeners
  useEffect(() => {
    // Initial check
    checkRemoteVersion();

    const intervalId = setInterval(checkRemoteVersion, CHECK_INTERVAL);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkRemoteVersion();
      }
    };

    const handleFocus = () => {
      checkRemoteVersion();
    };

    const handleSwUpdate = (event) => {
      if (event.detail) {
        window.__swRegistration = event.detail;
      }
      setHasUpdate(true);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('swUpdateAvailable', handleSwUpdate);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('swUpdateAvailable', handleSwUpdate);
    };
  }, [checkRemoteVersion]);

  // Countdown timer for automatic update when update is available
  useEffect(() => {
    if (!hasUpdate) return;

    const timerId = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          triggerUpdate();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [hasUpdate, triggerUpdate]);

  return {
    hasUpdate,
    latestInfo,
    countdown,
    triggerUpdate
  };
}
