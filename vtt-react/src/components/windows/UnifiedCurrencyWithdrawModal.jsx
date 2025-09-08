import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import useInventoryStore from '../../store/inventoryStore';
import useItemStore from '../../store/itemStore';
import { WOW_ICON_BASE_URL } from '../item-generation/wowIcons';
import { CURRENCY_TYPES } from '../item-generation/itemConstants';
import '../../styles/currency-withdraw-modal.css';

const UnifiedCurrencyWithdrawModal = ({ onClose }) => {
    const { currency, updateCurrency, addItemFromLibrary } = useInventoryStore();
    const modalRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [parsedValues, setParsedValues] = useState({ platinum: 0, gold: 0, silver: 0, copper: 0 });
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
            setParsedValues({ platinum: 0, gold: 0, silver: 0, copper: 0 });
            setIsValid(false);
            setError('');
            return;
        }

        try {
            // Parse the input using regex
            const platinumMatch = inputValue.match(/(\d+)p/i);
            const goldMatch = inputValue.match(/(\d+)g/i);
            const silverMatch = inputValue.match(/(\d+)s/i);
            const copperMatch = inputValue.match(/(\d+)c/i);

            const platinum = platinumMatch ? parseInt(platinumMatch[1]) : 0;
            const gold = goldMatch ? parseInt(goldMatch[1]) : 0;
            const silver = silverMatch ? parseInt(silverMatch[1]) : 0;
            const copper = copperMatch ? parseInt(copperMatch[1]) : 0;

            // Set reasonable maximum limits
            const MAX_PLATINUM = 999999;
            const MAX_GOLD = 999999;
            const MAX_SILVER = 999999;
            const MAX_COPPER = 999999;

            // Validate the values
            if (platinum < 0 || gold < 0 || silver < 0 || copper < 0) {
                setError('Values cannot be negative');
                setIsValid(false);
                return;
            }

            if (platinum > MAX_PLATINUM || gold > MAX_GOLD || silver > MAX_SILVER || copper > MAX_COPPER) {
                setError(`Maximum values: ${MAX_PLATINUM}p ${MAX_GOLD}g ${MAX_SILVER}s ${MAX_COPPER}c`);
                setIsValid(false);
                return;
            }

            if (platinum === 0 && gold === 0 && silver === 0 && copper === 0) {
                setError('Please enter at least one currency value (format: 1p 5g 10s 20c)');
                setIsValid(false);
                return;
            }

            // Check for invalid format (numbers without currency letters)
            // This regex looks for numbers that are not part of a valid currency pattern
            const cleanInput = inputValue.replace(/\s/g, '');
            const validPattern = /^(\d+[pgsc])*$/i;
            if (!validPattern.test(cleanInput)) {
                setError('Use format: 1p 5g 10s 20c (numbers must be followed by p, g, s, or c)');
                setIsValid(false);
                return;
            }

            // Convert all currency to copper for comparison
            const totalRequestedInCopper = (platinum * 1000000) + (gold * 10000) + (silver * 100) + copper;
            const totalAvailableInCopper = (currency.platinum * 1000000) + (currency.gold * 10000) + (currency.silver * 100) + currency.copper;

            // Check if the user has enough total currency
            if (totalRequestedInCopper > totalAvailableInCopper) {
                setError(`You don't have enough currency. Available: ${currency.platinum}p ${currency.gold}g ${currency.silver}s ${currency.copper}c`);
                setIsValid(false);
                return;
            }

            // Set the parsed values
            setParsedValues({ platinum, gold, silver, copper });
            setIsValid(true);
            setError('');
        } catch (error) {
            console.error('Error parsing currency input:', error);
            setError('Invalid input format');
            setIsValid(false);
        }
    }, [inputValue, currency]);

    // Handle input change with validation
    const handleInputChange = (e) => {
        const value = e.target.value;

        // Only allow digits, letters p/g/s/c (case insensitive), and spaces
        const sanitizedValue = value.replace(/[^0-9pgscPGSC\s]/g, '');

        setInputValue(sanitizedValue);
    };

    // Handle withdraw
    const handleWithdraw = () => {
        if (!isValid) {
            return;
        }

        const { platinum, gold, silver, copper } = parsedValues;

        // Create a single combined currency item
        if (platinum > 0 || gold > 0 || silver > 0 || copper > 0) {
            // Calculate total value in copper for display
            const totalValueInCopper = (platinum * 1000000) + (gold * 10000) + (silver * 100) + copper;

            // Determine which icon to use based on the highest denomination
            let iconId, primaryType;
            if (platinum > 0) {
                iconId = 'inv_misc_coin_04';
                primaryType = 'platinum';
            } else if (gold > 0) {
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
            if (platinum > 0) displayName += `${platinum}p `;
            if (gold > 0) displayName += `${gold}g `;
            if (silver > 0) displayName += `${silver}s `;
            if (copper > 0) displayName += `${copper}c`;
            displayName = displayName.trim();

            // Create the combined currency item
            const currencyValue = {
                platinum: platinum,
                gold: gold,
                silver: silver,
                copper: copper
            };

            console.log("Creating combined currency item:", {
                displayName,
                primaryType,
                currencyValue
            });

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

            // Add the item to inventory
            addItemFromLibrary(currencyItem);
        }

        // Convert all currency to copper for calculation
        const totalRequestedInCopper = (platinum * 1000000) + (gold * 10000) + (silver * 100) + copper;
        const totalAvailableInCopper = (currency.platinum * 1000000) + (currency.gold * 10000) + (currency.silver * 100) + currency.copper;

        // Calculate remaining copper after withdrawal
        let remainingCopper = totalAvailableInCopper - totalRequestedInCopper;

        // Convert back to platinum, gold, silver, copper
        const newPlatinum = Math.floor(remainingCopper / 1000000);
        remainingCopper -= newPlatinum * 1000000;

        const newGold = Math.floor(remainingCopper / 10000);
        remainingCopper -= newGold * 10000;

        const newSilver = Math.floor(remainingCopper / 100);
        remainingCopper -= newSilver * 100;

        const newCopper = remainingCopper;

        // Update the currency with the new values
        updateCurrency({
            platinum: newPlatinum,
            gold: newGold,
            silver: newSilver,
            copper: newCopper
        });

        // Close the modal
        onClose();
    };

    // Create a currency item based on type and amount
    const createCurrencyItem = (type, value) => {
        // Determine which currency preset to use based on amount
        let currencyKey = '';
        let displayName = '';

        if (type === 'copper') {
            if (value <= 10) currencyKey = 'HANDFUL_OF_COINS';
            else currencyKey = 'SMALL_POUCH';
            displayName = value === 1 ? 'Copper Coin' : `${value} Copper Coins`;
        } else if (type === 'silver') {
            if (value <= 10) currencyKey = 'MODEST_SUM';
            else currencyKey = 'MERCHANT_PURSE';
            displayName = value === 1 ? 'Silver Coin' : `${value} Silver Coins`;
        } else { // gold
            if (value <= 5) currencyKey = 'ADVENTURER_EARNINGS';
            else if (value <= 10) currencyKey = 'NOBLE_PAYMENT';
            else currencyKey = 'ROYAL_BOUNTY';
            displayName = value === 1 ? 'Gold Coin' : `${value} Gold Coins`;
        }

        const currencyInfo = CURRENCY_TYPES[currencyKey] || CURRENCY_TYPES.HANDFUL_OF_COINS;
        const iconId = type === 'platinum' ? 'inv_misc_coin_04' :
                      type === 'gold' ? 'inv_misc_coin_01' :
                      type === 'silver' ? 'inv_misc_coin_03' : 'inv_misc_coin_05';

        return {
            id: crypto.randomUUID(),
            name: displayName,
            quality: 'common',
            description: `${displayName} that can be spent or traded.`,
            type: 'currency',
            subtype: currencyKey,
            iconId: iconId,
            imageUrl: `${WOW_ICON_BASE_URL}${iconId}.jpg`,
            currencyType: type,
            currencyValue: value,
            isCurrency: true,
            value: { [type]: value },
            width: 1,
            height: 1,
            rotation: 0
        };
    };

    return ReactDOM.createPortal(
        <div className="pf-modal-backdrop" style={{ zIndex: 9999999999 }}>
            <div ref={modalRef} className="pf-currency-withdraw-modal" style={{ zIndex: 9999999999 }}>
                <div className="pf-modal-header">
                    <h3>Withdraw Currency</h3>
                    <button className="pf-close-button" onClick={onClose}>×</button>
                </div>
                <div className="pf-modal-content">
                    <div className="pf-currency-available-section">
                        <div className="pf-currency-available-item">
                            <img
                                src={`${WOW_ICON_BASE_URL}inv_misc_coin_04.jpg`}
                                alt="Platinum"
                                className="pf-currency-icon"
                            />
                            <div className="pf-currency-available-value">
                                <span className="pf-currency-name">Platinum</span>
                                <span className="pf-currency-amount pf-platinum-text">{currency.platinum}</span>
                            </div>
                        </div>

                        <div className="pf-currency-available-item">
                            <img
                                src={`${WOW_ICON_BASE_URL}inv_misc_coin_01.jpg`}
                                alt="Gold"
                                className="pf-currency-icon"
                            />
                            <div className="pf-currency-available-value">
                                <span className="pf-currency-name">Gold</span>
                                <span className="pf-currency-amount pf-gold-text">{currency.gold}</span>
                            </div>
                        </div>

                        <div className="pf-currency-available-item">
                            <img
                                src={`${WOW_ICON_BASE_URL}inv_misc_coin_03.jpg`}
                                alt="Silver"
                                className="pf-currency-icon"
                            />
                            <div className="pf-currency-available-value">
                                <span className="pf-currency-name">Silver</span>
                                <span className="pf-currency-amount pf-silver-text">{currency.silver}</span>
                            </div>
                        </div>

                        <div className="pf-currency-available-item">
                            <img
                                src={`${WOW_ICON_BASE_URL}inv_misc_coin_05.jpg`}
                                alt="Copper"
                                className="pf-currency-icon"
                            />
                            <div className="pf-currency-available-value">
                                <span className="pf-currency-name">Copper</span>
                                <span className="pf-currency-amount pf-copper-text">{currency.copper}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pf-currency-input-section">
                        <label htmlFor="currency-input" className="pf-input-label">Amount to withdraw:</label>
                        <input
                            id="currency-input"
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Format: 1p 5g 10s 20c"
                            className="pf-currency-text-input"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            maxLength={50}
                        />

                        {isValid && (
                            <div className="pf-parsed-values">
                                <span>Will withdraw: </span>
                                {parsedValues.platinum > 0 && <span className="pf-platinum-text">{parsedValues.platinum}p </span>}
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
                        onClick={handleWithdraw}
                        disabled={!isValid}
                    >
                        Withdraw
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default UnifiedCurrencyWithdrawModal;
