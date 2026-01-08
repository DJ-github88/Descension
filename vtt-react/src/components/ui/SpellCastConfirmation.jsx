import React from 'react';
import { createPortal } from 'react-dom';
import useCharacterStore from '../../store/characterStore';
import './SpellCastConfirmation.css';

const SpellCastConfirmation = ({ spell, onConfirm, onCancel }) => {
    // Get current resources to check availability (hooks must be called unconditionally)
    const currentMana = useCharacterStore(state => state.mana);
    const currentAP = useCharacterStore(state => state.actionPoints);
    const currentClassResource = useCharacterStore(state => state.classResource);

    if (!spell) return null;

    const handleOverlayClick = (e) => {
        // Only close if clicking directly on the overlay, not on the dialog content
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    const handleDialogClick = (e) => {
        // Stop propagation to prevent clicks inside dialog from closing it
        e.stopPropagation();
    };

    const handleButtonClick = (e, handler) => {
        // Stop propagation and call the handler
        e.stopPropagation();
        handler();
    };

    // Extract resource costs from spell
    const resourceCost = spell.resourceCost || {};
    const resourceValues = resourceCost.resourceValues || {};
    const manaCost = resourceValues.mana || resourceCost.mana || 0;
    const apCost = resourceCost.actionPoints || 0;
    
    // Extract class resource changes
    // IMPORTANT: inferno_ascend is a GAIN, not a requirement - it should NOT block casting
    // Only inferno_required should block casting
    const infernoAscend = resourceValues.inferno_ascend || spell.infernoAscend || 0;
    const infernoDescend = resourceValues.inferno_descend || spell.infernoDescend || 0;
    
    // CRITICAL: If a spell has inferno_ascend (gain), it means you're GAINING inferno
    // Therefore, you should NOT need inferno to cast it - ignore inferno_required in this case
    // This handles incorrectly configured spell data where both are set
    let infernoRequired = 0;
    if (infernoAscend === 0) {
        // Only check inferno_required if there's no inferno_ascend (gain)
        // If you're gaining inferno, you don't need it to cast
        infernoRequired = resourceValues.inferno_required || spell.infernoRequired || 0;
    } else {
        // Spell has inferno_ascend (gain) - ignore any inferno_required value
        // Log if there's a conflicting value in the data
        const rawInfernoRequired = resourceValues.inferno_required || spell.infernoRequired || 0;
        if (rawInfernoRequired > 0) {
            console.warn(`Spell "${spell.name}" has both inferno_ascend (gain) and inferno_required. Ignoring requirement since spell gains inferno.`, {
                infernoAscend,
                rawInfernoRequired,
                note: 'Spell gains inferno, so requirement is ignored'
            });
        }
    }

    // Check resource availability
    // Note: infernoAscend is NOT checked here - it's a gain, not a requirement
    const hasEnoughMana = !manaCost || (currentMana && currentMana.current >= manaCost);
    const hasEnoughAP = !apCost || (currentAP && currentAP.current >= apCost);
    // Only check inferno_required - inferno_ascend does NOT block casting
    const hasEnoughInferno = !infernoRequired || (currentClassResource && currentClassResource.current >= infernoRequired);
    const canCast = hasEnoughMana && hasEnoughAP && hasEnoughInferno;

    // Build resource cost display with availability indicators
    const resourceCosts = [];
    if (manaCost > 0) {
        resourceCosts.push({ 
            type: 'mana', 
            amount: manaCost, 
            label: 'Mana',
            current: currentMana?.current || 0,
            max: currentMana?.max || 0,
            insufficient: !hasEnoughMana
        });
    }
    if (apCost > 0) {
        resourceCosts.push({ 
            type: 'ap', 
            amount: apCost, 
            label: 'Action Points',
            current: currentAP?.current || 0,
            max: currentAP?.max || 0,
            insufficient: !hasEnoughAP
        });
    }

    // Build resource changes display
    const resourceChanges = [];
    if (infernoAscend > 0) {
        resourceChanges.push({ type: 'inferno', amount: `+${infernoAscend}`, label: 'Inferno', color: '#ff4500' });
    }
    if (infernoDescend > 0) {
        resourceChanges.push({ type: 'inferno', amount: `-${infernoDescend}`, label: 'Inferno', color: '#4682b4' });
    }

    // Extract cooldown information
    const cooldownConfig = spell.cooldownConfig || {};
    const cooldownType = cooldownConfig.type || 'none';
    const cooldownValue = cooldownConfig.value || 0;
    
    // Format cooldown display
    const formatCooldown = () => {
        if (cooldownType === 'none' || cooldownValue === 0) {
            return null;
        }
        
        switch (cooldownType) {
            case 'turn_based':
                return `${cooldownValue} turn${cooldownValue > 1 ? 's' : ''}`;
            case 'short_rest':
                return `${cooldownValue} use${cooldownValue > 1 ? 's' : ''}/short rest`;
            case 'long_rest':
                return `${cooldownValue} use${cooldownValue > 1 ? 's' : ''}/long rest`;
            case 'charge_based':
                const charges = cooldownConfig.charges || 1;
                const recovery = cooldownConfig.recovery || 1;
                return `${charges} charge${charges > 1 ? 's' : ''} (${recovery} turn${recovery > 1 ? 's' : ''}/charge)`;
            case 'real_time':
                const seconds = cooldownValue;
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                if (minutes > 0) {
                    return `${minutes}m ${remainingSeconds}s`;
                }
                return `${seconds}s`;
            default:
                return `${cooldownValue} cooldown`;
        }
    };
    
    const cooldownText = formatCooldown();

    return createPortal(
        <div 
            className="spell-cast-confirmation-overlay" 
            onClick={handleOverlayClick}
        >
            <div 
                className="spell-cast-confirmation-dialog" 
                onClick={handleDialogClick}
                onMouseDown={handleDialogClick}
            >
                <div className="spell-cast-confirmation-header">
                    <h3>Cast Spell</h3>
                </div>
                
                <div className="spell-cast-confirmation-content">
                    <div className="spell-name">{spell.name || 'Unknown Spell'}</div>
                    
                    {resourceCosts.length > 0 && (
                        <div className="resource-costs-section">
                            <div className="section-label">Resource Cost:</div>
                            <div className="resource-costs">
                                {resourceCosts.map((cost, index) => (
                                    <div 
                                        key={index} 
                                        className={`resource-cost resource-cost-${cost.type} ${cost.insufficient ? 'insufficient' : ''}`}
                                    >
                                        <div className="resource-cost-header">
                                            <span className="resource-amount">{cost.amount}</span>
                                            <span className="resource-label">{cost.label}</span>
                                        </div>
                                        <div className="resource-availability">
                                            <span className={cost.insufficient ? 'insufficient-text' : 'sufficient-text'}>
                                                {cost.current} / {cost.max}
                                            </span>
                                            {cost.insufficient && (
                                                <span className="insufficient-badge">Insufficient</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Only show requirement section if there's an actual inferno_required (not inferno_ascend) */}
                    {infernoRequired > 0 && (
                        <div className="resource-costs-section">
                            <div className="section-label">Requirement:</div>
                            <div className="resource-costs">
                                <div className={`resource-cost resource-cost-inferno ${!hasEnoughInferno ? 'insufficient' : ''}`}>
                                    <div className="resource-cost-header">
                                        <span className="resource-amount">{infernoRequired}</span>
                                        <span className="resource-label">Inferno Required</span>
                                    </div>
                                    <div className="resource-availability">
                                        <span className={!hasEnoughInferno ? 'insufficient-text' : 'sufficient-text'}>
                                            {currentClassResource?.current || 0} / {infernoRequired}
                                        </span>
                                        {!hasEnoughInferno && (
                                            <span className="insufficient-badge">Insufficient</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {resourceChanges.length > 0 && (
                        <div className="resource-changes-section">
                            <div className="section-label">Gains:</div>
                            <div className="resource-changes">
                                {resourceChanges.map((change, index) => (
                                    <div 
                                        key={index} 
                                        className="resource-change resource-gain"
                                        style={{ borderColor: change.color }}
                                    >
                                        <span className="resource-amount" style={{ color: change.color }}>{change.amount}</span>
                                        <span className="resource-label" style={{ color: change.color }}>{change.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {cooldownText && (
                        <div className="cooldown-section">
                            <div className="section-label">Cooldown:</div>
                            <div className="cooldown-display">
                                <span className="cooldown-icon">⏱</span>
                                <span className="cooldown-text">{cooldownText}</span>
                            </div>
                        </div>
                    )}

                    {resourceCosts.length === 0 && resourceChanges.length === 0 && !cooldownText && (
                        <div className="no-costs-message">
                            This spell has no resource costs.
                        </div>
                    )}
                </div>

                <div className="spell-cast-confirmation-buttons">
                    <button 
                        className="cancel-button" 
                        onClick={(e) => handleButtonClick(e, onCancel)}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        Cancel
                    </button>
                    <button 
                        className={`confirm-button ${!canCast ? 'disabled' : ''}`}
                        onClick={(e) => canCast && handleButtonClick(e, onConfirm)}
                        onMouseDown={(e) => e.stopPropagation()}
                        disabled={!canCast}
                    >
                        Cast
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default SpellCastConfirmation;

