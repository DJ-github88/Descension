import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { WOW_ICON_BASE_URL } from './wowIcons';
import { CURRENCY_TYPES } from './itemConstants';
import '../../styles/currency-withdraw-modal.css';

const ManualCoinGenerationModal = ({ onClose, onComplete }) => {
    const modalRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [parsedValues, setParsedValues] = useState({ gold: 0, silver: 0, copper: 0 });
    const [error, setError] = useState('');
    const [isValid, setIsValid] = useState(false);

    // Handle click outside to close modal
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    // Parse the input value into gold, silver, and copper
    useEffect(() => {
        if (!inputValue.trim()) {
            setParsedValues({ gold: 0, silver: 0, copper: 0 });
            setIsValid(false);
            setError('');
            return;
        }

        try {
            // Parse the input using regex
            const goldMatch = inputValue.match(/(\d+)g/i);
            const silverMatch = inputValue.match(/(\d+)s/i);
            const copperMatch = inputValue.match(/(\d+)c/i);

            const gold = goldMatch ? parseInt(goldMatch[1]) : 0;
            const silver = silverMatch ? parseInt(silverMatch[1]) : 0;
            const copper = copperMatch ? parseInt(copperMatch[1]) : 0;

            // Set reasonable maximum limits
            const MAX_GOLD = 999999;
            const MAX_SILVER = 999999;
            const MAX_COPPER = 999999;

            // Validate the values
            if (gold < 0 || silver < 0 || copper < 0) {
                setError('Values cannot be negative');
                setIsValid(false);
                return;
            }

            if (gold > MAX_GOLD || silver > MAX_SILVER || copper > MAX_COPPER) {
                setError(`Maximum values: ${MAX_GOLD}g ${MAX_SILVER}s ${MAX_COPPER}c`);
                setIsValid(false);
                return;
            }

            if (gold === 0 && silver === 0 && copper === 0) {
                setError('Please enter at least one currency value (format: 1g 5s 20c)');
                setIsValid(false);
                return;
            }

            // Check for invalid format (numbers without currency letters)
            const hasNumbersWithoutCurrency = /\d+(?![gsc])/i.test(inputValue.replace(/\s/g, ''));
            if (hasNumbersWithoutCurrency) {
                setError('Use format: 1g 5s 20c (numbers must be followed by g, s, or c)');
                setIsValid(false);
                return;
            }

            // Set the parsed values
            setParsedValues({ gold, silver, copper });
            setIsValid(true);
            setError('');
        } catch (error) {
            console.error('Error parsing currency input:', error);
            setError('Invalid input format');
            setIsValid(false);
        }
    }, [inputValue]);

    // Handle input change with validation
    const handleInputChange = (e) => {
        const value = e.target.value;

        // Only allow digits, letters g/s/c (case insensitive), and spaces
        const sanitizedValue = value.replace(/[^0-9gscGSC\s]/g, '');

        setInputValue(sanitizedValue);
    };

    // Handle generate
    const handleGenerate = () => {
        if (!isValid) {
            return;
        }

        const { gold, silver, copper } = parsedValues;

        // Create a single combined currency item
        if (gold > 0 || silver > 0 || copper > 0) {
            // Determine which icon to use based on the highest denomination
            let iconId, primaryType;
            if (gold > 0) {
                iconId = 'inv_misc_coin_01';
                primaryType = 'gold';
            } else if (silver > 0) {
                iconId = 'inv_misc_coin_03';
                primaryType = 'silver';
            } else {
                iconId = 'inv_misc_coin_05';
                primaryType = 'copper';
            }

            // Create a display name that shows all denominations
            let displayName = '';
            if (gold > 0) displayName += `${gold}g `;
            if (silver > 0) displayName += `${silver}s `;
            if (copper > 0) displayName += `${copper}c`;
            displayName = displayName.trim();

            // Create the combined currency item
            const currencyValue = {
                gold: gold,
                silver: silver,
                copper: copper
            };

            const currencyItem = {
                id: crypto.randomUUID(),
                name: displayName,
                quality: 'common',
                description: `${displayName} that can be spent or traded.`,
                type: 'currency',
                subtype: 'COMBINED_CURRENCY',
                iconId: iconId,
                imageUrl: `${WOW_ICON_BASE_URL}${iconId}.jpg`,
                currencyType: primaryType,
                currencyValue: currencyValue,
                isCurrency: true,
                value: currencyValue,
                width: 1,
                height: 1,
                rotation: 0
            };

            // Complete the operation
            onComplete(currencyItem);
        }
    };

    return ReactDOM.createPortal(
        <div className="pf-modal-backdrop" style={{ zIndex: 9999999999 }}>
            <div ref={modalRef} className="pf-currency-withdraw-modal" style={{ zIndex: 9999999999 }}>
                <div className="pf-modal-header">
                    <h3>Generate Coins</h3>
                    <button className="pf-close-button" onClick={onClose}>×</button>
                </div>
                <div className="pf-modal-content">
                    <div className="pf-currency-input-section">
                        <label htmlFor="currency-input" className="pf-input-label">Amount to generate:</label>
                        <input
                            id="currency-input"
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Format: 1g 5s 20c (max: 999999 each)"
                            className="pf-currency-text-input"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            maxLength={50}
                        />

                        {isValid && (
                            <div className="pf-parsed-values">
                                <span>Will generate: </span>
                                {parsedValues.gold > 0 && <span className="pf-gold-text">{parsedValues.gold}g </span>}
                                {parsedValues.silver > 0 && <span className="pf-silver-text">{parsedValues.silver}s </span>}
                                {parsedValues.copper > 0 && <span className="pf-copper-text">{parsedValues.copper}c</span>}
                            </div>
                        )}

                        {error && <div className="pf-error-message">{error}</div>}
                    </div>
                </div>
                <div className="pf-modal-footer">
                    <button className="pf-button pf-button-secondary" onClick={onClose}>Cancel</button>
                    <button
                        className="pf-button pf-button-primary"
                        onClick={handleGenerate}
                        disabled={!isValid}
                    >
                        Generate
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ManualCoinGenerationModal;
