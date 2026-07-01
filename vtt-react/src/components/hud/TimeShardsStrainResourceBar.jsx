import React from 'react';
import ReactDOM from 'react-dom';

const TimeShardsStrainResourceBar = ({
  chronarchState,
  setChronarchState,
  finalClassResource,
  finalConfig,
  character,
  isOwner,
  onClassResourceUpdate,
  size,
  context,
  timeShardsBarRef,
  temporalStrainBarRef,
  setShowTooltip,
  setTooltipPosition,
  renderStatusFlavor,
  logClassResourceChange,
}) => {
  const {
    showTimeShardsMenu,
    showTemporalStrainMenu,
    chronarchHoverSection,
  } = chronarchState;

  const setShowTimeShardsMenu = (value) => setChronarchState(prev => ({ ...prev, showTimeShardsMenu: value }));
  const setShowTemporalStrainMenu = (value) => setChronarchState(prev => ({ ...prev, showTemporalStrainMenu: value }));
  const setChronarchHoverSection = (value) => setChronarchState(prev => ({ ...prev, chronarchHoverSection: value }));

  const chronarchTimeShards = finalClassResource?.timeShards?.current ?? 0;
  const chronarchTimeShardsMax = finalClassResource?.timeShards?.max ?? 10;
  const chronarchTemporalStrain = finalClassResource?.temporalStrain?.current ?? 0;
  const chronarchTemporalStrainMax = finalClassResource?.temporalStrain?.max ?? 10;

        const shardsMax = chronarchTimeShardsMax;
        const strainMax = chronarchTemporalStrainMax;
        const shardsValue = chronarchTimeShards;
        const strainValue = chronarchTemporalStrain;

        // Get strain color based on level
        const getStrainColor = (strain) => {
            const colors = finalConfig.visual?.temporalStrain?.strainColors || {};
            if (strain >= 10) return colors.backlash || '#8b3a2a';
            if (strain >= 9) return colors.critical || '#C62828';
            if (strain >= 7) return colors.danger || '#E53935';
            if (strain >= 5) return colors.warning || '#FB8C00';
            if (strain >= 3) return colors.caution || '#F9A825';
            return colors.safe || '#2E7D32';
        };

        // Get strain state label
        const getStrainState = (strain) => {
            if (strain >= 10) return 'BACKLASH!';
            if (strain >= 9) return 'Critical';
            if (strain >= 7) return 'Danger';
            if (strain >= 5) return 'Warning';
            if (strain >= 3) return 'Caution';
            return 'Safe';
        };

        const strainColor = getStrainColor(strainValue);
        const strainState = getStrainState(strainValue);
        const shouldPulse = strainValue >= 5;
        const shouldFlash = strainValue >= 9;

        return (
            <div className={`class-resource-bar time-shards-strain ${size}`}>
                <div className="chronarch-single-bar">
                    {/* Time Shards Bar (Left Side) */}
                    <div
                        ref={timeShardsBarRef}
                        className="time-shards-bar"
                            onClick={(e) => {
                            e.stopPropagation();
                            if (!isOwner) return; // SECURITY: Only owner can open menu
                            setShowTimeShardsMenu(!showTimeShardsMenu);
                            setShowTemporalStrainMenu(false);
                        }}
                        onMouseEnter={(e) => {
                            setChronarchHoverSection('shards');
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                            setShowTooltip(true);
                        }}
                        onMouseLeave={() => {
                            setChronarchHoverSection(null);
                            setShowTooltip(false);
                        }}
                    >
                        <div className="fluid-bar-container">
                            <div
                                className="fluid-bar-fill"
                                style={{
                                    width: `${(shardsValue / shardsMax) * 100}%`,
                                    background: `linear-gradient(90deg,
                                        ${finalConfig.visual.timeShards.activeColor} 0%,
                                        ${finalConfig.visual.timeShards.activeColor} 70%,
                                        ${finalConfig.visual.timeShards.glowColor} 100%)`,
                                    boxShadow: `0 0 8px ${finalConfig.visual.timeShards.glowColor}`
                                }}
                            />
                        </div>
                        <div className="bar-value">{shardsValue}/{shardsMax}</div>
                    </div>

                    {/* Chronarch Center Divider */}
                    <div className="chronarch-center">
                        <div className="center-ornament">
                            <div className="center-circle"></div>
                            <div className="center-lines">
                                <div className="line line-1"></div>
                                <div className="line line-2"></div>
                                <div className="line line-3"></div>
                                <div className="line line-4"></div>
                            </div>
                        </div>
                    </div>

                    {/* Temporal Strain Bar (Right Side) */}
                    <div
                        ref={temporalStrainBarRef}
                        className={`temporal-strain-bar ${shouldPulse ? 'pulse' : ''} ${shouldFlash ? 'flash' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isOwner) return; // SECURITY: Only owner can open menu
                            setShowTemporalStrainMenu(!showTemporalStrainMenu);
                            setShowTimeShardsMenu(false);
                        }}
                        onMouseEnter={(e) => {
                            setChronarchHoverSection('strain');
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                            setShowTooltip(true);
                        }}
                        onMouseLeave={() => {
                            setChronarchHoverSection(null);
                            setShowTooltip(false);
                        }}
                    >
                        <div className="fluid-bar-container">
                            <div
                                className="fluid-bar-fill"
                                style={{
                                    width: `${(strainValue / strainMax) * 100}%`,
                                    background: `linear-gradient(90deg,
                                        ${strainColor} 0%,
                                        ${strainColor} 70%,
                                        rgba(255, 255, 255, 0.3) 100%)`,
                                    boxShadow: `0 0 8px ${strainColor}`
                                }}
                            />
                        </div>
                        <div className="bar-value" style={{ color: strainColor }}>
                            {strainValue}/{strainMax}
                        </div>
                    </div>

                    {/* Time Shards Adjustment Menu */}
                    {showTimeShardsMenu && timeShardsBarRef.current && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!timeShardsBarRef.current) return '50%';
                                    const rect = timeShardsBarRef.current.getBoundingClientRect();
                                    let hudContainer = timeShardsBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!timeShardsBarRef.current) return '50%';
                                    const rect = timeShardsBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Time Shards: {shardsValue}/{shardsMax}</div>
                                {renderStatusFlavor()}

                                <div className="chronarch-actions">
                                    <div className="chronarch-action-row">
                                        <button
                                            className="context-menu-button gain"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.min(shardsMax, shardsValue + 1);
                                                const amount = newValue - shardsValue;
                                                if (amount > 0) {
                                                    logClassResourceChange('Time Shard', amount, true, 'timeShards');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('timeShards', newValue);
                                                }
                                            }}
                                            title="Cast Spell (+1 Shard)"
                                        >
                                            <i className="fas fa-magic"></i>
                                            <span>+1</span>
                                        </button>
                                    </div>
                                    <div className="chronarch-action-row">
                                        <button
                                            className="context-menu-button spend"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.max(0, shardsValue - 2);
                                                const amount = shardsValue - newValue;
                                                if (amount > 0) {
                                                    logClassResourceChange('Time Shard', amount, false, 'timeShards');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('timeShards', newValue);
                                                }
                                            }}
                                            title="Flux (-2 Shards)"
                                        >
                                            <i className="fas fa-bolt"></i>
                                            <span>-2</span>
                                        </button>
                                        <button
                                            className="context-menu-button spend"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.max(0, shardsValue - 5);
                                                const amount = shardsValue - newValue;
                                                if (amount > 0) {
                                                    logClassResourceChange('Time Shard', amount, false, 'timeShards');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('timeShards', newValue);
                                                }
                                            }}
                                            title="Major (-5 Shards)"
                                        >
                                            <i className="fas fa-fire"></i>
                                            <span>-5</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="chronarch-quick-actions">
                                    <button
                                        onClick={() => {
                                            if (!isOwner) return; // SECURITY: Only owner can modify
                                            const resetAmount = shardsValue;
                                            setShowTimeShardsMenu(false);
                                            if (resetAmount > 0) {
                                                logClassResourceChange('Time Shard', resetAmount, false, 'timeShards');
                                                if (onClassResourceUpdate) onClassResourceUpdate('timeShards', 0);
                                            }
                                        }}
                                        className="context-menu-button"
                                        title="Reset to 0"
                                    >
                                        <i className="fas fa-undo"></i>
                                    </button>
                                    <button
                                        onClick={() => setShowTimeShardsMenu(false)}
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

                    {/* Temporal Strain Adjustment Menu */}
                    {showTemporalStrainMenu && temporalStrainBarRef.current && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!temporalStrainBarRef.current) return '50%';
                                    const rect = temporalStrainBarRef.current.getBoundingClientRect();
                                    let hudContainer = temporalStrainBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!temporalStrainBarRef.current) return '50%';
                                    const rect = temporalStrainBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Temporal Strain: {strainValue}/{strainMax}</div>
                                {renderStatusFlavor()}

                                <div className="chronarch-actions">
                                    <div className="chronarch-action-row">
                                        <button
                                            className="context-menu-button gain"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.min(strainMax, strainValue + 1);
                                                const amount = newValue - strainValue;
                                                if (amount > 0) {
                                                    logClassResourceChange('Temporal Strain', amount, true, 'temporalStrain');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('temporalStrain', newValue);
                                                }
                                            }}
                                            title="Minor Strain (+1)"
                                        >
                                            <i className="fas fa-clock"></i>
                                            <span>+1</span>
                                        </button>
                                        <button
                                            className="context-menu-button gain"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.min(strainMax, strainValue + 3);
                                                const amount = newValue - strainValue;
                                                if (amount > 0) {
                                                    logClassResourceChange('Temporal Strain', amount, true, 'temporalStrain');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('temporalStrain', newValue);
                                                }
                                            }}
                                            title="Major Strain (+3)"
                                        >
                                            <i className="fas fa-history"></i>
                                            <span>+3</span>
                                        </button>
                                    </div>
                                    <div className="chronarch-action-row">
                                        <button
                                            className="context-menu-button heal"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.max(0, strainValue - 1);
                                                const amount = strainValue - newValue;
                                                if (amount > 0) {
                                                    logClassResourceChange('Temporal Strain', amount, false, 'temporalStrain');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('temporalStrain', newValue);
                                                }
                                            }}
                                            title="Decay (-1 Strain)"
                                        >
                                            <i className="fas fa-leaf"></i>
                                            <span>-1</span>
                                        </button>
                                        <button
                                            className="context-menu-button danger"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = 10;
                                                const amount = Math.abs(newValue - strainValue);
                                                if (amount > 0) {
                                                    logClassResourceChange('Temporal Strain', amount, newValue > strainValue, 'temporalStrain');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('temporalStrain', newValue);
                                                }
                                            }}
                                            title="Backlash (Set to 10)"
                                        >
                                            <i className="fas fa-exclamation-triangle"></i>
                                            <span>10</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="chronarch-quick-actions">
                                    <button
                                        onClick={() => {
                                            if (!isOwner) return; // SECURITY: Only owner can modify
                                            const resetAmount = strainValue;
                                            setShowTemporalStrainMenu(false);
                                            if (resetAmount > 0) {
                                                logClassResourceChange('Temporal Strain', resetAmount, false, 'temporalStrain');
                                                if (onClassResourceUpdate) onClassResourceUpdate('temporalStrain', 0);
                                            }
                                        }}
                                        className="context-menu-button"
                                        title="Reset to 0"
                                    >
                                        <i className="fas fa-undo"></i>
                                    </button>
                                    <button
                                        onClick={() => setShowTemporalStrainMenu(false)}
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

export default TimeShardsStrainResourceBar;