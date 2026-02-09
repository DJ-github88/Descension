import React, { useState, useEffect } from 'react';
import './styles/MapTransitionOverlay.css';

export const MAP_TRANSITION_TIMINGS = {
    FADE_IN_MS: 500,
    SHOW_START_MS: 500,
    EXIT_START_MS: 2000,
    COMPLETE_MS: 2500,
    // Map/data swap should happen only after fade-in has fully covered the viewport.
    SAFE_SWAP_MS: 550
};

/**
 * MapTransitionOverlay - RPG-style transition effect when changing maps
 * Shows a cinematic blur/fade with the map name before revealing the new location
 */
const MapTransitionOverlay = ({
    isVisible,
    mapName,
    onTransitionComplete,
    transferredByGM = false
}) => {
    const [phase, setPhase] = useState('complete'); // Start as complete to be hidden

    useEffect(() => {
        if (!isVisible) {
            setPhase('complete');
            return;
        }

        // Phase 1: Fade in (0-500ms)
        setPhase('entering');

        const showTimer = setTimeout(() => {
            // Phase 2: Show map name (500-2000ms)
            setPhase('showing');
        }, MAP_TRANSITION_TIMINGS.SHOW_START_MS);

        const exitTimer = setTimeout(() => {
            // Phase 3: Fade out (2000-2500ms)
            setPhase('exiting');
        }, MAP_TRANSITION_TIMINGS.EXIT_START_MS);

        const completeTimer = setTimeout(() => {
            // Phase 4: Complete
            setPhase('complete');
            if (onTransitionComplete) {
                onTransitionComplete();
            }
        }, MAP_TRANSITION_TIMINGS.COMPLETE_MS);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(exitTimer);
            clearTimeout(completeTimer);
        };
    }, [isVisible, onTransitionComplete]);

    if (!isVisible && phase === 'complete') {
        return null;
    }

    return (
        <div className={`map-transition-overlay ${phase}`}>
            <div className="map-transition-backdrop"></div>
            <div className="map-transition-content">
                {transferredByGM && (
                    <div className="map-transition-gm-notice">
                        <i className="fas fa-magic"></i>
                        The Game Master transports you...
                    </div>
                )}
                <div className="map-transition-title">
                    <span className="map-transition-prefix">Entering</span>
                    <h1 className="map-transition-name">{mapName || 'Unknown Realm'}</h1>
                </div>
                <div className="map-transition-flourish">
                    <div className="flourish-line left"></div>
                    <i className="fas fa-compass"></i>
                    <div className="flourish-line right"></div>
                </div>
            </div>
        </div>
    );
};

export default MapTransitionOverlay;
