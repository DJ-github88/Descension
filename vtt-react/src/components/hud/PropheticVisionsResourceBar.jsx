import React from 'react';
import ReactDOM from 'react-dom';

const PropheticVisionsResourceBar = ({
  oracleState,
  setOracleState,
  uiState,
  setUiState,
  finalClassResource,
  finalConfig,
  character,
  isOwner,
  onClassResourceUpdate,
  size,
  context,
  visionsBarRef,
  renderStatusFlavor,
  logClassResourceChange,
}) => {
  const {
    localVisions,
    oracleSpec,
    predictionAccuracy,
    lastVisionGain,
    showVisionsMenu,
    oracleHoverSection
  } = oracleState;

  const {
    showTooltip,
    tooltipPosition,
    tooltipPlacement,
  } = uiState;

  const setShowTooltip = (value) => setUiState(prev => ({ ...prev, showTooltip: value }));
  const setTooltipPosition = (value) => setUiState(prev => ({ ...prev, tooltipPosition: value }));
  const setTooltipPlacement = (value) => setUiState(prev => ({ ...prev, tooltipPlacement: value }));
  const setLocalVisions = (value) => setOracleState(prev => ({ ...prev, localVisions: value }));
  const setOracleSpec = (value) => setOracleState(prev => ({ ...prev, oracleSpec: value }));
  const setPredictionAccuracy = (value) => setOracleState(prev => ({ ...prev, predictionAccuracy: typeof value === 'function' ? value(prev.predictionAccuracy) : value }));
  const setLastVisionGain = (value) => setOracleState(prev => ({ ...prev, lastVisionGain: typeof value === 'function' ? value(prev.lastVisionGain) : value }));
  const setShowVisionsMenu = (value) => setOracleState(prev => ({ ...prev, showVisionsMenu: value }));
  const setOracleHoverSection = (value) => setOracleState(prev => ({ ...prev, oracleHoverSection: value }));

        const specs = finalConfig.visual || {};
        const currentSpec = specs[oracleSpec] || specs['seer'];
        const maxVisions = specs.max || 10;
        const visionsValue = Math.min(localVisions, maxVisions);
        const specColor = currentSpec.activeColor || '#9370DB';
        const specGlow = currentSpec.glowColor || '#DDA0DD';
        const specIcon = currentSpec.icon || 'fa-eye';
        const specName = currentSpec.name || 'Seer';

        // Calculate visual state based on Vision count
        const getVisionState = () => {
            if (visionsValue >= 8) return 'clarity'; // 8-10: Fully aligned
            if (visionsValue >= 4) return 'stable'; // 4-7: Stable flow
            return 'murky'; // 0-3: Murky foresight
        };

        const visionState = getVisionState();

        // Get opacity based on state
        const getSegmentOpacity = (index) => {
            if (index >= visionsValue) return 0.15; // Empty
            if (visionState === 'clarity') return 1.0;
            if (visionState === 'stable') return 0.85;
            return 0.6; // murky
        };

        const handleBarClick = () => {
            if (!showVisionsMenu) {
                setOracleHoverSection(null);
                setShowTooltip(false);
            }
            setShowVisionsMenu(!showVisionsMenu);
        };

        const handleVisionsBarEnter = (e) => {
            if (showVisionsMenu) return;

            setOracleHoverSection('visions');
            const rect = visionsBarRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;

            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
            setTooltipPlacement(spaceBelow > 400 ? 'below' : (spaceAbove > 400 ? 'above' : 'below'));
            setShowTooltip(true);
        };

        const handleVisionsBarLeave = () => {
            if (showVisionsMenu) return;
            setOracleHoverSection(null);
            setShowTooltip(false);
        };

        const handleVisionsAdjust = (delta) => {
            const newValue = Math.max(0, Math.min(maxVisions, localVisions + delta));
            const actualAmount = Math.abs(newValue - localVisions);
            setLocalVisions(newValue);
            if (actualAmount > 0) {
                logClassResourceChange('Vision', actualAmount, delta > 0, 'visions');
                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
            }
        };

        const handlePredictionSuccess = (type) => {
            const gains = { simple: 1, moderate: 2, complex: 3 };
            const gain = gains[type] || 1;
            const bonusGain = oracleSpec === 'seer' ? 1 : 0; // Seer gets +1
            const totalGain = gain + bonusGain;

            setLocalVisions(Math.min(maxVisions, localVisions + totalGain));
            setPredictionAccuracy(prev => ({
                total: prev.total + 1,
                correct: prev.correct + 1,
                chain: prev.chain + 1
            }));

            // Update last vision gain
            setLastVisionGain(prev => [
                { source: `Correct Prediction (${type})${bonusGain > 0 ? ' +Seer Bonus' : ''}`, amount: totalGain },
                ...prev.slice(0, 2)
            ]);
        };

        const handlePredictionFailure = () => {
            setPredictionAccuracy(prev => ({
                total: prev.total + 1,
                correct: prev.correct,
                chain: 0 // Break the chain
            }));

            // Add visual feedback for failed prediction
            setLastVisionGain(prev => [
                { source: 'Failed Prediction', amount: 0 },
                ...prev.slice(0, 2)
            ]);
        };

        const handleRevelation = () => {
            const gain = 1;
            const newValue = Math.min(maxVisions, localVisions + gain);
            setLocalVisions(newValue);
            if (gain > 0) {
                logClassResourceChange('Vision', gain, true, 'visions');
                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
            }
            setLastVisionGain(prev => [
                { source: 'Revelation', amount: gain },
                ...prev.slice(0, 2)
            ]);
        };


        return (
            <div className={`class-resource-bar prophetic-visions-bar ${size}`}>
                <div className="oracle-container">
                    {/* Prophetic Visions Bar */}
                    <div
                        className="visions-bar-wrapper"
                        ref={visionsBarRef}
                    >
                        {/* Vision count display - centered over bar */}
                        <div className="visions-count-overlay" style={{ color: specGlow }}>
                            {visionsValue}/{maxVisions}
                        </div>

                        {/* Segmented Visions */}
                        <div
                            className={`visions-segments visions-${visionState}`}
                            onClick={handleBarClick}
                            onMouseEnter={handleVisionsBarEnter}
                            onMouseLeave={handleVisionsBarLeave}
                        >
                            {Array.from({ length: maxVisions }, (_, index) => (
                                <div
                                    key={index}
                                    className={`vision-segment ${index < visionsValue ? 'filled' : 'empty'} ${visionState}`}
                                    style={{
                                        backgroundColor: index < visionsValue ? specColor : specs.emptyColor || '#0D0718',
                                        borderColor: specs.segmentBorder || '#2E1A5E',
                                        opacity: getSegmentOpacity(index),
                                        boxShadow: index < visionsValue ? `0 0 6px ${specGlow}` : 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {index < visionsValue && visionState === 'clarity' && (
                                        <i className={`fas ${specIcon}`} style={{
                                            color: '#FFF',
                                            fontSize: '10px',
                                            filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.8))'
                                        }}></i>
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* Visions Adjustment Menu */}
                    {showVisionsMenu && visionsBarRef.current && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!visionsBarRef.current) return '50%';
                                    const rect = visionsBarRef.current.getBoundingClientRect();
                                    let hudContainer = visionsBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!visionsBarRef.current) return '50%';
                                    const rect = visionsBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Visions: {visionsValue}/{maxVisions}</div>
                                {renderStatusFlavor()}

                                <div className="oracle-specs">
                                    {['seer', 'truthseeker', 'fateseer'].map((spec) => {
                                        const specConfig = specs[spec];
                                        const isSelected = oracleSpec === spec;
                                        return (
                                            <button
                                                key={spec}
                                                className={`oracle-spec-btn ${isSelected ? 'active' : ''}`}
                                                onClick={() => setOracleSpec(spec)}
                                                title={`${specConfig.name}: ${specConfig.theme}`}
                                            >
                                                <i className={`fas ${specConfig.icon}`}></i>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="oracle-adjust-controls">
                                    <div className="oracle-adjust-row">
                                        <button
                                            className="context-menu-button decrease"
                                            onClick={() => handleVisionsAdjust(-1)}
                                            disabled={visionsValue === 0}
                                            title="Decrease Visions (-1)"
                                        >
                                            <i className="fas fa-minus"></i>
                                            <span>-1</span>
                                        </button>
                                        <button
                                            className="context-menu-button increase"
                                            onClick={() => handleVisionsAdjust(1)}
                                            disabled={visionsValue === maxVisions}
                                            title="Increase Visions (+1)"
                                        >
                                            <i className="fas fa-plus"></i>
                                            <span>+1</span>
                                        </button>
                                    </div>
                                    <div className="oracle-quick-adjust-row">
                                        <button
                                            className="context-menu-button"
                                            onClick={() => {
                                                const resetAmount = visionsValue;
                                                setLocalVisions(0);
                                                if (resetAmount > 0) {
                                                    logClassResourceChange('Vision', resetAmount, false, 'visions');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('current', 0);
                                                }
                                            }}
                                            title="Clear (0)"
                                        >
                                            <i className="fas fa-eraser"></i>
                                        </button>
                                        <button
                                            className="context-menu-button"
                                            onClick={() => {
                                                const newValue = 3;
                                                const amount = Math.abs(newValue - visionsValue);
                                                setLocalVisions(newValue);
                                                if (amount > 0) {
                                                    logClassResourceChange('Vision', amount, newValue > visionsValue, 'visions');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                                }
                                            }}
                                            title="Reset (3)"
                                        >
                                            <i className="fas fa-undo"></i>
                                        </button>
                                        <button
                                            className="context-menu-button"
                                            onClick={() => {
                                                const gainAmount = maxVisions - visionsValue;
                                                setLocalVisions(maxVisions);
                                                if (gainAmount > 0) {
                                                    logClassResourceChange('Vision', gainAmount, true, 'visions');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('current', maxVisions);
                                                }
                                            }}
                                            title={`Max (${maxVisions})`}
                                        >
                                            <i className="fas fa-crown"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="oracle-predictions">
                                    <div className="oracle-prediction-row">
                                        <button
                                            className="context-menu-button success"
                                            onClick={() => handlePredictionSuccess('simple')}
                                            title={`Simple (+1${oracleSpec === 'seer' ? '+1' : ''})`}
                                        >
                                            <i className="fas fa-check"></i>
                                            <span>+1</span>
                                        </button>
                                        <button
                                            className="context-menu-button success"
                                            onClick={() => handlePredictionSuccess('moderate')}
                                            title={`Moderate (+2${oracleSpec === 'seer' ? '+1' : ''})`}
                                        >
                                            <i className="fas fa-check-double"></i>
                                            <span>+2</span>
                                        </button>
                                    </div>
                                    <div className="oracle-prediction-row">
                                        <button
                                            className="context-menu-button success"
                                            onClick={() => handlePredictionSuccess('complex')}
                                            title={`Complex (+3${oracleSpec === 'seer' ? '+1' : ''})`}
                                        >
                                            <i className="fas fa-star"></i>
                                            <span>+3</span>
                                        </button>
                                        <button
                                            className="context-menu-button danger"
                                            onClick={handlePredictionFailure}
                                            title="Failed Prediction"
                                        >
                                            <i className="fas fa-times"></i>
                                            <span>Fail</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="oracle-other-actions">
                                    <button
                                        className="context-menu-button special"
                                        onClick={handleRevelation}
                                        title="Revelation (+1 Vision)"
                                    >
                                        <i className="fas fa-lightbulb"></i>
                                        <span>+1</span>
                                    </button>
                                </div>

                                <div className="oracle-quick-actions">
                                    <button
                                        onClick={() => setShowVisionsMenu(false)}
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

export default PropheticVisionsResourceBar;