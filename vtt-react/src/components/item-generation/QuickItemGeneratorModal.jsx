import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useGameStore from '../../store/gameStore';
import EnhancedQuickItemWizard from './EnhancedQuickItemWizard';
import '../../styles/quick-item-generator-modal.css';

const QuickItemGeneratorModal = ({ onComplete, onCancel }) => {
    const windowScale = useGameStore(state => state.windowScale);
    const [position, setPosition] = useState(null); // Start with null to use CSS centering
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [hasBeenDragged, setHasBeenDragged] = useState(false); // Track if modal has been dragged
    const [forceRender, setForceRender] = useState(0);
    const [rarityInfo, setRarityInfo] = useState({
        rarity: 'uncommon',
        colors: { border: '#b8860b', text: '#daa520', glow: 'rgba(184, 134, 11, 0.3)' }
    });
    const modalRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging && modalRef.current) {
                const newX = e.clientX - dragOffset.x;
                const newY = e.clientY - dragOffset.y;

                const padding = 50;
                const modalWidth = modalRef.current.offsetWidth;
                const modalHeight = modalRef.current.offsetHeight;
                const maxX = window.innerWidth - modalWidth + padding;
                const maxY = window.innerHeight - modalHeight + padding;

                setPosition({
                    x: Math.max(-padding, Math.min(newX, maxX)),
                    y: Math.max(-padding, Math.min(newY, maxY))
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.body.style.cursor = 'default';
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'move';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'default';
        };
    }, [isDragging, dragOffset]);

    const handleHeaderMouseDown = (e) => {
        // Only allow dragging from the header, not the close button
        if (e.target.closest('.close-button')) {
            return;
        }

        const rect = modalRef.current.getBoundingClientRect();

        // If this is the first drag, set initial position based on current location
        if (!hasBeenDragged) {
            setPosition({
                x: rect.left,
                y: rect.top
            });
            setHasBeenDragged(true);
        }

        setIsDragging(true);
        setDragOffset({
            x: e.clientX - (position?.x || rect.left),
            y: e.clientY - (position?.y || rect.top)
        });
        e.preventDefault();
        e.stopPropagation();
    };

    const handleBackdropClick = (e) => {
        // Only close if clicking directly on the backdrop, not on any child elements
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    const handleModalClick = (e) => {
        // Prevent clicks inside the modal from bubbling up to the backdrop
        e.stopPropagation();
    };

    const handleRarityChange = (newRarityInfo) => {
        setRarityInfo(newRarityInfo);
    };

    // Listen for window scale changes to force re-render
    useEffect(() => {
        const handleWindowScaleChange = () => {
            setForceRender(prev => prev + 1);
        };

        window.addEventListener('windowScaleChanged', handleWindowScaleChange);
        return () => window.removeEventListener('windowScaleChanged', handleWindowScaleChange);
    }, []);

    // Add safety check for document.body in production
    const portalTarget = document.body || document.getElementById('root') || document.documentElement;

    return createPortal(
        <div className="quick-item-generator-overlay" onClick={handleBackdropClick}>
            <div
                ref={modalRef}
                className="quick-item-generator-modal"
                onClick={handleModalClick}
                style={position ? {
                    position: 'absolute',
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transformOrigin: 'top left',
                    transform: windowScale !== 1 ? `scale(${windowScale})` : undefined
                } : {
                    transformOrigin: 'center center',
                    transform: windowScale !== 1 ? `scale(${windowScale})` : undefined
                }}
            >
                <div className="modal-header" onMouseDown={handleHeaderMouseDown}>
                    <h2>Quick Item Generator</h2>
                    <button className="close-button" onClick={onCancel}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="modal-content">
                    <EnhancedQuickItemWizard
                        onComplete={onComplete}
                        onCancel={onCancel}
                        onRarityChange={handleRarityChange}
                    />
                </div>
            </div>
        </div>,
        portalTarget
    );
};

export default QuickItemGeneratorModal;
