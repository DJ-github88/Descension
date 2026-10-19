import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useCharacterStore from '../../store/characterStore';
import { migrateBlockId } from '../../utils/arcanoneerMigration';
import { normalizeManagedClassResource, getManagedSpellResourcePlan } from '../../data/classResourceContracts';
import { MINSTREL_PITCHES, MINSTREL_MAX_PER_PITCH } from '../../data/classResourceBanks';
import { spellDiagnostic } from '../../services/spellConsequenceService';
import { strikeDiagnostic } from '../../services/weaponStrikeService';
import { MANUAL_NOTE } from '../../services/manualActionGate';
import './SpellCastConfirmation.css';
import useSpellAoEStore from '../../store/spellAoEStore';
import { RADIANT_BURST_ID, radiantPreviewProfile, previewFingerprint } from '../../services/areaPreview';
import { ownerSource } from '../../services/spellConsequenceService';
import { captureActorDelivery, currentActorDelivery } from '../../services/actorProjectionOrder';
import { isPrivateProjectionIsolated } from '../../persistence/bootstrapPrivacyGate';
import '../grid/ActionAreaPreview.css';

const SpellCastConfirmation = ({ spell, onConfirm, onCancel, classResource: classResourceProp }) => {
    // Get current resources to check availability (hooks must be called unconditionally)
    const currentMana = useCharacterStore(state => state.mana);
    const currentAP = useCharacterStore(state => state.actionPoints);
    const storeClassResource = useCharacterStore(state => state.classResource);
    const characterClass = useCharacterStore(state => state.class);
    const [previewEffect, setPreviewEffect] = useState('damage');
    const [previewError, setPreviewError] = useState('');
    const previewButton = useRef(null);
    const previewEntry = useRef({});
    const preview = useSpellAoEStore(s => s.actionPreview);
    const fingerprint = previewFingerprint(spell);
    useEffect(() => {
        const current = useSpellAoEStore.getState().actionPreview;
        if (current?.entry === previewEntry.current && (current.action.id !== spell?.id ||
            current.profile.fingerprint !== fingerprint || current.profile.effect !== previewEffect))
            useSpellAoEStore.getState().endActionPreview();
    }, [spell?.id, fingerprint, previewEffect]);
    useEffect(() => {
        const entry = previewEntry.current;
        return () => {
            if (useSpellAoEStore.getState().actionPreview?.entry === entry) useSpellAoEStore.getState().endActionPreview();
        };
    }, []);
    const resourceClass = classResourceProp?.type ? undefined : characterClass;
    const currentClassResource = normalizeManagedClassResource(classResourceProp || storeClassResource, resourceClass);

    if (!spell || (preview?.placing && preview.action === spell)) return null;
    // P9: unsupported spells keep this manual path; shared rooms say why.
    const p9Diagnostic = strikeDiagnostic(spell) || spellDiagnostic(spell);

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
    
    // Ascension is a gain, but it never removes a separate pre-cast minimum.
    const infernoAscend = spell.infernoAscend ?? resourceValues.inferno_ascend ?? 0;
    const infernoDescend = spell.infernoDescend ?? resourceValues.inferno_descend ?? 0;
    const infernoRequired = spell.infernoRequired ?? resourceValues.inferno_required ?? 0;

    // Generic class resource changes (Tension, Authority, Ancestral Resonance, …)
    // Chronarch Time Shards render through their dedicated fields.
    const genericCr = resourceCost.classResource || {};
    const genericCrType = genericCr.type;
    const genericCrCost = Number(genericCr.cost || 0);
    const managedPlan = getManagedSpellResourcePlan(spell, currentClassResource, resourceClass);
    const usesGenericCr = !managedPlan.handled && genericCrCost !== 0 && !!genericCrType && genericCrType !== 'time_shards';
    const genericCrLabel = genericCrType
        ? genericCrType.replace(/[_-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        : 'Class Resource';
    const hasEnoughGenericCr = !usesGenericCr || genericCrCost <= 0
        || ((currentClassResource?.current || 0) >= genericCrCost);

    // Extract Arcanoneer elemental spheres requirement
    const requiredSpheres = [];
    if (managedPlan.bank === 'spheres') {
        requiredSpheres.push(...managedPlan.costs);
    } else if (!managedPlan.bank && Array.isArray(spell._arcanoneerElements)) {
        spell._arcanoneerElements.forEach(el => requiredSpheres.push(migrateBlockId(el)));
    } else if (!managedPlan.bank && Array.isArray(spell.elements)) {
        spell.elements.forEach(el => requiredSpheres.push(migrateBlockId(el)));
    } else if (!managedPlan.bank && Array.isArray(resourceCost.spheres)) {
        resourceCost.spheres.forEach(el => requiredSpheres.push(migrateBlockId(el)));
    } else if (!managedPlan.bank && resourceValues) {
        Object.entries(resourceValues).forEach(([key, val]) => {
            if (key.endsWith('_sphere')) {
                const elem = migrateBlockId(key.replace('_sphere', ''));
                const cnt = Number(val) || 0;
                for (let i = 0; i < cnt; i++) requiredSpheres.push(elem);
            }
        });
    }

    const currentSpheres = Array.isArray(currentClassResource?.spheres)
        ? currentClassResource.spheres.map(migrateBlockId)
        : [];

    const sphereCostCounts = {};
    requiredSpheres.forEach(id => {
        sphereCostCounts[id] = (sphereCostCounts[id] || 0) + 1;
    });

    const sphereBankCounts = {};
    currentSpheres.forEach(id => {
        sphereBankCounts[id] = (sphereBankCounts[id] || 0) + 1;
    });

    let hasEnoughSpheres = true;
    const sphereResourceCosts = [];
    Object.entries(sphereCostCounts).forEach(([elemId, reqCount]) => {
        const available = sphereBankCounts[elemId] || 0;
        const insufficient = available < reqCount;
        if (insufficient) hasEnoughSpheres = false;
        const elemName = elemId.charAt(0).toUpperCase() + elemId.slice(1);
        sphereResourceCosts.push({
            type: `sphere sphere-${elemId}`,
            elemId,
            amount: reqCount,
            label: `${elemName} Sphere`,
            current: available,
            max: reqCount,
            insufficient
        });
    });

    // Check resource availability
    // Note: infernoAscend is NOT checked here - it's a gain, not a requirement
    const hasEnoughMana = !manaCost || (currentMana && currentMana.current >= manaCost);
    const hasEnoughAP = !apCost || (currentAP && currentAP.current >= apCost);
    // Only check inferno_required - inferno_ascend does NOT block casting
    const hasEnoughInferno = managedPlan.handled || !infernoRequired || (currentClassResource && currentClassResource.current >= infernoRequired);
    const canCast = hasEnoughMana && hasEnoughAP && hasEnoughInferno && hasEnoughSpheres && hasEnoughGenericCr &&
        (!managedPlan.handled || managedPlan.affordable);

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
    if (usesGenericCr && genericCrCost > 0) {
        resourceCosts.push({
            type: 'class-resource',
            amount: genericCrCost,
            label: genericCrLabel,
            current: currentClassResource?.current || 0,
            max: currentClassResource?.max || genericCrCost,
            insufficient: !hasEnoughGenericCr
        });
    }
    if (managedPlan.handled && !managedPlan.bank && Math.max(managedPlan.cost, managedPlan.required) > 0) {
        resourceCosts.push({
            type: 'class-resource', amount: Math.max(managedPlan.cost, managedPlan.required),
            label: managedPlan.label, current: managedPlan.current,
            max: currentClassResource?.max || 0, insufficient: !managedPlan.affordable
        });
    }
    // Add elemental sphere costs
    resourceCosts.push(...sphereResourceCosts);
    if (managedPlan.bank === 'notes') {
        MINSTREL_PITCHES.forEach((numeral, index) => {
            const amount = managedPlan.costs.filter(key => key === numeral).length;
            if (amount) resourceCosts.push({ type: 'class-resource', amount, label: `Note ${numeral}`,
                current: currentClassResource?.notes?.[index] || 0, max: MINSTREL_MAX_PER_PITCH,
                insufficient: (currentClassResource?.notes?.[index] || 0) < amount });
        });
    }

    // Build resource changes display
    const resourceChanges = [];
    if (managedPlan.transition === 'shaper') {
        resourceChanges.push({ type: 'class-resource', amount: `${managedPlan.current} → ${managedPlan.nextResource.current}`, label: 'Flux balance', color: '#2e6027' });
        resourceChanges.push({ type: 'class-resource', amount: `${managedPlan.nextResource.bodyToll}/10`, label: 'Body Toll (risk)', color: '#8b2b1d' });
        if (managedPlan.reason) resourceChanges.push({ type: 'class-resource', amount: 'Required', label: managedPlan.reason, color: '#8b2b1d' });
        if (managedPlan.targetForm) resourceChanges.push({ type: 'class-resource', amount: 'Adopt', label: managedPlan.targetForm, color: '#584485' });
    }
    if (managedPlan.transition === 'infernoVeil') {
        resourceChanges.push({ type: 'inferno', amount: `${managedPlan.current} → ${managedPlan.nextResource.current}`,
            label: 'Veil transition', color: '#9e3d23' });
        if (managedPlan.nextResource.debtCall.latched) resourceChanges.push({ type: 'class-resource',
            amount: `${managedPlan.nextResource.debtCall.turnsRemaining} own turn${managedPlan.nextResource.debtCall.turnsRemaining === 1 ? '' : 's'}`,
            label: managedPlan.nextResource.debtCall.expired ? 'Debt Call expired — consequence due' : 'Debt Call remains latched', color: '#8b2b1d' });
    }
    if (managedPlan.deferredGeneration) resourceChanges.push({
        type: 'class-resource', amount: 'Report', label: 'Resolved pack outcome (no cast-only Marks)', color: '#584485'
    });
    if (managedPlan.bank) {
        const keys = [...new Set(managedPlan.gains)];
        keys.forEach(key => resourceChanges.push({ type: 'class-resource',
            amount: `+${managedPlan.gains.filter(value => value === key).length}`,
            label: managedPlan.bank === 'notes' ? `Note ${key}` : `${key} Sphere`, color: '#584485' }));
    }
    if (managedPlan.handled && !managedPlan.bank && !managedPlan.transition && managedPlan.gain > 0) resourceChanges.push({
        type: 'class-resource', amount: `+${managedPlan.gain}`, label: managedPlan.label, color: '#584485'
    });
    if (!managedPlan.handled && infernoAscend > 0) {
        resourceChanges.push({ type: 'inferno', amount: `+${infernoAscend}`, label: 'Inferno', color: '#9e3d23' });
    }
    if (!managedPlan.handled && infernoDescend > 0) {
        resourceChanges.push({ type: 'inferno', amount: `-${infernoDescend}`, label: 'Inferno', color: '#2d627e' });
    }
    if (usesGenericCr && genericCrCost < 0) {
        resourceChanges.push({ type: 'class-resource', amount: `+${-genericCrCost}`, label: genericCrLabel, color: '#584485' });
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
                    {p9Diagnostic && (
                        <div className="p9-manual-diagnostic" role="note">{MANUAL_NOTE} Reason: {p9Diagnostic}</div>
                    )}
                    <div className="spell-name">{spell.name || 'Unknown Spell'}</div>
                    {p9Diagnostic && spell.id === RADIANT_BURST_ID && <div className="b2-entry">
                        <label>Preview effect channel{' '}
                            <select aria-label="Preview effect channel" value={previewEffect} onChange={event => setPreviewEffect(event.target.value)}>
                                <option value="damage">Damage</option><option value="healing">Healing</option>
                            </select>
                        </label>
                        <button type="button" ref={previewButton} onClick={() => {
                            const profile = radiantPreviewProfile(spell, previewEffect), source = ownerSource();
                            const context = captureActorDelivery();
                            const error = profile.error || source.error ||
                                (![source.token?.position?.x, source.token?.position?.y].every(Number.isFinite) && 'Manual geometry — source position is unavailable.') ||
                                ((isPrivateProjectionIsolated() || !context.socket?.connected ||
                                !currentActorDelivery(context, context.roomId)) && 'Current hydrated room connection required.');
                            if (error) { setPreviewError(error); return; }
                            setPreviewError('');
                            useSpellAoEStore.getState().startActionPreview({ entry: previewEntry.current, action: spell, profile, sourceRef: source.ref, context,
                                onReturn: () => requestAnimationFrame(() => previewButton.current?.focus()) });
                        }}>Preview area</button>
                        <p>Geometry only. No roll, cost, notice or effect.</p>
                        {previewError && <p role="alert">{previewError}</p>}
                    </div>}
                    
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
                        className={`confirm-button ${!canCast && !p9Diagnostic ? 'disabled' : ''}`}
                        onClick={(e) => (canCast || p9Diagnostic) && handleButtonClick(e, onConfirm)}
                        onMouseDown={(e) => e.stopPropagation()}
                        disabled={!canCast && !p9Diagnostic}
                    >
                        {p9Diagnostic ? 'Post manual notice' : 'Cast'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default SpellCastConfirmation;

