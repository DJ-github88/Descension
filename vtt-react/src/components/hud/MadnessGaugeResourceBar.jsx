import React from 'react';

const MadnessGaugeResourceBar = ({
  falseProphetState,
  setFalseProphetState,
  uiState,
  setUiState,
  finalClassResource,
  finalConfig,
  character,
  isOwner,
  onClassResourceUpdate,
  size,
  context,
  madnessBarRef,
}) => {
  const { localMadness, showMadnessMenu, falseProphetHoverSection } = falseProphetState;
  const { showTooltip, tooltipPosition, tooltipPlacement } = uiState;
  const setShowTooltip = (value) => setUiState(prev => ({ ...prev, showTooltip: value }));
  const setTooltipPosition = (value) => setUiState(prev => ({ ...prev, tooltipPosition: value }));
  const setTooltipPlacement = (value) => setUiState(prev => ({ ...prev, tooltipPlacement: value }));
  const setLocalMadness = (value) => setFalseProphetState(prev => ({ ...prev, localMadness: value }));
  const setShowMadnessMenu = (value) => setFalseProphetState(prev => ({ ...prev, showMadnessMenu: value }));
  const setFalseProphetHoverSection = (value) => setFalseProphetState(prev => ({ ...prev, falseProphetHoverSection: value }));

        // Use local state for demo, fallback to classResource
        const currentMadness = localMadness ?? classResource?.current ?? 0;
        const maxMadness = finalConfig.mechanics?.max ?? 20;

        const dangerLevel = getDangerLevel(currentMadness);

        // Get segment color based on index
        const getSegmentColor = (index) => {
            if (index < 6) return finalConfig.visual.safeColor;
            if (index < 10) return finalConfig.visual.moderateColor;
            if (index < 15) return finalConfig.visual.highColor;
            if (index < 20) return finalConfig.visual.dangerColor;
            return finalConfig.visual.convulsionColor;
        };

        // Adjustment functions
        const gainMadness = (amount) => {
            const newValue = Math.min(maxMadness, currentMadness + amount);
            const actualAmount = newValue - currentMadness;
            setLocalMadness(newValue);
            if (actualAmount > 0) {
                logClassResourceChange('Madness', actualAmount, true, 'madness');
                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
            }
        };

        const spendMadness = (amount) => {
            const newValue = Math.max(0, currentMadness - amount);
            const actualAmount = currentMadness - newValue;
            setLocalMadness(newValue);
            if (actualAmount > 0) {
                logClassResourceChange('Madness', actualAmount, false, 'madness');
                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
            }
        };

        const resetMadness = () => {
            const resetAmount = currentMadness;
            setLocalMadness(0);
            if (resetAmount > 0) {
                logClassResourceChange('Madness', resetAmount, false, 'madness');
                if (onClassResourceUpdate) onClassResourceUpdate('current', 0);
            }
        };

        const setToConvulsion = () => {
            const newValue = 20;
            const amount = Math.abs(newValue - currentMadness);
            setLocalMadness(newValue);
            if (amount > 0) {
                logClassResourceChange('Madness', amount, newValue > currentMadness, 'madness');
                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
            }
        };

        // Tooltip handlers
        const handleMadnessBarEnter = (e) => {
            setFalseProphetHoverSection('madness');
            const rect = madnessBarRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;

            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
            setTooltipPlacement(spaceBelow > 400 ? 'below' : (spaceAbove > 400 ? 'above' : 'below'));
            setShowTooltip(true);
        };

        const handleMadnessBarLeave = () => {
            setFalseProphetHoverSection(null);
            setShowTooltip(false);
        };

        const handleBarClick = () => {
            setShowMadnessMenu(!showMadnessMenu);
        };

        return (
            <div className={`class-resource-bar madness-gauge ${size}`}>
                <div className="madness-bar-wrapper">
                    <div
                        className="madness-bar-container"
                        ref={madnessBarRef}
                        onMouseEnter={handleMadnessBarEnter}
                        onMouseLeave={handleMadnessBarLeave}
                        onClick={handleBarClick}
                        style={{ cursor: 'pointer' }}
                    >
                        {/* Segmented madness bar */}
                        <div className="madness-segments">
                            {Array.from({ length: maxMadness }, (_, index) => (
                                <div
                                    key={index}
                                    className={`madness-segment ${index < currentMadness ? 'filled' : 'empty'}`}
                                    style={{
                                        backgroundColor: index < currentMadness ? getSegmentColor(index) : finalConfig.visual.baseColor,
                                        borderColor: finalConfig.visual.segmentBorder,
                                        boxShadow: index < currentMadness ? `0 0 4px ${getSegmentColor(index)}` : 'none'
                                    }}
                                />
                            ))}
                        </div>

                        {/* Madness value label */}
                        <div className="madness-value-label">
                            {currentMadness} / {maxMadness}
                        </div>
                    </div>

                    {/* Adjustment Menu */}
                    {showMadnessMenu && madnessBarRef.current && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!madnessBarRef.current) return '50%';
                                    const rect = madnessBarRef.current.getBoundingClientRect();
                                    let hudContainer = madnessBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!madnessBarRef.current) return '50%';
                                    const rect = madnessBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Madness: {currentMadness}/{maxMadness}</div>
                                {renderStatusFlavor()}

                                <div className="falseprophet-actions">
                                    <div className="falseprophet-action-row">
                                        <button onClick={() => gainMadness(1)} className="context-menu-button gain" title="Gain 1 Madness">
                                            <i className="fas fa-plus"></i>
                                            <span>+1</span>
                                        </button>
                                        <button onClick={() => gainMadness(3)} className="context-menu-button gain" title="Gain 1d4 Madness (3)">
                                            <i className="fas fa-dice-d6"></i>
                                            <span>+3</span>
                                        </button>
                                        <button onClick={() => gainMadness(4)} className="context-menu-button gain" title="Gain 1d6 Madness (4)">
                                            <i className="fas fa-dice-d6"></i>
                                            <span>+4</span>
                                        </button>
                                        <button onClick={() => gainMadness(5)} className="context-menu-button gain" title="Gain 1d8 Madness (5)">
                                            <i className="fas fa-dice-d8"></i>
                                            <span>+5</span>
                                        </button>
                                    </div>
                                    <div className="falseprophet-action-row">
                                        <button onClick={() => spendMadness(1)} className="context-menu-button spend" title="Spend 1 Madness">
                                            <i className="fas fa-minus"></i>
                                            <span>-1</span>
                                        </button>
                                        <button onClick={() => spendMadness(3)} className="context-menu-button spend" title="Spend 1d4 Madness (3)">
                                            <i className="fas fa-dice-d6"></i>
                                            <span>-3</span>
                                        </button>
                                        <button onClick={() => spendMadness(4)} className="context-menu-button spend" title="Spend 1d6 Madness (4)">
                                            <i className="fas fa-dice-d6"></i>
                                            <span>-4</span>
                                        </button>
                                        <button onClick={() => spendMadness(5)} className="context-menu-button spend" title="Spend 1d8 Madness (5)">
                                            <i className="fas fa-dice-d8"></i>
                                            <span>-5</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="falseprophet-quick-actions">
                                    <button
                                        onClick={() => { resetMadness(); setShowMadnessMenu(false); }}
                                        className="context-menu-button danger"
                                        title="Reset to 0"
                                    >
                                        <i className="fas fa-undo"></i>
                                    </button>
                                    <button
                                        onClick={setToConvulsion}
                                        className="context-menu-button danger"
                                        title="Set to 20 (Convulsion)"
                                    >
                                        <i className="fas fa-exclamation-triangle"></i>
                                    </button>
                                    <button
                                        onClick={() => setShowMadnessMenu(false)}
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

export default MadnessGaugeResourceBar;
