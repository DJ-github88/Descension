import React, { useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import './CooldownAdjustmentMenu.css';

const CooldownAdjustmentMenu = ({ slotIndex, item, onAdjust, onClose, actionBarRef }) => {
    const menuRef = useRef(null);

    // Calculate position immediately to avoid flicker
    const position = useMemo(() => {
        if (!actionBarRef?.current) return { x: 0, y: 0 };

        const actionBarRect = actionBarRef.current.getBoundingClientRect();
        const slotWidth = 44;
        const slotLeft = actionBarRect.left + (slotIndex * (slotWidth + 6));
        const menuWidth = 200;
        const spacing = 8;

        // Position menu above the action bar, centered on slot
        let x = slotLeft + (slotWidth / 2) - (menuWidth / 2);
        
        // Ensure menu doesn't go off screen
        if (x < 10) x = 10;
        if (x + menuWidth > window.innerWidth - 10) {
            x = window.innerWidth - menuWidth - 10;
        }

        return {
            x,
            y: actionBarRect.top - spacing
        };
    }, [actionBarRef, slotIndex]);

    useEffect(() => {
        // Click outside to close
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose();
            }
        };

        // Escape key to close
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    if (!item || item.type !== 'spell') return null;

    // Get cooldown information
    const cooldownConfig = item.cooldownConfig || {};
    const cooldownType = item.cooldownType || cooldownConfig.type || 'none';
    const currentCooldown = item.cooldown || 0;
    const maxCooldown = item.maxCooldown || cooldownConfig.value || 0;
    const cooldownValue = maxCooldown > 0 ? maxCooldown : (currentCooldown > 0 ? currentCooldown : 0);

    // Determine adjustment step and unit based on cooldown type
    const getAdjustmentInfo = () => {
        switch (cooldownType) {
            case 'turn_based':
                return { step: 1, unit: 'turn', unitPlural: 'turns', min: 0, max: 20 };
            case 'real_time':
                return { step: 1, unit: 'second', unitPlural: 'seconds', min: 0, max: 3600 };
            case 'short_rest':
            case 'long_rest':
                return { step: 1, unit: 'use', unitPlural: 'uses', min: 0, max: 10 };
            case 'charge_based':
                return { step: 1, unit: 'charge', unitPlural: 'charges', min: 0, max: 10 };
            default:
                return { step: 1, unit: 'unit', unitPlural: 'units', min: 0, max: 20 };
        }
    };

    const adjustmentInfo = getAdjustmentInfo();
    const { step, unit, unitPlural, min, max } = adjustmentInfo;

    const handleAdjust = (delta) => {
        const newValue = Math.max(min, Math.min(max, cooldownValue + delta));
        onAdjust(newValue);
    };

    const handleQuickAdjust = (value) => {
        const newValue = Math.max(min, Math.min(max, value));
        onAdjust(newValue);
    };

    return createPortal(
        <div className="cooldown-menu-overlay">
            <div
                className="cooldown-menu"
                ref={menuRef}
                style={{
                    position: 'fixed',
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: 'translateY(-100%)'
                }}
            >
                <div className="cooldown-menu-content">
                    <div className="cooldown-value-display">
                        <span className="cooldown-value-number">{cooldownValue}</span>
                        <span className="cooldown-value-unit">{cooldownValue === 1 ? unit : unitPlural}</span>
                    </div>

                    <div className="cooldown-adjust-buttons">
                        <button 
                            className="cooldown-btn decrease"
                            onClick={() => handleAdjust(-step)}
                            disabled={cooldownValue <= min}
                        >
                            −
                        </button>
                        <button 
                            className="cooldown-btn increase"
                            onClick={() => handleAdjust(step)}
                            disabled={cooldownValue >= max}
                        >
                            +
                        </button>
                    </div>

                    {cooldownType === 'real_time' && (
                        <div className="cooldown-quick-values">
                            <button className="quick-btn" onClick={() => handleQuickAdjust(0)}>0</button>
                            <button className="quick-btn" onClick={() => handleQuickAdjust(30)}>30s</button>
                            <button className="quick-btn" onClick={() => handleQuickAdjust(60)}>1m</button>
                            <button className="quick-btn" onClick={() => handleQuickAdjust(300)}>5m</button>
                        </div>
                    )}

                    {cooldownType === 'turn_based' && (
                        <div className="cooldown-quick-values">
                            <button className="quick-btn" onClick={() => handleQuickAdjust(0)}>0</button>
                            <button className="quick-btn" onClick={() => handleQuickAdjust(1)}>1</button>
                            <button className="quick-btn" onClick={() => handleQuickAdjust(3)}>3</button>
                            <button className="quick-btn" onClick={() => handleQuickAdjust(5)}>5</button>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CooldownAdjustmentMenu;
