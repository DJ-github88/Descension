import React, { useState, useRef, useEffect, memo } from 'react';
import { createPortal } from 'react-dom';
import ItemTooltip from './ItemTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import { RARITY_COLORS } from '../../constants/itemConstants';
import '../../styles/item-card.css';

const getQualityColor = (quality) => {
    const qualityLower = quality?.toLowerCase() || 'common';
    return RARITY_COLORS[qualityLower]?.text || RARITY_COLORS.common.text;
};

const ItemCard = ({ item, onClick, onContextMenu, isSelected, onDragOver, onDrop, isDraggingGlobal = false, onDragStartGlobal, onDragEndGlobal }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);

    // State to track if we're currently dragging
    const [isDragging, setIsDragging] = useState(false);

    // Animation frame ref for mouse move optimization
    const mouseMoveAnimationRef = useRef(null);

    // Tooltip delay timer to prevent rapid showing/hiding
    const tooltipDelayRef = useRef(null);

    // State for quantity (for stackable items)
    const [quantity, setQuantity] = useState(item.quantity || 1);
    const [showQuantityPopup, setShowQuantityPopup] = useState(false);

    // Quick quantity shortcuts
    const quickQuantities = [1, 5, 10, 20, 50, 99];

    const handleQuantityClick = (newQuantity) => {
        setQuantity(newQuantity);
        setShowQuantityPopup(false);
    };

    const toggleQuantityPopup = (e) => {
        if (e) e.stopPropagation();
        setShowQuantityPopup(!showQuantityPopup);
    };


    // Simple tooltip handlers (matching character sheet pattern) - optimized for drag performance
    const handleMouseEnter = (e) => {
        if (!isDraggingGlobal) {
            // Clear any existing delay
            if (tooltipDelayRef.current) {
                clearTimeout(tooltipDelayRef.current);
            }

            // Add delay before showing tooltip to prevent rapid showing/hiding
            tooltipDelayRef.current = setTimeout(() => {
                setShowTooltip(true);
                setTooltipPosition({
                    x: e.clientX + 15,
                    y: e.clientY - 10
                });
            }, 150); // 150ms delay
        }
    };

    const handleMouseMove = (e) => {
        if (showTooltip && !isDraggingGlobal) {
            // Use requestAnimationFrame for smoother performance
            if (mouseMoveAnimationRef.current) {
                cancelAnimationFrame(mouseMoveAnimationRef.current);
            }
            mouseMoveAnimationRef.current = requestAnimationFrame(() => {
                setTooltipPosition({
                    x: e.clientX + 15,
                    y: e.clientY - 10
                });
            });
        }
    };

    const handleMouseLeave = () => {
        if (!isDraggingGlobal) {
            setShowTooltip(false);
            // Clear any pending animation frame
            if (mouseMoveAnimationRef.current) {
                cancelAnimationFrame(mouseMoveAnimationRef.current);
                mouseMoveAnimationRef.current = null;
            }
            // Clear any pending tooltip delay
            if (tooltipDelayRef.current) {
                clearTimeout(tooltipDelayRef.current);
                tooltipDelayRef.current = null;
            }
        }
    };

    // Cleanup animation frame and tooltip delay on unmount
    useEffect(() => {
        return () => {
            if (mouseMoveAnimationRef.current) {
                cancelAnimationFrame(mouseMoveAnimationRef.current);
            }
            if (tooltipDelayRef.current) {
                clearTimeout(tooltipDelayRef.current);
            }
        };
    }, []);

    const handleDragStart = (e) => {
        // Prevent event bubbling to avoid window drag conflicts
        e.stopPropagation();

        // Add dragging class to body to disable transitions for better performance
        document.body.classList.add('dragging');

        setIsDragging(true);
        setShowTooltip(false); // Hide tooltip when dragging starts
        onDragStartGlobal?.(); // Notify parent of drag start

        // Clear any pending animation frame
        if (mouseMoveAnimationRef.current) {
            cancelAnimationFrame(mouseMoveAnimationRef.current);
            mouseMoveAnimationRef.current = null;
        }

        // Clear any pending tooltip delay
        if (tooltipDelayRef.current) {
            clearTimeout(tooltipDelayRef.current);
            tooltipDelayRef.current = null;
        }

        try {
            // Ensure dataTransfer exists
            if (!e.dataTransfer) {
                console.error('DataTransfer not available in drag event');
                return;
            }

            // Set the drag data with item information, including quantity if it exists
            const dragData = {
                type: 'item',
                id: item.id,
                // Include the full item data with current quantity
                item: { ...item, quantity: quantity }
            };

            const dragDataString = JSON.stringify(dragData);
            e.dataTransfer.setData('text/plain', dragDataString);

            // Set a global flag for Grid.jsx to detect item drags
            // This is needed because event bubbling might be blocked by window components
            window.isDraggingItem = true;

            // Store dragged item info globally for visual feedback in containers
            if (!window.draggedItemInfo) {
                window.draggedItemInfo = {};
            }
            window.draggedItemInfo = {
                item: item,
                width: item.width || 1,
                height: item.height || 1,
                rotation: item.rotation || 0
            };


            // Create a custom drag image if needed
            if (item.iconId && e.dataTransfer.setDragImage) {
                try {
                    const img = new Image();
                    img.src = `https://wow.zamimg.com/images/wow/icons/large/${item.iconId}.jpg`;
                    e.dataTransfer.setDragImage(img, 25, 25);
                } catch (imgError) {
                    console.warn('Failed to set custom drag image:', imgError);
                }
            }

            // Set the drag effect
            e.dataTransfer.effectAllowed = 'copy';

            if (process.env.NODE_ENV === 'production') {
            }
        } catch (error) {
            console.error('Error in handleDragStart:', error);
        }
    };

    // Handle drag end to clean up any visual feedback
    const handleDragEnd = () => {
        // Remove dragging class from body to re-enable transitions
        document.body.classList.remove('dragging');

        setIsDragging(false);
        window.isDraggingItem = false;
        onDragEndGlobal?.(); // Notify parent of drag end

        // Clear global drag state
        if (window.draggedItemInfo) {
            window.draggedItemInfo = null;
        }

        // Remove container-drag-over class from all item cards (optimized)
        // Use getElementsByClassName for better performance than querySelectorAll
        const dragOverCards = document.getElementsByClassName('container-drag-over');
        // Convert HTMLCollection to array to avoid issues during iteration
        Array.from(dragOverCards).forEach(card => {
            card.classList.remove('container-drag-over');
        });
    };



    return (
        <>
            <div
                ref={cardRef}
                className={`item-card ${isSelected ? 'selected' : ''}`}
                style={{ borderColor: getQualityColor(item.quality) }}
                onClick={onClick}
                onContextMenu={onContextMenu}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                draggable="true"
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={item.type === 'container' ? (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                    if (onDragOver) onDragOver(e, item);
                } : null}
                onDrop={item.type === 'container' ? (e) => {
                    e.preventDefault();
                    if (onDrop) onDrop(e, item);
                } : null}
            >
                <div className="item-icon">
                    <img
                        src={item.imageUrl || (item.iconId ? `https://wow.zamimg.com/images/wow/icons/large/${item.iconId}.jpg` : 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg')}
                        alt={item.name}
                        draggable={false}
                        onError={(e) => {
                            e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                        }}
                        onDragStart={(e) => e.preventDefault()}
                    />
                    {/* Quantity circle on icon */}
                    {isSelected && (item.type === 'consumable' || item.type === 'miscellaneous') && (
                        <div
                            className="item-quantity-circle"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleQuantityPopup();
                            }}
                            title={`Quantity: ${quantity} - Click to change`}
                        >
                            {quantity}
                        </div>
                    )}
                </div>
                <div className="item-name" style={{ color: getQualityColor(item.quality) }}>
                    {item.name}
                </div>

                {/* Quantity Modal */}
                {showQuantityPopup && createPortal(
                    <div className="quantity-modal-container">
                        {/* Modal Backdrop */}
                        <div
                            className="quantity-modal-backdrop"
                            onClick={() => setShowQuantityPopup(false)}
                        />

                        {/* Modal Content */}
                        <div className="quantity-modal">
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
                                            className={`quantity-option ${quantity === qty ? 'active' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleQuantityClick(qty);
                                            }}
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
                                        max="99"
                                        value={quantity}
                                        onChange={(e) => {
                                            const newQuantity = Math.max(1, Math.min(99, parseInt(e.target.value) || 1));
                                            setQuantity(newQuantity);
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
            </div>
            {showTooltip && (
                <TooltipPortal>
                    <div
                        style={{
                            position: 'fixed',
                            left: tooltipPosition.x,
                            top: tooltipPosition.y,
                            transform: 'translate(10px, -50%)',
                            pointerEvents: 'none',
                            zIndex: 999999999
                        }}
                    >
                        <ItemTooltip item={item} />
                    </div>
                </TooltipPortal>
            )}
        </>
    );
};

export default memo(ItemCard);
