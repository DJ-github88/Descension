import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getClassResourceConfig } from '../../data/classResources';
import './styles/ResourceAdjustmentModal.css';

const ResourceAdjustmentModal = ({
    show,
    onClose,
    onAdjust,
    resourceType,
    currentValue,
    maxValue,
    position,
    characterClass = null // For class resource handling
}) => {
    const [inputValue, setInputValue] = useState('');
    const [adjustmentMode, setAdjustmentMode] = useState('relative'); // 'relative' or 'absolute'
    const inputRef = useRef(null);
    const modalRef = useRef(null);

    useEffect(() => {
        if (show && inputRef.current) {
            inputRef.current.focus();
        }
    }, [show]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [show, onClose]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        // Allow negative numbers for relative adjustments
        if (adjustmentMode === 'relative') {
            if (value === '' || value === '-' || /^-?\d+$/.test(value)) {
                setInputValue(value);
            }
        } else {
            // Only positive numbers for absolute values
            if (value === '' || /^\d+$/.test(value)) {
                setInputValue(value);
            }
        }
    };

    const handleSubmit = () => {
        const value = parseInt(inputValue);
        console.log('💊 ResourceAdjustmentModal handleSubmit:', { value, adjustmentMode, currentValue });
        if (!isNaN(value)) {
            if (adjustmentMode === 'relative') {
                console.log('📊 Calling onAdjust with relative value:', value);
                onAdjust(value);
            } else {
                // For absolute mode, calculate the difference
                const adjustment = value - currentValue;
                console.log('📊 Calling onAdjust with absolute adjustment:', adjustment);
                onAdjust(adjustment);
            }
        }
        setInputValue('');
        onClose();
    };

    const handleQuickAdjust = (amount) => {
        console.log('⚡ ResourceAdjustmentModal handleQuickAdjust:', amount);
        onAdjust(amount);
        onClose();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const getResourceColor = () => {
        // Check if it's a class resource
        if (characterClass && resourceType !== 'health' && resourceType !== 'mana' && resourceType !== 'actionPoints') {
            const classConfig = getClassResourceConfig(characterClass);
            if (classConfig && classConfig.visual) {
                return classConfig.visual.activeColor;
            }
        }

        switch (resourceType) {
            case 'health': return '#4CAF50';
            case 'mana': return '#2196F3';
            case 'actionPoints': return '#FF9800';
            default: return '#666';
        }
    };

    const getResourceIcon = () => {
        // Check if it's a class resource
        if (characterClass && resourceType !== 'health' && resourceType !== 'mana' && resourceType !== 'actionPoints') {
            const classConfig = getClassResourceConfig(characterClass);
            if (classConfig && classConfig.visual) {
                return <span style={{ color: getResourceColor() }}>{classConfig.visual.icon}</span>;
            }
        }

        switch (resourceType) {
            case 'health': return <i className="fas fa-heart" style={{ color: '#4CAF50' }}></i>;
            case 'mana': return <i className="fas fa-tint" style={{ color: '#2196F3' }}></i>;
            case 'actionPoints': return <i className="fas fa-bolt" style={{ color: '#FF9800' }}></i>;
            default: return <i className="fas fa-chart-bar"></i>;
        }
    };

    const formatResourceName = () => {
        // Check if it's a class resource
        if (characterClass && resourceType !== 'health' && resourceType !== 'mana' && resourceType !== 'actionPoints') {
            const classConfig = getClassResourceConfig(characterClass);
            if (classConfig) {
                return classConfig.name;
            }
        }

        switch (resourceType) {
            case 'health': return 'Health';
            case 'mana': return 'Mana';
            case 'actionPoints': return 'Action Points';
            default: return 'Resource';
        }
    };

    if (!show) return null;

    const modalStyle = {
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 10000
    };

    return createPortal(
        <div className="resource-adjustment-modal" ref={modalRef} style={modalStyle}>
            <div className="modal-header">
                <h4>
                    <span className="resource-icon">{getResourceIcon()}</span>
                    Adjust {formatResourceName()}
                </h4>
                <button className="close-button" onClick={onClose}>×</button>
            </div>
            
            <div className="modal-content">
                <div className="current-value">
                    Current: {currentValue}/{maxValue}
                </div>

                <div className="adjustment-mode-toggle">
                    <button 
                        className={adjustmentMode === 'relative' ? 'active' : ''}
                        onClick={() => setAdjustmentMode('relative')}
                    >
                        +/- Amount
                    </button>
                    <button 
                        className={adjustmentMode === 'absolute' ? 'active' : ''}
                        onClick={() => setAdjustmentMode('absolute')}
                    >
                        Set Value
                    </button>
                </div>

                <div className="input-section">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder={adjustmentMode === 'relative' ? 'e.g., -5 or +10' : 'e.g., 25'}
                        className="adjustment-input"
                    />
                    <button 
                        className="submit-button" 
                        onClick={handleSubmit}
                        disabled={!inputValue}
                        style={{ backgroundColor: getResourceColor() }}
                    >
                        Apply
                    </button>
                </div>

                <div className="quick-buttons">
                    <div className="quick-section">
                        <span className="section-label">Quick Damage:</span>
                        <button onClick={() => handleQuickAdjust(-1)} className="quick-btn damage">-1</button>
                        <button onClick={() => handleQuickAdjust(-5)} className="quick-btn damage">-5</button>
                        <button onClick={() => handleQuickAdjust(-10)} className="quick-btn damage">-10</button>
                    </div>
                    <div className="quick-section">
                        <span className="section-label">Quick Heal:</span>
                        <button onClick={() => handleQuickAdjust(1)} className="quick-btn heal">+1</button>
                        <button onClick={() => handleQuickAdjust(5)} className="quick-btn heal">+5</button>
                        <button onClick={() => handleQuickAdjust(10)} className="quick-btn heal">+10</button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ResourceAdjustmentModal;
