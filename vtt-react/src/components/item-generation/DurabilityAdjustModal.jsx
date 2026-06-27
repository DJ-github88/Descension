import React from 'react';
import { createPortal } from 'react-dom';
import DieIcon from './DieIcon';

const getDiceValue = (die) => {
    if (!die) return 0;
    if (typeof die === 'number') return die;
    const dieLower = String(die).toLowerCase();
    if (dieLower === 'broken' || dieLower === '0') return 0;
    const match = dieLower.match(/^d(\d+)$/);
    if (match) return parseInt(match[1], 10);
    return parseInt(dieLower, 10) || 0;
};

const getDiceString = (val, defaultVal = 'd8') => {
    if (!val) return defaultVal;
    if (typeof val === 'string') return val.toLowerCase();
    if (val <= 30) return 'd4';
    if (val <= 50) return 'd6';
    if (val <= 70) return 'd8';
    if (val <= 100) return 'd10';
    if (val <= 150) return 'd12';
    return 'd20';
};

const DurabilityAdjustModal = ({ visible, item, onClose, onDurabilityChange }) => {
    if (!visible || !item) return null;

    const diceSteps = ['broken', 'd4', 'd6', 'd8', 'd10', 'd12', 'd20'];
    const maxDurStr = getDiceString(item.maxDurability, 'd8');
    const curDurStr = getDiceString(item.durability, maxDurStr);

    const maxIdx = diceSteps.indexOf(maxDurStr);
    const curIdx = diceSteps.indexOf(curDurStr);

    const getStepColor = (step) => {
        if (step === 'broken') return '#ff3838';
        const stepIdx = diceSteps.indexOf(step);
        if (maxIdx <= 1) return '#27ae60';
        const ratio = (stepIdx - 1) / (maxIdx - 1);
        if (ratio <= 0.25) return '#ff3838';
        if (ratio <= 0.50) return '#d4a017';
        return '#27ae60';
    };

    const handleSelectStep = (step) => {
        onDurabilityChange(item.id, step);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const percentage = maxIdx > 1 ? ((curIdx - 1) / (maxIdx - 1)) * 100 : 0;
    const barColor = getStepColor(curDurStr);

    return createPortal(
        <div
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0, 0, 0, 0.75)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                backdropFilter: 'blur(3px)'
            }}
            onClick={handleOverlayClick}
        >
            <div
                style={{
                    background: 'linear-gradient(135deg, #2a1810, #160d08)',
                    border: '2px solid #8b4513',
                    borderRadius: '12px',
                    padding: '24px',
                    width: '420px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(212, 175, 55, 0.2)',
                    fontFamily: "'Cinzel', 'Bookman Old Style', serif",
                    color: '#d4a574'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    borderBottom: '1px solid #5a3a20',
                    paddingBottom: '12px'
                }}>
                    <div>
                        <h3 style={{
                            margin: 0,
                            fontFamily: "'Cinzel', serif",
                            fontSize: '1.2rem',
                            color: '#d4af37',
                            textShadow: '0 0 10px rgba(212, 175, 55, 0.4)',
                            fontWeight: 'bold',
                            letterSpacing: '1px'
                        }}>
                            {item.name || 'Unknown Item'}
                        </h3>
                        <span style={{
                            fontSize: '0.8rem',
                            fontFamily: "'Bookman Old Style', Garamond, serif",
                            color: '#a0856c',
                            marginTop: '4px',
                            display: 'block'
                        }}>
                            Maximum Capacity: <strong style={{ color: '#d4af37' }}>{maxDurStr.toUpperCase()} DR</strong>
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: '1px solid #5a3a20',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            color: '#a0785a',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#d4a574';
                            e.currentTarget.style.color = '#d4a574';
                            e.currentTarget.style.boxShadow = '0 0 8px rgba(212, 175, 55, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#5a3a20';
                            e.currentTarget.style.color = '#a0785a';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        &times;
                    </button>
                </div>

                {/* Progress Bar Area */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.8rem',
                        fontFamily: "'Bookman Old Style', Garamond, serif",
                        marginBottom: '6px',
                        color: '#a0856c'
                    }}>
                        <span>Current Integrity:</span>
                        <strong style={{ color: barColor }}>
                            {curDurStr === 'broken' ? 'SHATTERED (BROKEN)' : `${curDurStr.toUpperCase()} / ${maxDurStr.toUpperCase()}`}
                        </strong>
                    </div>
                    <div style={{
                        position: 'relative',
                        height: '18px',
                        background: '#120a06',
                        border: '1px solid #5a3a20',
                        borderRadius: '9px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%',
                            width: curDurStr === 'broken' ? '100%' : `${percentage}%`,
                            background: curDurStr === 'broken' 
                                ? 'repeating-linear-gradient(45deg, #421a1a, #421a1a 4px, #240f0f 4px, #240f0f 8px)'
                                : `linear-gradient(90deg, ${barColor}, ${barColor}cc)`,
                            borderRadius: '8px',
                            boxShadow: curDurStr === 'broken' ? 'none' : `0 0 10px ${barColor}60`,
                            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }} />
                    </div>
                </div>

                {/* Tactical Die Ladder Selector Grid */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #422616',
                    marginBottom: '20px'
                }}>
                    <span style={{
                        fontSize: '0.8rem',
                        letterSpacing: '1px',
                        color: '#8b7355',
                        textAlign: 'center',
                        display: 'block',
                        fontWeight: 'bold'
                    }}>
                        TACTICAL DURABILITY DIE LADDER
                    </span>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '6px'
                    }}>
                        {diceSteps.map((step, idx) => {
                            const isAllowed = idx <= maxIdx;
                            const isSelected = curDurStr === step;
                            const stepColor = getStepColor(step);

                            return (
                                <button
                                    key={step}
                                    disabled={!isAllowed}
                                    onClick={() => handleSelectStep(step)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                        padding: '12px 2px',
                                        background: isSelected
                                            ? 'var(--my-gradient-gold, linear-gradient(145deg, #f4d03f 0%, #d4af37 50%, #b8860b 100%))'
                                            : isAllowed
                                                ? 'linear-gradient(145deg, #2b180f, #1a0f0a)'
                                                : 'rgba(0,0,0,0.05)',
                                        border: `2px solid ${isSelected ? '#d4af37' : isAllowed ? '#5a3a20' : 'rgba(0,0,0,0.05)'}`,
                                        color: isSelected
                                            ? '#2d1810'
                                            : isAllowed
                                                ? '#d4a574'
                                                : 'rgba(212, 165, 116, 0.15)',
                                        borderRadius: '8px',
                                        cursor: isAllowed ? 'pointer' : 'not-allowed',
                                        boxShadow: isSelected
                                            ? '0 0 12px rgba(212, 175, 55, 0.4), inset 0 2px 4px rgba(255,255,255,0.2)'
                                            : 'none',
                                        transition: 'all 0.2s ease',
                                        opacity: isAllowed ? 1 : 0.3
                                    }}
                                >
                                    <DieIcon die={step} size="16px" style={{
                                        color: isSelected ? '#2d1810' : isAllowed ? stepColor : 'inherit'
                                    }} />
                                    <span style={{ 
                                        fontSize: '9px', 
                                        fontWeight: '800',
                                        fontFamily: "'Cinzel', serif"
                                    }}>
                                        {step.toUpperCase()}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer Controls */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'center',
                    borderTop: '1px solid #5a3a20',
                    paddingTop: '16px'
                }}>
                    <button
                        onClick={() => handleSelectStep(maxDurStr)}
                        style={{
                            background: 'linear-gradient(135deg, #27ae60, #1e8449)',
                            border: '1px solid #27ae60',
                            borderRadius: '6px',
                            color: '#fff',
                            cursor: 'pointer',
                            padding: '10px 16px',
                            fontSize: '0.85rem',
                            fontFamily: "'Cinzel', serif",
                            fontWeight: 'bold',
                            flex: 1,
                            transition: 'all 0.2s ease',
                            letterSpacing: '1px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
                            e.currentTarget.style.boxShadow = '0 0 10px rgba(46, 204, 113, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #27ae60, #1e8449)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        FULLY REPAIR
                    </button>
                    <button
                        onClick={() => handleSelectStep('broken')}
                        style={{
                            background: 'linear-gradient(135deg, #7a2020, #5a1515)',
                            border: '1px solid #8b3030',
                            borderRadius: '6px',
                            color: '#e8a0a0',
                            cursor: 'pointer',
                            padding: '10px 16px',
                            fontSize: '0.85rem',
                            fontFamily: "'Cinzel', serif",
                            fontWeight: 'bold',
                            flex: 1,
                            transition: 'all 0.2s ease',
                            letterSpacing: '1px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #9a2020, #7a1515)';
                            e.currentTarget.style.boxShadow = '0 0 10px rgba(231, 76, 60, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #7a2020, #5a1515)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        SHATTER ITEM
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DurabilityAdjustModal;
