import React from 'react';

const HexbreakerChargesResourceBar = ({
  covenbaneState,
  setCovenbaneState,
  uiState,
  setUiState,
  finalClassResource,
  finalConfig,
  character,
  isOwner,
  onClassResourceUpdate,
  size,
  context,
  chargesDisplayRef
}) => {
  const {
    showChargesMenu,
    covenbaneHoverSection
  } = covenbaneState;

  const {
    showTooltip,
    tooltipPosition,
    tooltipPlacement,
  } = uiState;

  const setShowTooltip = (value) => setUiState(prev => ({ ...prev, showTooltip: value }));
  const setTooltipPosition = (value) => setUiState(prev => ({ ...prev, tooltipPosition: value }));
  const setTooltipPlacement = (value) => setUiState(prev => ({ ...prev, tooltipPlacement: value }));

  const covenbaneHexbreakerCharges = finalClassResource?.hexbreakerCharges ?? 4;
  const covenbaneAttackCounter = finalClassResource?.attackCounter ?? 2;

        const maxCharges = finalConfig.mechanics?.max || 8;
        const chargesValue = covenbaneHexbreakerCharges;
        const attackCounter = covenbaneAttackCounter; // 1, 2, or 3

        // Get passive bonuses based on current charges
        const getPassiveBonuses = (charges) => {
            const bonuses = {
                0: { damage: '0', speed: '+0ft', crit: '20', trueDmg: '0%' },
                1: { damage: '+1d4', speed: '+5ft', crit: '20', trueDmg: '6%' },
                2: { damage: '+1d6', speed: '+10ft', crit: '20', trueDmg: '7%' },
                3: { damage: '+2d6', speed: '+15ft', crit: '19-20', trueDmg: '8%' },
                4: { damage: '+3d6', speed: '+20ft', crit: '19-20', trueDmg: '9%' },
                5: { damage: '+4d6', speed: '+25ft', crit: '18-20', trueDmg: '10%' },
                6: { damage: '+5d6', speed: '+30ft', crit: '18-20', trueDmg: '11%' },
                7: { damage: '+6d6', speed: '+35ft', crit: '17-20', trueDmg: '12%' },
                8: { damage: '+7d6', speed: '+40ft', crit: '17-20', trueDmg: '13%' }
            };
            return bonuses[charges] || bonuses[charges > 8 ? 8 : 0];
        };

        const currentBonuses = getPassiveBonuses(chargesValue);
        const isMaxCharges = chargesValue === maxCharges;

        return (
            <div className={`class-resource-bar hexbreaker-charges ${size}`}>
                <div className="hexbreaker-container">
                    {/* Charges Display */}
                    <div
                        ref={chargesDisplayRef}
                        className="charges-display"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowChargesMenu(!showChargesMenu);
                        }}
                        onMouseEnter={(e) => {
                            setCovenbaneHoverSection('charges');
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                            setShowTooltip(true);
                        }}
                        onMouseLeave={() => {
                            setCovenbaneHoverSection(null);
                            setShowTooltip(false);
                        }}
                    >
                        <div className="charges-grid">
                            {Array.from({ length: maxCharges }, (_, i) => (
                                <div
                                    key={i}
                                    className={`charge-indicator ${i < chargesValue ? 'filled' : 'empty'} ${i === chargesValue - 1 && isMaxCharges ? 'max-glow' : ''}`}
                                    style={{
                                        backgroundColor: i < chargesValue
                                            ? finalConfig.visual.activeColor
                                            : finalConfig.visual.baseColor,
                                        boxShadow: i < chargesValue
                                            ? `0 0 6px ${finalConfig.visual.glowColor}`
                                            : 'none'
                                    }}
                                >
                                    {i < chargesValue && <span className="charge-icon">{renderIcon(finalConfig.visual.icon)}</span>}
                                </div>
                            ))}
                        </div>
                        <div className="charges-value">{chargesValue}/{maxCharges}</div>
                    </div>

                    {/* Attack Counter (True Damage Tracker) */}
                    <div
                        className="attack-counter"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Cycle through 1 -> 2 -> 3 -> 1
                            const newValue = attackCounter === 3 ? 1 : attackCounter + 1;
                            if (onClassResourceUpdate) onClassResourceUpdate('attackCounter', newValue);
                        }}
                        onMouseEnter={(e) => {
                            setCovenbaneHoverSection('counter');
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                            setShowTooltip(true);
                        }}
                        onMouseLeave={() => {
                            setCovenbaneHoverSection(null);
                            setShowTooltip(false);
                        }}
                    >
                        <div className="counter-dots">
                            {[1, 2, 3].map((dot) => (
                                <div
                                    key={dot}
                                    className={`counter-dot ${dot <= attackCounter ? 'active' : 'inactive'} ${dot === 3 && attackCounter === 3 ? 'true-damage-ready' : ''}`}
                                    style={{
                                        backgroundColor: dot <= attackCounter
                                            ? (dot === 3 ? '#FFD700' : finalConfig.visual.activeColor)
                                            : finalConfig.visual.baseColor,
                                        boxShadow: dot === 3 && attackCounter === 3
                                            ? '0 0 8px #FFD700'
                                            : 'none'
                                    }}
                                />
                            ))}
                        </div>
                        <div className="counter-label">{attackCounter}/3</div>
                    </div>

                    {/* Charges Adjustment Menu */}
                    {showChargesMenu && chargesDisplayRef.current && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact covenbane-charges-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            onMouseEnter={() => setShowTooltip(false)}
                            onMouseLeave={() => setShowTooltip(false)}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!chargesDisplayRef.current) return '50%';
                                    const rect = chargesDisplayRef.current.getBoundingClientRect();
                                    let hudContainer = chargesDisplayRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!chargesDisplayRef.current) return '50%';
                                    const rect = chargesDisplayRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Hexbreaker Charges: {chargesValue}/{maxCharges}</div>
                                {renderStatusFlavor()}

                                {/* Gain Actions */}
                                <div className="context-menu-section">
                                    <div className="context-menu-section-header">Gain</div>
                                    <div className="covenbane-action-grid">
                                        <button
                                            className="context-menu-button gain"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newValue = Math.min(maxCharges, chargesValue + 1);
                                                const amount = newValue - chargesValue;
                                                // setLocalHexbreakerCharges(newValue);
                                                if (amount > 0) {
                                                    logClassResourceChange('Hexbreaker Charge', amount, true, 'hexbreakerCharges');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('hexbreakerCharges', newValue);
                                                }
                                            }}
                                            title="+1 Attack Evil Caster"
                                        >
                                            <i className="fas fa-plus"></i> +1
                                        </button>
                                        <button
                                            className="context-menu-button gain"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newValue = Math.min(maxCharges, chargesValue + 1);
                                                const amount = newValue - chargesValue;
                                                // setLocalHexbreakerCharges(newValue);
                                                if (amount > 0) {
                                                    logClassResourceChange('Hexbreaker Charge', amount, true, 'hexbreakerCharges');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('hexbreakerCharges', newValue);
                                                }
                                            }}
                                            title="+1 Targeted by Spell"
                                        >
                                            <i className="fas fa-plus-circle"></i> +1
                                        </button>
                                    </div>
                                </div>

                                {/* Spend Actions */}
                                <div className="context-menu-section">
                                    <div className="context-menu-section-header">Spend</div>
                                    <div className="covenbane-action-grid four-col">
                                        <button
                                            className="context-menu-button spend"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newValue = Math.max(0, chargesValue - 1);
                                                const amount = chargesValue - newValue;
                                                // setLocalHexbreakerCharges(newValue);
                                                if (amount > 0) {
                                                    logClassResourceChange('Hexbreaker Charge', amount, false, 'hexbreakerCharges');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('hexbreakerCharges', newValue);
                                                }
                                            }}
                                            title="-1 Shadow Step"
                                        >
                                            <i className="fas fa-minus"></i> -1
                                        </button>
                                        <button
                                            className="context-menu-button spend"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newValue = Math.max(0, chargesValue - 2);
                                                const amount = chargesValue - newValue;
                                                // setLocalHexbreakerCharges(newValue);
                                                if (amount > 0) {
                                                    logClassResourceChange('Hexbreaker Charge', amount, false, 'hexbreakerCharges');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('hexbreakerCharges', newValue);
                                                }
                                            }}
                                            title="-2 Curse Eater"
                                        >
                                            <i className="fas fa-minus"></i> -2
                                        </button>
                                        <button
                                            className="context-menu-button spend"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newValue = Math.max(0, chargesValue - 3);
                                                const amount = chargesValue - newValue;
                                                // setLocalHexbreakerCharges(newValue);
                                                if (amount > 0) {
                                                    logClassResourceChange('Hexbreaker Charge', amount, false, 'hexbreakerCharges');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('hexbreakerCharges', newValue);
                                                }
                                            }}
                                            title="-3 Dark Pursuit"
                                        >
                                            <i className="fas fa-minus"></i> -3
                                        </button>
                                        <button
                                            className="context-menu-button danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newValue = Math.max(0, chargesValue - 6);
                                                const amount = chargesValue - newValue;
                                                // setLocalHexbreakerCharges(newValue);
                                                if (amount > 0) {
                                                    logClassResourceChange('Hexbreaker Charge', amount, false, 'hexbreakerCharges');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('hexbreakerCharges', newValue);
                                                }
                                            }}
                                            title="-6 Hexbreaker Fury"
                                        >
                                            <i className="fas fa-star"></i> -6
                                        </button>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="covenbane-quick-actions">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const resetAmount = chargesValue;
                                            // setLocalHexbreakerCharges(0);
                                            setShowChargesMenu(false);
                                            if (resetAmount > 0) {
                                                logClassResourceChange('Hexbreaker Charge', resetAmount, false, 'hexbreakerCharges');
                                                if (onClassResourceUpdate) onClassResourceUpdate('hexbreakerCharges', 0);
                                            }
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
                                            setShowChargesMenu(false);
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

export default HexbreakerChargesResourceBar;