import React from 'react';

const FortunePointsResourceBar = ({
  gamblerState,
  setGamblerState,
  uiState,
  setUiState,
  finalClassResource,
  finalConfig,
  character,
  isOwner,
  onClassResourceUpdate,
  size,
  context,
  fpBarRef
}) => {
  const {
    localFortunePoints,
    gamblerSpec,
    showFPMenu,
    showSpecMenu,
    gamblerHoverSection,
    menuPosition
  } = gamblerState;

  const {
    showTooltip,
    tooltipPosition,
    tooltipPlacement,
  } = uiState;

  const setShowTooltip = (value) => setUiState(prev => ({ ...prev, showTooltip: value }));
  const setTooltipPosition = (value) => setUiState(prev => ({ ...prev, tooltipPosition: value }));
  const setTooltipPlacement = (value) => setUiState(prev => ({ ...prev, tooltipPlacement: value }));

        const fpValue = finalClassResource.current ?? localFortunePoints;
        const maxFP = finalClassResource.max ?? 7;
        const riskValue = finalClassResource.risk ?? 0;
        const maxRisk = 13;

        return (
            <div className={`class-resource-bar fortune-points-gambling ${size} ${context === 'party' ? 'party-context' : ''}`}>
                <div className="gambler-single-bar" style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '4px' }}>
                    {/* Fortune Points Bar (Left) */}
                    <div
                        ref={fpBarRef}
                        className="fortune-points-bar"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isOwner) setShowFPMenu(!showFPMenu);
                        }}
                        onMouseEnter={(e) => {
                            if (!showFPMenu) {
                                setGamblerHoverSection('fp');
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                                setShowTooltip(true);
                            }
                        }}
                        onMouseLeave={() => {
                            setGamblerHoverSection(null);
                            setShowTooltip(false);
                        }}
                        style={{
                            cursor: isOwner ? 'pointer' : 'default',
                            display: 'flex',
                            alignItems: 'center',
                            height: size === 'large' ? '20px' : '14px',
                            background: 'rgba(255, 215, 0, 0.05)',
                            border: '1px solid rgba(255, 215, 0, 0.3)',
                            borderRadius: '4px 0 0 4px',
                            position: 'relative',
                            padding: '0 6px',
                            overflow: 'hidden',
                            flex: 1
                        }}
                    >
                        <div
                            className="fp-bar-fill"
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                width: `${(fpValue / maxFP) * 100}%`,
                                background: 'linear-gradient(90deg, #D4AF37 0%, #FFD700 100%)',
                                opacity: 0.35,
                                transition: 'width 0.2s ease-out'
                            }}
                        />
                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', width: '100%', fontSize: '9px', fontWeight: 'bold', color: '#8B6508', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            <span>{size === 'small' || context === 'party' ? `${fpValue}/${maxFP} FP` : `Fortune: ${fpValue}/${maxFP}`}</span>
                        </div>
                    </div>

                    {/* Center Divider: Gold card/dice symbol */}
                    <div className="gambler-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '12px', color: '#8B6508', textShadow: '0 0 4px rgba(255, 215, 0, 0.4)', margin: '0 2px' }}>♦</span>
                    </div>

                    {/* Karmic Debt Bar (Right) */}
                    <div
                        className="karmic-debt-bar"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isOwner) setShowFPMenu(!showFPMenu);
                        }}
                        onMouseEnter={(e) => {
                            if (!showFPMenu) {
                                setGamblerHoverSection('fp');
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                                setShowTooltip(true);
                            }
                        }}
                        onMouseLeave={() => {
                            setGamblerHoverSection(null);
                            setShowTooltip(false);
                        }}
                        style={{
                            cursor: isOwner ? 'pointer' : 'default',
                            display: 'flex',
                            alignItems: 'center',
                            height: size === 'large' ? '20px' : '14px',
                            background: 'rgba(220, 20, 60, 0.05)',
                            border: '1px solid rgba(220, 20, 60, 0.3)',
                            borderRadius: '0 4px 4px 0',
                            position: 'relative',
                            padding: '0 6px',
                            overflow: 'hidden',
                            flex: 1
                        }}
                    >
                        <div
                            className="debt-bar-fill"
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                width: `${(riskValue / maxRisk) * 100}%`,
                                background: 'linear-gradient(90deg, #8B0000 0%, #DC143C 100%)',
                                opacity: 0.35,
                                transition: 'width 0.2s ease-out'
                            }}
                        />
                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', width: '100%', fontSize: '9px', fontWeight: 'bold', color: '#8b3a2a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            <span>{size === 'small' || context === 'party' ? `${riskValue}/${maxRisk} Debt` : `Debt: ${riskValue}/${maxRisk}`}</span>
                        </div>
                    </div>
                </div>

                {/* FP & Debt Adjustment Menu */}
                {showFPMenu && fpBarRef.current && ReactDOM.createPortal(
                    <div
                        className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                        onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                        onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                        style={{
                            position: 'fixed',
                            top: (() => {
                                if (!fpBarRef.current) return '50%';
                                const rect = fpBarRef.current.getBoundingClientRect();
                                let hudContainer = fpBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                let hudBottom = rect.bottom;
                                if (hudContainer) {
                                    const hudRect = hudContainer.getBoundingClientRect();
                                    hudBottom = hudRect.bottom;
                                }
                                return hudBottom + 8;
                            })(),
                            left: (() => {
                                if (!fpBarRef.current) return '50%';
                                const rect = fpBarRef.current.getBoundingClientRect();
                                return rect.left + (rect.width / 2);
                            })(),
                            transform: 'translateX(-50%)',
                            zIndex: 100000
                        }}
                    >
                        <div className="context-menu-main">
                            <div className="menu-title">Gambit Ledger</div>
                            {renderStatusFlavor()}

                            {/* Fortune Points Section */}
                            <div className="context-menu-section">
                                <div className="context-menu-section-header" style={{ color: '#8B6508', fontSize: '11px', fontWeight: 'bold' }}>
                                    Fortune Points: {fpValue}/{maxFP}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                    <button
                                        className="context-menu-button gain"
                                        onClick={() => {
                                            const newValue = Math.min(maxFP, fpValue + 1);
                                            const amount = newValue - fpValue;
                                            setLocalFortunePoints(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Fortune Point', amount, true, 'fortunePoints');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-plus"></i> +1 FP
                                    </button>
                                    <button
                                        className="context-menu-button gain"
                                        onClick={() => {
                                            const newValue = Math.min(maxFP, fpValue + 2);
                                            const amount = newValue - fpValue;
                                            setLocalFortunePoints(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Fortune Point', amount, true, 'fortunePoints');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-plus-circle"></i> +2 FP
                                    </button>
                                    <button
                                        className="context-menu-button spend"
                                        onClick={() => {
                                            const newValue = Math.max(0, fpValue - 1);
                                            const amount = fpValue - newValue;
                                            setLocalFortunePoints(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Fortune Point', amount, false, 'fortunePoints');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-minus"></i> -1 FP
                                    </button>
                                    <button
                                        className="context-menu-button spend"
                                        onClick={() => {
                                            const newValue = Math.max(0, fpValue - 3);
                                            const amount = fpValue - newValue;
                                            setLocalFortunePoints(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Fortune Point', amount, false, 'fortunePoints');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-minus-circle"></i> -3 FP
                                    </button>
                                </div>
                            </div>

                            {/* Karmic Debt Section */}
                            <div className="context-menu-section" style={{ marginTop: '8px' }}>
                                <div className="context-menu-section-header" style={{ color: '#8b3a2a', fontSize: '11px', fontWeight: 'bold' }}>
                                    Karmic Debt: {riskValue}/{maxRisk}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                    <button
                                        className="context-menu-button spend"
                                        style={{ borderColor: 'rgba(220, 20, 60, 0.5)' }}
                                        onClick={() => {
                                            const newValue = Math.min(maxRisk, riskValue + 1);
                                            const amount = newValue - riskValue;
                                            if (amount > 0) {
                                                logClassResourceChange('Karmic Debt', amount, true, 'risk');
                                                if (onClassResourceUpdate) onClassResourceUpdate('risk', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-plus"></i> +1 Debt
                                    </button>
                                    <button
                                        className="context-menu-button spend"
                                        style={{ borderColor: 'rgba(220, 20, 60, 0.5)' }}
                                        onClick={() => {
                                            const newValue = Math.min(maxRisk, riskValue + 3);
                                            const amount = newValue - riskValue;
                                            if (amount > 0) {
                                                logClassResourceChange('Karmic Debt', amount, true, 'risk');
                                                if (onClassResourceUpdate) onClassResourceUpdate('risk', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-plus-circle"></i> +3 Debt
                                    </button>
                                    <button
                                        className="context-menu-button gain"
                                        style={{ borderColor: 'rgba(46, 125, 50, 0.5)' }}
                                        onClick={() => {
                                            const newValue = Math.max(0, riskValue - 1);
                                            const amount = riskValue - newValue;
                                            if (amount > 0) {
                                                logClassResourceChange('Karmic Debt', amount, false, 'risk');
                                                if (onClassResourceUpdate) onClassResourceUpdate('risk', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-minus"></i> -1 Debt
                                    </button>
                                    <button
                                        className="context-menu-button gain"
                                        style={{ borderColor: 'rgba(46, 125, 50, 0.5)' }}
                                        onClick={() => {
                                            const newValue = Math.max(0, riskValue - 3);
                                            const amount = riskValue - newValue;
                                            if (amount > 0) {
                                                logClassResourceChange('Karmic Debt', amount, false, 'risk');
                                                if (onClassResourceUpdate) onClassResourceUpdate('risk', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-minus-circle"></i> -3 Debt
                                    </button>
                                </div>
                            </div>

                            <div className="gambler-quick-actions" style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                                <button
                                    onClick={() => {
                                        setLocalFortunePoints(0);
                                        if (onClassResourceUpdate) onClassResourceUpdate('current', 0);
                                    }}
                                    className="context-menu-button"
                                    title="Reset FP to 0"
                                    style={{ flex: 1 }}
                                >
                                    <i className="fas fa-undo"></i> Reset FP
                                </button>
                                <button
                                    onClick={() => {
                                        if (onClassResourceUpdate) onClassResourceUpdate('risk', 0);
                                    }}
                                    className="context-menu-button"
                                    title="Reset Debt to 0"
                                    style={{ flex: 1 }}
                                >
                                    <i className="fas fa-eraser"></i> Clear Debt
                                </button>
                                <button
                                    onClick={() => setShowFPMenu(false)}
                                    className="context-menu-button danger"
                                    title="Close"
                                    style={{ padding: '0 12px' }}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        );

};

export default FortunePointsResourceBar;