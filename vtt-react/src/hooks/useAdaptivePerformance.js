/**
 * Real-Time Adaptive Performance Hook
 * Continuously monitors render frame rates and dynamically downgrades graphic settings
 * if sustained frame drops are detected on lower-spec hardware.
 */

import { useEffect, useRef, useState } from 'react';
import useSettingsStore from '../store/settingsStore';

export function useAdaptivePerformance({ enabled = true, targetFps = 30, sampleIntervalMs = 2000 } = {}) {
  const [currentFps, setCurrentFps] = useState(60);
  const [isLowFpsState, setIsLowFpsState] = useState(false);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const lowFpsCountRef = useRef(0);

  const { shadowQuality, particleEffects, updateSettings, isManualOverride } = useSettingsStore();

  useEffect(() => {
    if (!enabled) return;

    let animationFrameId;

    const tick = (now) => {
      frameCountRef.current++;
      const elapsed = now - lastTimeRef.current;

      if (elapsed >= sampleIntervalMs) {
        const fps = Math.round((frameCountRef.current * 1000) / elapsed);
        setCurrentFps(fps);
        frameCountRef.current = 0;
        lastTimeRef.current = now;

        // If FPS falls below target threshold consistently
        if (fps < targetFps) {
          lowFpsCountRef.current++;
          if (lowFpsCountRef.current >= 2) {
            setIsLowFpsState(true);

            // Auto-degrade settings if not manually overridden by user
            if (!isManualOverride?.shadowQuality && shadowQuality !== 'off') {
              console.log('⚡ Adaptive Performance: Auto-reducing shadow quality due to frame drops.');
              updateSettings({ shadowQuality: 'off' });
            } else if (!isManualOverride?.particleEffects && particleEffects) {
              console.log('⚡ Adaptive Performance: Auto-disabling particle effects to recover FPS.');
              updateSettings({ particleEffects: false });
            }
          }
        } else {
          lowFpsCountRef.current = Math.max(0, lowFpsCountRef.current - 1);
          if (lowFpsCountRef.current === 0) {
            setIsLowFpsState(false);
          }
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [enabled, targetFps, sampleIntervalMs, shadowQuality, particleEffects, updateSettings, isManualOverride]);

  return {
    currentFps,
    isLowFpsState
  };
}

export default useAdaptivePerformance;
