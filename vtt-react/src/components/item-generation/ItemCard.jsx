import React, { useState, useRef, useEffect, memo, Suspense, lazy } from 'react';
import { createPortal } from 'react-dom';
import TooltipPortal from '../tooltips/TooltipPortal';
import QuantitySelector from '../common/QuantitySelector';
import { RARITY_COLORS } from '../../constants/itemConstants';
import { getIconUrl } from '../../utils/assetManager';


const LazyItemTooltip = lazy(() => import('./ItemTooltip'));

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
            }, 300); // 300ms delay
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


            // Create a custom drag image that shows the actual ItemCard (orb)
            if (e.dataTransfer.setDragImage) {
                try {
                    // Create a temporary div that mimics the ItemCard appearance
                    const dragImage = document.createElement('div');
                    dragImage.style.cssText = `
                        position: absolute;
                        top: -1000px;
                        left: -1000px;
                        width: 60px;
                        height: 80px;
                        background-color: rgba(255, 255, 255, 0.9);
                        border: 2px solid ${getQualityColor(item.quality)};
                        border-radius: 6px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: 5px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                        font-family: 'Bookman Old Style', 'Garamond', serif;
                        z-index: -1;
                    `;

                    // Add the icon
                    const iconDiv = document.createElement('div');
                    iconDiv.style.cssText = `
                        width: 40px;
                        height: 40px;
                        border-radius: 4px;
                        overflow: hidden;
                        margin-bottom: 5px;
                        border: 1px solid #d5cbb0;
                        background-color: transparent;
                    `;

                    const iconImg = document.createElement('img');
                    iconImg.src = (item.imageUrl && !item.imageUrl.includes('wow.zamimg.com')) ? item.imageUrl : (item.iconId ? getIconUrl(item.iconId, 'items', true) : getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items', true));
                    iconImg.style.cssText = `
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    `;
                    iconImg.onerror = () => {
                        iconImg.onerror = null; // Prevent infinite loop
                        iconImg.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items', true);
                    };

                    iconDiv.appendChild(iconImg);
                    dragImage.appendChild(iconDiv);

                    // Add the item name
                    const nameDiv = document.createElement('div');
                    nameDiv.style.cssText = `
                        font-size: 10px;
                        text-align: center;
                        width: 100%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: ${getQualityColor(item.quality)};
                        font-family: 'Bookman Old Style', 'Garamond', serif;
                    `;
                    nameDiv.textContent = item.name;
                    dragImage.appendChild(nameDiv);

                    // Add to DOM temporarily
                    document.body.appendChild(dragImage);

                    // Use as drag image (centered on the item icon at the top)
                    e.dataTransfer.setDragImage(dragImage, 30, 25);

                    // Clean up after drag starts (slight delay to ensure it's used)
                    setTimeout(() => {
                        if (document.body.contains(dragImage)) {
                            document.body.removeChild(dragImage);
                        }
                    }, 0);
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
                onClick={(e) => onClick?.(e, item)}
                onContextMenu={(e) => {
                    e.preventDefault();
                    onContextMenu?.(e, item);
                }}
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
                        src={(item.imageUrl && !item.imageUrl.includes('wow.zamimg.com')) ? item.imageUrl : (item.iconId ? getIconUrl(item.iconId, 'items', true) : getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items', true))}
                        alt={item.name}
                        draggable={false}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items', true);
                        }}
                        onDragStart={(e) => e.preventDefault()}
                    />
                    {['weapon', 'armor', 'accessory'].includes(item.type) && item.maxDurability != null && (
                        <div style={{
                            position: 'absolute',
                            bottom: '2px',
                            left: '2px',
                            right: '2px',
                            height: '3px',
                            background: '#1a0f0a',
                            borderRadius: '2px',
                            overflow: 'hidden',
                            opacity: 0.9
                        }}>
                            <div style={{
                                width: `${((item.durability ?? item.maxDurability) / item.maxDurability) * 100}%`,
                                height: '100%',
                                background: (item.durability ?? item.maxDurability) === 0 ? '#ff0000' :
                                            (item.durability ?? item.maxDurability) / item.maxDurability <= 0.25 ? '#ff4444' :
                                            (item.durability ?? item.maxDurability) / item.maxDurability <= 0.50 ? '#ffaa00' : '#44ff44'
                            }} />
                        </div>
                    )}
                    {(item.broken || (['weapon', 'armor', 'accessory'].includes(item.type) && item.durability === 0)) && (
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(139, 0, 0, 0.45)',
                            borderRadius: '4px',
                            pointerEvents: 'none'
                        }}>
                            <i className="fas fa-heart-broken" style={{ color: '#ff4444', fontSize: '20px', filter: 'drop-shadow(0 0 3px rgba(255,0,0,0.8))' }} />
                        </div>
                    )}
                    {/* Quantity selector on icon */}
                    {isSelected && (item.type === 'consumable' || item.type === 'miscellaneous') && (
                        <QuantitySelector
                            quantity={quantity}
                            onQuantityChange={setQuantity}
                            maxQuantity={99}
                            triggerClassName="item-quantity-circle"
                        />
                    )}
                </div>
                <div className="item-name" style={{ color: getQualityColor(item.quality) }}>
                    {item.name}
                </div>

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
                        <Suspense fallback={null}>
                            <LazyItemTooltip item={item} />
                        </Suspense>
                    </div>
                </TooltipPortal>
            )}
        </>
    );
};

export default memo(ItemCard);
