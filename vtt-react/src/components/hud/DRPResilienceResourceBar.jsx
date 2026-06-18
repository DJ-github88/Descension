import React from 'react';

const DRPResilienceResourceBar = ({
  dreadnaughtState,
  setDreadnaughtState,
  uiState,
  setUiState,
  finalClassResource,
  finalConfig,
  character,
  isOwner,
  onClassResourceUpdate,
  size,
  context,
  drpBarRef
}) => {
  const {
    localDRP,
    selectedResistanceType,
    showDRPMenu,
    dreadnaughtHoverSection
  } = dreadnaughtState;

  const {
    showTooltip,
    tooltipPosition,
    tooltipPlacement,
  } = uiState;

  const setShowTooltip = (value) => setUiState(prev => ({ ...prev, showTooltip: value }));
  const setTooltipPosition = (value) => setUiState(prev => ({ ...prev, tooltipPosition: value }));
  const setTooltipPlacement = (value) => setUiState(prev => ({ ...prev, tooltipPlacement: value }));

        const drpValue = localDRP;
        const drpMax = finalClassResource.max || 50;
        const drpPercentage = (drpValue / drpMax) * 100;

        // Calculate passive benefits
        const hasPassiveBenefits = drpValue >= 10;
        const regenAmount = Math.floor(drpValue / 10); // 1 HP per 10 DRP
        const emergencyHP = drpValue * 2; // Dark Rebirth potential

        // Get DRP color based on level
        const getDRPColor = (drp) => {
            if (drp >= 40) return '#8B00FF'; // Intense purple glow
            if (drp >= 30) return '#9370DB'; // Bright purple
            if (drp >= 20) return '#6A0DAD'; // Medium purple
            if (drp >= 10) return '#4B0082'; // Indigo (passive benefits active)
            return '#2E0854'; // Dim purple
        };

        const drpColor = getDRPColor(drpValue);

        // Damage type options for resistance with their glow colors
        const damageTypes = {
            'Slashing': '#C0C0C0',      // Silver
            'Piercing': '#B87333',      // Copper
            'Bludgeoning': '#8B7355',   // Burlywood
            'Fire': '#FF4500',          // Orange-red
            'Frost': '#00CED1',          // Dark turquoise
            'Lightning': '#FFD700',     // Gold
            'Poison': '#9ACD32',        // Yellow-green
            'Necrotic': '#8B008B',      // Dark magenta
            'Radiant': '#FFD700',       // Gold
            'Force': '#9370DB',         // Medium purple
            'Psychic': '#FF1493'        // Deep pink
        };

        // Get glow color based on resistance type (when 10+ DRP)
        const getGlowColor = () => {
            if (hasPassiveBenefits && damageTypes[selectedResistanceType]) {
                return damageTypes[selectedResistanceType];
            }
            return finalConfig.visual.glowColor; // Default purple glow
        };

        const glowColor = getGlowColor();

        // Helper functions
        const addDRP = (amount) => {
            const newValue = Math.min(localDRP + amount, drpMax);
            const actualAmount = newValue - localDRP;
            setLocalDRP(newValue);
            if (actualAmount > 0) {
                logClassResourceChange('DRP', actualAmount, true, 'drp');
                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
            }
        };

        const removeDRP = (amount) => {
            const newValue = Math.max(localDRP - amount, 0);
            const actualAmount = localDRP - newValue;
            setLocalDRP(newValue);
            if (actualAmount > 0) {
                logClassResourceChange('DRP', actualAmount, false, 'drp');
                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
            }
        };

        const simulateDamage = (damage) => {
            const drpGained = Math.floor(damage / 5);
            addDRP(drpGained);
        };

        const handleDRPBarEnter = (e) => {
            if (drpBarRef.current) {
                setDreadnaughtHoverSection('drp');
                const rect = drpBarRef.current.getBoundingClientRect();
                setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                setShowTooltip(true);
            }
        };

        const handleDRPBarLeave = () => {
            setDreadnaughtHoverSection(null);
            setShowTooltip(false);
        };

        return (
            <div className={`class-resource-bar drp-resilience ${size}`}>
                <div className="drp-bar-wrapper">
                    <div className="drp-bar-container" ref={drpBarRef} onMouseEnter={handleDRPBarEnter} onMouseLeave={handleDRPBarLeave} onClick={(e) => {
                        e.stopPropagation();
                        setShowDRPMenu(v => !v);
                    }} style={{ cursor: 'pointer' }}>
                        <div className="bar-background" style={{
                            borderColor: hasPassiveBenefits ? glowColor : 'rgba(139, 0, 255, 0.4)',
                            boxShadow: hasPassiveBenefits ? `inset 0 2px 4px rgba(0, 0, 0, 0.5), 0 0 8px ${glowColor}` : 'inset 0 2px 4px rgba(0, 0, 0, 0.5)'
                        }}>
                            {/* Segmented bar with threshold markers */}
                            <div className="drp-segments">
                                {Array.from({ length: 5 }, (_, sectionIdx) => (
                                    <div key={sectionIdx} className="drp-section">
                                        {Array.from({ length: 10 }, (_, segIdx) => {
                                            const segmentNumber = sectionIdx * 10 + segIdx;
                                            const isFilled = segmentNumber < drpValue;
                                            return (
                                                <div
                                                    key={segIdx}
                                                    className={`drp-segment ${isFilled ? 'filled' : 'empty'}`}
                                                    style={{
                                                        backgroundColor: isFilled ? drpColor : finalConfig.visual.baseColor,
                                                        boxShadow: isFilled ? `0 0 3px ${drpColor}` : 'none'
                                                    }}
                                                />
                                            );
                                        })}
                                        {/* Threshold marker at 10, 20, 30, 40, 50 */}
                                        <div className="drp-threshold-marker" title={`${(sectionIdx + 1) * 10} DRP`} />
                                    </div>
                                ))}
                            </div>
                            <div className="bar-text">
                                {drpValue}/{drpMax} DRP
                            </div>
                        </div>
                    </div>

                    {/* Control menu */}
                    {showDRPMenu && drpBarRef.current && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact dreadnaught-drp-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!drpBarRef.current) return '50%';
                                    const rect = drpBarRef.current.getBoundingClientRect();
                                    let hudContainer = drpBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!drpBarRef.current) return '50%';
                                    const rect = drpBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">DRP: {drpValue}/{drpMax}</div>
                                {renderStatusFlavor()}

                                {/* Gain/Spend Actions */}
                                <div className="context-menu-section">
                                    <div className="context-menu-section-header">Adjust</div>
                                    <div className="dreadnaught-action-grid">
                                        <button
                                            className="context-menu-button gain"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addDRP(5);
                                            }}
                                            title="Gain 5 DRP"
                                        >
                                            <i className="fas fa-plus"></i> +5
                                        </button>
                                        <button
                                            className="context-menu-button gain"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addDRP(10);
                                            }}
                                            title="Gain 10 DRP"
                                        >
                                            <i className="fas fa-plus-circle"></i> +10
                                        </button>
                                        <button
                                            className="context-menu-button spend"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeDRP(5);
                                            }}
                                            title="Spend 5 DRP"
                                        >
                                            <i className="fas fa-minus"></i> -5
                                        </button>
                                        <button
                                            className="context-menu-button spend"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeDRP(10);
                                            }}
                                            title="Spend 10 DRP"
                                        >
                                            <i className="fas fa-minus-circle"></i> -10
                                        </button>
                                    </div>
                                </div>

                                {/* Damage Simulation */}
                                <div className="context-menu-section">
                                    <div className="context-menu-section-header">Simulate Damage</div>
                                    <div className="dreadnaught-damage-grid">
                                        <button
                                            className="context-menu-button gain"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                simulateDamage(25);
                                            }}
                                            title="Take 25 Damage (+5 DRP)"
                                        >
                                            <i className="fas fa-heart-broken"></i> 25
                                        </button>
                                        <button
                                            className="context-menu-button danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                simulateDamage(50);
                                            }}
                                            title="Take 50 Damage (+10 DRP)"
                                        >
                                            <i className="fas fa-heart-broken"></i> 50
                                        </button>
                                    </div>
                                </div>

                                {/* Resistance Selection */}
                                {hasPassiveBenefits && (
                                    <div className="context-menu-section">
                                        <div className="context-menu-section-header">Resistance</div>
                                        <select
                                            className="dreadnaught-resistance-select"
                                            value={selectedResistanceType}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                setSelectedResistanceType(e.target.value);
                                            }}
                                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                        >
                                            {Object.keys(damageTypes).map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Quick Actions */}
                                <div className="dreadnaught-quick-actions">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLocalDRP(0);
                                        }}
                                        className="context-menu-button"
                                        title="Reset to 0"
                                    >
                                        <i className="fas fa-undo"></i>
                                        <span>Reset</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLocalDRP(drpMax);
                                        }}
                                        className="context-menu-button"
                                        title={`Set to Max (${drpMax})`}
                                    >
                                        <i className="fas fa-maximize"></i>
                                        <span>Max</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowDRPMenu(false);
                                        }}
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

                </div>
            </div>
        );

};

export default DRPResilienceResourceBar;