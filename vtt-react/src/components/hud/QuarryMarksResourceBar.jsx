import React from 'react';

const QuarryMarksResourceBar = ({
  huntressState,
  setHuntressState,
  uiState,
  setUiState,
  finalClassResource,
  finalConfig,
  character,
  isOwner,
  onClassResourceUpdate,
  size,
  context,
  qmBarRef
}) => {
  const {
    localQuarryMarks,
    huntressSpec,
    companionHP,
    companionMaxHP,
    showQMMenu,
    showHuntressSpecMenu,
    huntressHoverSection
  } = huntressState;

  const {
    showTooltip,
    tooltipPosition,
    tooltipPlacement,
  } = uiState;

  const setShowTooltip = (value) => setUiState(prev => ({ ...prev, showTooltip: value }));
  const setTooltipPosition = (value) => setUiState(prev => ({ ...prev, tooltipPosition: value }));
  const setTooltipPlacement = (value) => setUiState(prev => ({ ...prev, tooltipPlacement: value }));

        const specs = finalConfig.visual?.quarryMarks || {};
        const maxQM = finalClassResource.max ?? 5;
        const qmValue = Math.min(finalClassResource.current ?? localQuarryMarks, maxQM);
        const specColor = '#DC143C';
        const specGlow = '#FF6B6B';
        const specIcon = 'fa-khanda';

        // Companion info
        const companionHPValue = finalClassResource.companionHP ?? companionHP;
        const companionMaxHPValue = finalClassResource.companionMaxHP ?? companionMaxHP;
        const companionHPPercent = (companionHPValue / companionMaxHPValue) * 100;

        // Get companion HP bar color
        const getCompanionHPColor = () => {
            if (companionHPPercent > 60) return '#2E7D32'; // Green
            if (companionHPPercent > 30) return '#C67100'; // Dark Yellow/Gold
            return '#C62828'; // Red
        };

        const handleBarClick = () => {
            if (!showQMMenu) {
                // Hide tooltip when opening menu
                setHuntressHoverSection(null);
                setShowTooltip(false);
            }
            setShowQMMenu(!showQMMenu);
        };

        return (
            <div className={`class-resource-bar quarry-marks-companion ${size}`}>
                <div className="huntress-single-bar" style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '4px' }}>
                    {/* Quarry Marks Bar (Left) */}
                    <div
                        className="qm-bar-wrapper"
                        ref={qmBarRef}
                        onClick={handleBarClick}
                        onMouseEnter={(e) => {
                            if (!showQMMenu) {
                                setHuntressHoverSection('marks');
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                                setShowTooltip(true);
                            }
                        }}
                        onMouseLeave={() => {
                            setHuntressHoverSection(null);
                            setShowTooltip(false);
                        }}
                        style={{ cursor: isOwner ? 'pointer' : 'default', flex: 1 }}
                    >
                        {/* Segmented Quarry Marks */}
                        <div
                            className="qm-segments"
                            style={{ display: 'flex', gap: '2px', width: '100%' }}
                        >
                            {Array.from({ length: maxQM }, (_, index) => (
                                <div
                                    key={index}
                                    className={`qm-segment ${index < qmValue ? 'filled' : 'empty'}`}
                                    style={{
                                        flex: 1,
                                        height: size === 'large' ? '18px' : '12px',
                                        backgroundColor: index < qmValue ? specColor : 'rgba(26, 15, 8, 0.15)',
                                        border: '1px solid #4A2C1A',
                                        borderRadius: '3px',
                                        boxShadow: index < qmValue ? `0 0 6px ${specGlow}` : 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {index < qmValue && (
                                        <i className="fas fa-khanda" style={{ color: '#FFF', fontSize: '8px' }}></i>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Center Divider: Paw icon */}
                    <div className="huntress-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-paw" style={{ color: '#4A2C1A', fontSize: '10px', opacity: 0.7, margin: '0 2px' }}></i>
                    </div>

                    {/* Companion HP Bar (Right) */}
                    <div
                        className="companion-hp-bar"
                        onClick={handleBarClick}
                        onMouseEnter={(e) => {
                            if (!showQMMenu) {
                                setHuntressHoverSection('companion');
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                                setShowTooltip(true);
                            }
                        }}
                        onMouseLeave={() => {
                            setHuntressHoverSection(null);
                            setShowTooltip(false);
                        }}
                        style={{
                            flex: 1,
                            cursor: isOwner ? 'pointer' : 'default',
                            display: 'flex',
                            alignItems: 'center',
                            height: size === 'large' ? '18px' : '12px',
                            background: 'rgba(34, 197, 94, 0.05)',
                            border: '1px solid #4A2C1A',
                            borderRadius: '4px',
                            position: 'relative',
                            padding: '0 6px',
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            className="companion-hp-fill"
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                width: `${companionHPPercent}%`,
                                background: `linear-gradient(90deg, ${getCompanionHPColor()} 0%, #22C55E 100%)`,
                                opacity: 0.25,
                                transition: 'width 0.2s ease-out'
                            }}
                        />
                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', width: '100%', fontSize: '9px', fontWeight: 'bold', color: '#1B5E20', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            <span>{size === 'small' || context === 'party' ? `${companionHPValue}/${companionMaxHPValue} HP` : `Comp: ${companionHPValue}/${companionMaxHPValue}`}</span>
                        </div>
                    </div>
                </div>

                {/* QM & Companion HP Adjustment Menu */}
                {showQMMenu && qmBarRef.current && ReactDOM.createPortal(
                    <div
                        className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                        onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                        onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                        style={{
                            position: 'fixed',
                            top: (() => {
                                if (!qmBarRef.current) return '50%';
                                const rect = qmBarRef.current.getBoundingClientRect();
                                let hudContainer = qmBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                let hudBottom = rect.bottom;
                                if (hudContainer) {
                                    const hudRect = hudContainer.getBoundingClientRect();
                                    hudBottom = hudRect.bottom;
                                }
                                return hudBottom + 8;
                            })(),
                            left: (() => {
                                if (!qmBarRef.current) return '50%';
                                const rect = qmBarRef.current.getBoundingClientRect();
                                return rect.left + (rect.width / 2);
                            })(),
                            transform: 'translateX(-50%)',
                            zIndex: 100000
                        }}
                    >
                        <div className="context-menu-main">
                            <div className="menu-title">Apex Hunting Ledger</div>
                            {renderStatusFlavor()}

                            {/* Quarry Marks Section */}
                            <div className="context-menu-section">
                                <div className="context-menu-section-header" style={{ color: specColor, fontSize: '11px', fontWeight: 'bold' }}>
                                    Quarry Marks: {qmValue}/{maxQM}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                    <button
                                        className="context-menu-button gain"
                                        onClick={() => {
                                            const newValue = Math.min(maxQM, qmValue + 1);
                                            const amount = newValue - qmValue;
                                            setLocalQuarryMarks(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Quarry Mark', amount, true, 'quarryMarks');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-plus"></i> +1 Mark
                                    </button>
                                    <button
                                        className="context-menu-button gain"
                                        onClick={() => {
                                            const newValue = Math.min(maxQM, qmValue + 2);
                                            const amount = newValue - qmValue;
                                            setLocalQuarryMarks(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Quarry Mark', amount, true, 'quarryMarks');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-plus-circle"></i> +2 Marks
                                    </button>
                                    <button
                                        className="context-menu-button spend"
                                        onClick={() => {
                                            const newValue = Math.max(0, qmValue - 1);
                                            const amount = qmValue - newValue;
                                            setLocalQuarryMarks(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Quarry Mark', amount, false, 'quarryMarks');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-minus"></i> -1 Mark
                                    </button>
                                    <button
                                        className="context-menu-button spend"
                                        onClick={() => {
                                            const newValue = Math.max(0, qmValue - 2);
                                            const amount = qmValue - newValue;
                                            setLocalQuarryMarks(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Quarry Mark', amount, false, 'quarryMarks');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-minus-circle"></i> -2 Marks
                                    </button>
                                </div>
                            </div>

                            {/* Companion HP Section */}
                            <div className="context-menu-section" style={{ marginTop: '8px', borderTop: '1px solid rgba(160, 140, 112, 0.3)', paddingTop: '8px' }}>
                                <div className="context-menu-section-header" style={{ color: getCompanionHPColor(), fontSize: '11px', fontWeight: 'bold' }}>
                                    Companion HP: {companionHPValue}/{companionMaxHPValue}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                    <button
                                        className="context-menu-button gain"
                                        style={{ borderColor: 'rgba(46, 125, 50, 0.5)' }}
                                        onClick={() => {
                                            const newValue = Math.min(companionMaxHPValue, companionHPValue + 5);
                                            const amount = newValue - companionHPValue;
                                            setLocalCompanionHP(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Companion HP', amount, true, 'companionHP');
                                                if (onClassResourceUpdate) onClassResourceUpdate('companionHP', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-plus"></i> +5 HP
                                    </button>
                                    <button
                                        className="context-menu-button gain"
                                        style={{ borderColor: 'rgba(46, 125, 50, 0.5)' }}
                                        onClick={() => {
                                            const newValue = Math.min(companionMaxHPValue, companionHPValue + 10);
                                            const amount = newValue - companionHPValue;
                                            setLocalCompanionHP(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Companion HP', amount, true, 'companionHP');
                                                if (onClassResourceUpdate) onClassResourceUpdate('companionHP', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-plus-circle"></i> +10 HP
                                    </button>
                                    <button
                                        className="context-menu-button spend"
                                        style={{ borderColor: 'rgba(220, 20, 60, 0.5)' }}
                                        onClick={() => {
                                            const newValue = Math.max(0, companionHPValue - 5);
                                            const amount = companionHPValue - newValue;
                                            setLocalCompanionHP(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Companion HP', amount, false, 'companionHP');
                                                if (onClassResourceUpdate) onClassResourceUpdate('companionHP', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-minus"></i> -5 HP
                                    </button>
                                    <button
                                        className="context-menu-button spend"
                                        style={{ borderColor: 'rgba(220, 20, 60, 0.5)' }}
                                        onClick={() => {
                                            const newValue = Math.max(0, companionHPValue - 10);
                                            const amount = companionHPValue - newValue;
                                            setLocalCompanionHP(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Companion HP', amount, false, 'companionHP');
                                                if (onClassResourceUpdate) onClassResourceUpdate('companionHP', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-minus-circle"></i> -10 HP
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                                <button
                                    onClick={() => {
                                        setLocalQuarryMarks(0);
                                        if (onClassResourceUpdate) onClassResourceUpdate('current', 0);
                                    }}
                                    className="context-menu-button"
                                    style={{ flex: 1 }}
                                    title="Reset Marks"
                                >
                                    <i className="fas fa-undo"></i> Reset Marks
                                </button>
                                <button
                                    onClick={() => setShowQMMenu(false)}
                                    className="context-menu-button close"
                                    style={{ flex: 1 }}
                                    title="Close"
                                >
                                    <i className="fas fa-times"></i> Close
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        );

};

export default QuarryMarksResourceBar;