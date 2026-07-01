import React from 'react';
import ReactDOM from 'react-dom';

const DominanceDieResourceBar = ({
  exorcistState,
  setExorcistState,
  uiState,
  setUiState,
  finalClassResource,
  finalConfig,
  character,
  isOwner,
  onClassResourceUpdate,
  size,
  context,
  dominanceBarRef,
  renderStatusFlavor,
}) => {
  const {
    localDominanceDie,
    selectedDemonIndex,
    boundDemons,
    showDominanceMenu,
    exorcistHoverSection,
    showDemonConfigModal,
    demonConfigMode,
    demonConfigInitialData
  } = exorcistState;

  const {
    showTooltip,
    tooltipPosition,
    tooltipPlacement,
  } = uiState;

  const setShowTooltip = (value) => setUiState(prev => ({ ...prev, showTooltip: value }));
  const setTooltipPosition = (value) => setUiState(prev => ({ ...prev, tooltipPosition: value }));
  const setTooltipPlacement = (value) => setUiState(prev => ({ ...prev, tooltipPlacement: value }));
  const setLocalDominanceDie = (value) => setExorcistState(prev => ({ ...prev, localDominanceDie: value }));
  const setBoundDemons = (value) => setExorcistState(prev => ({ ...prev, boundDemons: value }));
  const setSelectedDemonIndex = (value) => setExorcistState(prev => ({ ...prev, selectedDemonIndex: value }));
  const setShowDominanceMenu = (value) => setExorcistState(prev => ({ ...prev, showDominanceMenu: value }));
  const setExorcistHoverSection = (value) => setExorcistState(prev => ({ ...prev, exorcistHoverSection: value }));
  const setDemonConfigMode = (value) => setExorcistState(prev => ({ ...prev, demonConfigMode: value }));
  const setDemonConfigInitialData = (value) => setExorcistState(prev => ({ ...prev, demonConfigInitialData: value }));
  const setShowDemonConfigModal = (value) => setExorcistState(prev => ({ ...prev, showDemonConfigModal: value }));

        // Use local state for demo, fallback to classResource
        const currentDemon = boundDemons[selectedDemonIndex];
        const currentDD = currentDemon?.dd ?? localDominanceDie ?? finalClassResource?.current ?? 0;

        // Check if demon slot is empty or escaped
        const isDemonBound = currentDemon && currentDD > 0;

        // Map DD value to percentage (d12=100%, d10=75%, d8=50%, d6=25%, 0=0%)
        const ddToPercentage = (dd) => {
            switch (dd) {
                case 12: return 100;
                case 10: return 75;
                case 8: return 50;
                case 6: return 25;
                case 0: return 0;
                default: return 0;
            }
        };

        // Get color based on DD value
        const getDDColor = (dd) => {
            if (!isDemonBound) return finalConfig.visual.baseColor;
            switch (dd) {
                case 12: return finalConfig.visual.activeColor; // Gold - safe
                case 10: return '#F4C430'; // Yellow-gold - good
                case 8: return finalConfig.visual.warningColor; // Orange - moderate risk
                case 6: return finalConfig.visual.dangerColor; // Red - high risk
                case 0: return finalConfig.visual.criticalColor; // Dark red - critical
                default: return finalConfig.visual.baseColor;
            }
        };

        // Get DD label and demon name
        const getDemonDisplay = () => {
            if (!currentDemon) return { name: 'No demon bound to this slot', ddLabel: '—' };
            if (currentDD === 0) return { name: 'No demon bound to this slot', ddLabel: 'ESCAPED' };
            return { name: currentDemon.name, ddLabel: `d${currentDD}` };
        };

        const { name: demonName, ddLabel } = getDemonDisplay();
        const percentage = ddToPercentage(currentDD);
        const barColor = getDDColor(currentDD);

        // Handlers for tooltip
        const handleDominanceBarEnter = (e) => {
            setExorcistHoverSection('dominance');
            const rect = e.currentTarget.getBoundingClientRect();
            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
            setShowTooltip(true);
        };

        const handleDominanceBarLeave = () => {
            setExorcistHoverSection(null);
            setShowTooltip(false);
        };

        // Decrease DD by one step
        const decreaseDD = () => {
            if (!currentDemon) return;
            const progression = [12, 10, 8, 6, 0];
            const currentIndex = progression.indexOf(currentDD);
            if (currentIndex < progression.length - 1) {
                const newDD = progression[currentIndex + 1];
                setLocalDominanceDie(newDD);
                // Update the demon's DD in the array
                const updatedDemons = [...boundDemons];
                if (updatedDemons[selectedDemonIndex]) {
                    updatedDemons[selectedDemonIndex].dd = newDD;
                    setBoundDemons(updatedDemons);
                }
            }
        };

        // Increase DD by one step
        const increaseDD = () => {
            if (!currentDemon) return;
            const progression = [12, 10, 8, 6, 0];
            const currentIndex = progression.indexOf(currentDD);
            if (currentIndex > 0) {
                const newDD = progression[currentIndex - 1];
                setLocalDominanceDie(newDD);
                // Update the demon's DD in the array
                const updatedDemons = [...boundDemons];
                if (updatedDemons[selectedDemonIndex]) {
                    updatedDemons[selectedDemonIndex].dd = newDD;
                    setBoundDemons(updatedDemons);
                }
            }
        };

        // Restore DD to maximum
        const restoreDD = () => {
            if (!currentDemon) return;
            setLocalDominanceDie(12);
            const updatedDemons = [...boundDemons];
            if (updatedDemons[selectedDemonIndex]) {
                updatedDemons[selectedDemonIndex].dd = 12;
                setBoundDemons(updatedDemons);
            }
        };

        // Switch to next demon
        const nextDemon = () => {
            const nextIndex = (selectedDemonIndex + 1) % boundDemons.length;
            setSelectedDemonIndex(nextIndex);
            setLocalDominanceDie(boundDemons[nextIndex]?.dd || 0);
        };

        // Switch to previous demon
        const prevDemon = () => {
            const prevIndex = selectedDemonIndex === 0 ? boundDemons.length - 1 : selectedDemonIndex - 1;
            setSelectedDemonIndex(prevIndex);
            setLocalDominanceDie(boundDemons[prevIndex]?.dd || 0);
        };

        return (
            <div className={`class-resource-bar dominance-die-display ${size}`}>
                <div className="dominance-bar-wrapper">
                    <div
                        className="dominance-bar-container"
                        ref={dominanceBarRef}
                        onMouseEnter={handleDominanceBarEnter}
                        onMouseLeave={handleDominanceBarLeave}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDominanceMenu(!showDominanceMenu);
                        }}
                    >
                        <div className="bar-background" style={{
                            borderColor: barColor,
                            boxShadow: `inset 0 2px 4px rgba(0, 0, 0, 0.5), 0 0 8px ${barColor}`
                        }}>
                            <div
                                className="bar-fill"
                                style={{
                                    width: `${percentage}%`,
                                    backgroundColor: barColor,
                                    boxShadow: `0 0 10px ${barColor}`
                                }}
                            />
                            <div className="bar-text">
                                <span className="demon-name">{demonName}</span>
                                {isDemonBound && <span className="dd-value">{ddLabel}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Dominance Adjustment Menu */}
                    {showDominanceMenu && dominanceBarRef.current && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!dominanceBarRef.current) return '50%';
                                    const rect = dominanceBarRef.current.getBoundingClientRect();
                                    let hudContainer = dominanceBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!dominanceBarRef.current) return '50%';
                                    const rect = dominanceBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">
                                    {isDemonBound ? `${demonName} (DD: ${currentDD}/12)` : `Slot ${selectedDemonIndex + 1}/${boundDemons.length}`}
                                </div>
                                {renderStatusFlavor()}

                                <div className="exorcist-slot-controls">
                                    <button
                                        className="context-menu-button"
                                        onClick={prevDemon}
                                        disabled={boundDemons.length <= 1}
                                        title="Previous Slot"
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                    <span className="exorcist-slot-display">{selectedDemonIndex + 1}/{boundDemons.length}</span>
                                    <button
                                        className="context-menu-button"
                                        onClick={nextDemon}
                                        disabled={boundDemons.length <= 1}
                                        title="Next Slot"
                                    >
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>

                                {isDemonBound && (
                                    <div className="exorcist-dominance-controls">
                                        <div className="exorcist-dominance-row">
                                            <button
                                                className="context-menu-button decrease"
                                                onClick={decreaseDD}
                                                disabled={currentDD === 0}
                                                title="Demon Acts (-1 DD)"
                                            >
                                                <i className="fas fa-arrow-down"></i>
                                                <span>-1</span>
                                            </button>
                                            <button
                                                className="context-menu-button increase"
                                                onClick={increaseDD}
                                                disabled={currentDD === 12}
                                                title="Replenish (+1 DD)"
                                            >
                                                <i className="fas fa-arrow-up"></i>
                                                <span>+1</span>
                                            </button>
                                            <button
                                                className="context-menu-button restore"
                                                onClick={restoreDD}
                                                disabled={currentDD === 12}
                                                title="Max Dominance (d12)"
                                            >
                                                <i className="fas fa-redo"></i>
                                                <span>Max</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="exorcist-demon-management">
                                    {!currentDemon || currentDD === 0 ? (
                                        <button
                                            className="context-menu-button"
                                            onClick={() => {
                                                setDemonConfigMode('create');
                                                setDemonConfigInitialData(null);
                                                setShowDemonConfigModal(true);
                                            }}
                                            title="Bind New Demon"
                                        >
                                            <i className="fas fa-plus-circle"></i>
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                className="context-menu-button"
                                                onClick={() => {
                                                    setDemonConfigMode('edit');
                                                    setDemonConfigInitialData(currentDemon);
                                                    setShowDemonConfigModal(true);
                                                }}
                                                title="Edit Demon"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className="context-menu-button danger"
                                                onClick={() => {
                                                    if (window.confirm(`Release ${currentDemon.name}?`)) {
                                                        const updatedDemons = [...boundDemons];
                                                        updatedDemons[selectedDemonIndex] = null;
                                                        setBoundDemons(updatedDemons);
                                                        setLocalDominanceDie(0);
                                                    }
                                                }}
                                                title="Release Demon"
                                            >
                                                <i className="fas fa-unlink"></i>
                                            </button>
                                        </>
                                    )}
                                </div>

                                <div className="exorcist-slots-controls">
                                    <button
                                        className="context-menu-button"
                                        onClick={() => {
                                            if (boundDemons.length >= 4) {
                                                alert('Maximum 4 demon slots (Demonologist spec)');
                                                return;
                                            }
                                            setBoundDemons([...boundDemons, null]);
                                        }}
                                        disabled={boundDemons.length >= 4}
                                        title={`Add Slot (${boundDemons.length}/4 max)`}
                                    >
                                        <i className="fas fa-plus"></i>
                                    </button>
                                    <button
                                        className="context-menu-button danger"
                                        onClick={() => {
                                            if (boundDemons.length <= 1) {
                                                alert('Must have at least 1 demon slot');
                                                return;
                                            }
                                            const updatedDemons = [...boundDemons];
                                            updatedDemons.pop();
                                            setBoundDemons(updatedDemons);
                                            if (selectedDemonIndex >= updatedDemons.length) {
                                                setSelectedDemonIndex(updatedDemons.length - 1);
                                                setLocalDominanceDie(updatedDemons[updatedDemons.length - 1]?.dd || 0);
                                            }
                                        }}
                                        disabled={boundDemons.length <= 1}
                                        title="Remove Slot"
                                    >
                                        <i className="fas fa-minus"></i>
                                    </button>
                                </div>

                                <div className="exorcist-quick-actions">
                                    <button
                                        onClick={() => setShowDominanceMenu(false)}
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

export default DominanceDieResourceBar;