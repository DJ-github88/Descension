import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useCombatStore from '../../store/combatStore';
import '../../styles/combat-config-modal.css';

const CombatConfigModal = ({ isOpen, onClose }) => {
    const { combatConfig, updateCombatConfig } = useCombatStore();
    const [localConfig, setLocalConfig] = useState(combatConfig);

    useEffect(() => {
        if (isOpen) {
            setLocalConfig(combatConfig);
        }
    }, [isOpen, combatConfig]);

    const handleSave = () => {
        updateCombatConfig(localConfig);
        onClose();
    };

    const handleCancel = () => {
        setLocalConfig(combatConfig);
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="combat-config-modal-overlay" onClick={handleCancel}>
            <div className="combat-config-modal" onClick={(e) => e.stopPropagation()}>
                <div className="combat-config-header">
                    <h2>Combat Configuration</h2>
                    <button className="close-button" onClick={handleCancel}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="combat-config-body">
                    {/* Timer Settings */}
                    <div className="config-section">
                        <h3>Timer Settings</h3>
                        <label className="config-toggle">
                            <input
                                type="checkbox"
                                checked={localConfig.showTimers}
                                onChange={(e) => setLocalConfig({ ...localConfig, showTimers: e.target.checked })}
                            />
                            <span>Show Turn Timers</span>
                        </label>
                    </div>

                    {/* AP Restoration Settings */}
                    <div className="config-section">
                        <h3>Action Point Restoration</h3>
                        <div className="config-radio-group">
                            <label className="config-radio">
                                <input
                                    type="radio"
                                    name="apRestorationMode"
                                    value="initiative"
                                    checked={localConfig.apRestorationMode === 'initiative'}
                                    onChange={(e) => setLocalConfig({ ...localConfig, apRestorationMode: e.target.value })}
                                />
                                <span>Based on Initiative Roll</span>
                                <small>AP restored based on initiative roll (0-4 AP)</small>
                            </label>
                            <label className="config-radio">
                                <input
                                    type="radio"
                                    name="apRestorationMode"
                                    value="max"
                                    checked={localConfig.apRestorationMode === 'max'}
                                    onChange={(e) => setLocalConfig({ ...localConfig, apRestorationMode: e.target.value })}
                                />
                                <span>Restore to Maximum</span>
                                <small>All combatants restore to max AP each turn</small>
                            </label>
                            <label className="config-radio">
                                <input
                                    type="radio"
                                    name="apRestorationMode"
                                    value="set"
                                    checked={localConfig.apRestorationMode === 'set'}
                                    onChange={(e) => setLocalConfig({ ...localConfig, apRestorationMode: e.target.value })}
                                />
                                <span>Fixed Amount</span>
                                <small>Restore a fixed amount of AP each turn</small>
                            </label>
                        </div>
                        {localConfig.apRestorationMode === 'set' && (
                            <div className="config-input-group">
                                <label>
                                    AP Amount:
                                    <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={localConfig.apRestorationAmount}
                                        onChange={(e) => setLocalConfig({ ...localConfig, apRestorationAmount: parseInt(e.target.value) || 0 })}
                                    />
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Regeneration Settings */}
                    <div className="config-section">
                        <h3>Regeneration</h3>
                        <label className="config-toggle">
                            <input
                                type="checkbox"
                                checked={localConfig.healthRegenEnabled}
                                onChange={(e) => setLocalConfig({ ...localConfig, healthRegenEnabled: e.target.checked })}
                            />
                            <span>Enable Health Regeneration</span>
                            <small>Combatants regenerate health based on Constitution (Con/2 per turn)</small>
                        </label>
                        <label className="config-toggle">
                            <input
                                type="checkbox"
                                checked={localConfig.manaRegenEnabled}
                                onChange={(e) => setLocalConfig({ ...localConfig, manaRegenEnabled: e.target.checked })}
                            />
                            <span>Enable Mana Regeneration</span>
                            <small>Combatants regenerate mana based on Intelligence and Spirit ((Int+Spirit)/4 per turn)</small>
                        </label>
                    </div>
                </div>

                <div className="combat-config-footer">
                    <button className="config-button cancel" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button className="config-button save" onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CombatConfigModal;

