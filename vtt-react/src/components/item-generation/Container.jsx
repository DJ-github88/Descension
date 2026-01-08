import React, { useState, useRef, useEffect } from 'react';
import useContainerStore from '../../store/containerStore';
import useItemStore from '../../store/itemStore';
import { getIconUrl } from '../../utils/assetManager';
import '../../styles/container.css';

const Container = ({ container }) => {
    const { toggleLock, toggleOpen, removeContainer, updateContainerPosition } = useContainerStore();
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging && containerRef.current) {
                const newPosition = {
                    x: e.clientX - dragOffset.x,
                    y: e.clientY - dragOffset.y
                };
                updateContainerPosition(container.id, newPosition);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset, container.id, updateContainerPosition]);

    const handleMouseDown = (e) => {
        if (e.target === containerRef.current) {
            setIsDragging(true);
            const rect = containerRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };

    const renderGrid = () => {
        const grid = [];
        const gridSize = container.containerProperties?.gridSize || { rows: 4, cols: 6 };

        for (let row = 0; row < gridSize.rows; row++) {
            const rowSlots = [];
            for (let col = 0; col < gridSize.cols; col++) {
                const item = container.items.find(
                    item => item.position.row === row && item.position.col === col
                );

                rowSlots.push(
                    <div
                        key={`${row}-${col}`}
                        className="container-slot"
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            try {
                                const dataText = e.dataTransfer.getData('text/plain');
                                if (dataText && dataText.trim() !== '') {
                                    const itemData = JSON.parse(dataText);
                                    // Handle item drop logic here
                                    console.log('Item dropped:', itemData);
                                }
                            } catch (error) {
                                console.error('Error handling drop:', error);
                            }
                        }}
                    >
                        {item && (
                            <div
                                className="container-item"
                                draggable
                                onDragStart={(e) => {
                                    e.dataTransfer.setData('text/plain', JSON.stringify(item));
                                }}
                            >
                                <img
                                    src={item.imageUrl || `getIconUrl('${item.iconId}', 'items')`}
                                    alt={item.name}
                                    onError={(e) => {
                                        e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                                    }}
                                />
                            </div>
                        )}
                    </div>
                );
            }
            grid.push(
                <div key={row} className="container-row">
                    {rowSlots}
                </div>
            );
        }
        return grid;
    };

    return (
        <div
            ref={containerRef}
            className="container-window"
            style={{
                left: container.position.x,
                top: container.position.y
            }}
            onMouseDown={handleMouseDown}
        >
            <div className="container-header">
                <span>{container.name}</span>
                <div className="container-controls">
                    <button
                        className={`container-button ${container.isLocked ? 'locked' : ''}`}
                        onClick={() => toggleLock(container.id)}
                    >
                        {container.isLocked ? '🔒' : '🔓'}
                    </button>
                    <button
                        className="container-button"
                        onClick={() => toggleOpen(container.id)}
                        disabled={container.isLocked}
                    >
                        {container.isOpen ? '📦' : '📭'}
                    </button>
                    <button
                        className="container-button"
                        onClick={() => removeContainer(container.id)}
                    >
                        ❌
                    </button>
                </div>
            </div>
            {container.isOpen && (
                <div className="container-grid">
                    {renderGrid()}
                </div>
            )}
        </div>
    );
};

export default Container;
