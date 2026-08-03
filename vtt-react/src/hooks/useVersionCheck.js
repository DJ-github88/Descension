import { useState, useEffect, useCallback, useRef } from 'react';
import { getPublicUrl } from '../config/env';

const CHECK_INTERVAL = 45000; // Check every 45 seconds
const AUTO_RELOAD_DELAY = 5; // 5-second auto-reload countdown
const COOLDOWN_MS = 15000; // Minimum 15 seconds between update reloads to prevent infinite loops

export function useVersionCheck() {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [latestInfo, setLatestInfo] = useState(null);
  const [countdown, setCountdown] = useState(AUTO_RELOAD_DELAY);
  const isCheckingRef = useRef(false);

  const localCommit = process.env.REACT_APP_COMMIT_SHA && process.env.REACT_APP_COMMIT_SHA !== 'unknown' 
    ? process.env.REACT_APP_COMMIT_SHA 
    : null;
  const localVersion = process.env.REACT_APP_VERSION || null;

  const triggerUpdate = useCallback(() => {
    if (latestInfo?.commitSha) {
      sessionStorage.setItem('mythrill_active_commit', latestInfo.commitSha);
    }
    if (latestInfo?.version) {
      sessionStorage.setItem('mythrill_active_version', latestInfo.version);
    }
    sessionStorage.setItem('mythrill_last_reload_time', Date.now().toString());

    // If service worker is waiting, send skip waiting command first
    if (window.__swRegistration && window.__swRegistration.waiting) {
      try {
        window.__swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      } catch (err) {
        console.warn('[VersionCheck] Error posting SKIP_WAITING to service worker:', err);
      }
    }

    // Force reload from server
    window.location.reload(true);
  }, [latestInfo]);

  const checkRemoteVersion = useCallback(async () => {
    if (isCheckingRef.current) return;

    // Loop protection: Cooldown check after reload
    const lastReload = parseInt(sessionStorage.getItem('mythrill_last_reload_time') || '0', 10);
    if (Date.now() - lastReload < COOLDOWN_MS) {
      return;
    }

    isCheckingRef.current = true;

    try {
      // Trigger SW check if active
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        try {
          const reg = await navigator.serviceWorker.ready;
          if (reg && typeof reg.update === 'function') {
            await reg.update();
          }
        } catch (swErr) {
          // Ignore SW update error
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
      if (!remoteInfo || !remoteInfo.commitSha || remoteInfo.commitSha === 'unknown') {
        isCheckingRef.current = false;
        return;
      }

      // Determine active commit and version for current browser session
      let activeCommit = sessionStorage.getItem('mythrill_active_commit') || localCommit;
      let activeVersion = sessionStorage.getItem('mythrill_active_version') || localVersion;

      // If active baseline is not yet stored, initialize with initial remote response
      if (!activeCommit) {
        activeCommit = remoteInfo.commitSha;
        sessionStorage.setItem('mythrill_active_commit', activeCommit);
      }
      if (!activeVersion) {
        activeVersion = remoteInfo.version;
        sessionStorage.setItem('mythrill_active_version', activeVersion);
      }

      // Compare remote version against active session baseline (commitSha and version only, excluding raw buildTime)
      const isCommitDifferent = remoteInfo.commitSha && activeCommit && remoteInfo.commitSha !== activeCommit;
      const isVersionDifferent = remoteInfo.version && activeVersion && remoteInfo.version !== activeVersion;

      if (isCommitDifferent || isVersionDifferent) {
        console.log('[VersionCheck] Real update available on remote server:', {
          active: { commit: activeCommit, version: activeVersion },
          remote: remoteInfo
        });
        setLatestInfo(remoteInfo);
        setHasUpdate(true);
      }
    } catch (error) {
      console.warn('[VersionCheck] Version fetch error:', error.message);
    } finally {
      isCheckingRef.current = false;
    }
  }, [localCommit, localVersion]);

  // Periodic polling & event listeners
  useEffect(() => {
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
      const lastReload = parseInt(sessionStorage.getItem('mythrill_last_reload_time') || '0', 10);
      if (Date.now() - lastReload < COOLDOWN_MS) {
        return;
      }
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

  // Countdown timer when update modal is active
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
