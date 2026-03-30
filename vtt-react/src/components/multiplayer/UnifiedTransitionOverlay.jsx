import React, { useState, useEffect, useCallback } from 'react';
import './styles/UnifiedTransitionOverlay.css';

export const TRANSITION_TIMINGS = {
    FADE_IN_MS: 400,
    SHOW_START_MS: 400,
    EXIT_START_MS: 2000,
    COMPLETE_MS: 2500,
    SAFE_SWAP_MS: 450
};

export const LOADING_STAGES = {
    CONNECTING: { min: 0, max: 20, text: 'Establishing connection...' },
    AUTHENTICATING: { min: 20, max: 40, text: 'Authenticating...' },
    LOADING_REALM: { min: 40, max: 60, text: 'Loading realm data...' },
    PREPARING_STATE: { min: 60, max: 80, text: 'Preparing game state...' },
    FINALIZING: { min: 80, max: 100, text: 'Finalizing...' }
};

const getStageForProgress = (progress) => {
    if (progress < 20) return LOADING_STAGES.CONNECTING;
    if (progress < 40) return LOADING_STAGES.AUTHENTICATING;
    if (progress < 60) return LOADING_STAGES.LOADING_REALM;
    if (progress < 80) return LOADING_STAGES.PREPARING_STATE;
    return LOADING_STAGES.FINALIZING;
};

const UnifiedTransitionOverlay = ({
    isVisible,
    mode = 'join',
    progress = 0,
    title,
    subtitle,
    roomName,
    mapName,
    statusMessage, // New prop for manual status overrides
    isReady = false,
    showContinue = false,
    isFadingOut = false,
    transferredByGM = false,
    onContinue,
    onTransitionComplete,
    onSafeToSwap
}) => {
    const [phase, setPhase] = useState('complete');
    const [displayProgress, setDisplayProgress] = useState(0);
    const [currentStageText, setCurrentStageText] = useState(LOADING_STAGES.CONNECTING.text);
    const [hasNotifiedSwap, setHasNotifiedSwap] = useState(false);

    const isJoinMode = mode === 'join';
    const isMapMode = mode === 'map';

    const displayTitle = title || (isJoinMode ? 'Entering the Realm' : null);
    const displaySubtitle = subtitle || (isJoinMode && roomName ? `Preparing ${roomName}...` : null);
    const displayMapName = mapName || 'Unknown Realm';

    useEffect(() => {
        if (isJoinMode && progress !== undefined) {
            const smoothProgress = Math.min(100, Math.max(0, progress));
            setDisplayProgress(smoothProgress);

            // Override stage text if explicit statusMessage is provided
            if (statusMessage) {
                setCurrentStageText(statusMessage);
            } else {
                const stage = getStageForProgress(smoothProgress);
                setCurrentStageText(stage.text);
            }
        }
    }, [progress, isJoinMode, statusMessage]);

    useEffect(() => {
        if (!isVisible) {
            setPhase('complete');
            setHasNotifiedSwap(false);
            return;
        }

        setPhase('entering');
        setHasNotifiedSwap(false);

        const safeSwapTimer = setTimeout(() => {
            if (onSafeToSwap && !hasNotifiedSwap) {
                setHasNotifiedSwap(true);
                onSafeToSwap();
            }
        }, TRANSITION_TIMINGS.SAFE_SWAP_MS);

        if (isMapMode) {
            const showTimer = setTimeout(() => {
                setPhase('showing');
            }, TRANSITION_TIMINGS.SHOW_START_MS);

            const exitTimer = setTimeout(() => {
                setPhase('exiting');
            }, TRANSITION_TIMINGS.EXIT_START_MS);

            const completeTimer = setTimeout(() => {
                setPhase('complete');
                if (onTransitionComplete) {
                    onTransitionComplete();
                }
            }, TRANSITION_TIMINGS.COMPLETE_MS);

            return () => {
                clearTimeout(safeSwapTimer);
                clearTimeout(showTimer);
                clearTimeout(exitTimer);
                clearTimeout(completeTimer);
            };
        }

        return () => {
            clearTimeout(safeSwapTimer);
        };
    }, [isVisible, isMapMode, onSafeToSwap, onTransitionComplete, hasNotifiedSwap]);

    const handleContinueClick = useCallback(() => {
        if (onContinue) {
            onContinue();
        }
    }, [onContinue]);

    if (!isVisible && phase === 'complete' && !isFadingOut) {
        return null;
    }

    const showProgress = isJoinMode && !isFadingOut;
    const showContinueButton = isJoinMode && showContinue && isReady && !isFadingOut;
    const showMapContent = isMapMode && (phase === 'showing' || phase === 'entering');

    return (
        <div
            className={`unified-transition-overlay ${phase} ${isFadingOut ? 'fade-out' : ''} mode-${mode}`}
            aria-hidden={!isVisible && phase === 'complete'}
        >
            <div className="unified-backdrop"></div>

            <div className="unified-transition-content">
                {isJoinMode && (
                    <>
                        <div className="unified-icon-container">
                            <div className="unified-icon-ring"></div>
                            <div className="unified-icon-ring inner"></div>
                            <i className="fas fa-dharmachakra unified-spinner-icon"></i>
                        </div>

                        <h1 className="unified-title">{displayTitle}</h1>

                        {displaySubtitle && (
                            <p className="unified-subtitle">{displaySubtitle}</p>
                        )}

                        {showProgress && (
                            <div className="unified-progress-container">
                                <div className="unified-progress-bar">
                                    <div className="unified-progress-rune left"></div>
                                    <div className="unified-progress-track">
                                        <div
                                            className="unified-progress-fill"
                                            style={{ width: `${displayProgress}%` }}
                                        >
                                            <div className="unified-progress-shimmer"></div>
                                        </div>
                                    </div>
                                    <div className="unified-progress-rune right"></div>
                                </div>

                                <div className="unified-progress-stages">
                                    {[0, 25, 50, 75, 100].map((stage) => (
                                        <div
                                            key={stage}
                                            className={`unified-progress-node ${displayProgress >= stage ? 'active' : ''
                                                } ${displayProgress >= stage + 20 ? 'complete' : ''}`}
                                            style={{ left: `${stage}%` }}
                                        />
                                    ))}
                                </div>

                                <p className="unified-progress-text">{currentStageText}</p>
                            </div>
                        )}

                        {showContinueButton && (
                            <button
                                className="unified-continue-btn"
                                onClick={handleContinueClick}
                            >
                                <i className="fas fa-door-open"></i>
                                Enter the Realm
                            </button>
                        )}

                        {isJoinMode && showContinue && !isReady && !isFadingOut && (
                            <p className="unified-waiting">
                                <i className="fas fa-hourglass-half"></i>
                                Waiting for connection...
                            </p>
                        )}

                        {isFadingOut && (
                            <div className="unified-fading-content">
                                <div className="unified-progress-container">
                                    <div className="unified-progress-bar complete">
                                        <div className="unified-progress-rune left"></div>
                                        <div className="unified-progress-track">
                                            <div className="unified-progress-fill" style={{ width: '100%' }}>
                                                <div className="unified-progress-shimmer"></div>
                                            </div>
                                        </div>
                                        <div className="unified-progress-rune right"></div>
                                    </div>
                                </div>
                                <p className="unified-fading-message">
                                    <i className="fas fa-sparkles"></i>
                                    The path opens before you...
                                </p>
                            </div>
                        )}
                    </>
                )}

                {isMapMode && (
                    <>
                        {transferredByGM && (
                            <div className="unified-gm-notice">
                                <i className="fas fa-magic"></i>
                                The Game Master transports you...
                            </div>
                        )}

                        <div className="unified-map-title-container">
                            <span className="unified-map-prefix">Entering</span>
                            <h1 className="unified-map-name">{displayMapName}</h1>
                        </div>

                        <div className="unified-flourish">
                            <div className="unified-flourish-line left"></div>
                            <i className="fas fa-compass"></i>
                            <div className="unified-flourish-line right"></div>
                        </div>

                        <div className="unified-progress-container map-mode">
                            <div className="unified-progress-bar">
                                <div className="unified-progress-rune left"></div>
                                <div className="unified-progress-track">
                                    <div className="unified-progress-fill cinematic">
                                        <div className="unified-progress-shimmer"></div>
                                    </div>
                                </div>
                                <div className="unified-progress-rune right"></div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="unified-particles">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="unified-particle"
                        style={{
                            '--delay': `${i * 0.3}s`,
                            '--x': `${Math.random() * 100}%`,
                            '--duration': `${3 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default UnifiedTransitionOverlay;
