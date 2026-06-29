import React from 'react';

const AscensionBloodResourceBar = ({
  deathcallerState,
  setDeathcallerState,
  finalClassResource,
  finalConfig,
  character,
  isOwner,
  onClassResourceUpdate,
  size,
  context,
  pathsBarRef,
  tokensBarRef,
  setShowTooltip,
  setTooltipPosition,
}) => {
  const {
    localAscensionPaths,
    localBloodTokens,
    showPathsMenu,
    showTokensMenu,
    deathcallerHoverSection,
  } = deathcallerState;

  const setShowPathsMenu = (value) => setDeathcallerState(prev => ({ ...prev, showPathsMenu: value }));
  const setShowTokensMenu = (value) => setDeathcallerState(prev => ({ ...prev, showTokensMenu: value }));
  const setLocalAscensionPaths = (valueOrFn) => setDeathcallerState(prev => ({
    ...prev,
    localAscensionPaths: typeof valueOrFn === 'function' ? valueOrFn(prev.localAscensionPaths) : valueOrFn
  }));
  const setLocalBloodTokens = (valueOrFn) => setDeathcallerState(prev => ({
    ...prev,
    localBloodTokens: typeof valueOrFn === 'function' ? valueOrFn(prev.localBloodTokens) : valueOrFn
  }));
  const setDeathcallerHoverSection = (value) => setDeathcallerState(prev => ({ ...prev, deathcallerHoverSection: value }));

        const pathsMax = finalConfig.visual?.ascensionPaths?.max || 7;
        const tokensMax = finalConfig.visual?.bloodTokens?.max || 30;
        const pathsArray = Array.isArray(finalClassResource.stacks) ? finalClassResource.stacks : [true, false, false, false, false, false, false];
        const activePaths = pathsArray.filter(p => p).length;
        const tokensValue = finalClassResource.bloodTokens ?? 0;

        // Get token color based on count (warning/danger thresholds)
        const getTokenColor = (tokens) => {
            const warningThreshold = finalConfig.bloodTokens?.warningThreshold || 10;
            const dangerThreshold = finalConfig.bloodTokens?.dangerThreshold || 20;

            if (tokens >= dangerThreshold) return finalConfig.visual.bloodTokens.dangerColor;
            if (tokens >= warningThreshold) return finalConfig.visual.bloodTokens.warningColor;
            return finalConfig.visual.bloodTokens.activeColor;
        };

        const tokenColor = getTokenColor(tokensValue);
        const tokenPercentage = Math.min((tokensValue / tokensMax) * 100, 100);

        // Helper functions for path management
        const togglePath = (index) => {
            const prev = Array.isArray(finalClassResource.stacks) ? finalClassResource.stacks : [true, false, false, false, false, false, false];
            let currentPaths = [...prev];

            // If path is currently inactive, try to activate it
            if (!currentPaths[index]) {
                if (index === 0) {
                    currentPaths[index] = true;
                } else {
                    const allPreviousActive = currentPaths.slice(0, index).every(p => p === true);
                    if (allPreviousActive) {
                        currentPaths[index] = true;
                    }
                }
            }
            // If path is currently active, deactivate it and all subsequent paths
            else {
                for (let i = index; i < currentPaths.length; i++) {
                    currentPaths[i] = false;
                }
            }
            setLocalAscensionPaths(currentPaths);
            if (onClassResourceUpdate) onClassResourceUpdate('stacks', currentPaths);
        };

        // Helper functions for token management
        const addTokens = (amount) => {
            const prev = finalClassResource.bloodTokens ?? 0;
            const newValue = prev + amount;
            setLocalBloodTokens(newValue);
            logClassResourceChange('Blood Token', amount, true, 'bloodTokens');
            if (onClassResourceUpdate) onClassResourceUpdate('bloodTokens', newValue);
        };

        const removeTokens = (amount) => {
            const prev = finalClassResource.bloodTokens ?? 0;
            const newValue = Math.max(prev - amount, 0);
            const actualAmount = prev - newValue;
            if (actualAmount > 0) {
                setLocalBloodTokens(newValue);
                logClassResourceChange('Blood Token', actualAmount, false, 'bloodTokens');
                if (onClassResourceUpdate) onClassResourceUpdate('bloodTokens', newValue);
            }
        };

        const rollDice = (diceCount, diceSize) => {
            let total = 0;
            for (let i = 0; i < diceCount; i++) {
                total += Math.floor(Math.random() * diceSize) + 1;
            }
            return total;
        };

        return (
            <div className={`class-resource-bar ascension-blood ${size} ${context === 'party' ? 'party-context' : ''}`}>
                <div className="revenant-single-bar" style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '4px' }}>

                    {/* Ascension Paths (Left) — segmented skull cells */}
                    <div
                        ref={pathsBarRef}
                        className="ascension-paths-bar"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowPathsMenu(!showPathsMenu);
                            setShowTokensMenu(false);
                        }}
                        onMouseEnter={(e) => {
                            setDeathcallerHoverSection('paths');
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                            setShowTooltip(true);
                        }}
                        onMouseLeave={() => {
                            setDeathcallerHoverSection(null);
                            setShowTooltip(false);
                        }}
                        style={{
                            flex: 1,
                            cursor: isOwner ? 'pointer' : 'default',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            height: size === 'large' ? '20px' : '14px',
                            background: 'rgba(26, 13, 26, 0.2)',
                            border: '1px solid rgba(139, 0, 0, 0.35)',
                            borderRadius: '4px 0 0 4px',
                            padding: '0 4px',
                            overflow: 'hidden',
                            position: 'relative',
                        }}
                    >
                        {Array.from({ length: pathsMax }, (_, i) => {
                            const isActive = pathsArray[i];
                            const pathData = finalConfig.paths[i];
                            return (
                                <div
                                    key={i}
                                    className={`path-indicator ${isActive ? 'active' : 'inactive'}`}
                                    title={pathData ? `${pathData.shortName || pathData.name}` : `Path ${i + 1}`}
                                    style={{
                                        flex: 1,
                                        height: size === 'large' ? '14px' : '10px',
                                        borderRadius: '2px',
                                        backgroundColor: isActive
                                            ? finalConfig.visual.ascensionPaths.activeColor
                                            : finalConfig.visual.ascensionPaths.baseColor,
                                        boxShadow: isActive
                                            ? `0 0 4px ${finalConfig.visual.ascensionPaths.glowColor}`
                                            : 'none',
                                        border: '1px solid rgba(0,0,0,0.4)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {isActive && <i className="fas fa-skull" style={{ fontSize: '7px', lineHeight: 1 }}></i>}
                                </div>
                            );
                        })}
                        {/* Overlay value */}
                        <div style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', fontSize: '8px', fontWeight: 'bold', color: '#DC143C', textShadow: '0 0 3px rgba(0,0,0,0.9)', pointerEvents: 'none', zIndex: 2, whiteSpace: 'nowrap' }}>
                            {activePaths}/{pathsMax}
                        </div>
                    </div>

                    {/* Center Separator � skull */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className="fas fa-skull" style={{ fontSize: '11px', color: '#8B0000', textShadow: '0 0 4px rgba(220,20,60,0.5)', margin: '0 1px' }}></i>
                    </div>

                    {/* Blood Tokens Bar (Right) — fill bar */}
                    <div
                        ref={tokensBarRef}
                        className="blood-tokens-bar"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowTokensMenu(!showTokensMenu);
                            setShowPathsMenu(false);
                        }}
                        onMouseEnter={(e) => {
                            setDeathcallerHoverSection('tokens');
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                            setShowTooltip(true);
                        }}
                        onMouseLeave={() => {
                            setDeathcallerHoverSection(null);
                            setShowTooltip(false);
                        }}
                        style={{
                            flex: 1,
                            cursor: isOwner ? 'pointer' : 'default',
                            display: 'flex',
                            alignItems: 'center',
                            height: size === 'large' ? '20px' : '14px',
                            background: 'rgba(45, 10, 10, 0.2)',
                            border: `1px solid rgba(178, 34, 34, 0.35)`,
                            borderRadius: '0 4px 4px 0',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Fill */}
                        <div style={{
                            position: 'absolute', left: 0, top: 0, height: '100%',
                            width: `${tokenPercentage}%`,
                            background: `linear-gradient(90deg, #8B0000 0%, ${tokenColor} 100%)`,
                            opacity: 0.5,
                            transition: 'width 0.2s ease-out',
                        }} />
                        {/* Value label */}
                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', width: '100%', fontSize: '9px', fontWeight: 'bold', color: tokensValue >= 6 ? tokenColor : '#B22222', textShadow: '0 0 3px rgba(0,0,0,0.9)', whiteSpace: 'nowrap' }}>
                            <span>{tokensValue} BT</span>
                        </div>
                    </div>
                </div>

                    {/* Paths Menu */}
                    {showPathsMenu && pathsBarRef.current && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!pathsBarRef.current) return '50%';
                                    const rect = pathsBarRef.current.getBoundingClientRect();
                                    let hudContainer = pathsBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!pathsBarRef.current) return '50%';
                                    const rect = pathsBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Ascension Paths: {activePaths}/{pathsMax}</div>
                                {renderStatusFlavor()}

                                <div className="deathcaller-paths-grid">
                                    {finalConfig.paths.map((path, i) => {
                                        // Get current paths array - use the one from renderAscensionBlood scope
                                        const currentPaths = Array.isArray(localAscensionPaths) ? localAscensionPaths : [true, false, false, false, false, false, false];

                                        // Path is disabled if: it's not active AND it's not the first path AND the previous path is not active
                                        const isDisabled = !currentPaths[i] && i > 0 && !currentPaths[i - 1];

                                        // Path can be activated if: it's the first path OR all previous paths are active
                                        const canActivate = i === 0 || currentPaths.slice(0, i).every(p => p === true);

                                        return (
                                            <button
                                                key={i}
                                                className={`deathcaller-path-btn ${currentPaths[i] ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    // Only allow toggle if not disabled
                                                    if (isDisabled) {
                                                        return;
                                                    }
                                                    // Call togglePath for enabled paths
                                                    togglePath(i);
                                                }}
                                                title={path.name}
                                                style={{
                                                    opacity: isDisabled ? 0.4 : 1,
                                                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                    pointerEvents: isDisabled ? 'none' : 'auto'
                                                }}
                                            >
                                                <span className="deathcaller-path-number">{i + 1}</span>
                                                <i className={`fas ${currentPaths[i] ? 'fa-check-circle' : 'fa-circle'}`}></i>
                                                <span className="deathcaller-path-name">{path.shortName || path.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="deathcaller-quick-actions">
                                                                    <button
                                        onClick={() => {
                                            const nextPaths = [false, false, false, false, false, false, false];
                                            setLocalAscensionPaths(nextPaths);
                                            if (onClassResourceUpdate) onClassResourceUpdate('stacks', nextPaths);
                                            setShowPathsMenu(false);
                                        }}
                                        className="context-menu-button"
                                        title="Reset All Paths"
                                    >
                                        <i className="fas fa-undo"></i>
                                        <span>Reset</span>
                                    </button>
                                    <button
                                        onClick={() => setShowPathsMenu(false)}
                                        className="context-menu-button"
                                        title="Close"
                                    >
                                        <i className="fas fa-times"></i>
                                        <span>Close</span>
                                    </button>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}

                    {/* Tokens Menu */}
                    {showTokensMenu && tokensBarRef.current && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!tokensBarRef.current) return '50%';
                                    const rect = tokensBarRef.current.getBoundingClientRect();
                                    let hudContainer = tokensBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!tokensBarRef.current) return '50%';
                                    const rect = tokensBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Blood Tokens: {tokensValue}/{tokensMax}</div>
                                {renderStatusFlavor()}

                                <div style={{ marginBottom: '6px' }}>
                                    <div className="context-menu-section-header">Gain Tokens</div>
                                    <div className="deathcaller-tokens-grid">
                                        <button
                                            className="context-menu-button gain"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addTokens(rollDice(1, 6));
                                            }}
                                        >
                                            <i className="fas fa-plus-circle"></i>
                                            <span>+1d6</span>
                                        </button>
                                        <button
                                            className="context-menu-button gain"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addTokens(rollDice(2, 8));
                                            }}
                                        >
                                            <i className="fas fa-plus-circle"></i>
                                            <span>+2d8</span>
                                        </button>
                                        <button
                                            className="context-menu-button gain"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addTokens(rollDice(4, 10));
                                            }}
                                        >
                                            <i className="fas fa-plus-circle"></i>
                                            <span>+4d10</span>
                                        </button>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '6px', paddingTop: '6px', borderTop: '1px solid rgba(160, 140, 112, 0.3)' }}>
                                    <div className="context-menu-section-header">Spend Tokens</div>
                                    <div className="deathcaller-tokens-grid">
                                        <button
                                            className="context-menu-button spend"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeTokens(5);
                                            }}
                                        >
                                            <i className="fas fa-minus-circle"></i>
                                            <span>-5</span>
                                        </button>
                                        <button
                                            className="context-menu-button spend"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeTokens(10);
                                            }}
                                        >
                                            <i className="fas fa-minus-circle"></i>
                                            <span>-10</span>
                                        </button>
                                    </div>
                                    <button
                                        className="context-menu-button spend danger"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeTokens(tokensValue);
                                        }}
                                        style={{ width: '100%', marginTop: '4px' }}
                                    >
                                        <i className="fas fa-bolt"></i>
                                        <span>Spend All ({tokensValue}d10)</span>
                                    </button>
                                </div>

                                <div className="deathcaller-quick-actions" style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(160, 140, 112, 0.3)' }}>
                                    <button
                                        className="context-menu-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const resetAmount = tokensValue;
                                            setLocalBloodTokens(0);
                                            setShowTokensMenu(false);
                                            if (resetAmount > 0) {
                                                logClassResourceChange('Blood Token', resetAmount, false, 'bloodTokens');
                                                if (onClassResourceUpdate) onClassResourceUpdate('bloodTokens', 0);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-undo"></i>
                                        <span>Reset</span>
                                    </button>
                                    <button
                                        className="context-menu-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowTokensMenu(false);
                                        }}
                                    >
                                        <i className="fas fa-times"></i>
                                        <span>Close</span>
                                    </button>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
            </div>
        );

};

export default AscensionBloodResourceBar;