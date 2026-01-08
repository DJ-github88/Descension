import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/quantity-selector.css';

const QuantitySelector = ({
    quantity,
    onQuantityChange,
    maxQuantity = 99,
    showTrigger = true,
    triggerClassName = '',
    triggerStyle = {},
    modalPosition = 'center'
}) => {
    const [showQuantityPopup, setShowQuantityPopup] = useState(false);

    // Quick quantity shortcuts
    const quickQuantities = [1, 5, 10, 20, 50, 99];

    const handleQuantityClick = (newQuantity) => {
        const clampedQuantity = Math.max(1, Math.min(maxQuantity, newQuantity));
        onQuantityChange(clampedQuantity);
        setShowQuantityPopup(false);
    };

    const toggleQuantityPopup = (e) => {
        if (e) e.stopPropagation();
        setShowQuantityPopup(!showQuantityPopup);
    };

    return (
        <>
            {showTrigger && (
                <div
                    className={`quantity-selector-trigger ${triggerClassName}`}
                    onClick={toggleQuantityPopup}
                    style={triggerStyle}
                    title={`Quantity: ${quantity} - Click to change`}
                >
                    {quantity}
                </div>
            )}

            {/* Quantity Modal */}
            {showQuantityPopup && createPortal(
                <div className="quantity-modal-container">
                    {/* Modal Backdrop */}
                    <div
                        className="quantity-modal-backdrop"
                        onClick={() => setShowQuantityPopup(false)}
                    />

                    {/* Modal Content */}
                    <div className={`quantity-modal ${modalPosition === 'center' ? 'centered' : ''}`}>
                        <div className="quantity-modal-header">
                            <h3>Set Quantity</h3>
                            <button
                                className="quantity-modal-close"
                                onClick={() => setShowQuantityPopup(false)}
                                title="Close"
                            >
                                ×
                            </button>
                        </div>

                        <div className="quantity-modal-content">
                            <div className="quantity-grid">
                                {quickQuantities.map(qty => (
                                    <button
                                        key={qty}
                                        className={`quantity-option ${quantity === qty ? 'active' : ''} ${qty > maxQuantity ? 'disabled' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (qty <= maxQuantity) {
                                                handleQuantityClick(qty);
                                            }
                                        }}
                                        disabled={qty > maxQuantity}
                                    >
                                        {qty}
                                    </button>
                                ))}
                            </div>

                            <div className="quantity-custom-section">
                                <label>Custom Quantity:</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={maxQuantity}
                                    value={quantity}
                                    onChange={(e) => {
                                        const newQuantity = Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1));
                                        onQuantityChange(newQuantity);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    placeholder="Enter quantity"
                                />
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default QuantitySelector;
