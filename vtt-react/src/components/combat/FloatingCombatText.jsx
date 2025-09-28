import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
// REMOVED: import './FloatingCombatText.css'; // CAUSES CSS POLLUTION - loaded centrally

/**
 * Floating Combat Text Component
 * Displays damage, healing, and other combat feedback floating above tokens
 */
const FloatingCombatText = ({
    text,
    type = 'damage', // 'damage', 'heal', 'mana', 'mana-loss', 'ap', 'ap-loss'
    position,
    onComplete,
    duration = 2000
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [animationPhase, setAnimationPhase] = useState('enter');

    useEffect(() => {
        // Start fade out animation before completion
        const fadeTimer = setTimeout(() => {
            setAnimationPhase('exit');
        }, duration - 500);

        // Complete animation and cleanup
        const completeTimer = setTimeout(() => {
            setIsVisible(false);
            if (onComplete) {
                onComplete();
            }
        }, duration);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(completeTimer);
        };
    }, [duration, onComplete]);

    if (!isVisible) return null;

    const getTextColor = () => {
        switch (type) {
            case 'damage':
                return '#ff4444';
            case 'heal':
                return '#44ff44';
            case 'mana':
                return '#4444ff';
            case 'mana-loss':
                return '#ff4444'; // Red for mana loss
            case 'ap':
                return '#ff8800';
            case 'ap-loss':
                return '#ff4444'; // Red for AP loss
            default:
                return '#ffffff';
        }
    };

    const getPrefix = () => {
        switch (type) {
            case 'damage':
                return '-';
            case 'heal':
                return '+';
            case 'mana':
                return '+';
            case 'mana-loss':
                return '-';
            case 'ap':
                return '+';
            case 'ap-loss':
                return '-';
            default:
                return '';
        }
    };

    return createPortal(
        <div
            className={`floating-combat-text ${type} ${animationPhase}`}
            style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                color: getTextColor(),
                zIndex: 10000,
                pointerEvents: 'none',
                fontFamily: 'Cinzel, serif',
                fontSize: '18px',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                userSelect: 'none'
            }}
        >
            {getPrefix()}{text}
        </div>,
        document.body
    );
};

/**
 * Floating Combat Text Manager
 * Manages multiple floating text instances
 */
export const FloatingCombatTextManager = () => {
    const [activeTexts, setActiveTexts] = useState([]);

    // Function to add new floating text
    const addFloatingText = (text, type, position) => {
        const id = Date.now() + Math.random();
        const newText = {
            id,
            text,
            type,
            position: {
                x: position.x + (Math.random() - 0.5) * 40, // Add some randomness
                y: position.y - 20
            }
        };

        setActiveTexts(prev => [...prev, newText]);

        // Auto-remove after duration
        setTimeout(() => {
            setActiveTexts(prev => prev.filter(t => t.id !== id));
        }, 2500);
    };

    // Expose the function globally for easy access
    useEffect(() => {
        window.showFloatingCombatText = addFloatingText;

        return () => {
            delete window.showFloatingCombatText;
        };
    }, []);

    return (
        <>
            {activeTexts.map(textData => (
                <FloatingCombatText
                    key={textData.id}
                    text={textData.text}
                    type={textData.type}
                    position={textData.position}
                    onComplete={() => {
                        setActiveTexts(prev => prev.filter(t => t.id !== textData.id));
                    }}
                />
            ))}
        </>
    );
};

export default FloatingCombatText;
