import React from 'react';

const MayhemModifiersResourceBar = ({
  chaosWeaverState,
  setChaosWeaverState,
  uiState,
  setUiState,
  finalClassResource,
  finalConfig,
  character,
  size,
  context,
  mayhemBarRef,
}) => {
  const {
    showTooltip,
    tooltipPosition,
    tooltipPlacement,
    showModifierMenu,
    chaosWeaverHoverSection,
  } = uiState;

  const setShowTooltip = (value) => setUiState(prev => ({ ...prev, showTooltip: value }));
  const setTooltipPosition = (value) => setUiState(prev => ({ ...prev, tooltipPosition: value }));
  const setTooltipPlacement = (value) => setUiState(prev => ({ ...prev, tooltipPlacement: value }));
  const setShowModifierMenu = (value) => setUiState(prev => ({ ...prev, showModifierMenu: value }));
  const setChaosWeaverHoverSection = (value) => setUiState(prev => ({ ...prev, chaosWeaverHoverSection: value }));

  const { localModifiers } = chaosWeaverState;

        // Use local state for interactive demo
        const modifierCount = localModifiers; // Always use localModifiers for consistency
        const maxModifiers = finalClassResource.max || 20;

        // Calculate bar fill percentage
        const modifierPercentage = (modifierCount / maxModifiers) * 100;
        const intensity = Math.min(modifierCount / maxModifiers, 1);
        const vortexScale = 1 + (intensity * 0.3); // Grows up to 30% larger
        const spinSpeed = 3 - (intensity * 1.5); // Spins faster with more modifiers

        // Determine specialization colors (if available)
        const specColors = finalConfig.visual?.specializations || {};
        const defaultColors = {
            vortex: finalConfig.visual?.vortexColor || '#7C3AED',
            glow: finalConfig.visual?.glowColor || '#D946EF',
            active: finalConfig.visual?.activeColor || '#9333EA'
        };

        // Helper functions for modifier management
        const addModifiers = (amount) => {
            setChaosWeaverState(prev => ({
                ...prev,
                localModifiers: Math.min(prev.localModifiers + amount, maxModifiers)
            }));
        };

        const removeModifiers = (amount) => {
            setChaosWeaverState(prev => ({
                ...prev,
                localModifiers: Math.max(prev.localModifiers - amount, 0)
            }));
        };

        const resetModifiers = () => {
            setChaosWeaverState(prev => ({
                ...prev,
                localModifiers: 0
            }));
        };

        const maxModifiersFunc = () => {
            setChaosWeaverState(prev => ({
                ...prev,
                localModifiers: maxModifiers
            }));
        };

        const rollDice = (diceCount, diceSize) => {
            let total = 0;
            for (let i = 0; i < diceCount; i++) {
                total += Math.floor(Math.random() * diceSize) + 1;
            }
            return total;
        };

        // For small size (HUD), show compact bar with controls
        if (size === 'small' || size === 'normal') {
            return (
                <div
                    className={`class-resource-bar mayhem-modifiers-display ${size}`}
                >
                    <div className="mayhem-bar-wrapper">
                        {showModifierMenu && mayhemBarRef.current && ReactDOM.createPortal(
                            <div
                                className={`unified-context-menu compact ${context === 'party' ? 'chronarch-party' : ''}`}
                                onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                style={{
                                    position: 'fixed',
                                    top: (() => {
                                        if (!mayhemBarRef.current) return '50%';
                                        const rect = mayhemBarRef.current.getBoundingClientRect();
                                        let hudContainer = mayhemBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                        let hudBottom = rect.bottom;
                                        if (hudContainer) {
                                            const hudRect = hudContainer.getBoundingClientRect();
                                            hudBottom = hudRect.bottom;
                                        }
                                        return hudBottom + 8;
                                    })(),
                                    left: (() => {
                                        if (!mayhemBarRef.current) return '50%';
                                        const rect = mayhemBarRef.current.getBoundingClientRect();
                                        return rect.left + (rect.width / 2);
                                    })(),
                                    transform: 'translateX(-50%)',
                                    zIndex: 100000
                                }}
                            >
                                <div className="context-menu-main">
                                    <div className="menu-title">Mayhem Modifiers: {modifierCount}/{maxModifiers}</div>
                                    {renderStatusFlavor()}

                                    <div className="context-menu-section">
                                        <div className="context-menu-section-title">Adjust</div>
                                        <div className="menu-buttons" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                            <button className="context-menu-button" onClick={() => addModifiers(1)}>
                                                <i className="fas fa-plus"></i>
                                                <span>1</span>
                                            </button>
                                            <button className="context-menu-button" onClick={() => removeModifiers(1)}>
                                                <i className="fas fa-minus"></i>
                                                <span>1</span>
                                            </button>
                                            <button className="context-menu-button" onClick={() => addModifiers(5)}>
                                                <i className="fas fa-plus"></i>
                                                <span>5</span>
                                            </button>
                                            <button className="context-menu-button" onClick={() => removeModifiers(5)}>
                                                <i className="fas fa-minus"></i>
                                                <span>5</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="context-menu-section">
                                        <div className="context-menu-section-title">Random</div>
                                        <div className="menu-buttons" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
                                            <button className="context-menu-button" onClick={() => addModifiers(rollDice(1, 4))}>
                                                <i className="fas fa-dice"></i>
                                                <span>1d4</span>
                                            </button>
                                            <button className="context-menu-button" onClick={() => addModifiers(rollDice(2, 4))}>
                                                <i className="fas fa-dice"></i>
                                                <span>2d4</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="menu-buttons">
                                        <button className="context-menu-button" onClick={maxModifiersFunc}>
                                            <i className="fas fa-maximize"></i>
                                            <span>Set to Max</span>
                                        </button>
                                        <button className="context-menu-button" onClick={() => { resetModifiers(); setShowModifierMenu(false); }}>
                                            <i className="fas fa-undo"></i>
                                            <span>Reset to 0</span>
                                        </button>
                                    </div>

                                    <button className="menu-reset" onClick={() => setShowModifierMenu(false)}>
                                        Close
                                    </button>
                                </div>
                            </div>,
                            document.body
                        )}

                        <div
                            ref={mayhemBarRef}
                            className="mayhem-bar-container-hud"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowModifierMenu(v => !v);
                            }}
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={(e) => {
                                setChaosWeaverHoverSection('modifiers');
                                const rect = e.currentTarget.getBoundingClientRect();

                                // Calculate tooltip position with screen boundary detection
                                const tooltipWidth = 300;
                                const tooltipHeight = 250;
                                const padding = 10;

                                let x = rect.left + rect.width / 2;
                                let y = rect.top;
                                let placement = 'above';

                                if (x + tooltipWidth / 2 > window.innerWidth - padding) {
                                    x = window.innerWidth - tooltipWidth / 2 - padding;
                                }

                                if (x - tooltipWidth / 2 < padding) {
                                    x = tooltipWidth / 2 + padding;
                                }

                                if (y - tooltipHeight < padding) {
                                    y = rect.bottom;
                                    placement = 'below';
                                }

                                setTooltipPosition({ x, y });
                                setTooltipPlacement(placement);
                                setShowTooltip(true);
                            }}
                            onMouseLeave={() => {
                                setChaosWeaverHoverSection(null);
                                setShowTooltip(false);
                            }}
                        >
                            <div
                                className="mayhem-bar-background"
                            >
                                <div
                                    className="mayhem-bar-fill-hud"
                                    style={{
                                        width: `${modifierPercentage}%`,
                                        background: `linear-gradient(90deg,
                                            ${defaultColors.active} 0%,
                                            ${defaultColors.glow} 50%,
                                            ${defaultColors.active} 100%
                                        )`,
                                        backgroundSize: '200% 100%',
                                        boxShadow: `0 0 8px ${defaultColors.glow}`
                                    }}
                                />
                            </div>
                            <div className="mayhem-bar-text">
                                {modifierCount}/{maxModifiers}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // For normal and large sizes, show simple progress bar
        return (
            <div className={`class-resource-bar mayhem-modifiers-display ${size}`}>
                <div className="mayhem-bar-container">
                    <div
                        className="mayhem-modifier-bar"
                        onMouseEnter={(e) => {
                            setChaosWeaverHoverSection('modifiers');
                            const rect = e.currentTarget.getBoundingClientRect();

                            // Calculate tooltip position with screen boundary detection
                            const tooltipWidth = 300;
                            const tooltipHeight = 250;
                            const padding = 10;

                            let x = rect.left + rect.width / 2;
                            let y = rect.top;
                            let placement = 'above';

                            // Check horizontal boundaries
                            if (x + tooltipWidth / 2 > window.innerWidth - padding) {
                                x = window.innerWidth - tooltipWidth / 2 - padding;
                            }

                            if (x - tooltipWidth / 2 < padding) {
                                x = tooltipWidth / 2 + padding;
                            }

                            // Check vertical boundaries
                            if (y - tooltipHeight < padding) {
                                y = rect.bottom;
                                placement = 'below';
                            }

                            setTooltipPosition({ x, y });
                            setTooltipPlacement(placement);
                            setShowTooltip(true);
                        }}
                        onMouseLeave={() => {
                            setChaosWeaverHoverSection(null);
                            setShowTooltip(false);
                        }}
                    >
                        <div
                            className="mayhem-bar-fill"
                            style={{
                                width: `${modifierPercentage}%`,
                                background: `linear-gradient(90deg, ${defaultColors.active}, ${defaultColors.glow})`,
                                boxShadow: `0 0 8px ${defaultColors.glow}`
                            }}
                        />
                        <div className="mayhem-count-display">
                            <span className="mayhem-icon">{finalConfig.visual?.icon ? <i className={finalConfig.visual.icon}></i> : null}</span>
                            <span className="mayhem-count">{modifierCount}/{maxModifiers}</span>
                        </div>
                    </div>

                    {size === 'large' && (
                        <div className="mayhem-controls">
                            <button
                                className="context-menu-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowModifierMenu(v => !v);
                                }}
                                title="Adjust Mayhem Modifiers"
                            >
                                <i className="fas fa-sliders-h"></i>
                            </button>

                            {showModifierMenu && mayhemBarRef.current && ReactDOM.createPortal(
                                <div
                                    className={`unified-context-menu compact ${context === 'party' ? 'chronarch-party' : ''}`}
                                    onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                    style={{
                                        position: 'fixed',
                                        top: (() => {
                                            if (!mayhemBarRef.current) return '50%';
                                            const rect = mayhemBarRef.current.getBoundingClientRect();
                                            let hudContainer = mayhemBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                            let hudBottom = rect.bottom;
                                            if (hudContainer) {
                                                const hudRect = hudContainer.getBoundingClientRect();
                                                hudBottom = hudRect.bottom;
                                            }
                                            return hudBottom + 8;
                                        })(),
                                        left: (() => {
                                            if (!mayhemBarRef.current) return '50%';
                                            const rect = mayhemBarRef.current.getBoundingClientRect();
                                            return rect.left + (rect.width / 2);
                                        })(),
                                        transform: 'translateX(-50%)',
                                        zIndex: 100000
                                    }}
                                >
                                    <div className="context-menu-main">
                                        <div className="menu-title">Mayhem Control: {modifierCount}/{maxModifiers}</div>
                                        {renderStatusFlavor()}
                                        <div className="context-menu-section">
                                            <div className="context-menu-section-title">Adjust</div>
                                            <div className="menu-buttons" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                                <button className="context-menu-button" onClick={() => addModifiers(1)}>
                                                    <i className="fas fa-plus"></i>
                                                    <span>1</span>
                                                </button>
                                                <button className="context-menu-button" onClick={() => removeModifiers(1)}>
                                                    <i className="fas fa-minus"></i>
                                                    <span>1</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="context-menu-section">
                                            <div className="context-menu-section-title">Random</div>
                                            <div className="menu-buttons" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
                                                <button className="context-menu-button" onClick={() => addModifiers(rollDice(1, 4))}>
                                                    <i className="fas fa-dice"></i>
                                                    <span>1d4</span>
                                                </button>
                                                <button className="context-menu-button" onClick={() => addModifiers(rollDice(2, 4))}>
                                                    <i className="fas fa-dice"></i>
                                                    <span>2d4</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="menu-buttons">
                                            <button className="context-menu-button" onClick={maxModifiersFunc}>
                                                <i className="fas fa-maximize"></i>
                                                <span>Set to Max</span>
                                            </button>
                                            <button className="context-menu-button" onClick={() => { resetModifiers(); setShowModifierMenu(false); }}>
                                                <i className="fas fa-undo"></i>
                                                <span>Reset to 0</span>
                                            </button>
                                        </div>
                                        <button className="menu-reset" onClick={() => setShowModifierMenu(false)}>
                                            Close
                                        </button>
                                    </div>
                                </div>,
                                document.body
                            )}
                        </div>
                    )}
                </div>
            </div>
        );

};

export default MayhemModifiersResourceBar;