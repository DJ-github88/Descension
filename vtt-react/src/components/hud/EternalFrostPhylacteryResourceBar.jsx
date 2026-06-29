import React from 'react';

const EternalFrostPhylacteryResourceBar = ({
  lichborneState,
  setLichborneState,
  uiState,
  setUiState,
  finalClassResource,
  finalConfig,
  character,
  isOwner,
  onClassResourceUpdate,
  size,
  context,
  phylacteryBarRef,
}) => {
  const { localPhylacteryHP, eternalFrostActive, lichborneSpec, showPhylacteryMenu, lichborneHoverSection } = lichborneState;
  const { showTooltip, tooltipPosition, tooltipPlacement } = uiState;
  const setShowTooltip = (value) => setUiState(prev => ({ ...prev, showTooltip: value }));
  const setTooltipPosition = (value) => setUiState(prev => ({ ...prev, tooltipPosition: value }));
  const setTooltipPlacement = (value) => setUiState(prev => ({ ...prev, tooltipPlacement: value }));
  const setLocalPhylacteryHP = (value) => setLichborneState(prev => ({ ...prev, localPhylacteryHP: value }));
  const setEternalFrostActive = (value) => setLichborneState(prev => ({ ...prev, eternalFrostActive: value }));
  const setLichborneSpec = (value) => setLichborneState(prev => ({ ...prev, lichborneSpec: value }));
  const setShowPhylacteryMenu = (value) => setLichborneState(prev => ({ ...prev, showPhylacteryMenu: value }));
  const setLichborneHoverSection = (value) => setLichborneState(prev => ({ ...prev, lichborneHoverSection: value }));

        // Get specialization config
        const specs = finalConfig.visual;
        const currentSpec = specs[lichborneSpec] || specs.frostbound_tyrant;
        const maxPhylactery = currentSpec.maxPhylactery;
        const segments = currentSpec.segments;
        const specColor = currentSpec.color;
        const specGlow = currentSpec.glow;
        const specIcon = currentSpec.icon;

        const phylacteryValue = localPhylacteryHP;
        const auraActive = eternalFrostActive;

        // Handlers
        const handleBarClick = () => {
            setShowPhylacteryMenu(!showPhylacteryMenu);
            // Hide tooltip when menu opens
            if (!showPhylacteryMenu) {
                setShowTooltip(false);
                setLichborneHoverSection(null);
            }
        };

        const handlePhylacteryBarEnter = (e) => {
            if (showPhylacteryMenu) return; // Don't show tooltip if menu is open
            setLichborneHoverSection('phylactery');
            const rect = e.currentTarget.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;
            const spaceRight = viewportWidth - rect.right;
            const spaceLeft = rect.left;

            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
            setShowTooltip(true);
        };


        const handleBarLeave = () => {
            if (showPhylacteryMenu) return;
            setLichborneHoverSection(null);
            setShowTooltip(false);
        };

        const handleAdjustPhylactery = (amount) => {
            const newValue = Math.max(0, Math.min(maxPhylactery, phylacteryValue + amount));
            const actualAmount = Math.abs(newValue - phylacteryValue);
            setLocalPhylacteryHP(newValue);
            if (actualAmount > 0) {
                logClassResourceChange('Phylactery HP', actualAmount, amount > 0, 'phylacteryHP');
                if (onClassResourceUpdate) onClassResourceUpdate('phylacteryHP', newValue);
            }
        };

        const handleToggleAura = () => {
            setEternalFrostActive(!auraActive);
        };

        // Get spec passive description
        const getSpecPassive = () => {
            switch (lichborneSpec) {
                case 'frostbound_tyrant':
                    return 'Freeze effects last +1d4 rounds. Frozen enemies take +1d6 damage. 50% Shatter chance on hit (3d6 burst, ends freeze).';
                case 'spectral_reaper':
                    return 'Frost spells deal +1d6 necrotic. Every kill raises a spectral minion (max 4). Minions: 10 HP, 1d6 dmg/turn.';
                case 'phylactery_guardian':
                    return 'Phylactery stores 75 HP. Death Trigger freeze radius 25ft (vs 15ft).';
                default:
                    return '';
            }
        };

        return (
            <div className={`class-resource-bar eternal-frost-phylactery ${size}`}>
                <div className="lichborne-container">
                    {/* Phylactery Bar */}
                    <div className="phylactery-bar-wrapper" ref={phylacteryBarRef}>
                        {/* Phylactery HP Bar */}
                        <div
                            className="phylactery-bar-content"
                            onClick={handleBarClick}
                            onMouseEnter={handlePhylacteryBarEnter}
                            onMouseLeave={handleBarLeave}
                            style={{
                                cursor: 'pointer',
                                borderColor: auraActive ? specGlow : 'rgba(100, 149, 237, 0.4)',
                                boxShadow: auraActive
                                    ? `inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 15px ${specGlow}`
                                    : 'inset 0 1px 3px rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            {/* Phylactery Value Display */}
                            <div className="phylactery-value">
                                {phylacteryValue}/{maxPhylactery}
                            </div>

                            {/* Segmented Phylactery Bar */}
                            <div className="phylactery-segments">
                                {Array.from({ length: segments }, (_, index) => {
                                    const segmentValue = (index + 1) * (maxPhylactery / segments);
                                    const isFilled = phylacteryValue >= segmentValue;
                                    return (
                                        <div
                                            key={`phylactery-${index}`}
                                            className={`phylactery-segment ${isFilled ? 'filled' : 'empty'} ${auraActive ? 'aura-active' : ''}`}
                                            style={{
                                                backgroundColor: isFilled ? specColor : '#1A0F2E',
                                                borderColor: isFilled ? specGlow : '#2E1A5E',
                                                boxShadow: isFilled && auraActive
                                                    ? `0 0 8px ${specGlow}, inset 0 0 4px ${specGlow}`
                                                    : isFilled
                                                        ? `0 0 4px ${specGlow}`
                                                        : 'none'
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Adjustment Menu */}
                    {showPhylacteryMenu && phylacteryBarRef.current && ReactDOM.createPortal(
                        <div
                            className="unified-context-menu compact"
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!phylacteryBarRef.current) return '50%';
                                    const rect = phylacteryBarRef.current.getBoundingClientRect();
                                    let hudContainer = phylacteryBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!phylacteryBarRef.current) return '50%';
                                    const rect = phylacteryBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="context-menu-section">
                                    <div className="context-menu-section-header" style={{ fontSize: '10px', marginBottom: '6px' }}>
                                        Phylactery HP: {phylacteryValue}/{maxPhylactery}
                                    </div>

                                    {/* Adjust HP */}
                                    <div className="action-row" style={{ marginBottom: '6px' }}>
                                        <button className="context-menu-button spend" onClick={() => handleAdjustPhylactery(-10)} title="-10 HP">
                                            <i className="fas fa-minus"></i> -10
                                        </button>
                                        <button className="context-menu-button spend" onClick={() => handleAdjustPhylactery(-5)} title="-5 HP">
                                            <i className="fas fa-minus"></i> -5
                                        </button>
                                        <button className="context-menu-button gain" onClick={() => handleAdjustPhylactery(5)} title="+5 HP">
                                            <i className="fas fa-plus"></i> +5
                                        </button>
                                        <button className="context-menu-button gain" onClick={() => handleAdjustPhylactery(10)} title="+10 HP">
                                            <i className="fas fa-plus"></i> +10
                                        </button>
                                    </div>

                                    {/* Eternal Frost Aura */}
                                    <div style={{ marginBottom: '6px' }}>
                                        <div style={{ fontSize: '9px', color: '#8b7355', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Eternal Frost Aura
                                        </div>
                                        <button
                                            className={`context-menu-button ${auraActive ? 'active' : ''}`}
                                            onClick={handleToggleAura}
                                            title={auraActive ? 'Aura Mode: Spells cost HP instead of Mana, +1d6 frost damage, chill DC 17, drains HP/turn' : 'Normal Mode: Spells cost Mana'}
                                        >
                                            <i className={`fas ${auraActive ? 'fa-snowflake' : 'fa-circle'}`}></i> {auraActive ? 'ON' : 'OFF'}
                                        </button>
                                    </div>

                                    {/* Specialization Selector - Icon Only */}
                                    <div style={{ marginBottom: '6px' }}>
                                        <div style={{ display: 'flex', gap: '3px', justifyContent: 'center' }}>
                                            {Object.entries(specs)
                                                .filter(([key]) => key !== 'type' && key !== 'arrangement' && key !== 'baseColor' && key !== 'activeColor' && key !== 'glowColor' && key !== 'icon')
                                                .map(([key, spec]) => (
                                                    <button
                                                        key={key}
                                                        className={`context-menu-button spec-option-button ${lichborneSpec === key ? 'active' : ''}`}
                                                        onClick={() => {
                                                            setLichborneSpec(key);
                                                            // Adjust phylactery HP if switching to/from Phylactery Guardian
                                                            if (key === 'phylactery_guardian') {
                                                                // Can now store up to 75
                                                            } else {
                                                                // Cap at 50 if switching away from Phylactery Guardian
                                                                setLocalPhylacteryHP(Math.min(localPhylacteryHP, 50));
                                                            }
                                                        }}
                                                        title={`${spec.name}: ${getSpecPassive()}`}
                                                    >
                                                        <i className={`fas ${spec.icon}`}></i>
                                                    </button>
                                                ))}
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="action-row" style={{ marginTop: '6px' }}>
                                        <button className="context-menu-button danger" onClick={() => setShowPhylacteryMenu(false)} title="Close">
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
                </div>
            </div>
        );
};

export default EternalFrostPhylacteryResourceBar;
