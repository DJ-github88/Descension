/**
 * Image Editor Component
 * 
 * Allows users to resize, rotate, and reposition character images
 */

import React, { useState, useEffect } from 'react';

const ImageEditor = ({ isOpen, onClose, imageUrl, onApply, initialTransformations = {} }) => {
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [positionX, setPositionX] = useState(0);
    const [positionY, setPositionY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Initialize with existing transformations when modal opens
    useEffect(() => {
        if (isOpen) {
            setScale(initialTransformations.scale || 1);
            setRotation(initialTransformations.rotation || 0);
            setPositionX(initialTransformations.positionX || 0);
            setPositionY(initialTransformations.positionY || 0);
        }
    }, [isOpen, initialTransformations]);

    const handleReset = () => {
        setScale(1);
        setRotation(0);
        setPositionX(0);
        setPositionY(0);
    };

    const handleApply = () => {
        const transformations = {
            scale,
            rotation,
            positionX,
            positionY
        };
        onApply(transformations);
        onClose();
    };

    // Drag handlers for image positioning (mouse and touch)
    const handleStart = (clientX, clientY) => {
        setIsDragging(true);
        setDragStart({
            x: clientX - positionX,
            y: clientY - positionY
        });
    };

    const handleMove = (clientX, clientY) => {
        if (!isDragging) return;

        const newX = clientX - dragStart.x;
        const newY = clientY - dragStart.y;

        // Constrain movement within reasonable bounds
        const maxOffset = 100;
        setPositionX(Math.max(-maxOffset, Math.min(maxOffset, newX)));
        setPositionY(Math.max(-maxOffset, Math.min(maxOffset, newY)));
    };

    const handleEnd = () => {
        setIsDragging(false);
    };

    // Mouse event handlers
    const handleMouseDown = (e) => {
        handleStart(e.clientX, e.clientY);
        e.preventDefault();
    };

    const handleMouseMove = (e) => {
        handleMove(e.clientX, e.clientY);
    };

    // Touch event handlers
    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        handleStart(touch.clientX, touch.clientY);
        e.preventDefault();
    };

    const handleTouchMove = (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            handleMove(touch.clientX, touch.clientY);
        }
    };

    // Add global event listeners for dragging
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleEnd);
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleEnd);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleEnd);
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleEnd);
            };
        }
    }, [isDragging, dragStart]);

    const handleCenterImage = () => {
        setPositionX(0);
        setPositionY(0);
    };

    const getImageStyle = () => ({
        transform: `scale(${scale}) rotate(${rotation}deg) translate(${positionX}px, ${positionY}px)`,
        cursor: isDragging ? 'grabbing' : 'grab'
    });

    if (!isOpen) return null;

    return (
        <div className="image-editor-modal" onClick={onClose}>
            <div className="image-editor-content" onClick={(e) => e.stopPropagation()}>
                <div className="image-editor-header">
                    <h3 className="image-editor-title">Edit Character Image</h3>
                    <button className="close-editor-btn" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="image-editor-preview">
                    <div className="image-preview-container">
                        <img
                            src={imageUrl}
                            alt="Character preview"
                            className="image-preview"
                            style={getImageStyle()}
                            onMouseDown={handleMouseDown}
                            onTouchStart={handleTouchStart}
                            draggable={false}
                        />
                    </div>
                    <div className="drag-instructions">
                        <i className="fas fa-hand-paper"></i>
                        <span>Drag image to reposition</span>
                    </div>
                </div>

                <div className="image-editor-controls">
                    {/* Scale Control */}
                    <div className="control-group">
                        <label className="control-label">Size</label>
                        <div className="control-row">
                            <input
                                type="range"
                                min="0.5"
                                max="3"
                                step="0.1"
                                value={scale}
                                onChange={(e) => setScale(parseFloat(e.target.value))}
                                className="control-slider"
                            />
                            <span className="control-value">{Math.round(scale * 100)}%</span>
                        </div>
                    </div>

                    {/* Rotation Control */}
                    <div className="control-group">
                        <label className="control-label">Rotation</label>
                        <div className="control-row">
                            <input
                                type="range"
                                min="-180"
                                max="180"
                                step="5"
                                value={rotation}
                                onChange={(e) => setRotation(parseInt(e.target.value))}
                                className="control-slider"
                            />
                            <span className="control-value">{rotation}°</span>
                        </div>
                    </div>

                    {/* Position Controls */}
                    <div className="control-group">
                        <label className="control-label">Position</label>
                        <div className="center-control">
                            <button
                                className="center-btn"
                                onClick={handleCenterImage}
                            >
                                <i className="fas fa-crosshairs"></i>
                                Center Image
                            </button>
                        </div>
                    </div>
                </div>

                <div className="editor-actions">
                    <button className="reset-btn" onClick={handleReset}>
                        <i className="fas fa-undo"></i> Reset
                    </button>
                    <button className="apply-btn" onClick={handleApply}>
                        <i className="fas fa-check"></i> Apply Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageEditor;
