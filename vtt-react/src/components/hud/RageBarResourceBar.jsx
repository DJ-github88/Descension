import React from 'react';

const RageBarResourceBar = ({
  berserkerState,
  setBerserkerState,
  uiState,
  setUiState,
  finalClassResource,
  finalConfig,
  character,
  isOwner,
  onClassResourceUpdate,
  size,
  context,
  rageInputValue,
  rageBarRef
}) => {
  const {
    showRageMenu
  } = berserkerState;

  const {
    showTooltip,
    tooltipPosition,
    tooltipPlacement,
  } = uiState;

  const setShowTooltip = (value) => setUiState(prev => ({ ...prev, showTooltip: value }));
  const setTooltipPosition = (value) => setUiState(prev => ({ ...prev, tooltipPosition: value }));
  const setTooltipPlacement = (value) => setUiState(prev => ({ ...prev, tooltipPlacement: value }));

  const berserkerRage = finalClassResource?.current ?? 0;
  const berserkerRageMax = finalClassResource?.max ?? 100;
  const setRageInputValue = (value) => setUiState(prev => ({ ...prev, rageInputValue: value }));
  const setShowRageMenu = (value) => setUiState(prev => ({ ...prev, showRageMenu: value }));

        const rageValue = berserkerRage;
        const isOverheated = rageValue > 100;
        const percentage = Math.min((rageValue / 100) * 100, 100);
        const overheatedAmount = Math.max(rageValue - 100, 0);

        // Determine rage state
        let rageState = 'Smoldering';
        let stateColor = '#4A0000';

        if (rageValue >= 101) {
            rageState = 'Obliteration';
            stateColor = '#FF0000';
        } else if (rageValue >= 81) {
            rageState = 'Cataclysm';
            stateColor = '#DC143C';
        } else if (rageValue >= 61) {
            rageState = 'Carnage';
            stateColor = '#FF4500';
        } else if (rageValue >= 41) {
            rageState = 'Primal';
            stateColor = '#FF6347';
        } else if (rageValue >= 21) {
            rageState = 'Frenzied';
            stateColor = '#FF8C00';
        }

        return (
            <div className={`class-resource-bar rage-bar ${size} ${isOverheated ? 'overheated' : ''}`}>
                <div className="rage-bar-wrapper">
                    <div className="rage-bar-container" ref={rageBarRef} onMouseEnter={handleRageBarEnter} onMouseLeave={handleRageBarLeave} onClick={(e) => {
                        e.stopPropagation();
                        setShowRageMenu((v) => !v);
                    }} style={{ cursor: 'pointer' }}>
                        <ResourceCanvasBar
                            rendererType="rage-bar"
                            size={size}
                            layoutMode="bar"
                            spheres={[]}
                            elements={[]}
                            config={{
                                currentRage: rageValue,
                                maxRage: berserkerRageMax,
                                rageStates: finalConfig.rageStates,
                            }}
                            isOwner={isOwner}
                            style={{ width: '100%' }}
                        />
                    </div>
                    {showRageMenu && rageBarRef.current && ReactDOM.createPortal(
                        <div
                            className="unified-context-menu compact"
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!rageBarRef.current) return '50%';
                                    const rect = rageBarRef.current.getBoundingClientRect();
                                    let hudContainer = rageBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!rageBarRef.current) return '50%';
                                    const rect = rageBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Rage: {rageValue}/100</div>
                                {renderStatusFlavor()}

                                <div className="berserker-actions">
                                    <div className="berserker-action-row">
                                        <button
                                            className="context-menu-button gain"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.min(rageValue + 5, 150);
                                                const amount = newValue - rageValue;
                                                setShowRageMenu(false);
                                                if (amount > 0) {
                                                    logClassResourceChange('Rage', amount, true, 'rage');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                                }
                                            }}
                                            title="Gain 5 Rage"
                                        >
                                            <i className="fas fa-plus"></i>
                                            <span>+5</span>
                                        </button>
                                        <button
                                            className="context-menu-button spend"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.max(rageValue - 5, 0);
                                                const amount = rageValue - newValue;
                                                setShowRageMenu(false);
                                                if (amount > 0) {
                                                    logClassResourceChange('Rage', amount, false, 'rage');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                                }
                                            }}
                                            title="Spend 5 Rage"
                                        >
                                            <i className="fas fa-minus"></i>
                                            <span>-5</span>
                                        </button>
                                    </div>
                                    <div className="berserker-action-row">
                                        <button
                                            className="context-menu-button gain"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.min(rageValue + 10, 150);
                                                const amount = newValue - rageValue;
                                                setShowRageMenu(false);
                                                if (amount > 0) {
                                                    logClassResourceChange('Rage', amount, true, 'rage');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                                }
                                            }}
                                            title="Gain 10 Rage"
                                        >
                                            <i className="fas fa-plus-circle"></i>
                                            <span>+10</span>
                                        </button>
                                        <button
                                            className="context-menu-button spend"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.max(rageValue - 10, 0);
                                                const amount = rageValue - newValue;
                                                setShowRageMenu(false);
                                                if (amount > 0) {
                                                    logClassResourceChange('Rage', amount, false, 'rage');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                                }
                                            }}
                                            title="Spend 10 Rage"
                                        >
                                            <i className="fas fa-minus-circle"></i>
                                            <span>-10</span>
                                        </button>
                                    </div>
                                    <div className="berserker-action-row">
                                        <button
                                            className="context-menu-button gain"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.min(rageValue + 20, 150);
                                                const amount = newValue - rageValue;
                                                setShowRageMenu(false);
                                                if (amount > 0) {
                                                    logClassResourceChange('Rage', amount, true, 'rage');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                                }
                                            }}
                                            title="Gain 20 Rage"
                                        >
                                            <i className="fas fa-arrow-up"></i>
                                            <span>+20</span>
                                        </button>
                                        <button
                                            className="context-menu-button spend"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.max(rageValue - 20, 0);
                                                const amount = rageValue - newValue;
                                                setShowRageMenu(false);
                                                if (amount > 0) {
                                                    logClassResourceChange('Rage', amount, false, 'rage');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                                }
                                            }}
                                            title="Spend 20 Rage"
                                        >
                                            <i className="fas fa-arrow-down"></i>
                                            <span>-20</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="berserker-set-controls">
                                    <input
                                        className="berserker-set-input"
                                        type="number"
                                        min="0"
                                        max="150"
                                        placeholder={`${rageValue}`}
                                        value={rageInputValue}
                                        onChange={(e) => setRageInputValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const v = parseInt(rageInputValue);
                                                if (!isNaN(v)) {
                                                    const clampedV = Math.max(0, Math.min(v, 150));
                                                    const amount = Math.abs(clampedV - rageValue);
                                                    setRageInputValue('');
                                                    setShowRageMenu(false);
                                                    if (amount > 0) {
                                                        logClassResourceChange('Rage', amount, clampedV > rageValue, 'rage');
                                                        if (onClassResourceUpdate) onClassResourceUpdate('current', clampedV);
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                    <button
                                        className="context-menu-button"
                                        onClick={() => {
                                            if (!isOwner) return; // SECURITY: Only owner can modify
                                            const v = parseInt(rageInputValue);
                                            if (!isNaN(v)) {
                                                const clampedV = Math.max(0, Math.min(v, 150));
                                                const amount = Math.abs(clampedV - rageValue);
                                                setRageInputValue('');
                                                setShowRageMenu(false);
                                                if (amount > 0) {
                                                    logClassResourceChange('Rage', amount, clampedV > rageValue, 'rage');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('current', clampedV);
                                                }
                                            }
                                        }}
                                        title="Set Rage Value"
                                    >
                                        <i className="fas fa-check"></i>
                                    </button>
                                </div>

                                <div className="berserker-quick-actions">
                                    <button
                                        onClick={() => setShowRageMenu(false)}
                                        className="context-menu-button"
                                        title="Close"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
                </div>
            </div>
        );

};

export default RageBarResourceBar;