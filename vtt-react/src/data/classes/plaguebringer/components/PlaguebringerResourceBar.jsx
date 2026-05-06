import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/PlaguebringerResourceBar.css';

const PlaguebringerResourceBar = ({ classResource = {}, size = 'normal', config = {}, context = 'hud', isOwner = true, onClassResourceUpdate = null }) => {
    const [localVirulence, setLocalVirulence] = useState(65);
    const [localAfflictions, setLocalAfflictions] = useState(4);
    const [selectedSpec, setSelectedSpec] = useState('virulentSpreader');
    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    
    const barRef = useRef(null);
    const tooltipRef = useRef(null);
    
    const { addCombatNotification } = useChatStore();
    const isGMMode = useGameStore(state => state.isGMMode);
    const currentPlayerName = useCharacterStore(state => state.name || 'Player');
    
    const getActorName = () => {
        const actorName = currentPlayerName || 'Player';
        return isGMMode ? `${actorName} (GM)` : actorName;
    };
    
    const logClassResourceChange = (resourceName, amount, isPositive, resourceType = 'classResource') => {
        const absAmount = Math.abs(amount);
        const actorName = getActorName();
        const characterName = currentPlayerName || 'Character';
        
        let message = '';
        if (isPositive) {
            const messages = [
                `${characterName} gained ${absAmount} ${resourceName}`,
                `${characterName} cultivated ${absAmount} ${resourceName}`,
                `${absAmount} ${resourceName} grew from ${characterName}'s garden`,
                `${characterName} nurtured ${absAmount} ${resourceName}`
            ];
            message = messages[Math.floor(Math.random() * messages.length)];
        } else {
            const messages = [
                `${characterName} lost ${absAmount} ${resourceName}`,
                `${absAmount} ${resourceName} withered from ${characterName}`,
                `${characterName}'s ${resourceName} decayed by ${absAmount}`,
                `${characterName} diminished ${absAmount} ${resourceName}`
            ];
            message = messages[Math.floor(Math.random() * messages.length)];
        }
        
        addCombatNotification({
            type: 'combat_resource',
            attacker: actorName,
            target: characterName,
            amount: absAmount,
            resourceType: resourceType,
            isPositive: isPositive,
            customMessage: message
        });
    };

    const specConfigs = {
        virulentSpreader: { 
            name: 'Virulent Spreader', 
            color: '#556B2F', 
            glow: '#9ACD32', 
            icon: 'fa-virus', 
            passive: 'Epidemic Mastery', 
            passiveDesc: 'Base afflictions apply to 2 adjacent targets. Stage 2+ afflictions auto-spread. +1 spread target per 25 Virulence.' 
        },
        tormentWeaver: { 
            name: 'Torment Weaver', 
            color: '#4B0082', 
            glow: '#9370DB', 
            icon: 'fa-brain', 
            passive: 'Psychic Resonance', 
            passiveDesc: 'Same affliction on multiple targets creates Psychic Links. Cultivating one cultivates all linked. +1 link per 25 Virulence.' 
        },
        decayHarbinger: { 
            name: 'Decay Harbinger', 
            color: '#2F4F2F', 
            glow: '#556B2F', 
            icon: 'fa-skull', 
            passive: 'Accelerated Decay', 
            passiveDesc: 'No final form. Post-Stage 3 adds permanent stacks. +1d6 necrotic per stack per 25 Virulence. Stacks persist until Greater Restoration.' 
        }
    };

    const currentSpec = specConfigs[selectedSpec];
    const maxVirulence = 100;
    const maxAfflictions = 10;

    const getVirulenceTier = (virulence) => {
        if (virulence >= 75) return { name: 'Peak Harvest', color: '#FFD700', bonus: '+2 dmg dice, ignore first dispel' };
        if (virulence >= 50) return { name: 'Blooming', color: '#9ACD32', bonus: '+1 duration round, +5ft spread' };
        if (virulence >= 25) return { name: 'Sprouting', color: '#6B8E23', bonus: '+1 dmg die to all afflictions' };
        return { name: 'Seedling', color: '#556B2F', bonus: 'No bonus' };
    };

    const virulenceTier = getVirulenceTier(localVirulence);

    useEffect(() => {
        if (showTooltip && barRef.current && tooltipRef.current) {
            const tooltip = tooltipRef.current;
            tooltip.style.opacity = '0';
            const barRect = barRef.current.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const margin = 10;
            
            let hudContainer = barRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
            let hudBottom = barRect.bottom;
            
            if (hudContainer) {
                const hudRect = hudContainer.getBoundingClientRect();
                hudBottom = hudRect.bottom;
            }
            
            let left = barRect.left + (barRect.width / 2) - (tooltipRect.width / 2);
            let top = hudBottom + margin;
            
            if (left < margin) left = margin;
            if (left + tooltipRect.width > window.innerWidth - margin) {
                left = window.innerWidth - tooltipRect.width - margin;
            }
            
            if (top + tooltipRect.height > viewportHeight - margin) {
                if (hudContainer) {
                    const hudRect = hudContainer.getBoundingClientRect();
                    top = hudRect.top - tooltipRect.height - margin;
                    tooltip.classList.remove('below');
                } else {
                    top = barRect.top - tooltipRect.height - margin;
                }
                if (top < margin) {
                    top = margin;
                }
            } else {
                tooltip.classList.add('below');
            }
            
            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
            tooltip.style.opacity = '1';

            return () => { if (tooltipRef.current) tooltipRef.current.style.opacity = ''; };
        }
    }, [showTooltip, localVirulence, localAfflictions, selectedSpec]);

    return (
        <div className={`plaguebringer-resource-wrapper ${size}`}>
            <div className="plaguebringer-dual-bars">
                <div
                    ref={barRef}
                    className={`virulence-bar ${size} clickable`}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => { if (isOwner) setShowControls(!showControls); }}
                >
                    <div className="virulence-fill" style={{
                        width: `${(localVirulence / maxVirulence) * 100}%`,
                        background: `linear-gradient(90deg, ${currentSpec.color} 0%, ${virulenceTier.color} 100%)`
                    }} />
                    <div className="virulence-tier-indicator" style={{
                        borderLeft: localVirulence >= 25 ? `2px solid ${virulenceTier.color}` : 'none',
                        borderRight: localVirulence >= 50 ? `2px solid ${virulenceTier.color}` : 'none'
                    }} />
                    <div className="virulence-overlay">
                        <div className="virulence-number">
                            {localVirulence}/{maxVirulence}
                        </div>
                        <div className="virulence-tier-name" style={{ color: virulenceTier.color }}>
                            {virulenceTier.name}
                        </div>
                    </div>
                </div>

                <div className="afflictions-bar">
                    {Array.from({ length: maxAfflictions }, (_, index) => (
                        <div
                            key={index}
                            className={`affliction-segment ${index < localAfflictions ? 'active' : 'inactive'} ${currentSpec.icon.split('-')[1]}`}
                            style={{
                                backgroundColor: index < localAfflictions ? currentSpec.color : 'rgba(85, 107, 47, 0.2)',
                                borderColor: index < localAfflictions ? currentSpec.glow : 'rgba(85, 107, 47, 0.4)',
                                boxShadow: index < localAfflictions ? `0 0 4px ${currentSpec.glow}80` : 'none'
                            }}
                        >
                            {index < localAfflictions && (
                                <i className={`fas ${currentSpec.icon}`} style={{
                                    color: '#ffffff',
                                    fontSize: size === 'small' ? '6px' : size === 'large' ? '8px' : '7px',
                                    filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))'
                                }} />
                            )}
                        </div>
                    ))}
                    <div className="afflictions-label">
                        <i className="fas fa-disease"></i> {localAfflictions}
                    </div>
                </div>
            </div>
            
            {showTooltip && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip" style={{ opacity: 0 }}>
                    <div className="tooltip-header">Plaguebringer</div>

                    <div className="tooltip-section">
                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                            <strong>Virulence:</strong> {localVirulence}/{maxVirulence}
                            <span style={{ color: virulenceTier.color, fontWeight: 'bold', marginLeft: '8px' }}>
                                [{virulenceTier.name}]
                            </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#5a4a3a' }}>
                            Passive: {virulenceTier.bonus}
                        </div>
                    </div>

                    <div className="tooltip-section">
                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                            <strong>Active Afflictions:</strong> {localAfflictions}/{maxAfflictions}
                        </div>
                    </div>

                    <div className="tooltip-divider" />

                    <div className="tooltip-section">
                        <div className="tooltip-label" style={{ color: currentSpec.glow }}>{currentSpec.name}</div>
                        <div className="passive-desc" style={{ fontSize: '0.8rem', lineHeight: '1.3' }}>
                            {currentSpec.passiveDesc}
                        </div>
                    </div>
                </div>,
                document.body
            )}
            
            {showControls && barRef.current && ReactDOM.createPortal(
                <div
                    className={`unified-context-menu compact  ${context === 'party' ? 'chronarch-party' : ''}`}
                    onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        position: 'fixed',
                        top: (() => {
                            if (!barRef.current) return '50%';
                            const rect = barRef.current.getBoundingClientRect();
                            let hudContainer = barRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                            let hudBottom = rect.bottom;
                            if (hudContainer) {
                                const hudRect = hudContainer.getBoundingClientRect();
                                hudBottom = hudRect.bottom;
                            }
                            return hudBottom + 8;
                        })(),
                        left: (() => {
                            if (!barRef.current) return '50%';
                            const rect = barRef.current.getBoundingClientRect();
                            return rect.left + (rect.width / 2);
                        })(),
                        transform: 'translateX(-50%)',
                        zIndex: 100000
                    }}
                >
                    <div className="context-menu-main context-menu-main">
                        <div className="menu-title">Virulence: {localVirulence}/{maxVirulence} <span style={{ color: virulenceTier.color }}>[{virulenceTier.name}]</span></div>
                        <div className="plaguebringer-controls">
                            <button 
                                className="context-menu-button"
                                onClick={() => {
                                    const newValue = Math.max(0, localVirulence - 10);
                                    const amount = localVirulence - newValue;
                                    setLocalVirulence(newValue);
                                    if (amount > 0) {
                                        logClassResourceChange('Virulence', amount, false, 'virulence');
                                        if (onClassResourceUpdate) onClassResourceUpdate('virulence', newValue);
                                    }
                                }}
                            >
                                -10
                            </button>
                            <button 
                                className="context-menu-button"
                                onClick={() => {
                                    const newValue = Math.min(maxVirulence, localVirulence + 10);
                                    const amount = newValue - localVirulence;
                                    setLocalVirulence(newValue);
                                    if (amount > 0) {
                                        logClassResourceChange('Virulence', amount, true, 'virulence');
                                        if (onClassResourceUpdate) onClassResourceUpdate('virulence', newValue);
                                    }
                                }}
                            >
                                +10
                            </button>
                        </div>
                        <div className="plaguebringer-quick-actions">
                            <button 
                                className="context-menu-button"
                                onClick={() => {
                                    const newValue = Math.max(0, localVirulence - 5);
                                    const amount = localVirulence - newValue;
                                    setLocalVirulence(newValue);
                                    if (amount > 0) {
                                        logClassResourceChange('Virulence', amount, false, 'virulence');
                                        if (onClassResourceUpdate) onClassResourceUpdate('virulence', newValue);
                                    }
                                }}
                            >
                                -5
                            </button>
                            <button 
                                className="context-menu-button"
                                onClick={() => {
                                    const newValue = Math.min(maxVirulence, localVirulence + 5);
                                    const amount = newValue - localVirulence;
                                    setLocalVirulence(newValue);
                                    if (amount > 0) {
                                        logClassResourceChange('Virulence', amount, true, 'virulence');
                                        if (onClassResourceUpdate) onClassResourceUpdate('virulence', newValue);
                                    }
                                }}
                            >
                                +5
                            </button>
                            <button 
                                className="context-menu-button"
                                onClick={() => {
                                    const resetAmount = localVirulence;
                                    setLocalVirulence(0);
                                    if (resetAmount > 0) {
                                        logClassResourceChange('Virulence', resetAmount, false, 'virulence');
                                        if (onClassResourceUpdate) onClassResourceUpdate('virulence', 0);
                                    }
                                }}
                            >
                                Clear
                            </button>
                            <button 
                                className="context-menu-button"
                                onClick={() => {
                                    const gainAmount = maxVirulence - localVirulence;
                                    setLocalVirulence(maxVirulence);
                                    if (gainAmount > 0) {
                                        logClassResourceChange('Virulence', gainAmount, true, 'virulence');
                                        if (onClassResourceUpdate) onClassResourceUpdate('virulence', maxVirulence);
                                    }
                                }}
                            >
                                Max
                            </button>
                        </div>

                        <div className="menu-title" style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(160, 140, 112, 0.3)' }}>
                            Active Afflictions: {localAfflictions}/{maxAfflictions}
                        </div>
                        <div className="plaguebringer-controls">
                            <button 
                                className="context-menu-button"
                                onClick={() => {
                                    const newValue = Math.max(0, localAfflictions - 1);
                                    const amount = localAfflictions - newValue;
                                    setLocalAfflictions(newValue);
                                    if (amount > 0) {
                                        logClassResourceChange('Affliction', amount, false, 'afflictions');
                                        if (onClassResourceUpdate) onClassResourceUpdate('afflictions', newValue);
                                    }
                                }}
                            >
                                -1
                            </button>
                            <button 
                                className="context-menu-button"
                                onClick={() => {
                                    const newValue = Math.min(maxAfflictions, localAfflictions + 1);
                                    const amount = newValue - localAfflictions;
                                    setLocalAfflictions(newValue);
                                    if (amount > 0) {
                                        logClassResourceChange('Affliction', amount, true, 'afflictions');
                                        if (onClassResourceUpdate) onClassResourceUpdate('afflictions', newValue);
                                    }
                                }}
                            >
                                +1
                            </button>
                        </div>
                        <div className="plaguebringer-quick-actions">
                            <button 
                                className="context-menu-button"
                                onClick={() => setLocalAfflictions(0)}
                            >
                                Clear
                            </button>
                            <button 
                                className="context-menu-button"
                                onClick={() => setLocalAfflictions(maxAfflictions)}
                            >
                                Max
                            </button>
                        </div>

                        <div className="menu-title" style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(160, 140, 112, 0.3)' }}>
                            Specialization
                        </div>
                        <div className="plaguebringer-specs">
                            {Object.entries(specConfigs).map(([key, spec]) => {
                                const isSelected = selectedSpec === key;
                                return (
                                    <button
                                        key={key}
                                        className={`plaguebringer-spec-btn ${isSelected ? 'active' : ''}`}
                                        onClick={() => {
                                            setSelectedSpec(key);
                                        }}
                                        title={`${spec.name}: ${spec.passive}`}
                                    >
                                        <i className={`fas ${spec.icon}`}></i>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="plaguebringer-quick-actions" style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(160, 140, 112, 0.3)' }}>
                            <button 
                                className="context-menu-button"
                                onClick={() => setShowControls(false)}
                                style={{ flex: '1' }}
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

export default PlaguebringerResourceBar;
