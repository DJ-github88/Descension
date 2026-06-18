import React from 'react';

const AncestralResonanceResourceBar = ({
  showResonanceMenu,
  setShowResonanceMenu,
  animistHoverSection,
  setAnimistHoverSection,
  uiState,
  setUiState,
  finalClassResource,
  finalConfig,
  character,
  isOwner,
  onClassResourceUpdate,
  size,
  context,
  resonanceBarRef,
}) => {
  const { showTooltip, tooltipPosition, tooltipPlacement } = uiState;
  const setShowTooltip = (value) => setUiState(prev => ({ ...prev, showTooltip: value }));
  const setTooltipPosition = (value) => setUiState(prev => ({ ...prev, tooltipPosition: value }));

        const curRes = finalClassResource.current ?? 0;
        const maxRes = finalClassResource.max ?? 20;
        const percentage = Math.min((curRes / maxRes) * 100, 100);

        return (
            <div className={`class-resource-bar ancestral-resonance ${size} ${context === 'party' ? 'party-context' : ''}`}>
                <div
                    ref={resonanceBarRef}
                    className="resonance-bar"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isOwner) setShowResonanceMenu(!showResonanceMenu);
                    }}
                    onMouseEnter={(e) => {
                        if (!showResonanceMenu) {
                            setAnimistHoverSection('resonance');
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                            setShowTooltip(true);
                        }
                    }}
                    onMouseLeave={() => {
                        setAnimistHoverSection(null);
                        setShowTooltip(false);
                    }}
                    style={{
                        cursor: isOwner ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        height: size === 'large' ? '20px' : '14px',
                        background: 'rgba(16, 185, 129, 0.05)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '4px',
                        position: 'relative',
                        padding: '0 6px',
                        overflow: 'hidden',
                        width: '100%'
                    }}
                >
                    <div
                        className="resonance-bar-fill"
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '100%',
                            width: `${percentage}%`,
                            background: 'linear-gradient(90deg, #059669 0%, #10B981 100%)',
                            boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                            opacity: 0.35,
                            transition: 'width 0.2s ease-out'
                        }}
                    />
                    {/* Subtle runic overlay effect */}
                    <div
                        className="runic-glow-overlay"
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 15px, rgba(52, 211, 153, 0.1) 15px, rgba(52, 211, 153, 0.1) 16px)',
                            pointerEvents: 'none',
                            animation: 'runicPulse 3s infinite ease-in-out'
                        }}
                    />
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '10px', fontWeight: 'bold', color: '#1B5E20' }}>
                        <span>Ancestral Resonance</span>
                        <span>{curRes}/{maxRes} AR</span>
                    </div>
                </div>

                {/* Resonance Adjustment Menu */}
                {showResonanceMenu && resonanceBarRef.current && ReactDOM.createPortal(
                    <div
                        className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                        onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                        onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                        style={{
                            position: 'fixed',
                            top: (() => {
                                if (!resonanceBarRef.current) return '50%';
                                const rect = resonanceBarRef.current.getBoundingClientRect();
                                let hudContainer = resonanceBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                let hudBottom = rect.bottom;
                                if (hudContainer) {
                                    const hudRect = hudContainer.getBoundingClientRect();
                                    hudBottom = hudRect.bottom;
                                }
                                return hudBottom + 8;
                            })(),
                            left: (() => {
                                if (!resonanceBarRef.current) return '50%';
                                const rect = resonanceBarRef.current.getBoundingClientRect();
                                return rect.left + (rect.width / 2);
                            })(),
                            transform: 'translateX(-50%)',
                            zIndex: 100000
                        }}
                    >
                        <div className="context-menu-main">
                            <div className="menu-title">Resonance Control</div>
                            {renderStatusFlavor()}

                            <div className="context-menu-section">
                                <div className="context-menu-section-header" style={{ color: '#1B5E20', fontSize: '11px', fontWeight: 'bold' }}>
                                    Resonance: {curRes}/{maxRes}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                    <button
                                        className="context-menu-button gain"
                                        onClick={() => {
                                            const newValue = Math.min(maxRes, curRes + 1);
                                            const amount = newValue - curRes;
                                            if (amount > 0) {
                                                logClassResourceChange('Ancestral Resonance', amount, true, 'ancestralResonance');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-plus"></i> +1 AR
                                    </button>
                                    <button
                                        className="context-menu-button gain"
                                        onClick={() => {
                                            const newValue = Math.min(maxRes, curRes + 5);
                                            const amount = newValue - curRes;
                                            if (amount > 0) {
                                                logClassResourceChange('Ancestral Resonance', amount, true, 'ancestralResonance');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-plus-circle"></i> +5 AR
                                    </button>
                                    <button
                                        className="context-menu-button spend"
                                        onClick={() => {
                                            const newValue = Math.max(0, curRes - 1);
                                            const amount = curRes - newValue;
                                            if (amount > 0) {
                                                logClassResourceChange('Ancestral Resonance', amount, false, 'ancestralResonance');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-minus"></i> -1 AR
                                    </button>
                                    <button
                                        className="context-menu-button spend"
                                        onClick={() => {
                                            const newValue = Math.max(0, curRes - 5);
                                            const amount = curRes - newValue;
                                            if (amount > 0) {
                                                logClassResourceChange('Ancestral Resonance', amount, false, 'ancestralResonance');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-minus-circle"></i> -5 AR
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                                <button
                                    onClick={() => {
                                        if (onClassResourceUpdate) onClassResourceUpdate('current', 0);
                                    }}
                                    className="context-menu-button"
                                    style={{ flex: 1 }}
                                >
                                    <i className="fas fa-undo"></i> Reset
                                </button>
                                <button
                                    onClick={() => setShowResonanceMenu(false)}
                                    className="context-menu-button close"
                                    style={{ flex: 1 }}
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

export default AncestralResonanceResourceBar;
