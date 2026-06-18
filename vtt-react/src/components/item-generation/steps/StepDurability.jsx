import React from 'react';
import { getIconUrl } from '../../../utils/assetManager';
import DieIcon from '../DieIcon';

const StepDurability = ({ itemData, updateItemData }) => {
                const isEquippableType = ['weapon', 'armor', 'accessory'].includes(itemData.type);
                if (!isEquippableType) {
                    return (
                        <div className="wizard-step">
                            <h3 className="wow-heading quality-text">Durability</h3>
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                padding: '60px 20px',
                                textAlign: 'center'
                            }}>
                                <img 
                                    src={getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items')} 
                                    alt="Not Applicable" 
                                    style={{ width: '64px', height: '64px', marginBottom: '20px', opacity: 0.5 }}
                                />
                                <p style={{ color: '#8b7355', fontFamily: "'Bookman Old Style', Garamond, serif", fontSize: '16px' }}>
                                    Durability does not apply to <strong>{itemData.type}</strong> items.
                                </p>
                                <p style={{ color: '#a08c70', fontSize: '14px', marginTop: '10px' }}>
                                    You can safely skip this step.
                                </p>
                            </div>
                        </div>
                    );
                }

                const getDiceString = (val, defaultVal) => {
                    if (!val) return defaultVal;
                    if (typeof val === 'string') return val.toLowerCase();
                    if (val <= 30) return 'd4';
                    if (val <= 50) return 'd6';
                    if (val <= 70) return 'd8';
                    if (val <= 100) return 'd10';
                    if (val <= 150) return 'd12';
                    return 'd20';
                };

                const currentMaxDurStr = getDiceString(itemData.maxDurability, 'd8');
                const currentDurStr = getDiceString(itemData.durability, currentMaxDurStr);

                const diceSteps = ['broken', 'd4', 'd6', 'd8', 'd10', 'd12', 'd20'];
                const maxDiceSteps = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];

                const handleMaxChange = (newMax) => {
                    const currentIdx = diceSteps.indexOf(currentDurStr);
                    const newMaxIdx = diceSteps.indexOf(newMax);
                    let newDur = currentDurStr;
                    if (currentIdx > newMaxIdx) {
                        newDur = newMax;
                    }
                    updateItemData({ maxDurability: newMax, durability: newDur });
                };

                const handleDurChange = (newDur) => {
                    updateItemData({ durability: newDur });
                };

                const getStepColor = (dur, max) => {
                    if (dur === 'broken') return '#ff3838';
                    const durIdx = diceSteps.indexOf(dur);
                    const maxIdx = diceSteps.indexOf(max);
                    if (maxIdx <= 1) return '#4caf50';
                    const ratio = (durIdx - 1) / (maxIdx - 1);
                    if (ratio <= 0.25) return '#ff3838';
                    if (ratio <= 0.5) return '#ffaa00';
                    return '#4caf50';
                };

                const barColor = getStepColor(currentDurStr, currentMaxDurStr);
                const maxIdx = diceSteps.indexOf(currentMaxDurStr);
                const curIdx = diceSteps.indexOf(currentDurStr);
                const durPercent = maxIdx > 1 ? ((curIdx - 1) / (maxIdx - 1)) * 100 : 0;

                return (
                    <div className="wizard-step">
                        <h3 className="wow-heading quality-text">Durability Settings</h3>
                        <p style={{ color: '#8b7355', fontFamily: "'Crimson Text', serif", marginBottom: '24px', fontSize: '15px', textAlign: 'center', fontStyle: 'italic' }}>
                            Define the resilience of this artifact. Items use a die-based Damage Reduction system where durability degrades on rolls of 1 or 2.
                        </p>

                        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            
                            {/* Rules Reminder Callout */}
                            <div style={{
                                padding: '16px',
                                background: 'rgba(212, 175, 55, 0.05)',
                                border: '1px solid rgba(212, 175, 55, 0.3)',
                                borderRadius: '12px',
                                color: '#8b7355',
                                fontSize: '13px',
                                lineHeight: '1.6'
                            }}>
                                <strong style={{ color: 'var(--pf-gold-dark, #b8860b)', fontFamily: "'Cinzel', serif", display: 'block', marginBottom: '6px' }}>
                                    <i className="fas fa-scroll" style={{ marginRight: '6px' }}></i> DICE-BASED DURABILITY RULES
                                </strong>
                                Armor items grant a Damage Reduction (DR) die. When hit, players roll their current DR die size to absorb damage. If a <strong>1 or 2</strong> is rolled, the armor degrades by one step tier on the ladder. A roll of <strong>3 or higher</strong> maintains its current tier. Critical hits ignore DR and do not degrade durability.
                            </div>

                            {/* Max Durability Section */}
                            <div style={{
                                padding: '20px',
                                background: 'rgba(45, 24, 16, 0.05)',
                                border: '1px solid rgba(139, 69, 19, 0.2)',
                                borderRadius: '12px',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <span style={{ color: 'var(--pf-brown-darkest)', fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '14px', letterSpacing: '1px' }}>
                                        MAXIMUM CAPACITY (DR DIE)
                                    </span>
                                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--pf-gold-dark, #b8860b)', fontFamily: "'Cinzel', serif", display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                        <DieIcon die={currentMaxDurStr} size="16px" /> {currentMaxDurStr.toUpperCase()}
                                    </span>
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginTop: '10px' }}>
                                    {maxDiceSteps.map(step => (
                                        <button
                                            key={step}
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px',
                                                padding: '12px 4px',
                                                height: 'auto',
                                                background: currentMaxDurStr === step ? 'var(--pf-gradient-gold, linear-gradient(145deg, #f4d03f 0%, #d4af37 50%, #b8860b 100%))' : 'var(--pf-gradient-button, linear-gradient(145deg, #f8f4e6 0%, #ede4d3 50%, #e8dcc6 100%))',
                                                border: `2px solid ${currentMaxDurStr === step ? 'var(--pf-gold-dark, #b8860b)' : 'var(--pf-brown-medium, #8B4513)'}`,
                                                color: currentMaxDurStr === step ? 'var(--pf-brown-darkest, #2d1810)' : 'var(--pf-text-primary, #2d1810)',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                boxShadow: currentMaxDurStr === step ? 'inset 0 2px 4px rgba(212, 175, 55, 0.2), 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 12px rgba(212, 175, 55, 0.4)' : 'inset 0 2px 4px rgba(139, 69, 19, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1)',
                                                transition: 'all 0.2s ease',
                                                fontFamily: "'Cinzel', serif"
                                            }}
                                            onClick={() => handleMaxChange(step)}
                                        >
                                            <DieIcon die={step} size="18px" />
                                            <span style={{ fontSize: '12px', fontWeight: '800' }}>{step.toUpperCase()}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Current Durability Section */}
                            <div style={{
                                padding: '20px',
                                background: 'rgba(45, 24, 16, 0.05)',
                                border: '1px solid rgba(139, 69, 19, 0.2)',
                                borderRadius: '12px',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <span style={{ color: 'var(--pf-brown-darkest)', fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '14px', letterSpacing: '1px' }}>
                                        CURRENT INTEGRITY (STATUS DIE)
                                    </span>
                                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: barColor, fontFamily: "'Cinzel', serif", display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                        {currentDurStr === 'broken' ? (
                                            <>
                                                <DieIcon die="broken" size="16px" /> BROKEN
                                            </>
                                        ) : (
                                            <>
                                                <DieIcon die={currentDurStr} size="16px" /> {currentDurStr.toUpperCase()}
                                            </>
                                        )}
                                    </span>
                                </div>

                                {/* Status Progress Bar */}
                                <div style={{ margin: '20px 0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--pf-brown-darkest)' }}>
                                            {currentDurStr === 'broken' ? 'SHATTERED' : `${currentDurStr.toUpperCase()} OUT OF ${currentMaxDurStr.toUpperCase()}`}
                                        </span>
                                        <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--pf-brown-light)' }}>
                                            {currentDurStr === 'broken' ? 'broken' : `step ${curIdx} / ${maxIdx}`}
                                        </span>
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        height: '14px',
                                        background: 'rgba(0,0,0,0.1)',
                                        borderRadius: '7px',
                                        overflow: 'hidden',
                                        border: '1px solid rgba(139, 69, 19, 0.2)',
                                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
                                    }}>
                                        <div style={{
                                            width: currentDurStr === 'broken' ? '100%' : `${durPercent}%`,
                                            height: '100%',
                                            background: barColor,
                                            boxShadow: `0 0 10px ${barColor}40`,
                                            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }} />
                                    </div>
                                </div>

                                {/* Step Selection Ladder Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                                    {diceSteps.map((step, idx) => {
                                        const isAllowed = idx <= maxIdx;
                                        const isSelected = currentDurStr === step;
                                        return (
                                            <button
                                                key={step}
                                                disabled={!isAllowed}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '4px',
                                                    padding: '10px 2px',
                                                    height: 'auto',
                                                    background: isSelected ? 'var(--pf-gradient-gold, linear-gradient(145deg, #f4d03f 0%, #d4af37 50%, #b8860b 100%))' : isAllowed ? 'var(--pf-gradient-button, linear-gradient(145deg, #f8f4e6 0%, #ede4d3 50%, #e8dcc6 100%))' : 'rgba(0,0,0,0.05)',
                                                    border: `2px solid ${isSelected ? 'var(--pf-gold-dark, #b8860b)' : isAllowed ? 'var(--pf-brown-medium, #8B4513)' : 'rgba(0,0,0,0.1)'}`,
                                                    color: isSelected ? 'var(--pf-brown-darkest, #2d1810)' : isAllowed ? 'var(--pf-text-primary, #2d1810)' : 'rgba(0,0,0,0.3)',
                                                    borderRadius: '8px',
                                                    cursor: isAllowed ? 'pointer' : 'not-allowed',
                                                    boxShadow: isSelected ? 'inset 0 2px 4px rgba(212, 175, 55, 0.2), 0 2px 4px rgba(0, 0, 0, 0.2)' : isAllowed ? 'inset 0 2px 4px rgba(139, 69, 19, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                                                    transition: 'all 0.2s ease',
                                                    fontFamily: "'Cinzel', serif",
                                                    opacity: isAllowed ? 1 : 0.4
                                                }}
                                                onClick={() => isAllowed && handleDurChange(step)}
                                            >
                                                {step === 'broken' ? (
                                                    <DieIcon die="broken" size="14px" style={{ color: isSelected ? '#2d1810' : '#d32f2f' }} />
                                                ) : (
                                                    <DieIcon die={step} size="14px" />
                                                )}
                                                <span style={{ fontSize: '10px', fontWeight: '800' }}>{step.toUpperCase()}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                );
};

export default StepDurability;
