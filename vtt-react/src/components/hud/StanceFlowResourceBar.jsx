import React from 'react';

const StanceFlowResourceBar = ({
  shaperState,
  setShaperState,
  finalClassResource,
  finalConfig,
  character,
  isOwner,
  onClassResourceUpdate,
  size,
  context,
  momentumBarRef,
  flourishBarRef,
  stanceBarRef,
  setShowTooltip,
  setTooltipPosition,
}) => {
  const {
    currentStance,
    showStanceMenu,
    showMomentumMenu,
    showFlourishMenu,
    selectedSpecialization,
  } = shaperState;

  const setCurrentStance = (value) => setShaperState(prev => ({ ...prev, currentStance: value }));
  const setShowStanceMenu = (value) => setShaperState(prev => ({ ...prev, showStanceMenu: value }));
  const setShowMomentumMenu = (value) => setShaperState(prev => ({ ...prev, showMomentumMenu: value }));
  const setShowFlourishMenu = (value) => setShaperState(prev => ({ ...prev, showFlourishMenu: value }));
  const setShowSpecPassiveMenu = (value) => setShaperState(prev => ({ ...prev, showSpecPassiveMenu: value }));
  const setShaperHoverSection = (value) => setShaperState(prev => ({ ...prev, shaperHoverSection: value }));

  const shaperMomentum = finalClassResource?.momentum?.current ?? finalClassResource?.momentum ?? 0;
  const shaperFlourish = finalClassResource?.flourish?.current ?? finalClassResource?.flourish ?? 3;
  const stanceValue = context === 'account'
    ? (finalClassResource?.stance?.current ?? 'Ataxic Flow')
    : currentStance;

        // Use actual character resource values for account context, local state for HUD
        const momentumValue = context === 'account'
            ? (finalClassResource?.momentum?.current ?? finalClassResource?.current ?? 0)
            : shaperMomentum;
        const flourishValue = context === 'account'
            ? (finalClassResource?.flourish?.current ?? 0)
            : shaperFlourish;
        const momentumMax = finalConfig.mechanics?.momentum?.max || 20;
        const flourishMax = finalConfig.mechanics?.flourish?.max || 5;
        const momentumPercentage = (momentumValue / momentumMax) * 100;
        const flourishPercentage = (flourishValue / flourishMax) * 100;

        const stances = finalConfig.visual?.stances || {};
        const stanceNetwork = finalConfig.stanceNetwork || {};
        const transitionCosts = finalConfig.transitionCosts || {};

        // Get available transitions from current stance
        let availableTransitions = stanceNetwork[stanceValue] || [];

        // Primal Shadow can enter Void Predator from any stance
        if (selectedSpecialization === 'Primal Shadow' && !availableTransitions.includes('Void Predator')) {
            availableTransitions = [...availableTransitions, 'Void Predator'];
        }

        // Calculate transition cost based on specialization
        const getTransitionCost = (fromStance, toStance) => {
            // Primal Shadow: entering Void Predator from any stance costs 3 Flux
            if (selectedSpecialization === 'Primal Shadow' && toStance === 'Void Predator') {
                return 3;
            }

            let baseCost = transitionCosts[fromStance]?.[toStance] || 2;

            // Apply Flow Master passive: -1 Momentum cost (minimum 1)
            if (selectedSpecialization === 'Flow Master') {
                baseCost = Math.max(1, baseCost - 1);
            }

            return baseCost;
        };

        // Handle stance transition (only for HUD context)
        const transitionToStance = (targetStance) => {
            if (context === 'account' || !availableTransitions.includes(targetStance)) return;

            const cost = getTransitionCost(stanceValue, targetStance);
            if (momentumValue >= cost) {
                if (onClassResourceUpdate) onClassResourceUpdate('momentum', momentumValue - cost);
                setCurrentStance(targetStance);
                setShowStanceMenu(false);
            }
        };

        const currentStanceData = stances[stanceValue] || {};

        // Stance data with detailed bonuses/penalties
        const stanceDetails = {
            'Ataxic Flow': {
                bonuses: ['+2 dodge', '+10 ft movement', 'Advantage on Disengage'],
                penalties: ['No offensive bonuses']
            },
            'Arterial Strike': {
                bonuses: ['+2 attack rolls', 'Expanded crit range'],
                penalties: ['No defensive bonuses']
            },
            'Centrifugal Fury': {
                bonuses: ['Attacks cleave to adjacent enemies', '+5 ft reach'],
                penalties: ['Cannot parry']
            },
            'Deadened Bastion': {
                bonuses: ['Reaction parry', '+20 temp HP', 'Immune to knockback'],
                penalties: ['-15 ft movement', 'Cannot dash']
            },
            'Fluid Apex': {
                bonuses: ['+1 all rolls', 'Can transition to any form (4 Flux)'],
                penalties: ['No stance-specific defensive bonuses']
            },
            'Void Predator': {
                bonuses: ['Advantage on first attack', '+2d6 damage from stealth', '+10 ft movement'],
                penalties: ['Penalties in bright light']
            }
        };

        // Get specialization passive based on selected spec
        const getSpecPassive = () => {
            const passives = {
                'Flow Master': {
                    name: 'Chimeric Current',
                    description: 'All transitions cost 1 less Flux (min 1). Next attack after shift deals +1d6 bonus damage.'
                },
                'Iron Dancer': {
                    name: 'Steely Harvest',
                    description: 'In Arterial Strike or Deadened Bastion: +2 attack, reroll 1s on damage. On killing blow, harvest one trait from enemy for rest of combat at +1 Body Toll.'
                },
                'Primal Shadow': {
                    name: 'Shadow Affinity',
                    description: 'Enter Void Predator from ANY form for 3 Flux. Void Predator: lightly obscured, +1d6 bonus damage. Stealth attacks generate +1 extra Flux and +1 Body Toll.'
                }
            };
            return passives[selectedSpecialization] || passives['Flow Master'];
        };

        return (
            <div className={`class-resource-bar stance-flow ${size}`}>
                <div className="stance-flow-compact">
                    {/* Flux Zone (left) â€” clickable overlay */}
                    <div
                        ref={momentumBarRef}
                        className="shaper-zone-overlay shaper-zone-left"
                        style={{
                            position: 'absolute', left: 0, top: 0,
                            width: 'calc(50% - 14px)', height: '100%',
                            zIndex: 2, cursor: 'pointer'
                        }}
                        onClick={(e) => {
                            if (context === 'account') return;
                            e.stopPropagation();
                            setShowMomentumMenu(!showMomentumMenu);
                            setShowFlourishMenu(false);
                            setShowStanceMenu(false);
                            setShowSpecPassiveMenu(false);
                        }}
                        onMouseEnter={() => { setShaperHoverSection('momentum'); setShowTooltip(true); }}
                        onMouseLeave={() => { setShaperHoverSection(null); setShowTooltip(false); }}
                    />

                    {/* Canvas â€” visual rendering only */}
                    <ResourceCanvasBar
                        rendererType="stance-flow"
                        size={size}
                        layoutMode="multi-zone"
                        spheres={[]}
                        elements={[]}
                        config={{
                            momentum: { current: momentumValue, max: momentumMax },
                            flourish: { current: flourishValue, max: flourishMax },
                            currentStance: stanceValue,
                            stances,
                            transitionCosts,
                            availableTransitions,
                            specialization: selectedSpecialization,
                        }}
                        isOwner={false}
                        style={{ width: '100%' }}
                        onElementHover={(hit) => {
                            if (!hit) {
                                // Only clear if not hovering an overlay
                                return;
                            }
                            if (hit.zone === 'momentum') {
                                setShaperHoverSection('momentum');
                            } else if (hit.zone === 'stance') {
                                setShaperHoverSection('stance');
                            } else if (hit.zone === 'flourish') {
                                setShaperHoverSection('flourish');
                            }
                        }}
                    />

                    {/* Stance Icon Overlay (HTML FA icon on top of canvas glow) */}
                    <div
                        ref={stanceBarRef}
                        className="stance-icon-overlay"
                        onClick={(e) => {
                            if (context === 'account') return;
                            e.stopPropagation();
                            setShowStanceMenu(!showStanceMenu);
                            setShowMomentumMenu(false);
                            setShowFlourishMenu(false);
                            setShowSpecPassiveMenu(false);
                        }}
                        onMouseEnter={(e) => {
                            setShaperHoverSection('stance');
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                            setShowTooltip(true);
                        }}
                        onMouseLeave={() => {
                            setShaperHoverSection(null);
                            setShowTooltip(false);
                        }}
                    >
                        <i className={currentStanceData.icon} style={{ color: currentStanceData.color }}></i>
                    </div>

                    {/* Body Toll Zone (right) â€” clickable overlay */}
                    <div
                        ref={flourishBarRef}
                        className="shaper-zone-overlay shaper-zone-right"
                        style={{
                            position: 'absolute', right: 0, top: 0,
                            width: 'calc(50% - 14px)', height: '100%',
                            zIndex: 2, cursor: 'pointer'
                        }}
                        onClick={(e) => {
                            if (context === 'account') return;
                            e.stopPropagation();
                            setShowFlourishMenu(!showFlourishMenu);
                            setShowMomentumMenu(false);
                            setShowStanceMenu(false);
                            setShowSpecPassiveMenu(false);
                        }}
                        onMouseEnter={() => { setShaperHoverSection('flourish'); setShowTooltip(true); }}
                        onMouseLeave={() => { setShaperHoverSection(null); setShowTooltip(false); }}
                    />

                    {/* Momentum Adjustment Menu */}
                    {showMomentumMenu && momentumBarRef.current && context !== 'account' && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!momentumBarRef.current) return '50%';
                                    const rect = momentumBarRef.current.getBoundingClientRect();
                                    let hudContainer = momentumBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!momentumBarRef.current) return '50%';
                                    const rect = momentumBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Flux: {momentumValue}/{momentumMax}</div>
                                {renderStatusFlavor()}

                                <div className="shaper-actions">
                                    <div className="shaper-action-row">
                                        <button
                                            className="context-menu-button gain"
                                            onClick={() => {
                                                const newVal = Math.min(momentumMax, momentumValue + 1);
                                                if (onClassResourceUpdate) onClassResourceUpdate('momentum', newVal);
                                            }}
                                            title="Gain 1 Flux (Hit)"
                                        >
                                            <i className="fas fa-plus"></i>
                                            <span>+1</span>
                                        </button>
                                        <button
                                            className="context-menu-button gain"
                                            onClick={() => {
                                                const newVal = Math.min(momentumMax, momentumValue + 2);
                                                if (onClassResourceUpdate) onClassResourceUpdate('momentum', newVal);
                                            }}
                                            title="Gain 2 Flux (Crit)"
                                        >
                                            <i className="fas fa-plus-circle"></i>
                                            <span>+2</span>
                                        </button>
                                    </div>
                                    <div className="shaper-action-row">
                                        <button
                                            className="context-menu-button spend"
                                            onClick={() => {
                                                const newVal = Math.max(0, momentumValue - 2);
                                                if (onClassResourceUpdate) onClassResourceUpdate('momentum', newVal);
                                            }}
                                            title="Spend 2 Flux (Ability)"
                                        >
                                            <i className="fas fa-minus"></i>
                                            <span>-2</span>
                                        </button>
                                        <button
                                            className="context-menu-button spend"
                                            onClick={() => {
                                                const newVal = Math.max(0, momentumValue - 4);
                                                if (onClassResourceUpdate) onClassResourceUpdate('momentum', newVal);
                                            }}
                                            title="Spend 4 Flux (Ability)"
                                        >
                                            <i className="fas fa-minus-circle"></i>
                                            <span>-4</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="shaper-quick-actions">
                                    <button
                                        onClick={() => { 
                                            if (onClassResourceUpdate) onClassResourceUpdate('momentum', 0);
                                            setShowMomentumMenu(false); 
                                        }}
                                        className="context-menu-button"
                                        title="Reset to 0"
                                    >
                                        <i className="fas fa-undo"></i>
                                    </button>
                                    <button
                                        onClick={() => { 
                                            if (onClassResourceUpdate) onClassResourceUpdate('momentum', momentumMax);
                                            setShowMomentumMenu(false); 
                                        }}
                                        className="context-menu-button"
                                        title={`Set to Max (${momentumMax})`}
                                    >
                                        <i className="fas fa-crown"></i>
                                    </button>
                                    <button
                                        onClick={() => setShowMomentumMenu(false)}
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

                    {/* Flourish Adjustment Menu */}
                    {showFlourishMenu && flourishBarRef.current && context !== 'account' && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!flourishBarRef.current) return '50%';
                                    const rect = flourishBarRef.current.getBoundingClientRect();
                                    let hudContainer = flourishBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!flourishBarRef.current) return '50%';
                                    const rect = flourishBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Body Toll: {flourishValue}/{flourishMax}</div>
                                {renderStatusFlavor()}

                                <div className="shaper-actions">
                                    <div className="shaper-action-row">
                                        <button
                                            className="context-menu-button gain"
                                            onClick={() => {
                                                const newVal = Math.min(flourishMax, flourishValue + 1);
                                                if (onClassResourceUpdate) onClassResourceUpdate('flourish', newVal);
                                            }}
                                            disabled={flourishValue >= flourishMax}
                                            title="Earn 1 Body Toll"
                                        >
                                            <i className="fas fa-plus"></i>
                                            <span>+1</span>
                                        </button>
                                        <button
                                            className="context-menu-button spend"
                                            onClick={() => {
                                                const newVal = Math.max(0, flourishValue - 1);
                                                if (onClassResourceUpdate) onClassResourceUpdate('flourish', newVal);
                                            }}
                                            disabled={flourishValue === 0}
                                            title="Spend 1 Body Toll"
                                        >
                                            <i className="fas fa-minus"></i>
                                            <span>-1</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="shaper-quick-actions">
                                    <button
                                        onClick={() => { 
                                            if (onClassResourceUpdate) onClassResourceUpdate('flourish', 0);
                                            setShowFlourishMenu(false); 
                                        }}
                                        className="context-menu-button"
                                        title="Reset to 0"
                                    >
                                        <i className="fas fa-undo"></i>
                                    </button>
                                    <button
                                        onClick={() => { 
                                            if (onClassResourceUpdate) onClassResourceUpdate('flourish', flourishMax);
                                            setShowFlourishMenu(false); 
                                        }}
                                        className="context-menu-button"
                                        title={`Set to Max (${flourishMax})`}
                                    >
                                        <i className="fas fa-crown"></i>
                                    </button>
                                    <button
                                        onClick={() => setShowFlourishMenu(false)}
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

                    {/* Stance Transition Menu */}
                    {showStanceMenu && stanceBarRef.current && context !== 'account' && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!stanceBarRef.current) return '50%';
                                    const rect = stanceBarRef.current.getBoundingClientRect();
                                    let hudContainer = stanceBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!stanceBarRef.current) return '50%';
                                    const rect = stanceBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">
                                    {currentStance} ({momentumValue}/{momentumMax})
                                    {selectedSpecialization === 'Flow Master' && (
                                        <div style={{ fontSize: '8px', fontWeight: 500, marginTop: '2px', color: '#3498DB' }}>
                                            Flow Master: -1 Flux cost
                                        </div>
                                    )}
                                    {selectedSpecialization === 'Primal Shadow' && (
                                        <div style={{ fontSize: '8px', fontWeight: 500, marginTop: '2px', color: '#2C3E50' }}>
                                            Primal Shadow: Void Predator (3)
                                        </div>
                                    )}
                                </div>
                                {renderStatusFlavor()}

                                <div className="shaper-stances">
                                    {availableTransitions.map((stanceName) => {
                                        const stanceData = stances[stanceName];
                                        const cost = getTransitionCost(stanceValue, stanceName);
                                        const canAfford = momentumValue >= cost;
                                        const isCurrent = currentStance === stanceName;

                                        return (
                                            <button
                                                key={stanceName}
                                                className={`shaper-stance-btn ${isCurrent ? 'active' : ''}`}
                                                onClick={() => canAfford && transitionToStance(stanceName)}
                                                disabled={!canAfford}
                                                title={`${stanceName} - Cost: ${cost} Flux`}
                                                style={{
                                                    borderColor: stanceData.color,
                                                    opacity: !canAfford ? 0.4 : 1
                                                }}
                                            >
                                                <i className={stanceData.icon} style={{ color: stanceData.color }}></i>
                                                <span className="shaper-stance-name">{stanceName}</span>
                                                <span className="shaper-stance-cost" style={{ color: stanceData.color }}>{cost}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="shaper-quick-actions">
                                    <button
                                        onClick={() => setShowStanceMenu(false)}
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
                    {/* Specialization Passive Menu disabled */}
                </div>
            </div>
        );

};

export default StanceFlowResourceBar;