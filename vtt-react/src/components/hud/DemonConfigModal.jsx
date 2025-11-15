import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './styles/DemonConfigModal.css';

const DemonConfigModal = ({
    show,
    onClose,
    onSave,
    mode = 'create', // 'create' or 'edit'
    initialData = null,
    position = null
}) => {
    const [demonName, setDemonName] = useState(initialData?.name || '');
    const [tier, setTier] = useState(initialData?.tier || 2);
    const [saveDC, setSaveDC] = useState(initialData?.saveDC || 14);
    const [saveDCStat, setSaveDCStat] = useState(initialData?.saveDCStat || 'spirit');
    const [startingDD, setStartingDD] = useState(initialData?.dd || 10);
    
    const modalRef = useRef(null);
    const nameInputRef = useRef(null);

    // Focus name input when modal opens
    useEffect(() => {
        if (show && nameInputRef.current) {
            nameInputRef.current.focus();
            nameInputRef.current.select();
        }
    }, [show]);

    // Reset form when modal opens with new data
    useEffect(() => {
        if (show) {
            setDemonName(initialData?.name || '');
            setTier(initialData?.tier || 2);
            setSaveDC(initialData?.saveDC || 14);
            setSaveDCStat(initialData?.saveDCStat || 'spirit');
            setStartingDD(initialData?.dd || 10);
        }
    }, [show, initialData]);

    if (!show) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!demonName.trim()) {
            alert('Please enter a demon name');
            return;
        }

        onSave({
            name: demonName.trim(),
            tier: parseInt(tier),
            saveDC: parseInt(saveDC),
            saveDCStat,
            dd: parseInt(startingDD)
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            handleSubmit(e);
        }
    };

    // Calculate suggested save DC based on tier
    const getSuggestedDC = (tierValue) => {
        const dcMap = {
            1: 12,
            2: 14,
            3: 16,
            4: 18,
            5: 20,
            6: 22
        };
        return dcMap[tierValue] || 14;
    };

    // Auto-update save DC when tier changes (only in create mode)
    const handleTierChange = (newTier) => {
        setTier(newTier);
        if (mode === 'create') {
            setSaveDC(getSuggestedDC(newTier));
        }
    };

    const modalStyle = position ? {
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)'
    } : {};

    return createPortal(
        <div className="demon-config-modal-backdrop" onClick={onClose}>
            <div 
                className="demon-config-modal" 
                ref={modalRef} 
                style={modalStyle}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleKeyDown}
            >
                <div className="demon-modal-header">
                    <h3>
                        <i className="fas fa-skull" style={{ marginRight: '8px', color: '#8B0000' }}></i>
                        {mode === 'create' ? 'Bind New Demon' : 'Edit Demon Info'}
                    </h3>
                    <button className="demon-modal-close" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="demon-modal-content">
                    {/* Demon Name */}
                    <div className="demon-form-group">
                        <label htmlFor="demon-name">
                            <i className="fas fa-tag"></i> Demon Name
                        </label>
                        <input
                            id="demon-name"
                            ref={nameInputRef}
                            type="text"
                            value={demonName}
                            onChange={(e) => setDemonName(e.target.value)}
                            placeholder="e.g., Shadow Hound, Imp, Balor"
                            maxLength={30}
                            autoComplete="off"
                        />
                    </div>

                    {/* Demon Tier */}
                    <div className="demon-form-group">
                        <label htmlFor="demon-tier">
                            <i className="fas fa-layer-group"></i> Demon Tier
                        </label>
                        <div className="tier-selector">
                            {[1, 2, 3, 4, 5, 6].map(t => (
                                <button
                                    key={t}
                                    type="button"
                                    className={`tier-button ${tier === t ? 'active' : ''}`}
                                    onClick={() => handleTierChange(t)}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Save DC */}
                    <div className="demon-form-group">
                        <label htmlFor="demon-save-dc">
                            <i className="fas fa-shield-alt"></i> Save DC
                        </label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <select
                                id="demon-save-stat"
                                value={saveDCStat}
                                onChange={(e) => setSaveDCStat(e.target.value)}
                                style={{
                                    flex: '0 0 120px',
                                    padding: '8px 10px',
                                    fontSize: '12px',
                                    fontFamily: 'Cinzel, serif',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid #654321',
                                    borderRadius: '4px',
                                    color: '#3d2817'
                                }}
                            >
                                <option value="spirit">Spirit</option>
                                <option value="intelligence">Intelligence</option>
                                <option value="charisma">Charisma</option>
                                <option value="constitution">Constitution</option>
                                <option value="strength">Strength</option>
                                <option value="agility">Agility</option>
                            </select>
                            <input
                                id="demon-save-dc"
                                type="number"
                                value={saveDC}
                                onChange={(e) => setSaveDC(e.target.value)}
                                min="10"
                                max="30"
                                style={{ flex: '1' }}
                            />
                        </div>
                        <div className="save-dc-hint">
                            Suggested for Tier {tier}: DC {getSuggestedDC(tier)}
                        </div>
                    </div>

                    {/* Starting Dominance Die (only in create mode) */}
                    {mode === 'create' && (
                        <div className="demon-form-group">
                            <label htmlFor="demon-starting-dd">
                                <i className="fas fa-dice-d20"></i> Starting Dominance Die
                            </label>
                            <div className="dd-selector">
                                {[20, 12, 10, 8, 6, 4].map(dd => (
                                    <button
                                        key={dd}
                                        type="button"
                                        className={`dd-button ${startingDD === dd ? 'active' : ''}`}
                                        onClick={() => setStartingDD(dd)}
                                    >
                                        d{dd}
                                    </button>
                                ))}
                            </div>
                            <div className="dd-description">
                                Higher DD = Stronger initial control
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="demon-modal-actions">
                        <button type="button" className="demon-btn-cancel" onClick={onClose}>
                            <i className="fas fa-times"></i> Cancel
                        </button>
                        <button type="submit" className="demon-btn-save">
                            <i className="fas fa-check"></i> {mode === 'create' ? 'Bind Demon' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default DemonConfigModal;

