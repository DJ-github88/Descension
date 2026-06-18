import React from 'react';

const LunarPhasesResourceBar = ({
  lunarchState,
  setLunarchState,
  uiState,
  setUiState,
  finalClassResource,
  finalConfig,
  character,
  isOwner,
  onClassResourceUpdate,
  size,
  context,
  lunarPhaseBarRef
}) => {
  const {
    currentLunarPhase,
    roundsInPhase,
    lunarchSpec,
    lunarchHoverSection,
    showLunarPhaseMenu
  } = lunarchState;

  const {
    showTooltip,
    tooltipPosition,
    tooltipPlacement,
  } = uiState;

  const setShowTooltip = (value) => setUiState(prev => ({ ...prev, showTooltip: value }));
  const setTooltipPosition = (value) => setUiState(prev => ({ ...prev, tooltipPosition: value }));
  const setTooltipPlacement = (value) => setUiState(prev => ({ ...prev, tooltipPlacement: value }));

        // Get phase configurations
        const phases = finalConfig.visual;
        const phaseOrder = ['new_moon', 'waxing_moon', 'full_moon', 'waning_moon'];
        const currentPhaseIndex = phaseOrder.indexOf(currentLunarPhase);
        const currentPhaseConfig = phases[currentLunarPhase];

        // Get specialization config
        const specConfig = phases[lunarchSpec];

        // Handlers
        const handlePhaseClick = () => {
            setShowLunarPhaseMenu(!showLunarPhaseMenu);
            if (!showLunarPhaseMenu) {
                setShowTooltip(false);
                setLunarchHoverSection(null);
            }
        };

        const handlePhaseEnter = (e) => {
            if (showLunarPhaseMenu) return;
            setLunarchHoverSection('phase');
            const rect = e.currentTarget.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            // Calculate available space
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;
            const spaceRight = viewportWidth - rect.right;
            const spaceLeft = rect.left;

            // Adjust x position to keep tooltip in viewport
            let x = rect.left + rect.width / 2;
            const tooltipWidth = 300; // Estimated tooltip width
            if (x + tooltipWidth / 2 > viewportWidth) {
                x = viewportWidth - tooltipWidth / 2 - 10;
            } else if (x - tooltipWidth / 2 < 0) {
                x = tooltipWidth / 2 + 10;
            }

            setTooltipPosition({ x, y: rect.top });
            setShowTooltip(true);
        };

        const handleTimerEnter = (e) => {
            if (showLunarPhaseMenu) return;
            setLunarchHoverSection('timer');
            const rect = e.currentTarget.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            // Calculate available space
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;
            const spaceRight = viewportWidth - rect.right;
            const spaceLeft = rect.left;

            // Adjust x position to keep tooltip in viewport
            let x = rect.left + rect.width / 2;
            const tooltipWidth = 300; // Estimated tooltip width
            if (x + tooltipWidth / 2 > viewportWidth) {
                x = viewportWidth - tooltipWidth / 2 - 10;
            } else if (x - tooltipWidth / 2 < 0) {
                x = tooltipWidth / 2 + 10;
            }

            setTooltipPosition({ x, y: rect.top });
            setShowTooltip(true);
        };

        const handleLeave = () => {
            if (showLunarPhaseMenu) return;
            setLunarchHoverSection(null);
            setShowTooltip(false);
        };

        const handleManualShift = (newPhase) => {
            setCurrentLunarPhase(newPhase);
            setRoundsInPhase(0);
            setShowLunarPhaseMenu(false);
        };

        const handleAdvanceRound = () => {
            const newRounds = roundsInPhase + 1;
            if (newRounds >= 3) {
                // Cycle to next phase
                const nextIndex = (currentPhaseIndex + 1) % 4;
                setCurrentLunarPhase(phaseOrder[nextIndex]);
                setRoundsInPhase(0);
            } else {
                setRoundsInPhase(newRounds);
            }
        };

        // Get phase bonuses
        const getPhaseBonuses = (phase) => {
            switch (phase) {
                case 'new_moon':
                    return { bonus: '+2 Armor', theme: 'Defense' };
                case 'waxing_moon':
                    return { bonus: 'Healing +1d4', theme: 'Healing' };
                case 'full_moon':
                    return { bonus: 'Damage +2d6', theme: 'Offense' };
                case 'waning_moon':
                    return { bonus: 'Mana -2 cost', theme: 'Efficiency' };
                default:
                    return { bonus: '', theme: '' };
            }
        };

        const getSpecPassive = () => {
            switch (lunarchSpec) {
                case 'moonlight_sentinel':
                    return 'Critical hits during Full Moon deal +2d6 radiant damage.';
                case 'starfall_invoker':
                    return 'AoE spells during Full Moon affect +5 ft radius.';
                case 'lunar_guardian':
                    return 'Healing during Waxing Moon grants +1d6 temporary HP.';
                default:
                    return '';
            }
        };

        return (
            <div className={`class-resource-bar lunar-phases ${size}`}>
                <>
                    {/* Lunar Phase Bar */}
                    <div className="lunar-phase-bar-wrapper" ref={lunarPhaseBarRef}>
                        {/* Moon Icon (Left) */}
                        <div
                            className="lunar-moon-icon"
                            onClick={handlePhaseClick}
                            onMouseEnter={handlePhaseEnter}
                            onMouseLeave={handleLeave}
                            style={{
                                cursor: 'pointer',
                                background: `radial-gradient(circle, ${currentPhaseConfig.color} 0%, ${currentPhaseConfig.glow} 60%, transparent 100%)`,
                                borderColor: currentPhaseConfig.glow,
                                boxShadow: `0 0 20px ${currentPhaseConfig.glow}, inset 0 0 12px ${currentPhaseConfig.color}`
                            }}
                        >
                            <i className={`fas ${currentPhaseConfig.icon}`} style={{ color: currentPhaseConfig.glow }}></i>
                        </div>

                        {/* Phase Bar Content */}
                        <div
                            className="lunar-phase-bar-content"
                            onClick={handlePhaseClick}
                            onMouseEnter={handlePhaseEnter}
                            onMouseLeave={handleLeave}
                            style={{
                                cursor: 'pointer',
                                borderColor: currentPhaseConfig.glow,
                                boxShadow: `inset 0 2px 4px rgba(0, 0, 0, 0.5), 0 0 15px ${currentPhaseConfig.glow}33`
                            }}
                        >
                            {/* 4 Phase Segments */}
                            <div className="lunar-phase-segments">
                                {phaseOrder.map((phase, index) => {
                                    const phaseConfig = phases[phase];
                                    const isActive = phase === currentLunarPhase;
                                    const isPast = index < currentPhaseIndex;
                                    const isFuture = index > currentPhaseIndex;

                                    return (
                                        <div
                                            key={phase}
                                            className={`lunar-phase-segment ${isActive ? 'active' : isPast ? 'past' : 'future'}`}
                                            style={{
                                                backgroundColor: isActive ? phaseConfig.color : isPast ? `${phaseConfig.color}60` : 'rgba(139, 69, 19, 0.2)',
                                                borderColor: isActive ? phaseConfig.glow : 'rgba(139, 69, 19, 0.4)',
                                                boxShadow: isActive ? `0 0 12px ${phaseConfig.glow}, inset 0 0 8px ${phaseConfig.glow}` : 'none'
                                            }}
                                        >
                                            <i className={`fas ${phaseConfig.icon}`} style={{
                                                color: isActive ? phaseConfig.glow : isPast ? `${phaseConfig.glow}60` : 'rgba(150, 150, 170, 0.5)',
                                                fontSize: '9px'
                                            }}></i>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Round Timer (Right) */}
                        <div
                            className="lunar-round-timer"
                            onMouseEnter={handleTimerEnter}
                            onMouseLeave={handleLeave}
                            style={{
                                borderColor: currentPhaseConfig.glow
                            }}
                        >
                            <div className="timer-segments">
                                {[0, 1, 2].map((round) => (
                                    <div
                                        key={round}
                                        className={`timer-segment ${round < roundsInPhase ? 'filled' : 'empty'}`}
                                        style={{
                                            backgroundColor: round < roundsInPhase ? currentPhaseConfig.glow : 'rgba(50, 50, 70, 0.4)',
                                            boxShadow: round < roundsInPhase ? `0 0 6px ${currentPhaseConfig.glow}` : 'none'
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="timer-label" style={{ color: currentPhaseConfig.glow }}>
                                {roundsInPhase + 1}/3
                            </div>
                        </div>
                    </div>

                    {/* Phase Menu */}
                    {showLunarPhaseMenu && lunarPhaseBarRef.current && ReactDOM.createPortal(
                        <div
                            className="unified-context-menu compact"
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!lunarPhaseBarRef.current) return '50%';
                                    const rect = lunarPhaseBarRef.current.getBoundingClientRect();
                                    let hudContainer = lunarPhaseBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!lunarPhaseBarRef.current) return '50%';
                                    const rect = lunarPhaseBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="context-menu-section">
                                    <div className="context-menu-section-header" style={{ fontSize: '10px', marginBottom: '6px' }}>
                                        {currentPhaseConfig.name} - Round {roundsInPhase + 1}/3
                                    </div>

                                    {/* Advance Round */}
                                    <div style={{ marginBottom: '6px' }}>
                                        <button className="context-menu-button" onClick={handleAdvanceRound} title="Advance Round">
                                            <i className="fas fa-forward"></i> Advance
                                        </button>
                                    </div>

                                    {/* Manual Phase Shift */}
                                    <div style={{ marginBottom: '6px' }}>
                                        <div style={{ fontSize: '9px', color: '#8b7355', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Phase Shift (8 Mana)
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '3px' }}>
                                            {phaseOrder.map((phase) => {
                                                const phaseConfig = phases[phase];
                                                const bonuses = getPhaseBonuses(phase);
                                                const isCurrentPhase = phase === currentLunarPhase;

                                                return (
                                                    <button
                                                        key={phase}
                                                        className={`context-menu-button ${isCurrentPhase ? 'active' : ''}`}
                                                        onClick={() => !isCurrentPhase && handleManualShift(phase)}
                                                        disabled={isCurrentPhase}
                                                        style={{
                                                            opacity: isCurrentPhase ? 0.5 : 1,
                                                            fontSize: '9px',
                                                            padding: '4px 6px'
                                                        }}
                                                        title={`${phaseConfig.name}: ${bonuses.bonus}`}
                                                    >
                                                        <i className={`fas ${phaseConfig.icon}`} style={{ color: phaseConfig.glow, marginRight: '3px' }}></i>
                                                        <span style={{ fontSize: '8px' }}>{phaseConfig.name}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>


                                    {/* Quick Actions */}
                                    <div className="action-row" style={{ marginTop: '6px' }}>
                                        <button className="context-menu-button danger" onClick={() => setShowLunarPhaseMenu(false)} title="Close">
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
                </>
            </div>
        );

};

export default LunarPhasesResourceBar;