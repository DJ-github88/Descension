import React from 'react';

const DevotionGaugeResourceBar = ({
  martyrState,
  setMartyrState,
  uiState,
  setUiState,
  finalClassResource,
  finalConfig,
  character,
  isOwner,
  onClassResourceUpdate,
  size,
  context,
  devotionBarRef,
  martyrTooltipRef
}) => {
  const {
    localDevotionLevel,
    localDevotionDamage,
    martyrSpec,
    showDevotionMenu,
    showMartyrSpecMenu,
    martyrHoverSection
  } = martyrState;

  const {
    showTooltip,
    tooltipPosition,
    tooltipPlacement,
  } = uiState;

  const setShowTooltip = (value) => setUiState(prev => ({ ...prev, showTooltip: value }));
  const setTooltipPosition = (value) => setUiState(prev => ({ ...prev, tooltipPosition: value }));
  const setTooltipPlacement = (value) => setUiState(prev => ({ ...prev, tooltipPlacement: value }));

        const maxLevel = 6;
        const thresholds = finalConfig.mechanics?.thresholds || [0, 10, 20, 40, 60, 80, 100];
        const currentLevel = localDevotionLevel;
        const currentDamage = localDevotionDamage;

        // Get specialization colors
        const specColors = finalConfig.visual[martyrSpec] || finalConfig.visual.redemption;
        const activeColor = specColors.activeColor;
        const glowColor = specColors.glowColor;

        // Get current and next threshold
        const currentThreshold = thresholds[currentLevel];
        const nextThreshold = currentLevel < maxLevel ? thresholds[currentLevel + 1] : thresholds[maxLevel];

        // Calculate progress toward next level
        const damageIntoLevel = currentDamage - currentThreshold;
        const damageNeeded = nextThreshold - currentThreshold;
        const progressPercentage = currentLevel >= maxLevel ? 100 : (damageIntoLevel / damageNeeded) * 100;

        // Get current stage info
        const currentStage = finalConfig.stages?.[currentLevel] || { name: 'Unknown', passive: 'None' };

        // Get specialization passives
        const specData = finalConfig.specializations?.[martyrSpec] || finalConfig.specializations?.redemption;

        // Handlers
        const handleDevotionClick = () => {
            setShowDevotionMenu(!showDevotionMenu);
            if (!showDevotionMenu) {
                setShowTooltip(false);
                setMartyrHoverSection(null);
            }
        };

        const handleDevotionEnter = (e) => {
            if (showDevotionMenu) return;
            setMartyrHoverSection('devotion');
            const rect = e.currentTarget.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            // Adjust x position to keep tooltip in viewport
            let x = rect.left + rect.width / 2;
            const tooltipWidth = 320;
            if (x + tooltipWidth / 2 > viewportWidth) {
                x = viewportWidth - tooltipWidth / 2 - 10;
            } else if (x - tooltipWidth / 2 < 0) {
                x = tooltipWidth / 2 + 10;
            }

            // Estimate tooltip height and check if there's space above or below
            const estimatedTooltipHeight = 250; // Approximate height of the tooltip
            const spaceAbove = rect.top;
            const spaceBelow = viewportHeight - rect.bottom;

            // Determine placement: prefer above, but use below if not enough space
            let placement = 'above';
            let y = rect.top;

            if (spaceAbove < estimatedTooltipHeight && spaceBelow > spaceAbove) {
                // Not enough space above and more space below
                placement = 'below';
                y = rect.bottom;
            }

            setTooltipPlacement(placement);
            setTooltipPosition({ x, y });
            setShowTooltip(true);
        };

        const handleDevotionLeave = () => {
            if (showDevotionMenu) return;
            setMartyrHoverSection(null);
            setShowTooltip(false);
        };

        const handleLevelChange = (newLevel) => {
            const clampedLevel = Math.max(0, Math.min(newLevel, maxLevel));
            setLocalDevotionLevel(clampedLevel);
            setLocalDevotionDamage(thresholds[clampedLevel]);
        };

        const handleDamageChange = (newDamage) => {
            const clampedDamage = Math.max(0, Math.min(newDamage, 150));
            setLocalDevotionDamage(clampedDamage);

            // Auto-adjust level based on damage
            let newLevel = 0;
            for (let i = maxLevel; i >= 0; i--) {
                if (clampedDamage >= thresholds[i]) {
                    newLevel = i;
                    break;
                }
            }
            setLocalDevotionLevel(newLevel);
        };

        return (
            <div className={`class-resource-bar devotion-gauge ${size}`}>
                <div className="devotion-bar-wrapper">
                    <div
                        className="devotion-bar-container"
                        ref={devotionBarRef}
                        onMouseEnter={handleDevotionEnter}
                        onMouseLeave={handleDevotionLeave}
                        onClick={handleDevotionClick}
                        style={{ cursor: 'pointer' }}
                    >
                        {/* Segmented devotion bar */}
                        <div className="devotion-segments">
                            {Array.from({ length: maxLevel }, (_, index) => {
                                const level = index + 1;
                                const isFilled = level <= currentLevel;
                                const isPartiallyFilled = level === currentLevel + 1 && currentLevel < maxLevel;

                                return (
                                    <div
                                        key={index}
                                        className={`devotion-segment ${isFilled ? 'filled' : isPartiallyFilled ? 'partial' : 'empty'}`}
                                        style={{
                                            backgroundColor: isFilled ? activeColor : finalConfig.visual.emptyColor,
                                            borderColor: finalConfig.visual.segmentBorder,
                                            boxShadow: isFilled ? `0 0 8px ${glowColor}` : 'none',
                                            position: 'relative'
                                        }}
                                    >
                                        {/* Progress fill for partial segment */}
                                        {isPartiallyFilled && (
                                            <div
                                                className="devotion-segment-progress"
                                                style={{
                                                    width: `${progressPercentage}%`,
                                                    backgroundColor: activeColor,
                                                    boxShadow: `0 0 6px ${glowColor}`
                                                }}
                                            />
                                        )}
                                        {/* Level number */}
                                        <span className="devotion-level-number" style={{
                                            color: isFilled ? '#FFF' : '#666',
                                            fontWeight: 'bold',
                                            fontSize: '8px',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            zIndex: 2
                                        }}>
                                            {level}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Damage display */}
                        <div className="devotion-damage-display" style={{ color: glowColor }}>
                            {currentDamage}/{nextThreshold}
                        </div>
                    </div>

                    {/* Devotion Menu */}
                    {showDevotionMenu && devotionBarRef.current && ReactDOM.createPortal(
                        <div
                            className="unified-context-menu compact"
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!devotionBarRef.current) return '50%';
                                    const rect = devotionBarRef.current.getBoundingClientRect();
                                    let hudContainer = devotionBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!devotionBarRef.current) return '50%';
                                    const rect = devotionBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Level {currentLevel}: {currentStage.name}</div>
                                {renderStatusFlavor()}

                                <div className="martyr-level-controls">
                                    <button
                                        className="context-menu-button"
                                        onClick={() => handleLevelChange(currentLevel - 1)}
                                        disabled={currentLevel === 0}
                                        title="Decrease Level"
                                    >
                                        <i className="fas fa-minus"></i>
                                    </button>
                                    <span className="martyr-level-display">{currentLevel}/{maxLevel}</span>
                                    <button
                                        className="context-menu-button"
                                        onClick={() => handleLevelChange(currentLevel + 1)}
                                        disabled={currentLevel === maxLevel}
                                        title="Increase Level"
                                    >
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>

                                <div className="martyr-damage-section">
                                    <div className="martyr-damage-input-row">
                                        <input
                                            type="number"
                                            className="martyr-damage-input"
                                            value={currentDamage}
                                            onChange={(e) => handleDamageChange(parseInt(e.target.value) || 0)}
                                            min="0"
                                            max="150"
                                        />
                                        <div className="martyr-damage-quick-btns">
                                            <button
                                                onClick={() => handleDamageChange(currentDamage + 10)}
                                                className="context-menu-button"
                                                title="Add 10 Damage"
                                            >
                                                +10
                                            </button>
                                            <button
                                                onClick={() => handleDamageChange(currentDamage + 20)}
                                                className="context-menu-button"
                                                title="Add 20 Damage"
                                            >
                                                +20
                                            </button>
                                        </div>
                                    </div>
                                    <div className="martyr-damage-info">
                                        Next: {nextThreshold} ({nextThreshold - currentDamage} needed)
                                    </div>
                                </div>


                                <div className="martyr-quick-actions">
                                    <button
                                        onClick={() => handleDamageChange(0)}
                                        className="context-menu-button"
                                        title="Reset Damage to 0"
                                    >
                                        <i className="fas fa-undo"></i>
                                    </button>
                                    <button
                                        onClick={() => setShowDevotionMenu(false)}
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

                {/* Tooltip */}
                {showTooltip && martyrHoverSection === 'devotion' && ReactDOM.createPortal(
                    <div ref={martyrTooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                        <div className="tooltip-header" style={{ color: getTooltipHeaderColor('#9CA3AF') }}>Devotion</div>

                        <div className="tooltip-section">
                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                <strong>Level:</strong> {currentLevel} ({currentStage.name})
                            </div>
                            <div style={{ fontSize: '0.9rem' }}>
                                <strong>Damage:</strong> {currentDamage}/{nextThreshold}
                            </div>
                        </div>

                        <div className="tooltip-divider"></div>

                        <div className="tooltip-section">
                            <div className="tooltip-label">Devotion Management</div>
                            <div className="level-management">
                                <strong>Gain:</strong>
                                <span>Take damage, +1 per Intervene</span>
                                <strong>Spend:</strong>
                                <span>Amplify spells (1-5 levels)</span>
                            </div>
                        </div>

                        {currentLevel > 0 && (
                            <div>
                                <div className="tooltip-divider"></div>
                                <div className="tooltip-section">
                                    <div className="tooltip-label">Level {currentLevel} Passive</div>
                                    <div className="passive-desc">
                                        {currentStage.passive}
                                    </div>
                                </div>
                            </div>
                        )}

                        {specData && (
                            <div>
                                <div className="tooltip-divider"></div>
                                <div className="tooltip-section">
                                    <div className="tooltip-label">{specData.name} Passives</div>
                                    <div className="passive-desc">
                                        <strong>Shared:</strong> {specData.sharedPassive.description}<br />
                                        <strong>Unique:</strong> {specData.uniquePassive.description}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>,
                    document.body
                )}
            </div>
        );

};

export default DevotionGaugeResourceBar;