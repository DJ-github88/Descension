import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/lock-settings-modal.css';

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

    return createPortal(
        <div className="lock-settings-overlay" onClick={onClose}>
            <div className="lock-settings-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Lock Settings</h3>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="modal-content">
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={lockSettings.isLocked}
                                onChange={(e) => setLockSettings({
                                    ...lockSettings,
                                    isLocked: e.target.checked,
                                    // Reset values when unlocking
                                    lockType: e.target.checked ? 'thievery' : 'none',
                                    lockDC: e.target.checked ? lockSettings.lockDC : 0,
                                    lockCode: e.target.checked ? lockSettings.lockCode : '',
                                    flavorText: e.target.checked ? lockSettings.flavorText : '',
                                    maxAttempts: e.target.checked ? lockSettings.maxAttempts : 3,
                                    failureAction: e.target.checked ? lockSettings.failureAction : 'none',
                                    failureActionDetails: e.target.checked ? lockSettings.failureActionDetails : {
                                        removeItems: false,
                                        removePercentage: 50,
                                        destroyContainer: false,
                                        triggerTrap: false,
                                        trapDetails: '',
                                        transformIntoCreature: false,
                                        creatureType: ''
                                    }
                                })}
                            />
                            <i className={`fas fa-${lockSettings.isLocked ? 'lock' : 'lock-open'}`}></i>
                            <span>Lock Container</span>
                        </label>
                    </div>

                    {lockSettings.isLocked && (
                        <>
                            <div className="form-group lock-type-selection">
                                <label>Lock Type:</label>
                                <div className="lock-type-options">
                                    <label>
                                        <input
                                            type="radio"
                                            value="thievery"
                                            checked={lockSettings.lockType === 'thievery'}
                                            onChange={(e) => setLockSettings({
                                                ...lockSettings,
                                                lockType: e.target.value,
                                                lockCode: ''
                                            })}
                                        />
                                        <span>Thievery Check</span>
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="code"
                                            checked={lockSettings.lockType === 'code'}
                                            onChange={(e) => setLockSettings({
                                                ...lockSettings,
                                                lockType: e.target.value,
                                                lockDC: 0
                                            })}
                                        />
                                        <span>Word Code</span>
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="numeric"
                                            checked={lockSettings.lockType === 'numeric'}
                                            onChange={(e) => setLockSettings({
                                                ...lockSettings,
                                                lockType: e.target.value,
                                                lockDC: 0
                                            })}
                                        />
                                        <span>Numeric Code</span>
                                    </label>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <i className="fas fa-book"></i>
                                    <span>Lock Description</span>
                                </label>
                                <textarea
                                    value={lockSettings.flavorText}
                                    onChange={(e) => setLockSettings({
                                        ...lockSettings,
                                        flavorText: e.target.value
                                    })}
                                    placeholder={lockSettings.lockType === 'code' ? 
                                        "Describe the lock mechanism or any clues about the word code..." :
                                        lockSettings.lockType === 'numeric' ?
                                        "Describe the lock mechanism or any clues about the numeric code..." :
                                        "Describe the lock's appearance and any notable features..."}
                                    rows={3}
                                />
                            </div>

                            {lockSettings.lockType === 'thievery' && (
                                <div className="form-group">
                                    <label>
                                        <i className="fas fa-dice-d20"></i>
                                        <span>DC:</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="5"
                                        max="30"
                                        value={lockSettings.lockDC}
                                        onChange={(e) => setLockSettings({
                                            ...lockSettings,
                                            lockDC: Math.min(30, Math.max(5, parseInt(e.target.value) || 5))
                                        })}
                                        autoComplete="off"
                                        autoCorrect="off"
                                        autoCapitalize="off"
                                        spellCheck="false"
                                        data-form-type="other"
                                    />
                                </div>
                            )}

                            {(lockSettings.lockType === 'code' || lockSettings.lockType === 'numeric') && (
                                <div className="form-group">
                                    <label>
                                        <i className="fas fa-key"></i>
                                        <span>Code:</span>
                                    </label>
                                    <input
                                        type={lockSettings.lockType === 'numeric' ? "number" : "text"}
                                        maxLength={lockSettings.lockType === 'numeric' ? "8" : "20"}
                                        value={lockSettings.lockCode}
                                        onChange={(e) => setLockSettings({
                                            ...lockSettings,
                                            lockCode: lockSettings.lockType === 'numeric' 
                                                ? e.target.value.replace(/[^0-9]/g, '').slice(0, 8)
                                                : e.target.value
                                        })}
                                        placeholder={lockSettings.lockType === 'numeric' ? "Enter numeric code..." : "Enter word code..."}
                                        autoComplete="off"
                                        autoCorrect="off"
                                        autoCapitalize="off"
                                        spellCheck="false"
                                        data-form-type="other"
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <label>
                                    <i className="fas fa-shield-alt"></i>
                                    <span>Security Settings</span>
                                </label>
                                <div className="security-settings">
                                    <div className="max-attempts">
                                        <label>Maximum Attempts:</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={lockSettings.maxAttempts}
                                            onChange={(e) => setLockSettings({
                                                ...lockSettings,
                                                maxAttempts: Math.min(10, Math.max(1, parseInt(e.target.value) || 1))
                                            })}
                                        />
                                    </div>
                                    
                                    <div className="failure-action">
                                        <label>On Final Failure:</label>
                                        <select
                                            value={lockSettings.failureAction}
                                            onChange={(e) => handleFailureActionChange(e.target.value)}
                                        >
                                            <option value="none">Nothing Special</option>
                                            <option value="remove_items">Remove Some Items</option>
                                            <option value="destroy">Destroy Container</option>
                                            <option value="trap">Trigger Trap</option>
                                            <option value="transform">Transform into Creature</option>
                                        </select>
                                    </div>

                                    {lockSettings.failureAction === 'remove_items' && (
                                        <div className="failure-details">
                                            <label>Remove Percentage:</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={lockSettings.failureActionDetails.removePercentage}
                                                onChange={(e) => setLockSettings(prev => ({
                                                    ...prev,
                                                    failureActionDetails: {
                                                        ...prev.failureActionDetails,
                                                        removePercentage: Math.min(100, Math.max(1, parseInt(e.target.value) || 1))
                                                    }
                                                }))}
                                            />
                                            <span>%</span>
                                        </div>
                                    )}

                                    {lockSettings.failureAction === 'trap' && (
                                        <div className="failure-details">
                                            <label>Trap Description:</label>
                                            <textarea
                                                value={lockSettings.failureActionDetails.trapDetails}
                                                onChange={(e) => setLockSettings(prev => ({
                                                    ...prev,
                                                    failureActionDetails: {
                                                        ...prev.failureActionDetails,
                                                        trapDetails: e.target.value
                                                    }
                                                }))}
                                                placeholder="Describe what happens when the trap triggers..."
                                                rows={2}
                                            />
                                        </div>
                                    )}

                                    {lockSettings.failureAction === 'transform' && (
                                        <div className="failure-details">
                                            <label>Creature Type:</label>
                                            <input
                                                type="text"
                                                value={lockSettings.failureActionDetails.creatureType}
                                                onChange={(e) => setLockSettings(prev => ({
                                                    ...prev,
                                                    failureActionDetails: {
                                                        ...prev.failureActionDetails,
                                                        creatureType: e.target.value
                                                    }
                                                }))}
                                                placeholder="e.g., Mimic, Animated Armor..."
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="modal-footer">
                    <button className="cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                    <button 
                        className="save-button"
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
        </div>,
        document.body
    );
};

export default LockSettingsModal;
