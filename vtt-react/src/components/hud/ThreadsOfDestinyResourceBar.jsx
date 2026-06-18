import React from 'react';

const ThreadsOfDestinyResourceBar = ({
  fateWeaverState,
  setFateWeaverState,
  uiState,
  setUiState,
  finalClassResource,
  finalConfig,
  character,
  isOwner,
  onClassResourceUpdate,
  size,
  context,
  modifiedConfig,
  threadsBarRef
}) => {
  const {
    localThreads,
    showThreadsMenu,
    fateWeaverHoverSection,
    selectedFateWeaverSpec
  } = fateWeaverState;

  const {
    showTooltip,
    tooltipPosition,
    tooltipPlacement,
  } = uiState;

  const setShowTooltip = (value) => setUiState(prev => ({ ...prev, showTooltip: value }));
  const setTooltipPosition = (value) => setUiState(prev => ({ ...prev, tooltipPosition: value }));
  const setTooltipPlacement = (value) => setUiState(prev => ({ ...prev, tooltipPlacement: value }));

        // Use local state for demo, fallback to classResource
        const currentThreads = localThreads ?? classResource?.current ?? 0;
        const maxThreads = modifiedConfig.mechanics?.max ?? 13;

        const threadLevel = getThreadLevel(currentThreads);

        // Get card suit symbol for segment (cycles through specialization-specific symbols)
        const getCardSuit = (index) => {
            const spec = selectedFateWeaverSpec;
            if (spec === 'fortune-teller') {
                const crystalSymbols = modifiedConfig.visual.crystalSymbols || ['\u25C6', '\u25C8', '\u2736', '\u2605'];
                return crystalSymbols[index % crystalSymbols.length];
            } else if (spec === 'card-master') {
                const cardSymbols = modifiedConfig.visual.cardSymbols || ['card', '♠', '♥', '♦', '♣'];
                return cardSymbols[index % cardSymbols.length];
            } else if (spec === 'thread-weaver') {
                const webSymbols = modifiedConfig.visual.webSymbols || ['\u29B7', '\u2736', '\u2605', '\u25C8'];
                return webSymbols[index % webSymbols.length];
            } else {
                const suits = modifiedConfig.visual.cardSuits || ['♠', '♥', '♦', '♣'];
                return suits[index % suits.length];
            }
        };

        // Get segment color based on specialization
        const getSegmentColor = (index) => {
            const spec = selectedFateWeaverSpec;
            switch (spec) {
                case 'fortune-teller':
                    const crystalProgress = index / maxThreads;
                    if (crystalProgress < 0.25) return '#9370DB'; // Medium purple
                    if (crystalProgress < 0.5) return '#BA55D3'; // Medium orchid
                    if (crystalProgress < 0.75) return '#8A2BE2'; // Blue violet
                    return '#DA70D6'; // Orchid
                case 'card-master':
                    const cardProgress = index / maxThreads;
                    if (cardProgress < 0.25) return '#FFD700'; // Gold
                    if (cardProgress < 0.5) return '#F0E68C'; // Pale goldenrod
                    if (cardProgress < 0.75) return '#DAA520'; // Goldenrod
                    return '#FFA500'; // Orange
                case 'thread-weaver':
                    const webProgress = index / maxThreads;
                    if (webProgress < 0.25) return '#FF1493'; // Deep pink
                    if (webProgress < 0.5) return '#FF69B4'; // Hot pink
                    if (webProgress < 0.75) return '#DC143C'; // Crimson
                    return '#FF6347'; // Tomato
                default:
                    const progress = index / maxThreads;
                    if (progress < 0.25) return '#9370DB'; // Medium purple
                    if (progress < 0.5) return '#B8860B'; // Dark goldenrod
                    if (progress < 0.75) return '#FFD700'; // Gold
                    return '#FFA500'; // Orange-gold
            }
        };

        // Adjustment functions
        const gainThreads = (amount) => {
            const newValue = Math.min(maxThreads, currentThreads + amount);
            const actualAmount = newValue - currentThreads;
            setLocalThreads(newValue);
            if (actualAmount > 0) {
                logClassResourceChange('Thread', actualAmount, true, 'threads');
                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
            }
        };

        const spendThreads = (amount) => {
            const newValue = Math.max(0, currentThreads - amount);
            const actualAmount = currentThreads - newValue;
            setLocalThreads(newValue);
            if (actualAmount > 0) {
                logClassResourceChange('Thread', actualAmount, false, 'threads');
                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
            }
        };

        const resetThreads = () => {
            setLocalThreads(0);
        };

        const setToMax = () => {
            const maxThreads = modifiedConfig.mechanics?.max ?? 13;
            setLocalThreads(maxThreads);
        };

        // Tooltip handlers
        const handleThreadsBarEnter = (e) => {
            setFateWeaverHoverSection('threads');
            const rect = threadsBarRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;

            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
            setTooltipPlacement(spaceBelow > 400 ? 'below' : (spaceAbove > 400 ? 'above' : 'below'));
            setShowTooltip(true);
        };

        const handleThreadsBarLeave = () => {
            setFateWeaverHoverSection(null);
            setShowTooltip(false);
        };

        const handleBarClick = () => {
            setShowThreadsMenu(!showThreadsMenu);
        };

        return (
            <div className={`class-resource-bar threads-of-destiny ${size}`}>
                <div className="threads-bar-wrapper">
                    <div
                        className="threads-bar-container"
                        ref={threadsBarRef}
                        onMouseEnter={handleThreadsBarEnter}
                        onMouseLeave={handleThreadsBarLeave}
                        onClick={handleBarClick}
                        style={{ cursor: 'pointer' }}
                    >
                        {/* Segmented threads bar with specialization symbols */}
                        <div className="threads-segments">
                            {Array.from({ length: maxThreads }, (_, index) => (
                                <div
                                    key={index}
                                    className={`thread-segment ${index < currentThreads ? 'woven' : 'empty'}`}
                                    style={{
                                        backgroundColor: index < currentThreads ? getSegmentColor(index) : modifiedConfig.visual.baseColor,
                                        borderColor: modifiedConfig.visual.segmentBorder,
                                        boxShadow: index < currentThreads ? `0 0 6px ${getSegmentColor(index)}` : 'none'
                                    }}
                                >
                                    {/* Card suit symbol */}
                                    <span className="card-suit-symbol" style={{
                                        color: index < currentThreads ? '#FFF' : 'rgba(147, 112, 219, 0.3)',
                                        opacity: index < currentThreads ? 0.6 : 0.3
                                    }}>
                                        {getCardSuit(index)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Threads value label */}
                        <div className="threads-value-label">
                            {currentThreads} / {maxThreads}
                        </div>
                    </div>

                    {/* Adjustment Menu */}
                    {showThreadsMenu && threadsBarRef.current && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!threadsBarRef.current) return '50%';
                                    const rect = threadsBarRef.current.getBoundingClientRect();
                                    // Find the HUD container to position menu below it
                                    let hudContainer = threadsBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!threadsBarRef.current) return '50%';
                                    const rect = threadsBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Threads: {currentThreads}/{maxThreads}</div>
                                {renderStatusFlavor()}

                                <div className="fateweaver-actions">
                                    <div className="fateweaver-action-row">
                                        <button onClick={() => gainThreads(1)} className="context-menu-button gain" title="Gain 1 Thread (Minor Failure)">
                                            <i className="fas fa-plus"></i>
                                            <span>+1</span>
                                        </button>
                                        <button onClick={() => gainThreads(2)} className="context-menu-button gain" title="Gain 2 Threads (Major Failure)">
                                            <i className="fas fa-plus-circle"></i>
                                            <span>+2</span>
                                        </button>
                                        <button onClick={() => gainThreads(3)} className="context-menu-button gain" title="Gain 3 Threads (Destiny Weaver)">
                                            <i className="fas fa-star"></i>
                                            <span>+3</span>
                                        </button>
                                    </div>
                                    <div className="fateweaver-action-row">
                                        <button onClick={() => spendThreads(2)} className="context-menu-button spend" title="Call Card (-2 Threads)">
                                            <i className="fas fa-hand-sparkles"></i>
                                            <span>-2</span>
                                        </button>
                                        <button onClick={() => spendThreads(3)} className="context-menu-button spend" title="Force Failure (-3 Threads)">
                                            <i className="fas fa-times-circle"></i>
                                            <span>-3</span>
                                        </button>
                                        <button onClick={() => spendThreads(5)} className="context-menu-button spend" title="Force Success (-5 Threads)">
                                            <i className="fas fa-check-circle"></i>
                                            <span>-5</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="fateweaver-specs">
                                    <button
                                        className={`fateweaver-spec-btn ${selectedFateWeaverSpec === 'fortune-teller' ? 'active' : ''}`}
                                        onClick={() => setSelectedFateWeaverSpec('fortune-teller')}
                                        title="Fortune Teller"
                                    >
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    <button
                                        className={`fateweaver-spec-btn ${selectedFateWeaverSpec === 'card-master' ? 'active' : ''}`}
                                        onClick={() => setSelectedFateWeaverSpec('card-master')}
                                        title="Card Master"
                                    >
                                        <i className="fas fa-crown"></i>
                                    </button>
                                    <button
                                        className={`fateweaver-spec-btn ${selectedFateWeaverSpec === 'thread-weaver' ? 'active' : ''}`}
                                        onClick={() => setSelectedFateWeaverSpec('thread-weaver')}
                                        title="Thread Weaver"
                                    >
                                        <i className="fas fa-spider"></i>
                                    </button>
                                </div>

                                <div className="fateweaver-quick-actions">
                                    <button onClick={() => { resetThreads(); setShowThreadsMenu(false); }} className="context-menu-button" title="Reset to 0">
                                        <i className="fas fa-undo"></i>
                                    </button>
                                    <button onClick={setToMax} className="context-menu-button" title={`Set to Max (${modifiedConfig.mechanics?.max ?? 13})`}>
                                        <i className="fas fa-crown"></i>
                                    </button>
                                    <button onClick={() => setShowThreadsMenu(false)} className="context-menu-button" title="Close">
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

export default ThreadsOfDestinyResourceBar;