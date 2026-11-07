import React, { useState, useRef, useEffect, useLayoutEffect, memo, Suspense, lazy } from 'react';
import { createPortal } from 'react-dom';
import QuantitySelector from '../common/QuantitySelector';
import { RARITY_COLORS } from '../../constants/itemConstants';
import { getIconUrl } from '../../utils/assetManager';
import { setOrbDragImage } from '../../utils/itemDragUtils';


const LazyItemTooltip = lazy(() => import('./ItemTooltip'));

const getQualityColor = (quality) => {
    const qualityLower = quality?.toLowerCase() || 'common';
    return RARITY_COLORS[qualityLower]?.text || RARITY_COLORS.common.text;
};

const getQualityBorderColor = (quality) => {
    const qualityLower = quality?.toLowerCase() || 'common';
    return RARITY_COLORS[qualityLower]?.border || RARITY_COLORS.common.border;
};

const getDiceValue = (die) => {
    if (!die) return 0;
    if (typeof die === 'number') return die;
    const dieLower = String(die).toLowerCase();
    if (dieLower === 'broken' || dieLower === '0') return 0;
    const match = dieLower.match(/^d(\d+)$/);
    if (match) return parseInt(match[1], 10);
    return parseInt(dieLower, 10) || 0;
};

const ItemCard = ({ item, onClick, onContextMenu, isSelected, onDragOver, onDrop }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);
    const tooltipRef = useRef(null);
    const tooltipDelayRef = useRef(null);
    const [quantity, setQuantity] = useState(item.quantity || 1);

    const computeTooltipPosition = () => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const tooltip = tooltipRef.current;
        const targetEl = tooltip?.firstElementChild || tooltip;
        const tooltipRect = targetEl ? targetEl.getBoundingClientRect() : null;
        const tooltipWidth = (tooltipRect && tooltipRect.width > 0) ? tooltipRect.width : 320;
        const tooltipHeight = (tooltipRect && tooltipRect.height > 0) ? tooltipRect.height : 460;
        const GAP = 10;
        const pad = 12;

        let x = rect.right + GAP;
        if (x + tooltipWidth > window.innerWidth - pad) {
            x = rect.left - tooltipWidth - GAP;
        }
        if (x < pad) {
            x = pad;
        }

        let y = rect.top;
        if (y + tooltipHeight > window.innerHeight - pad) {
            y = Math.max(pad, window.innerHeight - tooltipHeight - pad);
        }
        if (y < pad) {
            y = pad;
        }

        setTooltipPos({ x, y });
    };

    useLayoutEffect(() => {
        if (!showTooltip) return;
        computeTooltipPosition();
        const raf = requestAnimationFrame(computeTooltipPosition);
        return () => cancelAnimationFrame(raf);
    }, [showTooltip]);

    const handleMouseEnter = () => {
        if (window.isDraggingItem) return;
        if (tooltipDelayRef.current) {
            clearTimeout(tooltipDelayRef.current);
        }

        tooltipDelayRef.current = setTimeout(() => {
            if (window.isDraggingItem) return;
            computeTooltipPosition();
            setShowTooltip(true);
        }, 300);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
        if (tooltipDelayRef.current) {
            clearTimeout(tooltipDelayRef.current);
            tooltipDelayRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            if (tooltipDelayRef.current) {
                clearTimeout(tooltipDelayRef.current);
            }
        };
    }, []);

    const handleDragStart = (e) => {
        e.stopPropagation();

        document.body.classList.add('dragging');
        setShowTooltip(false);

        if (tooltipDelayRef.current) {
            clearTimeout(tooltipDelayRef.current);
            tooltipDelayRef.current = null;
        }

        try {
            if (!e.dataTransfer) return;

            const dragData = {
                type: 'item',
                id: item.id,
                item: { ...item, quantity }
            };

            e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
            e.dataTransfer.effectAllowed = 'copy';
            window.isDraggingItem = true;
            window.draggedItemInfo = {
                item,
                width: item.width || 1,
                height: item.height || 1,
                rotation: item.rotation || 0
            };

            // Immediately become an orb in the drag seamlessly
            setOrbDragImage(e, item, {
                sourceElement: cardRef.current,
                quantity: quantity
            });
        } catch (error) {
            console.error('Error in handleDragStart:', error);
        }
    };

    const handleDragEnd = () => {
        document.body.classList.remove('dragging');
        window.isDraggingItem = false;
        window.draggedItemInfo = null;

        const dragOverCards = document.getElementsByClassName('container-drag-over');
        Array.from(dragOverCards).forEach(card => {
            card.classList.remove('container-drag-over');
        });
    };



    return (
        <>
            <div
                ref={cardRef}
                className={`item-card ${isSelected ? 'selected' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`Inspect ${item.name}`}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(e, item); } }}
                style={{ borderColor: getQualityBorderColor(item.quality) }}
                onClick={(e) => onClick?.(e, item)}
                onContextMenu={(e) => {
                    e.preventDefault();
                    onContextMenu?.(e, item);
                }}
                onMouseEnter={handleMouseEnter}
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
                        (() => {
                            const curVal = getDiceValue(item.durability ?? item.maxDurability);
                            const maxVal = getDiceValue(item.maxDurability);
                            const ratio = maxVal > 0 ? curVal / maxVal : 0;
                            return (
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
                                        width: `${ratio * 100}%`,
                                        height: '100%',
                                        background: curVal === 0 ? '#ff0000' :
                                                    ratio <= 0.25 ? '#ff4444' :
                                                    ratio <= 0.50 ? '#ffaa00' : '#44ff44'
                                    }} />
                                </div>
                            );
                        })()
                    )}
                    {(item.broken || (['weapon', 'armor', 'accessory'].includes(item.type) && (item.durability === 0 || item.durability === 'broken' || getDiceValue(item.durability) === 0))) && (
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
            {showTooltip && createPortal(
                <div
                    ref={tooltipRef}
                    style={{
                        position: 'fixed',
                        left: tooltipPos.x,
                        top: tooltipPos.y,
                        maxHeight: 'calc(100vh - 24px)',
                        overflowY: 'auto',
                        pointerEvents: 'none',
                        zIndex: 999999999
                    }}
                >
                    <Suspense fallback={null}>
                        <LazyItemTooltip item={item} />
                    </Suspense>
                </div>,
                document.body
            )}
        </>
    );
};

export default memo(ItemCard);
