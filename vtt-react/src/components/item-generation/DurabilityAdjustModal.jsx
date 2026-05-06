import React, { useState } from 'react';
import { createPortal } from 'react-dom';


const DurabilityAdjustModal = ({ visible, item, onClose, onDurabilityChange }) => {
    const [customAmount, setCustomAmount] = useState('');

    if (!visible || !item) return null;

    const durability = item.durability ?? 0;
    const maxDurability = item.maxDurability ?? 1;
    const percentage = maxDurability > 0 ? (durability / maxDurability) * 100 : 0;
    const isBroken = durability === 0;

    const getBarColor = () => {
        if (isBroken) return '#5a3a3a';
        if (percentage <= 25) return '#c0392b';
        if (percentage <= 50) return '#d4a017';
        return '#27ae60';
    };

    const getBarGlow = () => {
        if (isBroken) return 'none';
        if (percentage <= 25) return '0 0 6px rgba(192, 57, 43, 0.4)';
        if (percentage <= 50) return '0 0 6px rgba(212, 160, 23, 0.4)';
        return '0 0 6px rgba(39, 174, 96, 0.4)';
    };

    const clampDurability = (value) => Math.max(0, Math.min(maxDurability, value));

    const applyChange = (delta) => {
        const newValue = clampDurability(durability + delta);
        onDurabilityChange(item.id, newValue);
    };

    const handleApplyCustom = () => {
        const parsed = parseInt(customAmount, 10);
        if (isNaN(parsed)) return;
        const newValue = clampDurability(parsed);
        onDurabilityChange(item.id, newValue);
        setCustomAmount('');
    };

    const handleSetMax = () => {
        onDurabilityChange(item.id, maxDurability);
    };

    const handleSetBroken = () => {
        onDurabilityChange(item.id, 0);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const presetButtons = [
        { label: '-10', delta: -10 },
        { label: '-5', delta: -5 },
        { label: '-1', delta: -1 },
        { label: '+1', delta: 1 },
        { label: '+5', delta: 5 },
        { label: '+10', delta: 10 }
    ];

    return createPortal(
        <div
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000
            }}
            onClick={handleOverlayClick}
        >
            <div
                style={{
                    background: 'linear-gradient(135deg, #2a1810, #1a0f0a)',
                    border: '2px solid #8b4513',
                    borderRadius: '8px',
                    padding: '20px',
                    minWidth: '380px',
                    maxWidth: '450px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(139, 69, 19, 0.3)',
                    fontFamily: "'Bookman Old Style', Garamond, serif",
                    color: '#d4a574'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    borderBottom: '1px solid #5a3a20',
                    paddingBottom: '12px'
                }}>
                    <div>
                        <h3 style={{
                            margin: 0,
                            fontFamily: "'Cinzel', 'Bookman Old Style', serif",
                            fontSize: '1.1rem',
                            color: '#d4a574',
                            textShadow: '0 0 8px rgba(212, 165, 116, 0.3)'
                        }}>
                            {item.name || 'Unknown Item'}
                        </h3>
                        <span style={{
                            fontSize: '0.85rem',
                            color: '#a0785a'
                        }}>
                            Durability: {durability} / {maxDurability}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: '1px solid #5a3a20',
                            borderRadius: '4px',
                            color: '#a0785a',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            padding: '2px 8px',
                            fontFamily: "'Bookman Old Style', Garamond, serif"
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.borderColor = '#d4a574';
                            e.target.style.color = '#d4a574';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.borderColor = '#5a3a20';
                            e.target.style.color = '#a0785a';
                        }}
                    >
                        &times;
                    </button>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <div style={{
                        position: 'relative',
                        height: '24px',
                        background: '#1a0f0a',
                        border: '1px solid #5a3a20',
                        borderRadius: '4px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${Math.max(percentage, isBroken ? 0 : 2)}%`,
                            background: isBroken
                                ? 'repeating-linear-gradient(45deg, #3a2020, #3a2020 4px, #2a1515 4px, #2a1515 8px)'
                                : `linear-gradient(90deg, ${getBarColor()}, ${getBarColor()}dd)`,
                            borderRadius: '3px',
                            boxShadow: getBarGlow(),
                            transition: 'width 0.3s ease, background 0.3s ease'
                        }} />
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            color: isBroken ? '#c0392b' : '#d4a574',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                            letterSpacing: isBroken ? '2px' : '0'
                        }}>
                            {isBroken ? 'BROKEN' : `${Math.round(percentage)}%`}
                        </div>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginBottom: '16px'
                }}>
                    {presetButtons.map((btn) => (
                        <button
                            key={btn.label}
                            onClick={() => applyChange(btn.delta)}
                            style={{
                                background: 'linear-gradient(135deg, #3a2010, #2a1810)',
                                border: '1px solid #5a3a20',
                                borderRadius: '4px',
                                color: btn.delta > 0 ? '#27ae60' : '#c0392b',
                                cursor: 'pointer',
                                padding: '6px 12px',
                                fontSize: '0.85rem',
                                fontFamily: "'Bookman Old Style', Garamond, serif",
                                fontWeight: 'bold',
                                minWidth: '45px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.borderColor = '#8b4513';
                                e.target.style.background = 'linear-gradient(135deg, #4a2a15, #3a2010)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.borderColor = '#5a3a20';
                                e.target.style.background = 'linear-gradient(135deg, #3a2010, #2a1810)';
                            }}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>

                <div style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    marginBottom: '16px',
                    padding: '10px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '4px',
                    border: '1px solid #3a2010'
                }}>
                    <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Custom value"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleApplyCustom();
                        }}
                        style={{
                            flex: 1,
                            background: '#1a0f0a',
                            border: '1px solid #5a3a20',
                            borderRadius: '4px',
                            color: '#d4a574',
                            padding: '6px 10px',
                            fontSize: '0.85rem',
                            fontFamily: "'Bookman Old Style', Garamond, serif",
                            outline: 'none'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#8b4513';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#5a3a20';
                        }}
                    />
                    <button
                        onClick={handleApplyCustom}
                        disabled={!customAmount}
                        style={{
                            background: customAmount
                                ? 'linear-gradient(135deg, #8b4513, #6b3410)'
                                : 'linear-gradient(135deg, #3a2010, #2a1810)',
                            border: '1px solid #5a3a20',
                            borderRadius: '4px',
                            color: customAmount ? '#d4a574' : '#5a3a20',
                            cursor: customAmount ? 'pointer' : 'not-allowed',
                            padding: '6px 14px',
                            fontSize: '0.85rem',
                            fontFamily: "'Bookman Old Style', Garamond, serif",
                            fontWeight: 'bold'
                        }}
                    >
                        Apply
                    </button>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'center',
                    borderTop: '1px solid #5a3a20',
                    paddingTop: '12px'
                }}>
                    <button
                        onClick={handleSetMax}
                        style={{
                            background: 'linear-gradient(135deg, #27ae60, #1e8449)',
                            border: '1px solid #27ae60',
                            borderRadius: '4px',
                            color: '#fff',
                            cursor: 'pointer',
                            padding: '6px 16px',
                            fontSize: '0.85rem',
                            fontFamily: "'Bookman Old Style', Garamond, serif",
                            fontWeight: 'bold',
                            flex: 1
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #27ae60, #1e8449)';
                        }}
                    >
                        Set to Max
                    </button>
                    <button
                        onClick={handleSetBroken}
                        style={{
                            background: 'linear-gradient(135deg, #7a2020, #5a1515)',
                            border: '1px solid #8b3030',
                            borderRadius: '4px',
                            color: '#e8a0a0',
                            cursor: 'pointer',
                            padding: '6px 16px',
                            fontSize: '0.85rem',
                            fontFamily: "'Bookman Old Style', Garamond, serif",
                            fontWeight: 'bold',
                            flex: 1
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #9a2020, #7a1515)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #7a2020, #5a1515)';
                        }}
                    >
                        Set to Broken
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DurabilityAdjustModal;
