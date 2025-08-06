import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ItemTooltip from './ItemTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import { RARITY_COLORS } from '../../constants/itemConstants';
import '../../styles/item-card.css';

const getQualityColor = (quality) => {
    const qualityLower = quality?.toLowerCase() || 'common';
    return RARITY_COLORS[qualityLower]?.text || RARITY_COLORS.common.text;
};

const ItemCard = ({ item, onClick, onContextMenu, isSelected, onDragOver, onDrop }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);

    // State to track if we're currently dragging
    const [isDragging, setIsDragging] = useState(false);

    // State for quantity (for stackable items)
    const [quantity, setQuantity] = useState(item.quantity || 1);

    // Check drag support on mount (for production debugging)
    useEffect(() => {
        if (process.env.NODE_ENV === 'production' && cardRef.current) {
            const element = cardRef.current;
            const isDraggable = element.draggable;
            const hasDataTransfer = 'DataTransfer' in window;
            const hasDragEvents = 'ondragstart' in element;

            console.log('🎯 Drag support check:', {
                itemName: item.name,
                isDraggable,
                hasDataTransfer,
                hasDragEvents,
                userAgent: navigator.userAgent
            });
        }
    }, [item.name]);

    // Simple tooltip handlers (matching character sheet pattern)
    const handleMouseEnter = (e) => {
        if (!isDragging) {
            setShowTooltip(true);
            setTooltipPosition({
                x: e.clientX + 15,
                y: e.clientY - 10
            });
        }
    };

    const handleMouseMove = (e) => {
        if (showTooltip && !isDragging) {
            setTooltipPosition({
                x: e.clientX + 15,
                y: e.clientY - 10
            });
        }
    };

    const handleMouseLeave = () => {
        if (!isDragging) {
            setShowTooltip(false);
        }
    };

    const handleDragStart = (e) => {
        // Debug logging for production troubleshooting
        if (process.env.NODE_ENV === 'production') {
            console.log('🎯 Production drag start:', item.name, {
                dataTransfer: !!e.dataTransfer,
                setData: typeof e.dataTransfer?.setData,
                effectAllowed: typeof e.dataTransfer?.effectAllowed
            });
        }

        setIsDragging(true);
        setShowTooltip(false); // Hide tooltip when dragging starts

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
                console.log('🎯 Production drag data set successfully');
            }
        } catch (error) {
            console.error('Error in handleDragStart:', error);
        }
    };

    // Handle drag end to clean up any visual feedback
    const handleDragEnd = () => {
        setIsDragging(false);

        // Remove container-drag-over class from all item cards
        document.querySelectorAll('.item-card').forEach(card => {
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
                </div>
                <div className="item-name" style={{ color: getQualityColor(item.quality) }}>
                    {item.name}
                </div>

                {/* Quantity selector for selected items */}
                {isSelected && (item.type === 'consumable' || item.type === 'miscellaneous') && (
                    <div className="item-quantity-selector" style={{
                        position: 'absolute',
                        bottom: '4px',
                        right: '4px',
                        background: 'rgba(0, 0, 0, 0.8)',
                        borderRadius: '3px',
                        padding: '2px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        <span style={{ color: 'white', fontSize: '10px' }}>Qty:</span>
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
                            style={{
                                width: '30px',
                                height: '16px',
                                fontSize: '10px',
                                textAlign: 'center',
                                border: '1px solid #666',
                                borderRadius: '2px',
                                background: '#333',
                                color: 'white'
                            }}
                        />
                    </div>
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

export default ItemCard;
