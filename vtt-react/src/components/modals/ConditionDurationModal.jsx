import React, { useState, useEffect } from 'react';
import '../../styles/character-sheet.css';

const ConditionDurationModal = ({ show, onClose, onApply, conditionName, initialDurationType = 'minutes', initialDurationValue = 10 }) => {
    const [durationType, setDurationType] = useState(initialDurationType);
    const [durationValue, setDurationValue] = useState(initialDurationValue);

    // Update state when initial values change
    useEffect(() => {
        if (show) {
            setDurationType(initialDurationType);
            setDurationValue(initialDurationValue);
        }
    }, [show, initialDurationType, initialDurationValue]);

    if (!show) return null;

    const handleApply = () => {
        let durationInSeconds;
        
        switch (durationType) {
            case 'rounds':
                durationInSeconds = durationValue * 6; // 1 round = 6 seconds
                break;
            case 'minutes':
                durationInSeconds = durationValue * 60;
                break;
            case 'hours':
                durationInSeconds = durationValue * 3600;
                break;
            default:
                durationInSeconds = durationValue * 60;
        }

        onApply({
            duration: durationInSeconds * 1000, // Convert to milliseconds
            durationType,
            durationValue
        });
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
        }}>
            <div style={{
                background: 'linear-gradient(135deg, rgba(240, 230, 210, 0.95) 0%, rgba(230, 220, 200, 0.9) 50%, rgba(213, 203, 176, 0.85) 100%)',
                border: '2px solid #8b7355',
                borderRadius: '12px',
                padding: '25px',
                minWidth: '400px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                fontFamily: 'Cinzel, serif',
                color: '#5a1e12'
            }}>
                <h3 style={{
                    margin: '0 0 20px 0',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderBottom: '2px solid #8b7355',
                    paddingBottom: '10px'
                }}>
                    Set Duration for {conditionName}
                </h3>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '600'
                    }}>
                        Duration:
                    </label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                            type="number"
                            min="1"
                            value={durationValue}
                            onChange={(e) => setDurationValue(parseInt(e.target.value) || 1)}
                            style={{
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(250, 245, 235, 0.8) 100%)',
                                border: '2px solid #8b7355',
                                borderRadius: '6px',
                                color: '#5a1e12',
                                fontFamily: 'Garamond, Times New Roman, serif',
                                fontSize: '14px',
                                padding: '8px 12px',
                                width: '80px',
                                textAlign: 'center'
                            }}
                        />
                        <select
                            value={durationType}
                            onChange={(e) => setDurationType(e.target.value)}
                            style={{
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(250, 245, 235, 0.8) 100%)',
                                border: '2px solid #8b7355',
                                borderRadius: '6px',
                                color: '#5a1e12',
                                fontFamily: 'Garamond, Times New Roman, serif',
                                fontSize: '14px',
                                padding: '8px 12px',
                                flex: 1
                            }}
                        >
                            <option value="rounds">Rounds</option>
                            <option value="minutes">Minutes</option>
                            <option value="hours">Hours</option>
                        </select>
                    </div>
                </div>

                <div style={{
                    background: 'rgba(139, 115, 85, 0.1)',
                    border: '1px solid #8b7355',
                    borderRadius: '6px',
                    padding: '12px',
                    marginBottom: '20px',
                    fontSize: '12px',
                    fontStyle: 'italic'
                }}>
                    <strong>Note:</strong> Round-based durations will automatically tick down during combat when it's the affected creature's turn.
                </div>

                <div style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'flex-end'
                }}>
                    <button
                        onClick={handleCancel}
                        style={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(240, 230, 210, 0.4) 100%)',
                            border: '2px solid #a08c70',
                            borderRadius: '8px',
                            color: '#5a1e12',
                            fontFamily: 'Cinzel, serif',
                            fontSize: '14px',
                            fontWeight: '600',
                            padding: '10px 20px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        style={{
                            background: 'linear-gradient(135deg, rgba(122, 59, 46, 0.9) 0%, rgba(139, 115, 85, 0.8) 100%)',
                            border: '2px solid #7a3b2e',
                            borderRadius: '8px',
                            color: '#f0e6d2',
                            fontFamily: 'Cinzel, serif',
                            fontSize: '14px',
                            fontWeight: '600',
                            padding: '10px 20px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Apply Condition
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConditionDurationModal;
