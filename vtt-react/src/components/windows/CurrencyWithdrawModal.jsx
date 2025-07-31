import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import useInventoryStore from '../../store/inventoryStore';
import useItemStore from '../../store/itemStore';
import { WOW_ICON_BASE_URL } from '../item-generation/wowIcons';
import { CURRENCY_TYPES } from '../item-generation/itemConstants';
import '../../styles/currency-withdraw-modal.css';

const CurrencyWithdrawModal = ({ currencyType, onClose }) => {
    const { currency, updateCurrency, addItemFromLibrary } = useInventoryStore();
    const modalRef = useRef(null);
    const [amount, setAmount] = useState(1);
    const [error, setError] = useState('');
    const maxAmount = currency[currencyType] || 0;

    // Get currency icon and label
    const getCurrencyIcon = () => {
        switch (currencyType) {
            case 'gold':
                return 'inv_misc_coin_01';
            case 'silver':
                return 'inv_misc_coin_03';
            case 'copper':
                return 'inv_misc_coin_05';
            default:
                return 'inv_misc_coin_01';
        }
    };

    const getCurrencyLabel = () => {
        return currencyType.charAt(0).toUpperCase() + currencyType.slice(1);
    };

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

    // Handle amount change
    const handleAmountChange = (e) => {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
            setAmount(1);
        } else if (value > maxAmount) {
            setAmount(maxAmount);
        } else {
            setAmount(value);
        }
        setError('');
    };

    // Handle withdraw
    const handleWithdraw = () => {
        if (amount <= 0) {
            setError('Amount must be greater than 0');
            return;
        }

        if (amount > maxAmount) {
            setError(`You only have ${maxAmount} ${currencyType}`);
            return;
        }

        // Create a currency item
        const currencyItem = createCurrencyItem(currencyType, amount);

        // Add the item to inventory
        addItemFromLibrary(currencyItem);

        // Deduct the currency
        updateCurrency({
            [currencyType]: currency[currencyType] - amount
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

        // Create a value object with the appropriate currency type
        const valueObj = { gold: 0, silver: 0, copper: 0 };
        valueObj[type] = value;

        console.log("Creating currency item:", {
            type,
            value,
            currencyKey,
            displayName,
            valueObj
        });

        return {
            id: crypto.randomUUID(),
            name: displayName,
            quality: 'common',
            description: `${displayName} that can be spent or traded.`,
            type: 'currency',
            subtype: currencyKey,
            iconId: getCurrencyIcon(),
            imageUrl: `${WOW_ICON_BASE_URL}${getCurrencyIcon()}.jpg`,
            currencyType: type,
            currencyValue: valueObj, // Use the value object instead of just the number
            isCurrency: true,
            value: valueObj,
            width: 1,
            height: 1,
            rotation: 0
        };
    };

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div ref={modalRef} className="currency-withdraw-modal">
                <div className="modal-header">
                    <h3>Withdraw {getCurrencyLabel()}</h3>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="modal-content">
                    <div className="currency-info">
                        <img
                            src={`${WOW_ICON_BASE_URL}${getCurrencyIcon()}.jpg`}
                            alt={getCurrencyLabel()}
                            className="currency-icon"
                        />
                        <div className="currency-details">
                            <div className="currency-name">{getCurrencyLabel()}</div>
                            <div className="currency-available">Available: {maxAmount}</div>
                        </div>
                    </div>

                    <div className="amount-control">
                        <label htmlFor="amount">Amount to withdraw:</label>
                        <div className="amount-input-wrapper">
                            <button
                                className="amount-button"
                                onClick={() => setAmount(prev => Math.max(1, prev - 1))}
                                disabled={amount <= 1}
                            >-</button>
                            <input
                                id="amount"
                                type="number"
                                min="1"
                                max={maxAmount}
                                value={amount}
                                onChange={handleAmountChange}
                            />
                            <button
                                className="amount-button"
                                onClick={() => setAmount(prev => Math.min(maxAmount, prev + 1))}
                                disabled={amount >= maxAmount}
                            >+</button>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                </div>
                <div className="modal-footer">
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                    <button
                        className="withdraw-button"
                        onClick={handleWithdraw}
                        disabled={amount <= 0 || amount > maxAmount}
                    >
                        Withdraw
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CurrencyWithdrawModal;
