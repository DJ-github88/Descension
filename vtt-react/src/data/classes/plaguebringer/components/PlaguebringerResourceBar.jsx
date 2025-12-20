import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/PlaguebringerResourceBar.css';

const PlaguebringerResourceBar = ({ classResource = {}, size = 'normal', config = {}, context = 'hud', onClassResourceUpdate = null }) => {
    const [localCorruption, setLocalCorruption] = useState(65);
    const [localAfflictions, setLocalAfflictions] = useState(4);
    const [selectedSpec, setSelectedSpec] = useState('virulentSpreader');
    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    
    const barRef = useRef(null);
    const tooltipRef = useRef(null);
    
    // Get chat store for combat notifications
    const { addCombatNotification } = useChatStore();
    const isGMMode = useGameStore(state => state.isGMMode);
    const currentPlayerName = useCharacterStore(state => state.name || 'Player');
    
    // Helper function to get the actor name
    const getActorName = () => {
        const actorName = currentPlayerName || 'Player';
        return isGMMode ? `${actorName} (GM)` : actorName;
    };
    
    // Helper function to log class resource changes
    const logClassResourceChange = (resourceName, amount, isPositive, resourceType = 'classResource') => {
        const absAmount = Math.abs(amount);
        const actorName = getActorName();
        const characterName = currentPlayerName || 'Character';
        
        let message = '';
        if (isPositive) {
            const messages = [
                `${characterName} gained ${absAmount} ${resourceName}`,
                `${characterName} acquired ${absAmount} ${resourceName}`,
                `${absAmount} ${resourceName} was added to ${characterName}`,
                `${characterName} received ${absAmount} ${resourceName}`
            ];
            message = messages[Math.floor(Math.random() * messages.length)];
        } else {
            const messages = [
                `${characterName} spent ${absAmount} ${resourceName}`,
                `${characterName} used ${absAmount} ${resourceName}`,
                `${absAmount} ${resourceName} was consumed by ${characterName}`,
                `${characterName} expended ${absAmount} ${resourceName}`
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
            passiveDesc: 'Fester/Infect spells +10 ft range. Spread afflictions retain 2/3 development steps.' 
        },
        tormentWeaver: { 
            name: 'Torment Weaver', 
            color: '#4B0082', 
            glow: '#9370DB', 
            icon: 'fa-brain', 
            passive: 'Psychic Resonance', 
            passiveDesc: 'Torment spells +1d6 damage. Psychic afflictions: 5-6 on 1d6 causes target to attack nearest ally.' 
        },
        decayHarbinger: { 
            name: 'Decay Harbinger', 
            color: '#2F4F2F', 
            glow: '#556B2F', 
            icon: 'fa-skull', 
            passive: 'Accelerated Decay', 
            passiveDesc: 'Decay spells reduce max HP by +1d6. Afflictions reduce healing by 1d8 per heal received.' 
        }
    };

    const currentSpec = specConfigs[selectedSpec];
    const maxCorruption = 100;
    const maxAfflictions = 10;
    const evolutionStage = localCorruption >= 75 ? 4 : localCorruption >= 50 ? 3 : localCorruption >= 25 ? 2 : 1;
    const isEvolutionReady = localCorruption >= 75;

    useEffect(() => {
        if (showTooltip && barRef.current && tooltipRef.current) {
            const barRect = barRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const tooltip = tooltipRef.current;
            const viewportHeight = window.innerHeight;
            const margin = 10;
            
            // Find the HUD container to position tooltip below it
            let hudContainer = barRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
            let hudBottom = barRect.bottom;
            
            if (hudContainer) {
                const hudRect = hudContainer.getBoundingClientRect();
                hudBottom = hudRect.bottom;
            }
            
            // Position tooltip below the HUD container, centered horizontally
            let left = barRect.left + (barRect.width / 2) - (tooltipRect.width / 2);
            let top = hudBottom + margin;
            
            // Adjust horizontal position
            if (left < margin) left = margin;
            if (left + tooltipRect.width > window.innerWidth - margin) {
                left = window.innerWidth - tooltipRect.width - margin;
            }
            
            // Ensure tooltip doesn't go off bottom of viewport
            if (top + tooltipRect.height > viewportHeight - margin) {
                // If there's not enough space below, position above the HUD instead
                if (hudContainer) {
                    const hudRect = hudContainer.getBoundingClientRect();
                    top = hudRect.top - tooltipRect.height - margin;
                    tooltip.classList.remove('below');
                } else {
                    top = barRect.top - tooltipRect.height - margin;
                }
                // But ensure it doesn't go off top either
                if (top < margin) {
                    top = margin;
                }
            } else {
                tooltip.classList.add('below');
            }
            
            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
        }
    }, [showTooltip, localCorruption, localAfflictions, selectedSpec]);



    return (
        <div className={`plaguebringer-resource-wrapper ${size}`}>

            {/* Dual Resource Display */}
            <div className="plaguebringer-dual-bars">

                {/* Corruption Bar (Top) */}
                <div
                    ref={barRef}
                    className={`corruption-bar ${size} clickable`}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => setShowControls(!showControls)}
                >
                    <div className="corruption-fill" style={{
                        width: `${(localCorruption / maxCorruption) * 100}%`,
                        background: `linear-gradient(90deg, ${currentSpec.color} 0%, ${currentSpec.glow} 100%)`
                    }} />
                    <div className="corruption-overlay">
                        <div className="corruption-number">
                            {localCorruption}/{maxCorruption}
                        </div>
                    </div>
                </div>

                {/* Afflictions Bar (Bottom) */}
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
            
            {/* Simple Tooltip */}
            {showTooltip && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip">
                    <div className="tooltip-header">Plaguebringer</div>

                    <div className="tooltip-section">
                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                            <strong>Corruption:</strong> {localCorruption}/{maxCorruption}
                        </div>
                        <div style={{ fontSize: '0.9rem' }}>
                            <strong>Active Afflictions:</strong> {localAfflictions}/{maxAfflictions}
                        </div>
                    </div>

                    <div className="tooltip-section">
                        <div className="tooltip-label">Evolution Stage: {evolutionStage}/4</div>
                    </div>

                    <div className="tooltip-section">
                        <div className="tooltip-label">{currentSpec.name}</div>
                        <div className="passive-desc" style={{ fontSize: '0.8rem', lineHeight: '1.3' }}>
                            {currentSpec.passiveDesc}
                        </div>
                    </div>
                </div>,
                document.body
            )}
            
            {/* Plaguebringer Menu */}
            {showControls && barRef.current && ReactDOM.createPortal(
                <div
                    className={`unified-context-menu compact plaguebringer-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
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
                    <div className="context-menu-main plaguebringer-menu">
                        {/* Corruption Section */}
                        <div className="menu-title">Corruption: {localCorruption}/{maxCorruption}</div>
                        <div className="plaguebringer-controls">
                            <button 
                                className="plaguebringer-action-btn"
                                onClick={() => {
                                    const newValue = Math.max(0, localCorruption - 10);
                                    const amount = localCorruption - newValue;
                                    setLocalCorruption(newValue);
                                    if (amount > 0) {
                                        logClassResourceChange('Corruption', amount, false, 'corruption');
                                        if (onClassResourceUpdate) onClassResourceUpdate('corruption', newValue);
                                    }
                                }}
                            >
                                -10
                            </button>
                            <button 
                                className="plaguebringer-action-btn"
                                onClick={() => {
                                    const newValue = Math.min(maxCorruption, localCorruption + 10);
                                    const amount = newValue - localCorruption;
                                    setLocalCorruption(newValue);
                                    if (amount > 0) {
                                        logClassResourceChange('Corruption', amount, true, 'corruption');
                                        if (onClassResourceUpdate) onClassResourceUpdate('corruption', newValue);
                                    }
                                }}
                            >
                                +10
                            </button>
                        </div>
                        <div className="plaguebringer-quick-actions">
                            <button 
                                className="plaguebringer-quick-btn"
                                onClick={() => {
                                    const newValue = Math.max(0, localCorruption - 5);
                                    const amount = localCorruption - newValue;
                                    setLocalCorruption(newValue);
                                    if (amount > 0) {
                                        logClassResourceChange('Corruption', amount, false, 'corruption');
                                        if (onClassResourceUpdate) onClassResourceUpdate('corruption', newValue);
                                    }
                                }}
                            >
                                -5
                            </button>
                            <button 
                                className="plaguebringer-quick-btn"
                                onClick={() => {
                                    const newValue = Math.min(maxCorruption, localCorruption + 5);
                                    const amount = newValue - localCorruption;
                                    setLocalCorruption(newValue);
                                    if (amount > 0) {
                                        logClassResourceChange('Corruption', amount, true, 'corruption');
                                        if (onClassResourceUpdate) onClassResourceUpdate('corruption', newValue);
                                    }
                                }}
                            >
                                +5
                            </button>
                            <button 
                                className="plaguebringer-quick-btn"
                                onClick={() => {
                                    const resetAmount = localCorruption;
                                    setLocalCorruption(0);
                                    if (resetAmount > 0) {
                                        logClassResourceChange('Corruption', resetAmount, false, 'corruption');
                                        if (onClassResourceUpdate) onClassResourceUpdate('corruption', 0);
                                    }
                                }}
                            >
                                Clear
                            </button>
                            <button 
                                className="plaguebringer-quick-btn"
                                onClick={() => {
                                    const gainAmount = maxCorruption - localCorruption;
                                    setLocalCorruption(maxCorruption);
                                    if (gainAmount > 0) {
                                        logClassResourceChange('Corruption', gainAmount, true, 'corruption');
                                        if (onClassResourceUpdate) onClassResourceUpdate('corruption', maxCorruption);
                                    }
                                }}
                            >
                                Max
                            </button>
                        </div>

                        {/* Afflictions Section */}
                        <div className="menu-title" style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(160, 140, 112, 0.3)' }}>
                            Active Afflictions: {localAfflictions}/{maxAfflictions}
                        </div>
                        <div className="plaguebringer-controls">
                            <button 
                                className="plaguebringer-action-btn"
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
                                className="plaguebringer-action-btn"
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
                                className="plaguebringer-quick-btn"
                                onClick={() => setLocalAfflictions(0)}
                            >
                                Clear
                            </button>
                            <button 
                                className="plaguebringer-quick-btn"
                                onClick={() => setLocalAfflictions(maxAfflictions)}
                            >
                                Max
                            </button>
                        </div>

                        {/* Specialization Section */}
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

                        {/* Close Button */}
                        <div className="plaguebringer-quick-actions" style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(160, 140, 112, 0.3)' }}>
                            <button 
                                className="plaguebringer-quick-btn"
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

