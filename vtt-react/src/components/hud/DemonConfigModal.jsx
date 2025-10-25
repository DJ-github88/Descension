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
                        <div className="tier-description">
                            {tier === 1 && 'Lesser Demon (CR 1-3)'}
                            {tier === 2 && 'Minor Demon (CR 4-6)'}
                            {tier === 3 && 'Demon (CR 7-9)'}
                            {tier === 4 && 'Greater Demon (CR 10-12)'}
                            {tier === 5 && 'Demon Lord (CR 13-15)'}
                            {tier === 6 && 'Archfiend (CR 16+)'}
                        </div>
                    </div>

                    {/* Save DC */}
                    <div className="demon-form-group">
                        <label htmlFor="demon-save-dc">
                            <i className="fas fa-shield-alt"></i> Save DC
                        </label>
                        <input
                            id="demon-save-dc"
                            type="number"
                            value={saveDC}
                            onChange={(e) => setSaveDC(e.target.value)}
                            min="10"
                            max="30"
                        />
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
                                {[12, 10, 8, 6].map(dd => (
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

