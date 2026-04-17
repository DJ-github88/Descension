import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/container-wizard.css';
import { getIconUrl } from '../../utils/assetManager';


const LockSettingsModal = ({ container, onSave, onClose }) => {
    // Ensure we have default values if containerProperties is undefined
    const containerProps = container.containerProperties || {};
    
    const [lockSettings, setLockSettings] = useState({
        isLocked: containerProps.isLocked || false,
        lockType: containerProps.lockType || 'thievery',
        lockDC: containerProps.lockDC || 10,
        lockCode: containerProps.lockCode || '',
        flavorText: containerProps.flavorText || '',
        maxAttempts: containerProps.maxAttempts || 3,
        failureAction: containerProps.failureAction || 'none',
        failureActionDetails: containerProps.failureActionDetails || {
            removeItems: false,
            removePercentage: 50,
            destroyContainer: false,
            triggerTrap: false,
            trapDetails: '',
            transformIntoCreature: false,
            creatureType: ''
        }
    });

    const handleSave = () => {
        onSave({
            ...lockSettings,
            // Ensure lockDC is cleared if using code, and vice versa
            lockDC: lockSettings.lockType === 'thievery' ? lockSettings.lockDC : 0,
            lockCode: lockSettings.lockType === 'code' || lockSettings.lockType === 'numeric' ? lockSettings.lockCode : ''
        });
        onClose();
    };

    const handleFailureActionChange = (action) => {
        setLockSettings(prev => ({
            ...prev,
            failureAction: action,
            failureActionDetails: {
                ...prev.failureActionDetails,
                removeItems: action === 'remove_items',
                destroyContainer: action === 'destroy',
                triggerTrap: action === 'trap',
                transformIntoCreature: action === 'transform'
            }
        }));
    };

    const updateSettings = (updates) => setLockSettings(prev => ({ ...prev, ...updates }));

    const updateFailureDetails = (updates) => setLockSettings(prev => ({
        ...prev,
        failureActionDetails: { ...prev.failureActionDetails, ...updates }
    }));

    return createPortal(
        <>
            <div className="cw-overlay" onClick={onClose} />
            <div className="cw-overlay cw-overlay--modal">
                <div className="cw-modal" onClick={e => e.stopPropagation()}>
                    <div className="cw-header">
                        <div className="cw-header-left">
                            <img
                                src={getIconUrl(container.iconId || 'inv_box_01', 'items', true)}
                                alt=""
                                className="cw-header-icon"
                                onError={e => { e.target.onerror = null; e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items', true); }}
                            />
                            <h2>Lock Settings: {container.name || 'Container'}</h2>
                        </div>
                        <button className="cw-close" onClick={onClose}>
                            <i className="fas fa-times" />
                        </button>
                    </div>

                    <div className="cw-body">
                        <div className="cw-panel">
                            <label className="cw-toggle-row">
                                <div className="cw-toggle-info">
                                    <i className={`fas fa-${lockSettings.isLocked ? 'lock' : 'lock-open'}`} />
                                    <span>Lock this container</span>
                                </div>
                                <div className={`cw-switch ${lockSettings.isLocked ? 'on' : ''}`} onClick={() => updateSettings({
                                    isLocked: !lockSettings.isLocked,
                                    lockType: !lockSettings.isLocked ? 'thievery' : 'none'
                                })}>
                                    <div className="cw-switch-thumb" />
                                </div>
                            </label>

                            {lockSettings.isLocked && (
                                <div className="cw-lock-section">
                                    <div className="cw-lock-types">
                                        {[
                                            { value: 'thievery', icon: 'fa-dice-d20', label: 'Thievery' },
                                            { value: 'code', icon: 'fa-font', label: 'Word Lock' },
                                            { value: 'numeric', icon: 'fa-hashtag', label: 'Number Lock' }
                                        ].map(lt => (
                                            <button
                                                key={lt.value}
                                                className={`cw-lock-type ${lockSettings.lockType === lt.value ? 'active' : ''}`}
                                                onClick={() => updateSettings({
                                                    lockType: lt.value,
                                                    lockDC: lt.value === 'thievery' ? 10 : 0,
                                                    lockCode: ''
                                                })}
                                            >
                                                <i className={`fas ${lt.icon}`} />
                                                <span>{lt.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {lockSettings.lockType === 'thievery' && (
                                        <div className="cw-field">
                                            <label>Thievery DC</label>
                                            <div className="cw-number-input">
                                                <button onClick={() => updateSettings({ lockDC: Math.max(1, lockSettings.lockDC - 1) })}>-</button>
                                                <span>{lockSettings.lockDC}</span>
                                                <button onClick={() => updateSettings({ lockDC: Math.min(30, lockSettings.lockDC + 1) })}>+</button>
                                            </div>
                                        </div>
                                    )}

                                    {lockSettings.lockType === 'code' && (
                                        <div className="cw-field">
                                            <label>Secret Word</label>
                                            <input
                                                type="text"
                                                value={lockSettings.lockCode}
                                                onChange={e => updateSettings({ lockCode: e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase().slice(0, 20) })}
                                                placeholder="Word or phrase"
                                                autoComplete="off"
                                                data-form-type="other"
                                            />
                                            <div className="cw-hint">Hangman-style puzzle — spaces preserved</div>
                                        </div>
                                    )}

                                    {lockSettings.lockType === 'numeric' && (
                                        <div className="cw-field">
                                            <label>Secret Number</label>
                                            <input
                                                type="text"
                                                value={lockSettings.lockCode}
                                                onChange={e => updateSettings({ lockCode: e.target.value.replace(/[^0-9]/g, '').slice(0, 8) })}
                                                placeholder="Up to 8 digits"
                                                autoComplete="off"
                                                data-form-type="other"
                                            />
                                            <div className="cw-hint">Players must enter the exact number</div>
                                        </div>
                                    )}

                                    <div className="cw-field">
                                        <label>Lock Appearance</label>
                                        <textarea
                                            value={lockSettings.flavorText}
                                            onChange={(e) => updateSettings({ flavorText: e.target.value })}
                                            placeholder="What does the lock look like?"
                                            rows={2}
                                        />
                                    </div>

                                    <div className="cw-row">
                                        <div className="cw-field cw-field--sm">
                                            <label>Max Attempts</label>
                                            <div className="cw-number-input">
                                                <button onClick={() => updateSettings({ maxAttempts: Math.max(1, lockSettings.maxAttempts - 1) })}>-</button>
                                                <span>{lockSettings.maxAttempts}</span>
                                                <button onClick={() => updateSettings({ maxAttempts: Math.min(10, lockSettings.maxAttempts + 1) })}>+</button>
                                            </div>
                                        </div>
                                        <div className="cw-field">
                                            <label>On Final Failure</label>
                                            <select
                                                value={lockSettings.failureAction}
                                                onChange={(e) => handleFailureActionChange(e.target.value)}
                                            >
                                                <option value="none">Nothing</option>
                                                <option value="remove_items">Remove Items</option>
                                                <option value="destroy">Destroy Container</option>
                                                <option value="trap">Trigger Trap</option>
                                                <option value="transform">Transform to Creature</option>
                                            </select>
                                        </div>
                                    </div>

                                    {lockSettings.failureAction === 'remove_items' && (
                                        <div className="cw-field cw-field--inline">
                                            <label>Remove %</label>
                                            <div className="cw-number-input">
                                                <button onClick={() => updateFailureDetails({ removePercentage: Math.max(1, lockSettings.failureActionDetails.removePercentage - 10) })}>-</button>
                                                <span>{lockSettings.failureActionDetails.removePercentage}%</span>
                                                <button onClick={() => updateFailureDetails({ removePercentage: Math.min(100, lockSettings.failureActionDetails.removePercentage + 10) })}>+</button>
                                            </div>
                                        </div>
                                    )}

                                    {lockSettings.failureAction === 'trap' && (
                                        <div className="cw-field">
                                            <label>Trap Description</label>
                                            <textarea
                                                value={lockSettings.failureActionDetails.trapDetails}
                                                onChange={(e) => updateFailureDetails({ trapDetails: e.target.value })}
                                                placeholder="What happens..."
                                                rows={2}
                                            />
                                        </div>
                                    )}

                                    {lockSettings.failureAction === 'transform' && (
                                        <div className="cw-field">
                                            <label>Creature Type</label>
                                            <input
                                                type="text"
                                                value={lockSettings.failureActionDetails.creatureType}
                                                onChange={(e) => updateFailureDetails({ creatureType: e.target.value })}
                                                placeholder="e.g., Mimic, Animated Armor..."
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="cw-footer">
                        <button className="cw-btn cw-btn--cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            className="cw-btn cw-btn--create"
                            onClick={handleSave}
                            disabled={lockSettings.isLocked && (
                                (lockSettings.lockType === 'thievery' && !lockSettings.lockDC) ||
                                (lockSettings.lockType === 'code' && !lockSettings.lockCode) ||
                                (lockSettings.lockType === 'numeric' && !lockSettings.lockCode)
                            )}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default LockSettingsModal;
